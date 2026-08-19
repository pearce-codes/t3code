import { describe, expect, it } from "vite-plus/test";
import * as Schema from "effect/Schema";

import { ProviderInstanceId, ThreadId } from "./index.ts";
import { SessionTransferArchive } from "./sessionTransfer.ts";

const decodeSessionTransferArchive = Schema.decodeUnknownPromise(SessionTransferArchive);

const archive = {
  format: "t3-session",
  version: 1,
  exportedAt: "2026-08-15T12:00:00.000Z",
  source: { app: "Pearce Codes", version: "0.1.0" },
  project: {
    title: "Pearce Codes",
    workspaceRoot: "/work/pearce-codes",
    defaultModelSelection: null,
  },
  thread: {
    sourceThreadId: ThreadId.make("source-thread"),
    title: "Portable session",
    modelSelection: { instanceId: ProviderInstanceId.make("codex"), model: "gpt-5.4" },
    runtimeMode: "full-access",
    interactionMode: "default",
    branch: "main",
    worktreePath: null,
    createdAt: "2026-08-15T11:00:00.000Z",
    updatedAt: "2026-08-15T12:00:00.000Z",
    messages: [
      {
        role: "user",
        text: "Ship it",
        createdAt: "2026-08-15T11:00:00.000Z",
        updatedAt: "2026-08-15T11:00:00.000Z",
      },
    ],
  },
  providerBinding: null,
} as const;

describe("SessionTransferArchive", () => {
  it("decodes the versioned portable format", async () => {
    await expect(decodeSessionTransferArchive(archive)).resolves.toMatchObject({
      format: "t3-session",
      version: 1,
      thread: { title: "Portable session" },
    });
  });

  it("rejects archives from an unsupported version", async () => {
    await expect(decodeSessionTransferArchive({ ...archive, version: 2 })).rejects.toBeDefined();
  });
});
