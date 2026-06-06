import {
  ProviderDriverKind,
  type KiroSettings,
  type ModelCapabilities,
  type ProviderOptionDescriptor,
  type ServerProviderModel,
} from "@t3tools/contracts";
import { createModelCapabilities } from "@t3tools/shared/model";
import type * as EffectAcpErrors from "effect-acp/errors";
import type * as EffectAcpSchema from "effect-acp/schema";
import * as Cause from "effect/Cause";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

import {
  buildSelectOptionDescriptor,
  buildServerProvider,
  isCommandMissingCause,
  parseGenericCliVersion,
  providerModelsFromSettings,
  spawnAndCollect,
  type ServerProviderDraft,
} from "../providerSnapshot.ts";
import { findKiroAgentConfigOption, makeKiroAcpRuntime } from "../acp/KiroAcpSupport.ts";

const PROVIDER = ProviderDriverKind.make("kiro");
const KIRO_PRESENTATION = {
  displayName: "Kiro",
  badgeLabel: "Early Access",
  showInteractionModeToggle: false,
} as const;
const KIRO_ACP_MODEL_DISCOVERY_TIMEOUT_MS = 10_000;

export interface KiroAcpProviderDiscovery {
  readonly modelState?: EffectAcpSchema.SessionModelState | null | undefined;
  readonly configOptions?: ReadonlyArray<EffectAcpSchema.SessionConfigOption> | null | undefined;
  readonly modeState?: EffectAcpSchema.SessionModeState | null | undefined;
}

interface KiroSessionSelectOption {
  readonly value: string;
  readonly name: string;
  readonly description?: string;
}

function titleCaseSlug(value: string): string {
  return value
    .split(/[-_/\s]+/)
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function uniqueNonEmpty(values: ReadonlyArray<string>): ReadonlyArray<string> {
  const seen = new Set<string>();
  const output: Array<string> = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    output.push(trimmed);
  }
  return output;
}

function joinProviderMessages(...messages: ReadonlyArray<string | undefined>): string | undefined {
  const parts = messages
    .map((message) => message?.trim())
    .filter((message): message is string => Boolean(message));
  return parts.length > 0 ? parts.join(" ") : undefined;
}

function toKiroSessionSelectOption(
  option: EffectAcpSchema.SessionConfigSelectOption,
): KiroSessionSelectOption {
  const normalized: {
    value: string;
    name: string;
    description?: string;
  } = {
    value: option.value.trim(),
    name: option.name.trim(),
  };
  const description = option.description?.trim();
  if (description) {
    normalized.description = description;
  }
  return normalized;
}

function configuredKiroAgents(settings: KiroSettings): ReadonlyArray<string> {
  return uniqueNonEmpty([
    settings.agentName,
    ...settings.agentNames
      .split(/\r?\n|,/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  ]);
}

export function resolveKiroAcpBaseModelId(model: string | null | undefined): string {
  return model?.trim() || "auto";
}

function flattenSessionConfigSelectOptions(
  configOption: EffectAcpSchema.SessionConfigOption | undefined,
): ReadonlyArray<KiroSessionSelectOption> {
  if (!configOption || configOption.type !== "select") {
    return [];
  }
  return configOption.options.flatMap((entry) =>
    "value" in entry
      ? [toKiroSessionSelectOption(entry)]
      : entry.options.map(toKiroSessionSelectOption),
  );
}

function kiroAgentDescriptorFromSettings(
  settings: KiroSettings,
): ProviderOptionDescriptor | undefined {
  const agents = configuredKiroAgents(settings);
  if (agents.length === 0) {
    return undefined;
  }
  return buildSelectOptionDescriptor({
    id: "agent",
    label: "Agent",
    options: agents.map((agent, index) => ({
      value: agent,
      label: titleCaseSlug(agent),
      isDefault: settings.agentName.trim() ? agent === settings.agentName.trim() : index === 0,
    })),
    description: "Kiro agent passed to the ACP session.",
  });
}

function kiroAgentDescriptorFromConfigOptions(
  configOptions: ReadonlyArray<EffectAcpSchema.SessionConfigOption> | null | undefined,
): ProviderOptionDescriptor | undefined {
  const agentOption = findKiroAgentConfigOption(configOptions ?? []);
  const agentChoices = flattenSessionConfigSelectOptions(agentOption);
  if (!agentOption || agentChoices.length === 0) {
    return undefined;
  }
  const currentValue =
    agentOption.type === "select" ? agentOption.currentValue?.trim() || undefined : undefined;
  return buildSelectOptionDescriptor({
    id: "agent",
    label: agentOption.name.trim() || "Agent",
    options: agentChoices.map((agent, index) => {
      const option: {
        value: string;
        label: string;
        description?: string;
        isDefault?: boolean;
      } = {
        value: agent.value,
        label: agent.name || titleCaseSlug(agent.value),
        isDefault: currentValue ? agent.value === currentValue : index === 0,
      };
      if (agent.description) {
        option.description = agent.description;
      }
      return option;
    }),
    description: agentOption.description?.trim() || "Kiro agent passed to the ACP session.",
  });
}

function kiroAgentDescriptorFromModes(
  modeState: EffectAcpSchema.SessionModeState | null | undefined,
): ProviderOptionDescriptor | undefined {
  if (!modeState || modeState.availableModes.length === 0) {
    return undefined;
  }
  const currentModeId = modeState.currentModeId.trim();
  return buildSelectOptionDescriptor({
    id: "agent",
    label: "Agent",
    options: modeState.availableModes
      .map((mode) => {
        const value = mode.id.trim();
        if (!value) return null;
        const label = mode.name.trim() || titleCaseSlug(value);
        const description = mode.description?.trim();
        return {
          value,
          label,
          ...(description ? { description } : {}),
          isDefault: currentModeId ? value === currentModeId : false,
        };
      })
      .filter((option): option is NonNullable<typeof option> => option !== null),
    description: "Kiro ACP agent mode.",
  });
}

function kiroModelCapabilities(
  settings: KiroSettings,
  discovery?: KiroAcpProviderDiscovery,
): ModelCapabilities {
  const agentDescriptor =
    kiroAgentDescriptorFromConfigOptions(discovery?.configOptions) ??
    kiroAgentDescriptorFromModes(discovery?.modeState) ??
    kiroAgentDescriptorFromSettings(settings);
  return createModelCapabilities({
    optionDescriptors: agentDescriptor ? [agentDescriptor] : [],
  });
}

function kiroBuiltInModelsFromDiscovery(
  discovery: KiroAcpProviderDiscovery | undefined,
  capabilities: ModelCapabilities,
): ReadonlyArray<ServerProviderModel> {
  const modelState = discovery?.modelState;
  if (!modelState) {
    return [
      {
        slug: "auto",
        name: "Auto",
        isCustom: false,
        capabilities,
      },
    ];
  }

  const seen = new Set<string>();
  const models: ServerProviderModel[] = [];
  const addModel = (model: { readonly modelId: string; readonly name: string }) => {
    const slug = model.modelId.trim();
    if (!slug || seen.has(slug)) {
      return;
    }
    seen.add(slug);
    models.push({
      slug,
      name: model.name.trim() || titleCaseSlug(slug),
      isCustom: false,
      capabilities,
    });
  };

  const currentModelId = modelState.currentModelId.trim();
  if (currentModelId) {
    addModel({
      modelId: currentModelId,
      name: currentModelId === "auto" ? "Auto" : titleCaseSlug(currentModelId),
    });
  }
  for (const model of modelState.availableModels) {
    addModel(model);
  }

  return models.length > 0
    ? models
    : [
        {
          slug: "auto",
          name: "Auto",
          isCustom: false,
          capabilities,
        },
      ];
}

export function buildKiroProviderModels(
  settings: KiroSettings,
  discovery?: KiroAcpProviderDiscovery,
): ReadonlyArray<ServerProviderModel> {
  const capabilities = kiroModelCapabilities(settings, discovery);
  return providerModelsFromSettings(
    kiroBuiltInModelsFromDiscovery(discovery, capabilities),
    PROVIDER,
    settings.customModels,
    capabilities,
  );
}

const discoverKiroAcpProviderState = (
  settings: KiroSettings,
  environment: NodeJS.ProcessEnv = process.env,
): Effect.Effect<
  KiroAcpProviderDiscovery,
  EffectAcpErrors.AcpError,
  ChildProcessSpawner.ChildProcessSpawner
> =>
  Effect.scoped(
    Effect.gen(function* () {
      const childProcessSpawner = yield* ChildProcessSpawner.ChildProcessSpawner;
      const runtime = yield* makeKiroAcpRuntime({
        kiroSettings: settings,
        childProcessSpawner,
        cwd: process.cwd(),
        environment,
        clientInfo: { name: "t3-code-provider-probe", version: "0.0.0" },
      });
      const started = yield* runtime.start();
      return {
        modelState: started.sessionSetupResult.models,
        configOptions: started.sessionSetupResult.configOptions,
        modeState: started.sessionSetupResult.modes,
      } satisfies KiroAcpProviderDiscovery;
    }),
  );

export const makePendingKiroProvider = (
  settings: KiroSettings,
): Effect.Effect<ServerProviderDraft> =>
  Effect.gen(function* () {
    const checkedAt = yield* Effect.map(DateTime.now, DateTime.formatIso);
    const models = buildKiroProviderModels(settings);

    return buildServerProvider({
      presentation: KIRO_PRESENTATION,
      enabled: settings.enabled,
      checkedAt,
      models,
      probe: settings.enabled
        ? {
            installed: false,
            version: null,
            status: "warning",
            auth: { status: "unknown" },
            message: "Kiro provider status has not been checked in this session yet.",
          }
        : {
            installed: false,
            version: null,
            status: "warning",
            auth: { status: "unknown" },
            message: "Kiro is disabled in T3 Code settings.",
          },
    });
  });

export const checkKiroProviderStatus = Effect.fn("checkKiroProviderStatus")(function* (
  settings: KiroSettings,
  environment: NodeJS.ProcessEnv = process.env,
): Effect.fn.Return<ServerProviderDraft, never, ChildProcessSpawner.ChildProcessSpawner> {
  const checkedAt = DateTime.formatIso(yield* DateTime.now);
  const fallbackModels = buildKiroProviderModels(settings);

  if (!settings.enabled) {
    return buildServerProvider({
      presentation: KIRO_PRESENTATION,
      enabled: false,
      checkedAt,
      models: fallbackModels,
      probe: {
        installed: false,
        version: null,
        status: "warning",
        auth: { status: "unknown" },
        message: "Kiro is disabled in T3 Code settings.",
      },
    });
  }

  const versionExit = yield* Effect.exit(
    spawnAndCollect(
      settings.binaryPath,
      ChildProcess.make(settings.binaryPath, ["--version"], {
        env: environment,
        shell: process.platform === "win32",
      }),
    ),
  );

  if (versionExit._tag === "Failure") {
    const cause = Cause.squash(versionExit.cause);
    const message =
      cause instanceof Error && isCommandMissingCause(cause)
        ? "Kiro CLI (`kiro-cli`) is not installed or not on PATH."
        : cause instanceof Error
          ? `Failed to execute Kiro CLI health check: ${cause.message}`
          : "Failed to execute Kiro CLI health check.";
    return buildServerProvider({
      presentation: KIRO_PRESENTATION,
      enabled: true,
      checkedAt,
      models: fallbackModels,
      probe: {
        installed: !(cause instanceof Error && isCommandMissingCause(cause)),
        version: null,
        status: "error",
        auth: { status: "unknown" },
        message,
      },
    });
  }

  const version = parseGenericCliVersion(versionExit.value.stdout) ?? null;
  let discovery = Option.none<KiroAcpProviderDiscovery>();
  let discoveryWarning: string | undefined;
  const discoveryExit = yield* Effect.exit(
    discoverKiroAcpProviderState(settings, environment).pipe(
      Effect.timeoutOption(KIRO_ACP_MODEL_DISCOVERY_TIMEOUT_MS),
    ),
  );
  if (Exit.isFailure(discoveryExit)) {
    yield* Effect.logWarning("Kiro ACP model discovery failed", {
      cause: Cause.pretty(discoveryExit.cause),
    });
    discoveryWarning = "Kiro ACP model discovery failed. Check server logs for details.";
  } else if (Option.isNone(discoveryExit.value)) {
    discoveryWarning = `Kiro ACP model discovery timed out after ${KIRO_ACP_MODEL_DISCOVERY_TIMEOUT_MS}ms.`;
  } else {
    discovery = discoveryExit.value;
    if ((discovery.value.modelState?.availableModels.length ?? 0) === 0) {
      discoveryWarning = "Kiro ACP model discovery returned no built-in models.";
    }
  }
  const models = buildKiroProviderModels(settings, Option.getOrUndefined(discovery));
  const message = joinProviderMessages(
    version ? `Kiro CLI v${version} is available.` : "Kiro CLI is available.",
    discoveryWarning,
  );
  return buildServerProvider({
    presentation: KIRO_PRESENTATION,
    enabled: true,
    checkedAt,
    models,
    probe: {
      installed: true,
      version,
      status: discoveryWarning ? "warning" : "ready",
      auth: { status: "unknown", type: "kiro" },
      ...(message ? { message } : {}),
    },
  });
});
