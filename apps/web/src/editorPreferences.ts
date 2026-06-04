import {
  EDITORS,
  EditorId,
  type EditorLaunchContext,
  LocalApi,
  REMOTE_SSH_EDITOR_IDS,
} from "@t3tools/contracts";
import { getLocalStorageItem, setLocalStorageItem, useLocalStorage } from "./hooks/useLocalStorage";
import { useMemo } from "react";

const LAST_EDITOR_KEY = "t3code:last-editor";

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

export function filterAvailableEditorsForLaunchContext(
  availableEditors: readonly EditorId[],
  context?: EditorLaunchContext,
): readonly EditorId[] {
  if (context?.remote?.type === "ssh") {
    return availableEditors.filter((editor) =>
      (REMOTE_SSH_EDITOR_IDS as ReadonlyArray<EditorId>).includes(editor),
    );
  }
  return availableEditors;
}

export async function openInPreferredEditor(
  api: LocalApi,
  targetPath: string,
  context?: EditorLaunchContext,
): Promise<EditorId> {
  const { availableEditors } = await api.server.getConfig();
  const editor = resolveAndPersistPreferredEditor(
    filterAvailableEditorsForLaunchContext(availableEditors, context),
  );
  if (!editor) throw new Error("No available editors found.");
  await api.shell.openInEditor(targetPath, editor, context);
  return editor;
}
