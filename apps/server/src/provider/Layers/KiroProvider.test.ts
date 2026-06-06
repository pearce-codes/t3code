import type {
  KiroSettings,
  ProviderOptionDescriptor,
  ServerProviderModel,
} from "@t3tools/contracts";
import type * as EffectAcpSchema from "effect-acp/schema";
import { describe, expect, it } from "vite-plus/test";

import { buildKiroProviderModels } from "./KiroProvider.ts";

const BASE_SETTINGS: KiroSettings = {
  enabled: true,
  binaryPath: "kiro-cli",
  agentName: "",
  agentNames: "",
  customModels: [],
};

function agentDescriptor(model: ServerProviderModel): ProviderOptionDescriptor | undefined {
  return model.capabilities?.optionDescriptors?.find((descriptor) => descriptor.id === "agent");
}

describe("buildKiroProviderModels", () => {
  it("exposes fallback auto model with configured agent choices", () => {
    const models = buildKiroProviderModels({
      ...BASE_SETTINGS,
      agentName: "build",
      agentNames: "review\nspec",
      customModels: ["claude-sonnet-4-6"],
    });

    expect(models.map((model) => model.slug)).toEqual(["auto", "claude-sonnet-4-6"]);
    const descriptor = agentDescriptor(models[0]!);
    expect(descriptor).toMatchObject({
      id: "agent",
      label: "Agent",
      type: "select",
      currentValue: "build",
      options: [
        { id: "build", label: "Build", isDefault: true },
        { id: "review", label: "Review" },
        { id: "spec", label: "Spec" },
      ],
    });
    expect(agentDescriptor(models[1]!)).toEqual(descriptor);
  });

  it("uses ACP-discovered models and agent choices when available", () => {
    const modelState: EffectAcpSchema.SessionModelState = {
      currentModelId: "claude-sonnet-4-6",
      availableModels: [
        { modelId: "claude-sonnet-4-6", name: "Claude Sonnet 4.6" },
        { modelId: "claude-opus-4-7", name: "Claude Opus 4.7" },
      ],
    };
    const configOptions: ReadonlyArray<EffectAcpSchema.SessionConfigOption> = [
      {
        id: "activeAgent",
        name: "Agent",
        category: "agent",
        type: "select",
        currentValue: "review",
        options: [
          { value: "build", name: "Build" },
          { value: "review", name: "Review" },
        ],
      },
    ];

    const models = buildKiroProviderModels(
      {
        ...BASE_SETTINGS,
        agentName: "legacy",
      },
      { modelState, configOptions },
    );

    expect(models.map((model) => model.slug)).toEqual(["claude-sonnet-4-6", "claude-opus-4-7"]);
    expect(agentDescriptor(models[0]!)).toMatchObject({
      id: "agent",
      label: "Agent",
      type: "select",
      currentValue: "review",
      options: [
        { id: "build", label: "Build" },
        { id: "review", label: "Review", isDefault: true },
      ],
    });
  });

  it("uses ACP-discovered modes as agent choices when Kiro does not expose an agent config option", () => {
    const models = buildKiroProviderModels(BASE_SETTINGS, {
      modelState: {
        currentModelId: "auto",
        availableModels: [{ modelId: "claude-sonnet-4.5", name: "Claude Sonnet 4.5" }],
      },
      modeState: {
        currentModeId: "kiro_default",
        availableModes: [
          {
            id: "kiro_default",
            name: "kiro_default",
            description: "The default agent for Kiro CLI",
          },
          {
            id: "kiro_planner",
            name: "kiro_planner",
            description: "Specialized planning agent",
          },
        ],
      },
    });

    expect(agentDescriptor(models[0]!)).toMatchObject({
      id: "agent",
      label: "Agent",
      type: "select",
      currentValue: "kiro_default",
      options: [
        {
          id: "kiro_default",
          label: "kiro_default",
          isDefault: true,
        },
        {
          id: "kiro_planner",
          label: "kiro_planner",
        },
      ],
    });
  });

  it("keeps a discovered current model even when it is missing from available models", () => {
    const models = buildKiroProviderModels(BASE_SETTINGS, {
      modelState: {
        currentModelId: "auto",
        availableModels: [{ modelId: "claude-sonnet-4-6", name: "Claude Sonnet 4.6" }],
      },
    });

    expect(models.map((model) => model.slug)).toEqual(["auto", "claude-sonnet-4-6"]);
  });
});
