import { describe, expect, it } from "vitest";

import { isKiroContextCommand, parseKiroContextUsageText } from "./KiroContextUsage.ts";

describe("KiroContextUsage", () => {
  it("recognizes explicit context slash commands", () => {
    expect(isKiroContextCommand(" /context ")).toBe(true);
    expect(isKiroContextCommand("/CONTEXT")).toBe(true);
    expect(isKiroContextCommand("/context please")).toBe(false);
    expect(isKiroContextCommand("show context")).toBe(false);
  });

  it("parses Kiro percentage-only context output", () => {
    expect(parseKiroContextUsageText("Context breakdown - 5% used")).toMatchObject({
      usedTokens: 0,
      usedPercentage: 5,
      compactsAutomatically: false,
    });
  });

  it("parses non-interactive chat context output with terminal controls", () => {
    expect(
      parseKiroContextUsageText(
        "\u001b[m\nContext window: 1.8% used (estimated)\n\u001b[m█ Tools \u001b[m1.2% (estimated)",
      ),
    ).toMatchObject({
      usedTokens: 0,
      usedPercentage: 1.8,
      compactsAutomatically: false,
    });
  });

  it("parses context token pairs when Kiro includes counts", () => {
    expect(parseKiroContextUsageText("Context breakdown - 12.5k / 200k tokens used")).toMatchObject(
      {
        usedTokens: 12_500,
        maxTokens: 200_000,
        usedPercentage: 6.25,
      },
    );
  });

  it("ignores unrelated text", () => {
    expect(parseKiroContextUsageText("5% used")).toBeUndefined();
    expect(parseKiroContextUsageText("Context is available")).toBeUndefined();
  });
});
