import {
  CommandId,
  ProjectId,
  ProviderInstanceId,
  ThreadId,
  type OrchestrationReadModel,
} from "@t3tools/contracts";
import * as NodeServices from "@effect/platform-node/NodeServices";
import { expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";

import { decideOrchestrationCommand } from "./decider.ts";
import { projectEvent } from "./projector.ts";

const updatedAt = "2026-01-01T00:00:00.000Z";
const threadId = ThreadId.make("thread-color");

const readModel: OrchestrationReadModel = {
  snapshotSequence: 0,
  projects: [],
  threads: [
    {
      id: threadId,
      projectId: ProjectId.make("project-color"),
      title: "Color coded thread",
      modelSelection: { instanceId: ProviderInstanceId.make("codex"), model: "gpt-5.4" },
      runtimeMode: "full-access",
      interactionMode: "default",
      branch: null,
      worktreePath: null,
      latestTurn: null,
      createdAt: updatedAt,
      updatedAt,
      archivedAt: null,
      settledOverride: null,
      settledAt: null,
      color: null,
      deletedAt: null,
      messages: [],
      proposedPlans: [],
      activities: [],
      checkpoints: [],
      session: null,
    },
  ],
  updatedAt,
};

it.layer(NodeServices.layer)("thread color decider", (it) => {
  it.effect("sets and clears a thread color through metadata events", () =>
    Effect.gen(function* () {
      const set = yield* decideOrchestrationCommand({
        command: {
          type: "thread.meta.update",
          commandId: CommandId.make("cmd-set-color"),
          threadId,
          color: "purple",
        },
        readModel,
      });
      const setEvent = Array.isArray(set) ? set[0] : set;
      expect(setEvent.type).toBe("thread.meta-updated");
      expect(setEvent.payload).toMatchObject({ threadId, color: "purple" });

      const colored = yield* projectEvent(readModel, { ...setEvent, sequence: 1 });
      expect(colored.threads[0]?.color).toBe("purple");

      const clear = yield* decideOrchestrationCommand({
        command: {
          type: "thread.meta.update",
          commandId: CommandId.make("cmd-clear-color"),
          threadId,
          color: null,
        },
        readModel: colored,
      });
      const clearEvent = Array.isArray(clear) ? clear[0] : clear;
      const cleared = yield* projectEvent(colored, { ...clearEvent, sequence: 2 });
      expect(cleared.threads[0]?.color).toBeNull();
    }),
  );
});
