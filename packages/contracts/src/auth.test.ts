import assert from "node:assert/strict";
import { it } from "@effect/vitest";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { AuthBrowserSessionResult, AuthSessionState, AuthWebSocketTicketResult } from "./auth.ts";

const decodeAuthBrowserSessionResult = Schema.decodeUnknownEffect(AuthBrowserSessionResult);
const encodeAuthBrowserSessionResult = Schema.encodeEffect(AuthBrowserSessionResult);
const decodeAuthSessionState = Schema.decodeUnknownEffect(AuthSessionState);
const decodeAuthWebSocketTicketResult = Schema.decodeUnknownEffect(AuthWebSocketTicketResult);

it.effect("decodes browser session datetime strings at the wire boundary", () =>
  Effect.gen(function* () {
    const decoded = yield* decodeAuthBrowserSessionResult({
      authenticated: true,
      scopes: ["orchestration:read", "orchestration:operate"],
      sessionMethod: "bearer-access-token",
      expiresAt: "2026-05-01T12:00:00.000Z",
    });

    assert.equal(DateTime.formatIso(decoded.expiresAt), "2026-05-01T12:00:00.000Z");
    assert.deepEqual(yield* encodeAuthBrowserSessionResult(decoded), {
      authenticated: true,
      scopes: ["orchestration:read", "orchestration:operate"],
      sessionMethod: "bearer-access-token",
      expiresAt: "2026-05-01T12:00:00.000Z",
    });
  }),
);

it.effect("decodes auth session and websocket ticket datetime strings", () =>
  Effect.gen(function* () {
    const session = yield* decodeAuthSessionState({
      authenticated: true,
      auth: {
        policy: "remote-reachable",
        bootstrapMethods: ["one-time-token"],
        sessionMethods: ["bearer-access-token"],
        sessionCookieName: "t3_session",
      },
      scopes: ["orchestration:read"],
      sessionMethod: "bearer-access-token",
      expiresAt: "2026-05-01T12:00:00.000Z",
    });
    const ticket = yield* decodeAuthWebSocketTicketResult({
      ticket: "ws-ticket",
      expiresAt: "2026-05-01T12:05:00.000Z",
    });
    assert.ok(session.expiresAt);

    assert.equal(DateTime.formatIso(session.expiresAt), "2026-05-01T12:00:00.000Z");
    assert.equal(DateTime.formatIso(ticket.expiresAt), "2026-05-01T12:05:00.000Z");
  }),
);
