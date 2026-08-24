#!/usr/bin/env node
// @effect-diagnostics nodeBuiltinImport:off globalConsole:off - Host-side asset generation is a synchronous filesystem/process boundary.

import * as NodeChildProcess from "node:child_process";
import * as NodeFS from "node:fs";
import * as NodeOS from "node:os";
import * as NodePath from "node:path";

import { encodePngIco, WINDOWS_ICON_SIZES } from "./lib/icon-export.ts";

const repositoryRoot = NodePath.resolve(import.meta.dirname, "..");
const checkOnly = process.argv.includes("--check");
const tempRoot = NodeFS.mkdtempSync(NodePath.join(NodeOS.tmpdir(), "pearce-icons-"));
const sourceSvg = NodePath.resolve(repositoryRoot, "assets/pearce/app-icon.svg");
const macosSourceSvg = NodePath.resolve(repositoryRoot, "assets/pearce/app-icon-macos.svg");
const markSvg = NodePath.resolve(repositoryRoot, "assets/pearce/mark.svg");

const generated = {
  full: NodePath.join(tempRoot, "app-icon-1024.png"),
  macos: NodePath.join(tempRoot, "app-icon-macos-1024.png"),
  appleTouch: NodePath.join(tempRoot, "apple-touch-icon-180.png"),
  favicon16: NodePath.join(tempRoot, "favicon-16x16.png"),
  favicon32: NodePath.join(tempRoot, "favicon-32x32.png"),
  faviconIco: NodePath.join(tempRoot, "favicon.ico"),
  windowsIco: NodePath.join(tempRoot, "app-icon-windows.ico"),
  androidForeground: NodePath.join(tempRoot, "android-foreground-432.png"),
  androidNotification: NodePath.join(tempRoot, "android-notification-96.png"),
  desktopIcns: NodePath.join(tempRoot, "icon.icns"),
  marketingWebp: NodePath.join(tempRoot, "icon.webp"),
  marketingAppleTouchWebp: NodePath.join(tempRoot, "apple-touch-icon.webp"),
  marketingFavicon16Webp: NodePath.join(tempRoot, "favicon-16x16.webp"),
  marketingFavicon32Webp: NodePath.join(tempRoot, "favicon-32x32.webp"),
} as const;

interface Output {
  readonly source: string;
  readonly target: string;
}

const output = (source: string, target: string): Output => ({
  source,
  target: NodePath.resolve(repositoryRoot, target),
});

function run(command: string, args: ReadonlyArray<string>) {
  NodeChildProcess.execFileSync(command, args, { stdio: "pipe" });
}

function renderSvg(source: string, size: number, destination: string) {
  NodeFS.mkdirSync(NodePath.dirname(destination), { recursive: true });
  run("rsvg-convert", [
    "--width",
    String(size),
    "--height",
    String(size),
    "--output",
    destination,
    source,
  ]);
}

function createIco(source: string, sizes: ReadonlyArray<number>, destination: string) {
  const renditions = sizes.map((size) => {
    const path = NodePath.join(tempRoot, `ico-${sizes.length}-${size}.png`);
    renderSvg(source, size, path);
    return { size, contents: NodeFS.readFileSync(path) };
  });
  NodeFS.writeFileSync(destination, encodePngIco(renditions));
}

function createIcns() {
  const iconset = NodePath.join(tempRoot, "PearceCodes.iconset");
  NodeFS.mkdirSync(iconset);
  const renditions = [
    ["icon_16x16.png", 16],
    ["icon_16x16@2x.png", 32],
    ["icon_32x32.png", 32],
    ["icon_32x32@2x.png", 64],
    ["icon_128x128.png", 128],
    ["icon_128x128@2x.png", 256],
    ["icon_256x256.png", 256],
    ["icon_256x256@2x.png", 512],
    ["icon_512x512.png", 512],
    ["icon_512x512@2x.png", 1024],
  ] as const;
  for (const [name, size] of renditions) {
    renderSvg(macosSourceSvg, size, NodePath.join(iconset, name));
  }
  run("iconutil", ["--convert", "icns", "--output", generated.desktopIcns, iconset]);
}

function createWebp(source: string, destination: string) {
  run("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-i",
    source,
    "-c:v",
    "libwebp",
    "-lossless",
    "1",
    destination,
  ]);
}

function generate() {
  renderSvg(sourceSvg, 1024, generated.full);
  renderSvg(macosSourceSvg, 1024, generated.macos);
  renderSvg(sourceSvg, 180, generated.appleTouch);
  renderSvg(sourceSvg, 16, generated.favicon16);
  renderSvg(sourceSvg, 32, generated.favicon32);
  renderSvg(markSvg, 432, generated.androidForeground);
  renderSvg(markSvg, 96, generated.androidNotification);
  createIco(sourceSvg, [16, 32, 48], generated.faviconIco);
  createIco(sourceSvg, WINDOWS_ICON_SIZES, generated.windowsIco);
  createIcns();
  createWebp(generated.full, generated.marketingWebp);
  createWebp(generated.appleTouch, generated.marketingAppleTouchWebp);
  createWebp(generated.favicon16, generated.marketingFavicon16Webp);
  createWebp(generated.favicon32, generated.marketingFavicon32Webp);
}

const outputs: ReadonlyArray<Output> = [
  output(generated.full, "assets/pearce/app-icon-1024.png"),
  output(generated.macos, "assets/pearce/app-icon-macos-1024.png"),
  output(generated.windowsIco, "assets/pearce/app-icon-windows.ico"),
  output(generated.faviconIco, "assets/pearce/favicon.ico"),
  output(generated.favicon16, "assets/pearce/favicon-16x16.png"),
  output(generated.favicon32, "assets/pearce/favicon-32x32.png"),
  output(generated.appleTouch, "assets/pearce/apple-touch-icon-180.png"),
  output(generated.androidForeground, "assets/pearce/android-foreground-432.png"),

  output(generated.faviconIco, "apps/web/public/favicon.ico"),
  output(generated.favicon16, "apps/web/public/favicon-16x16.png"),
  output(generated.favicon32, "apps/web/public/favicon-32x32.png"),
  output(generated.appleTouch, "apps/web/public/apple-touch-icon.png"),

  output(generated.macos, "apps/desktop/resources/icon.png"),
  output(generated.windowsIco, "apps/desktop/resources/icon.ico"),
  output(generated.desktopIcns, "apps/desktop/resources/icon.icns"),

  output(generated.full, "apps/marketing/public/icon.png"),
  output(generated.marketingWebp, "apps/marketing/public/icon.webp"),
  output(generated.faviconIco, "apps/marketing/public/favicon.ico"),
  output(generated.favicon16, "apps/marketing/public/favicon-16x16.png"),
  output(generated.favicon32, "apps/marketing/public/favicon-32x32.png"),
  output(generated.appleTouch, "apps/marketing/public/apple-touch-icon.png"),
  output(generated.marketingFavicon16Webp, "apps/marketing/public/favicon-16x16.webp"),
  output(generated.marketingFavicon32Webp, "apps/marketing/public/favicon-32x32.webp"),
  output(generated.marketingAppleTouchWebp, "apps/marketing/public/apple-touch-icon.webp"),

  output(generated.androidForeground, "apps/mobile/assets/android-icon-mark.png"),
  output(generated.androidNotification, "apps/mobile/assets/android-notification-icon.png"),
  output(markSvg, "apps/mobile/assets/widget/T3Mark.svg"),
];

try {
  generate();
  const stale = outputs.filter(({ source, target }) => {
    if (!NodeFS.existsSync(target)) return true;
    return !NodeFS.readFileSync(source).equals(NodeFS.readFileSync(target));
  });

  if (checkOnly) {
    if (stale.length > 0) {
      console.error(
        `Generated icon assets are stale:\n${stale.map(({ target }) => `- ${target}`).join("\n")}`,
      );
      process.exitCode = 1;
    } else {
      console.log(`Verified ${outputs.length} Pearce Codes icon assets.`);
    }
  } else {
    for (const { source, target } of stale) {
      NodeFS.mkdirSync(NodePath.dirname(target), { recursive: true });
      NodeFS.copyFileSync(source, target);
    }
    console.log(`Updated ${stale.length} of ${outputs.length} Pearce Codes icon assets.`);
  }
} finally {
  NodeFS.rmSync(tempRoot, { recursive: true, force: true });
}
