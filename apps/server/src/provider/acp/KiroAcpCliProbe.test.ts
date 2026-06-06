/**
 * Optional integration check against a real `kiro-cli acp` install.
 * Enable with: T3_KIRO_ACP_PROBE=1 bun run test --filter KiroAcpCliProbe
 */
import * as NodeServices from "@effect/platform-node/NodeServices";
import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import { describe, expect } from "vite-plus/test";

import { AcpSessionRuntime } from "./AcpSessionRuntime.ts";

const kiroCliPath = process.env.KIRO_CLI_PATH ?? "kiro-cli";

describe.runIf(process.env.T3_KIRO_ACP_PROBE === "1")("KiroAcpCliProbe", () => {
  it.effect("starts a real Kiro ACP session without authentication", () =>
    Effect.gen(function* () {
      const runtime = yield* AcpSessionRuntime;
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
      const runtime = yield* AcpSessionRuntime;
      yield* runtime.start();

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
          clientInfo: { name: "t3-kiro-probe", version: "0.0.0" },
          authMethodId: null,
        }),
      ),
      Effect.scoped,
      Effect.provide(NodeServices.layer),
    ),
  );

  it.effect("starts with an explicit model argument and returns streamed assistant text", () =>
    Effect.gen(function* () {
      const runtime = yield* AcpSessionRuntime;
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
          clientInfo: { name: "t3-kiro-probe", version: "0.0.0" },
          authMethodId: null,
        }),
      ),
      Effect.scoped,
      Effect.provide(NodeServices.layer),
    ),
  );
});
