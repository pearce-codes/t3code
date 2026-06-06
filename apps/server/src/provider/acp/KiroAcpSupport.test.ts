import * as Effect from "effect/Effect";
import { describe, expect, it, vi } from "vite-plus/test";

import type { AcpSessionModeState } from "./AcpRuntimeModel.ts";
import { applyKiroAcpModelSelection, buildKiroAcpSpawnInput } from "./KiroAcpSupport.ts";

const noModeState = Effect.sync(() => undefined as AcpSessionModeState | undefined);
const unexpectedSelectionError = (context: { readonly step: string }): never => {
  throw new Error(`Unexpected Kiro ACP model selection error during ${context.step}`);
};

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

  it("passes configured agent and model arguments", () => {
    expect(
      buildKiroAcpSpawnInput({
        kiroSettings: {
          binaryPath: "/usr/local/bin/kiro-cli",
          agentName: "build",
        },
        cwd: "/tmp/project",
        modelSelection: {
          model: "claude-sonnet-4-6",
          options: [{ id: "agent", value: "review" }],
        },
      }),
    ).toEqual({
      command: "/usr/local/bin/kiro-cli",
      args: ["acp", "--agent", "review", "--model", "claude-sonnet-4-6"],
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

  it("skips live model config when Kiro exposes no model option", async () => {
    const setConfigOption = vi.fn((configId: string, value: string | boolean) =>
      Effect.succeed({ configId, value }),
    );
    const setMode = vi.fn((modeId: string) => Effect.succeed({ modeId }));

    await Effect.runPromise(
      applyKiroAcpModelSelection({
        runtime: {
          getConfigOptions: Effect.succeed([]),
          getModeState: noModeState,
          setConfigOption,
          setMode,
        },
        model: "claude-sonnet-4-6",
        selections: undefined,
        mapError: unexpectedSelectionError,
      }),
    );

    expect(setConfigOption).not.toHaveBeenCalled();
  });

  it("updates the live model config when Kiro exposes a model option", async () => {
    const setConfigOption = vi.fn((configId: string, value: string | boolean) =>
      Effect.succeed({ configId, value }),
    );
    const setMode = vi.fn((modeId: string) => Effect.succeed({ modeId }));

    await Effect.runPromise(
      applyKiroAcpModelSelection({
        runtime: {
          getConfigOptions: Effect.succeed([
            {
              id: "model-selector",
              name: "Model",
              category: "model",
              type: "select" as const,
              currentValue: "auto",
              options: [
                { value: "auto", name: "Auto" },
                { value: "claude-sonnet-4-6", name: "Claude Sonnet 4.6" },
              ],
            },
          ]),
          getModeState: noModeState,
          setConfigOption,
          setMode,
        },
        model: "claude-sonnet-4-6",
        selections: undefined,
        mapError: unexpectedSelectionError,
      }),
    );

    expect(setConfigOption).toHaveBeenCalledWith("model-selector", "claude-sonnet-4-6");
  });

  it("updates the live agent config when Kiro exposes an agent option", async () => {
    const setConfigOption = vi.fn((configId: string, value: string | boolean) =>
      Effect.succeed({ configId, value }),
    );
    const setMode = vi.fn((modeId: string) => Effect.succeed({ modeId }));

    await Effect.runPromise(
      applyKiroAcpModelSelection({
        runtime: {
          getConfigOptions: Effect.succeed([
            {
              id: "agent",
              name: "Agent",
              category: "agent",
              type: "select" as const,
              currentValue: "build",
              options: [
                { value: "build", name: "Build" },
                { value: "review", name: "Review" },
              ],
            },
          ]),
          getModeState: noModeState,
          setConfigOption,
          setMode,
        },
        model: "auto",
        selections: [{ id: "agent", value: "review" }],
        mapError: unexpectedSelectionError,
      }),
    );

    expect(setConfigOption).toHaveBeenCalledWith("agent", "review");
    expect(setMode).not.toHaveBeenCalled();
  });

  it("sets the ACP mode for agent selections when Kiro exposes agents as modes", async () => {
    const setConfigOption = vi.fn((configId: string, value: string | boolean) =>
      Effect.succeed({ configId, value }),
    );
    const setMode = vi.fn((modeId: string) => Effect.succeed({ modeId }));

    await Effect.runPromise(
      applyKiroAcpModelSelection({
        runtime: {
          getConfigOptions: Effect.succeed([
            {
              id: "theme",
              name: "Theme",
              category: "theme",
              type: "select" as const,
              currentValue: "dark",
              options: [{ value: "dark", name: "Dark" }],
            },
          ]),
          getModeState: Effect.succeed({
            currentModeId: "kiro_default",
            availableModes: [
              { id: "kiro_default", name: "Kiro Default" },
              { id: "kiro_planner", name: "Kiro Planner" },
            ],
          }),
          setConfigOption,
          setMode,
        },
        model: "auto",
        selections: [{ id: "agent", value: "kiro_planner" }],
        mapError: unexpectedSelectionError,
      }),
    );

    expect(setConfigOption).not.toHaveBeenCalled();
    expect(setMode).toHaveBeenCalledWith("kiro_planner");
  });

  it("does not guess a mode write when a configured agent is not advertised as an ACP mode", async () => {
    const setConfigOption = vi.fn((configId: string, value: string | boolean) =>
      Effect.succeed({ configId, value }),
    );
    const setMode = vi.fn((modeId: string) => Effect.succeed({ modeId }));

    await Effect.runPromise(
      applyKiroAcpModelSelection({
        runtime: {
          getConfigOptions: Effect.succeed([]),
          getModeState: Effect.succeed({
            currentModeId: "kiro_default",
            availableModes: [{ id: "kiro_default", name: "Kiro Default" }],
          }),
          setConfigOption,
          setMode,
        },
        model: "auto",
        selections: [{ id: "agent", value: "manually_configured_agent" }],
        mapError: unexpectedSelectionError,
      }),
    );

    expect(setConfigOption).not.toHaveBeenCalled();
    expect(setMode).not.toHaveBeenCalled();
  });
});
