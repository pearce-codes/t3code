import { describe, expect, it } from "vitest";

import { buildKiroAcpSpawnInput } from "./KiroAcpSupport.ts";

describe("buildKiroAcpSpawnInput", () => {
  it("builds the default Kiro ACP command", () => {
    expect(
      buildKiroAcpSpawnInput({
        kiroSettings: undefined,
        cwd: "/tmp/project",
      }),
    ).toEqual({
      command: "kiro-cli",
      args: ["acp"],
      cwd: "/tmp/project",
    });
  });

  it("passes configured agent and model arguments", () => {
    expect(
      buildKiroAcpSpawnInput({
        kiroSettings: {
          binaryPath: "/usr/local/bin/kiro-cli",
          agentName: "build",
        },
        cwd: "/tmp/project",
        modelSelection: {
          model: "claude-sonnet-4-6",
          options: [{ id: "agent", value: "review" }],
        },
      }),
    ).toEqual({
      command: "/usr/local/bin/kiro-cli",
      args: ["acp", "--agent", "review", "--model", "claude-sonnet-4-6"],
      cwd: "/tmp/project",
    });
  });

  it("omits the model argument for auto model selection", () => {
    expect(
      buildKiroAcpSpawnInput({
        kiroSettings: {
          binaryPath: "kiro-cli",
          agentName: "build",
        },
        cwd: "/tmp/project",
        modelSelection: { model: "auto" },
      }).args,
    ).toEqual(["acp", "--agent", "build"]);
  });
});
