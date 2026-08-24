import * as NodeChildProcess from "node:child_process";
import * as NodePath from "node:path";
import * as NodeURL from "node:url";
import {
  resolveElectronLaunchCommand,
  sanitizeElectronAppEnvironment,
} from "./electron-launcher.mjs";

const __dirname = NodePath.dirname(NodeURL.fileURLToPath(import.meta.url));
const desktopDir = NodePath.resolve(__dirname, "..");
const mainJs = NodePath.resolve(desktopDir, "dist-electron/main.cjs");

console.log("\nLaunching Electron smoke test...");

const electronCommand = resolveElectronLaunchCommand([mainJs]);
const child = NodeChildProcess.spawn(electronCommand.electronPath, electronCommand.args, {
  stdio: ["pipe", "pipe", "pipe"],
  env: {
    ...sanitizeElectronAppEnvironment(),
    VITE_DEV_SERVER_URL: "",
    ELECTRON_ENABLE_LOGGING: "1",
  },
});

let output = "";
let ready = false;
let timedOut = false;
const readinessMarker = "app ready";

function captureOutput(chunk) {
  output += chunk.toString();
  if (!ready && output.includes(readinessMarker)) {
    ready = true;
    child.kill();
  }
}

child.stdout.on("data", (chunk) => {
  captureOutput(chunk);
});
child.stderr.on("data", (chunk) => {
  captureOutput(chunk);
});

const timeout = setTimeout(() => {
  timedOut = true;
  child.kill();
}, 8_000);

child.on("exit", (code, signal) => {
  clearTimeout(timeout);

  const fatalPatterns = [
    "Cannot find module",
    "MODULE_NOT_FOUND",
    "Refused to execute",
    "Uncaught Error",
    "Uncaught TypeError",
    "Uncaught ReferenceError",
  ];
  const failures = fatalPatterns.filter((pattern) => output.includes(pattern));

  if (failures.length > 0 || !ready) {
    console.error("\nDesktop smoke test failed:");
    for (const failure of failures) {
      console.error(` - ${failure}`);
    }
    if (!ready) {
      const exitDescription = signal ? `signal ${signal}` : `exit code ${String(code)}`;
      console.error(
        timedOut
          ? ` - did not emit "${readinessMarker}" within 8 seconds`
          : ` - exited with ${exitDescription} before emitting "${readinessMarker}"`,
      );
    }
    console.error("\nFull output:\n" + output);
    process.exit(1);
  }

  console.log("Desktop smoke test passed.");
  process.exit(0);
});
