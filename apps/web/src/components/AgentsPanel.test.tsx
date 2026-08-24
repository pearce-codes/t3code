import {
  deriveAgentPanelModel,
  foldSubagentActivities,
} from "@t3tools/client-runtime/state/subagentRuntime";
import { EventId, TurnId, type OrchestrationThreadActivity } from "@t3tools/contracts";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import { AgentsPanel } from "./AgentsPanel";

const turnId = TurnId.make("kiro-turn");

function kiroActivity(
  id: string,
  kind: string,
  createdAt: string,
  payload: Record<string, unknown>,
): OrchestrationThreadActivity {
  return {
    id: EventId.make(id),
    createdAt,
    kind,
    summary: kind === "task.completed" ? "Task completed" : "Kiro task update",
    tone: "info",
    turnId,
    payload: {
      taskType: "subagent",
      agentKind: "agent",
      timelineBypass: true,
      ...payload,
    },
  };
}

describe("AgentsPanel Kiro rendering", () => {
  it("renders native Kiro subagent identity, progress, completion, and usage", () => {
    const activities = [
      kiroActivity("started-reviewer", "task.started", "2026-08-22T12:00:00.000Z", {
        taskId: "kiro-native:reviewer",
        title: "Review Pearce Codes UI",
        role: "reviewer",
      }),
      kiroActivity("progress-reviewer", "task.progress", "2026-08-22T12:00:01.000Z", {
        taskId: "kiro-native:reviewer",
        title: "Review Pearce Codes UI",
        role: "reviewer",
        status: "running",
        summary: "Checking task and plan cards",
        typedUsage: { totalTokens: 1_250, toolUses: 3 },
      }),
      kiroActivity("started-tester", "task.started", "2026-08-22T12:00:02.000Z", {
        taskId: "kiro-native:tester",
        title: "Run rendering tests",
        role: "tester",
      }),
      kiroActivity("completed-tester", "task.completed", "2026-08-22T12:00:05.000Z", {
        taskId: "kiro-native:tester",
        title: "Run rendering tests",
        role: "tester",
        status: "completed",
        summary: "All focused tests passed",
        typedUsage: { totalTokens: 750, toolUses: 2 },
      }),
    ] satisfies ReadonlyArray<OrchestrationThreadActivity>;
    const model = deriveAgentPanelModel({
      agents: foldSubagentActivities(activities),
    });

    const markup = renderToStaticMarkup(<AgentsPanel model={model} />);

    expect(markup).toContain("Direct spawns");
    expect(markup).toContain("Review Pearce Codes UI");
    expect(markup).toContain("reviewer");
    expect(markup).toContain("Checking task and plan cards");
    expect(markup).toContain("Working");
    expect(markup).toContain("Run rendering tests");
    expect(markup).toContain("All focused tests passed");
    expect(markup).toContain("Completed");
    expect(markup).toContain("1 working");
    expect(markup).toContain("1 settled");
    expect(markup).toContain("2.0k tok");
  });

  it("renders running, waiting, failed, stopped, and completed Kiro statuses", () => {
    const startedAt = "2026-08-22T12:00:00.000Z";
    const activities = [
      ["running", "Running audit", "running", "Reading components"],
      ["waiting", "Waiting audit", "waiting", "Waiting for dependency"],
      ["failed", "Failed audit", "failed", "Snapshot mismatch"],
      ["stopped", "Stopped audit", "stopped", "Parent turn stopped"],
      ["completed", "Completed audit", "completed", "Rendering verified"],
    ].flatMap(([taskId, title, status, summary], index) => {
      const started = kiroActivity(`started-${taskId}`, "task.started", startedAt, {
        taskId: `kiro-native:${taskId}`,
        title,
        role: "reviewer",
      });
      const settledAt = `2026-08-22T12:00:0${index + 1}.000Z`;
      if (status === "running" || status === "waiting") {
        return [
          started,
          kiroActivity(`progress-${taskId}`, "task.progress", settledAt, {
            taskId: `kiro-native:${taskId}`,
            title,
            status,
            summary,
          }),
        ];
      }
      return [
        started,
        kiroActivity(`completed-${taskId}`, "task.completed", settledAt, {
          taskId: `kiro-native:${taskId}`,
          title,
          status,
          summary,
        }),
      ];
    }) satisfies ReadonlyArray<OrchestrationThreadActivity>;
    const model = deriveAgentPanelModel({
      agents: foldSubagentActivities(activities),
    });

    const markup = renderToStaticMarkup(<AgentsPanel model={model} />);

    expect(markup).toContain("Running audit");
    expect(markup).toContain("Reading components");
    expect(markup).toContain("Waiting audit");
    expect(markup).toContain("Waiting for dependency");
    expect(markup).toContain("Failed audit");
    expect(markup).toContain("Snapshot mismatch");
    expect(markup).toContain("Failed");
    expect(markup).toContain("Stopped audit");
    expect(markup).toContain("Parent turn stopped");
    expect(markup).toContain("Stopped");
    expect(markup).toContain("Completed audit");
    expect(markup).toContain("Rendering verified");
    expect(markup).toContain("Completed");
    expect(markup).toContain("2 working");
    expect(markup).toContain("3 settled");
  });
});
