import {
  AuthOrchestrationOperateScope,
  AuthOrchestrationReadScope,
  CommandId,
  defaultInstanceIdForDriver,
  EnvironmentHttpApi,
  MessageId,
  ProjectId,
  ProviderDriverKind,
  SESSION_TRANSFER_FORMAT,
  SESSION_TRANSFER_VERSION,
  ThreadId,
} from "@t3tools/contracts";
import * as Crypto from "effect/Crypto";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as HttpApiBuilder from "effect/unstable/httpapi/HttpApiBuilder";

import packageJson from "../../package.json" with { type: "json" };
import { projectThreadDetailSnapshot } from "./ActivityPayloadProjection.ts";
import { normalizeDispatchCommand } from "./Normalizer.ts";
import {
  annotateEnvironmentRequest,
  failEnvironmentInternal,
  failEnvironmentInvalidRequest,
  failEnvironmentNotFound,
  requireEnvironmentScope,
} from "../auth/http.ts";
import { OrchestrationEngineService } from "./Services/OrchestrationEngine.ts";
import { ProjectionSnapshotQuery } from "./Services/ProjectionSnapshotQuery.ts";

export const orchestrationHttpApiLayer = HttpApiBuilder.group(
  EnvironmentHttpApi,
  "orchestration",
  Effect.fnUntraced(function* (handlers) {
    const projectionSnapshotQuery = yield* ProjectionSnapshotQuery;
    const orchestrationEngine = yield* OrchestrationEngineService;
    const crypto = yield* Crypto.Crypto;

    const randomId = Effect.fnUntraced(function* <A>(make: (value: string) => A) {
      return yield* crypto.randomUUIDv4.pipe(
        Effect.map(make),
        Effect.catch((cause) => failEnvironmentInternal("orchestration_dispatch_failed", cause)),
      );
    });

    return handlers
      .handle(
        "snapshot",
        Effect.fn("environment.orchestration.snapshot")(function* (args) {
          yield* annotateEnvironmentRequest(args.endpoint.name);
          yield* requireEnvironmentScope(AuthOrchestrationReadScope);
          // Serve the lightweight command read model (thread bodies empty)
          // instead of the fully hydrated snapshot. Hydrating every message
          // and activity payload in the database has OOM-killed servers, and
          // the route's only consumer (the project CLI) reads projects alone —
          // UI clients load the shell and per-thread snapshots instead.
          return yield* projectionSnapshotQuery
            .getCommandReadModel()
            .pipe(
              Effect.catch((cause) =>
                failEnvironmentInternal("orchestration_snapshot_failed", cause),
              ),
            );
        }),
      )
      .handle(
        "shellSnapshot",
        Effect.fn("environment.orchestration.shellSnapshot")(function* (args) {
          yield* annotateEnvironmentRequest(args.endpoint.name);
          yield* requireEnvironmentScope(AuthOrchestrationReadScope);
          return yield* projectionSnapshotQuery
            .getShellSnapshot()
            .pipe(
              Effect.catch((cause) =>
                failEnvironmentInternal("orchestration_snapshot_failed", cause),
              ),
            );
        }),
      )
      .handle(
        "threadSnapshot",
        Effect.fn("environment.orchestration.threadSnapshot")(function* (args) {
          yield* annotateEnvironmentRequest(args.endpoint.name);
          yield* requireEnvironmentScope(AuthOrchestrationReadScope);
          const snapshot = yield* projectionSnapshotQuery
            .getThreadDetailSnapshot(
              args.params.threadId,
              args.payload.turnLimit === undefined
                ? undefined
                : {
                    turnLimit: args.payload.turnLimit,
                    ...(args.payload.beforeCursor !== undefined
                      ? { beforeCursor: args.payload.beforeCursor }
                      : {}),
                  },
            )
            .pipe(
              Effect.catch((cause) =>
                failEnvironmentInternal("orchestration_thread_snapshot_failed", cause),
              ),
            );
          if (Option.isNone(snapshot)) {
            return yield* failEnvironmentNotFound("thread_not_found");
          }
          return projectThreadDetailSnapshot(snapshot.value);
        }),
      )
      .handle(
        "exportSession",
        Effect.fn("environment.orchestration.exportSession")(function* (args) {
          yield* annotateEnvironmentRequest(args.endpoint.name);
          yield* requireEnvironmentScope(AuthOrchestrationReadScope);
          const snapshot = yield* projectionSnapshotQuery
            .getThreadDetailSnapshot(args.params.threadId)
            .pipe(
              Effect.catch((cause) =>
                failEnvironmentInternal("orchestration_thread_snapshot_failed", cause),
              ),
            );
          if (Option.isNone(snapshot)) {
            return yield* failEnvironmentNotFound("thread_not_found");
          }
          const project = yield* projectionSnapshotQuery
            .getProjectShellById(snapshot.value.thread.projectId)
            .pipe(
              Effect.catch((cause) =>
                failEnvironmentInternal("orchestration_thread_snapshot_failed", cause),
              ),
            );
          if (Option.isNone(project)) {
            return yield* failEnvironmentNotFound("thread_not_found");
          }
          const thread = snapshot.value.thread;
          return {
            format: SESSION_TRANSFER_FORMAT,
            version: SESSION_TRANSFER_VERSION,
            exportedAt: DateTime.formatIso(yield* DateTime.now),
            source: { app: "Pearce Codes", version: packageJson.version },
            project: {
              title: project.value.title,
              workspaceRoot: project.value.workspaceRoot,
              defaultModelSelection: project.value.defaultModelSelection,
            },
            thread: {
              sourceThreadId: thread.id,
              title: thread.title,
              modelSelection: thread.modelSelection,
              runtimeMode: thread.runtimeMode,
              interactionMode: thread.interactionMode,
              branch: thread.branch,
              worktreePath: thread.worktreePath,
              createdAt: thread.createdAt,
              updatedAt: thread.updatedAt,
              messages: thread.messages.map((message) => ({
                role: message.role,
                text: message.text,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
              })),
            },
            providerBinding:
              thread.session?.providerName == null
                ? null
                : {
                    provider: ProviderDriverKind.make(thread.session.providerName),
                    providerInstanceId:
                      thread.session.providerInstanceId ??
                      defaultInstanceIdForDriver(
                        ProviderDriverKind.make(thread.session.providerName),
                      ),
                    runtimeMode: thread.session.runtimeMode,
                    // Provider-native transcripts and credentials are deliberately
                    // excluded, so imported archives cannot silently resume a
                    // machine-local process from another environment.
                    resumeCursor: null,
                  },
          };
        }),
      )
      .handle(
        "importSession",
        Effect.fn("environment.orchestration.importSession")(function* (args) {
          yield* annotateEnvironmentRequest(args.endpoint.name);
          yield* requireEnvironmentScope(AuthOrchestrationOperateScope);
          const importedAt = DateTime.formatIso(yield* DateTime.now);
          const existingProject = yield* projectionSnapshotQuery
            .getActiveProjectByWorkspaceRoot(args.payload.project.workspaceRoot)
            .pipe(
              Effect.catch((cause) =>
                failEnvironmentInternal("orchestration_dispatch_failed", cause),
              ),
            );
          const projectId = Option.isSome(existingProject)
            ? existingProject.value.id
            : yield* randomId(ProjectId.make);

          if (Option.isNone(existingProject)) {
            yield* orchestrationEngine
              .dispatch({
                type: "project.create",
                commandId: yield* randomId(CommandId.make),
                projectId,
                title: args.payload.project.title,
                workspaceRoot: args.payload.project.workspaceRoot,
                defaultModelSelection: args.payload.project.defaultModelSelection,
                createdAt: importedAt,
              })
              .pipe(
                Effect.catch((cause) =>
                  failEnvironmentInternal("orchestration_dispatch_failed", cause),
                ),
              );
          }

          const threadId = yield* randomId(ThreadId.make);
          const messages = yield* Effect.forEach(
            args.payload.thread.messages,
            Effect.fnUntraced(function* (message) {
              return { ...message, messageId: yield* randomId(MessageId.make) };
            }),
            { concurrency: 1 },
          );
          yield* orchestrationEngine
            .dispatch({
              type: "thread.session.import",
              commandId: yield* randomId(CommandId.make),
              threadId,
              projectId,
              title: args.payload.thread.title,
              modelSelection: args.payload.thread.modelSelection,
              runtimeMode: args.payload.thread.runtimeMode,
              interactionMode: args.payload.thread.interactionMode,
              branch: args.payload.thread.branch,
              worktreePath: args.payload.thread.worktreePath,
              createdAt: args.payload.thread.createdAt,
              updatedAt: args.payload.thread.updatedAt,
              providerName: args.payload.providerBinding?.provider ?? null,
              ...(args.payload.providerBinding !== null
                ? { providerInstanceId: args.payload.providerBinding.providerInstanceId }
                : {}),
              messages,
            })
            .pipe(
              Effect.catch((cause) =>
                failEnvironmentInternal("orchestration_dispatch_failed", cause),
              ),
            );

          return {
            projectId,
            threadId,
            providerResumePreserved: false,
          };
        }),
      )
      .handle(
        "dispatch",
        Effect.fn("environment.orchestration.dispatch")(function* (args) {
          yield* annotateEnvironmentRequest(args.endpoint.name);
          yield* requireEnvironmentScope(AuthOrchestrationOperateScope);
          const normalizedCommand = yield* normalizeDispatchCommand(args.payload).pipe(
            Effect.catch(() => failEnvironmentInvalidRequest("invalid_command")),
          );
          return yield* orchestrationEngine
            .dispatch(normalizedCommand)
            .pipe(
              Effect.catch((cause) =>
                failEnvironmentInternal("orchestration_dispatch_failed", cause),
              ),
            );
        }),
      );
  }),
);
