import { describe, expect, it } from "vitest";

import { filterAvailableEditorsForLaunchContext } from "./editorPreferences";

describe("filterAvailableEditorsForLaunchContext", () => {
  it("keeps all editors for local launches", () => {
    expect(filterAvailableEditorsForLaunchContext(["cursor", "vscode", "zed"])).toEqual([
      "cursor",
      "vscode",
      "zed",
    ]);
  });

  it("keeps only VS Code Remote-SSH capable editors for ssh launches", () => {
    expect(
      filterAvailableEditorsForLaunchContext(["cursor", "vscode", "vscode-insiders", "zed"], {
        remote: {
          type: "ssh",
          authority: "devbox",
        },
      }),
    ).toEqual(["vscode", "vscode-insiders"]);
  });
});
