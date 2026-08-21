import { EnvironmentId, type EditorId } from "@t3tools/contracts";
import * as Cause from "effect/Cause";
import { AsyncResult } from "effect/unstable/reactivity";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

import type { RemoteOpenState } from "./remoteOpen";
import { reactHookHarness as hooks } from "./test/reactHookHarness";

const remoteState = vi.hoisted(() => {
  const state: {
    value: RemoteOpenState;
    editors: ReadonlyArray<EditorId>;
  } = {
    value: {
      mode: "remote-links",
      host: { kind: "ssh-alias", host: "devbox" },
    },
    editors: ["vscode"],
  };
  return {
    state,
    lookup: vi.fn(() => state.value),
  };
});

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
  useRemoteCapableEditors: () => remoteState.state.editors,
  useRemoteOpenState: remoteState.lookup,
}));

import {
  PreferredEditorRemoteOpenFailedError,
  PreferredEditorRemoteOpenUnavailableError,
  useOpenInPreferredEditor,
} from "./editorPreferences";

const environmentId = EnvironmentId.make("remote-environment");

function renderOpen(availableEditors: ReadonlyArray<EditorId>) {
  hooks.beginRender();
  return useOpenInPreferredEditor(environmentId, availableEditors);
}

describe("useOpenInPreferredEditor", () => {
  beforeEach(() => {
    hooks.reset();
    launches.local.mockReset();
    launches.local.mockResolvedValue(AsyncResult.success(undefined));
    launches.remote.mockReset();
    launches.remote.mockResolvedValue(true);
    preferences.editor = null;
    remoteState.state.value = {
      mode: "remote-links",
      host: { kind: "ssh-alias", host: "devbox" },
    };
    remoteState.state.editors = ["vscode"];
    remoteState.lookup.mockClear();
  });

  it("opens a remote agent file in the local editor through its SSH target", async () => {
    const open = renderOpen(["zed"]);

    const result = await open("/srv/project/src/my app.ts:12:4");

    expect(result).toMatchObject({ _tag: "Success", value: "vscode" });
    expect(remoteState.lookup).toHaveBeenCalledWith(environmentId);
    expect(launches.remote).toHaveBeenCalledWith(
      "vscode://vscode-remote/ssh-remote+devbox/srv/project/src/my%20app.ts",
    );
    expect(launches.local).not.toHaveBeenCalled();
    expect(preferences.editor).toBe("vscode");
  });

  it("reports when the client has no SSH route to the remote environment", async () => {
    remoteState.state.value = { mode: "remote-unavailable" };
    const open = renderOpen(["vscode"]);

    const result = await open("/srv/project/src/app.ts");

    expect(result._tag).toBe("Failure");
    if (result._tag === "Failure") {
      expect(Cause.squash(result.cause)).toBeInstanceOf(PreferredEditorRemoteOpenUnavailableError);
    }
    expect(launches.remote).not.toHaveBeenCalled();
    expect(launches.local).not.toHaveBeenCalled();
  });

  it("reports when the local shell refuses the remote editor URL", async () => {
    launches.remote.mockResolvedValue(false);
    const open = renderOpen(["vscode"]);

    const result = await open("/srv/project/src/app.ts");

    expect(result._tag).toBe("Failure");
    if (result._tag === "Failure") {
      expect(Cause.squash(result.cause)).toBeInstanceOf(PreferredEditorRemoteOpenFailedError);
    }
    expect(launches.local).not.toHaveBeenCalled();
  });

  it("keeps local environments on the server-side editor command", async () => {
    remoteState.state.value = { mode: "local-exec" };
    const open = renderOpen(["zed"]);

    const result = await open("/srv/project/src/app.ts:12:4");

    expect(result).toMatchObject({ _tag: "Success", value: "zed" });
    expect(launches.local).toHaveBeenCalledWith({
      environmentId,
      input: {
        cwd: "/srv/project/src/app.ts:12:4",
        editor: "zed",
      },
    });
    expect(launches.remote).not.toHaveBeenCalled();
  });
});
