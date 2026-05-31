import assert from "node:assert/strict";
import { it } from "@effect/vitest";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { AuthBearerBootstrapResult, AuthSessionState, AuthWebSocketTokenResult } from "./auth.ts";

const decodeAuthBearerBootstrapResult = Schema.decodeUnknownEffect(AuthBearerBootstrapResult);
const encodeAuthBearerBootstrapResult = Schema.encodeEffect(AuthBearerBootstrapResult);
const decodeAuthSessionState = Schema.decodeUnknownEffect(AuthSessionState);
const decodeAuthWebSocketTokenResult = Schema.decodeUnknownEffect(AuthWebSocketTokenResult);

it.effect("decodes bearer bootstrap datetime strings at the wire boundary", () =>
  Effect.gen(function* () {
    const decoded = yield* decodeAuthBearerBootstrapResult({
      authenticated: true,
      role: "client",
      sessionMethod: "bearer-session-token",
      expiresAt: "2026-05-01T12:00:00.000Z",
      sessionToken: "bearer-token",
    });

    assert.equal(DateTime.formatIso(decoded.expiresAt), "2026-05-01T12:00:00.000Z");
    assert.deepEqual(yield* encodeAuthBearerBootstrapResult(decoded), {
      authenticated: true,
      role: "client",
      sessionMethod: "bearer-session-token",
      expiresAt: "2026-05-01T12:00:00.000Z",
      sessionToken: "bearer-token",
    });
  }),
);

it.effect("decodes auth session and websocket token datetime strings", () =>
  Effect.gen(function* () {
    const session = yield* decodeAuthSessionState({
      authenticated: true,
      auth: {
        policy: "remote-reachable",
        bootstrapMethods: ["one-time-token"],
        sessionMethods: ["bearer-session-token"],
        sessionCookieName: "t3_session",
      },
      role: "client",
      sessionMethod: "bearer-session-token",
      expiresAt: "2026-05-01T12:00:00.000Z",
    });
    const token = yield* decodeAuthWebSocketTokenResult({
      token: "ws-token",
      expiresAt: "2026-05-01T12:05:00.000Z",
    });
    assert.ok(session.expiresAt);

    assert.equal(DateTime.formatIso(session.expiresAt), "2026-05-01T12:00:00.000Z");
    assert.equal(DateTime.formatIso(token.expiresAt), "2026-05-01T12:05:00.000Z");
  }),
);
