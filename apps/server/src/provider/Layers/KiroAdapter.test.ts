// @effect-diagnostics nodeBuiltinImport:off
import * as NodeFSP from "node:fs/promises";
import * as NodeOS from "node:os";
import * as NodePath from "node:path";
import * as NodeURL from "node:url";

import * as NodeServices from "@effect/platform-node/NodeServices";
import { describe, expect, it } from "@effect/vitest";
import {
  KiroSettings,
  ProviderDriverKind,
  ProviderInstanceId,
  type ProviderRuntimeEvent,
  ThreadId,
} from "@t3tools/contracts";
import * as Deferred from "effect/Deferred";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";

import { ServerConfig } from "../../config.ts";

import {
  completeOpenKiroNativeSubagents,
  finalizeKiroNativeTurn,
  makeKiroAdapter,
  reconcileKiroNativeSubagents,
  threadTokenUsageFromAcpPromptUsage,
} from "./KiroAdapter.ts";

const decodeKiroSettings = Schema.decodeSync(KiroSettings);
const __dirname = NodePath.dirname(NodeURL.fileURLToPath(import.meta.url));
const mockAgentPath = NodePath.join(__dirname, "../../../scripts/acp-mock-agent.ts");

async function makeMockKiroWrapper() {
  const dir = await NodeFSP.mkdtemp(NodePath.join(NodeOS.tmpdir(), "kiro-acp-mock-"));
  const wrapperPath = NodePath.join(dir, "fake-kiro.sh");
  const script = `#!/bin/sh
exec ${JSON.stringify(process.execPath)} ${JSON.stringify(mockAgentPath)} "$@"
`;
  await NodeFSP.writeFile(wrapperPath, script, "utf8");
  await NodeFSP.chmod(wrapperPath, 0o755);
  return wrapperPath;
}

async function makeMockKiroWrapperWithNativeSubagents() {
  const dir = await NodeFSP.mkdtemp(NodePath.join(NodeOS.tmpdir(), "kiro-acp-subagents-"));
  const proxyPath = NodePath.join(dir, "native-subagent-proxy.mjs");
  const wrapperPath = NodePath.join(dir, "fake-kiro.sh");
  const notifications = [
    {
      jsonrpc: "2.0",
      method: "_kiro.dev/subagent/list_update",
      params: {
        subagents: [
          {
            sessionId: "native-reviewer",
            sessionName: "Review Pearce Codes rendering",
            role: "reviewer",
            status: { type: "working", message: "Inspecting task cards" },
          },
        ],
      },
    },
    {
      jsonrpc: "2.0",
      method: "_kiro.dev/session/update",
      params: {
        sessionId: "native-reviewer",
        update: {
          sessionUpdate: "tool_call",
          toolCallId: "native-tool-1",
          title: "Search Kiro UI",
          text: "Checking plan and agent rows",
        },
      },
    },
    {
      jsonrpc: "2.0",
      method: "_kiro.dev/subagent/list_update",
      params: {
        subagents: [
          {
            sessionId: "native-reviewer",
            sessionName: "Review Pearce Codes rendering",
            role: "reviewer",
            status: { type: "completed", message: "Rendering verified" },
          },
        ],
      },
    },
  ];
  const proxy = `
import { spawn } from "node:child_process";

const child = spawn(process.execPath, [${JSON.stringify(mockAgentPath)}], {
  env: process.env,
  stdio: ["pipe", "pipe", "inherit"],
});
child.stdout.pipe(process.stdout);

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
  while (input.includes("\\n")) {
    const newline = input.indexOf("\\n");
    const line = input.slice(0, newline + 1);
    input = input.slice(newline + 1);
    child.stdin.write(line);
    try {
      const request = JSON.parse(line);
      if (request.method === "session/prompt") {
        for (const notification of ${JSON.stringify(notifications)}) {
          process.stdout.write(JSON.stringify(notification) + "\\n");
        }
      }
    } catch {}
  }
});
process.stdin.on("end", () => child.stdin.end());
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
`;
  await NodeFSP.writeFile(proxyPath, proxy, "utf8");
  await NodeFSP.writeFile(
    wrapperPath,
    `#!/bin/sh\nexec ${JSON.stringify(process.execPath)} ${JSON.stringify(proxyPath)} "$@"\n`,
    "utf8",
  );
  await NodeFSP.chmod(wrapperPath, 0o755);
  return wrapperPath;
}

const kiroAdapterTestLayer = ServerConfig.layerTest(process.cwd(), {
  prefix: "t3code-kiro-adapter-test-",
}).pipe(Layer.provideMerge(NodeServices.layer));

describe("threadTokenUsageFromAcpPromptUsage", () => {
  it("maps cumulative ACP prompt usage without inventing last-turn fields", () => {
    expect(
      threadTokenUsageFromAcpPromptUsage(
        {
          inputTokens: 120,
          cachedReadTokens: 30,
          cachedWriteTokens: 4,
          outputTokens: 25,
          thoughtTokens: 5,
          totalTokens: 180,
        },
        200_000,
        75,
      ),
    ).toEqual({
      usedTokens: 75,
      totalProcessedTokens: 180,
      maxTokens: 200_000,
      inputTokens: 120,
      cachedInputTokens: 30,
      outputTokens: 25,
      reasoningOutputTokens: 5,
    });
  });

  it("keeps active occupancy after cumulative growth and context compaction", () => {
    expect(
      threadTokenUsageFromAcpPromptUsage(
        { inputTokens: 80, outputTokens: 20, totalTokens: 100 },
        120,
        90,
      ),
    ).toMatchObject({ usedTokens: 90, totalProcessedTokens: 100 });
    expect(
      threadTokenUsageFromAcpPromptUsage(
        { inputTokens: 145, outputTokens: 35, totalTokens: 180 },
        120,
        30,
      ),
    ).toMatchObject({ usedTokens: 30, totalProcessedTokens: 180 });
  });

  it("ignores absent usage and clamps malformed numeric values", () => {
    expect(threadTokenUsageFromAcpPromptUsage(undefined)).toBeUndefined();
    expect(
      threadTokenUsageFromAcpPromptUsage({
        inputTokens: -1,
        outputTokens: 2.9,
        totalTokens: Number.NaN,
      }),
    ).toMatchObject({
      usedTokens: 0,
      inputTokens: 0,
      outputTokens: 2,
    });
  });
});

describe("reconcileKiroNativeSubagents", () => {
  it("uses native sessionId for stable started, progress, and terminal task events", () => {
    const states = new Map();
    const running = {
      sessionId: "sub-1",
      sessionName: "readme",
      role: "gpu-worker",
      initialQuery: "summarize README",
      status: { type: "working", message: "reading files" },
    };

    expect(reconcileKiroNativeSubagents(states, [running])).toMatchObject([
      {
        type: "started",
        state: {
          taskId: "kiro-native:sub-1",
          description: "summarize README",
          role: "gpu-worker",
        },
      },
      {
        type: "progress",
        summary: "reading files",
      },
    ]);
    expect(reconcileKiroNativeSubagents(states, [running])).toEqual([]);

    expect(
      reconcileKiroNativeSubagents(states, [
        {
          ...running,
          status: { type: "failed", message: "worker failed" },
        },
      ]),
    ).toMatchObject([
      {
        type: "completed",
        status: "failed",
        summary: "worker failed",
        state: { taskId: "kiro-native:sub-1" },
      },
    ]);
    expect(
      reconcileKiroNativeSubagents(states, [
        {
          ...running,
          status: { type: "failed", message: "worker failed" },
        },
      ]),
    ).toEqual([]);
  });

  it("treats unknown and paused native statuses as nonterminal progress", () => {
    const states = new Map();
    const unknownActions = reconcileKiroNativeSubagents(states, [
      {
        sessionId: "sub-future",
        initialQuery: "wait for dependency",
        status: { type: "awaiting_dependency" },
      },
    ]);
    expect(unknownActions).toMatchObject([
      { type: "started" },
      { type: "progress", summary: "awaiting_dependency" },
    ]);
    expect(states.get("sub-future")?.completed).toBe(false);

    expect(
      reconcileKiroNativeSubagents(states, [
        {
          sessionId: "sub-future",
          initialQuery: "wait for dependency",
          status: { type: "paused", message: "waiting for input" },
        },
      ]),
    ).toMatchObject([{ type: "progress", summary: "waiting for input" }]);
    expect(states.get("sub-future")?.completed).toBe(false);
  });

  it("falls back to session name and agent name and settles open tasks at turn end", () => {
    const states = new Map();
    expect(
      reconcileKiroNativeSubagents(states, [
        {
          sessionId: "sub-2",
          sessionName: "Inspect modules",
          agentName: "worker",
          status: { type: "running", message: "running" },
        },
        {
          sessionId: "empty",
          sessionName: "",
          status: { type: "running" },
        },
      ]),
    ).toMatchObject([
      {
        type: "started",
        state: {
          taskId: "kiro-native:sub-2",
          description: "Inspect modules",
          role: "worker",
        },
      },
    ]);

    expect(completeOpenKiroNativeSubagents(states, "stopped")).toMatchObject([
      {
        type: "completed",
        status: "stopped",
        state: { taskId: "kiro-native:sub-2" },
      },
    ]);
    expect(completeOpenKiroNativeSubagents(states, "stopped")).toEqual([]);
  });
});

describe("finalizeKiroNativeTurn", () => {
  it.effect(
    "keeps a concurrent steer waiter blocked until native terminal events are emitted",
    () =>
      Effect.gen(function* () {
        const states = new Map();
        reconcileKiroNativeSubagents(states, [
          { sessionId: "sub-race", initialQuery: "audit", status: { type: "running" } },
        ]);
        const gate = yield* Deferred.make<void>();
        const emitStarted = yield* Deferred.make<void>();
        const releaseEmit = yield* Deferred.make<void>();
        const emitted: Array<string> = [];
        let cleared = false;

        const fiber = yield* Effect.forkChild(
          finalizeKiroNativeTurn({
            states,
            status: "stopped",
            drainEvents: Effect.void,
            emit: (action) =>
              Deferred.succeed(emitStarted, undefined).pipe(
                Effect.andThen(Deferred.await(releaseEmit)),
                Effect.andThen(
                  Effect.sync(() => {
                    emitted.push(
                      `${action.type}:${action.type === "completed" ? action.status : ""}`,
                    );
                  }),
                ),
              ),
            gate,
            clearGate: () => {
              cleared = true;
            },
          }),
        );

        yield* Deferred.await(emitStarted);
        expect(Option.isNone(yield* Deferred.poll(gate))).toBe(true);
        yield* Deferred.succeed(releaseEmit, undefined);
        yield* Deferred.await(gate);
        yield* Fiber.join(fiber);

        expect(emitted).toEqual(["completed:stopped"]);
        expect(cleared).toBe(true);
      }),
  );

  it.effect(
    "settles native tasks as failed and releases the gate when prompt processing fails",
    () =>
      Effect.gen(function* () {
        const states = new Map();
        reconcileKiroNativeSubagents(states, [
          { sessionId: "sub-failure", initialQuery: "build", status: { type: "working" } },
        ]);
        const gate = yield* Deferred.make<void>();
        const statuses: Array<string> = [];

        yield* finalizeKiroNativeTurn({
          states,
          status: "failed",
          drainEvents: Effect.void,
          emit: (action) =>
            Effect.sync(() => {
              if (action.type === "completed") statuses.push(action.status);
            }),
          gate,
          clearGate: () => undefined,
        });

        expect(statuses).toEqual(["failed"]);
        expect(Option.isSome(yield* Deferred.poll(gate))).toBe(true);
      }),
  );

  it.effect("settles native tasks as stopped when the parent session stops", () =>
    Effect.gen(function* () {
      const states = new Map();
      reconcileKiroNativeSubagents(states, [
        { sessionId: "sub-stop", initialQuery: "review", status: { type: "paused" } },
      ]);
      const gate = yield* Deferred.make<void>();
      const statuses: Array<string> = [];

      yield* finalizeKiroNativeTurn({
        states,
        status: "stopped",
        drainEvents: Effect.void,
        emit: (action) =>
          Effect.sync(() => {
            if (action.type === "completed") statuses.push(action.status);
          }),
        gate,
        clearGate: () => undefined,
      });

      expect(statuses).toEqual(["stopped"]);
    }),
  );
});

it.layer(kiroAdapterTestLayer)("KiroAdapterLive", (it) => {
  it.effect("emits native subagent lifecycle events consumable by the web runtime", () =>
    Effect.gen(function* () {
      const threadId = ThreadId.make("kiro-native-subagent-thread");
      const wrapperPath = yield* Effect.promise(makeMockKiroWrapperWithNativeSubagents);
      const adapter = yield* makeKiroAdapter(decodeKiroSettings({ binaryPath: wrapperPath }), {
        instanceId: ProviderInstanceId.make("kiro"),
      }).pipe(Effect.orDie);
      const runtimeEvents: ProviderRuntimeEvent[] = [];
      const eventsFiber = yield* Stream.runForEach(adapter.streamEvents, (event) =>
        Effect.sync(() => {
          runtimeEvents.push(event);
        }),
      ).pipe(Effect.forkChild);

      yield* adapter.startSession({
        threadId,
        provider: ProviderDriverKind.make("kiro"),
        cwd: process.cwd(),
        runtimeMode: "full-access",
        modelSelection: { instanceId: ProviderInstanceId.make("kiro"), model: "auto" },
      });
      yield* adapter.sendTurn({
        threadId,
        input: "exercise Kiro native subagents",
        attachments: [],
      });

      const taskEvents = runtimeEvents.filter(
        (event) =>
          event.type === "task.started" ||
          event.type === "task.progress" ||
          event.type === "task.completed",
      );
      expect(taskEvents.map((event) => event.type)).toEqual([
        "task.started",
        "task.progress",
        "task.progress",
        "task.completed",
      ]);
      expect(taskEvents.map((event) => event.payload)).toMatchObject([
        {
          taskId: "kiro-native:native-reviewer",
          taskType: "subagent",
          title: "Review Pearce Codes rendering",
          role: "reviewer",
          timelineBypass: true,
        },
        {
          taskId: "kiro-native:native-reviewer",
          summary: "Inspecting task cards",
          status: "running",
        },
        {
          taskId: "kiro-native:native-reviewer",
          lastToolName: "Search Kiro UI",
          status: "running",
        },
        {
          taskId: "kiro-native:native-reviewer",
          summary: "Rendering verified",
          status: "completed",
        },
      ]);
      expect(taskEvents.every((event) => event.raw?.source === "acp.kiro.extension")).toBe(true);

      yield* Fiber.interrupt(eventsFiber);
      yield* adapter.stopSession(threadId);
      yield* Effect.promise(() =>
        NodeFSP.rm(NodePath.dirname(wrapperPath), { recursive: true, force: true }),
      );
    }),
  );

  it.effect("drains ACP events and completes a prompt turn", () =>
    Effect.gen(function* () {
      const threadId = ThreadId.make("kiro-drain-barrier-thread");
      const wrapperPath = yield* Effect.promise(makeMockKiroWrapper);
      const adapter = yield* makeKiroAdapter(decodeKiroSettings({ binaryPath: wrapperPath }), {
        instanceId: ProviderInstanceId.make("kiro"),
      }).pipe(Effect.orDie);

      yield* adapter.startSession({
        threadId,
        provider: ProviderDriverKind.make("kiro"),
        cwd: process.cwd(),
        runtimeMode: "full-access",
        modelSelection: { instanceId: ProviderInstanceId.make("kiro"), model: "auto" },
      });

      const result = yield* adapter.sendTurn({
        threadId,
        input: "exercise Kiro event drain",
        attachments: [],
      });

      expect(result.threadId).toBe(threadId);
      yield* adapter.stopSession(threadId);
      yield* Effect.promise(() =>
        NodeFSP.rm(NodePath.dirname(wrapperPath), { recursive: true, force: true }),
      );
    }),
  );
});
