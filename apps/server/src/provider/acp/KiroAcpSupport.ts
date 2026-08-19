import {
  type KiroSettings,
  type ProviderApprovalDecision,
  type ProviderOptionSelection,
} from "@t3tools/contracts";
import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";
import * as ChildProcessSpawner from "effect/unstable/process/ChildProcessSpawner";
import type * as EffectAcpErrors from "effect-acp/errors";
import type * as EffectAcpSchema from "effect-acp/schema";

import * as AcpSessionRuntime from "./AcpSessionRuntime.ts";

type KiroAcpRuntimeSettings = Pick<KiroSettings, "agentName" | "binaryPath">;

export const KIRO_ACP_PROTOCOL_VERSION = "2025-08-22";

export function selectKiroPermissionOptionId(
  request: EffectAcpSchema.RequestPermissionRequest,
  decision: Exclude<ProviderApprovalDecision, "cancel">,
): string | undefined {
  const preferredKind =
    decision === "acceptForSession"
      ? "allow_always"
      : decision === "accept"
        ? "allow_once"
        : "reject_once";
  const fallbackKind =
    decision === "acceptForSession"
      ? "allow_once"
      : decision === "accept"
        ? "allow_always"
        : "reject_always";
  const option =
    request.options.find((entry) => entry.kind === preferredKind) ??
    request.options.find((entry) => entry.kind === fallbackKind);
  return option?.optionId.trim() || undefined;
}

export interface KiroAcpRuntimeInput extends Omit<
  AcpSessionRuntime.AcpSessionRuntimeOptions,
  "authMethodId" | "clientCapabilities" | "protocolVersion" | "spawn"
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
  readonly step: "set-model";
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
}): AcpSessionRuntime.AcpSpawnInput {
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
        protocolVersion: KIRO_ACP_PROTOCOL_VERSION,
        clientCapabilities: {
          fs: { readTextFile: false, writeTextFile: false },
          terminal: false,
          elicitation: { form: {}, url: {} },
        },
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
  readonly setModel: (model: string) => Effect.Effect<unknown, EffectAcpErrors.AcpError>;
}

export function applyKiroAcpModelSelection<E>(input: {
  readonly runtime: KiroAcpModelSelectionRuntime;
  readonly model: string | null | undefined;
  readonly selections: ReadonlyArray<ProviderOptionSelection> | null | undefined;
  readonly mapError: (context: KiroAcpModelSelectionErrorContext) => E;
}): Effect.Effect<void, E> {
  void input;
  return Effect.void;
}
