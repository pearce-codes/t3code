import * as NodeChildProcess from "node:child_process";

import {
  desktopDir,
  resolveElectronLaunchCommand,
  sanitizeElectronAppEnvironment,
} from "./electron-launcher.mjs";

const electronCommand = resolveElectronLaunchCommand(["dist-electron/main.cjs"]);
const child = NodeChildProcess.spawn(electronCommand.electronPath, electronCommand.args, {
  stdio: "inherit",
  cwd: desktopDir,
  env: sanitizeElectronAppEnvironment(),
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
