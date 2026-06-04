import "../../index.css";

import type { LocalApi } from "@t3tools/contracts";
import { DEFAULT_RESOLVED_KEYBINDINGS } from "@t3tools/shared/keybindings";
import { page } from "vitest/browser";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { OpenInPicker } from "./OpenInPicker";

const { readLocalApiMock, openInEditorMock } = vi.hoisted(() => ({
  openInEditorMock: vi.fn<LocalApi["shell"]["openInEditor"]>().mockResolvedValue(undefined),
  readLocalApiMock: vi.fn(() => ({
    shell: {
      openInEditor: openInEditorMock,
    },
  })),
}));

vi.mock("~/localApi", () => ({
  readLocalApi: readLocalApiMock,
}));

describe("OpenInPicker", () => {
  afterEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
    readLocalApiMock.mockClear();
    openInEditorMock.mockClear();
  });

  it("opens SSH contexts with the first available Remote-SSH capable editor", async () => {
    const screen = await render(
      <OpenInPicker
        keybindings={DEFAULT_RESOLVED_KEYBINDINGS}
        availableEditors={["cursor", "vscode"]}
        openInCwd="/home/pearce/project"
        launchContext={{
          remote: {
            type: "ssh",
            authority: "devbox",
          },
        }}
      />,
    );

    try {
      await page.getByRole("button", { name: "Open" }).click();

      await vi.waitFor(() => {
        expect(openInEditorMock).toHaveBeenCalledWith("/home/pearce/project", "vscode", {
          remote: {
            type: "ssh",
            authority: "devbox",
          },
        });
      });
    } finally {
      await screen.unmount();
    }
  });
});
