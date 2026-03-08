/**
 * KiroAdapterLive - ACP-based live implementation for the Kiro provider adapter.
 *
 * Spawns `kiro-cli` as a subprocess, communicates via ACP (JSON-RPC over stdio)
 * using `@agentclientprotocol/sdk`, and maps ACP session updates into the
 * canonical `ProviderRuntimeEvent` stream.
 *
 * @module KiroAdapterLive
 */
import {
  type CanonicalItemType,
  type ProviderRuntimeEvent,
  type ProviderSession,
  type RuntimeMode,
  EventId,
  RuntimeItemId,
  RuntimeRequestId,
  ThreadId,
  TurnId,
} from "@t3tools/contracts";
import { Effect, Layer, Queue, Stream } from "effect";
import { spawn, type ChildProcess } from "node:child_process";
import { Readable, Writable } from "node:stream";

import {
  ProviderAdapterProcessError,
  ProviderAdapterRequestError,
  ProviderAdapterSessionNotFoundError,
  ProviderAdapterValidationError,
} from "../Errors.ts";
import { KiroAdapter, type KiroAdapterShape } from "../Services/KiroAdapter.ts";

import {
  ClientSideConnection,
  ndJsonStream,
  type Client,
  type Agent,
  type SessionNotification,
  type SessionUpdate,
  type RequestPermissionRequest,
  type RequestPermissionResponse,
} from "@agentclientprotocol/sdk";

const PROVIDER = "kiro" as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeEventId(): EventId {
  return EventId.makeUnsafe(crypto.randomUUID());
}

function nowIso(): string {
  return new Date().toISOString();
}

function baseEvent(threadId: ThreadId): Omit<ProviderRuntimeEvent, "type" | "payload"> {
  return {
    eventId: makeEventId(),
    provider: PROVIDER,
    threadId,
    createdAt: nowIso(),
  };
}

// ---------------------------------------------------------------------------
// ACP SessionUpdate → ProviderRuntimeEvent mapping
// ---------------------------------------------------------------------------

function toolKindToItemType(kind: string | undefined | null): CanonicalItemType {
  switch (kind) {
    case "edit":
    case "delete":
    case "move":
      return "file_change";
    case "execute":
      return "command_execution";
    case "read":
    case "search":
      return "file_change";
    case "fetch":
      return "web_search";
    case "think":
      return "reasoning";
    default:
      return "unknown";
  }
}

function mapSessionUpdate(
  threadId: ThreadId,
  turnId: TurnId | undefined,
  update: SessionUpdate,
): ReadonlyArray<ProviderRuntimeEvent> {
  const base = baseEvent(threadId);
  const withTurn = turnId ? { ...base, turnId } : base;

  switch (update.sessionUpdate) {
    case "agent_message_chunk": {
      const text =
        update.content && "text" in update.content ? (update.content as { text: string }).text : "";
      if (!text) return [];
      return [
        {
          ...withTurn,
          type: "content.delta",
          payload: { streamKind: "assistant_text", delta: text },
        },
      ];
    }

    case "agent_thought_chunk": {
      const text =
        update.content && "text" in update.content ? (update.content as { text: string }).text : "";
      if (!text) return [];
      return [
        {
          ...withTurn,
          type: "content.delta",
          payload: { streamKind: "reasoning_text", delta: text },
        },
      ];
    }

    case "user_message_chunk":
      return [];

    case "tool_call": {
      const itemId = RuntimeItemId.makeUnsafe(update.toolCallId);
      const itemType = toolKindToItemType(update.kind);
      return [
        {
          ...withTurn,
          itemId,
          type: "item.started",
          payload: {
            itemType,
            status: "inProgress",
            title: update.title,
          },
        },
      ];
    }

    case "tool_call_update": {
      const itemId = RuntimeItemId.makeUnsafe(update.toolCallId);
      const status = update.status;
      if (status === "completed" || status === "failed") {
        return [
          {
            ...withTurn,
            itemId,
            type: "item.completed",
            payload: {
              itemType: toolKindToItemType(update.kind),
              status: status === "completed" ? "completed" : "failed",
              ...(update.title ? { title: update.title } : {}),
            },
          },
        ];
      }
      return [
        {
          ...withTurn,
          itemId,
          type: "item.updated",
          payload: {
            itemType: toolKindToItemType(update.kind),
            ...(update.title ? { title: update.title } : {}),
          },
        },
      ];
    }

    case "plan": {
      const steps = (update.entries ?? []).map((entry) => ({
        step: entry.content,
        status:
          entry.status === "completed"
            ? ("completed" as const)
            : entry.status === "in_progress"
              ? ("inProgress" as const)
              : ("pending" as const),
      }));
      return [{ ...withTurn, type: "turn.plan.updated", payload: { plan: steps } }];
    }

    case "current_mode_update":
    case "available_commands_update":
    case "config_option_update":
    case "session_info_update":
    case "usage_update":
      return [];

    default:
      return [];
  }
}

// ---------------------------------------------------------------------------
// Per-session state
// ---------------------------------------------------------------------------

interface KiroSession {
  readonly threadId: ThreadId;
  readonly process: ChildProcess;
  readonly connection: ClientSideConnection;
  readonly acpSessionId: string;
  readonly cwd: string;
  readonly createdAt: string;
  readonly runtimeMode: string;
  activeTurnId: TurnId | undefined;
  pendingPermissions: Map<
    string,
    { resolve: (response: RequestPermissionResponse) => void }
  >;
}

// ---------------------------------------------------------------------------
// Adapter factory
// ---------------------------------------------------------------------------

const makeKiroAdapter = () =>
  Effect.gen(function* () {
    const sessions = new Map<string, KiroSession>();
    const runtimeEventQueue = yield* Queue.unbounded<ProviderRuntimeEvent>();

    // Emit events using the Effect runtime (same pattern as CodexAdapter).
    const services = yield* Effect.services<never>();
    const emitEvents = (events: ReadonlyArray<ProviderRuntimeEvent>) => {
      if (events.length === 0) return;
      Effect.gen(function* () {
        yield* Queue.offerAll(runtimeEventQueue, events);
      }).pipe(Effect.runPromiseWith(services)).catch(() => {});
    };

    function spawnKiroProcess(
      threadId: ThreadId,
      cwd: string,
    ): { process: ChildProcess; connection: ClientSideConnection } {
      const child = spawn("kiro-cli", ["acp"], {
        cwd,
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env },
      });

      const output = Writable.toWeb(child.stdin!) as WritableStream<Uint8Array>;
      const input = Readable.toWeb(child.stdout!) as ReadableStream<Uint8Array>;
      const stream = ndJsonStream(output, input);

      const connection = new ClientSideConnection(
        (_agent: Agent): Client => ({
          requestPermission: async (
            params: RequestPermissionRequest,
          ): Promise<RequestPermissionResponse> => {
            const requestId = params.toolCall.toolCallId;
            const detail = params.toolCall.title ?? undefined;
            const session = sessions.get(threadId);

            // Auto-approve in full-access mode
            if (session?.runtimeMode === "full-access") {
              const allowOption = params.options.find(
                (o) => o.kind === "allow_always" || o.kind === "allow_once",
              );
              emitEvents([
                {
                  ...baseEvent(threadId),
                  requestId: RuntimeRequestId.makeUnsafe(requestId),
                  type: "request.opened",
                  payload: {
                    requestType: "unknown",
                    ...(detail ? { detail } : {}),
                    args: params,
                  },
                },
                {
                  ...baseEvent(threadId),
                  requestId: RuntimeRequestId.makeUnsafe(requestId),
                  type: "request.resolved",
                  payload: {
                    requestType: "unknown",
                    decision: "approved",
                  },
                },
              ]);
              return {
                outcome: {
                  outcome: "selected" as const,
                  optionId: allowOption?.optionId ?? params.options[0]?.optionId ?? "allow",
                },
              };
            }

            emitEvents([
              {
                ...baseEvent(threadId),
                requestId: RuntimeRequestId.makeUnsafe(requestId),
                type: "request.opened",
                payload: {
                  requestType: "unknown",
                  ...(detail ? { detail } : {}),
                  args: params,
                },
              },
            ]);

            return new Promise<RequestPermissionResponse>((resolve) => {
              if (session) {
                session.pendingPermissions.set(requestId, { resolve });
              }
            });
          },

          sessionUpdate: async (params: SessionNotification): Promise<void> => {
            const session = sessions.get(threadId);
            emitEvents(mapSessionUpdate(threadId, session?.activeTurnId, params.update));
          },
        }),
        stream,
      );

      child.on("exit", (code) => {
        sessions.delete(threadId);
        emitEvents([
          {
            ...baseEvent(threadId),
            type: "session.exited",
            payload: {
              reason: `kiro-cli exited with code ${code}`,
              ...(code === 0 ? { exitKind: "graceful" as const } : {}),
            },
          },
        ]);
      });

      return { process: child, connection };
    }

    function requireSession(threadId: ThreadId): KiroSession {
      const session = sessions.get(threadId);
      if (!session) {
        throw new ProviderAdapterSessionNotFoundError({ provider: PROVIDER, threadId });
      }
      return session;
    }

    function toProviderSession(session: KiroSession): ProviderSession {
      return {
        provider: PROVIDER,
        status: session.activeTurnId ? "running" : "ready",
        runtimeMode: session.runtimeMode as RuntimeMode,
        cwd: session.cwd,
        threadId: session.threadId,
        createdAt: session.createdAt,
        updatedAt: nowIso(),
      };
    }

    // -----------------------------------------------------------------------
    // ProviderAdapterShape implementation
    // -----------------------------------------------------------------------

    const startSession: KiroAdapterShape["startSession"] = (input) =>
      Effect.gen(function* () {
        if (input.provider !== undefined && input.provider !== PROVIDER) {
          yield* new ProviderAdapterValidationError({
            provider: PROVIDER,
            operation: "startSession",
            issue: `Expected provider '${PROVIDER}' but received '${input.provider}'.`,
          });
        }

        const cwd = input.cwd ?? process.cwd();
        const { process: child, connection } = spawnKiroProcess(input.threadId, cwd);

        yield* Effect.tryPromise({
          try: () =>
            connection.initialize({
              clientInfo: { name: "t3code", version: "0.1.0" },
              protocolVersion: 1,
              clientCapabilities: {},
            }),
          catch: (cause) =>
            new ProviderAdapterProcessError({
              provider: PROVIDER,
              threadId: input.threadId,
              detail: "ACP initialize failed",
              cause,
            }),
        });

        const newSessionResult = yield* Effect.tryPromise({
          try: () => connection.newSession({ cwd, mcpServers: [] }),
          catch: (cause) =>
            new ProviderAdapterProcessError({
              provider: PROVIDER,
              threadId: input.threadId,
              detail: "ACP session/new failed",
              cause,
            }),
        });

        const now = nowIso();
        const session: KiroSession = {
          threadId: input.threadId,
          process: child,
          connection,
          acpSessionId: newSessionResult.sessionId,
          cwd,
          createdAt: now,
          runtimeMode: input.runtimeMode ?? "full-access",
          activeTurnId: undefined,
          pendingPermissions: new Map(),
        };
        sessions.set(input.threadId, session);

        emitEvents([
          { ...baseEvent(input.threadId), type: "session.started", payload: {} },
          { ...baseEvent(input.threadId), type: "session.state.changed", payload: { state: "ready" } },
        ]);

        return toProviderSession(session);
      });

    const sendTurn: KiroAdapterShape["sendTurn"] = (input) =>
      Effect.sync(() => {
        const session = requireSession(input.threadId);
        const turnId = TurnId.makeUnsafe(crypto.randomUUID());
        session.activeTurnId = turnId;

        emitEvents([
          {
            ...baseEvent(input.threadId),
            turnId,
            type: "turn.started",
            payload: input.model ? { model: input.model } : {},
          },
        ]);

        // Fire prompt in background — resolves when the turn completes.
        void session.connection
          .prompt({
            sessionId: session.acpSessionId,
            prompt: [{ type: "text", text: input.input ?? "" }],
          })
          .then((result) => {
            emitEvents([
              {
                ...baseEvent(input.threadId),
                turnId,
                type: "turn.completed",
                payload: { state: result.stopReason === "cancelled" ? "cancelled" : "completed" },
              },
            ]);
            session.activeTurnId = undefined;
          })
          .catch(() => {
            emitEvents([
              {
                ...baseEvent(input.threadId),
                turnId,
                type: "turn.completed",
                payload: { state: "failed" },
              },
            ]);
            session.activeTurnId = undefined;
          });

        return { threadId: input.threadId, turnId };
      });

    const interruptTurn: KiroAdapterShape["interruptTurn"] = (threadId) =>
      Effect.try({
        try: () => {
          const session = requireSession(threadId);
          void session.connection.cancel({ sessionId: session.acpSessionId }).catch(() => {});
        },
        catch: (cause) =>
          new ProviderAdapterRequestError({
            provider: PROVIDER,
            method: "session/cancel",
            detail: cause instanceof Error ? cause.message : "cancel failed",
            cause,
          }),
      });

    const respondToRequest: KiroAdapterShape["respondToRequest"] = (threadId, requestId, decision) =>
      Effect.try({
        try: () => {
          const session = requireSession(threadId);
          const pending = session.pendingPermissions.get(requestId);
          if (!pending) return;
          session.pendingPermissions.delete(requestId);

          if (decision === "accept" || decision === "acceptForSession") {
            pending.resolve({ outcome: { outcome: "selected", optionId: "allow" } });
          } else {
            pending.resolve({ outcome: { outcome: "cancelled" } });
          }
        },
        catch: (cause) =>
          new ProviderAdapterRequestError({
            provider: PROVIDER,
            method: "respondToRequest",
            detail: cause instanceof Error ? cause.message : "respond failed",
            cause,
          }),
      });

    const respondToUserInput: KiroAdapterShape["respondToUserInput"] = () => Effect.void;

    const stopSession: KiroAdapterShape["stopSession"] = (threadId) =>
      Effect.sync(() => {
        const session = sessions.get(threadId);
        if (session) {
          session.process.kill();
          sessions.delete(threadId);
        }
      });

    const listSessions: KiroAdapterShape["listSessions"] = () =>
      Effect.sync(() => Array.from(sessions.values()).map(toProviderSession));

    const hasSession: KiroAdapterShape["hasSession"] = (threadId) =>
      Effect.sync(() => sessions.has(threadId));

    const readThread: KiroAdapterShape["readThread"] = (threadId) =>
      Effect.sync(() => ({ threadId, turns: [] }));

    const rollbackThread: KiroAdapterShape["rollbackThread"] = () =>
      Effect.fail(
        new ProviderAdapterValidationError({
          provider: PROVIDER,
          operation: "rollbackThread",
          issue: "Rollback is not yet supported for the Kiro ACP adapter.",
        }),
      );

    const stopAll: KiroAdapterShape["stopAll"] = () =>
      Effect.sync(() => {
        for (const session of sessions.values()) {
          session.process.kill();
        }
        sessions.clear();
      });

    return {
      provider: PROVIDER,
      capabilities: { sessionModelSwitch: "unsupported" },
      startSession,
      sendTurn,
      interruptTurn,
      readThread,
      rollbackThread,
      respondToRequest,
      respondToUserInput,
      stopSession,
      listSessions,
      hasSession,
      stopAll,
      streamEvents: Stream.fromQueue(runtimeEventQueue),
    } satisfies KiroAdapterShape;
  });

export const KiroAdapterLive = Layer.effect(KiroAdapter, makeKiroAdapter());
