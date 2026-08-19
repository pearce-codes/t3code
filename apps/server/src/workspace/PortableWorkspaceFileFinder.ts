// @effect-diagnostics nodeBuiltinImport:off - compatibility fallback at the Node filesystem boundary.
import * as NodeFS from "node:fs";
import * as NodeFSP from "node:fs/promises";
import * as NodePath from "node:path";

import type {
  DirItem,
  DirSearchResult,
  FileItem,
  GrepCursor,
  GrepMatch,
  GrepOptions,
  GrepResult,
  MixedItem,
  MixedSearchResult,
  Result,
  SearchOptions,
  SearchResult,
} from "@ff-labs/fff-node";
import { normalizeSearchQuery, scoreQueryMatch } from "@t3tools/shared/searchRanking";

const DEFAULT_PAGE_SIZE = 100;
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_INDEXED_ENTRIES = 25_002;
const IGNORED_DIRECTORIES = new Set([".git", ".t3", "node_modules"]);

type PortableEntry = {
  readonly path: string;
  readonly kind: "directory" | "file";
  readonly size: number;
  readonly modified: number;
};

function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

function fileName(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1);
}

function toFileItem(entry: PortableEntry): FileItem {
  return {
    relativePath: entry.path,
    fileName: fileName(entry.path),
    size: entry.size,
    modified: entry.modified,
    accessFrecencyScore: 0,
    modificationFrecencyScore: 0,
    totalFrecencyScore: 0,
    gitStatus: "clean",
  };
}

function toDirItem(entry: PortableEntry): DirItem {
  return {
    relativePath: `${entry.path}/`,
    dirName: `${fileName(entry.path)}/`,
    maxAccessFrecency: 0,
  };
}

function rankEntries(entries: readonly PortableEntry[], query: string): PortableEntry[] {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery)
    return entries.toSorted((left, right) => left.path.localeCompare(right.path));

  return entries
    .flatMap((entry) => {
      const score = scoreQueryMatch({
        value: entry.path.toLowerCase(),
        query: normalizedQuery,
        exactBase: 0,
        prefixBase: 100,
        boundaryBase: 200,
        includesBase: 300,
        fuzzyBase: 400,
      });
      return score === null ? [] : [{ entry, score }];
    })
    .toSorted(
      (left, right) => left.score - right.score || left.entry.path.localeCompare(right.entry.path),
    )
    .map(({ entry }) => entry);
}

function paginate<T>(items: readonly T[], options?: SearchOptions): T[] {
  const pageSize = options?.pageSize ?? DEFAULT_PAGE_SIZE;
  const pageIndex = options?.pageIndex ?? 0;
  return items.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
}

function byteOffset(line: string, stringIndex: number): number {
  return Buffer.byteLength(line.slice(0, stringIndex));
}

function literalRanges(
  line: string,
  query: string,
  caseSensitive: boolean,
): Array<[number, number]> {
  if (!query) return [];
  const haystack = caseSensitive ? line : line.toLowerCase();
  const needle = caseSensitive ? query : query.toLowerCase();
  const ranges: Array<[number, number]> = [];
  let offset = 0;
  while (offset <= haystack.length - needle.length) {
    const start = haystack.indexOf(needle, offset);
    if (start === -1) break;
    ranges.push([byteOffset(line, start), byteOffset(line, start + query.length)]);
    offset = start + Math.max(1, query.length);
  }
  return ranges;
}

function regexRanges(line: string, regex: RegExp): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  regex.lastIndex = 0;
  for (let match = regex.exec(line); match; match = regex.exec(line)) {
    ranges.push([byteOffset(line, match.index), byteOffset(line, match.index + match[0].length)]);
    if (match[0].length === 0) regex.lastIndex += 1;
  }
  return ranges;
}

export type PortableWorkspaceFileFinder = {
  readonly destroy: () => void;
  readonly directorySearch: (query: string, options?: SearchOptions) => Result<DirSearchResult>;
  readonly fileSearch: (query: string, options?: SearchOptions) => Result<SearchResult>;
  readonly grep: (query: string, options?: GrepOptions) => Result<GrepResult>;
  readonly mixedSearch: (query: string, options?: SearchOptions) => Result<MixedSearchResult>;
  readonly scanFiles: () => Result<void>;
  readonly waitForIndexReady: (timeoutMs?: number) => Promise<Result<boolean>>;
};

export async function createPortableWorkspaceFileFinder(
  cwd: string,
): Promise<PortableWorkspaceFileFinder> {
  let entries: PortableEntry[] = [];
  let scanPromise: Promise<void> | undefined;

  const scan = async () => {
    const nextEntries: PortableEntry[] = [];
    const pending = [cwd];
    while (pending.length > 0 && nextEntries.length < MAX_INDEXED_ENTRIES) {
      const directory = pending.pop();
      if (!directory) break;
      let dirents;
      try {
        dirents = await NodeFSP.readdir(directory, { withFileTypes: true });
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === "EACCES" || code === "ENOENT" || code === "EPERM") continue;
        throw error;
      }
      for (const dirent of dirents) {
        if (nextEntries.length >= MAX_INDEXED_ENTRIES) break;
        if (dirent.isSymbolicLink()) continue;
        const absolutePath = NodePath.join(directory, dirent.name);
        const relativePath = NodePath.relative(cwd, absolutePath).replaceAll(NodePath.sep, "/");
        if (dirent.isDirectory()) {
          if (IGNORED_DIRECTORIES.has(dirent.name)) continue;
          nextEntries.push({ path: relativePath, kind: "directory", size: 0, modified: 0 });
          pending.push(absolutePath);
        } else if (dirent.isFile()) {
          const stat = await NodeFSP.stat(absolutePath);
          nextEntries.push({
            path: relativePath,
            kind: "file",
            size: stat.size,
            modified: stat.mtimeMs / 1_000,
          });
        }
      }
    }
    entries = nextEntries;
  };

  const startScan = () => {
    scanPromise = scan();
    void scanPromise.catch(() => undefined);
  };
  startScan();

  return {
    destroy: () => undefined,
    waitForIndexReady: async () => {
      try {
        await scanPromise;
        return ok(true);
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) };
      }
    },
    scanFiles: () => {
      startScan();
      return ok(undefined);
    },
    fileSearch: (query, options) => {
      const allItems = rankEntries(
        entries.filter((entry) => entry.kind === "file"),
        query,
      );
      return ok({
        items: paginate(allItems, options).map(toFileItem),
        scores: [],
        totalMatched: allItems.length,
        totalFiles: entries.filter((entry) => entry.kind === "file").length,
      });
    },
    directorySearch: (query, options) => {
      const allItems = rankEntries(
        entries.filter((entry) => entry.kind === "directory"),
        query,
      );
      return ok({
        items: paginate(allItems, options).map(toDirItem),
        scores: [],
        totalMatched: allItems.length,
        totalDirs: entries.filter((entry) => entry.kind === "directory").length,
      });
    },
    mixedSearch: (query, options) => {
      const allItems = rankEntries(entries, query);
      const items: MixedItem[] = paginate(allItems, options).map((entry) =>
        entry.kind === "file"
          ? { type: "file", item: toFileItem(entry) }
          : { type: "directory", item: toDirItem(entry) },
      );
      return ok({
        items,
        scores: [],
        totalMatched: allItems.length,
        totalFiles: entries.filter((entry) => entry.kind === "file").length,
        totalDirs: entries.filter((entry) => entry.kind === "directory").length,
      });
    },
    grep: (query, options) => {
      const files = entries.filter(
        (entry) =>
          entry.kind === "file" && entry.size <= (options?.maxFileSize ?? DEFAULT_MAX_FILE_SIZE),
      );
      const startIndex = options?.cursor?._offset ?? 0;
      const pageSize = options?.pageSize ?? 50;
      const maxMatchesPerFile = options?.maxMatchesPerFile ?? 200;
      const deadline = performance.now() + (options?.timeBudgetMs ?? 0);
      const caseInsensitiveRegex = query.startsWith("(?i)");
      const regexQuery = caseInsensitiveRegex ? query.slice(4) : query;
      let regex: RegExp | undefined;
      let regexFallbackError: string | undefined;
      if (options?.mode === "regex") {
        try {
          regex = new RegExp(regexQuery, caseInsensitiveRegex ? "giu" : "gu");
        } catch (error) {
          regexFallbackError = error instanceof Error ? error.message : String(error);
        }
      }

      const matches: GrepMatch[] = [];
      let fileIndex = startIndex;
      let searched = 0;
      for (; fileIndex < files.length && matches.length < pageSize; fileIndex += 1) {
        if ((options?.timeBudgetMs ?? 0) > 0 && performance.now() >= deadline) break;
        const entry = files[fileIndex];
        if (!entry) continue;
        let contents: string;
        try {
          const buffer = NodeFS.readFileSync(NodePath.join(cwd, entry.path));
          if (buffer.includes(0)) continue;
          contents = buffer.toString("utf8");
        } catch {
          continue;
        }
        searched += 1;
        let absoluteByteOffset = 0;
        let matchesInFile = 0;
        for (const [lineIndex, lineContent] of contents.split(/\r?\n/).entries()) {
          const ranges = regex
            ? regexRanges(lineContent, regex)
            : literalRanges(
                lineContent,
                regexFallbackError ? regexQuery : query,
                !(options?.smartCase ?? true),
              );
          if (ranges.length > 0) {
            matches.push({
              relativePath: entry.path,
              fileName: fileName(entry.path),
              gitStatus: "clean",
              size: entry.size,
              modified: entry.modified,
              isBinary: false,
              totalFrecencyScore: 0,
              accessFrecencyScore: 0,
              modificationFrecencyScore: 0,
              lineNumber: lineIndex + 1,
              col: ranges[0]?.[0] ?? 0,
              byteOffset: absoluteByteOffset,
              lineContent,
              matchRanges: ranges,
            });
            matchesInFile += 1;
          }
          absoluteByteOffset += Buffer.byteLength(lineContent) + 1;
          if (matches.length >= pageSize || matchesInFile >= maxMatchesPerFile) break;
        }
      }
      const nextCursor =
        fileIndex < files.length
          ? ({ __brand: "GrepCursor", _offset: fileIndex } as GrepCursor)
          : null;
      return ok({
        items: matches,
        totalMatched: matches.length,
        totalFilesSearched: searched,
        totalFiles: files.length,
        filteredFileCount: files.length,
        nextCursor,
        ...(regexFallbackError ? { regexFallbackError } : {}),
      });
    },
  };
}
