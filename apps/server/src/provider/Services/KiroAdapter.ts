/**
 * KiroAdapter - Kiro (ACP) implementation of the generic provider adapter contract.
 *
 * This service owns the ACP JSON-RPC subprocess lifecycle and emits
 * provider runtime events. It does not perform cross-provider routing,
 * shared event fan-out, or checkpoint orchestration.
 *
 * @module KiroAdapter
 */
import { ServiceMap } from "effect";

import type { ProviderAdapterError } from "../Errors.ts";
import type { ProviderAdapterShape } from "./ProviderAdapter.ts";

export interface KiroAdapterShape extends ProviderAdapterShape<ProviderAdapterError> {
  readonly provider: "kiro";
}

export class KiroAdapter extends ServiceMap.Service<KiroAdapter, KiroAdapterShape>()(
  "t3/provider/Services/KiroAdapter",
) {}
