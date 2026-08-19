/**
 * Optional integration check against a real `kiro-cli acp` install.
 * Enable with: T3_KIRO_ACP_PROBE=1 bun run test --filter KiroAcpCliProbe
 */
import * as NodeServices from "@effect/platform-node/NodeServices";
import { KiroSettings } from "@t3tools/contracts";
import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import { describe, expect } from "vite-plus/test";

import { checkKiroProviderStatus } from "../Layers/KiroProvider.ts";
import * as AcpSessionRuntime from "./AcpSessionRuntime.ts";
import { KIRO_ACP_PROTOCOL_VERSION, selectKiroPermissionOptionId } from "./KiroAcpSupport.ts";

const kiroCliPath = process.env.KIRO_CLI_PATH ?? "kiro-cli";
const decodeKiroSettings = Schema.decodeUnknownEffect(KiroSettings);

describe.runIf(process.env.T3_KIRO_ACP_PROBE === "1")("KiroAcpCliProbe", () => {
  it.effect("reports the live Kiro CLI as authenticated", () =>
    Effect.gen(function* () {
      const settings = yield* decodeKiroSettings({
        enabled: true,
        binaryPath: kiroCliPath,
      });
      const provider = yield* checkKiroProviderStatus(settings);

      expect(provider.installed).toBe(true);
      expect(provider.status).toBe("ready");
      expect(provider.auth.status).toBe("authenticated");
      expect(provider.version).toBeTruthy();
    }).pipe(Effect.provide(NodeServices.layer)),
  );

  it.effect("starts a real Kiro ACP session without authentication", () =>
    Effect.gen(function* () {
      const runtime = yield* AcpSessionRuntime.AcpSessionRuntime;
      const started = yield* runtime.start();

      expect(started.initializeResult.agentInfo?.name).toBe("Kiro CLI Agent");
      expect(started.initializeResult.authMethods ?? []).toEqual([]);
      expect(typeof started.sessionId).toBe("string");
      expect(started.sessionSetupResult.models?.availableModels?.length ?? 0).toBeGreaterThan(0);
      expect(started.sessionSetupResult.modes?.availableModes?.length ?? 0).toBeGreaterThan(0);
    }).pipe(
      Effect.provide(
        AcpSessionRuntime.layer({
          spawn: {
            command: kiroCliPath,
            args: ["acp"],
            cwd: process.cwd(),
          },
          cwd: process.cwd(),
          protocolVersion: KIRO_ACP_PROTOCOL_VERSION,
          clientCapabilities: {
            fs: { readTextFile: false, writeTextFile: false },
            terminal: false,
            elicitation: { form: {}, url: {} },
          },
          clientInfo: { name: "t3-kiro-probe", version: "0.0.0" },
          authMethodId: null,
        }),
      ),
      Effect.scoped,
      Effect.provide(NodeServices.layer),
    ),
  );

  it.effect("completes a prompt turn", () =>
    Effect.gen(function* () {
      const runtime = yield* AcpSessionRuntime.AcpSessionRuntime;
      const started = yield* runtime.start();

      const currentModeId = started.sessionSetupResult.modes?.currentModeId;
      const alternateMode = started.sessionSetupResult.modes?.availableModes.find(
        (mode) => mode.id !== currentModeId,
      );
      if (alternateMode && currentModeId) {
        yield* runtime.setSessionMode(alternateMode.id);
        yield* runtime.setSessionMode(currentModeId);
      }

      const result = yield* runtime.prompt({
        prompt: [{ type: "text", text: "Reply with exactly OK and nothing else." }],
      });
      expect(result.stopReason).toBe("end_turn");

      const events = Array.from(yield* Stream.runCollect(Stream.take(runtime.getEvents(), 3)));
      expect(events.some((event) => event._tag === "ContentDelta")).toBe(true);
    }).pipe(
      Effect.provide(
        AcpSessionRuntime.layer({
          spawn: {
            command: kiroCliPath,
            args: ["acp"],
            cwd: process.cwd(),
          },
          cwd: process.cwd(),
          protocolVersion: KIRO_ACP_PROTOCOL_VERSION,
          clientCapabilities: {
            fs: { readTextFile: false, writeTextFile: false },
            terminal: false,
            elicitation: { form: {}, url: {} },
          },
          clientInfo: { name: "t3-kiro-probe", version: "0.0.0" },
          authMethodId: null,
        }),
      ),
      Effect.scoped,
      Effect.provide(NodeServices.layer),
    ),
  );

  it.effect("approves a live Kiro tool call with its advertised option id", () => {
    let permissionRequests = 0;
    return Effect.gen(function* () {
      const runtime = yield* AcpSessionRuntime.AcpSessionRuntime;
      yield* runtime.handleRequestPermission((request) =>
        Effect.sync(() => {
          permissionRequests += 1;
          const optionId = selectKiroPermissionOptionId(request, "accept");
          return optionId
            ? { outcome: { outcome: "selected" as const, optionId } }
            : { outcome: { outcome: "cancelled" as const } };
        }),
      );
      yield* runtime.start();

      const result = yield* runtime.prompt({
        prompt: [
          {
            type: "text",
            text: "Use a shell tool to run pwd without modifying anything, then reply with only the resulting path.",
          },
        ],
      });

      expect(result.stopReason).toBe("end_turn");
      expect(permissionRequests).toBeGreaterThan(0);
    }).pipe(
      Effect.provide(
        AcpSessionRuntime.layer({
          spawn: {
            command: kiroCliPath,
            args: ["acp"],
            cwd: process.cwd(),
          },
          cwd: process.cwd(),
          protocolVersion: KIRO_ACP_PROTOCOL_VERSION,
          clientCapabilities: {
            fs: { readTextFile: false, writeTextFile: false },
            terminal: false,
            elicitation: { form: {}, url: {} },
          },
          clientInfo: { name: "t3-kiro-probe", version: "0.0.0" },
          authMethodId: null,
        }),
      ),
      Effect.scoped,
      Effect.provide(NodeServices.layer),
    );
  });

  it.effect("starts with an explicit model argument and returns streamed assistant text", () =>
    Effect.gen(function* () {
      const runtime = yield* AcpSessionRuntime.AcpSessionRuntime;
      yield* runtime.start();

      const result = yield* runtime.prompt({
        prompt: [
          {
            type: "text",
            text: "Make a 2-step plan for checking a TypeScript build. Keep it brief.",
          },
        ],
      });
      expect(result.stopReason).toBe("end_turn");

      const events = Array.from(yield* Stream.runCollect(Stream.take(runtime.getEvents(), 3)));
      expect(events.some((event) => event._tag === "ContentDelta")).toBe(true);
    }).pipe(
      Effect.provide(
        AcpSessionRuntime.layer({
          spawn: {
            command: kiroCliPath,
            args: ["acp", "--model", "auto"],
            cwd: process.cwd(),
          },
          cwd: process.cwd(),
          protocolVersion: KIRO_ACP_PROTOCOL_VERSION,
          clientCapabilities: {
            fs: { readTextFile: false, writeTextFile: false },
            terminal: false,
            elicitation: { form: {}, url: {} },
          },
          clientInfo: { name: "t3-kiro-probe", version: "0.0.0" },
          authMethodId: null,
        }),
      ),
      Effect.scoped,
      Effect.provide(NodeServices.layer),
    ),
  );
});
