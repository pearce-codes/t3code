import type { ThreadTokenUsageSnapshot } from "@t3tools/contracts";

const TOKEN_PAIR_PATTERN =
  /(\d[\d,]*(?:\.\d+)?)\s*([kKmM])?\s*(?:\/|of)\s*(\d[\d,]*(?:\.\d+)?)\s*([kKmM])?\s*(?:tokens?|context)?/i;
const USED_PERCENT_PATTERN = /(\d+(?:\.\d+)?)\s*%\s*(?:used|context used)?/i;
const ANSI_ESCAPE_PATTERN =
  // eslint-disable-next-line no-control-regex
  /\u001b(?:\][^\u0007]*(?:\u0007|\u001b\\)|\[[0-?]*[ -/]*[@-~]|[@-Z\\-_])/g;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

function parseTokenCount(value: string, suffix: string | undefined): number | undefined {
  const parsed = Number(value.replace(/,/g, ""));
  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  const multiplier =
    suffix?.toLowerCase() === "m" ? 1_000_000 : suffix?.toLowerCase() === "k" ? 1_000 : 1;
  return Math.round(parsed * multiplier);
}

function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function parseUsedPercentage(text: string): number | undefined {
  const match = USED_PERCENT_PATTERN.exec(text);
  if (!match?.[1]) {
    return undefined;
  }
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? clampPercentage(parsed) : undefined;
}

function stripTerminalControlSequences(text: string): string {
  return text.replace(ANSI_ESCAPE_PATTERN, "").replace(CONTROL_CHARACTER_PATTERN, "");
}

export function isKiroContextCommand(input: string | null | undefined): boolean {
  return input?.trim().toLowerCase() === "/context";
}

export function parseKiroContextUsageText(
  text: string | null | undefined,
): ThreadTokenUsageSnapshot | undefined {
  const normalized = text ? stripTerminalControlSequences(text).replace(/\s+/g, " ").trim() : "";
  if (!normalized || !/\bcontext\b/i.test(normalized)) {
    return undefined;
  }

  const pair = TOKEN_PAIR_PATTERN.exec(normalized);
  if (pair?.[1] && pair[3]) {
    const usedTokens = parseTokenCount(pair[1], pair[2]);
    const maxTokens = parseTokenCount(pair[3], pair[4]);
    if (usedTokens !== undefined && maxTokens !== undefined && maxTokens > 0) {
      return {
        usedTokens,
        maxTokens,
        usedPercentage: clampPercentage((usedTokens / maxTokens) * 100),
        compactsAutomatically: false,
      };
    }
  }

  const usedPercentage = parseUsedPercentage(normalized);
  if (usedPercentage === undefined) {
    return undefined;
  }

  return {
    usedTokens: 0,
    usedPercentage,
    compactsAutomatically: false,
  };
}
