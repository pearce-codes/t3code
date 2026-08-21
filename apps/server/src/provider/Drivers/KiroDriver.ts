import {
  KiroSettings,
  ProviderDriverKind,
  type ServerProvider,
  type ServerProviderSlashCommand,
} from "@t3tools/contracts";
import * as Crypto from "effect/Crypto";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Path from "effect/Path";
import * as PubSub from "effect/PubSub";
import * as Ref from "effect/Ref";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import { ChildProcessSpawner } from "effect/unstable/process";

import * as BackgroundPolicy from "../../background/BackgroundPolicy.ts";
import { ServerConfig } from "../../config.ts";
import { ServerSettingsService } from "../../serverSettings.ts";
import { makeKiroTextGeneration } from "../../textGeneration/KiroTextGeneration.ts";
import { ProviderDriverError } from "../Errors.ts";
import { makeKiroAdapter } from "../Layers/KiroAdapter.ts";
import {
  checkKiroProviderStatus,
  makePendingKiroProvider,
  mergeKiroSlashCommandCatalogs,
  withKiroSlashCommands,
} from "../Layers/KiroProvider.ts";
import { ProviderEventLoggers } from "../Layers/ProviderEventLoggers.ts";
import { makeManagedServerProvider } from "../makeManagedServerProvider.ts";
import {
  defaultProviderContinuationIdentity,
  type ProviderDriver,
  type ProviderInstance,
} from "../ProviderDriver.ts";
import { makeManualOnlyProviderMaintenanceCapabilities } from "../providerMaintenance.ts";
import type { ServerProviderDraft } from "../providerSnapshot.ts";
import { mergeProviderInstanceEnvironment } from "../ProviderInstanceEnvironment.ts";

const decodeKiroSettings = Schema.decodeSync(KiroSettings);

const DRIVER_KIND = ProviderDriverKind.make("kiro");
const SNAPSHOT_REFRESH_INTERVAL = Duration.minutes(5);

function sameSlashCommands(
  left: ReadonlyArray<ServerProviderSlashCommand>,
  right: ReadonlyArray<ServerProviderSlashCommand>,
): boolean {
  return (
    left.length === right.length &&
    left.every((command, index) => {
      const other = right[index];
      return (
        other !== undefined &&
        command.name === other.name &&
        command.description === other.description &&
        command.input?.hint === other.input?.hint
      );
    })
  );
}

export type KiroDriverEnv =
  | BackgroundPolicy.BackgroundPolicy
  | ChildProcessSpawner.ChildProcessSpawner
  | Crypto.Crypto
  | FileSystem.FileSystem
  | Path.Path
  | ProviderEventLoggers
  | ServerConfig
  | ServerSettingsService;

const withInstanceIdentity =
  (input: {
    readonly instanceId: ProviderInstance["instanceId"];
    readonly displayName: string | undefined;
    readonly accentColor: string | undefined;
    readonly continuationGroupKey: string;
  }) =>
  (snapshot: ServerProviderDraft): ServerProvider => ({
    ...snapshot,
    instanceId: input.instanceId,
    driver: DRIVER_KIND,
    ...(input.displayName ? { displayName: input.displayName } : {}),
    ...(input.accentColor ? { accentColor: input.accentColor } : {}),
    continuation: { groupKey: input.continuationGroupKey },
  });

export const KiroDriver: ProviderDriver<KiroSettings, KiroDriverEnv> = {
  driverKind: DRIVER_KIND,
  metadata: {
    displayName: "Kiro",
    supportsMultipleInstances: true,
  },
  configSchema: KiroSettings,
  defaultConfig: (): KiroSettings => decodeKiroSettings({}),
  create: ({ instanceId, displayName, accentColor, environment, enabled, config }) =>
    Effect.gen(function* () {
      const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;
      const fileSystem = yield* FileSystem.FileSystem;
      const path = yield* Path.Path;
      const eventLoggers = yield* ProviderEventLoggers;
      const processEnv = mergeProviderInstanceEnvironment(environment);
      const continuationIdentity = defaultProviderContinuationIdentity({
        driverKind: DRIVER_KIND,
        instanceId,
      });
      const stampIdentity = withInstanceIdentity({
        instanceId,
        displayName,
        accentColor,
        continuationGroupKey: continuationIdentity.continuationKey,
      });
      const effectiveConfig = { ...config, enabled } satisfies KiroSettings;
      const maintenanceCapabilities = makeManualOnlyProviderMaintenanceCapabilities({
        provider: DRIVER_KIND,
        packageName: null,
      });
      const slashCommandsByThreadRef = yield* Ref.make<
        ReadonlyMap<string, ReadonlyArray<ServerProviderSlashCommand>>
      >(new Map());
      const slashCommandsRef = yield* Ref.make<ReadonlyArray<ServerProviderSlashCommand>>([]);
      const slashCommandChanges =
        yield* PubSub.unbounded<ReadonlyArray<ServerProviderSlashCommand>>();
      const publishSlashCommands = (input: {
        readonly threadId: string;
        readonly commands: ReadonlyArray<ServerProviderSlashCommand>;
      }): Effect.Effect<void> =>
        Ref.modify(slashCommandsByThreadRef, (current) => {
          const next = new Map(current);
          if (input.commands.length === 0) {
            next.delete(input.threadId);
          } else {
            next.set(input.threadId, [...input.commands]);
          }
          const catalogs = [...next.entries()]
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([, commands]) => commands);
          return [mergeKiroSlashCommandCatalogs(catalogs), next] as const;
        }).pipe(
          Effect.flatMap((commands) =>
            Ref.modify(slashCommandsRef, (current) =>
              sameSlashCommands(current, commands)
                ? ([false, current] as const)
                : ([true, [...commands]] as const),
            ).pipe(
              Effect.flatMap((changed) =>
                changed
                  ? Ref.get(slashCommandsRef).pipe(
                      Effect.flatMap((latest) =>
                        sameSlashCommands(latest, commands)
                          ? PubSub.publish(slashCommandChanges, [...commands]).pipe(Effect.asVoid)
                          : Effect.void,
                      ),
                    )
                  : Effect.void,
              ),
            ),
          ),
        );

      const adapter = yield* makeKiroAdapter(effectiveConfig, {
        environment: processEnv,
        ...(eventLoggers.native ? { nativeEventLogger: eventLoggers.native } : {}),
        instanceId,
        onSlashCommandsUpdated: publishSlashCommands,
      });
      const textGeneration = yield* makeKiroTextGeneration(effectiveConfig, processEnv);

      const checkProvider = checkKiroProviderStatus(effectiveConfig, processEnv).pipe(
        Effect.flatMap((checkedSnapshot) =>
          Ref.get(slashCommandsRef).pipe(
            Effect.map((commands) => withKiroSlashCommands(checkedSnapshot, commands)),
          ),
        ),
        Effect.map(stampIdentity),
        Effect.provideService(ChildProcessSpawner.ChildProcessSpawner, spawner),
      );

      const snapshot = yield* makeManagedServerProvider<KiroSettings>({
        maintenanceCapabilities,
        getSettings: Effect.succeed(effectiveConfig),
        streamSettings: Stream.never,
        haveSettingsChanged: () => false,
        initialSnapshot: (settings) =>
          makePendingKiroProvider(settings).pipe(Effect.map(stampIdentity)),
        checkProvider,
        enrichSnapshot: ({ snapshot: checkedSnapshot, publishSnapshot }) =>
          Effect.scoped(
            Effect.gen(function* () {
              const commandChanges = yield* PubSub.subscribe(slashCommandChanges);
              const publishCommands = (commands: ReadonlyArray<ServerProviderSlashCommand>) =>
                publishSnapshot({
                  ...checkedSnapshot,
                  slashCommands: [...commands],
                });
              yield* publishCommands(yield* Ref.get(slashCommandsRef));
              yield* Stream.runForEach(Stream.fromSubscription(commandChanges), publishCommands);
            }),
          ),
        refreshInterval: SNAPSHOT_REFRESH_INTERVAL,
      }).pipe(
        Effect.provideService(FileSystem.FileSystem, fileSystem),
        Effect.provideService(Path.Path, path),
        Effect.mapError(
          (cause) =>
            new ProviderDriverError({
              driver: DRIVER_KIND,
              instanceId,
              detail: `Failed to build Kiro snapshot: ${cause.message ?? String(cause)}`,
              cause,
            }),
        ),
      );

      return {
        instanceId,
        driverKind: DRIVER_KIND,
        continuationIdentity,
        displayName,
        accentColor,
        enabled,
        snapshot,
        adapter,
        textGeneration,
      } satisfies ProviderInstance;
    }),
};
