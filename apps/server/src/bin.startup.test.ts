import { expect, it, vi } from "vite-plus/test";

vi.mock("@ff-labs/fff-node", () => {
  throw new Error("simulated unavailable native workspace search module");
});

it("loads the CLI startup graph when native workspace search is unavailable", async () => {
  const cliModule = await import("./bin.ts");

  expect(cliModule.makeCli).toBeTypeOf("function");
});
