import type { DesktopSshEnvironmentTarget, EditorLaunchContext } from "@t3tools/contracts";

function formatHostWithOptionalPort(host: string, port: number | null): string {
  if (port === null) {
    return host;
  }

  const hostPart = host.includes(":") && !host.startsWith("[") ? `[${host}]` : host;
  return `${hostPart}:${port}`;
}

export function resolveDesktopSshEditorAuthority(target: DesktopSshEnvironmentTarget): string {
  const alias = target.alias.trim();
  const hostname = target.hostname.trim();
  const host = alias || hostname;
  if (!host) {
    throw new Error("SSH target is missing its host.");
  }

  const hostWithPort =
    target.port !== null && (!alias || alias === hostname)
      ? formatHostWithOptionalPort(host, target.port)
      : host;
  return target.username ? `${target.username}@${hostWithPort}` : hostWithPort;
}

export function resolveDesktopSshEditorLaunchContext(
  target: DesktopSshEnvironmentTarget | undefined,
): EditorLaunchContext | undefined {
  if (!target) {
    return undefined;
  }

  return {
    remote: {
      type: "ssh",
      authority: resolveDesktopSshEditorAuthority(target),
    },
  };
}
