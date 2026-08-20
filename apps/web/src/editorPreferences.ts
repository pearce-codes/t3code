import { buildRemoteOpenUrl, EDITORS, EditorId, EnvironmentId } from "@t3tools/contracts";
import {
  mapAtomCommandResult,
  type AtomCommandFailure,
  type AtomCommandResult,
} from "@t3tools/client-runtime/state/runtime";
import * as Cause from "effect/Cause";
import * as Schema from "effect/Schema";
import { AsyncResult } from "effect/unstable/reactivity";
import { getLocalStorageItem, setLocalStorageItem, useLocalStorage } from "./hooks/useLocalStorage";
import { useCallback, useMemo } from "react";
import { shellEnvironment } from "./state/shell";
import { useAtomCommand } from "./state/use-atom-command";
import { openRemoteEditorUrl, useRemoteCapableEditors, useRemoteOpenState } from "./remoteOpen";
import { splitPathAndPosition } from "./terminal-links";

const LAST_EDITOR_KEY = "t3code:last-editor";

export class PreferredEditorEnvironmentRequiredError extends Schema.TaggedErrorClass<PreferredEditorEnvironmentRequiredError>()(
  "PreferredEditorEnvironmentRequiredError",
  {
    targetPath: Schema.String,
  },
) {
  override get message(): string {
    return `Cannot open ${this.targetPath} because no environment is selected.`;
  }
}

export class PreferredEditorUnavailableError extends Schema.TaggedErrorClass<PreferredEditorUnavailableError>()(
  "PreferredEditorUnavailableError",
  {
    environmentId: EnvironmentId,
    targetPath: Schema.String,
    availableEditorIds: Schema.Array(EditorId),
  },
) {
  override get message(): string {
    return `No available editor can open ${this.targetPath} in environment ${this.environmentId}.`;
  }
}

export class PreferredEditorRemoteOpenUnavailableError extends Schema.TaggedErrorClass<PreferredEditorRemoteOpenUnavailableError>()(
  "PreferredEditorRemoteOpenUnavailableError",
  {
    environmentId: EnvironmentId,
    targetPath: Schema.String,
  },
) {
  override get message(): string {
    return `Cannot open ${this.targetPath} because this client has no SSH route to environment ${this.environmentId}.`;
  }
}

export class PreferredEditorRemoteOpenFailedError extends Schema.TaggedErrorClass<PreferredEditorRemoteOpenFailedError>()(
  "PreferredEditorRemoteOpenFailedError",
  {
    environmentId: EnvironmentId,
    targetPath: Schema.String,
    editor: EditorId,
  },
) {
  override get message(): string {
    return `Failed to open ${this.targetPath} on environment ${this.environmentId} in ${this.editor}.`;
  }
}

export function usePreferredEditor(availableEditors: ReadonlyArray<EditorId>) {
  const [lastEditor, setLastEditor] = useLocalStorage(LAST_EDITOR_KEY, null, EditorId);

  const effectiveEditor = useMemo(() => {
    if (lastEditor && availableEditors.includes(lastEditor)) return lastEditor;
    return EDITORS.find((editor) => availableEditors.includes(editor.id))?.id ?? null;
  }, [lastEditor, availableEditors]);

  return [effectiveEditor, setLastEditor] as const;
}

export function resolveAndPersistPreferredEditor(
  availableEditors: readonly EditorId[],
): EditorId | null {
  const availableEditorIds = new Set(availableEditors);
  const stored = getLocalStorageItem(LAST_EDITOR_KEY, EditorId);
  if (stored && availableEditorIds.has(stored)) return stored;
  const editor = EDITORS.find((editor) => availableEditorIds.has(editor.id))?.id ?? null;
  if (editor) setLocalStorageItem(LAST_EDITOR_KEY, editor, EditorId);
  return editor ?? null;
}

export function useOpenInPreferredEditor(
  environmentId: EnvironmentId | null,
  availableEditors: readonly EditorId[],
) {
  const openInEditor = useAtomCommand(shellEnvironment.openInEditor, {
    reportFailure: false,
  });
  const remote = useRemoteOpenState(environmentId);
  const remoteCapableEditors = useRemoteCapableEditors();
  type OpenInEditorError = AtomCommandFailure<Awaited<ReturnType<typeof openInEditor>>>;

  return useCallback(
    async (
      targetPath: string,
    ): Promise<
      AtomCommandResult<
        EditorId,
        | OpenInEditorError
        | PreferredEditorEnvironmentRequiredError
        | PreferredEditorUnavailableError
        | PreferredEditorRemoteOpenUnavailableError
        | PreferredEditorRemoteOpenFailedError
      >
    > => {
      if (environmentId === null) {
        return AsyncResult.failure(
          Cause.fail(
            new PreferredEditorEnvironmentRequiredError({
              targetPath,
            }),
          ),
        );
      }
      if (remote.mode === "remote-unavailable") {
        return AsyncResult.failure(
          Cause.fail(
            new PreferredEditorRemoteOpenUnavailableError({
              environmentId,
              targetPath,
            }),
          ),
        );
      }
      const effectiveEditors =
        remote.mode === "local-exec" ? availableEditors : remoteCapableEditors;
      const editor = resolveAndPersistPreferredEditor(effectiveEditors);
      if (!editor) {
        return AsyncResult.failure(
          Cause.fail(
            new PreferredEditorUnavailableError({
              environmentId,
              targetPath,
              availableEditorIds: effectiveEditors,
            }),
          ),
        );
      }
      if (remote.mode === "remote-links") {
        // VS Code's remote protocol treats the entire URI path as the remote
        // resource. A local-style `:line:column` suffix would therefore point
        // at a nonexistent filename on the remote host.
        const remotePath = splitPathAndPosition(targetPath).path;
        const url = buildRemoteOpenUrl({
          editor,
          host: remote.host.host,
          absolutePath: remotePath,
        });
        const opened = url === undefined ? false : await openRemoteEditorUrl(url);
        if (!opened) {
          return AsyncResult.failure(
            Cause.fail(
              new PreferredEditorRemoteOpenFailedError({
                environmentId,
                targetPath,
                editor,
              }),
            ),
          );
        }
        return AsyncResult.success(editor);
      }
      const result = await openInEditor({
        environmentId,
        input: {
          cwd: targetPath,
          editor,
        },
      });
      return mapAtomCommandResult(result, () => editor);
    },
    [availableEditors, environmentId, openInEditor, remote, remoteCapableEditors],
  );
}
