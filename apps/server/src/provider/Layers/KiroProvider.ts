import {
  type KiroSettings,
  type ModelCapabilities,
  type ServerProviderModel,
  type ServerProviderSlashCommand,
} from "@t3tools/contracts";
import { createModelCapabilities } from "@t3tools/shared/model";
import { resolveSpawnCommand } from "@t3tools/shared/shell";
import * as Cause from "effect/Cause";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

import type { AcpAvailableCommand } from "../acp/AcpRuntimeModel.ts";
import { discoverKiroAgents, type KiroDiscoveredAgent } from "./KiroAgentDiscovery.ts";

import {
  buildSelectOptionDescriptor,
  buildServerProvider,
  isCommandMissingCause,
  parseGenericCliVersion,
  providerModelsFromSettings,
  spawnAndCollect,
  type ServerProviderDraft,
} from "../providerSnapshot.ts";

const KIRO_PRESENTATION = {
  displayName: "Kiro",
  badgeLabel: "Early Access",
  showInteractionModeToggle: true,
} as const;

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

export function kiroSlashCommandsFromAcp(
  commands: ReadonlyArray<AcpAvailableCommand>,
): ReadonlyArray<ServerProviderSlashCommand> {
  const commandsByName = new Map<string, ServerProviderSlashCommand>();
  for (const command of commands) {
    const name = command.name.trim().replace(/^\/+/, "");
    if (!name) continue;
    const key = name.toLowerCase();
    const description = command.description?.trim() || undefined;
    const inputHint = command.inputHint?.trim() || undefined;
    const existing = commandsByName.get(key);
    commandsByName.set(key, {
      name: existing?.name ?? name,
      ...(existing?.description
        ? { description: existing.description }
        : description
          ? { description }
          : {}),
      ...(existing?.input?.hint
        ? { input: { hint: existing.input.hint } }
        : inputHint
          ? { input: { hint: inputHint } }
          : {}),
    });
  }
  return [...commandsByName.values()];
}

export function mergeKiroSlashCommandCatalogs(
  catalogs: ReadonlyArray<ReadonlyArray<ServerProviderSlashCommand>>,
): ReadonlyArray<ServerProviderSlashCommand> {
  const commandsByName = new Map<string, ServerProviderSlashCommand>();
  for (const catalog of catalogs) {
    for (const command of catalog) {
      const key = command.name.toLowerCase();
      const existing = commandsByName.get(key);
      commandsByName.set(key, {
        name: existing?.name ?? command.name,
        ...(existing?.description
          ? { description: existing.description }
          : command.description
            ? { description: command.description }
            : {}),
        ...(existing?.input?.hint
          ? { input: { hint: existing.input.hint } }
          : command.input?.hint
            ? { input: { hint: command.input.hint } }
            : {}),
      });
    }
  }
  return [...commandsByName.values()].sort((left, right) =>
    left.name.localeCompare(right.name, undefined, { sensitivity: "base" }),
  );
}

export function withKiroSlashCommands(
  snapshot: ServerProviderDraft,
  commands: ReadonlyArray<ServerProviderSlashCommand>,
): ServerProviderDraft {
  return { ...snapshot, slashCommands: [...commands] };
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

export const KIRO_EFFORT_LEVELS = ["low", "medium", "high", "xhigh", "max"] as const;

export function isKiroEffortLevel(value: unknown): value is (typeof KIRO_EFFORT_LEVELS)[number] {
  return typeof value === "string" && KIRO_EFFORT_LEVELS.some((effort) => effort === value);
}

function buildKiroEffortDescriptor() {
  return buildSelectOptionDescriptor({
    id: "effort",
    label: "Effort",
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
      { value: "xhigh", label: "Extra High" },
      { value: "max", label: "Max" },
    ],
    description: "Reasoning effort passed to the Kiro ACP session.",
  });
}

export function withKiroEffortCapabilities(
  models: ReadonlyArray<ServerProviderModel>,
): ReadonlyArray<ServerProviderModel> {
  return models.map((model) => {
    const existingDescriptors = model.capabilities?.optionDescriptors ?? [];
    return {
      ...model,
      capabilities: createModelCapabilities({
        optionDescriptors: [
          buildKiroEffortDescriptor(),
          ...existingDescriptors.filter((descriptor) => descriptor.id !== "effort"),
        ],
      }),
    };
  });
}

function resolvedKiroAgents(
  settings: KiroSettings,
  discoveredAgents: ReadonlyArray<KiroDiscoveredAgent>,
): ReadonlyArray<KiroDiscoveredAgent> {
  const configuredAgents = configuredKiroAgents(settings);
  const names = uniqueNonEmpty([
    ...discoveredAgents.map((agent) => agent.name),
    ...configuredAgents,
  ]);
  const explicitDefault = settings.agentName.trim();
  const defaultName =
    explicitDefault ||
    discoveredAgents.find((agent) => agent.isDefault)?.name ||
    configuredAgents[0] ||
    names[0];
  return names.map((name) => ({ name, isDefault: name === defaultName }));
}

function kiroModelCapabilities(
  settings: KiroSettings,
  discoveredAgents: ReadonlyArray<KiroDiscoveredAgent> = [],
): ModelCapabilities {
  const agents = resolvedKiroAgents(settings, discoveredAgents);
  const effortDescriptor = buildKiroEffortDescriptor();
  const agentDescriptor =
    agents.length > 0
      ? buildSelectOptionDescriptor({
          id: "agent",
          label: "Agent",
          options: agents.map((agent) => ({
            value: agent.name,
            label: titleCaseSlug(agent.name),
            isDefault: agent.isDefault,
          })),
          description: "Kiro agent passed to the ACP session.",
        })
      : null;
  return createModelCapabilities({
    optionDescriptors: [effortDescriptor, ...(agentDescriptor ? [agentDescriptor] : [])],
  });
}

export function buildKiroModels(
  settings: KiroSettings,
  discoveredAgents: ReadonlyArray<KiroDiscoveredAgent> = [],
): ReadonlyArray<ServerProviderModel> {
  const capabilities = kiroModelCapabilities(settings, discoveredAgents);
  return providerModelsFromSettings(
    [
      {
        slug: "auto",
        name: "Auto",
        isCustom: false,
        capabilities,
      },
    ],
    settings.customModels,
    capabilities,
  );
}

export const makePendingKiroProvider = (
  settings: KiroSettings,
): Effect.Effect<ServerProviderDraft> =>
  Effect.gen(function* () {
    const checkedAt = yield* Effect.map(DateTime.now, DateTime.formatIso);
    const models = buildKiroModels(settings);

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
  const configuredModels = buildKiroModels(settings);

  if (!settings.enabled) {
    return buildServerProvider({
      presentation: KIRO_PRESENTATION,
      enabled: false,
      checkedAt,
      models: configuredModels,
      probe: {
        installed: false,
        version: null,
        status: "warning",
        auth: { status: "unknown" },
        message: "Kiro is disabled in T3 Code settings.",
      },
    });
  }

  const spawnCommand = yield* resolveSpawnCommand(settings.binaryPath, ["--version"], {
    env: environment,
  });
  const versionExit = yield* Effect.exit(
    spawnAndCollect(
      settings.binaryPath,
      ChildProcess.make(spawnCommand.command, spawnCommand.args, {
        env: environment,
        shell: spawnCommand.shell,
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
      models: configuredModels,
      probe: {
        installed: !(cause instanceof Error && isCommandMissingCause(cause)),
        version: null,
        status: "error",
        auth: { status: "unknown" },
        message,
      },
    });
  }

  const agentDiscoveryExit = yield* Effect.exit(
    discoverKiroAgents(settings.binaryPath, environment),
  );
  const discoveredAgents = agentDiscoveryExit._tag === "Success" ? agentDiscoveryExit.value : [];
  const models = buildKiroModels(settings, discoveredAgents);
  const version = parseGenericCliVersion(versionExit.value.stdout) ?? null;
  const availabilityMessage = version
    ? `Kiro CLI v${version} is available.`
    : "Kiro CLI is available.";
  return buildServerProvider({
    presentation: KIRO_PRESENTATION,
    enabled: true,
    checkedAt,
    models,
    probe: {
      installed: true,
      version,
      status: "ready",
      auth: { status: "unknown", type: "kiro" },
      message:
        discoveredAgents.length > 0
          ? `${availabilityMessage} Discovered ${discoveredAgents.length} agents.`
          : availabilityMessage,
    },
  });
});
