import { describe, expect, it } from "@effect/vitest";

import { parseKiroAgentListOutput } from "./KiroAgentDiscovery.ts";

describe("KiroAgentDiscovery", () => {
  it("parses built-in, global, and workspace agents from ANSI table output", () => {
    const output = [
      "\u001b[38;5;244mWorkspace: \u001b[0m/workspace/.kiro/agents",
      "\u001b[38;5;244mGlobal:    \u001b[0m~/.kiro/agents",
      "",
      "* kiro_default                 \u001b[38;5;244m(Built-in)\u001b[0m    Default agent",
      "  amzn-builder                 Global        Builder agent",
      "                                 wrapped description text",
      "  project-review               Workspace     Local review agent",
    ].join("\n");

    expect(parseKiroAgentListOutput(output)).toEqual([
      { name: "kiro_default", isDefault: true },
      { name: "amzn-builder", isDefault: false },
      { name: "project-review", isDefault: false },
    ]);
  });

  it("deduplicates repeated agents and retains the default marker", () => {
    expect(
      parseKiroAgentListOutput(
        [
          "  shared-agent                 Global        Global copy",
          "* shared-agent                 Workspace     Workspace default",
          "  kiro_help                    (Built-in)    Help agent",
        ].join("\n"),
      ),
    ).toEqual([
      { name: "shared-agent", isDefault: true },
      { name: "kiro_help", isDefault: false },
    ]);
  });
});
