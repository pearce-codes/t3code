const KIRO_COMPACTION_PROGRESS_TEXT = "compacting conversation";

function normalizeStatusText(value: string): string {
  return value.trim().toLowerCase().replace(/[.]+$/g, "").replace(/\s+/g, " ");
}

export function isProviderCompactionProgressText(value: string | null | undefined): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  return normalizeStatusText(value) === KIRO_COMPACTION_PROGRESS_TEXT;
}

export function omitProviderCompactionProgressText<T extends string | undefined>(
  value: T,
): T | undefined {
  if (isProviderCompactionProgressText(value)) {
    return undefined;
  }
  return value;
}
