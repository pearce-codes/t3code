import * as Schema from "effect/Schema";

import { IsoDateTime, ProjectId, ThreadId, TrimmedNonEmptyString } from "./baseSchemas.ts";
import { ModelSelection, ProviderInteractionMode, RuntimeMode } from "./orchestration.ts";
import { ProviderDriverKind, ProviderInstanceId } from "./providerInstance.ts";

export const SESSION_TRANSFER_FORMAT = "t3-session" as const;
export const SESSION_TRANSFER_VERSION = 1 as const;

const SessionTransferMessage = Schema.Struct({
  role: Schema.Literals(["user", "assistant", "system"]),
  text: Schema.String,
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime,
});
export type SessionTransferMessage = typeof SessionTransferMessage.Type;

const SessionTransferProviderBinding = Schema.Struct({
  provider: ProviderDriverKind,
  providerInstanceId: ProviderInstanceId,
  adapterKey: Schema.optional(TrimmedNonEmptyString),
  runtimeMode: RuntimeMode,
  resumeCursor: Schema.NullOr(Schema.Unknown),
});
export type SessionTransferProviderBinding = typeof SessionTransferProviderBinding.Type;

export const SessionTransferArchive = Schema.Struct({
  format: Schema.Literal(SESSION_TRANSFER_FORMAT),
  version: Schema.Literal(SESSION_TRANSFER_VERSION),
  exportedAt: IsoDateTime,
  source: Schema.Struct({
    app: TrimmedNonEmptyString,
    version: TrimmedNonEmptyString,
  }),
  project: Schema.Struct({
    title: TrimmedNonEmptyString,
    workspaceRoot: TrimmedNonEmptyString,
    defaultModelSelection: Schema.NullOr(ModelSelection),
  }),
  thread: Schema.Struct({
    sourceThreadId: ThreadId,
    title: TrimmedNonEmptyString,
    modelSelection: ModelSelection,
    runtimeMode: RuntimeMode,
    interactionMode: ProviderInteractionMode,
    branch: Schema.NullOr(TrimmedNonEmptyString),
    worktreePath: Schema.NullOr(TrimmedNonEmptyString),
    createdAt: IsoDateTime,
    updatedAt: IsoDateTime,
    messages: Schema.Array(SessionTransferMessage).check(Schema.isMaxLength(20_000)),
  }),
  providerBinding: Schema.NullOr(SessionTransferProviderBinding),
});
export type SessionTransferArchive = typeof SessionTransferArchive.Type;

export const SessionTransferImportResult = Schema.Struct({
  projectId: ProjectId,
  threadId: ThreadId,
  providerResumePreserved: Schema.Boolean,
});
export type SessionTransferImportResult = typeof SessionTransferImportResult.Type;
