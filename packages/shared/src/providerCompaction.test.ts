import { describe, expect, it } from "vitest";

import {
  isProviderCompactionProgressText,
  omitProviderCompactionProgressText,
} from "./providerCompaction.ts";

describe("providerCompaction", () => {
  it("recognizes generic Kiro compaction progress text", () => {
    expect(isProviderCompactionProgressText("Compacting conversation...")).toBe(true);
    expect(isProviderCompactionProgressText(" compacting   conversation ")).toBe(true);
  });

  it("does not treat real compaction summaries as progress text", () => {
    expect(isProviderCompactionProgressText("Earlier context summary: favorite number is 7.")).toBe(
      false,
    );
    expect(omitProviderCompactionProgressText("Earlier context summary")).toBe(
      "Earlier context summary",
    );
  });

  it("omits progress text when used as a captured compaction detail", () => {
    expect(omitProviderCompactionProgressText("Compacting conversation...")).toBeUndefined();
  });
});
