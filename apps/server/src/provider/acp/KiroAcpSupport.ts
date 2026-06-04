import { type KiroSettings, type ProviderOptionSelection } from "@t3tools/contracts";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";
import { ChildProcessSpawner } from "effect/unstable/process";
import type * as EffectAcpErrors from "effect-acp/errors";
import type * as EffectAcpSchema from "effect-acp/schema";

import {
  AcpSessionRuntime,
  type AcpSessionRuntimeOptions,
  type AcpSessionRuntimeShape,
  type AcpSpawnInput,
} from "./AcpSessionRuntime.ts";

type KiroAcpRuntimeSettings = Pick<KiroSettings, "agentName" | "binaryPath">;

export interface KiroAcpRuntimeInput extends Omit<
  AcpSessionRuntimeOptions,
  "authMethodId" | "spawn"
> {
  readonly childProcessSpawner: ChildProcessSpawner.ChildProcessSpawner["Service"];
  readonly kiroSettings: KiroAcpRuntimeSettings | null | undefined;
  readonly environment?: NodeJS.ProcessEnv;
  readonly modelSelection?:
    | {
        readonly model?: string | null | undefined;
        readonly options?: ReadonlyArray<ProviderOptionSelection> | null | undefined;
      }
    | null
    | undefined;
}

export interface KiroAcpModelSelectionErrorContext {
  readonly cause: EffectAcpErrors.AcpError;
  readonly step: "set-config-option" | "set-mode" | "set-model";
  readonly configId?: string;
}

function selectedAgent(
  selections: ReadonlyArray<ProviderOptionSelection> | null | undefined,
): string | undefined {
  const value = selections?.find((selection) => selection.id === "agent")?.value;
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function buildKiroAcpSpawnInput(input: {
  readonly kiroSettings: KiroAcpRuntimeSettings | null | undefined;
  readonly cwd: string;
  readonly environment?: NodeJS.ProcessEnv;
  readonly modelSelection?:
    | {
        readonly model?: string | null | undefined;
        readonly options?: ReadonlyArray<ProviderOptionSelection> | null | undefined;
      }
    | null
    | undefined;
}): AcpSpawnInput {
  const configuredAgent = input.kiroSettings?.agentName?.trim();
  const agent = selectedAgent(input.modelSelection?.options) ?? configuredAgent;
  const model = input.modelSelection?.model?.trim();
  return {
    command: input.kiroSettings?.binaryPath || "kiro-cli",
    args: [
      "acp",
      ...(agent ? (["--agent", agent] as const) : []),
      ...(model && model !== "auto" ? (["--model", model] as const) : []),
    ],
    cwd: input.cwd,
    ...(input.environment ? { env: input.environment } : {}),
  };
}

export const makeKiroAcpRuntime = (
  input: KiroAcpRuntimeInput,
): Effect.Effect<AcpSessionRuntimeShape, EffectAcpErrors.AcpError, Scope.Scope> =>
  Effect.gen(function* () {
    const acpContext = yield* Layer.build(
      AcpSessionRuntime.layer({
        ...input,
        spawn: buildKiroAcpSpawnInput({
          kiroSettings: input.kiroSettings,
          cwd: input.cwd,
          ...(input.environment ? { environment: input.environment } : {}),
          ...(input.modelSelection ? { modelSelection: input.modelSelection } : {}),
        }),
        authMethodId: null,
      }).pipe(
        Layer.provide(
          Layer.succeed(ChildProcessSpawner.ChildProcessSpawner, input.childProcessSpawner),
        ),
      ),
    );
    return yield* Effect.service(AcpSessionRuntime).pipe(Effect.provide(acpContext));
  });

interface KiroAcpModelSelectionRuntime {
  readonly getConfigOptions: AcpSessionRuntimeShape["getConfigOptions"];
  readonly getModeState: AcpSessionRuntimeShape["getModeState"];
  readonly setConfigOption: (
    configId: string,
    value: string | boolean,
  ) => Effect.Effect<unknown, EffectAcpErrors.AcpError>;
  readonly setMode: (modeId: string) => Effect.Effect<unknown, EffectAcpErrors.AcpError>;
}

function findKiroModelConfigOption(
  configOptions: ReadonlyArray<EffectAcpSchema.SessionConfigOption>,
): EffectAcpSchema.SessionConfigOption | undefined {
  return configOptions.find((option) => option.category?.trim().toLowerCase() === "model");
}

export function findKiroAgentConfigOption(
  configOptions: ReadonlyArray<EffectAcpSchema.SessionConfigOption>,
): EffectAcpSchema.SessionConfigOption | undefined {
  return configOptions.find((option) => {
    if (option.type !== "select") {
      return false;
    }
    const id = option.id.trim().toLowerCase();
    const name = option.name.trim().toLowerCase();
    const category = option.category?.trim().toLowerCase() ?? "";
    return id === "agent" || name === "agent" || category === "agent" || name.includes("agent");
  });
}

export function applyKiroAcpModelSelection<E>(input: {
  readonly runtime: KiroAcpModelSelectionRuntime;
  readonly model: string | null | undefined;
  readonly selections: ReadonlyArray<ProviderOptionSelection> | null | undefined;
  readonly mapError: (context: KiroAcpModelSelectionErrorContext) => E;
}): Effect.Effect<void, E> {
  return Effect.gen(function* () {
    const configOptions = yield* input.runtime.getConfigOptions;
    const modelConfigOption = findKiroModelConfigOption(configOptions);
    if (modelConfigOption) {
      yield* input.runtime
        .setConfigOption(modelConfigOption.id, input.model?.trim() || "auto")
        .pipe(
          Effect.mapError((cause) =>
            input.mapError({
              cause,
              step: "set-model",
              configId: modelConfigOption.id,
            }),
          ),
        );
    }

    const agent = selectedAgent(input.selections);
    if (!agent) {
      return;
    }

    const agentConfigOption = findKiroAgentConfigOption(configOptions);
    if (agentConfigOption) {
      yield* input.runtime.setConfigOption(agentConfigOption.id, agent).pipe(
        Effect.mapError((cause) =>
          input.mapError({
            cause,
            step: "set-config-option",
            configId: agentConfigOption.id,
          }),
        ),
      );
      return;
    }

    const modeState = yield* input.runtime.getModeState;
    if (!modeState?.availableModes.some((mode) => mode.id === agent)) {
      return;
    }

    yield* input.runtime.setMode(agent).pipe(
      Effect.mapError((cause) =>
        input.mapError({
          cause,
          step: "set-mode",
          configId: "mode",
        }),
      ),
    );
  });
}
