import {
  ProviderDriverKind,
  type KiroSettings,
  type ModelCapabilities,
  type ServerProviderModel,
} from "@t3tools/contracts";
import { createModelCapabilities } from "@t3tools/shared/model";
import * as Cause from "effect/Cause";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
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

const PROVIDER = ProviderDriverKind.make("kiro");
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

function kiroModelCapabilities(settings: KiroSettings): ModelCapabilities {
  const agents = configuredKiroAgents(settings);
  const agentDescriptor =
    agents.length > 0
      ? buildSelectOptionDescriptor({
          id: "agent",
          label: "Agent",
          options: agents.map((agent, index) => ({
            value: agent,
            label: titleCaseSlug(agent),
            isDefault: settings.agentName.trim()
              ? agent === settings.agentName.trim()
              : index === 0,
          })),
          description: "Kiro agent passed to the ACP session.",
        })
      : null;
  return createModelCapabilities({
    optionDescriptors: agentDescriptor ? [agentDescriptor] : [],
  });
}

function kiroModels(settings: KiroSettings): ReadonlyArray<ServerProviderModel> {
  const capabilities = kiroModelCapabilities(settings);
  return providerModelsFromSettings(
    [
      {
        slug: "auto",
        name: "Auto",
        isCustom: false,
        capabilities,
      },
    ],
    PROVIDER,
    settings.customModels,
    capabilities,
  );
}

export const makePendingKiroProvider = (
  settings: KiroSettings,
): Effect.Effect<ServerProviderDraft> =>
  Effect.gen(function* () {
    const checkedAt = yield* Effect.map(DateTime.now, DateTime.formatIso);
    const models = kiroModels(settings);

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
  const models = kiroModels(settings);

  if (!settings.enabled) {
    return buildServerProvider({
      presentation: KIRO_PRESENTATION,
      enabled: false,
      checkedAt,
      models,
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
      models,
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
      message: version ? `Kiro CLI v${version} is available.` : "Kiro CLI is available.",
    },
  });
});
