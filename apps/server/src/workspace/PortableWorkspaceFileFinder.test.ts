// @effect-diagnostics nodeBuiltinImport:off - test fixtures use a disposable filesystem tree.
import * as NodeFSP from "node:fs/promises";
import * as NodeOS from "node:os";
import * as NodePath from "node:path";

import { afterEach, expect, it } from "vite-plus/test";

import { createPortableWorkspaceFileFinder } from "./PortableWorkspaceFileFinder.ts";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => NodeFSP.rm(directory, { recursive: true, force: true })),
  );
});

it("indexes paths and searches contents without native libraries", async () => {
  const cwd = await NodeFSP.mkdtemp(NodePath.join(NodeOS.tmpdir(), "t3-portable-search-"));
  temporaryDirectories.push(cwd);
  await NodeFSP.mkdir(NodePath.join(cwd, "src"));
  await NodeFSP.writeFile(NodePath.join(cwd, "src", "server.ts"), "const AmberSignal = true;\n");
  await NodeFSP.writeFile(NodePath.join(cwd, "README.md"), "portable server\n");

  const finder = await createPortableWorkspaceFileFinder(cwd);
  await expect(finder.waitForIndexReady()).resolves.toEqual({ ok: true, value: true });

  const paths = finder.mixedSearch("srv", { pageSize: 10 });
  expect(paths.ok && paths.value.items).toEqual([
    expect.objectContaining({
      type: "file",
      item: expect.objectContaining({ relativePath: "src/server.ts" }),
    }),
  ]);

  const contents = finder.grep("amber", { smartCase: true, pageSize: 10 });
  expect(contents.ok && contents.value.items).toEqual([
    expect.objectContaining({
      relativePath: "src/server.ts",
      lineNumber: 1,
      lineContent: "const AmberSignal = true;",
      matchRanges: [[6, 11]],
    }),
  ]);
});
