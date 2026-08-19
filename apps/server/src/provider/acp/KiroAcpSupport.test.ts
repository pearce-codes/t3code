import { describe, expect, it } from "@effect/vitest";

import {
  buildKiroAcpSpawnInput,
  KIRO_ACP_PROTOCOL_VERSION,
  selectKiroPermissionOptionId,
} from "./KiroAcpSupport.ts";

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

describe("Kiro ACP compatibility", () => {
  it("uses Kiro's date-based protocol version", () => {
    expect(KIRO_ACP_PROTOCOL_VERSION).toBe("2025-08-22");
  });

  it("returns the permission option IDs advertised by Kiro", () => {
    const request = {
      sessionId: "session-1",
      toolCall: { toolCallId: "tool-1", title: "Edit file", status: "pending" },
      options: [
        { optionId: "kiro-allow-once", name: "Allow", kind: "allow_once" },
        { optionId: "kiro-allow-session", name: "Always allow", kind: "allow_always" },
        { optionId: "kiro-deny", name: "Deny", kind: "reject_once" },
      ],
    } as const;

    expect(selectKiroPermissionOptionId(request, "accept")).toBe("kiro-allow-once");
    expect(selectKiroPermissionOptionId(request, "acceptForSession")).toBe("kiro-allow-session");
    expect(selectKiroPermissionOptionId(request, "decline")).toBe("kiro-deny");
  });

  it("falls back to another compatible permission scope", () => {
    const request = {
      sessionId: "session-1",
      toolCall: { toolCallId: "tool-1", title: "Read file", status: "pending" },
      options: [{ optionId: "only-allow", name: "Allow", kind: "allow_once" }],
    } as const;

    expect(selectKiroPermissionOptionId(request, "acceptForSession")).toBe("only-allow");
    expect(selectKiroPermissionOptionId(request, "decline")).toBeUndefined();
  });
});
