import { type SessionTransferArchive, type ThreadId } from "@t3tools/contracts";
import * as Effect from "effect/Effect";

import type { PreparedConnection } from "../connection/model.ts";
import { environmentEndpointUrl } from "../environment/endpoint.ts";
import { ManagedRelayDpopSigner } from "../relay/managedRelay.ts";
import { executeEnvironmentHttpRequest, makeEnvironmentHttpApiClient } from "../rpc/http.ts";
import { buildEnvironmentAuthHeaders, withEnvironmentCredentials } from "./environmentHttpAuth.ts";

const SESSION_TRANSFER_TIMEOUT_MS = 30_000;

export const exportEnvironmentSession = Effect.fn("clientRuntime.state.exportEnvironmentSession")(
  function* (input: { readonly prepared: PreparedConnection; readonly threadId: ThreadId }) {
    const signer = yield* Effect.serviceOption(ManagedRelayDpopSigner);
    const requestUrl = environmentEndpointUrl(
      input.prepared.httpBaseUrl,
      `/api/orchestration/threads/${input.threadId}/export-session`,
    );
    const client = yield* makeEnvironmentHttpApiClient(input.prepared.httpBaseUrl);
    const headers = yield* buildEnvironmentAuthHeaders(
      input.prepared.httpAuthorization,
      "GET",
      requestUrl,
      signer,
    );
    return yield* executeEnvironmentHttpRequest(
      requestUrl,
      SESSION_TRANSFER_TIMEOUT_MS,
      withEnvironmentCredentials(
        input.prepared.httpAuthorization,
        client.orchestration.exportSession({ params: { threadId: input.threadId }, headers }),
      ),
    );
  },
);

export const importEnvironmentSession = Effect.fn("clientRuntime.state.importEnvironmentSession")(
  function* (input: {
    readonly prepared: PreparedConnection;
    readonly archive: SessionTransferArchive;
  }) {
    const signer = yield* Effect.serviceOption(ManagedRelayDpopSigner);
    const requestUrl = environmentEndpointUrl(
      input.prepared.httpBaseUrl,
      "/api/orchestration/import-session",
    );
    const client = yield* makeEnvironmentHttpApiClient(input.prepared.httpBaseUrl);
    const headers = yield* buildEnvironmentAuthHeaders(
      input.prepared.httpAuthorization,
      "POST",
      requestUrl,
      signer,
    );
    return yield* executeEnvironmentHttpRequest(
      requestUrl,
      SESSION_TRANSFER_TIMEOUT_MS,
      withEnvironmentCredentials(
        input.prepared.httpAuthorization,
        client.orchestration.importSession({ payload: input.archive, headers }),
      ),
    );
  },
);
