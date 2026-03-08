# Kiro ACP Adapter — Implementation Plan

Integrate kiro-cli as a provider in T3 Code using the [Agent Client Protocol (ACP)](https://agentclientprotocol.com).

## Step 1: Extend `ProviderKind`

Add `"kiro"` to the `ProviderKind` literal in `packages/contracts/src/orchestration.ts`.

## Step 2: Create `KiroAdapter` service tag

`apps/server/src/provider/Services/KiroAdapter.ts` — Effect service tag extending `ProviderAdapterShape`.

## Step 3: Implement `KiroAdapter` layer

`apps/server/src/provider/Layers/KiroAdapter.ts` — live implementation that:

- Spawns `kiro-cli` as a subprocess, communicates via ACP JSON-RPC over stdio using `@agentclientprotocol/sdk` `ClientSideConnection`.
- Maps ACP lifecycle to `ProviderAdapterShape` methods:
  - `startSession` → ACP `initialize` + `session/new`
  - `sendTurn` → ACP `session/prompt`
  - `interruptTurn` → ACP `session/cancel`
  - `stopSession` → kill subprocess
  - `readThread` / `rollbackThread` → ACP `session/load` (if capability advertised)
- Maps ACP `session/update` notifications → `ProviderRuntimeEvent` stream:
  - `agent_message_chunk` → `ProviderRuntimeContentDeltaEvent` (kind: `assistant_text`)
  - `thought_message_chunk` → `ProviderRuntimeContentDeltaEvent` (kind: `reasoning_text`)
  - `tool_call` → `ProviderRuntimeItemStartedEvent`
  - `tool_call_update` → `ProviderRuntimeItemUpdatedEvent` / `ProviderRuntimeItemCompletedEvent`
  - `plan` → `ProviderRuntimeTurnPlanUpdatedEvent`
- Handles ACP agent→client requests:
  - `session/request_permission` → emit `ProviderRuntimeRequestOpenedEvent`, await UI response
  - `fs/read_text_file` / `fs/write_text_file` → delegate to server filesystem access
  - `terminal/*` → delegate to `TerminalManager`

## Step 4: Register adapter

Wire `KiroAdapter` into `ProviderAdapterRegistry` alongside `CodexAdapter`.

## Step 5: Provider health check

Add kiro-cli detection to `ProviderHealth` (check `kiro-cli --version` or similar).

## Step 6: UI provider picker

Surface `"kiro"` as a selectable provider in the web app's model/provider picker.
