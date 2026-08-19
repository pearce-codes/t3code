import type { ContextMenuItem, ThreadColor } from "@t3tools/contracts";

export const THREAD_COLOR_OPTIONS = [
  { value: "red", label: "Red", hex: "#ef4444" },
  { value: "orange", label: "Orange", hex: "#f97316" },
  { value: "yellow", label: "Yellow", hex: "#eab308" },
  { value: "green", label: "Green", hex: "#22c55e" },
  { value: "cyan", label: "Cyan", hex: "#06b6d4" },
  { value: "blue", label: "Blue", hex: "#3b82f6" },
  { value: "purple", label: "Purple", hex: "#a855f7" },
  { value: "pink", label: "Pink", hex: "#ec4899" },
] as const satisfies ReadonlyArray<{
  readonly value: ThreadColor;
  readonly label: string;
  readonly hex: string;
}>;

export type ThreadColorMenuId = `color:${ThreadColor}` | "color:clear";

export function threadColorHex(color: ThreadColor): string {
  return THREAD_COLOR_OPTIONS.find((option) => option.value === color)?.hex ?? "#3b82f6";
}

export function buildThreadColorMenuItem(
  currentColor: ThreadColor | null,
): ContextMenuItem<ThreadColorMenuId> {
  return {
    id: `color:${currentColor ?? "clear"}`,
    label: "Color",
    children: [
      ...THREAD_COLOR_OPTIONS.map((option) => ({
        id: `color:${option.value}` as const,
        label: `${currentColor === option.value ? "✓ " : ""}${option.label}`,
      })),
      {
        id: "color:clear" as const,
        label: `${currentColor === null ? "✓ " : ""}No color`,
      },
    ],
  };
}

export function threadColorFromMenuId(action: ThreadColorMenuId): ThreadColor | null {
  return action === "color:clear" ? null : (action.slice("color:".length) as ThreadColor);
}

export function isThreadColorMenuId(action: string): action is ThreadColorMenuId {
  return (
    action === "color:clear" ||
    THREAD_COLOR_OPTIONS.some((option) => action === `color:${option.value}`)
  );
}
