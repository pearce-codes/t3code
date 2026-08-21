import { describe, expect, it } from "@effect/vitest";
import { KiroSettings } from "@t3tools/contracts";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import {
  buildKiroModels,
  KIRO_EFFORT_LEVELS,
  kiroSlashCommandsFromAcp,
  makePendingKiroProvider,
  mergeKiroSlashCommandCatalogs,
  withKiroSlashCommands,
} from "./KiroProvider.ts";

const decodeKiroSettings = Schema.decodeSync(KiroSettings);

describe("KiroProvider", () => {
  it("normalizes, deduplicates, and enriches ACP commands for composer menus", () => {
    expect(
      kiroSlashCommandsFromAcp([
        { name: "/context", description: "Show context usage" },
        { name: "CONTEXT", inputHint: "optional scope" },
        { name: " compact ", description: " Compact this conversation " },
        { name: "", description: "ignored" },
      ]),
    ).toEqual([
      {
        name: "context",
        description: "Show context usage",
        input: { hint: "optional scope" },
      },
      {
        name: "compact",
        description: "Compact this conversation",
      },
    ]);
  });

  it("merges concurrent session command catalogs deterministically", () => {
    const firstSession = [{ name: "context", description: "Show context" }, { name: "compact" }];
    const secondSession = [
      { name: "CONTEXT", input: { hint: "optional scope" } },
      { name: "review", description: "Review changes" },
    ];

    expect(mergeKiroSlashCommandCatalogs([firstSession, secondSession])).toEqual([
      { name: "compact" },
      {
        name: "context",
        description: "Show context",
        input: { hint: "optional scope" },
      },
      { name: "review", description: "Review changes" },
    ]);
    expect(mergeKiroSlashCommandCatalogs([secondSession])).toEqual([
      { name: "CONTEXT", input: { hint: "optional scope" } },
      { name: "review", description: "Review changes" },
    ]);
  });

  it.effect("retains current commands in the base snapshot published by a health refresh", () =>
    Effect.gen(function* () {
      const checkedSnapshot = yield* makePendingKiroProvider(decodeKiroSettings({}));
      const refreshedSnapshot = withKiroSlashCommands(checkedSnapshot, [
        { name: "context", description: "Show context" },
      ]);

      expect(refreshedSnapshot.slashCommands).toEqual([
        { name: "context", description: "Show context" },
      ]);
    }),
  );

  it.effect("publishes CLI-supported effort choices before Agent for every model", () =>
    Effect.gen(function* () {
      const snapshot = yield* makePendingKiroProvider(
        decodeKiroSettings({
          agentName: "build",
          agentNames: "review",
          customModels: ["claude-sonnet-5"],
        }),
      );

      expect(snapshot.models.map((model) => model.slug)).toEqual(["auto", "claude-sonnet-5"]);
      for (const model of snapshot.models) {
        const descriptors = model.capabilities?.optionDescriptors ?? [];
        expect(descriptors.map((descriptor) => descriptor.id)).toEqual(["effort", "agent"]);

        const effort = descriptors[0];
        expect(effort?.type).toBe("select");
        if (effort?.type === "select") {
          expect(effort.options.map((option) => option.id)).toEqual(KIRO_EFFORT_LEVELS);
          expect(effort.currentValue).toBeUndefined();
          expect(effort.options.some((option) => option.isDefault)).toBe(false);
        }

        const agent = descriptors[1];
        expect(agent?.type).toBe("select");
        if (agent?.type === "select") {
          expect(agent.options).toEqual([
            { id: "build", label: "Build", isDefault: true },
            { id: "review", label: "Review" },
          ]);
        }
      }
    }),
  );

  it("merges discovered agents with configured names and preserves the configured default", () => {
    const models = buildKiroModels(
      decodeKiroSettings({
        agentName: "review",
        agentNames: "configured-only",
        customModels: ["gpt-5.6-sol"],
      }),
      [
        { name: "kiro_default", isDefault: true },
        { name: "review", isDefault: false },
        { name: "kiro_help", isDefault: false },
      ],
    );

    for (const model of models) {
      const descriptor = model.capabilities?.optionDescriptors?.find(
        (candidate) => candidate.id === "agent",
      );
      expect(descriptor?.type).toBe("select");
      if (descriptor?.type === "select") {
        expect(descriptor.options).toEqual([
          { id: "kiro_default", label: "Kiro Default" },
          { id: "review", label: "Review", isDefault: true },
          { id: "kiro_help", label: "Kiro Help" },
          { id: "configured-only", label: "Configured Only" },
        ]);
      }
    }
  });
});
