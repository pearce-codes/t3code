import * as NodeServices from "@effect/platform-node/NodeServices";
import { expect, it } from "@effect/vitest";
import {
  CommandId,
  EventId,
  MessageId,
  ProjectId,
  ProviderDriverKind,
  ProviderInstanceId,
  ThreadId,
} from "@t3tools/contracts";
import * as Effect from "effect/Effect";

import { decideOrchestrationCommand } from "./decider.ts";
import { createEmptyReadModel, projectEvent } from "./projector.ts";

const CREATED_AT = "2026-08-15T11:00:00.000Z";
const UPDATED_AT = "2026-08-15T12:00:00.000Z";
const projectId = ProjectId.make("project-import");
const threadId = ThreadId.make("thread-import");

it.layer(NodeServices.layer)("session import decider", (it) => {
  it.effect("rebuilds conversation events without starting provider work", () =>
    Effect.gen(function* () {
      const readModel = yield* projectEvent(createEmptyReadModel(CREATED_AT), {
        sequence: 1,
        eventId: EventId.make("event-project"),
        aggregateKind: "project",
        aggregateId: projectId,
        type: "project.created",
        occurredAt: CREATED_AT,
        commandId: CommandId.make("command-project"),
        causationEventId: null,
        correlationId: CommandId.make("command-project"),
        metadata: {},
        payload: {
          projectId,
          title: "Imported project",
          workspaceRoot: "/work/imported",
          defaultModelSelection: null,
          scripts: [],
          createdAt: CREATED_AT,
          updatedAt: CREATED_AT,
        },
      });

      const result = yield* decideOrchestrationCommand({
        readModel,
        command: {
          type: "thread.session.import",
          commandId: CommandId.make("command-import"),
          projectId,
          threadId,
          title: "Imported session",
          modelSelection: { instanceId: ProviderInstanceId.make("codex"), model: "gpt-5.4" },
          runtimeMode: "full-access",
          interactionMode: "default",
          branch: "main",
          worktreePath: null,
          createdAt: CREATED_AT,
          updatedAt: UPDATED_AT,
          providerName: ProviderDriverKind.make("codex"),
          providerInstanceId: ProviderInstanceId.make("codex"),
          messages: [
            {
              messageId: MessageId.make("message-user"),
              role: "user",
              text: "Hello",
              createdAt: CREATED_AT,
              updatedAt: CREATED_AT,
            },
            {
              messageId: MessageId.make("message-assistant"),
              role: "assistant",
              text: "Hi",
              createdAt: UPDATED_AT,
              updatedAt: UPDATED_AT,
            },
          ],
        },
      });
      const events = Array.isArray(result) ? result : [result];

      expect(events.map((event) => event.type)).toEqual([
        "thread.created",
        "thread.message-sent",
        "thread.turn-start-requested",
        "thread.session-set",
        "thread.message-sent",
        "thread.session-set",
      ]);
      expect(events.every((event) => event.metadata.sessionTransfer === true)).toBe(true);
      const finalEvent = events.at(-1);
      expect(finalEvent?.type).toBe("thread.session-set");
      if (finalEvent?.type === "thread.session-set") {
        expect(finalEvent.payload.session.status).toBe("idle");
        expect(finalEvent.payload.session.activeTurnId).toBeNull();
      }
    }),
  );
});
