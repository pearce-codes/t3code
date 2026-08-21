/**
 * KiroAdapterLive - Kiro CLI (`kiro-cli acp`) via ACP.
 *
 * @module KiroAdapterLive
 */

import {
  ApprovalRequestId,
  EventId,
  type KiroSettings,
  type ProviderApprovalDecision,
  ProviderDriverKind,
  ProviderInstanceId,
  type ProviderInteractionMode,
  type ProviderOptionSelection,
  type ProviderRuntimeEvent,
  type ProviderSession,
  type ServerProviderSlashCommand,
  type ThreadTokenUsageSnapshot,
  type ProviderUserInputAnswers,
  RuntimeRequestId,
  RuntimeTaskId,
  type RuntimeMode,
  type ThreadId,
  TurnId,
} from "@t3tools/contracts";
import * as Crypto from "effect/Crypto";
import * as DateTime from "effect/DateTime";
import * as Deferred from "effect/Deferred";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Fiber from "effect/Fiber";
import * as FileSystem from "effect/FileSystem";
import * as Option from "effect/Option";
import * as Path from "effect/Path";
import * as PubSub from "effect/PubSub";
import * as Schema from "effect/Schema";
import * as Scope from "effect/Scope";
import * as Semaphore from "effect/Semaphore";
import * as Stream from "effect/Stream";
import * as SynchronizedRef from "effect/SynchronizedRef";
import { ChildProcessSpawner } from "effect/unstable/process";
import * as EffectAcpErrors from "effect-acp/errors";
import type * as EffectAcpSchema from "effect-acp/schema";

import { resolveAttachmentPath } from "../../attachmentStore.ts";
import { ServerConfig } from "../../config.ts";
import {
  ProviderAdapterProcessError,
  ProviderAdapterRequestError,
  ProviderAdapterSessionNotFoundError,
  ProviderAdapterValidationError,
} from "../Errors.ts";
import { acpPermissionOutcome, mapAcpToAdapterError } from "../acp/AcpAdapterSupport.ts";
import {
  makeAcpAssistantItemEvent,
  makeAcpContentDeltaEvent,
  makeAcpPlanUpdatedEvent,
  makeAcpRequestOpenedEvent,
  makeAcpRequestResolvedEvent,
  makeAcpTokenUsageUpdatedEvent,
  makeAcpToolCallEvent,
} from "../acp/AcpCoreRuntimeEvents.ts";
import { makeAcpNativeLoggerFactory } from "../acp/AcpNativeLogging.ts";
import {
  type AcpSessionMode,
  type AcpSessionModeState,
  parsePermissionRequest,
} from "../acp/AcpRuntimeModel.ts";
import type * as AcpSessionRuntime from "../acp/AcpSessionRuntime.ts";
import {
  applyKiroAcpModelSelection,
  canApplyKiroEffortToRunningSession,
  makeKiroAcpRuntime,
  selectedKiroEffort,
} from "../acp/KiroAcpSupport.ts";
import { type KiroAdapterShape } from "../Services/KiroAdapter.ts";
import { type EventNdjsonLogger, makeEventNdjsonLogger } from "./EventNdjsonLogger.ts";
import { kiroSlashCommandsFromAcp, resolveKiroAcpBaseModelId } from "./KiroProvider.ts";

const encodeUnknownJsonStringExit = Schema.encodeUnknownExit(Schema.fromJsonString(Schema.Unknown));

const PROVIDER = ProviderDriverKind.make("kiro");
const KIRO_RESUME_VERSION = 1 as const;
const ACP_PLAN_MODE_ALIASES = ["plan", "architect"];
const ACP_IMPLEMENT_MODE_ALIASES = ["code", "agent", "default", "chat", "implement"];
const ACP_APPROVAL_MODE_ALIASES = ["ask"];
const KIRO_SUBAGENT_LIST_METHOD = "_kiro.dev/subagent/list_update";
const KIRO_SUBAGENT_ACTIVITY_METHOD = "_kiro.dev/session/update";
const KIRO_NATIVE_RUNNING_STATUSES = new Set([
  "",
  "working",
  "running",
  "pending",
  "queued",
  "in_progress",
  "waiting",
  "paused",
  "idle",
]);
const KIRO_NATIVE_TERMINAL_STATUSES = new Set([
  "completed",
  "succeeded",
  "done",
  "terminated",
  "failed",
  "error",
  "stopped",
  "cancelled",
  "canceled",
  "interrupted",
]);

const NullableString = Schema.Union([Schema.String, Schema.Null]);
const KiroNativeSubagentStatus = Schema.Struct({
  type: Schema.optionalKey(NullableString),
  message: Schema.optionalKey(NullableString),
});
const KiroNativeSubagent = Schema.Struct({
  sessionId: Schema.String,
  sessionName: Schema.optionalKey(NullableString),
  role: Schema.optionalKey(NullableString),
  agentName: Schema.optionalKey(NullableString),
  initialQuery: Schema.optionalKey(NullableString),
  status: Schema.optionalKey(Schema.Union([KiroNativeSubagentStatus, Schema.Null])),
});
const KiroNativeSubagentListNotification = Schema.Struct({
  subagents: Schema.Array(KiroNativeSubagent),
});
const KiroNativeSubagentActivityNotification = Schema.Struct({
  sessionId: Schema.String,
  update: Schema.Struct({
    sessionUpdate: Schema.String,
    toolCallId: Schema.optionalKey(NullableString),
    title: Schema.optionalKey(NullableString),
    text: Schema.optionalKey(NullableString),
    content: Schema.optionalKey(
      Schema.Union([
        Schema.Struct({
          type: Schema.optionalKey(NullableString),
          text: Schema.optionalKey(NullableString),
          is_thinking: Schema.optionalKey(Schema.Union([Schema.Boolean, Schema.Null])),
        }),
        Schema.Null,
      ]),
    ),
  }),
});

type KiroNativeSubagentRecord = typeof KiroNativeSubagent.Type;

interface KiroNativeSubagentState {
  readonly taskId: RuntimeTaskId;
  readonly sessionId: string;
  description: string;
  role: string | undefined;
  statusType: string;
  statusMessage: string;
  completed: boolean;
}

export type KiroNativeSubagentLifecycleAction =
  | {
      readonly type: "started";
      readonly state: KiroNativeSubagentState;
    }
  | {
      readonly type: "progress";
      readonly state: KiroNativeSubagentState;
      readonly summary: string;
    }
  | {
      readonly type: "completed";
      readonly state: KiroNativeSubagentState;
      readonly status: "completed" | "failed" | "stopped";
      readonly summary?: string;
    };

function encodeJsonStringForDiagnostics(input: unknown): string | undefined {
  const result = encodeUnknownJsonStringExit(input);
  return Exit.isSuccess(result) ? result.value : undefined;
}

export interface KiroAdapterLiveOptions {
  readonly environment?: NodeJS.ProcessEnv;
  readonly nativeEventLogPath?: string;
  readonly nativeEventLogger?: EventNdjsonLogger;
  /**
   * Selections are honored when `modelSelection.instanceId` matches this value.
   * Defaults to the legacy built-in instance id (`kiro`).
   */
  readonly instanceId?: typeof ProviderInstanceId.Type;
  /**
   * Optional per-session settings resolver. Production instances bind settings
   * to the instance scope and leave this undefined. Tests can provide a resolver
   * so a mid-suite binaryPath change takes effect on the next session spawn.
   */
  readonly resolveSettings?: Effect.Effect<KiroSettings>;
  /** Publishes the latest ACP command catalog into this instance's provider snapshot. */
  readonly onSlashCommandsUpdated?: (input: {
    readonly threadId: ThreadId;
    readonly commands: ReadonlyArray<ServerProviderSlashCommand>;
  }) => Effect.Effect<void, never>;
}

interface PendingApproval {
  readonly decision: Deferred.Deferred<ProviderApprovalDecision>;
  readonly kind: string | "unknown";
}

interface PendingUserInput {
  readonly answers: Deferred.Deferred<ProviderUserInputAnswers>;
}

interface KiroSessionContext {
  readonly threadId: ThreadId;
  session: ProviderSession;
  readonly scope: Scope.Closeable;
  readonly acp: AcpSessionRuntime.AcpSessionRuntime["Service"];
  notificationFiber: Fiber.Fiber<void, never> | undefined;
  readonly pendingApprovals: Map<ApprovalRequestId, PendingApproval>;
  readonly pendingUserInputs: Map<ApprovalRequestId, PendingUserInput>;
  readonly turns: Array<{ id: TurnId; items: Array<unknown> }>;
  lastPlanFingerprint: string | undefined;
  activeTurnId: TurnId | undefined;
  // Resolves only after the in-flight turn has emitted terminal task/turn state.
  // steerTurn awaits it before resending because ACP prompts are not serialized.
  activeTurnGate: Deferred.Deferred<void> | undefined;
  lastMaxTokens: number | undefined;
  lastUsedTokens: number | undefined;
  currentEffort: string | undefined;
  readonly nativeSubagents: Map<string, KiroNativeSubagentState>;
  readonly nativeToolOwners: Map<string, string>;
  stopped: boolean;
}

function settlePendingApprovalsAsCancelled(
  pendingApprovals: ReadonlyMap<ApprovalRequestId, PendingApproval>,
): Effect.Effect<void> {
  const pendingEntries = Array.from(pendingApprovals.values());
  return Effect.forEach(
    pendingEntries,
    (pending) => Deferred.succeed(pending.decision, "cancel").pipe(Effect.ignore),
    {
      discard: true,
    },
  );
}

function settlePendingUserInputsAsEmptyAnswers(
  pendingUserInputs: ReadonlyMap<ApprovalRequestId, PendingUserInput>,
): Effect.Effect<void> {
  const pendingEntries = Array.from(pendingUserInputs.values());
  return Effect.forEach(
    pendingEntries,
    (pending) => Deferred.succeed(pending.answers, {}).pipe(Effect.ignore),
    {
      discard: true,
    },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function trimmedNativeText(value: string | null | undefined, maxLength = 2_000): string {
  return value?.trim().slice(0, maxLength) ?? "";
}

function terminalKiroTaskStatus(statusType: string): "completed" | "failed" | "stopped" {
  switch (statusType) {
    case "failed":
    case "error":
      return "failed";
    case "stopped":
    case "cancelled":
    case "canceled":
    case "interrupted":
      return "stopped";
    default:
      return "completed";
  }
}

export function reconcileKiroNativeSubagents(
  states: Map<string, KiroNativeSubagentState>,
  records: ReadonlyArray<KiroNativeSubagentRecord>,
): ReadonlyArray<KiroNativeSubagentLifecycleAction> {
  const actions: Array<KiroNativeSubagentLifecycleAction> = [];
  for (const record of records) {
    const sessionId = trimmedNativeText(record.sessionId);
    if (!sessionId) continue;
    const description =
      trimmedNativeText(record.initialQuery) || trimmedNativeText(record.sessionName);
    const role = trimmedNativeText(record.role) || trimmedNativeText(record.agentName) || undefined;
    const statusType = trimmedNativeText(record.status?.type).toLowerCase();
    const statusMessage = trimmedNativeText(record.status?.message);
    let state = states.get(sessionId);
    if (!state) {
      if (!description) continue;
      state = {
        taskId: RuntimeTaskId.make(`kiro-native:${sessionId}`),
        sessionId,
        description,
        role,
        statusType: "",
        statusMessage: "",
        completed: false,
      };
      states.set(sessionId, state);
      actions.push({ type: "started", state });
    } else {
      if (description) state.description = description;
      if (role) state.role = role;
    }
    if (state.completed) continue;

    if (statusType && KIRO_NATIVE_TERMINAL_STATUSES.has(statusType)) {
      state.statusType = statusType;
      state.statusMessage = statusMessage;
      state.completed = true;
      actions.push({
        type: "completed",
        state,
        status: terminalKiroTaskStatus(statusType),
        ...(statusMessage ? { summary: statusMessage } : {}),
      });
      continue;
    }

    const statusChanged = statusType !== state.statusType || statusMessage !== state.statusMessage;
    state.statusType = statusType;
    state.statusMessage = statusMessage;
    const progressSummary =
      statusMessage ||
      (statusType && !KIRO_NATIVE_RUNNING_STATUSES.has(statusType) ? statusType : "");
    if (statusChanged && progressSummary && progressSummary.toLowerCase() !== "running") {
      actions.push({ type: "progress", state, summary: progressSummary });
    }
  }
  return actions;
}

export function completeOpenKiroNativeSubagents(
  states: ReadonlyMap<string, KiroNativeSubagentState>,
  status: "completed" | "failed" | "stopped",
): ReadonlyArray<KiroNativeSubagentLifecycleAction> {
  const actions: Array<KiroNativeSubagentLifecycleAction> = [];
  for (const state of states.values()) {
    if (state.completed) continue;
    state.completed = true;
    actions.push({
      type: "completed",
      state,
      status,
      summary:
        status === "stopped"
          ? "Kiro subagent stopped with its parent turn."
          : status === "failed"
            ? "Kiro subagent failed with its parent turn."
            : "Kiro subagent turn completed.",
    });
  }
  return actions;
}

export function finalizeKiroNativeTurn<E, R>(input: {
  readonly states: ReadonlyMap<string, KiroNativeSubagentState>;
  readonly status: "completed" | "failed" | "stopped";
  readonly drainEvents: Effect.Effect<void, never>;
  readonly emit: (action: KiroNativeSubagentLifecycleAction) => Effect.Effect<void, E, R>;
  readonly gate: Deferred.Deferred<void>;
  readonly clearGate: () => void;
}): Effect.Effect<void, E, R> {
  return Effect.gen(function* () {
    yield* input.drainEvents;
    for (const action of completeOpenKiroNativeSubagents(input.states, input.status)) {
      yield* input.emit(action);
    }
  }).pipe(
    Effect.ensuring(
      Deferred.succeed(input.gate, undefined).pipe(Effect.andThen(Effect.sync(input.clearGate))),
    ),
  );
}

function parseKiroResume(raw: unknown): { sessionId: string } | undefined {
  if (!isRecord(raw)) return undefined;
  if (raw.schemaVersion !== KIRO_RESUME_VERSION) return undefined;
  if (typeof raw.sessionId !== "string" || !raw.sessionId.trim()) return undefined;
  return { sessionId: raw.sessionId.trim() };
}

function normalizeModeSearchText(mode: AcpSessionMode): string {
  return [mode.id, mode.name, mode.description]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findModeByAliases(
  modes: ReadonlyArray<AcpSessionMode>,
  aliases: ReadonlyArray<string>,
): AcpSessionMode | undefined {
  const normalizedAliases = aliases.map((alias) => alias.toLowerCase());
  for (const alias of normalizedAliases) {
    const exact = modes.find((mode) => {
      const id = mode.id.toLowerCase();
      const name = mode.name.toLowerCase();
      return id === alias || name === alias;
    });
    if (exact) {
      return exact;
    }
  }
  for (const alias of normalizedAliases) {
    const partial = modes.find((mode) => normalizeModeSearchText(mode).includes(alias));
    if (partial) {
      return partial;
    }
  }
  return undefined;
}

function isPlanMode(mode: AcpSessionMode): boolean {
  return findModeByAliases([mode], ACP_PLAN_MODE_ALIASES) !== undefined;
}

function resolveRequestedModeId(input: {
  readonly interactionMode: ProviderInteractionMode | undefined;
  readonly runtimeMode: RuntimeMode;
  readonly modeState: AcpSessionModeState | undefined;
}): string | undefined {
  const modeState = input.modeState;
  if (!modeState) {
    return undefined;
  }

  if (input.interactionMode === "plan") {
    return findModeByAliases(modeState.availableModes, ACP_PLAN_MODE_ALIASES)?.id;
  }

  if (input.runtimeMode === "approval-required") {
    return (
      findModeByAliases(modeState.availableModes, ACP_APPROVAL_MODE_ALIASES)?.id ??
      findModeByAliases(modeState.availableModes, ACP_IMPLEMENT_MODE_ALIASES)?.id ??
      modeState.availableModes.find((mode) => !isPlanMode(mode))?.id ??
      modeState.currentModeId
    );
  }

  return (
    findModeByAliases(modeState.availableModes, ACP_IMPLEMENT_MODE_ALIASES)?.id ??
    findModeByAliases(modeState.availableModes, ACP_APPROVAL_MODE_ALIASES)?.id ??
    modeState.availableModes.find((mode) => !isPlanMode(mode))?.id ??
    modeState.currentModeId
  );
}

function applyRequestedSessionConfiguration<E>(input: {
  readonly runtime: AcpSessionRuntime.AcpSessionRuntime["Service"];
  readonly runtimeMode: RuntimeMode;
  readonly interactionMode: ProviderInteractionMode | undefined;
  readonly modelSelection:
    | {
        readonly model: string;
        readonly options?: ReadonlyArray<ProviderOptionSelection> | null | undefined;
      }
    | undefined;
  readonly mapError: (context: {
    readonly cause: import("effect-acp/errors").AcpError;
    readonly method: "session/set_config_option" | "session/set_mode";
  }) => E;
}): Effect.Effect<void, E> {
  return Effect.gen(function* () {
    if (input.modelSelection) {
      yield* applyKiroAcpModelSelection({
        runtime: input.runtime,
        model: input.modelSelection.model,
        selections: input.modelSelection.options,
        mapError: ({ cause }) =>
          input.mapError({
            cause,
            method: "session/set_config_option",
          }),
      });
    }

    const requestedModeId = resolveRequestedModeId({
      interactionMode: input.interactionMode,
      runtimeMode: input.runtimeMode,
      modeState: yield* input.runtime.getModeState,
    });
    if (!requestedModeId) {
      return;
    }

    void requestedModeId;
  });
}

function selectAutoApprovedPermissionOption(
  request: EffectAcpSchema.RequestPermissionRequest,
): string | undefined {
  const allowAlwaysOption = request.options.find((option) => option.kind === "allow_always");
  if (typeof allowAlwaysOption?.optionId === "string" && allowAlwaysOption.optionId.trim()) {
    return allowAlwaysOption.optionId.trim();
  }

  const allowOnceOption = request.options.find((option) => option.kind === "allow_once");
  if (typeof allowOnceOption?.optionId === "string" && allowOnceOption.optionId.trim()) {
    return allowOnceOption.optionId.trim();
  }

  return undefined;
}

function nonNegativeTokenCount(value: number | null | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.trunc(value))
    : undefined;
}

export function threadTokenUsageFromAcpPromptUsage(
  usage: EffectAcpSchema.Usage | null | undefined,
  maxTokens?: number,
  activeUsedTokens?: number,
): ThreadTokenUsageSnapshot | undefined {
  if (!usage) return undefined;
  const totalProcessedTokens = nonNegativeTokenCount(usage.totalTokens) ?? 0;
  const usedTokens = nonNegativeTokenCount(activeUsedTokens) ?? totalProcessedTokens;
  const inputTokens = nonNegativeTokenCount(usage.inputTokens) ?? 0;
  const outputTokens = nonNegativeTokenCount(usage.outputTokens) ?? 0;
  const cachedInputTokens = nonNegativeTokenCount(usage.cachedReadTokens);
  const reasoningOutputTokens = nonNegativeTokenCount(usage.thoughtTokens);
  return {
    usedTokens,
    totalProcessedTokens,
    ...(maxTokens && maxTokens > 0 ? { maxTokens } : {}),
    inputTokens,
    outputTokens,
    ...(cachedInputTokens !== undefined ? { cachedInputTokens } : {}),
    ...(reasoningOutputTokens !== undefined ? { reasoningOutputTokens } : {}),
  };
}

export function makeKiroAdapter(kiroSettings: KiroSettings, options?: KiroAdapterLiveOptions) {
  return Effect.gen(function* () {
    const boundInstanceId = options?.instanceId ?? ProviderInstanceId.make("kiro");
    const fileSystem = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const childProcessSpawner = yield* ChildProcessSpawner.ChildProcessSpawner;
    const serverConfig = yield* Effect.service(ServerConfig);
    const crypto = yield* Crypto.Crypto;
    const nativeEventLogger =
      options?.nativeEventLogger ??
      (options?.nativeEventLogPath !== undefined
        ? yield* makeEventNdjsonLogger(options.nativeEventLogPath, {
            stream: "native",
          })
        : undefined);
    const managedNativeEventLogger =
      options?.nativeEventLogger === undefined ? nativeEventLogger : undefined;
    const makeAcpNativeLoggers = yield* makeAcpNativeLoggerFactory();

    const sessions = new Map<ThreadId, KiroSessionContext>();
    const threadLocksRef = yield* SynchronizedRef.make(new Map<string, Semaphore.Semaphore>());
    const runtimeEventPubSub = yield* PubSub.unbounded<ProviderRuntimeEvent>();

    const nowIso = Effect.map(DateTime.now, DateTime.formatIso);
    const randomUUIDv4 = crypto.randomUUIDv4.pipe(
      Effect.mapError(
        (cause) =>
          new ProviderAdapterRequestError({
            provider: PROVIDER,
            method: "crypto/randomUUIDv4",
            detail: "Failed to generate Kiro runtime identifier.",
            cause,
          }),
      ),
    );
    const nextEventId = Effect.map(randomUUIDv4, (id) => EventId.make(id));
    const makeEventStamp = () => Effect.all({ eventId: nextEventId, createdAt: nowIso });
    const mapAcpCallbackFailure = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
      effect.pipe(
        Effect.mapError(
          (cause) =>
            new EffectAcpErrors.AcpTransportError({
              detail: "Failed to process Kiro ACP callback.",
              cause,
            }),
        ),
      );

    const offerRuntimeEvent = (event: ProviderRuntimeEvent) =>
      PubSub.publish(runtimeEventPubSub, event).pipe(Effect.asVoid);

    const nativeTaskLinkage = (state: KiroNativeSubagentState) => ({
      taskType: "subagent" as const,
      title: state.description,
      ...(state.role ? { role: state.role } : {}),
      timelineBypass: true,
    });

    const emitKiroNativeLifecycleAction = Effect.fn("emitKiroNativeLifecycleAction")(function* (
      ctx: KiroSessionContext,
      action: KiroNativeSubagentLifecycleAction,
      method: string,
      rawPayload: unknown,
    ) {
      const base = {
        ...(yield* makeEventStamp()),
        provider: PROVIDER,
        threadId: ctx.threadId,
        turnId: ctx.activeTurnId,
        raw: {
          source: "acp.kiro.extension" as const,
          method,
          payload: rawPayload,
        },
      };
      const linkage = nativeTaskLinkage(action.state);
      switch (action.type) {
        case "started":
          yield* offerRuntimeEvent({
            ...base,
            type: "task.started",
            payload: {
              taskId: action.state.taskId,
              description: action.state.description,
              ...linkage,
            },
          });
          return;
        case "progress":
          yield* offerRuntimeEvent({
            ...base,
            type: "task.progress",
            payload: {
              taskId: action.state.taskId,
              description: action.state.description,
              summary: action.summary,
              status: "running",
              ...linkage,
            },
          });
          return;
        case "completed":
          yield* offerRuntimeEvent({
            ...base,
            type: "task.completed",
            payload: {
              taskId: action.state.taskId,
              status: action.status,
              ...(action.summary ? { summary: action.summary } : {}),
              ...linkage,
            },
          });
          return;
      }
    });

    const emitKiroNativeProgress = Effect.fn("emitKiroNativeProgress")(function* (
      ctx: KiroSessionContext,
      state: KiroNativeSubagentState,
      input: { readonly summary?: string; readonly lastToolName?: string },
      method: string,
      rawPayload: unknown,
      source: "acp.jsonrpc" | "acp.kiro.extension" = "acp.kiro.extension",
    ) {
      const summary = trimmedNativeText(input.summary);
      const lastToolName = trimmedNativeText(input.lastToolName, 200);
      if (!summary && !lastToolName) return;
      yield* offerRuntimeEvent({
        type: "task.progress",
        ...(yield* makeEventStamp()),
        provider: PROVIDER,
        threadId: ctx.threadId,
        turnId: ctx.activeTurnId,
        payload: {
          taskId: state.taskId,
          description: state.description,
          ...(summary ? { summary } : {}),
          ...(lastToolName ? { lastToolName } : {}),
          status: "running",
          ...nativeTaskLinkage(state),
        },
        raw: {
          source,
          method,
          payload: rawPayload,
        },
      });
    });

    const getThreadSemaphore = (threadId: string) =>
      SynchronizedRef.modifyEffect(threadLocksRef, (current) => {
        const existing: Option.Option<Semaphore.Semaphore> = Option.fromNullishOr(
          current.get(threadId),
        );
        return Option.match(existing, {
          onNone: () =>
            Semaphore.make(1).pipe(
              Effect.map((semaphore) => {
                const next = new Map(current);
                next.set(threadId, semaphore);
                return [semaphore, next] as const;
              }),
            ),
          onSome: (semaphore) => Effect.succeed([semaphore, current] as const),
        });
      });

    const withThreadLock = <A, E, R>(threadId: string, effect: Effect.Effect<A, E, R>) =>
      Effect.flatMap(getThreadSemaphore(threadId), (semaphore) => semaphore.withPermit(effect));

    const logNative = (
      threadId: ThreadId,
      method: string,
      payload: unknown,
      _source: "acp.jsonrpc",
    ) =>
      Effect.gen(function* () {
        if (!nativeEventLogger) return;
        const observedAt = yield* nowIso;
        yield* nativeEventLogger.write(
          {
            observedAt,
            event: {
              id: yield* randomUUIDv4,
              kind: "notification",
              provider: PROVIDER,
              createdAt: observedAt,
              method,
              threadId,
              payload,
            },
          },
          threadId,
        );
      });

    const emitPlanUpdate = (
      ctx: KiroSessionContext,
      payload: {
        readonly explanation?: string | null;
        readonly plan: ReadonlyArray<{
          readonly step: string;
          readonly status: "pending" | "inProgress" | "completed";
        }>;
      },
      rawPayload: unknown,
      source: "acp.jsonrpc",
      method: string,
    ) =>
      Effect.gen(function* () {
        const fingerprint = `${ctx.activeTurnId ?? "no-turn"}:${encodeJsonStringForDiagnostics(payload) ?? "[unserializable payload]"}`;
        if (ctx.lastPlanFingerprint === fingerprint) {
          return;
        }
        ctx.lastPlanFingerprint = fingerprint;
        yield* offerRuntimeEvent(
          makeAcpPlanUpdatedEvent({
            stamp: yield* makeEventStamp(),
            provider: PROVIDER,
            threadId: ctx.threadId,
            turnId: ctx.activeTurnId,
            payload,
            source,
            method,
            rawPayload,
          }),
        );
      });

    const requireSession = (
      threadId: ThreadId,
    ): Effect.Effect<KiroSessionContext, ProviderAdapterSessionNotFoundError> => {
      const ctx = sessions.get(threadId);
      if (!ctx || ctx.stopped) {
        return Effect.fail(
          new ProviderAdapterSessionNotFoundError({ provider: PROVIDER, threadId }),
        );
      }
      return Effect.succeed(ctx);
    };

    const stopSessionInternal = (ctx: KiroSessionContext) =>
      Effect.gen(function* () {
        if (ctx.stopped) return;
        ctx.stopped = true;
        yield* settlePendingApprovalsAsCancelled(ctx.pendingApprovals);
        yield* settlePendingUserInputsAsEmptyAnswers(ctx.pendingUserInputs);
        if (ctx.notificationFiber) {
          yield* Fiber.interrupt(ctx.notificationFiber);
        }
        for (const action of completeOpenKiroNativeSubagents(ctx.nativeSubagents, "stopped")) {
          yield* emitKiroNativeLifecycleAction(ctx, action, "session/stop", {
            reason: "session stopped",
          });
        }
        yield* Effect.ignore(Scope.close(ctx.scope, Exit.void));
        sessions.delete(ctx.threadId);
        if (options?.onSlashCommandsUpdated) {
          yield* options.onSlashCommandsUpdated({ threadId: ctx.threadId, commands: [] });
        }
        yield* offerRuntimeEvent({
          type: "session.exited",
          ...(yield* makeEventStamp()),
          provider: PROVIDER,
          threadId: ctx.threadId,
          payload: { exitKind: "graceful" },
        });
      });

    const startSession: KiroAdapterShape["startSession"] = (input) =>
      withThreadLock(
        input.threadId,
        Effect.gen(function* () {
          if (input.provider !== undefined && input.provider !== PROVIDER) {
            return yield* new ProviderAdapterValidationError({
              provider: PROVIDER,
              operation: "startSession",
              issue: `Expected provider '${PROVIDER}' but received '${input.provider}'.`,
            });
          }
          if (!input.cwd?.trim()) {
            return yield* new ProviderAdapterValidationError({
              provider: PROVIDER,
              operation: "startSession",
              issue: "cwd is required and must be non-empty.",
            });
          }

          const cwd = path.resolve(input.cwd.trim());
          const kiroModelSelection =
            input.modelSelection?.instanceId === boundInstanceId ? input.modelSelection : undefined;
          const existing = sessions.get(input.threadId);
          if (existing && !existing.stopped) {
            yield* stopSessionInternal(existing);
          }

          const pendingApprovals = new Map<ApprovalRequestId, PendingApproval>();
          const pendingUserInputs = new Map<ApprovalRequestId, PendingUserInput>();
          const sessionScope = yield* Scope.make("sequential");
          let sessionScopeTransferred = false;
          yield* Effect.addFinalizer(() =>
            sessionScopeTransferred ? Effect.void : Scope.close(sessionScope, Exit.void),
          );
          let ctx!: KiroSessionContext;

          const resumeSessionId = parseKiroResume(input.resumeCursor)?.sessionId;
          const acpNativeLoggers = makeAcpNativeLoggers({
            nativeEventLogger,
            provider: PROVIDER,
            threadId: input.threadId,
          });

          const effectiveKiroSettings = options?.resolveSettings
            ? yield* options.resolveSettings
            : kiroSettings;

          const acp = yield* makeKiroAcpRuntime({
            kiroSettings: effectiveKiroSettings,
            ...(options?.environment ? { environment: options.environment } : {}),
            childProcessSpawner,
            cwd,
            ...(kiroModelSelection ? { modelSelection: kiroModelSelection } : {}),
            ...(resumeSessionId ? { resumeSessionId } : {}),
            clientInfo: { name: "t3-code", version: "0.0.0" },
            ...acpNativeLoggers,
          }).pipe(
            Effect.provideService(Crypto.Crypto, crypto),
            Effect.provideService(Scope.Scope, sessionScope),
            Effect.mapError(
              (cause) =>
                new ProviderAdapterProcessError({
                  provider: PROVIDER,
                  threadId: input.threadId,
                  detail: cause.message,
                  cause,
                }),
            ),
          );
          const started = yield* Effect.gen(function* () {
            yield* acp.handleRequestPermission((params) =>
              mapAcpCallbackFailure(
                Effect.gen(function* () {
                  yield* logNative(
                    input.threadId,
                    "session/request_permission",
                    params,
                    "acp.jsonrpc",
                  );
                  if (input.runtimeMode === "full-access") {
                    const autoApprovedOptionId = selectAutoApprovedPermissionOption(params);
                    if (autoApprovedOptionId !== undefined) {
                      return {
                        outcome: {
                          outcome: "selected" as const,
                          optionId: autoApprovedOptionId,
                        },
                      };
                    }
                  }
                  const permissionRequest = parsePermissionRequest(params);
                  const requestId = ApprovalRequestId.make(yield* randomUUIDv4);
                  const runtimeRequestId = RuntimeRequestId.make(requestId);
                  const decision = yield* Deferred.make<ProviderApprovalDecision>();
                  pendingApprovals.set(requestId, {
                    decision,
                    kind: permissionRequest.kind,
                  });
                  yield* offerRuntimeEvent(
                    makeAcpRequestOpenedEvent({
                      stamp: yield* makeEventStamp(),
                      provider: PROVIDER,
                      threadId: input.threadId,
                      turnId: ctx?.activeTurnId,
                      requestId: runtimeRequestId,
                      permissionRequest,
                      detail:
                        permissionRequest.detail ??
                        encodeJsonStringForDiagnostics(params)?.slice(0, 2000) ??
                        "[unserializable params]",
                      args: params,
                      source: "acp.jsonrpc",
                      method: "session/request_permission",
                      rawPayload: params,
                    }),
                  );
                  const resolved = yield* Deferred.await(decision);
                  pendingApprovals.delete(requestId);
                  yield* offerRuntimeEvent(
                    makeAcpRequestResolvedEvent({
                      stamp: yield* makeEventStamp(),
                      provider: PROVIDER,
                      threadId: input.threadId,
                      turnId: ctx?.activeTurnId,
                      requestId: runtimeRequestId,
                      permissionRequest,
                      decision: resolved,
                    }),
                  );
                  return {
                    outcome:
                      resolved === "cancel"
                        ? ({ outcome: "cancelled" } as const)
                        : {
                            outcome: "selected" as const,
                            optionId: acpPermissionOutcome(resolved),
                          },
                  };
                }),
              ),
            );
            yield* acp.handleExtNotification(
              KIRO_SUBAGENT_LIST_METHOD,
              KiroNativeSubagentListNotification,
              (params) =>
                mapAcpCallbackFailure(
                  Effect.gen(function* () {
                    if (!ctx || ctx.activeTurnGate === undefined) return;
                    yield* logNative(
                      input.threadId,
                      KIRO_SUBAGENT_LIST_METHOD,
                      params,
                      "acp.jsonrpc",
                    );
                    const actions = reconcileKiroNativeSubagents(
                      ctx.nativeSubagents,
                      params.subagents,
                    );
                    for (const action of actions) {
                      yield* emitKiroNativeLifecycleAction(
                        ctx,
                        action,
                        KIRO_SUBAGENT_LIST_METHOD,
                        params,
                      );
                    }
                  }),
                ),
            );
            yield* acp.handleExtNotification(
              KIRO_SUBAGENT_ACTIVITY_METHOD,
              KiroNativeSubagentActivityNotification,
              (params) =>
                mapAcpCallbackFailure(
                  Effect.gen(function* () {
                    if (!ctx || ctx.activeTurnGate === undefined) return;
                    yield* logNative(
                      input.threadId,
                      KIRO_SUBAGENT_ACTIVITY_METHOD,
                      params,
                      "acp.jsonrpc",
                    );
                    const sessionId = trimmedNativeText(params.sessionId);
                    const state = ctx.nativeSubagents.get(sessionId);
                    if (!state || state.completed) return;
                    const toolCallId = trimmedNativeText(params.update.toolCallId);
                    const title = trimmedNativeText(params.update.title, 200);
                    if (toolCallId) {
                      ctx.nativeToolOwners.set(toolCallId, sessionId);
                    }
                    const content = params.update.content;
                    const contentText =
                      content && content.type === "text" && content.is_thinking !== true
                        ? trimmedNativeText(content.text)
                        : "";
                    const flatText = trimmedNativeText(params.update.text);
                    const streamedText =
                      params.update.sessionUpdate === "agent_message_chunk"
                        ? contentText || flatText
                        : "";
                    if (title || streamedText) {
                      yield* emitKiroNativeProgress(
                        ctx,
                        state,
                        {
                          ...(streamedText ? { summary: streamedText } : {}),
                          ...(title ? { lastToolName: title } : {}),
                        },
                        KIRO_SUBAGENT_ACTIVITY_METHOD,
                        params,
                      );
                    }
                  }),
                ),
            );
            return yield* acp.start();
          }).pipe(
            Effect.mapError((error) =>
              mapAcpToAdapterError(PROVIDER, input.threadId, "session/start", error),
            ),
          );

          yield* applyRequestedSessionConfiguration({
            runtime: acp,
            runtimeMode: input.runtimeMode,
            interactionMode: undefined,
            modelSelection: kiroModelSelection,
            mapError: ({ cause, method }) =>
              mapAcpToAdapterError(PROVIDER, input.threadId, method, cause),
          });

          const now = yield* nowIso;
          const session: ProviderSession = {
            provider: PROVIDER,
            providerInstanceId: boundInstanceId,
            status: "ready",
            runtimeMode: input.runtimeMode,
            cwd,
            model: kiroModelSelection?.model,
            threadId: input.threadId,
            resumeCursor: {
              schemaVersion: KIRO_RESUME_VERSION,
              sessionId: started.sessionId,
            },
            createdAt: now,
            updatedAt: now,
          };

          ctx = {
            threadId: input.threadId,
            session,
            scope: sessionScope,
            acp,
            notificationFiber: undefined,
            pendingApprovals,
            pendingUserInputs,
            turns: [],
            lastPlanFingerprint: undefined,
            activeTurnId: undefined,
            activeTurnGate: undefined,
            lastMaxTokens: undefined,
            lastUsedTokens: undefined,
            currentEffort: selectedKiroEffort(kiroModelSelection?.options),
            nativeSubagents: new Map(),
            nativeToolOwners: new Map(),
            stopped: false,
          };

          const nf = yield* Stream.runDrain(
            Stream.mapEffect(acp.getEvents(), (event) =>
              Effect.gen(function* () {
                switch (event._tag) {
                  case "EventStreamBarrier":
                    yield* Deferred.succeed(event.acknowledge, undefined);
                    return;
                  case "ModeChanged":
                    return;
                  case "AssistantItemStarted":
                    yield* offerRuntimeEvent(
                      makeAcpAssistantItemEvent({
                        stamp: yield* makeEventStamp(),
                        provider: PROVIDER,
                        threadId: ctx.threadId,
                        turnId: ctx.activeTurnId,
                        itemId: event.itemId,
                        lifecycle: "item.started",
                      }),
                    );
                    return;
                  case "AssistantItemCompleted":
                    yield* offerRuntimeEvent(
                      makeAcpAssistantItemEvent({
                        stamp: yield* makeEventStamp(),
                        provider: PROVIDER,
                        threadId: ctx.threadId,
                        turnId: ctx.activeTurnId,
                        itemId: event.itemId,
                        lifecycle: "item.completed",
                      }),
                    );
                    return;
                  case "PlanUpdated":
                    yield* logNative(
                      ctx.threadId,
                      "session/update",
                      event.rawPayload,
                      "acp.jsonrpc",
                    );
                    yield* emitPlanUpdate(
                      ctx,
                      event.payload,
                      event.rawPayload,
                      "acp.jsonrpc",
                      "session/update",
                    );
                    return;
                  case "AvailableCommandsUpdated":
                    yield* logNative(
                      ctx.threadId,
                      "session/update",
                      event.rawPayload,
                      "acp.jsonrpc",
                    );
                    if (options?.onSlashCommandsUpdated) {
                      yield* options.onSlashCommandsUpdated({
                        threadId: ctx.threadId,
                        commands: kiroSlashCommandsFromAcp(event.commands),
                      });
                    }
                    return;
                  case "UsageUpdated":
                    yield* logNative(
                      ctx.threadId,
                      "session/update",
                      event.rawPayload,
                      "acp.jsonrpc",
                    );
                    ctx.lastMaxTokens = event.usage.maxTokens ?? ctx.lastMaxTokens;
                    ctx.lastUsedTokens = event.usage.usedTokens;
                    yield* offerRuntimeEvent(
                      makeAcpTokenUsageUpdatedEvent({
                        stamp: yield* makeEventStamp(),
                        provider: PROVIDER,
                        threadId: ctx.threadId,
                        turnId: ctx.activeTurnId,
                        usage: {
                          usedTokens: event.usage.usedTokens,
                          ...(ctx.lastMaxTokens ? { maxTokens: ctx.lastMaxTokens } : {}),
                        },
                        rawPayload: event.rawPayload,
                      }),
                    );
                    return;
                  case "ToolCallUpdated":
                    yield* logNative(
                      ctx.threadId,
                      "session/update",
                      event.rawPayload,
                      "acp.jsonrpc",
                    );
                    yield* offerRuntimeEvent(
                      makeAcpToolCallEvent({
                        stamp: yield* makeEventStamp(),
                        provider: PROVIDER,
                        threadId: ctx.threadId,
                        turnId: ctx.activeTurnId,
                        toolCall: event.toolCall,
                        rawPayload: event.rawPayload,
                      }),
                    );
                    const nativeSessionId = ctx.nativeToolOwners.get(event.toolCall.toolCallId);
                    const nativeState = nativeSessionId
                      ? ctx.nativeSubagents.get(nativeSessionId)
                      : undefined;
                    if (nativeState && !nativeState.completed) {
                      yield* emitKiroNativeProgress(
                        ctx,
                        nativeState,
                        {
                          ...(event.toolCall.detail ? { summary: event.toolCall.detail } : {}),
                          ...(event.toolCall.title ? { lastToolName: event.toolCall.title } : {}),
                        },
                        "session/update",
                        event.rawPayload,
                        "acp.jsonrpc",
                      );
                    }
                    if (
                      event.toolCall.status === "completed" ||
                      event.toolCall.status === "failed"
                    ) {
                      ctx.nativeToolOwners.delete(event.toolCall.toolCallId);
                    }
                    return;
                  case "ContentDelta":
                    yield* logNative(
                      ctx.threadId,
                      "session/update",
                      event.rawPayload,
                      "acp.jsonrpc",
                    );
                    yield* offerRuntimeEvent(
                      makeAcpContentDeltaEvent({
                        stamp: yield* makeEventStamp(),
                        provider: PROVIDER,
                        threadId: ctx.threadId,
                        turnId: ctx.activeTurnId,
                        ...(event.itemId ? { itemId: event.itemId } : {}),
                        text: event.text,
                        rawPayload: event.rawPayload,
                      }),
                    );
                    return;
                }
              }),
            ),
          ).pipe(
            Effect.catch((cause) =>
              Effect.logError("Failed to process Kiro runtime notification.", { cause }),
            ),
            Effect.forkChild,
          );

          ctx.notificationFiber = nf;
          sessions.set(input.threadId, ctx);
          sessionScopeTransferred = true;

          yield* offerRuntimeEvent({
            type: "session.started",
            ...(yield* makeEventStamp()),
            provider: PROVIDER,
            threadId: input.threadId,
            payload: { resume: started.initializeResult },
          });
          yield* offerRuntimeEvent({
            type: "session.state.changed",
            ...(yield* makeEventStamp()),
            provider: PROVIDER,
            threadId: input.threadId,
            payload: { state: "ready", reason: "Kiro ACP session ready" },
          });
          yield* offerRuntimeEvent({
            type: "thread.started",
            ...(yield* makeEventStamp()),
            provider: PROVIDER,
            threadId: input.threadId,
            payload: { providerThreadId: started.sessionId },
          });

          return session;
        }).pipe(Effect.scoped),
      );

    const sendTurn: KiroAdapterShape["sendTurn"] = (input) =>
      Effect.gen(function* () {
        const ctx = yield* requireSession(input.threadId);
        const turnId = TurnId.make(yield* randomUUIDv4);
        const turnModelSelection =
          input.modelSelection?.instanceId === boundInstanceId ? input.modelSelection : undefined;
        const model = turnModelSelection?.model ?? ctx.session.model;
        const resolvedModel = resolveKiroAcpBaseModelId(model);
        const requestedEffort = selectedKiroEffort(turnModelSelection?.options);
        if (requestedEffort !== undefined && requestedEffort !== ctx.currentEffort) {
          const configOptions = yield* ctx.acp.getConfigOptions;
          if (!canApplyKiroEffortToRunningSession(configOptions, requestedEffort)) {
            return yield* new ProviderAdapterValidationError({
              provider: PROVIDER,
              operation: "sendTurn",
              issue:
                "This Kiro session cannot change Effort after startup. Start a new thread to use the selected Effort.",
            });
          }
        }
        yield* applyRequestedSessionConfiguration({
          runtime: ctx.acp,
          runtimeMode: ctx.session.runtimeMode,
          interactionMode: input.interactionMode,
          modelSelection:
            model === undefined
              ? undefined
              : {
                  model,
                  options: turnModelSelection?.options,
                },
          mapError: ({ cause, method }) =>
            mapAcpToAdapterError(PROVIDER, input.threadId, method, cause),
        });
        if (requestedEffort !== undefined) {
          ctx.currentEffort = requestedEffort;
        }
        ctx.nativeSubagents.clear();
        ctx.nativeToolOwners.clear();
        ctx.activeTurnId = turnId;
        ctx.lastPlanFingerprint = undefined;
        const turnGate = yield* Deferred.make<void>();
        ctx.activeTurnGate = turnGate;
        ctx.session = {
          ...ctx.session,
          activeTurnId: turnId,
          updatedAt: yield* nowIso,
        };

        return yield* Effect.gen(function* () {
          yield* offerRuntimeEvent({
            type: "turn.started",
            ...(yield* makeEventStamp()),
            provider: PROVIDER,
            threadId: input.threadId,
            turnId,
            payload: { model: resolvedModel },
          });

          const promptParts: Array<EffectAcpSchema.ContentBlock> = [];
          if (input.input?.trim()) {
            promptParts.push({ type: "text", text: input.input.trim() });
          }
          if (input.attachments && input.attachments.length > 0) {
            for (const attachment of input.attachments) {
              const attachmentPath = resolveAttachmentPath({
                attachmentsDir: serverConfig.attachmentsDir,
                attachment,
              });
              if (!attachmentPath) {
                return yield* new ProviderAdapterRequestError({
                  provider: PROVIDER,
                  method: "session/prompt",
                  detail: `Invalid attachment id '${attachment.id}'.`,
                });
              }
              const bytes = yield* fileSystem.readFile(attachmentPath).pipe(
                Effect.mapError(
                  (cause) =>
                    new ProviderAdapterRequestError({
                      provider: PROVIDER,
                      method: "session/prompt",
                      detail: cause.message,
                      cause,
                    }),
                ),
              );
              promptParts.push({
                type: "image",
                data: Buffer.from(bytes).toString("base64"),
                mimeType: attachment.mimeType,
              });
            }
          }

          if (promptParts.length === 0) {
            return yield* new ProviderAdapterValidationError({
              provider: PROVIDER,
              operation: "sendTurn",
              issue: "Turn requires non-empty text or attachments.",
            });
          }

          const result = yield* ctx.acp
            .prompt({ prompt: promptParts })
            .pipe(
              Effect.mapError((error) =>
                mapAcpToAdapterError(PROVIDER, input.threadId, "session/prompt", error),
              ),
            );

          yield* ctx.acp.drainEvents;
          for (const action of completeOpenKiroNativeSubagents(
            ctx.nativeSubagents,
            result.stopReason === "cancelled" ? "stopped" : "completed",
          )) {
            yield* emitKiroNativeLifecycleAction(ctx, action, "session/prompt", result);
          }

          const promptUsage = threadTokenUsageFromAcpPromptUsage(
            result.usage,
            ctx.lastMaxTokens,
            ctx.lastUsedTokens,
          );
          if (promptUsage) {
            yield* offerRuntimeEvent(
              makeAcpTokenUsageUpdatedEvent({
                stamp: yield* makeEventStamp(),
                provider: PROVIDER,
                threadId: ctx.threadId,
                turnId,
                usage: promptUsage,
                rawPayload: result,
                method: "session/prompt",
              }),
            );
          }

          ctx.turns.push({ id: turnId, items: [{ prompt: promptParts, result }] });
          ctx.session = {
            ...ctx.session,
            activeTurnId: turnId,
            updatedAt: yield* nowIso,
            model: resolvedModel,
          };

          yield* offerRuntimeEvent({
            type: "turn.completed",
            ...(yield* makeEventStamp()),
            provider: PROVIDER,
            threadId: input.threadId,
            turnId,
            payload: {
              state: result.stopReason === "cancelled" ? "cancelled" : "completed",
              stopReason: result.stopReason ?? null,
            },
          });

          return {
            threadId: input.threadId,
            turnId,
            resumeCursor: ctx.session.resumeCursor,
          };
        }).pipe(
          Effect.onExit((exit) => {
            const settlementStatus = ctx.stopped
              ? "stopped"
              : Exit.isFailure(exit)
                ? "failed"
                : "completed";
            return finalizeKiroNativeTurn({
              states: ctx.nativeSubagents,
              status: settlementStatus,
              drainEvents: Effect.ignore(ctx.acp.drainEvents),
              emit: (action) => emitKiroNativeLifecycleAction(ctx, action, "session/prompt", exit),
              gate: turnGate,
              clearGate: () => {
                if (ctx.activeTurnGate === turnGate) {
                  ctx.activeTurnGate = undefined;
                }
              },
            }).pipe(
              Effect.catchCause((cause) =>
                Effect.logError("Failed to finalize Kiro turn lifecycle.", { cause }),
              ),
            );
          }),
        );
      });

    const steerTurn: KiroAdapterShape["steerTurn"] = (input) =>
      Effect.gen(function* () {
        const ctx = yield* requireSession(input.threadId);
        const gate = ctx.activeTurnGate;
        if (gate !== undefined) {
          // ACP has no mid-turn input channel, so steer = cancel + resend.
          // Cancel the active turn (the agent marks in-progress tool calls
          // cancelled), then WAIT for it to actually settle before resending —
          // a concurrent session/prompt is not allowed and would error.
          yield* settlePendingApprovalsAsCancelled(ctx.pendingApprovals);
          yield* settlePendingUserInputsAsEmptyAnswers(ctx.pendingUserInputs);
          yield* Effect.ignore(
            ctx.acp.cancel.pipe(
              Effect.mapError((error) =>
                mapAcpToAdapterError(PROVIDER, input.threadId, "session/cancel", error),
              ),
            ),
          );
          yield* Deferred.await(gate);
        }
        return yield* sendTurn({
          threadId: input.threadId,
          ...(input.input !== undefined ? { input: input.input } : {}),
          ...(input.attachments !== undefined ? { attachments: input.attachments } : {}),
        });
      });

    const interruptTurn: KiroAdapterShape["interruptTurn"] = (threadId) =>
      Effect.gen(function* () {
        const ctx = yield* requireSession(threadId);
        yield* settlePendingApprovalsAsCancelled(ctx.pendingApprovals);
        yield* settlePendingUserInputsAsEmptyAnswers(ctx.pendingUserInputs);
        yield* Effect.ignore(
          ctx.acp.cancel.pipe(
            Effect.mapError((error) =>
              mapAcpToAdapterError(PROVIDER, threadId, "session/cancel", error),
            ),
          ),
        );
      });

    const respondToRequest: KiroAdapterShape["respondToRequest"] = (
      threadId,
      requestId,
      decision,
    ) =>
      Effect.gen(function* () {
        const ctx = yield* requireSession(threadId);
        const pending = ctx.pendingApprovals.get(requestId);
        if (!pending) {
          return yield* new ProviderAdapterRequestError({
            provider: PROVIDER,
            method: "session/request_permission",
            detail: `Unknown pending approval request: ${requestId}`,
          });
        }
        yield* Deferred.succeed(pending.decision, decision);
      });

    const respondToUserInput: KiroAdapterShape["respondToUserInput"] = (
      threadId,
      requestId,
      answers,
    ) =>
      Effect.gen(function* () {
        const ctx = yield* requireSession(threadId);
        const pending = ctx.pendingUserInputs.get(requestId);
        if (!pending) {
          return yield* new ProviderAdapterRequestError({
            provider: PROVIDER,
            method: "session/request_permission",
            detail: `Unknown pending user-input request: ${requestId}`,
          });
        }
        yield* Deferred.succeed(pending.answers, answers);
      });

    const readThread: KiroAdapterShape["readThread"] = (threadId) =>
      Effect.gen(function* () {
        const ctx = yield* requireSession(threadId);
        return { threadId, turns: ctx.turns };
      });

    const rollbackThread: KiroAdapterShape["rollbackThread"] = (threadId, numTurns) =>
      Effect.gen(function* () {
        const ctx = yield* requireSession(threadId);
        if (!Number.isInteger(numTurns) || numTurns < 1) {
          return yield* new ProviderAdapterValidationError({
            provider: PROVIDER,
            operation: "rollbackThread",
            issue: "numTurns must be an integer >= 1.",
          });
        }
        const nextLength = Math.max(0, ctx.turns.length - numTurns);
        ctx.turns.splice(nextLength);
        return { threadId, turns: ctx.turns };
      });

    const stopSession: KiroAdapterShape["stopSession"] = (threadId) =>
      withThreadLock(
        threadId,
        Effect.gen(function* () {
          const ctx = yield* requireSession(threadId);
          yield* stopSessionInternal(ctx);
        }),
      );

    const listSessions: KiroAdapterShape["listSessions"] = () =>
      Effect.sync(() => Array.from(sessions.values(), (c) => ({ ...c.session })));

    const hasSession: KiroAdapterShape["hasSession"] = (threadId) =>
      Effect.sync(() => {
        const c = sessions.get(threadId);
        return c !== undefined && !c.stopped;
      });

    const stopAll: KiroAdapterShape["stopAll"] = () =>
      Effect.forEach(sessions.values(), stopSessionInternal, { discard: true });

    yield* Effect.addFinalizer(() =>
      Effect.ignore(stopAll()).pipe(
        Effect.tap(() => PubSub.shutdown(runtimeEventPubSub)),
        Effect.tap(() => managedNativeEventLogger?.close() ?? Effect.void),
      ),
    );

    const streamEvents = Stream.fromPubSub(runtimeEventPubSub);

    return {
      provider: PROVIDER,
      capabilities: { sessionModelSwitch: "unsupported" },
      startSession,
      sendTurn,
      steerTurn,
      interruptTurn,
      readThread,
      rollbackThread,
      respondToRequest,
      respondToUserInput,
      stopSession,
      listSessions,
      hasSession,
      stopAll,
      streamEvents,
    } satisfies KiroAdapterShape;
  });
}
