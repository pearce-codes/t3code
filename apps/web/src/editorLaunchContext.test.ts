import { describe, expect, it } from "vite-plus/test";

import {
  resolveDesktopSshEditorAuthority,
  resolveDesktopSshEditorLaunchContext,
} from "./editorLaunchContext";

describe("editorLaunchContext", () => {
  it("uses the ssh config alias as the VS Code Remote-SSH authority", () => {
    expect(
      resolveDesktopSshEditorAuthority({
        alias: "devbox",
        hostname: "10.0.0.7",
        username: "pearce",
        port: 2222,
      }),
    ).toBe("pearce@devbox");
  });

  it("includes an explicit port for direct host targets", () => {
    expect(
      resolveDesktopSshEditorAuthority({
        alias: "example.com",
        hostname: "example.com",
        username: "deploy",
        port: 2222,
      }),
    ).toBe("deploy@example.com:2222");
  });

  it("brackets IPv6 host targets when adding a port", () => {
    expect(
      resolveDesktopSshEditorAuthority({
        alias: "2001:db8::1",
        hostname: "2001:db8::1",
        username: null,
        port: 2222,
      }),
    ).toBe("[2001:db8::1]:2222");
  });

  it("builds an ssh editor launch context", () => {
    expect(
      resolveDesktopSshEditorLaunchContext({
        alias: "devbox",
        hostname: "devbox.internal",
        username: null,
        port: null,
      }),
    ).toEqual({
      remote: {
        type: "ssh",
        authority: "devbox",
      },
    });
  });
});
