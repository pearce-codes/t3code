import { resolveSpawnCommand } from "@t3tools/shared/shell";
import * as Effect from "effect/Effect";
import { ChildProcess } from "effect/unstable/process";

import { spawnAndCollect } from "../providerSnapshot.ts";

export interface KiroDiscoveredAgent {
  readonly name: string;
  readonly isDefault: boolean;
}

function stripAnsi(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;]*[A-Za-z]|\x1b\].*?\x07/g, "");
}

export function parseKiroAgentListOutput(output: string): ReadonlyArray<KiroDiscoveredAgent> {
  const agentsByName = new Map<string, KiroDiscoveredAgent>();
  for (const line of stripAnsi(output).split(/\r?\n/)) {
    const match = line.match(
      /^(\*| )\s+([A-Za-z0-9][A-Za-z0-9_.-]*)\s{2,}(?:\(Built-in\)|Global|Workspace|Local)(?:\s|$)/,
    );
    const name = match?.[2];
    if (!name) continue;

    const isDefault = match?.[1] === "*";
    const existing = agentsByName.get(name);
    agentsByName.set(name, {
      name,
      isDefault: isDefault || existing?.isDefault === true,
    });
  }
  return [...agentsByName.values()];
}

export const discoverKiroAgents = Effect.fn("discoverKiroAgents")(function* (
  binaryPath: string,
  environment: NodeJS.ProcessEnv = process.env,
) {
  const spawnCommand = yield* resolveSpawnCommand(binaryPath, ["agent", "list"], {
    env: environment,
  });
  const result = yield* spawnAndCollect(
    binaryPath,
    ChildProcess.make(spawnCommand.command, spawnCommand.args, {
      env: environment,
      shell: spawnCommand.shell,
    }),
  );
  if (result.code !== 0) return [];

  // Kiro currently renders this command's table on stderr, but accept both
  // streams so discovery remains compatible if the CLI changes that detail.
  return parseKiroAgentListOutput(`${result.stderr}\n${result.stdout}`);
});
