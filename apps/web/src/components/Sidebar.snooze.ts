import type { TimestampFormat } from "@t3tools/contracts/settings";
import {
  resolveSnoozePresets as resolveSharedSnoozePresets,
  snoozeWakeLabel,
  type SnoozePreset,
} from "@t3tools/client-runtime/state/thread-settled";

import { formatShortTimestamp, parseTimestampDate } from "../timestampFormat";

export { snoozeWakeLabel, type SnoozePreset };

const DAY_MS = 24 * 60 * 60 * 1_000;
const MINUTE_MS = 60 * 1_000;

export type CustomSnoozeDurationUnit = "minutes" | "hours" | "days";

const CUSTOM_SNOOZE_UNIT_MS: Record<CustomSnoozeDurationUnit, number> = {
  minutes: MINUTE_MS,
  hours: 60 * MINUTE_MS,
  days: DAY_MS,
};

function padDateTimePart(value: number): string {
  return String(value).padStart(2, "0");
}

/** Value for a native datetime-local input, deliberately expressed in local time. */
export function formatSnoozeUntilInput(date: Date): string {
  return `${date.getFullYear()}-${padDateTimePart(date.getMonth() + 1)}-${padDateTimePart(date.getDate())}T${padDateTimePart(date.getHours())}:${padDateTimePart(date.getMinutes())}`;
}

export function defaultSnoozeUntilInput(now: Date): string {
  const wake = new Date(now.getTime() + 60 * MINUTE_MS);
  wake.setMinutes(Math.ceil(wake.getMinutes() / 15) * 15, 0, 0);
  return formatSnoozeUntilInput(wake);
}

export function resolveCustomSnoozeFor(
  now: Date,
  amount: string,
  unit: CustomSnoozeDurationUnit,
): string | null {
  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return null;
  const wakeMs = now.getTime() + parsedAmount * CUSTOM_SNOOZE_UNIT_MS[unit];
  if (!Number.isFinite(wakeMs)) return null;
  const wake = new Date(wakeMs);
  return Number.isNaN(wake.getTime()) ? null : wake.toISOString();
}

export function resolveCustomSnoozeUntil(value: string, now: Date): string | null {
  const wake = new Date(value);
  if (Number.isNaN(wake.getTime()) || wake.getTime() <= now.getTime()) return null;
  return wake.toISOString();
}

function timeOfDayLabel(date: Date, timestampFormat: TimestampFormat): string {
  return formatShortTimestamp(date.toISOString(), timestampFormat);
}

export function resolveSnoozePresets(
  now: Date,
  timestampFormat: TimestampFormat,
): ReadonlyArray<SnoozePreset> {
  return resolveSharedSnoozePresets(now).map((preset) => {
    const wake = parseTimestampDate(preset.snoozedUntil);
    if (wake === null) return preset;
    const time = timeOfDayLabel(wake, timestampFormat);
    return {
      ...preset,
      whenLabel:
        preset.id === "next-week"
          ? `${wake.toLocaleDateString(undefined, { weekday: "short" })} ${time}`
          : time,
    };
  });
}

/**
 * Human wake time for menus and toasts: "tomorrow 9:00", "Mon 9:00",
 * "17:30" (today).
 */
export function snoozeWakeDescription(
  snoozedUntil: string,
  now: Date,
  timestampFormat: TimestampFormat,
): string {
  const wake = parseTimestampDate(snoozedUntil);
  if (wake === null) return "";
  const time = timeOfDayLabel(wake, timestampFormat);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const dayDelta = Math.floor((wake.getTime() - startOfToday.getTime()) / DAY_MS);
  if (dayDelta === 0) return time;
  if (dayDelta === 1) return `tomorrow ${time}`;
  const weekday = wake.toLocaleDateString(undefined, { weekday: "short" });
  if (dayDelta < 7) return `${weekday} ${time}`;
  const date = wake.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${date}, ${time}`;
}
