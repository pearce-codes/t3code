import { type KiroSettings, type ProviderOptionSelection } from "@t3tools/contracts";
import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";
import * as ChildProcessSpawner from "effect/unstable/process/ChildProcessSpawner";
import type * as EffectAcpErrors from "effect-acp/errors";
import type * as EffectAcpSchema from "effect-acp/schema";

import { isKiroEffortLevel } from "../Layers/KiroProvider.ts";
import { collectSessionConfigOptionValues } from "./AcpRuntimeModel.ts";
import * as AcpSessionRuntime from "./AcpSessionRuntime.ts";

type KiroAcpRuntimeSettings = Pick<KiroSettings, "agentName" | "binaryPath">;

export interface KiroAcpRuntimeInput extends Omit<
  AcpSessionRuntime.AcpSessionRuntimeOptions,
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
  readonly step: "set-config-option";
  readonly configId: string;
}

function selectedStringOption(
  selections: ReadonlyArray<ProviderOptionSelection> | null | undefined,
  id: string,
): string | undefined {
  const value = selections?.find((selection) => selection.id === id)?.value;
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function selectedAgent(
  selections: ReadonlyArray<ProviderOptionSelection> | null | undefined,
): string | undefined {
  return selectedStringOption(selections, "agent");
}

export function selectedKiroEffort(
  selections: ReadonlyArray<ProviderOptionSelection> | null | undefined,
): string | undefined {
  const value = selectedStringOption(selections, "effort");
  return isKiroEffortLevel(value) ? value : undefined;
}

function normalizeKiroEffort(value: string): string | undefined {
  const normalized = value.trim().toLowerCase();
  if (normalized === "extra-high" || normalized === "extra high" || normalized === "extra_high") {
    return "xhigh";
  }
  return isKiroEffortLevel(normalized) ? normalized : undefined;
}

function findKiroEffortConfigOption(
  configOptions: ReadonlyArray<EffectAcpSchema.SessionConfigOption>,
): EffectAcpSchema.SessionConfigOption | undefined {
  const candidates = configOptions.filter((option) => option.type === "select");
  return (
    candidates.find((option) => option.id.trim().toLowerCase() === "effort") ??
    candidates.find((option) => option.category?.trim().toLowerCase() === "thought_level") ??
    candidates.find((option) => {
      const label = `${option.id} ${option.name}`.toLowerCase();
      return label.includes("effort") || label.includes("reasoning");
    })
  );
}

export function canApplyKiroEffortToRunningSession(
  configOptions: ReadonlyArray<EffectAcpSchema.SessionConfigOption>,
  effort: string,
): boolean {
  const configOption = findKiroEffortConfigOption(configOptions);
  return (
    configOption !== undefined &&
    collectSessionConfigOptionValues(configOption).some(
      (value) => normalizeKiroEffort(value) === effort,
    )
  );
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
}): AcpSessionRuntime.AcpSpawnInput {
  const configuredAgent = input.kiroSettings?.agentName?.trim();
  const agent = selectedAgent(input.modelSelection?.options) ?? configuredAgent;
  const model = input.modelSelection?.model?.trim();
  const effort = selectedKiroEffort(input.modelSelection?.options);
  return {
    command: input.kiroSettings?.binaryPath || "kiro-cli",
    args: [
      "acp",
      ...(agent ? (["--agent", agent] as const) : []),
      ...(model && model !== "auto" ? (["--model", model] as const) : []),
      ...(effort ? (["--effort", effort] as const) : []),
    ],
    cwd: input.cwd,
    ...(input.environment ? { env: input.environment } : {}),
  };
}

export const makeKiroAcpRuntime = (
  input: KiroAcpRuntimeInput,
): Effect.Effect<
  AcpSessionRuntime.AcpSessionRuntime["Service"],
  EffectAcpErrors.AcpError,
  Crypto.Crypto | Scope.Scope
> =>
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
    return yield* Effect.service(AcpSessionRuntime.AcpSessionRuntime).pipe(
      Effect.provide(acpContext),
    );
  });

interface KiroAcpModelSelectionRuntime {
  readonly getConfigOptions: AcpSessionRuntime.AcpSessionRuntime["Service"]["getConfigOptions"];
  readonly setConfigOption: (
    configId: string,
    value: string | boolean,
  ) => Effect.Effect<unknown, EffectAcpErrors.AcpError>;
}

export function applyKiroAcpModelSelection<E>(input: {
  readonly runtime: KiroAcpModelSelectionRuntime;
  readonly model: string | null | undefined;
  readonly selections: ReadonlyArray<ProviderOptionSelection> | null | undefined;
  readonly mapError: (context: KiroAcpModelSelectionErrorContext) => E;
}): Effect.Effect<void, E> {
  return Effect.gen(function* () {
    const effort = selectedKiroEffort(input.selections);
    if (!effort) {
      return;
    }

    const configOption = findKiroEffortConfigOption(yield* input.runtime.getConfigOptions);
    if (!configOption) {
      return;
    }

    const configValue = collectSessionConfigOptionValues(configOption).find(
      (value) => normalizeKiroEffort(value) === effort,
    );
    if (!configValue) {
      return;
    }

    yield* input.runtime.setConfigOption(configOption.id, configValue).pipe(
      Effect.mapError((cause) =>
        input.mapError({
          cause,
          step: "set-config-option",
          configId: configOption.id,
        }),
      ),
    );
  });
}
