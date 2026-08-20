import { EnvironmentId, type EditorId } from "@t3tools/contracts";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { reactHookHarness as hooks } from "./test/reactHookHarness";

const remoteState = vi.hoisted(() => ({
  value: {
    mode: "remote-links" as const,
    host: { kind: "ssh-alias" as const, host: "devbox" },
  },
  editors: ["vscode"] as ReadonlyArray<EditorId>,
}));

const launches = vi.hoisted(() => ({
  local: vi.fn(),
  remote: vi.fn(async () => true),
}));

const preferences = vi.hoisted(() => ({
  editor: null as EditorId | null,
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  const { reactHookHarness } = await import("./test/reactHookHarness");
  return {
    ...actual,
    useCallback: reactHookHarness.useCallback,
  };
});

vi.mock("./hooks/useLocalStorage", () => ({
  getLocalStorageItem: () => preferences.editor,
  setLocalStorageItem: (_key: string, editor: EditorId) => {
    preferences.editor = editor;
  },
  useLocalStorage: () => [preferences.editor, vi.fn()],
}));

vi.mock("./state/use-atom-command", () => ({
  useAtomCommand: () => launches.local,
}));

vi.mock("./remoteOpen", () => ({
  openRemoteEditorUrl: launches.remote,
  useRemoteCapableEditors: () => remoteState.editors,
  useRemoteOpenState: () => remoteState.value,
}));

import { useOpenInPreferredEditor } from "./editorPreferences";

const environmentId = EnvironmentId.make("remote-environment");

describe("useOpenInPreferredEditor", () => {
  beforeEach(() => {
    hooks.reset();
    launches.local.mockReset();
    launches.remote.mockClear();
    launches.remote.mockResolvedValue(true);
    preferences.editor = null;
    remoteState.value = {
      mode: "remote-links",
      host: { kind: "ssh-alias", host: "devbox" },
    };
    remoteState.editors = ["vscode"];
  });

  it("opens an agent file link in the local editor through the remote SSH target", async () => {
    hooks.beginRender();
    const open = useOpenInPreferredEditor(environmentId, ["zed"]);

    const result = await open("/srv/project/src/app.ts:12:4");

    expect(result._tag).toBe("Success");
    expect(launches.remote).toHaveBeenCalledWith(
      "vscode://vscode-remote/ssh-remote+devbox/srv/project/src/app.ts",
    );
    expect(launches.local).not.toHaveBeenCalled();
    expect(preferences.editor).toBe("vscode");
  });
});
