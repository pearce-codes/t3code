#!/usr/bin/env bun

import { existsSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const requireFromRepo = createRequire(join(repoRoot, "package.json"));
const electronPackageJsonPath = requireFromRepo.resolve(
  "./apps/desktop/node_modules/electron/package.json",
);
const electronPackageDir = dirname(electronPackageJsonPath);
const requireFromElectron = createRequire(electronPackageJsonPath);

const resolveElectronBinary = () => {
  const entry = requireFromRepo.resolve("./apps/desktop/node_modules/electron");
  delete requireFromRepo.cache[entry];
  return requireFromRepo("./apps/desktop/node_modules/electron");
};

const getInstalledBinary = () => {
  try {
    const binaryPath = resolveElectronBinary();
    return existsSync(binaryPath) ? binaryPath : undefined;
  } catch {
    return undefined;
  }
};

const readElectronInstallState = () => {
  const pathTxt = join(electronPackageDir, "path.txt");
  const dist = join(electronPackageDir, "dist");

  return {
    electronPackageDir,
    distEntries: existsSync(dist) ? readdirSync(dist).slice(0, 10) : [],
    distExists: existsSync(dist),
    pathTxt: existsSync(pathTxt) ? readFileSync(pathTxt, "utf8") : undefined,
    pathTxtExists: existsSync(pathTxt),
  };
};

const getElectronPlatformPath = (platform) => {
  switch (platform) {
    case "darwin":
    case "mas":
      return "Electron.app/Contents/MacOS/Electron";
    case "freebsd":
    case "linux":
    case "openbsd":
      return "electron";
    case "win32":
      return "electron.exe";
    default:
      throw new Error(`Electron builds are not available on platform: ${platform}`);
  }
};

const installElectronRuntime = async () => {
  const { downloadArtifact } = requireFromElectron("@electron/get");
  const extract = requireFromElectron("extract-zip");
  const { version } = requireFromElectron("./package.json");
  const checksums = requireFromElectron("./checksums.json");
  const platform = process.env.npm_config_platform || process.platform;
  const arch = process.env.npm_config_arch || process.arch;
  const platformPath = getElectronPlatformPath(platform);
  const distPath = join(electronPackageDir, "dist");

  console.log(`Downloading Electron ${version} for ${platform}/${arch}.`);
  const zipPath = await downloadArtifact({
    arch,
    artifactName: "electron",
    cacheRoot: join(tmpdir(), "t3code-electron-cache"),
    checksums,
    force: true,
    platform,
    version,
  });

  await extract(zipPath, { dir: distPath });

  const extractedTypeDefinition = join(distPath, "electron.d.ts");
  if (existsSync(extractedTypeDefinition)) {
    renameSync(extractedTypeDefinition, join(electronPackageDir, "electron.d.ts"));
  }

  writeFileSync(join(electronPackageDir, "path.txt"), platformPath);
};

let binaryPath = getInstalledBinary();

if (!binaryPath) {
  console.log("Electron runtime missing; installing Electron runtime.");
  rmSync(join(electronPackageDir, "dist"), { force: true, recursive: true });
  rmSync(join(electronPackageDir, "path.txt"), { force: true });

  await installElectronRuntime();
  binaryPath = getInstalledBinary();
}

if (!binaryPath) {
  throw new Error(
    `Electron runtime failed to install. State: ${JSON.stringify(readElectronInstallState())}`,
  );
}

console.log(`Electron runtime available at ${binaryPath}`);
