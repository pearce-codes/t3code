import { describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import type * as EffectAcpSchema from "effect-acp/schema";

import {
  applyKiroAcpModelSelection,
  buildKiroAcpSpawnInput,
  canApplyKiroEffortToRunningSession,
} from "./KiroAcpSupport.ts";

describe("buildKiroAcpSpawnInput", () => {
  it("builds the default Kiro ACP command", () => {
    expect(
      buildKiroAcpSpawnInput({
        kiroSettings: undefined,
        cwd: "/tmp/project",
      }),
    ).toEqual({
      command: "kiro-cli",
      args: ["acp"],
      cwd: "/tmp/project",
    });
  });

  it("passes configured agent, model, and CLI-supported effort arguments", () => {
    expect(
      buildKiroAcpSpawnInput({
        kiroSettings: {
          binaryPath: "/usr/local/bin/kiro-cli",
          agentName: "build",
        },
        cwd: "/tmp/project",
        modelSelection: {
          model: "claude-sonnet-4-6",
          options: [
            { id: "agent", value: "review" },
            { id: "effort", value: "xhigh" },
          ],
        },
      }),
    ).toEqual({
      command: "/usr/local/bin/kiro-cli",
      args: ["acp", "--agent", "review", "--model", "claude-sonnet-4-6", "--effort", "xhigh"],
      cwd: "/tmp/project",
    });
  });

  it("omits the model argument for auto model selection", () => {
    expect(
      buildKiroAcpSpawnInput({
        kiroSettings: {
          binaryPath: "kiro-cli",
          agentName: "build",
        },
        cwd: "/tmp/project",
        modelSelection: { model: "auto" },
      }).args,
    ).toEqual(["acp", "--agent", "build"]);
  });

  it("does not pass effort values outside Kiro CLI's supported set", () => {
    expect(
      buildKiroAcpSpawnInput({
        kiroSettings: undefined,
        cwd: "/tmp/project",
        modelSelection: {
          model: "auto",
          options: [{ id: "effort", value: "ultrathink" }],
        },
      }).args,
    ).toEqual(["acp"]);
  });
});

describe("applyKiroAcpModelSelection", () => {
  it.effect("updates an advertised effort option through ACP session config", () =>
    Effect.gen(function* () {
      const configOptions = [
        {
          id: "reasoning_effort",
          name: "Reasoning Effort",
          category: "thought_level",
          type: "select",
          currentValue: "high",
          options: [
            { value: "low", name: "Low" },
            { value: "high", name: "High" },
            { value: "extra-high", name: "Extra High" },
          ],
        },
      ] satisfies ReadonlyArray<EffectAcpSchema.SessionConfigOption>;
      const calls: Array<{ readonly configId: string; readonly value: string | boolean }> = [];

      yield* applyKiroAcpModelSelection({
        runtime: {
          getConfigOptions: Effect.succeed(configOptions),
          setConfigOption: (configId, value) =>
            Effect.sync(() => {
              calls.push({ configId, value });
            }),
        },
        model: "claude-sonnet-4-6",
        selections: [{ id: "effort", value: "xhigh" }],
        mapError: ({ cause }) => cause,
      });

      expect(calls).toEqual([{ configId: "reasoning_effort", value: "extra-high" }]);
    }),
  );

  it.effect("keeps the initial spawn-time effort when Kiro advertises no mutable option", () =>
    Effect.gen(function* () {
      let setConfigCalls = 0;

      yield* applyKiroAcpModelSelection({
        runtime: {
          getConfigOptions: Effect.succeed([]),
          setConfigOption: () =>
            Effect.sync(() => {
              setConfigCalls += 1;
            }),
        },
        model: "auto",
        selections: [{ id: "effort", value: "high" }],
        mapError: ({ cause }) => cause,
      });

      expect(setConfigCalls).toBe(0);
    }),
  );
});

describe("canApplyKiroEffortToRunningSession", () => {
  const effortOption = {
    id: "reasoning_effort",
    name: "Reasoning Effort",
    category: "thought_level",
    type: "select",
    currentValue: "high",
    options: [
      { value: "low", name: "Low" },
      { value: "extra-high", name: "Extra High" },
    ],
  } satisfies EffectAcpSchema.SessionConfigOption;

  it("accepts a second-turn effort change only when ACP advertises the selected value", () => {
    expect(canApplyKiroEffortToRunningSession([effortOption], "xhigh")).toBe(true);
    expect(canApplyKiroEffortToRunningSession([effortOption], "max")).toBe(false);
    expect(canApplyKiroEffortToRunningSession([], "high")).toBe(false);
  });
});
