import {
  exportEnvironmentSession,
  importEnvironmentSession,
} from "@t3tools/client-runtime/state/session-transfer";
import {
  type EnvironmentId,
  SessionTransferArchive,
  type SessionTransferImportResult,
  type ThreadId,
} from "@t3tools/contracts";
import * as Schema from "effect/Schema";

import { runtime } from "./lib/runtime";
import { readPreparedConnection } from "./state/session";

const decodeSessionTransferArchive = Schema.decodeUnknownPromise(SessionTransferArchive);

function preparedConnection(environmentId: EnvironmentId) {
  const prepared = readPreparedConnection(environmentId);
  if (prepared === null) throw new Error("The selected environment is not connected.");
  return prepared;
}

function safeFileName(value: string): string {
  return (
    value
      .trim()
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "session"
  );
}

export async function downloadSessionArchive(input: {
  readonly environmentId: EnvironmentId;
  readonly threadId: ThreadId;
  readonly title: string;
}): Promise<void> {
  const archive = await runtime.runPromise(
    exportEnvironmentSession({
      prepared: preparedConnection(input.environmentId),
      threadId: input.threadId,
    }),
  );
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${safeFileName(input.title)}.t3-session.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function importSessionArchive(input: {
  readonly environmentId: EnvironmentId;
  readonly file: File;
}): Promise<SessionTransferImportResult> {
  const archive = await decodeSessionTransferArchive(JSON.parse(await input.file.text()));
  return runtime.runPromise(
    importEnvironmentSession({
      prepared: preparedConnection(input.environmentId),
      archive,
    }),
  );
}
