import { BUILT_IN_THEMES, getThemeColorsForAppearance } from "@t3tools/shared/themePalettes";

import {
  getMobileThemeVariables,
  themeColorToNativeColor,
  type MobileThemeId,
} from "../../lib/mobileTheme";

export type TerminalAppearanceScheme = "light" | "dark";

export interface TerminalTheme {
  readonly background: string;
  readonly foreground: string;
  readonly mutedForeground: string;
  readonly border: string;
  readonly cursorForeground: string;
  readonly cursorBackground: string;
  readonly palette: readonly string[];
}

const PIERRE_LIGHT_THEME: TerminalTheme = {
  background: "#151410",
  foreground: "#f0d98e",
  mutedForeground: "#aa9b87",
  border: "#4b4035",
  cursorForeground: "#f6b93d",
  cursorBackground: "#151410",
  palette: [
    "#1F1F21",
    "#ff2e3f",
    "#0dbe4e",
    "#ffca00",
    "#009fff",
    "#c635e4",
    "#08c0ef",
    "#c6c6c8",
    "#1F1F21",
    "#ff2e3f",
    "#0dbe4e",
    "#ffca00",
    "#009fff",
    "#c635e4",
    "#08c0ef",
    "#c6c6c8",
  ],
};

const PIERRE_DARK_THEME: TerminalTheme = {
  background: "#100e0c",
  foreground: "#e8dcc5",
  mutedForeground: "#aa9b87",
  border: "#392b21",
  cursorForeground: "#f6b93d",
  cursorBackground: "#100e0c",
  palette: [
    "#141415",
    "#ff2e3f",
    "#0dbe4e",
    "#ffca00",
    "#009fff",
    "#c635e4",
    "#08c0ef",
    "#c6c6c8",
    "#141415",
    "#ff2e3f",
    "#0dbe4e",
    "#ffca00",
    "#009fff",
    "#c635e4",
    "#08c0ef",
    "#c6c6c8",
  ],
};

export function getPierreTerminalTheme(scheme: TerminalAppearanceScheme): TerminalTheme {
  return scheme === "light" ? PIERRE_LIGHT_THEME : PIERRE_DARK_THEME;
}

export function getMobileTerminalTheme(
  themeId: MobileThemeId,
  scheme: TerminalAppearanceScheme,
): TerminalTheme {
  const base = getPierreTerminalTheme(scheme);
  if (themeId === "t3-code") return base;

  const theme = BUILT_IN_THEMES.find((candidate) => candidate.id === themeId) ?? BUILT_IN_THEMES[0];
  const palette = getThemeColorsForAppearance(theme, scheme) ?? theme.colors;
  const colors = getMobileThemeVariables(themeId, scheme);
  const background = themeColorToNativeColor(palette.terminalBackground);
  return {
    ...base,
    background,
    foreground: themeColorToNativeColor(palette.terminalForeground),
    mutedForeground: colors["--color-foreground-muted"],
    border: colors["--color-border"],
    cursorForeground: themeColorToNativeColor(palette.terminalCursor),
    cursorBackground: background,
  };
}

export function buildGhosttyThemeConfig(theme: TerminalTheme): string {
  const lines = [
    `background = ${theme.background}`,
    `foreground = ${theme.foreground}`,
    `cursor-color = ${theme.cursorForeground}`,
    `cursor-text = ${theme.cursorBackground}`,
  ];

  for (const [index, color] of theme.palette.entries()) {
    lines.push(`palette = ${index}=${color}`);
  }

  return `${lines.join("\n")}\n`;
}
