//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
      key = keys[i];
      if (!__hasOwnProp.call(to, key) && key !== except) {
        __defProp(to, key, {
          get: ((k) => from[k]).bind(null, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
      }
    }
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, "default", {
          value: mod,
          enumerable: true,
        })
      : target,
    mod,
  )
);

//#endregion
let _effect_platform_node_NodeHttpClient = require("@effect/platform-node/NodeHttpClient");
_effect_platform_node_NodeHttpClient = __toESM(_effect_platform_node_NodeHttpClient);
let _effect_platform_node_NodeRuntime = require("@effect/platform-node/NodeRuntime");
_effect_platform_node_NodeRuntime = __toESM(_effect_platform_node_NodeRuntime);
let _effect_platform_node_NodeServices = require("@effect/platform-node/NodeServices");
_effect_platform_node_NodeServices = __toESM(_effect_platform_node_NodeServices);
let node_os = require("node:os");
node_os = __toESM(node_os);
let effect_Effect = require("effect/Effect");
effect_Effect = __toESM(effect_Effect);
let effect_Layer = require("effect/Layer");
effect_Layer = __toESM(effect_Layer);
let effect_Option = require("effect/Option");
effect_Option = __toESM(effect_Option);
let electron = require("electron");
electron = __toESM(electron);
let node_net = require("node:net");
node_net = __toESM(node_net);
let effect_Data = require("effect/Data");
effect_Data = __toESM(effect_Data);
let effect_Context = require("effect/Context");
effect_Context = __toESM(effect_Context);
let effect_Predicate = require("effect/Predicate");
effect_Predicate = __toESM(effect_Predicate);
let node_crypto = require("node:crypto");
node_crypto = __toESM(node_crypto);
let effect_Duration = require("effect/Duration");
effect_Duration = __toESM(effect_Duration);
let effect_FileSystem = require("effect/FileSystem");
effect_FileSystem = __toESM(effect_FileSystem);
let effect_Path = require("effect/Path");
effect_Path = __toESM(effect_Path);
let effect_Scope = require("effect/Scope");
effect_Scope = __toESM(effect_Scope);
let effect_Stream = require("effect/Stream");
effect_Stream = __toESM(effect_Stream);
let effect_unstable_process = require("effect/unstable/process");
require("effect/PlatformError");
let effect_Schema = require("effect/Schema");
effect_Schema = __toESM(effect_Schema);
let effect_Cause = require("effect/Cause");
effect_Cause = __toESM(effect_Cause);
let effect_Ref = require("effect/Ref");
effect_Ref = __toESM(effect_Ref);
let effect_Config = require("effect/Config");
effect_Config = __toESM(effect_Config);
let effect_SchemaTransformation = require("effect/SchemaTransformation");
effect_SchemaTransformation = __toESM(effect_SchemaTransformation);
let effect_SchemaIssue = require("effect/SchemaIssue");
effect_SchemaIssue = __toESM(effect_SchemaIssue);
let effect_Struct = require("effect/Struct");
effect_Struct = __toESM(effect_Struct);
let effect_unstable_rpc_Rpc = require("effect/unstable/rpc/Rpc");
effect_unstable_rpc_Rpc = __toESM(effect_unstable_rpc_Rpc);
let effect_unstable_rpc_RpcGroup = require("effect/unstable/rpc/RpcGroup");
effect_unstable_rpc_RpcGroup = __toESM(effect_unstable_rpc_RpcGroup);
let effect_Exit = require("effect/Exit");
effect_Exit = __toESM(effect_Exit);
let effect_Result = require("effect/Result");
effect_Result = __toESM(effect_Result);
let effect_SchemaGetter = require("effect/SchemaGetter");
effect_SchemaGetter = __toESM(effect_SchemaGetter);
let effect_Random = require("effect/Random");
effect_Random = __toESM(effect_Random);
let effect_SynchronizedRef = require("effect/SynchronizedRef");
effect_SynchronizedRef = __toESM(effect_SynchronizedRef);
require("effect/ConfigProvider");
let electron_updater = require("electron-updater");
let effect_Encoding = require("effect/Encoding");
effect_Encoding = __toESM(effect_Encoding);
let effect_Deferred = require("effect/Deferred");
effect_Deferred = __toESM(effect_Deferred);
let effect_Tracer = require("effect/Tracer");
effect_Tracer = __toESM(effect_Tracer);
let effect_unstable_observability = require("effect/unstable/observability");
let node_fs = require("node:fs");
node_fs = __toESM(node_fs);
let node_path = require("node:path");
node_path = __toESM(node_path);
let effect_DateTime = require("effect/DateTime");
effect_DateTime = __toESM(effect_DateTime);
let effect_Logger = require("effect/Logger");
effect_Logger = __toESM(effect_Logger);
let effect_References = require("effect/References");
effect_References = __toESM(effect_References);
let effect_Semaphore = require("effect/Semaphore");
effect_Semaphore = __toESM(effect_Semaphore);
let effect_unstable_http = require("effect/unstable/http");
let effect_Schedule = require("effect/Schedule");
effect_Schedule = __toESM(effect_Schedule);
let effect_Fiber = require("effect/Fiber");
effect_Fiber = __toESM(effect_Fiber);

//#region ../../packages/shared/src/Net.ts
var NetError = class extends effect_Data.TaggedError("NetError") {};
const isErrnoExceptionWithCode = (cause) =>
  effect_Predicate.isObject(cause) &&
  effect_Predicate.hasProperty(cause, "code") &&
  effect_Predicate.isString(cause.code);
const closeServer = (server) => {
  try {
    server.close();
  } catch {}
};
const tryReservePort = (port) =>
  effect_Effect.callback((resume) => {
    const server = node_net.createServer();
    let settled = false;
    const settle = (effect) => {
      if (settled) return;
      settled = true;
      resume(effect);
    };
    server.unref();
    server.once("error", (cause) => {
      settle(
        effect_Effect.fail(
          new NetError({
            message: "Could not find an available port.",
            cause,
          }),
        ),
      );
    });
    server.listen(port, () => {
      const address = server.address();
      const resolved = typeof address === "object" && address !== null ? address.port : 0;
      server.close(() => {
        if (resolved > 0) {
          settle(effect_Effect.succeed(resolved));
          return;
        }
        settle(effect_Effect.fail(new NetError({ message: "Could not find an available port." })));
      });
    });
    return effect_Effect.sync(() => {
      closeServer(server);
    });
  });
/**
 * NetService - Service tag for startup networking helpers.
 */
var NetService = class extends effect_Context.Service()("@t3tools/shared/Net/NetService") {};
const make$17 = () => {
  /**
   * Returns true when a TCP server can bind to {host, port}.
   * `EADDRNOTAVAIL` is treated as available so IPv6-absent hosts don't fail
   * loopback availability checks.
   */
  const canListenOnHost = (port, host) =>
    effect_Effect.callback((resume) => {
      const server = node_net.createServer();
      let settled = false;
      const settle = (value) => {
        if (settled) return;
        settled = true;
        resume(effect_Effect.succeed(value));
      };
      server.unref();
      server.once("error", (cause) => {
        if (isErrnoExceptionWithCode(cause) && cause.code === "EADDRNOTAVAIL") {
          settle(true);
          return;
        }
        settle(false);
      });
      server.once("listening", () => {
        server.close(() => {
          settle(true);
        });
      });
      server.listen({
        host,
        port,
      });
      return effect_Effect.sync(() => {
        closeServer(server);
      });
    });
  /**
   * Reserve an ephemeral loopback port and release it immediately.
   * Returns the reserved port number.
   */
  const reserveLoopbackPort = (host = "127.0.0.1") =>
    effect_Effect.callback((resume) => {
      const probe = node_net.createServer();
      let settled = false;
      const settle = (effect) => {
        if (settled) return;
        settled = true;
        resume(effect);
      };
      probe.once("error", (cause) => {
        settle(
          effect_Effect.fail(
            new NetError({
              message: "Failed to reserve loopback port",
              cause,
            }),
          ),
        );
      });
      probe.listen(0, host, () => {
        const address = probe.address();
        const port = typeof address === "object" && address !== null ? address.port : 0;
        probe.close(() => {
          if (port > 0) {
            settle(effect_Effect.succeed(port));
            return;
          }
          settle(effect_Effect.fail(new NetError({ message: "Failed to reserve loopback port" })));
        });
      });
      return effect_Effect.sync(() => {
        closeServer(probe);
      });
    });
  return {
    canListenOnHost,
    isPortAvailableOnLoopback: (port) =>
      effect_Effect.zipWith(
        canListenOnHost(port, "127.0.0.1"),
        canListenOnHost(port, "::1"),
        (ipv4, ipv6) => ipv4 && ipv6,
      ),
    reserveLoopbackPort,
    findAvailablePort: (preferred) =>
      effect_Effect.catch(tryReservePort(preferred), () => tryReservePort(0)),
  };
};
const layer$28 = effect_Layer.sync(NetService, make$17);

//#endregion
//#region ../../packages/ssh/src/errors.ts
var SshHostDiscoveryError = class extends effect_Data.TaggedError("SshHostDiscoveryError") {};
var SshInvalidTargetError = class extends effect_Data.TaggedError("SshInvalidTargetError") {};
var SshCommandError = class extends effect_Data.TaggedError("SshCommandError") {};
var SshLaunchError = class extends effect_Data.TaggedError("SshLaunchError") {};
var SshPairingError = class extends effect_Data.TaggedError("SshPairingError") {};
var SshHttpBridgeError = class extends effect_Data.TaggedError("SshHttpBridgeError") {};
var SshReadinessError = class extends effect_Data.TaggedError("SshReadinessError") {};
var SshPasswordPromptError = class extends effect_Data.TaggedError("SshPasswordPromptError") {};

//#endregion
//#region ../../packages/ssh/src/auth.ts
var SshPasswordPrompt = class SshPasswordPrompt extends effect_Context.Service()(
  "@t3tools/ssh/SshPasswordPrompt",
) {
  static disabledLayer = effect_Layer.succeed(
    SshPasswordPrompt,
    SshPasswordPrompt.of({
      isAvailable: false,
      request: () => effect_Effect.succeed(null),
    }),
  );
};
const SSH_ASKPASS_DIR_NAME = "t3code-ssh-askpass";
function joinSshAskpassPath(directory, fileName, platform) {
  const trimmed = directory.replace(/[\\/]+$/u, "");
  return platform === "win32" ? `${trimmed}\\${fileName}` : `${trimmed}/${fileName}`;
}
const ASKPASS_POSIX_SCRIPT = `#!/bin/sh
# Invoked by ssh via SSH_ASKPASS when T3 Code re-runs ssh with a cached password
# from the renderer's in-app prompt. We never expose a native dialog here - if
# T3_SSH_AUTH_SECRET is missing, that's a caller bug and we fail loudly.
if [ "\${T3_SSH_AUTH_SECRET+x}" = "x" ]; then
  printf "%s\\n" "$T3_SSH_AUTH_SECRET"
  exit 0
fi
printf 'T3 Code ssh-askpass invoked without T3_SSH_AUTH_SECRET.\\n' >&2
exit 1
`;
const ASKPASS_WINDOWS_LAUNCHER_SCRIPT = `@echo off\r
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0ssh-askpass.ps1" %*\r
`;
const ASKPASS_WINDOWS_SCRIPT = `# Invoked by ssh via SSH_ASKPASS (through ssh-askpass.cmd) when T3 Code re-runs\r
# ssh with a cached password from the renderer's in-app prompt. We never expose\r
# a native dialog here - if T3_SSH_AUTH_SECRET is missing, that's a caller bug\r
# and we fail loudly.\r
if ($null -ne $env:T3_SSH_AUTH_SECRET) {\r
  [Console]::Out.WriteLine($env:T3_SSH_AUTH_SECRET)\r
  exit 0\r
}\r
[Console]::Error.WriteLine("T3 Code ssh-askpass invoked without T3_SSH_AUTH_SECRET.")\r
exit 1\r
`;
const getDefaultSshAskpassDirectory = effect_Effect.fn("ssh/auth.getDefaultSshAskpassDirectory")(
  function* () {
    const fs = yield* effect_FileSystem.FileSystem;
    const path = yield* effect_Path.Path;
    const parentDirectory = yield* fs.makeTempDirectory({ prefix: "t3code-ssh-runtime-" });
    return path.join(parentDirectory, SSH_ASKPASS_DIR_NAME);
  },
);
const buildSshAskpassHelperDescriptor = effect_Effect.fn(
  "ssh/auth.buildSshAskpassHelperDescriptor",
)(function* (input) {
  const platform = input.platform ?? process.platform;
  const path = yield* effect_Path.Path;
  const directory = input.directory;
  if (platform === "win32") {
    const powershellPath = joinSshAskpassPath(directory, "ssh-askpass.ps1", platform);
    return {
      launcherPath: joinSshAskpassPath(directory, "ssh-askpass.cmd", platform),
      files: [
        {
          path: joinSshAskpassPath(directory, "ssh-askpass.cmd", platform),
          contents: ASKPASS_WINDOWS_LAUNCHER_SCRIPT,
        },
        {
          path: powershellPath,
          contents: ASKPASS_WINDOWS_SCRIPT,
        },
      ],
    };
  }
  return {
    launcherPath: path.join(directory, "ssh-askpass.sh"),
    files: [
      {
        path: path.join(directory, "ssh-askpass.sh"),
        contents: ASKPASS_POSIX_SCRIPT,
        mode: 448,
      },
    ],
  };
});
const ensureSshAskpassHelpers = effect_Effect.fn("ssh/auth.ensureSshAskpassHelpers")(
  function* (input) {
    const fs = yield* effect_FileSystem.FileSystem;
    const path = yield* effect_Path.Path;
    const descriptor = yield* buildSshAskpassHelperDescriptor(input);
    const platform = input.platform ?? process.platform;
    yield* fs.makeDirectory(path.dirname(descriptor.launcherPath), { recursive: true });
    for (const file of descriptor.files) {
      if (
        ((yield* fs.exists(file.path)) ? yield* fs.readFileString(file.path) : null) !==
        file.contents
      )
        yield* fs.writeFileString(file.path, file.contents);
      if (file.mode !== void 0 && platform !== "win32") yield* fs.chmod(file.path, file.mode);
    }
    return descriptor.launcherPath;
  },
);
const buildSshChildEnvironment = effect_Effect.fn("ssh/auth.buildSshChildEnvironment")(function* (
  input = {},
) {
  const baseEnv = { ...(input.baseEnv ?? process.env) };
  if (!input.interactiveAuth) return baseEnv;
  const platform = input.platform ?? process.platform;
  const sshAskpass = yield* ensureSshAskpassHelpers({
    directory: input.askpassDirectory ?? (yield* getDefaultSshAskpassDirectory()),
    platform,
  });
  return {
    ...baseEnv,
    SSH_ASKPASS: sshAskpass,
    SSH_ASKPASS_REQUIRE: "force",
    ...(input.authSecret === void 0 ? {} : { T3_SSH_AUTH_SECRET: input.authSecret ?? "" }),
    ...(platform === "win32" || baseEnv.DISPLAY ? {} : { DISPLAY: "t3code" }),
  };
});
function isSshAuthFailure(error) {
  const normalized = (error instanceof Error ? error.message : String(error)).toLowerCase();
  return (
    /permission denied \((?:publickey|password|keyboard-interactive|hostbased|gssapi-with-mic)[^)]*\)/u.test(
      normalized,
    ) ||
    /authentication failed/u.test(normalized) ||
    /too many authentication failures/u.test(normalized)
  );
}

//#endregion
//#region ../../packages/ssh/src/command.ts
const PUBLISHABLE_T3_VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u;
const DEFAULT_SSH_COMMAND_TIMEOUT_MS = 6e4;
const encoder = new TextEncoder();
function parseSshResolveOutput(alias, stdout) {
  const values = /* @__PURE__ */ new Map();
  for (const line of stdout.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;
    const [key, ...rest] = trimmed.split(/\s+/u);
    if (!key || rest.length === 0 || values.has(key)) continue;
    values.set(key, rest.join(" ").trim());
  }
  const hostname = values.get("hostname")?.trim() || alias;
  const username = values.get("user")?.trim() || null;
  const rawPort = values.get("port")?.trim() ?? "";
  const parsedPort = Number.parseInt(rawPort, 10);
  return {
    alias,
    hostname,
    username,
    port: Number.isInteger(parsedPort) ? parsedPort : null,
  };
}
function targetConnectionKey(target) {
  return `${target.alias}\u0000${target.hostname}\u0000${target.username ?? ""}\u0000${target.port ?? ""}`;
}
function remoteStateKey(target) {
  return node_crypto
    .createHash("sha256")
    .update(targetConnectionKey(target))
    .digest("hex")
    .slice(0, 16);
}
function buildSshHostSpec(target) {
  const destination = target.alias.trim() || target.hostname.trim();
  if (destination.length === 0) throw new Error("SSH target is missing its alias/hostname.");
  return target.username ? `${target.username}@${destination}` : destination;
}
const buildSshHostSpecEffect = (target) =>
  effect_Effect.try({
    try: () => buildSshHostSpec(target),
    catch: (cause) =>
      new SshInvalidTargetError({
        message: cause instanceof Error ? cause.message : "SSH target is invalid.",
      }),
  });
function baseSshArgs(target, input) {
  return [
    "-o",
    `BatchMode=${input?.batchMode ?? "no"}`,
    "-o",
    "ConnectTimeout=10",
    ...(target.port !== null ? ["-p", String(target.port)] : []),
  ];
}
function getLastNonEmptyOutputLine(stdout) {
  return (
    stdout
      .trim()
      .split(/\r?\n/u)
      .map((entry) => entry.trim())
      .findLast((entry) => entry.length > 0) ?? null
  );
}
const collectProcessOutput = (stream) =>
  stream.pipe(
    effect_Stream.decodeText(),
    effect_Stream.runFold(
      () => "",
      (acc, chunk) => acc + chunk,
    ),
  );
function normalizeSshErrorMessage$1(stderr, fallbackMessage) {
  const cleaned = stderr.trim();
  return cleaned.length > 0 ? cleaned : fallbackMessage;
}
function sshTargetLogFields$1(target) {
  return {
    alias: target.alias,
    hostname: target.hostname,
    username: target.username,
    port: target.port,
  };
}
function stdinStream(input) {
  return input === void 0 ? effect_Stream.empty : effect_Stream.make(encoder.encode(input));
}
const runSshCommandInScope = effect_Effect.fn("ssh/command.runSshCommand.inScope")(
  function* (target, input, commandScope) {
    const hostSpec = yield* buildSshHostSpecEffect(target);
    const environment = yield* buildSshChildEnvironment({
      ...(input.interactiveAuth === void 0 ? {} : { interactiveAuth: input.interactiveAuth }),
      ...(input.authSecret === void 0 ? {} : { authSecret: input.authSecret }),
    }).pipe(
      effect_Effect.mapError(
        (cause) =>
          new SshCommandError({
            command: ["ssh"],
            exitCode: null,
            stderr: "",
            message: "Failed to prepare SSH authentication helpers.",
            cause,
          }),
      ),
    );
    const args = [
      ...baseSshArgs(target, {
        batchMode: input.batchMode ?? (input.interactiveAuth ? "no" : "yes"),
      }),
      ...(input.preHostArgs ?? []),
      hostSpec,
      ...(input.remoteCommandArgs ?? []),
    ];
    const spawner = yield* effect_unstable_process.ChildProcessSpawner.ChildProcessSpawner;
    yield* effect_Effect.logDebug("ssh.command.start", {
      ...sshTargetLogFields$1(target),
      command: ["ssh", ...args],
      hasStdin: input.stdin !== void 0,
      timeoutMs: input.timeoutMs ?? DEFAULT_SSH_COMMAND_TIMEOUT_MS,
    });
    const child = yield* spawner
      .spawn(
        effect_unstable_process.ChildProcess.make("ssh", args, {
          env: environment,
          shell: process.platform === "win32",
          stdin: {
            stream: stdinStream(input.stdin),
            endOnDone: true,
          },
        }),
      )
      .pipe(
        effect_Effect.provideService(effect_Scope.Scope, commandScope),
        effect_Effect.mapError(
          (cause) =>
            new SshCommandError({
              command: ["ssh", ...args],
              exitCode: null,
              stderr: "",
              message:
                cause instanceof Error
                  ? cause.message
                  : `Failed to spawn SSH command for ${hostSpec}.`,
              cause,
            }),
        ),
      );
    const [stdout, stderr, exitCode] = yield* effect_Effect
      .all(
        [
          collectProcessOutput(child.stdout),
          collectProcessOutput(child.stderr),
          child.exitCode.pipe(effect_Effect.map(Number)),
        ],
        { concurrency: "unbounded" },
      )
      .pipe(
        effect_Effect.mapError(
          (cause) =>
            new SshCommandError({
              command: ["ssh", ...args],
              exitCode: null,
              stderr: "",
              message:
                cause instanceof Error
                  ? cause.message
                  : `Failed to run SSH command for ${hostSpec}.`,
              cause,
            }),
        ),
      );
    if (exitCode !== 0) {
      yield* effect_Effect.logWarning("ssh.command.failed", {
        ...sshTargetLogFields$1(target),
        command: ["ssh", ...args],
        exitCode,
        stderr,
      });
      return yield* new SshCommandError({
        command: ["ssh", ...args],
        exitCode,
        stderr,
        message: normalizeSshErrorMessage$1(
          stderr,
          `SSH command failed for ${hostSpec} (exit ${exitCode}).`,
        ),
      });
    }
    yield* effect_Effect.logDebug("ssh.command.succeeded", {
      ...sshTargetLogFields$1(target),
      command: ["ssh", ...args],
    });
    return {
      stdout,
      stderr,
    };
  },
);
const runSshCommand = effect_Effect.fn("ssh/command.runSshCommand")(function* (target, input = {}) {
  return yield* effect_Effect
    .scopedWith((commandScope) => runSshCommandInScope(target, input, commandScope))
    .pipe(
      effect_Effect.timeoutOption(
        effect_Duration.millis(input.timeoutMs ?? DEFAULT_SSH_COMMAND_TIMEOUT_MS),
      ),
      effect_Effect.flatMap((result) =>
        effect_Option.match(result, {
          onSome: effect_Effect.succeed,
          onNone: () =>
            effect_Effect.gen(function* () {
              yield* effect_Effect.logWarning("ssh.command.timedOut", {
                ...sshTargetLogFields$1(target),
                timeoutMs: input.timeoutMs ?? DEFAULT_SSH_COMMAND_TIMEOUT_MS,
                remoteCommandArgs: input.remoteCommandArgs ?? [],
                preHostArgs: input.preHostArgs ?? [],
                hasStdin: input.stdin !== void 0,
              });
              return yield* new SshCommandError({
                command: ["ssh"],
                exitCode: null,
                stderr: "",
                message: `SSH command timed out after ${input.timeoutMs ?? DEFAULT_SSH_COMMAND_TIMEOUT_MS}ms.`,
              });
            }),
        }),
      ),
    );
});
const resolveSshTarget = effect_Effect.fn("ssh/command.resolveSshTarget")(function* (alias) {
  const trimmedAlias = alias.trim();
  if (trimmedAlias.length === 0)
    return yield* new SshInvalidTargetError({ message: "SSH host alias is required." });
  yield* effect_Effect.logDebug("ssh.target.resolve.start", { alias: trimmedAlias });
  return yield* runSshCommand(
    {
      alias: trimmedAlias,
      hostname: trimmedAlias,
      username: null,
      port: null,
    },
    { preHostArgs: ["-G"] },
  ).pipe(
    effect_Effect.map((result) => parseSshResolveOutput(trimmedAlias, result.stdout)),
    effect_Effect.tap((target) =>
      effect_Effect.logDebug("ssh.target.resolve.succeeded", sshTargetLogFields$1(target)),
    ),
    effect_Effect.catch((cause) =>
      effect_Effect
        .logDebug("ssh.target.resolve.fallback", {
          alias: trimmedAlias,
          cause,
        })
        .pipe(
          effect_Effect.as({
            alias: trimmedAlias,
            hostname: trimmedAlias,
            username: null,
            port: null,
          }),
        ),
    ),
  );
});
function resolveRemoteT3CliPackageSpec(input) {
  const appVersion = input.appVersion.trim();
  if (!input.isDevelopment && PUBLISHABLE_T3_VERSION_PATTERN.test(appVersion))
    return `t3@${appVersion}`;
  if (input.isDevelopment) return "t3@nightly";
  return input.updateChannel === "nightly" ? "t3@nightly" : "t3@latest";
}

//#endregion
//#region ../server/package.json
var engines = { node: "^22.16 || ^23.11 || >=24.10" };

//#endregion
//#region src/ipc/DesktopIpc.ts
var DesktopIpc = class extends effect_Context.Service()("t3/desktop/Ipc") {};
const make$16 = (ipcMain) =>
  DesktopIpc.of({
    handle: effect_Effect.fn("desktop.ipc.registerInvoke")(function* ({ channel, handler }) {
      yield* effect_Effect.annotateCurrentSpan({ channel });
      const context = yield* effect_Effect.context();
      const runPromise = effect_Effect.runPromiseWith(context);
      yield* effect_Effect.acquireRelease(
        effect_Effect.sync(() => {
          ipcMain.removeHandler(channel);
          ipcMain.handle(channel, (_event, raw) =>
            runPromise(
              effect_Effect
                .gen(function* () {
                  yield* effect_Effect.annotateCurrentSpan({ channel });
                  return yield* handler(raw);
                })
                .pipe(
                  effect_Effect.annotateLogs({ channel }),
                  effect_Effect.withSpan("desktop.ipc.invoke"),
                ),
            ),
          );
        }),
        () => effect_Effect.sync(() => ipcMain.removeHandler(channel)),
      );
    }),
    handleSync: effect_Effect.fn("desktop.ipc.registerSync")(function* ({ channel, handler }) {
      yield* effect_Effect.annotateCurrentSpan({ channel });
      const context = yield* effect_Effect.context();
      const runSync = effect_Effect.runSyncWith(context);
      yield* effect_Effect.acquireRelease(
        effect_Effect.sync(() => {
          ipcMain.removeAllListeners(channel);
          ipcMain.on(channel, (event) => {
            event.returnValue = runSync(
              effect_Effect
                .gen(function* () {
                  yield* effect_Effect.annotateCurrentSpan({ channel });
                  return yield* handler();
                })
                .pipe(
                  effect_Effect.annotateLogs({ channel }),
                  effect_Effect.withSpan("desktop.ipc.invokeSync"),
                ),
            );
          });
        }),
        () => effect_Effect.sync(() => ipcMain.removeAllListeners(channel)),
      );
    }),
  });
const makeIpcMethod = (method) => {
  const decode = effect_Schema.decodeUnknownEffect(method.payload);
  const encode = effect_Schema.encodeUnknownEffect(method.result);
  return {
    channel: method.channel,
    handler: (raw) =>
      decode(raw).pipe(
        effect_Effect.flatMap(method.handler),
        effect_Effect.flatMap(encode),
        effect_Effect.withSpan("desktop.ipc.method", { attributes: { channel: method.channel } }),
      ),
  };
};
const makeSyncIpcMethod = (method) => {
  const encode = effect_Schema.encodeUnknownEffect(method.result);
  return {
    channel: method.channel,
    handler: () =>
      method
        .handler()
        .pipe(
          effect_Effect.flatMap(encode),
          effect_Effect.withSpan("desktop.ipc.method", { attributes: { channel: method.channel } }),
        ),
  };
};

//#endregion
//#region src/electron/ElectronApp.ts
var ElectronApp = class extends effect_Context.Service()("t3/desktop/electron/App") {};
const addScopedAppListener = (eventName, listener) =>
  effect_Effect
    .acquireRelease(
      effect_Effect.sync(() => {
        electron.app.on(eventName, listener);
      }),
      () =>
        effect_Effect.sync(() => {
          electron.app.removeListener(eventName, listener);
        }),
    )
    .pipe(effect_Effect.asVoid);
const make$15 = ElectronApp.of({
  metadata: effect_Effect.sync(() => ({
    appVersion: electron.app.getVersion(),
    appPath: electron.app.getAppPath(),
    isPackaged: electron.app.isPackaged,
    resourcesPath: process.resourcesPath,
    runningUnderArm64Translation: electron.app.runningUnderARM64Translation === true,
  })),
  name: effect_Effect.sync(() => electron.app.name),
  whenReady: effect_Effect.promise(() => electron.app.whenReady()).pipe(effect_Effect.asVoid),
  quit: effect_Effect.sync(() => {
    electron.app.quit();
  }),
  exit: (code) =>
    effect_Effect.sync(() => {
      electron.app.exit(code);
    }),
  relaunch: (options) =>
    effect_Effect.sync(() => {
      electron.app.relaunch(options);
    }),
  setPath: (name, path) =>
    effect_Effect.sync(() => {
      electron.app.setPath(name, path);
    }),
  setName: (name) =>
    effect_Effect.sync(() => {
      electron.app.setName(name);
    }),
  setAboutPanelOptions: (options) =>
    effect_Effect.sync(() => {
      electron.app.setAboutPanelOptions(options);
    }),
  setAppUserModelId: (id) =>
    effect_Effect.sync(() => {
      electron.app.setAppUserModelId(id);
    }),
  setDesktopName: (desktopName) =>
    effect_Effect.sync(() => {
      electron.app.setDesktopName?.(desktopName);
    }),
  setDockIcon: (iconPath) =>
    effect_Effect.sync(() => {
      electron.app.dock?.setIcon(iconPath);
    }),
  appendCommandLineSwitch: (switchName, value) =>
    effect_Effect.sync(() => {
      if (value === void 0) {
        electron.app.commandLine.appendSwitch(switchName);
        return;
      }
      electron.app.commandLine.appendSwitch(switchName, value);
    }),
  on: addScopedAppListener,
});
const layer$27 = effect_Layer.succeed(ElectronApp, make$15);

//#endregion
//#region src/electron/ElectronDialog.ts
const CONFIRM_BUTTON_INDEX = 1;
var ElectronDialog = class extends effect_Context.Service()("t3/desktop/electron/Dialog") {};
const make$14 = ElectronDialog.of({
  pickFolder: effect_Effect.fn("desktop.electron.dialog.pickFolder")(function* (input) {
    const openDialogOptions = effect_Option.match(input.defaultPath, {
      onNone: () => ({ properties: ["openDirectory", "createDirectory"] }),
      onSome: (defaultPath) => ({
        properties: ["openDirectory", "createDirectory"],
        defaultPath,
      }),
    });
    const result = yield* effect_Option.match(input.owner, {
      onNone: () => effect_Effect.promise(() => electron.dialog.showOpenDialog(openDialogOptions)),
      onSome: (owner) =>
        effect_Effect.promise(() => electron.dialog.showOpenDialog(owner, openDialogOptions)),
    });
    if (result.canceled) return effect_Option.none();
    return effect_Option.fromNullishOr(result.filePaths[0]);
  }),
  confirm: effect_Effect.fn("desktop.electron.dialog.confirm")(function* (input) {
    const normalizedMessage = input.message.trim();
    if (normalizedMessage.length === 0) return false;
    const options = {
      type: "question",
      buttons: ["No", "Yes"],
      defaultId: 0,
      cancelId: 0,
      noLink: true,
      message: normalizedMessage,
    };
    return (
      (yield* effect_Option.match(input.owner, {
        onNone: () => effect_Effect.promise(() => electron.dialog.showMessageBox(options)),
        onSome: (owner) =>
          effect_Effect.promise(() => electron.dialog.showMessageBox(owner, options)),
      })).response === CONFIRM_BUTTON_INDEX
    );
  }),
  showMessageBox: (options) => effect_Effect.promise(() => electron.dialog.showMessageBox(options)),
  showErrorBox: (title, content) =>
    effect_Effect.sync(() => {
      electron.dialog.showErrorBox(title, content);
    }),
});
const layer$26 = effect_Layer.succeed(ElectronDialog, make$14);

//#endregion
//#region src/electron/ElectronMenu.ts
var ElectronMenu = class extends effect_Context.Service()("t3/desktop/electron/Menu") {};
function normalizeContextMenuItems(source) {
  const normalizedItems = [];
  for (const sourceItem of source) {
    if (typeof sourceItem.id !== "string" || typeof sourceItem.label !== "string") continue;
    const normalizedItem = {
      id: sourceItem.id,
      label: sourceItem.label,
      destructive: sourceItem.destructive === true,
      disabled: sourceItem.disabled === true,
    };
    if (sourceItem.children) {
      const normalizedChildren = normalizeContextMenuItems(sourceItem.children);
      if (normalizedChildren.length === 0) continue;
      normalizedItem.children = normalizedChildren;
    }
    normalizedItems.push(normalizedItem);
  }
  return normalizedItems;
}
const normalizePosition = (position) =>
  effect_Option
    .filter(position, ({ x, y }) => Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0)
    .pipe(
      effect_Option.map(({ x, y }) => ({
        x: Math.floor(x),
        y: Math.floor(y),
      })),
    );
const layer$25 = effect_Layer.sync(ElectronMenu, () => {
  let destructiveMenuIconCache;
  const getDestructiveMenuIcon = () => {
    if (process.platform !== "darwin") return effect_Option.none();
    if (destructiveMenuIconCache !== void 0) return destructiveMenuIconCache;
    try {
      const icon = electron.nativeImage.createFromNamedImage("trash").resize({
        width: 12,
        height: 12,
      });
      icon.setTemplateImage(true);
      destructiveMenuIconCache = icon.isEmpty() ? effect_Option.none() : effect_Option.some(icon);
    } catch {
      destructiveMenuIconCache = effect_Option.none();
    }
    return destructiveMenuIconCache;
  };
  const buildTemplate = (entries, complete) => {
    const template = [];
    let hasInsertedDestructiveSeparator = false;
    for (const item of entries) {
      if (item.destructive && !hasInsertedDestructiveSeparator && template.length > 0) {
        template.push({ type: "separator" });
        hasInsertedDestructiveSeparator = true;
      }
      const itemOption = {
        label: item.label,
        enabled: !item.disabled,
      };
      if (item.children && item.children.length > 0)
        itemOption.submenu = buildTemplate(item.children, complete);
      else itemOption.click = () => complete(effect_Option.some(item.id));
      if (item.destructive && (!item.children || item.children.length === 0)) {
        const destructiveIcon = getDestructiveMenuIcon();
        if (effect_Option.isSome(destructiveIcon)) itemOption.icon = destructiveIcon.value;
      }
      template.push(itemOption);
    }
    return template;
  };
  return ElectronMenu.of({
    setApplicationMenu: (template) =>
      effect_Effect.sync(() => {
        electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate([...template]));
      }),
    popupTemplate: (input) =>
      effect_Effect.sync(() => {
        if (input.template.length === 0) return;
        electron.Menu.buildFromTemplate([...input.template]).popup({ window: input.window });
      }),
    showContextMenu: (input) =>
      effect_Effect.callback((resume) => {
        const normalizedItems = normalizeContextMenuItems(input.items);
        if (normalizedItems.length === 0) {
          resume(effect_Effect.succeed(effect_Option.none()));
          return;
        }
        let completed = false;
        const complete = (selectedItemId) => {
          if (completed) return;
          completed = true;
          resume(effect_Effect.succeed(selectedItemId));
        };
        const menu = electron.Menu.buildFromTemplate(buildTemplate(normalizedItems, complete));
        const popupPosition = normalizePosition(input.position);
        const popupOptions = effect_Option.match(popupPosition, {
          onNone: () => ({
            window: input.window,
            callback: () => complete(effect_Option.none()),
          }),
          onSome: (position) => ({
            window: input.window,
            x: position.x,
            y: position.y,
            callback: () => complete(effect_Option.none()),
          }),
        });
        menu.popup(popupOptions);
      }),
  });
});

//#endregion
//#region ../../packages/contracts/src/baseSchemas.ts
const TrimmedString = effect_Schema.String.pipe(
  effect_Schema.decodeTo(
    effect_Schema.String,
    effect_SchemaTransformation.transformOrFail({
      decode: (value) => effect_Effect.succeed(value.trim()),
      encode: (value) => effect_Effect.succeed(value.trim()),
    }),
  ),
);
const TrimmedNonEmptyString = TrimmedString.check(effect_Schema.isNonEmpty());
const NonNegativeInt = effect_Schema.Int.check(effect_Schema.isGreaterThanOrEqualTo(0));
const PositiveInt = effect_Schema.Int.check(effect_Schema.isGreaterThanOrEqualTo(1));
const PortSchema = effect_Schema.Int.check(
  effect_Schema.isBetween({
    minimum: 1,
    maximum: 65535,
  }),
);
const IsoDateTime = effect_Schema.String;
/**
 * Construct a branded identifier. Enforces non-empty trimmed strings
 */
const makeEntityId = (brand) => {
  return TrimmedNonEmptyString.pipe(effect_Schema.brand(brand));
};
const ThreadId = makeEntityId("ThreadId");
const ProjectId = makeEntityId("ProjectId");
const EnvironmentId = makeEntityId("EnvironmentId");
const CommandId = makeEntityId("CommandId");
const EventId = makeEntityId("EventId");
const MessageId = makeEntityId("MessageId");
const TurnId = makeEntityId("TurnId");
const AuthSessionId = makeEntityId("AuthSessionId");
const ProviderItemId = makeEntityId("ProviderItemId");
const RuntimeSessionId = makeEntityId("RuntimeSessionId");
const RuntimeItemId = makeEntityId("RuntimeItemId");
const RuntimeRequestId = makeEntityId("RuntimeRequestId");
const RuntimeTaskId = makeEntityId("RuntimeTaskId");
const ApprovalRequestId = makeEntityId("ApprovalRequestId");
const CheckpointRef = makeEntityId("CheckpointRef");

//#endregion
//#region ../../packages/contracts/src/auth.ts
/**
 * Declares the server's overall authentication posture.
 *
 * This is a high-level policy label that tells clients how the environment is
 * expected to be accessed, not a transport detail and not an exhaustive list
 * of every accepted credential.
 *
 * Typical usage:
 * - rendered in auth/pairing UI so the user understands what kind of
 *   environment they are connecting to
 * - used by clients to decide whether silent desktop bootstrap is expected or
 *   whether an explicit pairing flow should be shown
 *
 * Meanings:
 * - `desktop-managed-local`: local desktop-managed environment with narrow
 *   trusted bootstrap, intended to avoid login prompts on the same machine
 * - `loopback-browser`: standalone local server intended for browser pairing on
 *   the same machine
 * - `remote-reachable`: environment intended to be reached from other devices
 *   or networks, where explicit pairing/auth is expected
 * - `unsafe-no-auth`: intentionally unauthenticated mode; this is an explicit
 *   unsafe escape hatch, not a normal deployment mode
 */
const ServerAuthPolicy = effect_Schema.Literals([
  "desktop-managed-local",
  "loopback-browser",
  "remote-reachable",
  "unsafe-no-auth",
]);
/**
 * A credential type that can be exchanged for a real authenticated session.
 *
 * Bootstrap methods are for establishing trust at the start of a connection or
 * pairing flow. They are not the long-lived credential used for ordinary
 * authenticated HTTP / WebSocket traffic after pairing succeeds.
 *
 * Current methods:
 * - `desktop-bootstrap`: a trusted local desktop handoff, used so the desktop
 *   shell can pair the renderer without a login screen
 * - `one-time-token`: a short-lived pairing token, suitable for manual pairing
 *   flows such as `/pair?token=...`
 */
const ServerAuthBootstrapMethod = effect_Schema.Literals(["desktop-bootstrap", "one-time-token"]);
/**
 * A credential type accepted for steady-state authenticated requests after a
 * client has already paired.
 *
 * These methods are used by the server-wide auth layer for privileged HTTP and
 * WebSocket access. They are distinct from bootstrap methods so clients can
 * reason clearly about "pair first, then use session auth".
 *
 * Current methods:
 * - `browser-session-cookie`: cookie-backed browser session, used by the web
 *   app after bootstrap/pairing
 * - `bearer-session-token`: token-based session suitable for non-cookie or
 *   non-browser clients
 */
const ServerAuthSessionMethod = effect_Schema.Literals([
  "browser-session-cookie",
  "bearer-session-token",
]);
const AuthSessionRole = effect_Schema.Literals(["owner", "client"]);
/**
 * Server-advertised auth capabilities for a specific execution environment.
 *
 * Clients should treat this as the authoritative description of how that
 * environment expects to be paired and how authenticated requests should be
 * made afterward.
 *
 * Field meanings:
 * - `policy`: high-level auth posture for the environment
 * - `bootstrapMethods`: pairing/bootstrap methods the server is currently
 *   willing to accept
 * - `sessionMethods`: authenticated request/session methods the server supports
 *   once pairing is complete
 * - `sessionCookieName`: cookie name clients should expect when
 *   `browser-session-cookie` is in use
 *
 * This descriptor is intentionally capability-oriented. It lets clients choose
 * the right UX without embedding server-specific auth logic or assuming a
 * single access method.
 */
const ServerAuthDescriptor = effect_Schema.Struct({
  policy: ServerAuthPolicy,
  bootstrapMethods: effect_Schema.Array(ServerAuthBootstrapMethod),
  sessionMethods: effect_Schema.Array(ServerAuthSessionMethod),
  sessionCookieName: TrimmedNonEmptyString,
});
const AuthBootstrapInput = effect_Schema.Struct({ credential: TrimmedNonEmptyString });
const AuthBootstrapResult = effect_Schema.Struct({
  authenticated: effect_Schema.Literal(true),
  role: AuthSessionRole,
  sessionMethod: ServerAuthSessionMethod,
  expiresAt: effect_Schema.DateTimeUtcFromString,
});
const AuthBearerBootstrapResult = effect_Schema.Struct({
  authenticated: effect_Schema.Literal(true),
  role: AuthSessionRole,
  sessionMethod: effect_Schema.Literal("bearer-session-token"),
  expiresAt: effect_Schema.DateTimeUtcFromString,
  sessionToken: TrimmedNonEmptyString,
});
const AuthWebSocketTokenResult = effect_Schema.Struct({
  token: TrimmedNonEmptyString,
  expiresAt: effect_Schema.DateTimeUtcFromString,
});
const AuthPairingCredentialResult = effect_Schema.Struct({
  id: TrimmedNonEmptyString,
  credential: TrimmedNonEmptyString,
  label: effect_Schema.optionalKey(TrimmedNonEmptyString),
  expiresAt: effect_Schema.DateTimeUtcFromString,
});
const AuthPairingLink = effect_Schema.Struct({
  id: TrimmedNonEmptyString,
  credential: TrimmedNonEmptyString,
  role: AuthSessionRole,
  subject: TrimmedNonEmptyString,
  label: effect_Schema.optionalKey(TrimmedNonEmptyString),
  createdAt: effect_Schema.DateTimeUtcFromString,
  expiresAt: effect_Schema.DateTimeUtcFromString,
});
const AuthClientMetadataDeviceType = effect_Schema.Literals([
  "desktop",
  "mobile",
  "tablet",
  "bot",
  "unknown",
]);
const AuthClientMetadata = effect_Schema.Struct({
  label: effect_Schema.optionalKey(TrimmedNonEmptyString),
  ipAddress: effect_Schema.optionalKey(TrimmedNonEmptyString),
  userAgent: effect_Schema.optionalKey(TrimmedNonEmptyString),
  deviceType: AuthClientMetadataDeviceType,
  os: effect_Schema.optionalKey(TrimmedNonEmptyString),
  browser: effect_Schema.optionalKey(TrimmedNonEmptyString),
});
const AuthClientSession = effect_Schema.Struct({
  sessionId: AuthSessionId,
  subject: TrimmedNonEmptyString,
  role: AuthSessionRole,
  method: ServerAuthSessionMethod,
  client: AuthClientMetadata,
  issuedAt: effect_Schema.DateTimeUtcFromString,
  expiresAt: effect_Schema.DateTimeUtcFromString,
  lastConnectedAt: effect_Schema.NullOr(effect_Schema.DateTimeUtcFromString),
  connected: effect_Schema.Boolean,
  current: effect_Schema.Boolean,
});
const AuthAccessSnapshot = effect_Schema.Struct({
  pairingLinks: effect_Schema.Array(AuthPairingLink),
  clientSessions: effect_Schema.Array(AuthClientSession),
});
const AuthAccessStreamSnapshotEvent = effect_Schema.Struct({
  version: effect_Schema.Literal(1),
  revision: effect_Schema.Number,
  type: effect_Schema.Literal("snapshot"),
  payload: AuthAccessSnapshot,
});
const AuthAccessStreamPairingLinkUpsertedEvent = effect_Schema.Struct({
  version: effect_Schema.Literal(1),
  revision: effect_Schema.Number,
  type: effect_Schema.Literal("pairingLinkUpserted"),
  payload: AuthPairingLink,
});
const AuthAccessStreamPairingLinkRemovedEvent = effect_Schema.Struct({
  version: effect_Schema.Literal(1),
  revision: effect_Schema.Number,
  type: effect_Schema.Literal("pairingLinkRemoved"),
  payload: effect_Schema.Struct({ id: TrimmedNonEmptyString }),
});
const AuthAccessStreamClientUpsertedEvent = effect_Schema.Struct({
  version: effect_Schema.Literal(1),
  revision: effect_Schema.Number,
  type: effect_Schema.Literal("clientUpserted"),
  payload: AuthClientSession,
});
const AuthAccessStreamClientRemovedEvent = effect_Schema.Struct({
  version: effect_Schema.Literal(1),
  revision: effect_Schema.Number,
  type: effect_Schema.Literal("clientRemoved"),
  payload: effect_Schema.Struct({ sessionId: AuthSessionId }),
});
const AuthAccessStreamEvent = effect_Schema.Union([
  AuthAccessStreamSnapshotEvent,
  AuthAccessStreamPairingLinkUpsertedEvent,
  AuthAccessStreamPairingLinkRemovedEvent,
  AuthAccessStreamClientUpsertedEvent,
  AuthAccessStreamClientRemovedEvent,
]);
const AuthRevokePairingLinkInput = effect_Schema.Struct({ id: TrimmedNonEmptyString });
const AuthRevokeClientSessionInput = effect_Schema.Struct({ sessionId: AuthSessionId });
const AuthCreatePairingCredentialInput = effect_Schema.Struct({
  label: effect_Schema.optionalKey(TrimmedNonEmptyString),
});
const AuthSessionState = effect_Schema.Struct({
  authenticated: effect_Schema.Boolean,
  auth: ServerAuthDescriptor,
  role: effect_Schema.optionalKey(AuthSessionRole),
  sessionMethod: effect_Schema.optionalKey(ServerAuthSessionMethod),
  expiresAt: effect_Schema.optionalKey(effect_Schema.DateTimeUtcFromString),
});

//#endregion
//#region ../../packages/contracts/src/environment.ts
const ExecutionEnvironmentPlatformOs = effect_Schema.Literals([
  "darwin",
  "linux",
  "windows",
  "unknown",
]);
const ExecutionEnvironmentPlatformArch = effect_Schema.Literals(["arm64", "x64", "other"]);
const ExecutionEnvironmentPlatform = effect_Schema.Struct({
  os: ExecutionEnvironmentPlatformOs,
  arch: ExecutionEnvironmentPlatformArch,
});
const ExecutionEnvironmentCapabilities = effect_Schema.Struct({
  repositoryIdentity: effect_Schema.Boolean.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(false)),
  ),
});
const ExecutionEnvironmentDescriptor = effect_Schema.Struct({
  environmentId: EnvironmentId,
  label: TrimmedNonEmptyString,
  platform: ExecutionEnvironmentPlatform,
  serverVersion: TrimmedNonEmptyString,
  capabilities: ExecutionEnvironmentCapabilities,
});
const EnvironmentConnectionState = effect_Schema.Literals([
  "connecting",
  "connected",
  "disconnected",
  "error",
]);
const RepositoryIdentityLocator = effect_Schema.Struct({
  source: effect_Schema.Literal("git-remote"),
  remoteName: TrimmedNonEmptyString,
  remoteUrl: TrimmedNonEmptyString,
});
const RepositoryIdentity = effect_Schema.Struct({
  canonicalKey: TrimmedNonEmptyString,
  locator: RepositoryIdentityLocator,
  rootPath: effect_Schema.optionalKey(TrimmedNonEmptyString),
  displayName: effect_Schema.optionalKey(TrimmedNonEmptyString),
  provider: effect_Schema.optionalKey(TrimmedNonEmptyString),
  owner: effect_Schema.optionalKey(TrimmedNonEmptyString),
  name: effect_Schema.optionalKey(TrimmedNonEmptyString),
});
const ScopedProjectRef = effect_Schema.Struct({
  environmentId: EnvironmentId,
  projectId: ProjectId,
});
const ScopedThreadRef = effect_Schema.Struct({
  environmentId: EnvironmentId,
  threadId: ThreadId,
});
const ScopedThreadSessionRef = effect_Schema.Struct({
  environmentId: EnvironmentId,
  threadId: ThreadId,
});

//#endregion
//#region ../../packages/contracts/src/desktopBootstrap.ts
const DesktopBackendBootstrap = effect_Schema.Struct({
  mode: effect_Schema.Literal("desktop"),
  noBrowser: effect_Schema.Boolean,
  port: PortSchema,
  t3Home: effect_Schema.String,
  host: effect_Schema.String,
  desktopBootstrapToken: effect_Schema.String,
  tailscaleServeEnabled: effect_Schema.Boolean,
  tailscaleServePort: PortSchema,
  otlpTracesUrl: effect_Schema.optional(effect_Schema.String),
  otlpMetricsUrl: effect_Schema.optional(effect_Schema.String),
});

//#endregion
//#region ../../packages/contracts/src/remoteAccess.ts
const AdvertisedEndpointProviderKind = effect_Schema.Literals([
  "core",
  "private-network",
  "tunnel",
  "manual",
]);
const AdvertisedEndpointReachability = effect_Schema.Literals([
  "loopback",
  "lan",
  "private-network",
  "public",
]);
const AdvertisedEndpointHostedHttpsCompatibility = effect_Schema.Literals([
  "compatible",
  "mixed-content-blocked",
  "requires-configuration",
  "unknown",
]);
const AdvertisedEndpointStatus = effect_Schema.Literals(["available", "unavailable", "unknown"]);
const AdvertisedEndpointSource = effect_Schema.Literals([
  "desktop-core",
  "desktop-addon",
  "server",
  "user",
]);
const AdvertisedEndpointProvider = effect_Schema.Struct({
  id: TrimmedNonEmptyString,
  label: TrimmedNonEmptyString,
  kind: AdvertisedEndpointProviderKind,
  isAddon: effect_Schema.Boolean,
});
const AdvertisedEndpointCompatibility = effect_Schema.Struct({
  hostedHttpsApp: AdvertisedEndpointHostedHttpsCompatibility,
  desktopApp: effect_Schema.Literals(["compatible", "unknown"]),
});
const AdvertisedEndpoint = effect_Schema.Struct({
  id: TrimmedNonEmptyString,
  label: TrimmedNonEmptyString,
  provider: AdvertisedEndpointProvider,
  httpBaseUrl: TrimmedNonEmptyString,
  wsBaseUrl: TrimmedNonEmptyString,
  reachability: AdvertisedEndpointReachability,
  compatibility: AdvertisedEndpointCompatibility,
  source: AdvertisedEndpointSource,
  status: AdvertisedEndpointStatus,
  isDefault: effect_Schema.optional(effect_Schema.Boolean),
  description: effect_Schema.optional(TrimmedNonEmptyString),
});

//#endregion
//#region ../../packages/contracts/src/editor.ts
const EditorLaunchStyle = effect_Schema.Literals(["direct-path", "goto", "line-column"]);
const EDITORS = [
  {
    id: "cursor",
    label: "Cursor",
    commands: ["cursor"],
    launchStyle: "goto",
  },
  {
    id: "trae",
    label: "Trae",
    commands: ["trae"],
    launchStyle: "goto",
  },
  {
    id: "kiro",
    label: "Kiro",
    commands: ["kiro"],
    baseArgs: ["ide"],
    launchStyle: "goto",
  },
  {
    id: "vscode",
    label: "VS Code",
    commands: ["code"],
    launchStyle: "goto",
  },
  {
    id: "vscode-insiders",
    label: "VS Code Insiders",
    commands: ["code-insiders"],
    launchStyle: "goto",
  },
  {
    id: "vscodium",
    label: "VSCodium",
    commands: ["codium"],
    launchStyle: "goto",
  },
  {
    id: "zed",
    label: "Zed",
    commands: ["zed", "zeditor"],
    launchStyle: "direct-path",
  },
  {
    id: "antigravity",
    label: "Antigravity",
    commands: ["agy"],
    launchStyle: "goto",
  },
  {
    id: "idea",
    label: "IntelliJ IDEA",
    commands: ["idea"],
    launchStyle: "line-column",
  },
  {
    id: "aqua",
    label: "Aqua",
    commands: ["aqua"],
    launchStyle: "line-column",
  },
  {
    id: "clion",
    label: "CLion",
    commands: ["clion"],
    launchStyle: "line-column",
  },
  {
    id: "datagrip",
    label: "DataGrip",
    commands: ["datagrip"],
    launchStyle: "line-column",
  },
  {
    id: "dataspell",
    label: "DataSpell",
    commands: ["dataspell"],
    launchStyle: "line-column",
  },
  {
    id: "goland",
    label: "GoLand",
    commands: ["goland"],
    launchStyle: "line-column",
  },
  {
    id: "phpstorm",
    label: "PhpStorm",
    commands: ["phpstorm"],
    launchStyle: "line-column",
  },
  {
    id: "pycharm",
    label: "PyCharm",
    commands: ["pycharm"],
    launchStyle: "line-column",
  },
  {
    id: "rider",
    label: "Rider",
    commands: ["rider"],
    launchStyle: "line-column",
  },
  {
    id: "rubymine",
    label: "RubyMine",
    commands: ["rubymine"],
    launchStyle: "line-column",
  },
  {
    id: "rustrover",
    label: "RustRover",
    commands: ["rustrover"],
    launchStyle: "line-column",
  },
  {
    id: "webstorm",
    label: "WebStorm",
    commands: ["webstorm"],
    launchStyle: "line-column",
  },
  {
    id: "file-manager",
    label: "File Manager",
    commands: null,
    launchStyle: "direct-path",
  },
];
const EditorId = effect_Schema.Literals(EDITORS.map((e) => e.id));
const LaunchEditorInput = effect_Schema.Struct({
  cwd: TrimmedNonEmptyString,
  editor: EditorId,
});
var ExternalLauncherError = class extends effect_Schema.TaggedErrorClass()(
  "ExternalLauncherError",
  {
    message: effect_Schema.String,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {};

//#endregion
//#region ../../packages/contracts/src/ipc.ts
const ContextMenuItemSchema = effect_Schema.Struct({
  id: effect_Schema.String,
  label: effect_Schema.String,
  destructive: effect_Schema.optionalKey(effect_Schema.Boolean),
  disabled: effect_Schema.optionalKey(effect_Schema.Boolean),
  children: effect_Schema.optionalKey(
    effect_Schema.Array(effect_Schema.suspend(() => ContextMenuItemSchema)),
  ),
});
const DesktopUpdateStatusSchema = effect_Schema.Literals([
  "disabled",
  "idle",
  "checking",
  "up-to-date",
  "available",
  "downloading",
  "downloaded",
  "error",
]);
const DesktopRuntimeArchSchema = effect_Schema.Literals(["arm64", "x64", "other"]);
const DesktopThemeSchema = effect_Schema.Literals(["light", "dark", "system"]);
const DesktopUpdateChannelSchema = effect_Schema.Literals(["latest", "nightly"]);
const DesktopAppStageLabelSchema = effect_Schema.Literals(["Alpha", "Dev", "Nightly"]);
const DesktopAppBrandingSchema = effect_Schema.Struct({
  baseName: effect_Schema.String,
  stageLabel: DesktopAppStageLabelSchema,
  displayName: effect_Schema.String,
});
const DesktopRuntimeInfoSchema = effect_Schema.Struct({
  hostArch: DesktopRuntimeArchSchema,
  appArch: DesktopRuntimeArchSchema,
  runningUnderArm64Translation: effect_Schema.Boolean,
});
const DesktopUpdateStateSchema = effect_Schema.Struct({
  enabled: effect_Schema.Boolean,
  status: DesktopUpdateStatusSchema,
  channel: DesktopUpdateChannelSchema,
  currentVersion: effect_Schema.String,
  hostArch: DesktopRuntimeArchSchema,
  appArch: DesktopRuntimeArchSchema,
  runningUnderArm64Translation: effect_Schema.Boolean,
  availableVersion: effect_Schema.NullOr(effect_Schema.String),
  downloadedVersion: effect_Schema.NullOr(effect_Schema.String),
  downloadPercent: effect_Schema.NullOr(effect_Schema.Number),
  checkedAt: effect_Schema.NullOr(effect_Schema.String),
  message: effect_Schema.NullOr(effect_Schema.String),
  errorContext: effect_Schema.NullOr(effect_Schema.Literals(["check", "download", "install"])),
  canRetry: effect_Schema.Boolean,
});
const DesktopUpdateActionResultSchema = effect_Schema.Struct({
  accepted: effect_Schema.Boolean,
  completed: effect_Schema.Boolean,
  state: DesktopUpdateStateSchema,
});
const DesktopUpdateCheckResultSchema = effect_Schema.Struct({
  checked: effect_Schema.Boolean,
  state: DesktopUpdateStateSchema,
});
const DesktopEnvironmentBootstrapSchema = effect_Schema.Struct({
  label: effect_Schema.String,
  httpBaseUrl: effect_Schema.NullOr(effect_Schema.String),
  wsBaseUrl: effect_Schema.NullOr(effect_Schema.String),
  bootstrapToken: effect_Schema.optionalKey(effect_Schema.String),
});
const DesktopSshEnvironmentTargetSchema = effect_Schema.Struct({
  alias: effect_Schema.String,
  hostname: effect_Schema.String,
  username: effect_Schema.NullOr(effect_Schema.String),
  port: effect_Schema.NullOr(effect_Schema.Number),
});
const DesktopSshHostSourceSchema = effect_Schema.Literals(["ssh-config", "known-hosts"]);
const DesktopDiscoveredSshHostSchema = effect_Schema.Struct({
  alias: effect_Schema.String,
  hostname: effect_Schema.String,
  username: effect_Schema.NullOr(effect_Schema.String),
  port: effect_Schema.NullOr(effect_Schema.Number),
  source: DesktopSshHostSourceSchema,
});
const DesktopSshEnvironmentBootstrapSchema = effect_Schema.Struct({
  target: DesktopSshEnvironmentTargetSchema,
  httpBaseUrl: effect_Schema.String,
  wsBaseUrl: effect_Schema.String,
  pairingToken: effect_Schema.NullOr(effect_Schema.String),
  remotePort: effect_Schema.optionalKey(effect_Schema.Number),
  remoteServerKind: effect_Schema.optionalKey(effect_Schema.Literals(["external", "managed"])),
});
const DesktopSshPasswordPromptRequestSchema = effect_Schema.Struct({
  requestId: effect_Schema.String,
  destination: effect_Schema.String,
  username: effect_Schema.NullOr(effect_Schema.String),
  prompt: effect_Schema.String,
  expiresAt: effect_Schema.String,
});
const DesktopSshPasswordPromptCancelledType = "ssh-password-prompt-cancelled";
const DesktopSshPasswordPromptCancelledResultSchema = effect_Schema.Struct({
  type: effect_Schema.Literal(DesktopSshPasswordPromptCancelledType),
  message: effect_Schema.String,
});
const DesktopSshEnvironmentEnsureOptionsSchema = effect_Schema.Struct({
  issuePairingToken: effect_Schema.optionalKey(effect_Schema.Boolean),
});
const DesktopSshEnvironmentEnsureInputSchema = effect_Schema.Struct({
  target: DesktopSshEnvironmentTargetSchema,
  options: effect_Schema.optionalKey(DesktopSshEnvironmentEnsureOptionsSchema),
});
const DesktopSshEnvironmentEnsureResultSchema = effect_Schema.Union([
  DesktopSshEnvironmentBootstrapSchema,
  DesktopSshPasswordPromptCancelledResultSchema,
]);
const DesktopSshHttpBaseUrlInputSchema = effect_Schema.Struct({
  httpBaseUrl: effect_Schema.String,
});
const DesktopSshBearerRequestInputSchema = effect_Schema.Struct({
  httpBaseUrl: effect_Schema.String,
  bearerToken: effect_Schema.String,
});
const DesktopSshBearerBootstrapInputSchema = effect_Schema.Struct({
  httpBaseUrl: effect_Schema.String,
  credential: effect_Schema.String,
});
const DesktopSshPasswordPromptResolutionInputSchema = effect_Schema.Struct({
  requestId: effect_Schema.String,
  password: effect_Schema.NullOr(effect_Schema.String),
});
const PersistedSavedEnvironmentRecordSchema = effect_Schema.Struct({
  environmentId: EnvironmentId,
  label: effect_Schema.String,
  wsBaseUrl: effect_Schema.String,
  httpBaseUrl: effect_Schema.String,
  createdAt: effect_Schema.String,
  lastConnectedAt: effect_Schema.NullOr(effect_Schema.String),
  desktopSsh: effect_Schema.optionalKey(DesktopSshEnvironmentTargetSchema),
});
const DesktopServerExposureModeSchema = effect_Schema.Literals([
  "local-only",
  "network-accessible",
]);
const DesktopServerExposureStateSchema = effect_Schema.Struct({
  mode: DesktopServerExposureModeSchema,
  endpointUrl: effect_Schema.NullOr(effect_Schema.String),
  advertisedHost: effect_Schema.NullOr(effect_Schema.String),
  tailscaleServeEnabled: effect_Schema.Boolean,
  tailscaleServePort: effect_Schema.Number,
});
const PickFolderOptionsSchema = effect_Schema.Struct({
  initialPath: effect_Schema.optionalKey(effect_Schema.NullOr(effect_Schema.String)),
});

//#endregion
//#region ../../packages/contracts/src/terminal.ts
const DEFAULT_TERMINAL_ID = "default";
const TrimmedNonEmptyStringSchema$2 = TrimmedNonEmptyString;
const TerminalColsSchema = effect_Schema.Int.check(effect_Schema.isGreaterThanOrEqualTo(1)).check(
  effect_Schema.isLessThanOrEqualTo(1e3),
);
const TerminalRowsSchema = effect_Schema.Int.check(effect_Schema.isGreaterThanOrEqualTo(1)).check(
  effect_Schema.isLessThanOrEqualTo(500),
);
const TerminalIdSchema = TrimmedNonEmptyStringSchema$2.check(effect_Schema.isMaxLength(128));
const TerminalEnvKeySchema = effect_Schema.String.check(
  effect_Schema.isPattern(/^[A-Za-z_][A-Za-z0-9_]*$/),
).check(effect_Schema.isMaxLength(128));
const TerminalEnvValueSchema = effect_Schema.String.check(effect_Schema.isMaxLength(8192));
const TerminalEnvSchema = effect_Schema
  .Record(TerminalEnvKeySchema, TerminalEnvValueSchema)
  .check(effect_Schema.isMaxProperties(128));
const TerminalIdWithDefaultSchema = TerminalIdSchema.pipe(
  effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_TERMINAL_ID)),
);
const TerminalThreadInput = effect_Schema.Struct({ threadId: TrimmedNonEmptyStringSchema$2 });
const TerminalSessionInput = effect_Schema.Struct({
  ...TerminalThreadInput.fields,
  terminalId: TerminalIdWithDefaultSchema,
});
const TerminalOpenInput = effect_Schema.Struct({
  ...TerminalSessionInput.fields,
  cwd: TrimmedNonEmptyStringSchema$2,
  worktreePath: effect_Schema.optional(effect_Schema.NullOr(TrimmedNonEmptyStringSchema$2)),
  cols: effect_Schema.optional(TerminalColsSchema),
  rows: effect_Schema.optional(TerminalRowsSchema),
  env: effect_Schema.optional(TerminalEnvSchema),
});
const TerminalWriteInput = effect_Schema.Struct({
  ...TerminalSessionInput.fields,
  data: effect_Schema.String.check(effect_Schema.isNonEmpty()).check(
    effect_Schema.isMaxLength(65536),
  ),
});
const TerminalResizeInput = effect_Schema.Struct({
  ...TerminalSessionInput.fields,
  cols: TerminalColsSchema,
  rows: TerminalRowsSchema,
});
const TerminalClearInput = TerminalSessionInput;
const TerminalRestartInput = effect_Schema.Struct({
  ...TerminalSessionInput.fields,
  cwd: TrimmedNonEmptyStringSchema$2,
  worktreePath: effect_Schema.optional(effect_Schema.NullOr(TrimmedNonEmptyStringSchema$2)),
  cols: TerminalColsSchema,
  rows: TerminalRowsSchema,
  env: effect_Schema.optional(TerminalEnvSchema),
});
const TerminalCloseInput = effect_Schema.Struct({
  ...TerminalThreadInput.fields,
  terminalId: effect_Schema.optional(TerminalIdSchema),
  deleteHistory: effect_Schema.optional(effect_Schema.Boolean),
});
const TerminalSessionStatus = effect_Schema.Literals(["starting", "running", "exited", "error"]);
const TerminalSessionSnapshot = effect_Schema.Struct({
  threadId: effect_Schema.String.check(effect_Schema.isNonEmpty()),
  terminalId: effect_Schema.String.check(effect_Schema.isNonEmpty()),
  cwd: effect_Schema.String.check(effect_Schema.isNonEmpty()),
  worktreePath: effect_Schema.NullOr(TrimmedNonEmptyStringSchema$2),
  status: TerminalSessionStatus,
  pid: effect_Schema.NullOr(effect_Schema.Int.check(effect_Schema.isGreaterThan(0))),
  history: effect_Schema.String,
  exitCode: effect_Schema.NullOr(effect_Schema.Int),
  exitSignal: effect_Schema.NullOr(effect_Schema.Int),
  updatedAt: effect_Schema.String,
});
const TerminalEventBaseSchema = effect_Schema.Struct({
  threadId: effect_Schema.String.check(effect_Schema.isNonEmpty()),
  terminalId: effect_Schema.String.check(effect_Schema.isNonEmpty()),
  createdAt: effect_Schema.String,
});
const TerminalStartedEvent = effect_Schema.Struct({
  ...TerminalEventBaseSchema.fields,
  type: effect_Schema.Literal("started"),
  snapshot: TerminalSessionSnapshot,
});
const TerminalOutputEvent = effect_Schema.Struct({
  ...TerminalEventBaseSchema.fields,
  type: effect_Schema.Literal("output"),
  data: effect_Schema.String,
});
const TerminalExitedEvent = effect_Schema.Struct({
  ...TerminalEventBaseSchema.fields,
  type: effect_Schema.Literal("exited"),
  exitCode: effect_Schema.NullOr(effect_Schema.Int),
  exitSignal: effect_Schema.NullOr(effect_Schema.Int),
});
const TerminalErrorEvent = effect_Schema.Struct({
  ...TerminalEventBaseSchema.fields,
  type: effect_Schema.Literal("error"),
  message: effect_Schema.String.check(effect_Schema.isNonEmpty()),
});
const TerminalClearedEvent = effect_Schema.Struct({
  ...TerminalEventBaseSchema.fields,
  type: effect_Schema.Literal("cleared"),
});
const TerminalRestartedEvent = effect_Schema.Struct({
  ...TerminalEventBaseSchema.fields,
  type: effect_Schema.Literal("restarted"),
  snapshot: TerminalSessionSnapshot,
});
const TerminalActivityEvent = effect_Schema.Struct({
  ...TerminalEventBaseSchema.fields,
  type: effect_Schema.Literal("activity"),
  hasRunningSubprocess: effect_Schema.Boolean,
});
const TerminalEvent = effect_Schema.Union([
  TerminalStartedEvent,
  TerminalOutputEvent,
  TerminalExitedEvent,
  TerminalErrorEvent,
  TerminalClearedEvent,
  TerminalRestartedEvent,
  TerminalActivityEvent,
]);
var TerminalCwdError = class extends effect_Schema.TaggedErrorClass()("TerminalCwdError", {
  cwd: effect_Schema.String,
  reason: effect_Schema.Literals(["notFound", "notDirectory", "statFailed"]),
  cause: effect_Schema.optional(effect_Schema.Defect),
}) {
  get message() {
    if (this.reason === "notDirectory") return `Terminal cwd is not a directory: ${this.cwd}`;
    if (this.reason === "notFound") return `Terminal cwd does not exist: ${this.cwd}`;
    const causeMessage =
      this.cause !== void 0 &&
      this.cause !== null &&
      typeof this.cause === "object" &&
      "message" in this.cause
        ? this.cause.message
        : void 0;
    return typeof causeMessage === "string" && causeMessage.length > 0
      ? `Failed to access terminal cwd: ${this.cwd} (${causeMessage})`
      : `Failed to access terminal cwd: ${this.cwd}`;
  }
};
var TerminalHistoryError = class extends effect_Schema.TaggedErrorClass()("TerminalHistoryError", {
  operation: effect_Schema.Literals(["read", "truncate", "migrate"]),
  threadId: effect_Schema.String,
  terminalId: effect_Schema.String,
  cause: effect_Schema.optional(effect_Schema.Defect),
}) {
  get message() {
    return `Failed to ${this.operation} terminal history for thread: ${this.threadId}, terminal: ${this.terminalId}`;
  }
};
var TerminalSessionLookupError = class extends effect_Schema.TaggedErrorClass()(
  "TerminalSessionLookupError",
  {
    threadId: effect_Schema.String,
    terminalId: effect_Schema.String,
  },
) {
  get message() {
    return `Unknown terminal thread: ${this.threadId}, terminal: ${this.terminalId}`;
  }
};
var TerminalNotRunningError = class extends effect_Schema.TaggedErrorClass()(
  "TerminalNotRunningError",
  {
    threadId: effect_Schema.String,
    terminalId: effect_Schema.String,
  },
) {
  get message() {
    return `Terminal is not running for thread: ${this.threadId}, terminal: ${this.terminalId}`;
  }
};
const TerminalError = effect_Schema.Union([
  TerminalCwdError,
  TerminalHistoryError,
  TerminalSessionLookupError,
  TerminalNotRunningError,
]);

//#endregion
//#region ../../packages/contracts/src/providerInstance.ts
/**
 * Provider-instance contracts.
 *
 * Splits the historical "provider kind" concept into two:
 *
 *   - `ProviderDriverKind` is the implementation kind selector (e.g. codex,
 *     claudeAgent, a fork's `ollama`, …). It picks which driver package
 *     handles the protocol, the probe, the adapter, and text generation.
 *
 *   - `ProviderInstanceId` is the routing key (a user-defined slug).
 *     Threads, sessions, runtime events, and persisted bindings reference
 *     instance ids — never driver kinds — so a user can configure multiple
 *     instances of the same driver (e.g. `codex_personal` + `codex_work`),
 *     each with independent driver-specific configuration.
 *
 * Forward/backward compatibility invariant
 * ----------------------------------------
 * `ProviderDriverKind` is intentionally an **open** branded slug, not a closed
 * literal union. The server hosts forks, ships in PRs that add drivers, and
 * users frequently roll between branches and forks. Any of those paths can
 * leave `ServerSettings`, persisted thread state, or session bindings
 * referencing a driver that the currently-running build does not know about.
 *
 * The rule: parsing any of those payloads must always succeed, and the
 * runtime is responsible for marking the unknown driver/instance as
 * "unavailable" rather than crashing. Built-in drivers shipped by the core
 * product happens to register in a given build is not part of the contract
 * layer. Driver availability is discovered through the runtime registry.
 *
 * Driver-specific configuration is similarly opaque at the contracts layer:
 * drivers live in (or will be extracted to) their own packages and own their
 * config schemas. The contracts package only knows the envelope.
 *
 * @module providerInstance
 */
const PROVIDER_SLUG_MAX_CHARS = 64;
/**
 * Slug pattern shared by driver kinds and instance ids — letters, digits,
 * dashes, underscores. The first character must be a letter so slugs remain
 * JS-identifier friendly when used as object keys, log fields, or telemetry
 * attributes. Mixed case is permitted so historical driver kinds (e.g.
 * `claudeAgent`) can be used verbatim during the migration and so external
 * fork authors retain reasonable freedom.
 */
const PROVIDER_SLUG_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
const ENVIRONMENT_VARIABLE_NAME_MAX_CHARS = 128;
const ENVIRONMENT_VARIABLE_NAME_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const slugSchema = TrimmedNonEmptyString.check(
  effect_Schema.isMaxLength(PROVIDER_SLUG_MAX_CHARS),
  effect_Schema.isPattern(PROVIDER_SLUG_PATTERN),
);
/**
 * `ProviderDriverKind` — open branded slug naming a driver implementation.
 *
 * Constraints (validated at the schema layer):
 *   - starts with a letter
 *   - only letters, digits, `-`, `_` after the first char
 *   - 1..64 characters
 *
 * Notably **not** validated: that the driver is one we know how to load.
 * That check belongs to the runtime registry, which downgrades unknown
 * drivers gracefully (see module docs).
 */
const ProviderDriverKind = slugSchema.pipe(effect_Schema.brand("ProviderDriverKind"));
const isProviderDriverKindValue = effect_Schema.is(ProviderDriverKind);
/**
 * `ProviderInstanceId` — user-defined routing key for a configured provider
 * instance. Same slug rules as `ProviderDriverKind`; branded separately so the
 * type system cannot confuse the two.
 */
const ProviderInstanceId = slugSchema.pipe(effect_Schema.brand("ProviderInstanceId"));
/**
 * Lightweight reference identifying which driver implements an instance.
 * Carried alongside `ProviderInstanceId` on wire shapes so consumers can
 * branch on driver behavior (icons, capabilities, presentation) without
 * having to look up the instance in the registry.
 */
const ProviderInstanceRef = effect_Schema.Struct({
  instanceId: ProviderInstanceId,
  driver: ProviderDriverKind,
});
const ProviderInstanceEnvironmentVariableName = TrimmedNonEmptyString.check(
  effect_Schema.isMaxLength(ENVIRONMENT_VARIABLE_NAME_MAX_CHARS),
  effect_Schema.isPattern(ENVIRONMENT_VARIABLE_NAME_PATTERN),
);
const ProviderInstanceEnvironmentVariable = effect_Schema.Struct({
  name: ProviderInstanceEnvironmentVariableName,
  value: effect_Schema.String.pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed(""))),
  sensitive: effect_Schema.Boolean.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(false)),
  ),
  valueRedacted: effect_Schema.optionalKey(effect_Schema.Boolean),
});
const ProviderInstanceEnvironment = effect_Schema.Array(ProviderInstanceEnvironmentVariable);
/**
 * Envelope shape for a provider instance configuration in `ServerSettings`.
 *
 * `driver` is intentionally accepted as any well-formed slug (see module
 * docs). The driver-specific config payload is left as `Schema.Unknown`;
 * each driver registers its own decoder with the runtime registry, and
 * envelopes for unknown drivers are preserved verbatim so they round-trip
 * across version changes without data loss.
 */
const ProviderInstanceConfig = effect_Schema.Struct({
  driver: ProviderDriverKind,
  displayName: effect_Schema.optional(TrimmedNonEmptyString),
  accentColor: effect_Schema.optional(TrimmedNonEmptyString),
  environment: effect_Schema.optionalKey(ProviderInstanceEnvironment),
  enabled: effect_Schema.optionalKey(effect_Schema.Boolean),
  config: effect_Schema.optionalKey(effect_Schema.Unknown),
});
/**
 * Map shape for `ServerSettings.providerInstances`. Keyed by
 * `ProviderInstanceId`, values are envelopes the registry feeds to drivers.
 */
const ProviderInstanceConfigMap = effect_Schema.Record(ProviderInstanceId, ProviderInstanceConfig);

//#endregion
//#region ../../packages/contracts/src/model.ts
const ProviderOptionDescriptorType = effect_Schema.Literals(["select", "boolean"]);
const ProviderOptionChoice = effect_Schema.Struct({
  id: TrimmedNonEmptyString,
  label: TrimmedNonEmptyString,
  description: effect_Schema.optional(TrimmedNonEmptyString),
  isDefault: effect_Schema.optional(effect_Schema.Boolean),
});
const ProviderOptionDescriptorBase = {
  id: TrimmedNonEmptyString,
  label: TrimmedNonEmptyString,
  description: effect_Schema.optional(TrimmedNonEmptyString),
};
const SelectProviderOptionDescriptor = effect_Schema.Struct({
  ...ProviderOptionDescriptorBase,
  type: effect_Schema.Literal("select"),
  options: effect_Schema.Array(ProviderOptionChoice),
  currentValue: effect_Schema.optional(TrimmedNonEmptyString),
  promptInjectedValues: effect_Schema.optional(effect_Schema.Array(TrimmedNonEmptyString)),
});
const BooleanProviderOptionDescriptor = effect_Schema.Struct({
  ...ProviderOptionDescriptorBase,
  type: effect_Schema.Literal("boolean"),
  currentValue: effect_Schema.optional(effect_Schema.Boolean),
});
const ProviderOptionDescriptor = effect_Schema.Union([
  SelectProviderOptionDescriptor,
  BooleanProviderOptionDescriptor,
]);
const ProviderOptionSelectionValue = effect_Schema.Union([
  TrimmedNonEmptyString,
  effect_Schema.Boolean,
]);
const ProviderOptionSelection = effect_Schema.Struct({
  id: TrimmedNonEmptyString,
  value: ProviderOptionSelectionValue,
});
const ProviderOptionSelectionsFromLegacyObject = effect_Schema
  .Record(effect_Schema.String, effect_Schema.Unknown)
  .pipe(
    effect_Schema.decodeTo(
      effect_Schema.Array(ProviderOptionSelection),
      effect_SchemaTransformation.transformOrFail({
        decode: (record) => effect_Effect.succeed(coerceLegacyOptionsObjectToArray(record)),
        encode: (selections) =>
          effect_Effect.succeed(canonicalSelectionsToLegacyObject(selections)),
      }),
    ),
  );
/**
 * Schema for the `options` field of every `ModelSelection` variant.
 *
 * Accepts both:
 *   - the canonical array shape `Array<{ id, value }>` (preferred), and
 *   - the legacy object shape `Record<string, string | boolean | …>` from
 *     pre-migration data.
 *
 * Always normalizes to the canonical array on decode and re-encodes as the
 * canonical array, so any legacy storage gets cleaned up the next time the
 * containing record is written back.
 */
const ProviderOptionSelections = effect_Schema.Union([
  effect_Schema.Array(ProviderOptionSelection),
  ProviderOptionSelectionsFromLegacyObject,
]);
function coerceLegacyOptionsObjectToArray(record) {
  const entries = [];
  for (const [rawKey, rawValue] of Object.entries(record)) {
    const id = typeof rawKey === "string" ? rawKey.trim() : "";
    if (id.length === 0) continue;
    if (typeof rawValue === "string") {
      const trimmed = rawValue.trim();
      if (trimmed.length > 0)
        entries.push({
          id,
          value: trimmed,
        });
    } else if (typeof rawValue === "boolean")
      entries.push({
        id,
        value: rawValue,
      });
  }
  return entries;
}
function canonicalSelectionsToLegacyObject(selections) {
  const out = {};
  for (const { id, value } of selections) out[id] = value;
  return out;
}
const ModelCapabilities = effect_Schema.Struct({
  optionDescriptors: effect_Schema.optional(effect_Schema.Array(ProviderOptionDescriptor)),
});
const CODEX_DRIVER_KIND = ProviderDriverKind.make("codex");
const CLAUDE_DRIVER_KIND = ProviderDriverKind.make("claudeAgent");
const CURSOR_DRIVER_KIND = ProviderDriverKind.make("cursor");
const OPENCODE_DRIVER_KIND = ProviderDriverKind.make("opencode");
const KIRO_DRIVER_KIND = ProviderDriverKind.make("kiro");
const DEFAULT_MODEL = "gpt-5.4";
const DEFAULT_GIT_TEXT_GENERATION_MODEL = "gpt-5.4-mini";
const DEFAULT_MODEL_BY_PROVIDER = {
  [CODEX_DRIVER_KIND]: DEFAULT_MODEL,
  [CLAUDE_DRIVER_KIND]: "claude-sonnet-4-6",
  [CURSOR_DRIVER_KIND]: "auto",
  [OPENCODE_DRIVER_KIND]: "openai/gpt-5",
  [KIRO_DRIVER_KIND]: "auto",
};
/** Per-provider text generation model defaults. */
const DEFAULT_GIT_TEXT_GENERATION_MODEL_BY_PROVIDER = {
  [CODEX_DRIVER_KIND]: DEFAULT_GIT_TEXT_GENERATION_MODEL,
  [CLAUDE_DRIVER_KIND]: "claude-haiku-4-5",
  [CURSOR_DRIVER_KIND]: "composer-2",
  [OPENCODE_DRIVER_KIND]: "openai/gpt-5",
  [KIRO_DRIVER_KIND]: "auto",
};
const MODEL_SLUG_ALIASES_BY_PROVIDER = {
  [CODEX_DRIVER_KIND]: {
    "gpt-5-codex": "gpt-5.4",
    5.4: "gpt-5.4",
    5.3: "gpt-5.3-codex",
    "gpt-5.3": "gpt-5.3-codex",
    "5.3-spark": "gpt-5.3-codex-spark",
    "gpt-5.3-spark": "gpt-5.3-codex-spark",
  },
  [CLAUDE_DRIVER_KIND]: {
    opus: "claude-opus-4-7",
    "opus-4.7": "claude-opus-4-7",
    "claude-opus-4.7": "claude-opus-4-7",
    "opus-4.6": "claude-opus-4-6",
    "claude-opus-4.6": "claude-opus-4-6",
    "claude-opus-4-6-20251117": "claude-opus-4-6",
    sonnet: "claude-sonnet-4-6",
    "sonnet-4.6": "claude-sonnet-4-6",
    "claude-sonnet-4.6": "claude-sonnet-4-6",
    "claude-sonnet-4-6-20251117": "claude-sonnet-4-6",
    haiku: "claude-haiku-4-5",
    "haiku-4.5": "claude-haiku-4-5",
    "claude-haiku-4.5": "claude-haiku-4-5",
    "claude-haiku-4-5-20251001": "claude-haiku-4-5",
  },
  [CURSOR_DRIVER_KIND]: {
    composer: "composer-2",
    "composer-1.5": "composer-1.5",
    "composer-1": "composer-1.5",
    "opus-4.6-thinking": "claude-opus-4-6",
    "opus-4.6": "claude-opus-4-6",
    "sonnet-4.6-thinking": "claude-sonnet-4-6",
    "sonnet-4.6": "claude-sonnet-4-6",
    "opus-4.5-thinking": "claude-opus-4-5",
    "opus-4.5": "claude-opus-4-5",
  },
  [OPENCODE_DRIVER_KIND]: {},
  [KIRO_DRIVER_KIND]: {},
};
const PROVIDER_DISPLAY_NAMES = {
  [CODEX_DRIVER_KIND]: "Codex",
  [CLAUDE_DRIVER_KIND]: "Claude",
  [CURSOR_DRIVER_KIND]: "Cursor",
  [OPENCODE_DRIVER_KIND]: "OpenCode",
  [KIRO_DRIVER_KIND]: "Kiro",
};

//#endregion
//#region ../../packages/contracts/src/orchestration.ts
const ORCHESTRATION_WS_METHODS = {
  dispatchCommand: "orchestration.dispatchCommand",
  getTurnDiff: "orchestration.getTurnDiff",
  getFullThreadDiff: "orchestration.getFullThreadDiff",
  replayEvents: "orchestration.replayEvents",
  getArchivedShellSnapshot: "orchestration.getArchivedShellSnapshot",
  subscribeShell: "orchestration.subscribeShell",
  subscribeThread: "orchestration.subscribeThread",
};
const ProviderApprovalPolicy = effect_Schema.Literals([
  "untrusted",
  "on-failure",
  "on-request",
  "never",
]);
const ProviderSandboxMode = effect_Schema.Literals([
  "read-only",
  "workspace-write",
  "danger-full-access",
]);
/**
 * `ModelSelection` — selection of a model on a configured provider instance.
 *
 * The routing key is `instanceId` (a user-defined slug identifying one
 * configured provider instance). Drivers, credentials, working-directory
 * bindings, and any other per-instance state are recovered from the
 * runtime registry via the instance id.
 *
 * Wire legacy: persisted selections produced before the driver/instance
 * split carried a `provider: <driver-id>` field instead. The schema absorbs
 * that shape via a pre-decoding transform — `{provider, model}` is promoted
 * to `{instanceId: defaultInstanceIdForDriver(provider), model}`. No
 * post-decode compatibility code lives in the runtime; the transform is the
 * only compat surface.
 */
const ModelSelectionWire = effect_Schema.Struct({
  instanceId: ProviderInstanceId,
  model: TrimmedNonEmptyString,
  options: effect_Schema.optionalKey(ProviderOptionSelections),
});
const ModelSelectionSource = effect_Schema.Struct({
  provider: effect_Schema.optional(effect_Schema.Unknown),
  instanceId: effect_Schema.optional(effect_Schema.Unknown),
  model: effect_Schema.Unknown,
  options: effect_Schema.optional(effect_Schema.Unknown),
});
const ModelSelection = ModelSelectionSource.pipe(
  effect_Schema.decodeTo(
    ModelSelectionWire,
    effect_SchemaTransformation.transformOrFail({
      decode: (raw) => {
        const base = {
          instanceId:
            raw.instanceId !== void 0
              ? raw.instanceId
              : typeof raw.provider === "string"
                ? raw.provider
                : void 0,
          model: raw.model,
        };
        if (raw.options !== void 0) base.options = raw.options;
        return effect_Effect.succeed(base);
      },
      encode: (value) => {
        const base = {
          model: value.model,
          instanceId: value.instanceId,
        };
        if (value.options !== void 0) base.options = value.options;
        return effect_Effect.succeed(base);
      },
    }),
  ),
);
const RuntimeMode = effect_Schema.Literals([
  "approval-required",
  "auto-accept-edits",
  "full-access",
]);
const DEFAULT_RUNTIME_MODE = "full-access";
const ProviderInteractionMode = effect_Schema.Literals(["default", "plan"]);
const DEFAULT_PROVIDER_INTERACTION_MODE = "default";
const ProviderRequestKind = effect_Schema.Literals(["command", "file-read", "file-change"]);
const AssistantDeliveryMode = effect_Schema.Literals(["buffered", "streaming"]);
const ProviderApprovalDecision = effect_Schema.Literals([
  "accept",
  "acceptForSession",
  "decline",
  "cancel",
]);
const ProviderUserInputAnswers = effect_Schema.Record(effect_Schema.String, effect_Schema.Unknown);
const PROVIDER_SEND_TURN_MAX_INPUT_CHARS = 12e4;
const PROVIDER_SEND_TURN_MAX_ATTACHMENTS = 8;
const PROVIDER_SEND_TURN_MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const PROVIDER_SEND_TURN_MAX_IMAGE_DATA_URL_CHARS = 14e6;
const CHAT_ATTACHMENT_ID_MAX_CHARS = 128;
const ChatAttachmentId = TrimmedNonEmptyString.check(
  effect_Schema.isMaxLength(CHAT_ATTACHMENT_ID_MAX_CHARS),
  effect_Schema.isPattern(/^[a-z0-9_-]+$/i),
);
const ChatImageAttachment = effect_Schema.Struct({
  type: effect_Schema.Literal("image"),
  id: ChatAttachmentId,
  name: TrimmedNonEmptyString.check(effect_Schema.isMaxLength(255)),
  mimeType: TrimmedNonEmptyString.check(
    effect_Schema.isMaxLength(100),
    effect_Schema.isPattern(/^image\//i),
  ),
  sizeBytes: NonNegativeInt.check(
    effect_Schema.isLessThanOrEqualTo(PROVIDER_SEND_TURN_MAX_IMAGE_BYTES),
  ),
});
const UploadChatImageAttachment = effect_Schema.Struct({
  type: effect_Schema.Literal("image"),
  name: TrimmedNonEmptyString.check(effect_Schema.isMaxLength(255)),
  mimeType: TrimmedNonEmptyString.check(
    effect_Schema.isMaxLength(100),
    effect_Schema.isPattern(/^image\//i),
  ),
  sizeBytes: NonNegativeInt.check(
    effect_Schema.isLessThanOrEqualTo(PROVIDER_SEND_TURN_MAX_IMAGE_BYTES),
  ),
  dataUrl: TrimmedNonEmptyString.check(
    effect_Schema.isMaxLength(PROVIDER_SEND_TURN_MAX_IMAGE_DATA_URL_CHARS),
  ),
});
const ChatAttachment = effect_Schema.Union([ChatImageAttachment]);
const UploadChatAttachment = effect_Schema.Union([UploadChatImageAttachment]);
const ProjectScriptIcon = effect_Schema.Literals([
  "play",
  "test",
  "lint",
  "configure",
  "build",
  "debug",
]);
const ProjectScript = effect_Schema.Struct({
  id: TrimmedNonEmptyString,
  name: TrimmedNonEmptyString,
  command: TrimmedNonEmptyString,
  icon: ProjectScriptIcon,
  runOnWorktreeCreate: effect_Schema.Boolean,
});
const OrchestrationProject = effect_Schema.Struct({
  id: ProjectId,
  title: TrimmedNonEmptyString,
  workspaceRoot: TrimmedNonEmptyString,
  repositoryIdentity: effect_Schema.optional(effect_Schema.NullOr(RepositoryIdentity)),
  defaultModelSelection: effect_Schema.NullOr(ModelSelection),
  scripts: effect_Schema.Array(ProjectScript),
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime,
  deletedAt: effect_Schema.NullOr(IsoDateTime),
});
const OrchestrationMessageRole = effect_Schema.Literals(["user", "assistant", "system"]);
const OrchestrationMessage = effect_Schema.Struct({
  id: MessageId,
  role: OrchestrationMessageRole,
  text: effect_Schema.String,
  attachments: effect_Schema.optional(effect_Schema.Array(ChatAttachment)),
  turnId: effect_Schema.NullOr(TurnId),
  streaming: effect_Schema.Boolean,
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime,
});
const OrchestrationProposedPlanId = TrimmedNonEmptyString;
const OrchestrationProposedPlan = effect_Schema.Struct({
  id: OrchestrationProposedPlanId,
  turnId: effect_Schema.NullOr(TurnId),
  planMarkdown: TrimmedNonEmptyString,
  implementedAt: effect_Schema
    .NullOr(IsoDateTime)
    .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed(null))),
  implementationThreadId: effect_Schema
    .NullOr(ThreadId)
    .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed(null))),
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime,
});
const SourceProposedPlanReference = effect_Schema.Struct({
  threadId: ThreadId,
  planId: OrchestrationProposedPlanId,
});
const OrchestrationSessionStatus = effect_Schema.Literals([
  "idle",
  "starting",
  "running",
  "ready",
  "interrupted",
  "stopped",
  "error",
]);
const OrchestrationSession = effect_Schema.Struct({
  threadId: ThreadId,
  status: OrchestrationSessionStatus,
  providerName: effect_Schema.NullOr(TrimmedNonEmptyString),
  providerInstanceId: effect_Schema.optional(ProviderInstanceId),
  runtimeMode: RuntimeMode.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_RUNTIME_MODE)),
  ),
  activeTurnId: effect_Schema.NullOr(TurnId),
  lastError: effect_Schema.NullOr(TrimmedNonEmptyString),
  updatedAt: IsoDateTime,
});
const OrchestrationCheckpointFile = effect_Schema.Struct({
  path: TrimmedNonEmptyString,
  kind: TrimmedNonEmptyString,
  additions: NonNegativeInt,
  deletions: NonNegativeInt,
});
const OrchestrationCheckpointStatus = effect_Schema.Literals(["ready", "missing", "error"]);
const OrchestrationCheckpointSummary = effect_Schema.Struct({
  turnId: TurnId,
  checkpointTurnCount: NonNegativeInt,
  checkpointRef: CheckpointRef,
  status: OrchestrationCheckpointStatus,
  files: effect_Schema.Array(OrchestrationCheckpointFile),
  assistantMessageId: effect_Schema.NullOr(MessageId),
  completedAt: IsoDateTime,
});
const OrchestrationThreadActivityTone = effect_Schema.Literals([
  "info",
  "tool",
  "approval",
  "error",
]);
const OrchestrationThreadActivity = effect_Schema.Struct({
  id: EventId,
  tone: OrchestrationThreadActivityTone,
  kind: TrimmedNonEmptyString,
  summary: TrimmedNonEmptyString,
  payload: effect_Schema.Unknown,
  turnId: effect_Schema.NullOr(TurnId),
  sequence: effect_Schema.optional(NonNegativeInt),
  createdAt: IsoDateTime,
});
const OrchestrationLatestTurnState = effect_Schema.Literals([
  "running",
  "interrupted",
  "completed",
  "error",
]);
const OrchestrationLatestTurn = effect_Schema.Struct({
  turnId: TurnId,
  state: OrchestrationLatestTurnState,
  requestedAt: IsoDateTime,
  startedAt: effect_Schema.NullOr(IsoDateTime),
  completedAt: effect_Schema.NullOr(IsoDateTime),
  assistantMessageId: effect_Schema.NullOr(MessageId),
  sourceProposedPlan: effect_Schema.optional(SourceProposedPlanReference),
});
const OrchestrationThread = effect_Schema.Struct({
  id: ThreadId,
  projectId: ProjectId,
  title: TrimmedNonEmptyString,
  modelSelection: ModelSelection,
  runtimeMode: RuntimeMode,
  interactionMode: ProviderInteractionMode.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_PROVIDER_INTERACTION_MODE)),
  ),
  branch: effect_Schema.NullOr(TrimmedNonEmptyString),
  worktreePath: effect_Schema.NullOr(TrimmedNonEmptyString),
  latestTurn: effect_Schema.NullOr(OrchestrationLatestTurn),
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime,
  archivedAt: effect_Schema
    .NullOr(IsoDateTime)
    .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed(null))),
  deletedAt: effect_Schema.NullOr(IsoDateTime),
  messages: effect_Schema.Array(OrchestrationMessage),
  proposedPlans: effect_Schema
    .Array(OrchestrationProposedPlan)
    .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed([]))),
  activities: effect_Schema.Array(OrchestrationThreadActivity),
  checkpoints: effect_Schema.Array(OrchestrationCheckpointSummary),
  session: effect_Schema.NullOr(OrchestrationSession),
});
const OrchestrationReadModel = effect_Schema.Struct({
  snapshotSequence: NonNegativeInt,
  projects: effect_Schema.Array(OrchestrationProject),
  threads: effect_Schema.Array(OrchestrationThread),
  updatedAt: IsoDateTime,
});
const OrchestrationProjectShell = effect_Schema.Struct({
  id: ProjectId,
  title: TrimmedNonEmptyString,
  workspaceRoot: TrimmedNonEmptyString,
  repositoryIdentity: effect_Schema.optional(effect_Schema.NullOr(RepositoryIdentity)),
  defaultModelSelection: effect_Schema.NullOr(ModelSelection),
  scripts: effect_Schema.Array(ProjectScript),
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime,
});
const OrchestrationThreadShell = effect_Schema.Struct({
  id: ThreadId,
  projectId: ProjectId,
  title: TrimmedNonEmptyString,
  modelSelection: ModelSelection,
  runtimeMode: RuntimeMode,
  interactionMode: ProviderInteractionMode.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_PROVIDER_INTERACTION_MODE)),
  ),
  branch: effect_Schema.NullOr(TrimmedNonEmptyString),
  worktreePath: effect_Schema.NullOr(TrimmedNonEmptyString),
  latestTurn: effect_Schema.NullOr(OrchestrationLatestTurn),
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime,
  archivedAt: effect_Schema
    .NullOr(IsoDateTime)
    .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed(null))),
  session: effect_Schema.NullOr(OrchestrationSession),
  latestUserMessageAt: effect_Schema.NullOr(IsoDateTime),
  hasPendingApprovals: effect_Schema.Boolean,
  hasPendingUserInput: effect_Schema.Boolean,
  hasActionableProposedPlan: effect_Schema.Boolean,
});
const OrchestrationShellSnapshot = effect_Schema.Struct({
  snapshotSequence: NonNegativeInt,
  projects: effect_Schema.Array(OrchestrationProjectShell),
  threads: effect_Schema.Array(OrchestrationThreadShell),
  updatedAt: IsoDateTime,
});
const OrchestrationShellStreamEvent = effect_Schema.Union([
  effect_Schema.Struct({
    kind: effect_Schema.Literal("project-upserted"),
    sequence: NonNegativeInt,
    project: OrchestrationProjectShell,
  }),
  effect_Schema.Struct({
    kind: effect_Schema.Literal("project-removed"),
    sequence: NonNegativeInt,
    projectId: ProjectId,
  }),
  effect_Schema.Struct({
    kind: effect_Schema.Literal("thread-upserted"),
    sequence: NonNegativeInt,
    thread: OrchestrationThreadShell,
  }),
  effect_Schema.Struct({
    kind: effect_Schema.Literal("thread-removed"),
    sequence: NonNegativeInt,
    threadId: ThreadId,
  }),
]);
const OrchestrationShellStreamItem = effect_Schema.Union([
  effect_Schema.Struct({
    kind: effect_Schema.Literal("snapshot"),
    snapshot: OrchestrationShellSnapshot,
  }),
  OrchestrationShellStreamEvent,
]);
const OrchestrationSubscribeThreadInput = effect_Schema.Struct({ threadId: ThreadId });
const OrchestrationThreadDetailSnapshot = effect_Schema.Struct({
  snapshotSequence: NonNegativeInt,
  thread: OrchestrationThread,
});
const ProjectCreateCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("project.create"),
  commandId: CommandId,
  projectId: ProjectId,
  title: TrimmedNonEmptyString,
  workspaceRoot: TrimmedNonEmptyString,
  createWorkspaceRootIfMissing: effect_Schema.optional(effect_Schema.Boolean),
  defaultModelSelection: effect_Schema.optional(effect_Schema.NullOr(ModelSelection)),
  createdAt: IsoDateTime,
});
const ProjectMetaUpdateCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("project.meta.update"),
  commandId: CommandId,
  projectId: ProjectId,
  title: effect_Schema.optional(TrimmedNonEmptyString),
  workspaceRoot: effect_Schema.optional(TrimmedNonEmptyString),
  defaultModelSelection: effect_Schema.optional(effect_Schema.NullOr(ModelSelection)),
  scripts: effect_Schema.optional(effect_Schema.Array(ProjectScript)),
});
const ProjectDeleteCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("project.delete"),
  commandId: CommandId,
  projectId: ProjectId,
  force: effect_Schema.optional(effect_Schema.Boolean),
});
const ThreadCreateCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.create"),
  commandId: CommandId,
  threadId: ThreadId,
  projectId: ProjectId,
  title: TrimmedNonEmptyString,
  modelSelection: ModelSelection,
  runtimeMode: RuntimeMode,
  interactionMode: ProviderInteractionMode.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_PROVIDER_INTERACTION_MODE)),
  ),
  branch: effect_Schema.NullOr(TrimmedNonEmptyString),
  worktreePath: effect_Schema.NullOr(TrimmedNonEmptyString),
  createdAt: IsoDateTime,
});
const ThreadBranchCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.branch"),
  commandId: CommandId,
  sourceThreadId: ThreadId,
  sourceMessageId: effect_Schema.optional(MessageId),
  threadId: ThreadId,
  title: effect_Schema.optional(TrimmedNonEmptyString),
  createdAt: IsoDateTime,
});
const ThreadDeleteCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.delete"),
  commandId: CommandId,
  threadId: ThreadId,
});
const ThreadArchiveCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.archive"),
  commandId: CommandId,
  threadId: ThreadId,
});
const ThreadUnarchiveCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.unarchive"),
  commandId: CommandId,
  threadId: ThreadId,
});
const ThreadMetaUpdateCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.meta.update"),
  commandId: CommandId,
  threadId: ThreadId,
  title: effect_Schema.optional(TrimmedNonEmptyString),
  modelSelection: effect_Schema.optional(ModelSelection),
  branch: effect_Schema.optional(effect_Schema.NullOr(TrimmedNonEmptyString)),
  worktreePath: effect_Schema.optional(effect_Schema.NullOr(TrimmedNonEmptyString)),
});
const ThreadRuntimeModeSetCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.runtime-mode.set"),
  commandId: CommandId,
  threadId: ThreadId,
  runtimeMode: RuntimeMode,
  createdAt: IsoDateTime,
});
const ThreadInteractionModeSetCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.interaction-mode.set"),
  commandId: CommandId,
  threadId: ThreadId,
  interactionMode: ProviderInteractionMode,
  createdAt: IsoDateTime,
});
const ThreadTurnStartBootstrapCreateThread = effect_Schema.Struct({
  projectId: ProjectId,
  title: TrimmedNonEmptyString,
  modelSelection: ModelSelection,
  runtimeMode: RuntimeMode,
  interactionMode: ProviderInteractionMode,
  branch: effect_Schema.NullOr(TrimmedNonEmptyString),
  worktreePath: effect_Schema.NullOr(TrimmedNonEmptyString),
  createdAt: IsoDateTime,
});
const ThreadTurnStartBootstrapPrepareWorktree = effect_Schema.Struct({
  projectCwd: TrimmedNonEmptyString,
  baseBranch: TrimmedNonEmptyString,
  branch: effect_Schema.optional(TrimmedNonEmptyString),
});
const ThreadTurnStartBootstrap = effect_Schema.Struct({
  createThread: effect_Schema.optional(ThreadTurnStartBootstrapCreateThread),
  prepareWorktree: effect_Schema.optional(ThreadTurnStartBootstrapPrepareWorktree),
  runSetupScript: effect_Schema.optional(effect_Schema.Boolean),
});
const ThreadTurnStartCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.turn.start"),
  commandId: CommandId,
  threadId: ThreadId,
  message: effect_Schema.Struct({
    messageId: MessageId,
    role: effect_Schema.Literal("user"),
    text: effect_Schema.String,
    attachments: effect_Schema.Array(ChatAttachment),
  }),
  modelSelection: effect_Schema.optional(ModelSelection),
  titleSeed: effect_Schema.optional(TrimmedNonEmptyString),
  runtimeMode: RuntimeMode.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_RUNTIME_MODE)),
  ),
  interactionMode: ProviderInteractionMode.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_PROVIDER_INTERACTION_MODE)),
  ),
  bootstrap: effect_Schema.optional(ThreadTurnStartBootstrap),
  sourceProposedPlan: effect_Schema.optional(SourceProposedPlanReference),
  createdAt: IsoDateTime,
});
const ClientThreadTurnStartCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.turn.start"),
  commandId: CommandId,
  threadId: ThreadId,
  message: effect_Schema.Struct({
    messageId: MessageId,
    role: effect_Schema.Literal("user"),
    text: effect_Schema.String,
    attachments: effect_Schema.Array(UploadChatAttachment),
  }),
  modelSelection: effect_Schema.optional(ModelSelection),
  titleSeed: effect_Schema.optional(TrimmedNonEmptyString),
  runtimeMode: RuntimeMode,
  interactionMode: ProviderInteractionMode,
  bootstrap: effect_Schema.optional(ThreadTurnStartBootstrap),
  sourceProposedPlan: effect_Schema.optional(SourceProposedPlanReference),
  createdAt: IsoDateTime,
});
const ThreadTurnInterruptCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.turn.interrupt"),
  commandId: CommandId,
  threadId: ThreadId,
  turnId: effect_Schema.optional(TurnId),
  createdAt: IsoDateTime,
});
const ThreadContextCompactCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.context.compact"),
  commandId: CommandId,
  threadId: ThreadId,
  createdAt: IsoDateTime,
});
const ThreadApprovalRespondCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.approval.respond"),
  commandId: CommandId,
  threadId: ThreadId,
  requestId: ApprovalRequestId,
  decision: ProviderApprovalDecision,
  createdAt: IsoDateTime,
});
const ThreadUserInputRespondCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.user-input.respond"),
  commandId: CommandId,
  threadId: ThreadId,
  requestId: ApprovalRequestId,
  answers: ProviderUserInputAnswers,
  createdAt: IsoDateTime,
});
const ThreadCheckpointRevertCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.checkpoint.revert"),
  commandId: CommandId,
  threadId: ThreadId,
  turnCount: NonNegativeInt,
  createdAt: IsoDateTime,
});
const ThreadSessionStopCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.session.stop"),
  commandId: CommandId,
  threadId: ThreadId,
  createdAt: IsoDateTime,
});
const DispatchableClientOrchestrationCommand = effect_Schema.Union([
  ProjectCreateCommand,
  ProjectMetaUpdateCommand,
  ProjectDeleteCommand,
  ThreadCreateCommand,
  ThreadBranchCommand,
  ThreadDeleteCommand,
  ThreadArchiveCommand,
  ThreadUnarchiveCommand,
  ThreadMetaUpdateCommand,
  ThreadRuntimeModeSetCommand,
  ThreadInteractionModeSetCommand,
  ThreadTurnStartCommand,
  ThreadTurnInterruptCommand,
  ThreadContextCompactCommand,
  ThreadApprovalRespondCommand,
  ThreadUserInputRespondCommand,
  ThreadCheckpointRevertCommand,
  ThreadSessionStopCommand,
]);
const ClientOrchestrationCommand = effect_Schema.Union([
  ProjectCreateCommand,
  ProjectMetaUpdateCommand,
  ProjectDeleteCommand,
  ThreadCreateCommand,
  ThreadBranchCommand,
  ThreadDeleteCommand,
  ThreadArchiveCommand,
  ThreadUnarchiveCommand,
  ThreadMetaUpdateCommand,
  ThreadRuntimeModeSetCommand,
  ThreadInteractionModeSetCommand,
  ClientThreadTurnStartCommand,
  ThreadTurnInterruptCommand,
  ThreadContextCompactCommand,
  ThreadApprovalRespondCommand,
  ThreadUserInputRespondCommand,
  ThreadCheckpointRevertCommand,
  ThreadSessionStopCommand,
]);
const ThreadSessionSetCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.session.set"),
  commandId: CommandId,
  threadId: ThreadId,
  session: OrchestrationSession,
  createdAt: IsoDateTime,
});
const ThreadMessageAssistantDeltaCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.message.assistant.delta"),
  commandId: CommandId,
  threadId: ThreadId,
  messageId: MessageId,
  delta: effect_Schema.String,
  turnId: effect_Schema.optional(TurnId),
  createdAt: IsoDateTime,
});
const ThreadMessageAssistantCompleteCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.message.assistant.complete"),
  commandId: CommandId,
  threadId: ThreadId,
  messageId: MessageId,
  turnId: effect_Schema.optional(TurnId),
  createdAt: IsoDateTime,
});
const ThreadProposedPlanUpsertCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.proposed-plan.upsert"),
  commandId: CommandId,
  threadId: ThreadId,
  proposedPlan: OrchestrationProposedPlan,
  createdAt: IsoDateTime,
});
const ThreadTurnDiffCompleteCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.turn.diff.complete"),
  commandId: CommandId,
  threadId: ThreadId,
  turnId: TurnId,
  completedAt: IsoDateTime,
  checkpointRef: CheckpointRef,
  status: OrchestrationCheckpointStatus,
  files: effect_Schema.Array(OrchestrationCheckpointFile),
  assistantMessageId: effect_Schema.optional(MessageId),
  checkpointTurnCount: NonNegativeInt,
  createdAt: IsoDateTime,
});
const ThreadActivityAppendCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.activity.append"),
  commandId: CommandId,
  threadId: ThreadId,
  activity: OrchestrationThreadActivity,
  createdAt: IsoDateTime,
});
const ThreadRevertCompleteCommand = effect_Schema.Struct({
  type: effect_Schema.Literal("thread.revert.complete"),
  commandId: CommandId,
  threadId: ThreadId,
  turnCount: NonNegativeInt,
  createdAt: IsoDateTime,
});
const InternalOrchestrationCommand = effect_Schema.Union([
  ThreadSessionSetCommand,
  ThreadMessageAssistantDeltaCommand,
  ThreadMessageAssistantCompleteCommand,
  ThreadProposedPlanUpsertCommand,
  ThreadTurnDiffCompleteCommand,
  ThreadActivityAppendCommand,
  ThreadRevertCompleteCommand,
]);
const OrchestrationCommand = effect_Schema.Union([
  DispatchableClientOrchestrationCommand,
  InternalOrchestrationCommand,
]);
const OrchestrationEventType = effect_Schema.Literals([
  "project.created",
  "project.meta-updated",
  "project.deleted",
  "thread.created",
  "thread.deleted",
  "thread.archived",
  "thread.unarchived",
  "thread.meta-updated",
  "thread.runtime-mode-set",
  "thread.interaction-mode-set",
  "thread.message-sent",
  "thread.turn-start-requested",
  "thread.turn-interrupt-requested",
  "thread.context-compact-requested",
  "thread.approval-response-requested",
  "thread.user-input-response-requested",
  "thread.checkpoint-revert-requested",
  "thread.reverted",
  "thread.session-stop-requested",
  "thread.session-set",
  "thread.proposed-plan-upserted",
  "thread.turn-diff-completed",
  "thread.activity-appended",
]);
const OrchestrationAggregateKind = effect_Schema.Literals(["project", "thread"]);
const OrchestrationActorKind = effect_Schema.Literals(["client", "server", "provider"]);
const ProjectCreatedPayload = effect_Schema.Struct({
  projectId: ProjectId,
  title: TrimmedNonEmptyString,
  workspaceRoot: TrimmedNonEmptyString,
  repositoryIdentity: effect_Schema.optional(effect_Schema.NullOr(RepositoryIdentity)),
  defaultModelSelection: effect_Schema.NullOr(ModelSelection),
  scripts: effect_Schema.Array(ProjectScript),
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime,
});
const ProjectMetaUpdatedPayload = effect_Schema.Struct({
  projectId: ProjectId,
  title: effect_Schema.optional(TrimmedNonEmptyString),
  workspaceRoot: effect_Schema.optional(TrimmedNonEmptyString),
  repositoryIdentity: effect_Schema.optional(effect_Schema.NullOr(RepositoryIdentity)),
  defaultModelSelection: effect_Schema.optional(effect_Schema.NullOr(ModelSelection)),
  scripts: effect_Schema.optional(effect_Schema.Array(ProjectScript)),
  updatedAt: IsoDateTime,
});
const ProjectDeletedPayload = effect_Schema.Struct({
  projectId: ProjectId,
  deletedAt: IsoDateTime,
});
const ThreadCreatedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  projectId: ProjectId,
  title: TrimmedNonEmptyString,
  modelSelection: ModelSelection,
  runtimeMode: RuntimeMode.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_RUNTIME_MODE)),
  ),
  interactionMode: ProviderInteractionMode.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_PROVIDER_INTERACTION_MODE)),
  ),
  branch: effect_Schema.NullOr(TrimmedNonEmptyString),
  worktreePath: effect_Schema.NullOr(TrimmedNonEmptyString),
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime,
});
const ThreadDeletedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  deletedAt: IsoDateTime,
});
const ThreadArchivedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  archivedAt: IsoDateTime,
  updatedAt: IsoDateTime,
});
const ThreadUnarchivedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  updatedAt: IsoDateTime,
});
const ThreadMetaUpdatedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  title: effect_Schema.optional(TrimmedNonEmptyString),
  modelSelection: effect_Schema.optional(ModelSelection),
  branch: effect_Schema.optional(effect_Schema.NullOr(TrimmedNonEmptyString)),
  worktreePath: effect_Schema.optional(effect_Schema.NullOr(TrimmedNonEmptyString)),
  updatedAt: IsoDateTime,
});
const ThreadRuntimeModeSetPayload = effect_Schema.Struct({
  threadId: ThreadId,
  runtimeMode: RuntimeMode,
  updatedAt: IsoDateTime,
});
const ThreadInteractionModeSetPayload = effect_Schema.Struct({
  threadId: ThreadId,
  interactionMode: ProviderInteractionMode.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_PROVIDER_INTERACTION_MODE)),
  ),
  updatedAt: IsoDateTime,
});
const ThreadMessageSentPayload = effect_Schema.Struct({
  threadId: ThreadId,
  messageId: MessageId,
  role: OrchestrationMessageRole,
  text: effect_Schema.String,
  attachments: effect_Schema.optional(effect_Schema.Array(ChatAttachment)),
  turnId: effect_Schema.NullOr(TurnId),
  streaming: effect_Schema.Boolean,
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime,
});
const ThreadTurnStartRequestedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  messageId: MessageId,
  modelSelection: effect_Schema.optional(ModelSelection),
  titleSeed: effect_Schema.optional(TrimmedNonEmptyString),
  runtimeMode: RuntimeMode.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_RUNTIME_MODE)),
  ),
  interactionMode: ProviderInteractionMode.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_PROVIDER_INTERACTION_MODE)),
  ),
  sourceProposedPlan: effect_Schema.optional(SourceProposedPlanReference),
  createdAt: IsoDateTime,
});
const ThreadTurnInterruptRequestedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  turnId: effect_Schema.optional(TurnId),
  createdAt: IsoDateTime,
});
const ThreadContextCompactRequestedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  createdAt: IsoDateTime,
});
const ThreadApprovalResponseRequestedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  requestId: ApprovalRequestId,
  decision: ProviderApprovalDecision,
  createdAt: IsoDateTime,
});
const ThreadUserInputResponseRequestedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  requestId: ApprovalRequestId,
  answers: ProviderUserInputAnswers,
  createdAt: IsoDateTime,
});
const ThreadCheckpointRevertRequestedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  turnCount: NonNegativeInt,
  createdAt: IsoDateTime,
});
const ThreadRevertedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  turnCount: NonNegativeInt,
});
const ThreadSessionStopRequestedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  createdAt: IsoDateTime,
});
const ThreadSessionSetPayload = effect_Schema.Struct({
  threadId: ThreadId,
  session: OrchestrationSession,
});
const ThreadProposedPlanUpsertedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  proposedPlan: OrchestrationProposedPlan,
});
const ThreadTurnDiffCompletedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  turnId: TurnId,
  checkpointTurnCount: NonNegativeInt,
  checkpointRef: CheckpointRef,
  status: OrchestrationCheckpointStatus,
  files: effect_Schema.Array(OrchestrationCheckpointFile),
  assistantMessageId: effect_Schema.NullOr(MessageId),
  completedAt: IsoDateTime,
});
const ThreadActivityAppendedPayload = effect_Schema.Struct({
  threadId: ThreadId,
  activity: OrchestrationThreadActivity,
});
const OrchestrationEventMetadata = effect_Schema.Struct({
  providerTurnId: effect_Schema.optional(TrimmedNonEmptyString),
  providerItemId: effect_Schema.optional(ProviderItemId),
  adapterKey: effect_Schema.optional(TrimmedNonEmptyString),
  requestId: effect_Schema.optional(ApprovalRequestId),
  ingestedAt: effect_Schema.optional(IsoDateTime),
});
const EventBaseFields = {
  sequence: NonNegativeInt,
  eventId: EventId,
  aggregateKind: OrchestrationAggregateKind,
  aggregateId: effect_Schema.Union([ProjectId, ThreadId]),
  occurredAt: IsoDateTime,
  commandId: effect_Schema.NullOr(CommandId),
  causationEventId: effect_Schema.NullOr(EventId),
  correlationId: effect_Schema.NullOr(CommandId),
  metadata: OrchestrationEventMetadata,
};
const OrchestrationEvent = effect_Schema.Union([
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("project.created"),
    payload: ProjectCreatedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("project.meta-updated"),
    payload: ProjectMetaUpdatedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("project.deleted"),
    payload: ProjectDeletedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.created"),
    payload: ThreadCreatedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.deleted"),
    payload: ThreadDeletedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.archived"),
    payload: ThreadArchivedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.unarchived"),
    payload: ThreadUnarchivedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.meta-updated"),
    payload: ThreadMetaUpdatedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.runtime-mode-set"),
    payload: ThreadRuntimeModeSetPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.interaction-mode-set"),
    payload: ThreadInteractionModeSetPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.message-sent"),
    payload: ThreadMessageSentPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.turn-start-requested"),
    payload: ThreadTurnStartRequestedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.turn-interrupt-requested"),
    payload: ThreadTurnInterruptRequestedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.context-compact-requested"),
    payload: ThreadContextCompactRequestedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.approval-response-requested"),
    payload: ThreadApprovalResponseRequestedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.user-input-response-requested"),
    payload: ThreadUserInputResponseRequestedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.checkpoint-revert-requested"),
    payload: ThreadCheckpointRevertRequestedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.reverted"),
    payload: ThreadRevertedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.session-stop-requested"),
    payload: ThreadSessionStopRequestedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.session-set"),
    payload: ThreadSessionSetPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.proposed-plan-upserted"),
    payload: ThreadProposedPlanUpsertedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.turn-diff-completed"),
    payload: ThreadTurnDiffCompletedPayload,
  }),
  effect_Schema.Struct({
    ...EventBaseFields,
    type: effect_Schema.Literal("thread.activity-appended"),
    payload: ThreadActivityAppendedPayload,
  }),
]);
const OrchestrationThreadStreamItem = effect_Schema.Union([
  effect_Schema.Struct({
    kind: effect_Schema.Literal("snapshot"),
    snapshot: OrchestrationThreadDetailSnapshot,
  }),
  effect_Schema.Struct({
    kind: effect_Schema.Literal("event"),
    event: OrchestrationEvent,
  }),
]);
const OrchestrationCommandReceiptStatus = effect_Schema.Literals(["accepted", "rejected"]);
const TurnCountRange = effect_Schema
  .Struct({
    fromTurnCount: NonNegativeInt,
    toTurnCount: NonNegativeInt,
  })
  .check(
    effect_Schema.makeFilter(
      (input) =>
        input.fromTurnCount <= input.toTurnCount ||
        new effect_SchemaIssue.InvalidValue(effect_Option.some(input.fromTurnCount), {
          message: "fromTurnCount must be less than or equal to toTurnCount",
        }),
      { identifier: "OrchestrationTurnDiffRange" },
    ),
  );
const ThreadTurnDiff = TurnCountRange.mapFields(
  effect_Struct.assign({
    threadId: ThreadId,
    diff: effect_Schema.String,
  }),
  { unsafePreserveChecks: true },
);
const ProviderSessionRuntimeStatus = effect_Schema.Literals([
  "starting",
  "running",
  "stopped",
  "error",
]);
effect_Schema.Literals(["running", "completed", "interrupted", "error"]);
effect_Schema.Struct({
  threadId: ThreadId,
  turnId: TurnId,
  checkpointTurnCount: NonNegativeInt,
  checkpointRef: CheckpointRef,
  status: OrchestrationCheckpointStatus,
  files: effect_Schema.Array(OrchestrationCheckpointFile),
  assistantMessageId: effect_Schema.NullOr(MessageId),
  completedAt: IsoDateTime,
});
const ProjectionPendingApprovalStatus = effect_Schema.Literals(["pending", "resolved"]);
const ProjectionPendingApprovalDecision = effect_Schema.NullOr(ProviderApprovalDecision);
const DispatchResult = effect_Schema.Struct({ sequence: NonNegativeInt });
const OrchestrationGetTurnDiffInput = TurnCountRange.mapFields(
  effect_Struct.assign({
    threadId: ThreadId,
    ignoreWhitespace: effect_Schema.optionalKey(effect_Schema.Boolean),
  }),
  { unsafePreserveChecks: true },
);
const OrchestrationGetTurnDiffResult = ThreadTurnDiff;
const OrchestrationGetFullThreadDiffInput = effect_Schema.Struct({
  threadId: ThreadId,
  toTurnCount: NonNegativeInt,
  ignoreWhitespace: effect_Schema.optionalKey(effect_Schema.Boolean),
});
const OrchestrationGetFullThreadDiffResult = ThreadTurnDiff;
const OrchestrationReplayEventsInput = effect_Schema.Struct({
  fromSequenceExclusive: NonNegativeInt,
});
const OrchestrationReplayEventsResult = effect_Schema.Array(OrchestrationEvent);
const OrchestrationRpcSchemas = {
  dispatchCommand: {
    input: ClientOrchestrationCommand,
    output: DispatchResult,
  },
  getTurnDiff: {
    input: OrchestrationGetTurnDiffInput,
    output: OrchestrationGetTurnDiffResult,
  },
  getFullThreadDiff: {
    input: OrchestrationGetFullThreadDiffInput,
    output: OrchestrationGetFullThreadDiffResult,
  },
  replayEvents: {
    input: OrchestrationReplayEventsInput,
    output: OrchestrationReplayEventsResult,
  },
  getArchivedShellSnapshot: {
    input: effect_Schema.Struct({}),
    output: OrchestrationShellSnapshot,
  },
  subscribeThread: {
    input: OrchestrationSubscribeThreadInput,
    output: OrchestrationThreadStreamItem,
  },
  subscribeShell: {
    input: effect_Schema.Struct({}),
    output: OrchestrationShellStreamItem,
  },
};
var OrchestrationGetSnapshotError = class extends effect_Schema.TaggedErrorClass()(
  "OrchestrationGetSnapshotError",
  {
    message: TrimmedNonEmptyString,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {};
var OrchestrationDispatchCommandError = class extends effect_Schema.TaggedErrorClass()(
  "OrchestrationDispatchCommandError",
  {
    message: TrimmedNonEmptyString,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {};
var OrchestrationGetTurnDiffError = class extends effect_Schema.TaggedErrorClass()(
  "OrchestrationGetTurnDiffError",
  {
    message: TrimmedNonEmptyString,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {};
var OrchestrationGetFullThreadDiffError = class extends effect_Schema.TaggedErrorClass()(
  "OrchestrationGetFullThreadDiffError",
  {
    message: TrimmedNonEmptyString,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {};
var OrchestrationReplayEventsError = class extends effect_Schema.TaggedErrorClass()(
  "OrchestrationReplayEventsError",
  {
    message: TrimmedNonEmptyString,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {};

//#endregion
//#region ../../packages/contracts/src/provider.ts
const ProviderSessionStatus = effect_Schema.Literals([
  "connecting",
  "ready",
  "running",
  "error",
  "closed",
]);
const ProviderSession = effect_Schema.Struct({
  provider: ProviderDriverKind,
  providerInstanceId: effect_Schema.optional(ProviderInstanceId),
  status: ProviderSessionStatus,
  runtimeMode: RuntimeMode,
  cwd: effect_Schema.optional(TrimmedNonEmptyString),
  model: effect_Schema.optional(TrimmedNonEmptyString),
  threadId: ThreadId,
  resumeCursor: effect_Schema.optional(effect_Schema.Unknown),
  activeTurnId: effect_Schema.optional(TurnId),
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime,
  lastError: effect_Schema.optional(TrimmedNonEmptyString),
});
const ProviderSessionStartInput = effect_Schema.Struct({
  threadId: ThreadId,
  provider: effect_Schema.optional(ProviderDriverKind),
  providerInstanceId: effect_Schema.optional(ProviderInstanceId),
  cwd: effect_Schema.optional(TrimmedNonEmptyString),
  modelSelection: effect_Schema.optional(ModelSelection),
  resumeCursor: effect_Schema.optional(effect_Schema.Unknown),
  approvalPolicy: effect_Schema.optional(ProviderApprovalPolicy),
  sandboxMode: effect_Schema.optional(ProviderSandboxMode),
  runtimeMode: RuntimeMode,
});
const ProviderSendTurnInput = effect_Schema.Struct({
  threadId: ThreadId,
  input: effect_Schema.optional(
    TrimmedNonEmptyString.check(effect_Schema.isMaxLength(PROVIDER_SEND_TURN_MAX_INPUT_CHARS)),
  ),
  transcriptContext: effect_Schema.optional(
    effect_Schema.Array(
      effect_Schema.Struct({
        role: effect_Schema.Literals(["user", "assistant", "system"]),
        text: effect_Schema.String,
      }),
    ),
  ),
  attachments: effect_Schema.optional(
    effect_Schema
      .Array(ChatAttachment)
      .check(effect_Schema.isMaxLength(PROVIDER_SEND_TURN_MAX_ATTACHMENTS)),
  ),
  modelSelection: effect_Schema.optional(ModelSelection),
  interactionMode: effect_Schema.optional(ProviderInteractionMode),
});
const ProviderTurnStartResult = effect_Schema.Struct({
  threadId: ThreadId,
  turnId: TurnId,
  resumeCursor: effect_Schema.optional(effect_Schema.Unknown),
});
const ProviderInterruptTurnInput = effect_Schema.Struct({
  threadId: ThreadId,
  turnId: effect_Schema.optional(TurnId),
});
const ProviderCompactConversationInput = effect_Schema.Struct({ threadId: ThreadId });
const ProviderStopSessionInput = effect_Schema.Struct({ threadId: ThreadId });
const ProviderRespondToRequestInput = effect_Schema.Struct({
  threadId: ThreadId,
  requestId: ApprovalRequestId,
  decision: ProviderApprovalDecision,
});
const ProviderRespondToUserInputInput = effect_Schema.Struct({
  threadId: ThreadId,
  requestId: ApprovalRequestId,
  answers: ProviderUserInputAnswers,
});
const ProviderEventKind = effect_Schema.Literals(["session", "notification", "request", "error"]);
const ProviderEvent = effect_Schema.Struct({
  id: EventId,
  kind: ProviderEventKind,
  provider: ProviderDriverKind,
  providerInstanceId: effect_Schema.optional(ProviderInstanceId),
  threadId: ThreadId,
  createdAt: IsoDateTime,
  method: TrimmedNonEmptyString,
  message: effect_Schema.optional(TrimmedNonEmptyString),
  turnId: effect_Schema.optional(TurnId),
  itemId: effect_Schema.optional(ProviderItemId),
  requestId: effect_Schema.optional(ApprovalRequestId),
  requestKind: effect_Schema.optional(ProviderRequestKind),
  textDelta: effect_Schema.optional(effect_Schema.String),
  payload: effect_Schema.optional(effect_Schema.Unknown),
});

//#endregion
//#region ../../packages/contracts/src/providerRuntime.ts
const TrimmedNonEmptyStringSchema$1 = TrimmedNonEmptyString;
const UnknownRecordSchema = effect_Schema.Record(effect_Schema.String, effect_Schema.Unknown);
const RuntimeEventRawSource = effect_Schema.Union([
  effect_Schema.Literal("codex.app-server.notification"),
  effect_Schema.Literal("codex.app-server.request"),
  effect_Schema.Literal("codex.eventmsg"),
  effect_Schema.Literal("claude.sdk.message"),
  effect_Schema.Literal("claude.sdk.permission"),
  effect_Schema.Literal("codex.sdk.thread-event"),
  effect_Schema.Literal("opencode.sdk.event"),
  effect_Schema.Literal("acp.jsonrpc"),
  effect_Schema.TemplateLiteral(["acp.", effect_Schema.String, ".extension"]),
]);
const RuntimeEventRaw = effect_Schema.Struct({
  source: RuntimeEventRawSource,
  method: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  messageType: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  payload: effect_Schema.Unknown,
});
const ProviderRequestId = TrimmedNonEmptyStringSchema$1;
const ProviderRefs = effect_Schema.Struct({
  providerTurnId: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  providerItemId: effect_Schema.optional(ProviderItemId),
  providerRequestId: effect_Schema.optional(ProviderRequestId),
});
const RuntimeSessionState = effect_Schema.Literals([
  "starting",
  "ready",
  "running",
  "waiting",
  "stopped",
  "error",
]);
const RuntimeThreadState = effect_Schema.Literals([
  "active",
  "idle",
  "archived",
  "closed",
  "compacted",
  "error",
]);
const RuntimeTurnState = effect_Schema.Literals([
  "completed",
  "failed",
  "interrupted",
  "cancelled",
]);
const RuntimePlanStepStatus = effect_Schema.Literals(["pending", "inProgress", "completed"]);
const RuntimeItemStatus = effect_Schema.Literals(["inProgress", "completed", "failed", "declined"]);
const RuntimeContentStreamKind = effect_Schema.Literals([
  "assistant_text",
  "reasoning_text",
  "reasoning_summary_text",
  "plan_text",
  "command_output",
  "file_change_output",
  "unknown",
]);
const RuntimeSessionExitKind = effect_Schema.Literals(["graceful", "error"]);
const RuntimeErrorClass = effect_Schema.Literals([
  "provider_error",
  "transport_error",
  "permission_error",
  "validation_error",
  "unknown",
]);
const TOOL_LIFECYCLE_ITEM_TYPES = [
  "command_execution",
  "file_change",
  "mcp_tool_call",
  "dynamic_tool_call",
  "collab_agent_tool_call",
  "web_search",
  "image_view",
];
const ToolLifecycleItemType = effect_Schema.Literals(TOOL_LIFECYCLE_ITEM_TYPES);
const CanonicalItemType = effect_Schema.Literals([
  "user_message",
  "assistant_message",
  "reasoning",
  "plan",
  ...TOOL_LIFECYCLE_ITEM_TYPES,
  "review_entered",
  "review_exited",
  "context_compaction",
  "error",
  "unknown",
]);
const CanonicalRequestType = effect_Schema.Literals([
  "command_execution_approval",
  "file_read_approval",
  "file_change_approval",
  "apply_patch_approval",
  "exec_command_approval",
  "tool_user_input",
  "dynamic_tool_call",
  "auth_tokens_refresh",
  "unknown",
]);
effect_Schema.Literals([
  "session.started",
  "session.configured",
  "session.state.changed",
  "session.exited",
  "thread.started",
  "thread.state.changed",
  "thread.metadata.updated",
  "thread.token-usage.updated",
  "thread.realtime.started",
  "thread.realtime.item-added",
  "thread.realtime.audio.delta",
  "thread.realtime.error",
  "thread.realtime.closed",
  "turn.started",
  "turn.completed",
  "turn.aborted",
  "turn.plan.updated",
  "turn.proposed.delta",
  "turn.proposed.completed",
  "turn.diff.updated",
  "item.started",
  "item.updated",
  "item.completed",
  "content.delta",
  "request.opened",
  "request.resolved",
  "user-input.requested",
  "user-input.resolved",
  "task.started",
  "task.progress",
  "task.completed",
  "hook.started",
  "hook.progress",
  "hook.completed",
  "tool.progress",
  "tool.summary",
  "auth.status",
  "account.updated",
  "account.rate-limits.updated",
  "mcp.status.updated",
  "mcp.oauth.completed",
  "model.rerouted",
  "config.warning",
  "deprecation.notice",
  "files.persisted",
  "runtime.warning",
  "runtime.error",
]);
const SessionStartedType = effect_Schema.Literal("session.started");
const SessionConfiguredType = effect_Schema.Literal("session.configured");
const SessionStateChangedType = effect_Schema.Literal("session.state.changed");
const SessionExitedType = effect_Schema.Literal("session.exited");
const ThreadStartedType = effect_Schema.Literal("thread.started");
const ThreadStateChangedType = effect_Schema.Literal("thread.state.changed");
const ThreadMetadataUpdatedType = effect_Schema.Literal("thread.metadata.updated");
const ThreadTokenUsageUpdatedType = effect_Schema.Literal("thread.token-usage.updated");
const ThreadRealtimeStartedType = effect_Schema.Literal("thread.realtime.started");
const ThreadRealtimeItemAddedType = effect_Schema.Literal("thread.realtime.item-added");
const ThreadRealtimeAudioDeltaType = effect_Schema.Literal("thread.realtime.audio.delta");
const ThreadRealtimeErrorType = effect_Schema.Literal("thread.realtime.error");
const ThreadRealtimeClosedType = effect_Schema.Literal("thread.realtime.closed");
const TurnStartedType = effect_Schema.Literal("turn.started");
const TurnCompletedType = effect_Schema.Literal("turn.completed");
const TurnAbortedType = effect_Schema.Literal("turn.aborted");
const TurnPlanUpdatedType = effect_Schema.Literal("turn.plan.updated");
const TurnProposedDeltaType = effect_Schema.Literal("turn.proposed.delta");
const TurnProposedCompletedType = effect_Schema.Literal("turn.proposed.completed");
const TurnDiffUpdatedType = effect_Schema.Literal("turn.diff.updated");
const ItemStartedType = effect_Schema.Literal("item.started");
const ItemUpdatedType = effect_Schema.Literal("item.updated");
const ItemCompletedType = effect_Schema.Literal("item.completed");
const ContentDeltaType = effect_Schema.Literal("content.delta");
const RequestOpenedType = effect_Schema.Literal("request.opened");
const RequestResolvedType = effect_Schema.Literal("request.resolved");
const UserInputRequestedType = effect_Schema.Literal("user-input.requested");
const UserInputResolvedType = effect_Schema.Literal("user-input.resolved");
const TaskStartedType = effect_Schema.Literal("task.started");
const TaskProgressType = effect_Schema.Literal("task.progress");
const TaskCompletedType = effect_Schema.Literal("task.completed");
const HookStartedType = effect_Schema.Literal("hook.started");
const HookProgressType = effect_Schema.Literal("hook.progress");
const HookCompletedType = effect_Schema.Literal("hook.completed");
const ToolProgressType = effect_Schema.Literal("tool.progress");
const ToolSummaryType = effect_Schema.Literal("tool.summary");
const AuthStatusType = effect_Schema.Literal("auth.status");
const AccountUpdatedType = effect_Schema.Literal("account.updated");
const AccountRateLimitsUpdatedType = effect_Schema.Literal("account.rate-limits.updated");
const McpStatusUpdatedType = effect_Schema.Literal("mcp.status.updated");
const McpOauthCompletedType = effect_Schema.Literal("mcp.oauth.completed");
const ModelReroutedType = effect_Schema.Literal("model.rerouted");
const ConfigWarningType = effect_Schema.Literal("config.warning");
const DeprecationNoticeType = effect_Schema.Literal("deprecation.notice");
const FilesPersistedType = effect_Schema.Literal("files.persisted");
const RuntimeWarningType = effect_Schema.Literal("runtime.warning");
const RuntimeErrorType = effect_Schema.Literal("runtime.error");
const ProviderRuntimeEventBase = effect_Schema.Struct({
  eventId: EventId,
  provider: ProviderDriverKind,
  providerInstanceId: effect_Schema.optional(ProviderInstanceId),
  threadId: ThreadId,
  createdAt: IsoDateTime,
  turnId: effect_Schema.optional(TurnId),
  itemId: effect_Schema.optional(RuntimeItemId),
  requestId: effect_Schema.optional(RuntimeRequestId),
  providerRefs: effect_Schema.optional(ProviderRefs),
  raw: effect_Schema.optional(RuntimeEventRaw),
});
const SessionStartedPayload = effect_Schema.Struct({
  message: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  resume: effect_Schema.optional(effect_Schema.Unknown),
});
const SessionConfiguredPayload = effect_Schema.Struct({ config: UnknownRecordSchema });
const SessionStateChangedPayload = effect_Schema.Struct({
  state: RuntimeSessionState,
  reason: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  detail: effect_Schema.optional(effect_Schema.Unknown),
});
const SessionExitedPayload = effect_Schema.Struct({
  reason: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  recoverable: effect_Schema.optional(effect_Schema.Boolean),
  exitKind: effect_Schema.optional(RuntimeSessionExitKind),
});
const ThreadStartedPayload = effect_Schema.Struct({
  providerThreadId: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
});
const ThreadStateChangedPayload = effect_Schema.Struct({
  state: RuntimeThreadState,
  detail: effect_Schema.optional(effect_Schema.Unknown),
});
const ThreadMetadataUpdatedPayload = effect_Schema.Struct({
  name: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  metadata: effect_Schema.optional(UnknownRecordSchema),
});
const ThreadTokenUsageSnapshot = effect_Schema.Struct({
  usedTokens: NonNegativeInt,
  totalProcessedTokens: effect_Schema.optional(NonNegativeInt),
  maxTokens: effect_Schema.optional(PositiveInt),
  inputTokens: effect_Schema.optional(NonNegativeInt),
  cachedInputTokens: effect_Schema.optional(NonNegativeInt),
  outputTokens: effect_Schema.optional(NonNegativeInt),
  reasoningOutputTokens: effect_Schema.optional(NonNegativeInt),
  lastUsedTokens: effect_Schema.optional(NonNegativeInt),
  lastInputTokens: effect_Schema.optional(NonNegativeInt),
  lastCachedInputTokens: effect_Schema.optional(NonNegativeInt),
  lastOutputTokens: effect_Schema.optional(NonNegativeInt),
  lastReasoningOutputTokens: effect_Schema.optional(NonNegativeInt),
  toolUses: effect_Schema.optional(NonNegativeInt),
  durationMs: effect_Schema.optional(NonNegativeInt),
  compactsAutomatically: effect_Schema.optional(effect_Schema.Boolean),
});
const ThreadTokenUsageUpdatedPayload = effect_Schema.Struct({ usage: ThreadTokenUsageSnapshot });
const ThreadRealtimeStartedPayload = effect_Schema.Struct({
  realtimeSessionId: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
});
const ThreadRealtimeItemAddedPayload = effect_Schema.Struct({ item: effect_Schema.Unknown });
const ThreadRealtimeAudioDeltaPayload = effect_Schema.Struct({ audio: effect_Schema.Unknown });
const ThreadRealtimeErrorPayload = effect_Schema.Struct({ message: TrimmedNonEmptyStringSchema$1 });
const ThreadRealtimeClosedPayload = effect_Schema.Struct({
  reason: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
});
const TurnStartedPayload = effect_Schema.Struct({
  model: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  effort: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
});
const TurnCompletedPayload = effect_Schema.Struct({
  state: RuntimeTurnState,
  stopReason: effect_Schema.optional(effect_Schema.NullOr(TrimmedNonEmptyStringSchema$1)),
  usage: effect_Schema.optional(effect_Schema.Unknown),
  modelUsage: effect_Schema.optional(UnknownRecordSchema),
  totalCostUsd: effect_Schema.optional(effect_Schema.Number),
  errorMessage: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
});
const TurnAbortedPayload = effect_Schema.Struct({ reason: TrimmedNonEmptyStringSchema$1 });
const RuntimePlanStep = effect_Schema.Struct({
  step: TrimmedNonEmptyStringSchema$1,
  status: RuntimePlanStepStatus,
});
const TurnPlanUpdatedPayload = effect_Schema.Struct({
  explanation: effect_Schema.optional(effect_Schema.NullOr(TrimmedNonEmptyStringSchema$1)),
  plan: effect_Schema.Array(RuntimePlanStep),
});
const TurnProposedDeltaPayload = effect_Schema.Struct({ delta: effect_Schema.String });
const TurnProposedCompletedPayload = effect_Schema.Struct({
  planMarkdown: TrimmedNonEmptyStringSchema$1,
});
const TurnDiffUpdatedPayload = effect_Schema.Struct({ unifiedDiff: effect_Schema.String });
const ItemLifecyclePayload = effect_Schema.Struct({
  itemType: CanonicalItemType,
  status: effect_Schema.optional(RuntimeItemStatus),
  title: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  detail: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  data: effect_Schema.optional(effect_Schema.Unknown),
});
const ContentDeltaPayload = effect_Schema.Struct({
  streamKind: RuntimeContentStreamKind,
  delta: effect_Schema.String,
  contentIndex: effect_Schema.optional(effect_Schema.Int),
  summaryIndex: effect_Schema.optional(effect_Schema.Int),
});
const RequestOpenedPayload = effect_Schema.Struct({
  requestType: CanonicalRequestType,
  detail: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  args: effect_Schema.optional(effect_Schema.Unknown),
});
const RequestResolvedPayload = effect_Schema.Struct({
  requestType: CanonicalRequestType,
  decision: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  resolution: effect_Schema.optional(effect_Schema.Unknown),
});
const UserInputQuestionOption = effect_Schema.Struct({
  label: TrimmedNonEmptyStringSchema$1,
  description: TrimmedNonEmptyStringSchema$1,
});
const UserInputQuestion = effect_Schema.Struct({
  id: TrimmedNonEmptyStringSchema$1,
  header: TrimmedNonEmptyStringSchema$1,
  question: TrimmedNonEmptyStringSchema$1,
  options: effect_Schema.Array(UserInputQuestionOption),
  multiSelect: effect_Schema
    .optional(effect_Schema.Boolean)
    .pipe(effect_Schema.withConstructorDefault(effect_Effect.succeed(false))),
});
const UserInputRequestedPayload = effect_Schema.Struct({
  questions: effect_Schema.Array(UserInputQuestion),
});
const UserInputResolvedPayload = effect_Schema.Struct({ answers: UnknownRecordSchema });
const TaskStartedPayload = effect_Schema.Struct({
  taskId: RuntimeTaskId,
  description: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  taskType: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
});
const TaskProgressPayload = effect_Schema.Struct({
  taskId: RuntimeTaskId,
  description: TrimmedNonEmptyStringSchema$1,
  summary: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  usage: effect_Schema.optional(effect_Schema.Unknown),
  lastToolName: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
});
const TaskCompletedPayload = effect_Schema.Struct({
  taskId: RuntimeTaskId,
  status: effect_Schema.Literals(["completed", "failed", "stopped"]),
  summary: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  usage: effect_Schema.optional(effect_Schema.Unknown),
});
const HookStartedPayload = effect_Schema.Struct({
  hookId: TrimmedNonEmptyStringSchema$1,
  hookName: TrimmedNonEmptyStringSchema$1,
  hookEvent: TrimmedNonEmptyStringSchema$1,
});
const HookProgressPayload = effect_Schema.Struct({
  hookId: TrimmedNonEmptyStringSchema$1,
  output: effect_Schema.optional(effect_Schema.String),
  stdout: effect_Schema.optional(effect_Schema.String),
  stderr: effect_Schema.optional(effect_Schema.String),
});
const HookCompletedPayload = effect_Schema.Struct({
  hookId: TrimmedNonEmptyStringSchema$1,
  outcome: effect_Schema.Literals(["success", "error", "cancelled"]),
  output: effect_Schema.optional(effect_Schema.String),
  stdout: effect_Schema.optional(effect_Schema.String),
  stderr: effect_Schema.optional(effect_Schema.String),
  exitCode: effect_Schema.optional(effect_Schema.Int),
});
const ToolProgressPayload = effect_Schema.Struct({
  toolUseId: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  toolName: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  summary: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  elapsedSeconds: effect_Schema.optional(effect_Schema.Number),
});
const ToolSummaryPayload = effect_Schema.Struct({
  summary: TrimmedNonEmptyStringSchema$1,
  precedingToolUseIds: effect_Schema.optional(effect_Schema.Array(TrimmedNonEmptyStringSchema$1)),
});
const AuthStatusPayload = effect_Schema.Struct({
  isAuthenticating: effect_Schema.optional(effect_Schema.Boolean),
  output: effect_Schema.optional(effect_Schema.Array(effect_Schema.String)),
  error: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
});
const AccountUpdatedPayload = effect_Schema.Struct({ account: effect_Schema.Unknown });
const AccountRateLimitsUpdatedPayload = effect_Schema.Struct({ rateLimits: effect_Schema.Unknown });
const McpStatusUpdatedPayload = effect_Schema.Struct({ status: effect_Schema.Unknown });
const McpOauthCompletedPayload = effect_Schema.Struct({
  success: effect_Schema.Boolean,
  name: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  error: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
});
const ModelReroutedPayload = effect_Schema.Struct({
  fromModel: TrimmedNonEmptyStringSchema$1,
  toModel: TrimmedNonEmptyStringSchema$1,
  reason: TrimmedNonEmptyStringSchema$1,
});
const ConfigWarningPayload = effect_Schema.Struct({
  summary: TrimmedNonEmptyStringSchema$1,
  details: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  path: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
  range: effect_Schema.optional(effect_Schema.Unknown),
});
const DeprecationNoticePayload = effect_Schema.Struct({
  summary: TrimmedNonEmptyStringSchema$1,
  details: effect_Schema.optional(TrimmedNonEmptyStringSchema$1),
});
const FilesPersistedPayload = effect_Schema.Struct({
  files: effect_Schema.Array(
    effect_Schema.Struct({
      filename: TrimmedNonEmptyStringSchema$1,
      fileId: TrimmedNonEmptyStringSchema$1,
    }),
  ),
  failed: effect_Schema.optional(
    effect_Schema.Array(
      effect_Schema.Struct({
        filename: TrimmedNonEmptyStringSchema$1,
        error: TrimmedNonEmptyStringSchema$1,
      }),
    ),
  ),
});
const RuntimeWarningPayload = effect_Schema.Struct({
  message: TrimmedNonEmptyStringSchema$1,
  detail: effect_Schema.optional(effect_Schema.Unknown),
});
const RuntimeErrorPayload = effect_Schema.Struct({
  message: TrimmedNonEmptyStringSchema$1,
  class: effect_Schema.optional(RuntimeErrorClass),
  detail: effect_Schema.optional(effect_Schema.Unknown),
});
const ProviderRuntimeSessionStartedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: SessionStartedType,
  payload: SessionStartedPayload,
});
const ProviderRuntimeSessionConfiguredEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: SessionConfiguredType,
  payload: SessionConfiguredPayload,
});
const ProviderRuntimeSessionStateChangedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: SessionStateChangedType,
  payload: SessionStateChangedPayload,
});
const ProviderRuntimeSessionExitedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: SessionExitedType,
  payload: SessionExitedPayload,
});
const ProviderRuntimeThreadStartedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ThreadStartedType,
  payload: ThreadStartedPayload,
});
const ProviderRuntimeThreadStateChangedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ThreadStateChangedType,
  payload: ThreadStateChangedPayload,
});
const ProviderRuntimeThreadMetadataUpdatedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ThreadMetadataUpdatedType,
  payload: ThreadMetadataUpdatedPayload,
});
const ProviderRuntimeThreadTokenUsageUpdatedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ThreadTokenUsageUpdatedType,
  payload: ThreadTokenUsageUpdatedPayload,
});
const ProviderRuntimeThreadRealtimeStartedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ThreadRealtimeStartedType,
  payload: ThreadRealtimeStartedPayload,
});
const ProviderRuntimeThreadRealtimeItemAddedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ThreadRealtimeItemAddedType,
  payload: ThreadRealtimeItemAddedPayload,
});
const ProviderRuntimeThreadRealtimeAudioDeltaEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ThreadRealtimeAudioDeltaType,
  payload: ThreadRealtimeAudioDeltaPayload,
});
const ProviderRuntimeThreadRealtimeErrorEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ThreadRealtimeErrorType,
  payload: ThreadRealtimeErrorPayload,
});
const ProviderRuntimeThreadRealtimeClosedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ThreadRealtimeClosedType,
  payload: ThreadRealtimeClosedPayload,
});
const ProviderRuntimeTurnStartedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: TurnStartedType,
  payload: TurnStartedPayload,
});
const ProviderRuntimeTurnCompletedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: TurnCompletedType,
  payload: TurnCompletedPayload,
});
const ProviderRuntimeTurnAbortedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: TurnAbortedType,
  payload: TurnAbortedPayload,
});
const ProviderRuntimeTurnPlanUpdatedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: TurnPlanUpdatedType,
  payload: TurnPlanUpdatedPayload,
});
const ProviderRuntimeTurnProposedDeltaEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: TurnProposedDeltaType,
  payload: TurnProposedDeltaPayload,
});
const ProviderRuntimeTurnProposedCompletedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: TurnProposedCompletedType,
  payload: TurnProposedCompletedPayload,
});
const ProviderRuntimeTurnDiffUpdatedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: TurnDiffUpdatedType,
  payload: TurnDiffUpdatedPayload,
});
const ProviderRuntimeItemStartedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ItemStartedType,
  payload: ItemLifecyclePayload,
});
const ProviderRuntimeItemUpdatedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ItemUpdatedType,
  payload: ItemLifecyclePayload,
});
const ProviderRuntimeItemCompletedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ItemCompletedType,
  payload: ItemLifecyclePayload,
});
const ProviderRuntimeContentDeltaEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ContentDeltaType,
  payload: ContentDeltaPayload,
});
const ProviderRuntimeRequestOpenedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: RequestOpenedType,
  payload: RequestOpenedPayload,
});
const ProviderRuntimeRequestResolvedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: RequestResolvedType,
  payload: RequestResolvedPayload,
});
const ProviderRuntimeUserInputRequestedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: UserInputRequestedType,
  payload: UserInputRequestedPayload,
});
const ProviderRuntimeUserInputResolvedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: UserInputResolvedType,
  payload: UserInputResolvedPayload,
});
const ProviderRuntimeTaskStartedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: TaskStartedType,
  payload: TaskStartedPayload,
});
const ProviderRuntimeTaskProgressEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: TaskProgressType,
  payload: TaskProgressPayload,
});
const ProviderRuntimeTaskCompletedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: TaskCompletedType,
  payload: TaskCompletedPayload,
});
const ProviderRuntimeHookStartedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: HookStartedType,
  payload: HookStartedPayload,
});
const ProviderRuntimeHookProgressEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: HookProgressType,
  payload: HookProgressPayload,
});
const ProviderRuntimeHookCompletedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: HookCompletedType,
  payload: HookCompletedPayload,
});
const ProviderRuntimeToolProgressEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ToolProgressType,
  payload: ToolProgressPayload,
});
const ProviderRuntimeToolSummaryEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ToolSummaryType,
  payload: ToolSummaryPayload,
});
const ProviderRuntimeAuthStatusEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: AuthStatusType,
  payload: AuthStatusPayload,
});
const ProviderRuntimeAccountUpdatedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: AccountUpdatedType,
  payload: AccountUpdatedPayload,
});
const ProviderRuntimeAccountRateLimitsUpdatedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: AccountRateLimitsUpdatedType,
  payload: AccountRateLimitsUpdatedPayload,
});
const ProviderRuntimeMcpStatusUpdatedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: McpStatusUpdatedType,
  payload: McpStatusUpdatedPayload,
});
const ProviderRuntimeMcpOauthCompletedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: McpOauthCompletedType,
  payload: McpOauthCompletedPayload,
});
const ProviderRuntimeModelReroutedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ModelReroutedType,
  payload: ModelReroutedPayload,
});
const ProviderRuntimeConfigWarningEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: ConfigWarningType,
  payload: ConfigWarningPayload,
});
const ProviderRuntimeDeprecationNoticeEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: DeprecationNoticeType,
  payload: DeprecationNoticePayload,
});
const ProviderRuntimeFilesPersistedEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: FilesPersistedType,
  payload: FilesPersistedPayload,
});
const ProviderRuntimeWarningEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: RuntimeWarningType,
  payload: RuntimeWarningPayload,
});
const ProviderRuntimeErrorEvent = effect_Schema.Struct({
  ...ProviderRuntimeEventBase.fields,
  type: RuntimeErrorType,
  payload: RuntimeErrorPayload,
});
const ProviderRuntimeEventV2 = effect_Schema.Union([
  ProviderRuntimeSessionStartedEvent,
  ProviderRuntimeSessionConfiguredEvent,
  ProviderRuntimeSessionStateChangedEvent,
  ProviderRuntimeSessionExitedEvent,
  ProviderRuntimeThreadStartedEvent,
  ProviderRuntimeThreadStateChangedEvent,
  ProviderRuntimeThreadMetadataUpdatedEvent,
  ProviderRuntimeThreadTokenUsageUpdatedEvent,
  ProviderRuntimeThreadRealtimeStartedEvent,
  ProviderRuntimeThreadRealtimeItemAddedEvent,
  ProviderRuntimeThreadRealtimeAudioDeltaEvent,
  ProviderRuntimeThreadRealtimeErrorEvent,
  ProviderRuntimeThreadRealtimeClosedEvent,
  ProviderRuntimeTurnStartedEvent,
  ProviderRuntimeTurnCompletedEvent,
  ProviderRuntimeTurnAbortedEvent,
  ProviderRuntimeTurnPlanUpdatedEvent,
  ProviderRuntimeTurnProposedDeltaEvent,
  ProviderRuntimeTurnProposedCompletedEvent,
  ProviderRuntimeTurnDiffUpdatedEvent,
  ProviderRuntimeItemStartedEvent,
  ProviderRuntimeItemUpdatedEvent,
  ProviderRuntimeItemCompletedEvent,
  ProviderRuntimeContentDeltaEvent,
  ProviderRuntimeRequestOpenedEvent,
  ProviderRuntimeRequestResolvedEvent,
  ProviderRuntimeUserInputRequestedEvent,
  ProviderRuntimeUserInputResolvedEvent,
  ProviderRuntimeTaskStartedEvent,
  ProviderRuntimeTaskProgressEvent,
  ProviderRuntimeTaskCompletedEvent,
  ProviderRuntimeHookStartedEvent,
  ProviderRuntimeHookProgressEvent,
  ProviderRuntimeHookCompletedEvent,
  ProviderRuntimeToolProgressEvent,
  ProviderRuntimeToolSummaryEvent,
  ProviderRuntimeAuthStatusEvent,
  ProviderRuntimeAccountUpdatedEvent,
  ProviderRuntimeAccountRateLimitsUpdatedEvent,
  ProviderRuntimeMcpStatusUpdatedEvent,
  ProviderRuntimeMcpOauthCompletedEvent,
  ProviderRuntimeModelReroutedEvent,
  ProviderRuntimeConfigWarningEvent,
  ProviderRuntimeDeprecationNoticeEvent,
  ProviderRuntimeFilesPersistedEvent,
  ProviderRuntimeWarningEvent,
  ProviderRuntimeErrorEvent,
]);
effect_Schema.Literals(["command", "file-read", "file-change", "other"]);

//#endregion
//#region ../../packages/contracts/src/keybindings.ts
const MAX_KEYBINDING_VALUE_LENGTH = 64;
const MAX_KEYBINDING_WHEN_LENGTH = 256;
const MAX_SCRIPT_ID_LENGTH = 24;
const MAX_KEYBINDINGS_COUNT = 256;
const THREAD_JUMP_KEYBINDING_COMMANDS = [
  "thread.jump.1",
  "thread.jump.2",
  "thread.jump.3",
  "thread.jump.4",
  "thread.jump.5",
  "thread.jump.6",
  "thread.jump.7",
  "thread.jump.8",
  "thread.jump.9",
];
const MODEL_PICKER_JUMP_KEYBINDING_COMMANDS = [
  "modelPicker.jump.1",
  "modelPicker.jump.2",
  "modelPicker.jump.3",
  "modelPicker.jump.4",
  "modelPicker.jump.5",
  "modelPicker.jump.6",
  "modelPicker.jump.7",
  "modelPicker.jump.8",
  "modelPicker.jump.9",
];
const THREAD_KEYBINDING_COMMANDS = [
  "thread.previous",
  "thread.next",
  ...THREAD_JUMP_KEYBINDING_COMMANDS,
];
const MODEL_PICKER_KEYBINDING_COMMANDS = [
  "modelPicker.toggle",
  ...MODEL_PICKER_JUMP_KEYBINDING_COMMANDS,
];
const STATIC_KEYBINDING_COMMANDS = [
  "terminal.toggle",
  "terminal.split",
  "terminal.new",
  "terminal.close",
  "diff.toggle",
  "commandPalette.toggle",
  "chat.new",
  "chat.newLocal",
  "editor.openFavorite",
  ...MODEL_PICKER_KEYBINDING_COMMANDS,
  ...THREAD_KEYBINDING_COMMANDS,
];
const SCRIPT_RUN_COMMAND_PATTERN = effect_Schema.TemplateLiteral([
  effect_Schema.Literal("script."),
  effect_Schema.NonEmptyString.check(
    effect_Schema.isMaxLength(MAX_SCRIPT_ID_LENGTH),
    effect_Schema.isPattern(/^[a-z0-9][a-z0-9-]*$/),
  ),
  effect_Schema.Literal(".run"),
]);
const KeybindingCommand = effect_Schema.Union([
  effect_Schema.Literals(STATIC_KEYBINDING_COMMANDS),
  SCRIPT_RUN_COMMAND_PATTERN,
]);
const KeybindingValue = TrimmedString.check(
  effect_Schema.isMinLength(1),
  effect_Schema.isMaxLength(MAX_KEYBINDING_VALUE_LENGTH),
);
const KeybindingWhen = TrimmedString.check(
  effect_Schema.isMinLength(1),
  effect_Schema.isMaxLength(MAX_KEYBINDING_WHEN_LENGTH),
);
const KeybindingRule = effect_Schema.Struct({
  key: KeybindingValue,
  command: KeybindingCommand,
  when: effect_Schema.optional(KeybindingWhen),
});
const KeybindingsConfig = effect_Schema
  .Array(KeybindingRule)
  .check(effect_Schema.isMaxLength(MAX_KEYBINDINGS_COUNT));
const KeybindingShortcut = effect_Schema.Struct({
  key: KeybindingValue,
  metaKey: effect_Schema.Boolean,
  ctrlKey: effect_Schema.Boolean,
  shiftKey: effect_Schema.Boolean,
  altKey: effect_Schema.Boolean,
  modKey: effect_Schema.Boolean,
});
const KeybindingWhenNodeRef = effect_Schema.suspend(() => KeybindingWhenNode);
const KeybindingWhenNode = effect_Schema.Union([
  effect_Schema.Struct({
    type: effect_Schema.Literal("identifier"),
    name: effect_Schema.NonEmptyString,
  }),
  effect_Schema.Struct({
    type: effect_Schema.Literal("not"),
    node: KeybindingWhenNodeRef,
  }),
  effect_Schema.Struct({
    type: effect_Schema.Literal("and"),
    left: KeybindingWhenNodeRef,
    right: KeybindingWhenNodeRef,
  }),
  effect_Schema.Struct({
    type: effect_Schema.Literal("or"),
    left: KeybindingWhenNodeRef,
    right: KeybindingWhenNodeRef,
  }),
]);
const ResolvedKeybindingRule = effect_Schema
  .Struct({
    command: KeybindingCommand,
    shortcut: KeybindingShortcut,
    whenAst: effect_Schema.optional(KeybindingWhenNode),
  })
  .annotate({ parseOptions: { onExcessProperty: "ignore" } });
const ResolvedKeybindingsConfig = effect_Schema
  .Array(ResolvedKeybindingRule)
  .check(effect_Schema.isMaxLength(MAX_KEYBINDINGS_COUNT));
var KeybindingsConfigError = class extends effect_Schema.TaggedErrorClass()(
  "KeybindingsConfigParseError",
  {
    configPath: effect_Schema.String,
    detail: effect_Schema.String,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {
  get message() {
    return `Unable to parse keybindings config at ${this.configPath}: ${this.detail}`;
  }
};

//#endregion
//#region ../../packages/contracts/src/settings.ts
const TimestampFormat = effect_Schema.Literals(["locale", "12-hour", "24-hour"]);
const DEFAULT_TIMESTAMP_FORMAT = "locale";
const SidebarProjectSortOrder = effect_Schema.Literals(["updated_at", "created_at", "manual"]);
const DEFAULT_SIDEBAR_PROJECT_SORT_ORDER = "updated_at";
const SidebarThreadSortOrder = effect_Schema.Literals(["updated_at", "created_at"]);
const DEFAULT_SIDEBAR_THREAD_SORT_ORDER = "updated_at";
const SidebarProjectGroupingMode = effect_Schema.Literals([
  "repository",
  "repository_path",
  "separate",
]);
const DEFAULT_SIDEBAR_PROJECT_GROUPING_MODE = "repository";
const MIN_SIDEBAR_THREAD_PREVIEW_COUNT = 1;
const MAX_SIDEBAR_THREAD_PREVIEW_COUNT = 15;
const SidebarThreadPreviewCount = effect_Schema.Int.check(
  effect_Schema.isBetween({
    minimum: MIN_SIDEBAR_THREAD_PREVIEW_COUNT,
    maximum: MAX_SIDEBAR_THREAD_PREVIEW_COUNT,
  }),
);
const DEFAULT_SIDEBAR_THREAD_PREVIEW_COUNT = 6;
const ClientSettingsSchema = effect_Schema.Struct({
  autoOpenPlanSidebar: effect_Schema.Boolean.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(true)),
  ),
  confirmThreadArchive: effect_Schema.Boolean.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(false)),
  ),
  confirmThreadDelete: effect_Schema.Boolean.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(true)),
  ),
  dismissedProviderUpdateNotificationKeys: effect_Schema
    .Array(TrimmedNonEmptyString)
    .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed([]))),
  diffIgnoreWhitespace: effect_Schema.Boolean.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(true)),
  ),
  diffWordWrap: effect_Schema.Boolean.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(false)),
  ),
  favorites: effect_Schema
    .Array(
      effect_Schema.Struct({
        provider: ProviderInstanceId,
        model: TrimmedNonEmptyString,
      }),
    )
    .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed([]))),
  providerModelPreferences: effect_Schema
    .Record(
      ProviderInstanceId,
      effect_Schema.Struct({
        hiddenModels: effect_Schema
          .Array(effect_Schema.String)
          .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed([]))),
        modelOrder: effect_Schema
          .Array(effect_Schema.String)
          .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed([]))),
      }),
    )
    .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed({}))),
  sidebarProjectGroupingMode: SidebarProjectGroupingMode.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_SIDEBAR_PROJECT_GROUPING_MODE)),
  ),
  sidebarProjectGroupingOverrides: effect_Schema
    .Record(TrimmedNonEmptyString, SidebarProjectGroupingMode)
    .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed({}))),
  sidebarProjectSortOrder: SidebarProjectSortOrder.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_SIDEBAR_PROJECT_SORT_ORDER)),
  ),
  sidebarThreadSortOrder: SidebarThreadSortOrder.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_SIDEBAR_THREAD_SORT_ORDER)),
  ),
  sidebarThreadPreviewCount: SidebarThreadPreviewCount.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_SIDEBAR_THREAD_PREVIEW_COUNT)),
  ),
  timestampFormat: TimestampFormat.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(DEFAULT_TIMESTAMP_FORMAT)),
  ),
});
const DEFAULT_CLIENT_SETTINGS = effect_Schema.decodeSync(ClientSettingsSchema)({});
const ThreadEnvMode = effect_Schema.Literals(["local", "worktree"]);
const makeBinaryPathSetting = (fallback) =>
  TrimmedString.pipe(
    effect_Schema.decodeTo(
      effect_Schema.String,
      effect_SchemaTransformation.transformOrFail({
        decode: (value) => effect_Effect.succeed(value || fallback),
        encode: (value) => effect_Effect.succeed(value),
      }),
    ),
    effect_Schema.withDecodingDefault(effect_Effect.succeed(fallback)),
  );
function makeProviderSettingsSchema(fields, options) {
  return effect_Schema.Struct(fields).pipe(
    effect_Schema.annotate({
      providerSettingsFormSchema: options?.order === void 0 ? void 0 : { order: options.order },
    }),
  );
}
const CodexSettings = makeProviderSettingsSchema(
  {
    enabled: effect_Schema.Boolean.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed(true)),
      effect_Schema.annotateKey({ providerSettingsForm: { hidden: true } }),
    ),
    binaryPath: makeBinaryPathSetting("codex").pipe(
      effect_Schema.annotateKey({
        title: "Binary path",
        description: "Path to the Codex binary used by this instance.",
        providerSettingsForm: {
          placeholder: "codex",
          clearWhenEmpty: "omit",
        },
      }),
    ),
    homePath: TrimmedString.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed("")),
      effect_Schema.annotateKey({
        title: "CODEX_HOME path",
        description: "Custom Codex home and config directory.",
        providerSettingsForm: {
          placeholder: "~/.codex",
          clearWhenEmpty: "omit",
        },
      }),
    ),
    shadowHomePath: TrimmedString.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed("")),
      effect_Schema.annotateKey({
        title: "Shadow home path",
        description:
          "Account-specific Codex home. Keeps auth.json separate while sharing state from CODEX_HOME.",
        providerSettingsForm: {
          placeholder: "~/.codex-t3/personal",
          clearWhenEmpty: "omit",
        },
      }),
    ),
    customModels: effect_Schema
      .Array(effect_Schema.String)
      .pipe(
        effect_Schema.withDecodingDefault(effect_Effect.succeed([])),
        effect_Schema.annotateKey({ providerSettingsForm: { hidden: true } }),
      ),
  },
  { order: ["binaryPath", "homePath", "shadowHomePath"] },
);
const ClaudeSettings = makeProviderSettingsSchema(
  {
    enabled: effect_Schema.Boolean.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed(true)),
      effect_Schema.annotateKey({ providerSettingsForm: { hidden: true } }),
    ),
    binaryPath: makeBinaryPathSetting("claude").pipe(
      effect_Schema.annotateKey({
        title: "Binary path",
        description: "Path to the Claude binary used by this instance.",
        providerSettingsForm: {
          placeholder: "claude",
          clearWhenEmpty: "omit",
        },
      }),
    ),
    homePath: TrimmedString.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed("")),
      effect_Schema.annotateKey({
        title: "Claude HOME path",
        description:
          "Custom HOME used when running this Claude instance. Keeps .claude.json and .claude separate.",
        providerSettingsForm: {
          placeholder: "~",
          clearWhenEmpty: "omit",
        },
      }),
    ),
    customModels: effect_Schema
      .Array(effect_Schema.String)
      .pipe(
        effect_Schema.withDecodingDefault(effect_Effect.succeed([])),
        effect_Schema.annotateKey({ providerSettingsForm: { hidden: true } }),
      ),
    launchArgs: effect_Schema.String.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed("")),
      effect_Schema.annotateKey({
        title: "Launch arguments",
        description: "Additional CLI arguments passed on session start.",
        providerSettingsForm: {
          placeholder: "e.g. --chrome",
          clearWhenEmpty: "omit",
        },
      }),
    ),
  },
  { order: ["binaryPath", "homePath", "launchArgs"] },
);
const CursorSettings = makeProviderSettingsSchema(
  {
    enabled: effect_Schema.Boolean.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed(false)),
      effect_Schema.annotateKey({ providerSettingsForm: { hidden: true } }),
    ),
    binaryPath: makeBinaryPathSetting("agent").pipe(
      effect_Schema.annotateKey({
        title: "Binary path",
        description: "Path to the Cursor agent binary.",
        providerSettingsForm: {
          placeholder: "agent",
          clearWhenEmpty: "omit",
        },
      }),
    ),
    apiEndpoint: TrimmedString.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed("")),
      effect_Schema.annotateKey({
        title: "API endpoint",
        description: "Override the Cursor API endpoint for this instance.",
        providerSettingsForm: {
          placeholder: "https://...",
          clearWhenEmpty: "omit",
        },
      }),
    ),
    customModels: effect_Schema
      .Array(effect_Schema.String)
      .pipe(
        effect_Schema.withDecodingDefault(effect_Effect.succeed([])),
        effect_Schema.annotateKey({ providerSettingsForm: { hidden: true } }),
      ),
  },
  { order: ["binaryPath", "apiEndpoint"] },
);
const OpenCodeSettings = makeProviderSettingsSchema(
  {
    enabled: effect_Schema.Boolean.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed(true)),
      effect_Schema.annotateKey({ providerSettingsForm: { hidden: true } }),
    ),
    binaryPath: makeBinaryPathSetting("opencode").pipe(
      effect_Schema.annotateKey({
        title: "Binary path",
        description: "Path to the OpenCode binary.",
        providerSettingsForm: {
          placeholder: "opencode",
          clearWhenEmpty: "omit",
        },
      }),
    ),
    serverUrl: TrimmedString.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed("")),
      effect_Schema.annotateKey({
        title: "Server URL",
        description: "Leave blank to let T3 Code spawn the server when needed.",
        providerSettingsForm: {
          placeholder: "http://127.0.0.1:4096",
          clearWhenEmpty: "omit",
        },
      }),
    ),
    serverPassword: TrimmedString.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed("")),
      effect_Schema.annotateKey({
        title: "Server password",
        description: "Stored in plain text on disk.",
        providerSettingsForm: {
          control: "password",
          placeholder: "Optional",
          clearWhenEmpty: "omit",
        },
      }),
    ),
    customModels: effect_Schema
      .Array(effect_Schema.String)
      .pipe(
        effect_Schema.withDecodingDefault(effect_Effect.succeed([])),
        effect_Schema.annotateKey({ providerSettingsForm: { hidden: true } }),
      ),
  },
  { order: ["binaryPath", "serverUrl", "serverPassword"] },
);
const KiroSettings = makeProviderSettingsSchema(
  {
    enabled: effect_Schema.Boolean.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed(false)),
      effect_Schema.annotateKey({ providerSettingsForm: { hidden: true } }),
    ),
    binaryPath: makeBinaryPathSetting("kiro-cli").pipe(
      effect_Schema.annotateKey({
        title: "Binary path",
        description: "Path to the Kiro CLI binary.",
        providerSettingsForm: {
          placeholder: "kiro-cli",
          clearWhenEmpty: "omit",
        },
      }),
    ),
    agentName: TrimmedString.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed("")),
      effect_Schema.annotateKey({
        title: "Default agent",
        description: "Default Kiro agent passed to ACP sessions.",
        providerSettingsForm: {
          placeholder: "build",
          clearWhenEmpty: "omit",
        },
      }),
    ),
    agentNames: TrimmedString.pipe(
      effect_Schema.withDecodingDefault(effect_Effect.succeed("")),
      effect_Schema.annotateKey({
        title: "Agent choices",
        description: "Additional Kiro agents to show in the model picker, one per line.",
        providerSettingsForm: {
          control: "textarea",
          placeholder: "build\nreview",
          clearWhenEmpty: "omit",
        },
      }),
    ),
    customModels: effect_Schema
      .Array(effect_Schema.String)
      .pipe(
        effect_Schema.withDecodingDefault(effect_Effect.succeed([])),
        effect_Schema.annotateKey({ providerSettingsForm: { hidden: true } }),
      ),
  },
  { order: ["binaryPath", "agentName", "agentNames"] },
);
const ObservabilitySettings = effect_Schema.Struct({
  otlpTracesUrl: TrimmedString.pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed(""))),
  otlpMetricsUrl: TrimmedString.pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed(""))),
});
const DEFAULT_AUTOMATIC_GIT_FETCH_INTERVAL = effect_Duration.seconds(30);
const ServerSettings = effect_Schema.Struct({
  enableAssistantStreaming: effect_Schema.Boolean.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(false)),
  ),
  automaticGitFetchInterval: effect_Schema.DurationFromMillis.pipe(
    effect_Schema.withDecodingDefault(
      effect_Effect.succeed(effect_Duration.toMillis(DEFAULT_AUTOMATIC_GIT_FETCH_INTERVAL)),
    ),
  ),
  defaultThreadEnvMode: ThreadEnvMode.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed("local")),
  ),
  addProjectBaseDirectory: TrimmedString.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed("")),
  ),
  textGenerationModelSelection: ModelSelection.pipe(
    effect_Schema.withDecodingDefault(
      effect_Effect.succeed({
        instanceId: ProviderInstanceId.make("codex"),
        model: DEFAULT_GIT_TEXT_GENERATION_MODEL,
      }),
    ),
  ),
  providers: effect_Schema
    .Struct({
      codex: CodexSettings.pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed({}))),
      claudeAgent: ClaudeSettings.pipe(
        effect_Schema.withDecodingDefault(effect_Effect.succeed({})),
      ),
      cursor: CursorSettings.pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed({}))),
      opencode: OpenCodeSettings.pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed({}))),
      kiro: KiroSettings.pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed({}))),
    })
    .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed({}))),
  providerInstances: effect_Schema
    .Record(ProviderInstanceId, ProviderInstanceConfig)
    .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed({}))),
  observability: ObservabilitySettings.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed({})),
  ),
});
const DEFAULT_SERVER_SETTINGS = effect_Schema.decodeSync(ServerSettings)({});
var ServerSettingsError = class extends effect_Schema.TaggedErrorClass()("ServerSettingsError", {
  settingsPath: effect_Schema.String,
  detail: effect_Schema.String,
  cause: effect_Schema.optional(effect_Schema.Defect),
}) {
  get message() {
    return `Server settings error at ${this.settingsPath}: ${this.detail}`;
  }
};
const DEFAULT_UNIFIED_SETTINGS = {
  ...DEFAULT_SERVER_SETTINGS,
  ...DEFAULT_CLIENT_SETTINGS,
};
const ModelSelectionPatch = effect_Schema.Struct({
  instanceId: effect_Schema.optionalKey(ProviderInstanceId),
  model: effect_Schema.optionalKey(TrimmedNonEmptyString),
  options: effect_Schema.optionalKey(ProviderOptionSelections),
});
const CodexSettingsPatch = effect_Schema.Struct({
  enabled: effect_Schema.optionalKey(effect_Schema.Boolean),
  binaryPath: effect_Schema.optionalKey(TrimmedString),
  homePath: effect_Schema.optionalKey(TrimmedString),
  shadowHomePath: effect_Schema.optionalKey(TrimmedString),
  customModels: effect_Schema.optionalKey(effect_Schema.Array(effect_Schema.String)),
});
const ClaudeSettingsPatch = effect_Schema.Struct({
  enabled: effect_Schema.optionalKey(effect_Schema.Boolean),
  binaryPath: effect_Schema.optionalKey(TrimmedString),
  homePath: effect_Schema.optionalKey(TrimmedString),
  customModels: effect_Schema.optionalKey(effect_Schema.Array(effect_Schema.String)),
  launchArgs: effect_Schema.optionalKey(TrimmedString),
});
const CursorSettingsPatch = effect_Schema.Struct({
  enabled: effect_Schema.optionalKey(effect_Schema.Boolean),
  binaryPath: effect_Schema.optionalKey(TrimmedString),
  apiEndpoint: effect_Schema.optionalKey(TrimmedString),
  customModels: effect_Schema.optionalKey(effect_Schema.Array(effect_Schema.String)),
});
const OpenCodeSettingsPatch = effect_Schema.Struct({
  enabled: effect_Schema.optionalKey(effect_Schema.Boolean),
  binaryPath: effect_Schema.optionalKey(TrimmedString),
  serverUrl: effect_Schema.optionalKey(TrimmedString),
  serverPassword: effect_Schema.optionalKey(TrimmedString),
  customModels: effect_Schema.optionalKey(effect_Schema.Array(effect_Schema.String)),
});
const KiroSettingsPatch = effect_Schema.Struct({
  enabled: effect_Schema.optionalKey(effect_Schema.Boolean),
  binaryPath: effect_Schema.optionalKey(TrimmedString),
  agentName: effect_Schema.optionalKey(TrimmedString),
  agentNames: effect_Schema.optionalKey(TrimmedString),
  customModels: effect_Schema.optionalKey(effect_Schema.Array(effect_Schema.String)),
});
const ServerSettingsPatch = effect_Schema.Struct({
  enableAssistantStreaming: effect_Schema.optionalKey(effect_Schema.Boolean),
  automaticGitFetchInterval: effect_Schema.optionalKey(effect_Schema.DurationFromMillis),
  defaultThreadEnvMode: effect_Schema.optionalKey(ThreadEnvMode),
  addProjectBaseDirectory: effect_Schema.optionalKey(TrimmedString),
  textGenerationModelSelection: effect_Schema.optionalKey(ModelSelectionPatch),
  observability: effect_Schema.optionalKey(
    effect_Schema.Struct({
      otlpTracesUrl: effect_Schema.optionalKey(TrimmedString),
      otlpMetricsUrl: effect_Schema.optionalKey(TrimmedString),
    }),
  ),
  providers: effect_Schema.optionalKey(
    effect_Schema.Struct({
      codex: effect_Schema.optionalKey(CodexSettingsPatch),
      claudeAgent: effect_Schema.optionalKey(ClaudeSettingsPatch),
      cursor: effect_Schema.optionalKey(CursorSettingsPatch),
      opencode: effect_Schema.optionalKey(OpenCodeSettingsPatch),
      kiro: effect_Schema.optionalKey(KiroSettingsPatch),
    }),
  ),
  providerInstances: effect_Schema.optionalKey(
    effect_Schema.Record(ProviderInstanceId, ProviderInstanceConfig),
  ),
});
const ClientSettingsPatch = effect_Schema.Struct({
  autoOpenPlanSidebar: effect_Schema.optionalKey(effect_Schema.Boolean),
  confirmThreadArchive: effect_Schema.optionalKey(effect_Schema.Boolean),
  confirmThreadDelete: effect_Schema.optionalKey(effect_Schema.Boolean),
  diffIgnoreWhitespace: effect_Schema.optionalKey(effect_Schema.Boolean),
  diffWordWrap: effect_Schema.optionalKey(effect_Schema.Boolean),
  favorites: effect_Schema.optionalKey(
    effect_Schema.Array(
      effect_Schema.Struct({
        provider: ProviderInstanceId,
        model: TrimmedNonEmptyString,
      }),
    ),
  ),
  providerModelPreferences: effect_Schema.optionalKey(
    effect_Schema.Record(
      ProviderInstanceId,
      effect_Schema.Struct({
        hiddenModels: effect_Schema
          .Array(effect_Schema.String)
          .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed([]))),
        modelOrder: effect_Schema
          .Array(effect_Schema.String)
          .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed([]))),
      }),
    ),
  ),
  sidebarProjectGroupingMode: effect_Schema.optionalKey(SidebarProjectGroupingMode),
  sidebarProjectGroupingOverrides: effect_Schema.optionalKey(
    effect_Schema.Record(TrimmedNonEmptyString, SidebarProjectGroupingMode),
  ),
  sidebarProjectSortOrder: effect_Schema.optionalKey(SidebarProjectSortOrder),
  sidebarThreadSortOrder: effect_Schema.optionalKey(SidebarThreadSortOrder),
  sidebarThreadPreviewCount: effect_Schema.optionalKey(SidebarThreadPreviewCount),
  timestampFormat: effect_Schema.optionalKey(TimestampFormat),
});

//#endregion
//#region ../../packages/contracts/src/server.ts
const KeybindingsMalformedConfigIssue = effect_Schema.Struct({
  kind: effect_Schema.Literal("keybindings.malformed-config"),
  message: TrimmedNonEmptyString,
});
const KeybindingsInvalidEntryIssue = effect_Schema.Struct({
  kind: effect_Schema.Literal("keybindings.invalid-entry"),
  message: TrimmedNonEmptyString,
  index: effect_Schema.Number,
});
const ServerConfigIssue = effect_Schema.Union([
  KeybindingsMalformedConfigIssue,
  KeybindingsInvalidEntryIssue,
]);
const ServerConfigIssues = effect_Schema.Array(ServerConfigIssue);
const ServerProviderState = effect_Schema.Literals(["ready", "warning", "error", "disabled"]);
const ServerProviderAuthStatus = effect_Schema.Literals([
  "authenticated",
  "unauthenticated",
  "unknown",
]);
const ServerProviderAuth = effect_Schema.Struct({
  status: ServerProviderAuthStatus,
  type: effect_Schema.optional(TrimmedNonEmptyString),
  label: effect_Schema.optional(TrimmedNonEmptyString),
  email: effect_Schema.optional(TrimmedNonEmptyString),
});
const ServerProviderModel = effect_Schema.Struct({
  slug: TrimmedNonEmptyString,
  name: TrimmedNonEmptyString,
  shortName: effect_Schema.optional(TrimmedNonEmptyString),
  subProvider: effect_Schema.optional(TrimmedNonEmptyString),
  isCustom: effect_Schema.Boolean,
  capabilities: effect_Schema.NullOr(ModelCapabilities),
});
const ServerProviderSlashCommandInput = effect_Schema.Struct({ hint: TrimmedNonEmptyString });
const ServerProviderSlashCommand = effect_Schema.Struct({
  name: TrimmedNonEmptyString,
  description: effect_Schema.optional(TrimmedNonEmptyString),
  input: effect_Schema.optional(ServerProviderSlashCommandInput),
});
const ServerProviderSkill = effect_Schema.Struct({
  name: TrimmedNonEmptyString,
  description: effect_Schema.optional(TrimmedNonEmptyString),
  path: TrimmedNonEmptyString,
  scope: effect_Schema.optional(TrimmedNonEmptyString),
  enabled: effect_Schema.Boolean,
  displayName: effect_Schema.optional(TrimmedNonEmptyString),
  shortDescription: effect_Schema.optional(TrimmedNonEmptyString),
});
/**
 * Availability of a configured provider instance from the runtime's POV.
 *
 *  - `available` — the build ships this driver and an instance is wired
 *    up. Default for legacy snapshots produced from the closed
 *    `ServerSettings.providers` map.
 *  - `unavailable` — the user's `ServerSettings.providerInstances` (or a
 *    persisted thread / session binding) references a driver this build
 *    doesn't ship. Common after rolling back from a fork or PR branch
 *    that introduced a new driver. The snapshot is preserved so the UI
 *    can render "missing driver" affordances and so the data round-trips
 *    when the user moves back to the fork.
 *
 * Snapshots with `availability: "unavailable"` MUST set
 * `installed: false` and `enabled: false`; the runtime refuses turn
 * starts against them with a structured error.
 */
const ServerProviderAvailability = effect_Schema.Literals(["available", "unavailable"]);
const ServerProviderContinuation = effect_Schema.Struct({ groupKey: TrimmedNonEmptyString });
const ServerProviderVersionAdvisoryStatus = effect_Schema.Literals([
  "unknown",
  "current",
  "behind_latest",
]);
const ServerProviderVersionAdvisory = effect_Schema.Struct({
  status: ServerProviderVersionAdvisoryStatus,
  currentVersion: effect_Schema.NullOr(TrimmedNonEmptyString),
  latestVersion: effect_Schema.NullOr(TrimmedNonEmptyString),
  updateCommand: effect_Schema.NullOr(TrimmedNonEmptyString),
  canUpdate: effect_Schema.Boolean.pipe(
    effect_Schema.withDecodingDefault(effect_Effect.succeed(false)),
  ),
  checkedAt: effect_Schema.NullOr(IsoDateTime),
  message: effect_Schema.NullOr(TrimmedNonEmptyString),
});
const ServerProviderUpdateStatus = effect_Schema.Literals([
  "idle",
  "queued",
  "running",
  "succeeded",
  "failed",
  "unchanged",
]);
const ServerProviderUpdateState = effect_Schema.Struct({
  status: ServerProviderUpdateStatus,
  startedAt: effect_Schema.NullOr(IsoDateTime),
  finishedAt: effect_Schema.NullOr(IsoDateTime),
  message: effect_Schema.NullOr(TrimmedNonEmptyString),
  output: effect_Schema.NullOr(effect_Schema.String.check(effect_Schema.isMaxLength(1e4))),
});
const ServerProvider = effect_Schema.Struct({
  instanceId: ProviderInstanceId,
  driver: ProviderDriverKind,
  displayName: effect_Schema.optional(TrimmedNonEmptyString),
  accentColor: effect_Schema.optional(TrimmedNonEmptyString),
  badgeLabel: effect_Schema.optional(TrimmedNonEmptyString),
  continuation: effect_Schema.optional(ServerProviderContinuation),
  showInteractionModeToggle: effect_Schema.optional(effect_Schema.Boolean),
  enabled: effect_Schema.Boolean,
  installed: effect_Schema.Boolean,
  version: effect_Schema.NullOr(TrimmedNonEmptyString),
  status: ServerProviderState,
  auth: ServerProviderAuth,
  checkedAt: IsoDateTime,
  message: effect_Schema.optional(TrimmedNonEmptyString),
  availability: effect_Schema.optional(ServerProviderAvailability),
  unavailableReason: effect_Schema.optional(TrimmedNonEmptyString),
  models: effect_Schema.Array(ServerProviderModel),
  slashCommands: effect_Schema
    .Array(ServerProviderSlashCommand)
    .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed([]))),
  skills: effect_Schema
    .Array(ServerProviderSkill)
    .pipe(effect_Schema.withDecodingDefault(effect_Effect.succeed([]))),
  versionAdvisory: effect_Schema.optionalKey(ServerProviderVersionAdvisory),
  updateState: effect_Schema.optionalKey(ServerProviderUpdateState),
});
const ServerProviders = effect_Schema.Array(ServerProvider);
const ServerObservability = effect_Schema.Struct({
  logsDirectoryPath: TrimmedNonEmptyString,
  localTracingEnabled: effect_Schema.Boolean,
  otlpTracesUrl: effect_Schema.optional(TrimmedNonEmptyString),
  otlpTracesEnabled: effect_Schema.Boolean,
  otlpMetricsUrl: effect_Schema.optional(TrimmedNonEmptyString),
  otlpMetricsEnabled: effect_Schema.Boolean,
});
const ServerTraceDiagnosticsErrorKind = effect_Schema.Literals([
  "trace-file-not-found",
  "trace-file-read-failed",
]);
const ServerTraceDiagnosticsSpanSummary = effect_Schema.Struct({
  name: TrimmedNonEmptyString,
  count: NonNegativeInt,
  failureCount: NonNegativeInt,
  totalDurationMs: effect_Schema.Number,
  averageDurationMs: effect_Schema.Number,
  maxDurationMs: effect_Schema.Number,
});
const ServerTraceDiagnosticsFailureSummary = effect_Schema.Struct({
  name: TrimmedNonEmptyString,
  cause: TrimmedNonEmptyString,
  count: NonNegativeInt,
  lastSeenAt: effect_Schema.DateTimeUtc,
  traceId: TrimmedNonEmptyString,
  spanId: TrimmedNonEmptyString,
});
const ServerTraceDiagnosticsRecentFailure = effect_Schema.Struct({
  name: TrimmedNonEmptyString,
  cause: TrimmedNonEmptyString,
  durationMs: effect_Schema.Number,
  endedAt: effect_Schema.DateTimeUtc,
  traceId: TrimmedNonEmptyString,
  spanId: TrimmedNonEmptyString,
});
const ServerTraceDiagnosticsSpanOccurrence = effect_Schema.Struct({
  name: TrimmedNonEmptyString,
  durationMs: effect_Schema.Number,
  endedAt: effect_Schema.DateTimeUtc,
  traceId: TrimmedNonEmptyString,
  spanId: TrimmedNonEmptyString,
});
const ServerTraceDiagnosticsLogEvent = effect_Schema.Struct({
  spanName: TrimmedNonEmptyString,
  level: TrimmedNonEmptyString,
  message: TrimmedNonEmptyString,
  seenAt: effect_Schema.DateTimeUtc,
  traceId: TrimmedNonEmptyString,
  spanId: TrimmedNonEmptyString,
});
const ServerTraceDiagnosticsResult = effect_Schema.Struct({
  traceFilePath: TrimmedNonEmptyString,
  scannedFilePaths: effect_Schema.Array(TrimmedNonEmptyString),
  readAt: effect_Schema.DateTimeUtc,
  recordCount: NonNegativeInt,
  parseErrorCount: NonNegativeInt,
  firstSpanAt: effect_Schema.Option(effect_Schema.DateTimeUtc),
  lastSpanAt: effect_Schema.Option(effect_Schema.DateTimeUtc),
  failureCount: NonNegativeInt,
  interruptionCount: NonNegativeInt,
  slowSpanThresholdMs: NonNegativeInt,
  slowSpanCount: NonNegativeInt,
  logLevelCounts: effect_Schema.Record(TrimmedNonEmptyString, NonNegativeInt),
  topSpansByCount: effect_Schema.Array(ServerTraceDiagnosticsSpanSummary),
  slowestSpans: effect_Schema.Array(ServerTraceDiagnosticsSpanOccurrence),
  commonFailures: effect_Schema.Array(ServerTraceDiagnosticsFailureSummary),
  latestFailures: effect_Schema.Array(ServerTraceDiagnosticsRecentFailure),
  latestWarningAndErrorLogs: effect_Schema.Array(ServerTraceDiagnosticsLogEvent),
  partialFailure: effect_Schema.Option(effect_Schema.Boolean),
  error: effect_Schema.Option(
    effect_Schema.Struct({
      kind: ServerTraceDiagnosticsErrorKind,
      message: TrimmedNonEmptyString,
    }),
  ),
});
const ServerProcessSignal = effect_Schema.Literals(["SIGINT", "SIGKILL"]);
const ServerProcessDiagnosticsEntry = effect_Schema.Struct({
  pid: PositiveInt,
  ppid: NonNegativeInt,
  pgid: effect_Schema.Option(effect_Schema.Int),
  status: TrimmedNonEmptyString,
  cpuPercent: effect_Schema.Number,
  rssBytes: NonNegativeInt,
  elapsed: TrimmedNonEmptyString,
  command: TrimmedNonEmptyString,
  depth: NonNegativeInt,
  childPids: effect_Schema.Array(PositiveInt),
});
const ServerProcessDiagnosticsResult = effect_Schema.Struct({
  serverPid: PositiveInt,
  readAt: effect_Schema.DateTimeUtc,
  processCount: NonNegativeInt,
  totalRssBytes: NonNegativeInt,
  totalCpuPercent: effect_Schema.Number,
  processes: effect_Schema.Array(ServerProcessDiagnosticsEntry),
  error: effect_Schema.Option(effect_Schema.Struct({ message: TrimmedNonEmptyString })),
});
const ServerProcessResourceHistoryInput = effect_Schema.Struct({
  windowMs: NonNegativeInt,
  bucketMs: NonNegativeInt,
});
const ServerProcessResourceHistoryBucket = effect_Schema.Struct({
  startedAt: effect_Schema.DateTimeUtc,
  endedAt: effect_Schema.DateTimeUtc,
  avgCpuPercent: effect_Schema.Number,
  maxCpuPercent: effect_Schema.Number,
  maxRssBytes: NonNegativeInt,
  maxProcessCount: NonNegativeInt,
});
const ServerProcessResourceHistorySummary = effect_Schema.Struct({
  processKey: TrimmedNonEmptyString,
  pid: PositiveInt,
  ppid: NonNegativeInt,
  command: TrimmedNonEmptyString,
  depth: NonNegativeInt,
  isServerRoot: effect_Schema.Boolean,
  firstSeenAt: effect_Schema.DateTimeUtc,
  lastSeenAt: effect_Schema.DateTimeUtc,
  currentCpuPercent: effect_Schema.Number,
  avgCpuPercent: effect_Schema.Number,
  maxCpuPercent: effect_Schema.Number,
  cpuSecondsApprox: effect_Schema.Number,
  currentRssBytes: NonNegativeInt,
  maxRssBytes: NonNegativeInt,
  sampleCount: NonNegativeInt,
});
const ServerProcessResourceHistoryResult = effect_Schema.Struct({
  readAt: effect_Schema.DateTimeUtc,
  windowMs: NonNegativeInt,
  bucketMs: NonNegativeInt,
  sampleIntervalMs: NonNegativeInt,
  retainedSampleCount: NonNegativeInt,
  totalCpuSecondsApprox: effect_Schema.Number,
  buckets: effect_Schema.Array(ServerProcessResourceHistoryBucket),
  topProcesses: effect_Schema.Array(ServerProcessResourceHistorySummary),
  error: effect_Schema.Option(effect_Schema.Struct({ message: TrimmedNonEmptyString })),
});
const ServerSignalProcessInput = effect_Schema.Struct({
  pid: PositiveInt,
  signal: ServerProcessSignal,
});
const ServerSignalProcessResult = effect_Schema.Struct({
  pid: PositiveInt,
  signal: ServerProcessSignal,
  signaled: effect_Schema.Boolean,
  message: effect_Schema.Option(TrimmedNonEmptyString),
});
const ServerConfig = effect_Schema.Struct({
  environment: ExecutionEnvironmentDescriptor,
  auth: ServerAuthDescriptor,
  cwd: TrimmedNonEmptyString,
  keybindingsConfigPath: TrimmedNonEmptyString,
  keybindings: ResolvedKeybindingsConfig,
  issues: ServerConfigIssues,
  providers: ServerProviders,
  availableEditors: effect_Schema.Array(EditorId),
  observability: ServerObservability,
  settings: ServerSettings,
});
const ServerUpsertKeybindingReplaceTarget = effect_Schema.Struct({
  key: KeybindingValue,
  command: KeybindingCommand,
  when: effect_Schema.optional(KeybindingWhen),
});
const ServerUpsertKeybindingInput = effect_Schema.Struct({
  key: KeybindingValue,
  command: KeybindingCommand,
  when: effect_Schema.optional(KeybindingWhen),
  replace: effect_Schema.optional(ServerUpsertKeybindingReplaceTarget),
});
const ServerRemoveKeybindingInput = ServerUpsertKeybindingReplaceTarget;
const ServerUpsertKeybindingResult = effect_Schema.Struct({
  keybindings: ResolvedKeybindingsConfig,
  issues: ServerConfigIssues,
});
const ServerRemoveKeybindingResult = ServerUpsertKeybindingResult;
const ServerConfigUpdatedPayload = effect_Schema.Struct({
  issues: ServerConfigIssues,
  providers: ServerProviders,
  settings: effect_Schema.optional(ServerSettings),
});
const ServerConfigKeybindingsUpdatedPayload = effect_Schema.Struct({
  keybindings: ResolvedKeybindingsConfig,
  issues: ServerConfigIssues,
});
const ServerConfigProviderStatusesPayload = effect_Schema.Struct({ providers: ServerProviders });
const ServerConfigSettingsUpdatedPayload = effect_Schema.Struct({ settings: ServerSettings });
const ServerConfigStreamSnapshotEvent = effect_Schema.Struct({
  version: effect_Schema.Literal(1),
  type: effect_Schema.Literal("snapshot"),
  config: ServerConfig,
});
const ServerConfigStreamKeybindingsUpdatedEvent = effect_Schema.Struct({
  version: effect_Schema.Literal(1),
  type: effect_Schema.Literal("keybindingsUpdated"),
  payload: ServerConfigKeybindingsUpdatedPayload,
});
const ServerConfigStreamProviderStatusesEvent = effect_Schema.Struct({
  version: effect_Schema.Literal(1),
  type: effect_Schema.Literal("providerStatuses"),
  payload: ServerConfigProviderStatusesPayload,
});
const ServerConfigStreamSettingsUpdatedEvent = effect_Schema.Struct({
  version: effect_Schema.Literal(1),
  type: effect_Schema.Literal("settingsUpdated"),
  payload: ServerConfigSettingsUpdatedPayload,
});
const ServerConfigStreamEvent = effect_Schema.Union([
  ServerConfigStreamSnapshotEvent,
  ServerConfigStreamKeybindingsUpdatedEvent,
  ServerConfigStreamProviderStatusesEvent,
  ServerConfigStreamSettingsUpdatedEvent,
]);
const ServerLifecycleReadyPayload = effect_Schema.Struct({
  at: IsoDateTime,
  environment: ExecutionEnvironmentDescriptor,
});
const ServerLifecycleWelcomePayload = effect_Schema.Struct({
  environment: ExecutionEnvironmentDescriptor,
  cwd: TrimmedNonEmptyString,
  projectName: TrimmedNonEmptyString,
  bootstrapProjectId: effect_Schema.optional(ProjectId),
  bootstrapThreadId: effect_Schema.optional(ThreadId),
});
const ServerLifecycleStreamWelcomeEvent = effect_Schema.Struct({
  version: effect_Schema.Literal(1),
  sequence: NonNegativeInt,
  type: effect_Schema.Literal("welcome"),
  payload: ServerLifecycleWelcomePayload,
});
const ServerLifecycleStreamReadyEvent = effect_Schema.Struct({
  version: effect_Schema.Literal(1),
  sequence: NonNegativeInt,
  type: effect_Schema.Literal("ready"),
  payload: ServerLifecycleReadyPayload,
});
const ServerLifecycleStreamEvent = effect_Schema.Union([
  ServerLifecycleStreamWelcomeEvent,
  ServerLifecycleStreamReadyEvent,
]);
const ServerProviderUpdatedPayload = effect_Schema.Struct({ providers: ServerProviders });
const ServerProviderUpdateInput = effect_Schema.Struct({
  provider: ProviderDriverKind,
  instanceId: effect_Schema.optionalKey(ProviderInstanceId),
});
var ServerProviderUpdateError = class extends effect_Schema.TaggedErrorClass()(
  "ServerProviderUpdateError",
  {
    provider: ProviderDriverKind,
    reason: TrimmedNonEmptyString,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {
  get message() {
    return `Provider update failed for ${this.provider}: ${this.reason}`;
  }
};

//#endregion
//#region ../../packages/contracts/src/vcs.ts
const VcsDriverKind = effect_Schema.Literals(["git", "jj", "unknown"]);
const VcsFreshnessSource = effect_Schema.Literals([
  "live-local",
  "cached-local",
  "cached-remote",
  "explicit-remote",
]);
const VcsFreshness = effect_Schema.Struct({
  source: VcsFreshnessSource,
  observedAt: effect_Schema.DateTimeUtc,
  expiresAt: effect_Schema.Option(effect_Schema.DateTimeUtc),
});
const VcsDriverCapabilities = effect_Schema.Struct({
  kind: VcsDriverKind,
  supportsWorktrees: effect_Schema.Boolean,
  supportsBookmarks: effect_Schema.Boolean,
  supportsAtomicSnapshot: effect_Schema.Boolean,
  supportsPushDefaultRemote: effect_Schema.Boolean,
  ignoreClassifier: effect_Schema.Literals(["native", "git-compatible-fallback"]),
});
const VcsRepositoryIdentity = effect_Schema.Struct({
  kind: VcsDriverKind,
  rootPath: TrimmedNonEmptyString,
  metadataPath: effect_Schema.NullOr(TrimmedNonEmptyString),
  freshness: VcsFreshness,
});
const VcsListWorkspaceFilesResult = effect_Schema.Struct({
  paths: effect_Schema.Array(TrimmedNonEmptyString),
  truncated: effect_Schema.Boolean,
  freshness: VcsFreshness,
});
const VcsRemote = effect_Schema.Struct({
  name: TrimmedNonEmptyString,
  url: TrimmedNonEmptyString,
  pushUrl: effect_Schema.Option(TrimmedNonEmptyString),
  isPrimary: effect_Schema.Boolean,
});
const VcsListRemotesResult = effect_Schema.Struct({
  remotes: effect_Schema.Array(VcsRemote),
  freshness: VcsFreshness,
});
var VcsProcessSpawnError = class VcsProcessSpawnError extends effect_Schema.TaggedErrorClass()(
  "VcsProcessSpawnError",
  {
    operation: effect_Schema.String,
    command: effect_Schema.String,
    cwd: effect_Schema.String,
    cause: effect_Schema.Defect,
  },
) {
  get message() {
    return `VCS process failed to spawn in ${this.operation}: ${this.command} (${this.cwd})`;
  }
  static fromProcessSpawnError(context, error) {
    return new VcsProcessSpawnError({
      ...context,
      cause: error.cause,
    });
  }
};
var VcsProcessExitError = class extends effect_Schema.TaggedErrorClass()("VcsProcessExitError", {
  operation: effect_Schema.String,
  command: effect_Schema.String,
  cwd: effect_Schema.String,
  exitCode: effect_Schema.Number,
  detail: effect_Schema.String,
}) {
  get message() {
    return `VCS process failed in ${this.operation}: ${this.command} (${this.cwd}) exited with ${this.exitCode} - ${this.detail}`;
  }
};
var VcsProcessTimeoutError = class VcsProcessTimeoutError extends effect_Schema.TaggedErrorClass()(
  "VcsProcessTimeoutError",
  {
    operation: effect_Schema.String,
    command: effect_Schema.String,
    cwd: effect_Schema.String,
    timeoutMs: effect_Schema.Number,
  },
) {
  get message() {
    return `VCS process timed out in ${this.operation}: ${this.command} (${this.cwd}) after ${this.timeoutMs}ms`;
  }
  static fromProcessTimeoutError(context, error) {
    return new VcsProcessTimeoutError({
      ...context,
      timeoutMs: error.timeoutMs,
    });
  }
};
var VcsOutputDecodeError = class VcsOutputDecodeError extends effect_Schema.TaggedErrorClass()(
  "VcsOutputDecodeError",
  {
    operation: effect_Schema.String,
    command: effect_Schema.String,
    cwd: effect_Schema.String,
    detail: effect_Schema.String,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {
  get message() {
    return `VCS output decode failed in ${this.operation}: ${this.command} (${this.cwd}) - ${this.detail}`;
  }
  static fromProcessStdinError(context, error) {
    return new VcsOutputDecodeError({
      ...context,
      detail: "failed to write process stdin",
      cause: error.cause,
    });
  }
  static fromProcessReadError(context, error) {
    return new VcsOutputDecodeError({
      ...context,
      detail:
        error.stream === "exitCode"
          ? "failed to read process exit code"
          : `failed to read process ${error.stream}`,
      cause: error.cause,
    });
  }
  static fromProcessOutputLimitError(context, error) {
    return new VcsOutputDecodeError({
      ...context,
      detail: `process ${error.stream} exceeded ${error.maxBytes} bytes`,
    });
  }
  static missingExitCode(context) {
    return new VcsOutputDecodeError({
      ...context,
      detail: "process completed without an exit code",
    });
  }
};
var VcsRepositoryDetectionError = class extends effect_Schema.TaggedErrorClass()(
  "VcsRepositoryDetectionError",
  {
    operation: effect_Schema.String,
    cwd: effect_Schema.String,
    detail: effect_Schema.String,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {
  get message() {
    return `VCS repository detection failed in ${this.operation}: ${this.cwd} - ${this.detail}`;
  }
};
var VcsUnsupportedOperationError = class extends effect_Schema.TaggedErrorClass()(
  "VcsUnsupportedOperationError",
  {
    operation: effect_Schema.String,
    kind: VcsDriverKind,
    detail: effect_Schema.String,
  },
) {
  get message() {
    return `VCS operation is unsupported for ${this.kind} in ${this.operation}: ${this.detail}`;
  }
};
const VcsError = effect_Schema.Union([
  VcsProcessSpawnError,
  VcsProcessExitError,
  VcsProcessTimeoutError,
  VcsOutputDecodeError,
  VcsRepositoryDetectionError,
  VcsUnsupportedOperationError,
]);

//#endregion
//#region ../../packages/contracts/src/sourceControl.ts
const SourceControlProviderKind = effect_Schema.Literals([
  "github",
  "gitlab",
  "azure-devops",
  "bitbucket",
  "unknown",
]);
const SourceControlProviderInfo = effect_Schema.Struct({
  kind: SourceControlProviderKind,
  name: TrimmedNonEmptyString,
  baseUrl: effect_Schema.String,
});
const ChangeRequestState = effect_Schema.Literals(["open", "closed", "merged"]);
const ChangeRequest = effect_Schema.Struct({
  provider: SourceControlProviderKind,
  number: PositiveInt,
  title: TrimmedNonEmptyString,
  url: effect_Schema.String,
  baseRefName: TrimmedNonEmptyString,
  headRefName: TrimmedNonEmptyString,
  state: ChangeRequestState,
  updatedAt: effect_Schema.Option(effect_Schema.DateTimeUtc),
  isCrossRepository: effect_Schema.optional(effect_Schema.Boolean),
  headRepositoryNameWithOwner: effect_Schema.optional(effect_Schema.NullOr(TrimmedNonEmptyString)),
  headRepositoryOwnerLogin: effect_Schema.optional(effect_Schema.NullOr(TrimmedNonEmptyString)),
});
const SourceControlRepositoryCloneUrls = effect_Schema.Struct({
  nameWithOwner: TrimmedNonEmptyString,
  url: TrimmedNonEmptyString,
  sshUrl: TrimmedNonEmptyString,
});
const SourceControlRepositoryVisibility = effect_Schema.Literals(["private", "public"]);
const SourceControlCloneProtocol = effect_Schema.Literals(["auto", "ssh", "https"]);
const SourceControlRepositoryInfo = effect_Schema.Struct({
  provider: SourceControlProviderKind,
  nameWithOwner: TrimmedNonEmptyString,
  url: TrimmedNonEmptyString,
  sshUrl: TrimmedNonEmptyString,
});
const SourceControlRepositoryLookupInput = effect_Schema.Struct({
  provider: SourceControlProviderKind,
  repository: TrimmedNonEmptyString,
  cwd: effect_Schema.optional(TrimmedNonEmptyString),
});
const SourceControlCloneRepositoryInput = effect_Schema.Struct({
  provider: effect_Schema.optional(SourceControlProviderKind),
  repository: effect_Schema.optional(TrimmedNonEmptyString),
  remoteUrl: effect_Schema.optional(TrimmedNonEmptyString),
  destinationPath: TrimmedNonEmptyString,
  protocol: effect_Schema.optional(SourceControlCloneProtocol),
});
const SourceControlCloneRepositoryResult = effect_Schema.Struct({
  cwd: TrimmedNonEmptyString,
  remoteUrl: TrimmedNonEmptyString,
  repository: effect_Schema.NullOr(SourceControlRepositoryInfo),
});
const SourceControlPublishRepositoryInput = effect_Schema.Struct({
  cwd: TrimmedNonEmptyString,
  provider: SourceControlProviderKind,
  repository: TrimmedNonEmptyString,
  visibility: SourceControlRepositoryVisibility,
  remoteName: effect_Schema.optional(TrimmedNonEmptyString),
  protocol: effect_Schema.optional(SourceControlCloneProtocol),
});
const SourceControlPublishStatus = effect_Schema.Literals(["pushed", "remote_added"]);
const SourceControlPublishRepositoryResult = effect_Schema.Struct({
  repository: SourceControlRepositoryInfo,
  remoteName: TrimmedNonEmptyString,
  remoteUrl: TrimmedNonEmptyString,
  branch: TrimmedNonEmptyString,
  upstreamBranch: effect_Schema.optional(TrimmedNonEmptyString),
  status: SourceControlPublishStatus,
});
const SourceControlDiscoveryStatus = effect_Schema.Literals(["available", "missing"]);
const SourceControlProviderAuthStatus = effect_Schema.Literals([
  "authenticated",
  "unauthenticated",
  "unknown",
]);
const SourceControlProviderAuth = effect_Schema.Struct({
  status: SourceControlProviderAuthStatus,
  account: effect_Schema.Option(TrimmedNonEmptyString),
  host: effect_Schema.Option(TrimmedNonEmptyString),
  detail: effect_Schema.Option(TrimmedNonEmptyString),
});
const SourceControlDiscoverySharedFields = {
  label: TrimmedNonEmptyString,
  executable: effect_Schema.optional(TrimmedNonEmptyString),
  status: SourceControlDiscoveryStatus,
  version: effect_Schema.Option(TrimmedNonEmptyString),
  installHint: TrimmedNonEmptyString,
  detail: effect_Schema.Option(TrimmedNonEmptyString),
};
const VcsDiscoveryItem = effect_Schema.Struct({
  kind: VcsDriverKind,
  implemented: effect_Schema.Boolean,
  ...SourceControlDiscoverySharedFields,
});
const SourceControlProviderDiscoveryItem = effect_Schema.Struct({
  kind: SourceControlProviderKind,
  ...SourceControlDiscoverySharedFields,
  auth: SourceControlProviderAuth,
});
const SourceControlDiscoveryResult = effect_Schema.Struct({
  versionControlSystems: effect_Schema.Array(VcsDiscoveryItem),
  sourceControlProviders: effect_Schema.Array(SourceControlProviderDiscoveryItem),
});
var SourceControlProviderError = class extends effect_Schema.TaggedErrorClass()(
  "SourceControlProviderError",
  {
    provider: SourceControlProviderKind,
    operation: effect_Schema.String,
    detail: effect_Schema.String,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {
  get message() {
    return `Source control provider ${this.provider} failed in ${this.operation}: ${this.detail}`;
  }
};
var SourceControlRepositoryError = class extends effect_Schema.TaggedErrorClass()(
  "SourceControlRepositoryError",
  {
    provider: SourceControlProviderKind,
    operation: effect_Schema.String,
    detail: effect_Schema.String,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {
  get message() {
    return `Source control repository operation ${this.operation} failed for ${this.provider}: ${this.detail}`;
  }
};

//#endregion
//#region ../../packages/contracts/src/git.ts
const TrimmedNonEmptyStringSchema = TrimmedNonEmptyString;
const GIT_LIST_BRANCHES_MAX_LIMIT = 200;
const GitStackedAction = effect_Schema.Literals([
  "commit",
  "push",
  "create_pr",
  "commit_push",
  "commit_push_pr",
]);
const GitActionProgressPhase = effect_Schema.Literals(["branch", "commit", "push", "pr"]);
const GitActionProgressKind = effect_Schema.Literals([
  "action_started",
  "phase_started",
  "hook_started",
  "hook_output",
  "hook_finished",
  "action_finished",
  "action_failed",
]);
const GitActionProgressStream = effect_Schema.Literals(["stdout", "stderr"]);
const GitCommitStepStatus = effect_Schema.Literals([
  "created",
  "skipped_no_changes",
  "skipped_not_requested",
]);
const GitPushStepStatus = effect_Schema.Literals([
  "pushed",
  "skipped_not_requested",
  "skipped_up_to_date",
]);
const GitBranchStepStatus = effect_Schema.Literals(["created", "skipped_not_requested"]);
const GitPrStepStatus = effect_Schema.Literals([
  "created",
  "opened_existing",
  "skipped_not_requested",
]);
const VcsStatusChangeRequestState = effect_Schema.Literals(["open", "closed", "merged"]);
const GitPullRequestReference = TrimmedNonEmptyStringSchema;
const GitPullRequestState = effect_Schema.Literals(["open", "closed", "merged"]);
const GitPreparePullRequestThreadMode = effect_Schema.Literals(["local", "worktree"]);
const GitRunStackedActionToastRunAction = effect_Schema.Struct({ kind: GitStackedAction });
const GitRunStackedActionToastCta = effect_Schema.Union([
  effect_Schema.Struct({ kind: effect_Schema.Literal("none") }),
  effect_Schema.Struct({
    kind: effect_Schema.Literal("open_pr"),
    label: TrimmedNonEmptyStringSchema,
    url: effect_Schema.String,
  }),
  effect_Schema.Struct({
    kind: effect_Schema.Literal("run_action"),
    label: TrimmedNonEmptyStringSchema,
    action: GitRunStackedActionToastRunAction,
  }),
]);
const GitRunStackedActionToast = effect_Schema.Struct({
  title: TrimmedNonEmptyStringSchema,
  description: effect_Schema.optional(TrimmedNonEmptyStringSchema),
  cta: GitRunStackedActionToastCta,
});
const VcsRef = effect_Schema.Struct({
  name: TrimmedNonEmptyStringSchema,
  isRemote: effect_Schema.optional(effect_Schema.Boolean),
  remoteName: effect_Schema.optional(TrimmedNonEmptyStringSchema),
  current: effect_Schema.Boolean,
  isDefault: effect_Schema.Boolean,
  worktreePath: TrimmedNonEmptyStringSchema.pipe(effect_Schema.NullOr),
});
const VcsWorktree = effect_Schema.Struct({
  path: TrimmedNonEmptyStringSchema,
  refName: TrimmedNonEmptyStringSchema,
});
const GitResolvedPullRequest = effect_Schema.Struct({
  number: PositiveInt,
  title: TrimmedNonEmptyStringSchema,
  url: effect_Schema.String,
  baseBranch: TrimmedNonEmptyStringSchema,
  headBranch: TrimmedNonEmptyStringSchema,
  state: GitPullRequestState,
});
const VcsStatusInput = effect_Schema.Struct({ cwd: TrimmedNonEmptyStringSchema });
const VcsPullInput = effect_Schema.Struct({ cwd: TrimmedNonEmptyStringSchema });
const GitRunStackedActionInput = effect_Schema.Struct({
  actionId: TrimmedNonEmptyStringSchema,
  cwd: TrimmedNonEmptyStringSchema,
  action: GitStackedAction,
  commitMessage: effect_Schema.optional(
    TrimmedNonEmptyStringSchema.check(effect_Schema.isMaxLength(1e4)),
  ),
  featureBranch: effect_Schema.optional(effect_Schema.Boolean),
  filePaths: effect_Schema.optional(
    effect_Schema.Array(TrimmedNonEmptyStringSchema).check(effect_Schema.isMinLength(1)),
  ),
});
const VcsListRefsInput = effect_Schema.Struct({
  cwd: TrimmedNonEmptyStringSchema,
  query: effect_Schema.optional(TrimmedNonEmptyStringSchema.check(effect_Schema.isMaxLength(256))),
  cursor: effect_Schema.optional(NonNegativeInt),
  limit: effect_Schema.optional(
    PositiveInt.check(effect_Schema.isLessThanOrEqualTo(GIT_LIST_BRANCHES_MAX_LIMIT)),
  ),
});
const VcsCreateWorktreeInput = effect_Schema.Struct({
  cwd: TrimmedNonEmptyStringSchema,
  refName: TrimmedNonEmptyStringSchema,
  newRefName: effect_Schema.optional(TrimmedNonEmptyStringSchema),
  path: effect_Schema.NullOr(TrimmedNonEmptyStringSchema),
});
const GitPullRequestRefInput = effect_Schema.Struct({
  cwd: TrimmedNonEmptyStringSchema,
  reference: GitPullRequestReference,
});
const GitPreparePullRequestThreadInput = effect_Schema.Struct({
  cwd: TrimmedNonEmptyStringSchema,
  reference: GitPullRequestReference,
  mode: GitPreparePullRequestThreadMode,
  threadId: effect_Schema.optional(ThreadId),
});
const VcsRemoveWorktreeInput = effect_Schema.Struct({
  cwd: TrimmedNonEmptyStringSchema,
  path: TrimmedNonEmptyStringSchema,
  force: effect_Schema.optional(effect_Schema.Boolean),
});
const VcsCreateRefInput = effect_Schema.Struct({
  cwd: TrimmedNonEmptyStringSchema,
  refName: TrimmedNonEmptyStringSchema,
  switchRef: effect_Schema.optional(effect_Schema.Boolean),
});
const VcsCreateRefResult = effect_Schema.Struct({ refName: TrimmedNonEmptyStringSchema });
const VcsSwitchRefInput = effect_Schema.Struct({
  cwd: TrimmedNonEmptyStringSchema,
  refName: TrimmedNonEmptyStringSchema,
});
const VcsInitInput = effect_Schema.Struct({
  cwd: TrimmedNonEmptyStringSchema,
  kind: effect_Schema.optional(VcsDriverKind),
});
const VcsStatusChangeRequest = effect_Schema.Struct({
  number: PositiveInt,
  title: TrimmedNonEmptyStringSchema,
  url: effect_Schema.String,
  baseRef: TrimmedNonEmptyStringSchema,
  headRef: TrimmedNonEmptyStringSchema,
  state: VcsStatusChangeRequestState,
});
const VcsStatusLocalShape = {
  isRepo: effect_Schema.Boolean,
  sourceControlProvider: effect_Schema.optional(SourceControlProviderInfo),
  hasPrimaryRemote: effect_Schema.Boolean,
  isDefaultRef: effect_Schema.Boolean,
  refName: effect_Schema.NullOr(TrimmedNonEmptyStringSchema),
  hasWorkingTreeChanges: effect_Schema.Boolean,
  workingTree: effect_Schema.Struct({
    files: effect_Schema.Array(
      effect_Schema.Struct({
        path: TrimmedNonEmptyStringSchema,
        insertions: NonNegativeInt,
        deletions: NonNegativeInt,
      }),
    ),
    insertions: NonNegativeInt,
    deletions: NonNegativeInt,
  }),
};
const VcsStatusRemoteShape = {
  hasUpstream: effect_Schema.Boolean,
  aheadCount: NonNegativeInt,
  behindCount: NonNegativeInt,
  aheadOfDefaultCount: effect_Schema.optional(NonNegativeInt),
  pr: effect_Schema.NullOr(VcsStatusChangeRequest),
};
const VcsStatusLocalResult = effect_Schema.Struct(VcsStatusLocalShape);
const VcsStatusRemoteResult = effect_Schema.Struct(VcsStatusRemoteShape);
const VcsStatusResult = effect_Schema.Struct({
  ...VcsStatusLocalShape,
  ...VcsStatusRemoteShape,
});
const VcsStatusStreamEvent = effect_Schema.Union([
  effect_Schema.TaggedStruct("snapshot", {
    local: VcsStatusLocalResult,
    remote: effect_Schema.NullOr(VcsStatusRemoteResult),
  }),
  effect_Schema.TaggedStruct("localUpdated", { local: VcsStatusLocalResult }),
  effect_Schema.TaggedStruct("remoteUpdated", {
    remote: effect_Schema.NullOr(VcsStatusRemoteResult),
  }),
]);
const VcsListRefsResult = effect_Schema.Struct({
  refs: effect_Schema.Array(VcsRef),
  isRepo: effect_Schema.Boolean,
  hasPrimaryRemote: effect_Schema.Boolean,
  nextCursor: NonNegativeInt.pipe(effect_Schema.NullOr),
  totalCount: NonNegativeInt,
});
const VcsCreateWorktreeResult = effect_Schema.Struct({ worktree: VcsWorktree });
const GitResolvePullRequestResult = effect_Schema.Struct({ pullRequest: GitResolvedPullRequest });
const GitPreparePullRequestThreadResult = effect_Schema.Struct({
  pullRequest: GitResolvedPullRequest,
  branch: TrimmedNonEmptyStringSchema,
  worktreePath: TrimmedNonEmptyStringSchema.pipe(effect_Schema.NullOr),
});
const VcsSwitchRefResult = effect_Schema.Struct({
  refName: effect_Schema.NullOr(TrimmedNonEmptyStringSchema),
});
const GitRunStackedActionResult = effect_Schema.Struct({
  action: GitStackedAction,
  branch: effect_Schema.Struct({
    status: GitBranchStepStatus,
    name: effect_Schema.optional(TrimmedNonEmptyStringSchema),
  }),
  commit: effect_Schema.Struct({
    status: GitCommitStepStatus,
    commitSha: effect_Schema.optional(TrimmedNonEmptyStringSchema),
    subject: effect_Schema.optional(TrimmedNonEmptyStringSchema),
  }),
  push: effect_Schema.Struct({
    status: GitPushStepStatus,
    branch: effect_Schema.optional(TrimmedNonEmptyStringSchema),
    upstreamBranch: effect_Schema.optional(TrimmedNonEmptyStringSchema),
    setUpstream: effect_Schema.optional(effect_Schema.Boolean),
  }),
  pr: effect_Schema.Struct({
    status: GitPrStepStatus,
    url: effect_Schema.optional(effect_Schema.String),
    number: effect_Schema.optional(PositiveInt),
    baseBranch: effect_Schema.optional(TrimmedNonEmptyStringSchema),
    headBranch: effect_Schema.optional(TrimmedNonEmptyStringSchema),
    title: effect_Schema.optional(TrimmedNonEmptyStringSchema),
  }),
  toast: GitRunStackedActionToast,
});
const VcsPullResult = effect_Schema.Struct({
  status: effect_Schema.Literals(["pulled", "skipped_up_to_date"]),
  refName: TrimmedNonEmptyStringSchema,
  upstreamRef: TrimmedNonEmptyStringSchema.pipe(effect_Schema.NullOr),
});
var GitCommandError = class extends effect_Schema.TaggedErrorClass()("GitCommandError", {
  operation: effect_Schema.String,
  command: effect_Schema.String,
  cwd: effect_Schema.String,
  detail: effect_Schema.String,
  cause: effect_Schema.optional(effect_Schema.Defect),
}) {
  get message() {
    return `Git command failed in ${this.operation}: ${this.command} (${this.cwd}) - ${this.detail}`;
  }
};
var TextGenerationError = class extends effect_Schema.TaggedErrorClass()("TextGenerationError", {
  operation: effect_Schema.String,
  detail: effect_Schema.String,
  cause: effect_Schema.optional(effect_Schema.Defect),
}) {
  get message() {
    return `Text generation failed in ${this.operation}: ${this.detail}`;
  }
};
var GitManagerError = class extends effect_Schema.TaggedErrorClass()("GitManagerError", {
  operation: effect_Schema.String,
  detail: effect_Schema.String,
  cause: effect_Schema.optional(effect_Schema.Defect),
}) {
  get message() {
    return `Git manager failed in ${this.operation}: ${this.detail}`;
  }
};
const GitManagerServiceError = effect_Schema.Union([
  GitManagerError,
  GitCommandError,
  SourceControlProviderError,
  TextGenerationError,
]);
const GitActionProgressBase = effect_Schema.Struct({
  actionId: TrimmedNonEmptyStringSchema,
  cwd: TrimmedNonEmptyStringSchema,
  action: GitStackedAction,
});
const GitActionStartedEvent = effect_Schema.Struct({
  ...GitActionProgressBase.fields,
  kind: effect_Schema.Literal("action_started"),
  phases: effect_Schema.Array(GitActionProgressPhase),
});
const GitActionPhaseStartedEvent = effect_Schema.Struct({
  ...GitActionProgressBase.fields,
  kind: effect_Schema.Literal("phase_started"),
  phase: GitActionProgressPhase,
  label: TrimmedNonEmptyStringSchema,
});
const GitActionHookStartedEvent = effect_Schema.Struct({
  ...GitActionProgressBase.fields,
  kind: effect_Schema.Literal("hook_started"),
  hookName: TrimmedNonEmptyStringSchema,
});
const GitActionHookOutputEvent = effect_Schema.Struct({
  ...GitActionProgressBase.fields,
  kind: effect_Schema.Literal("hook_output"),
  hookName: effect_Schema.NullOr(TrimmedNonEmptyStringSchema),
  stream: GitActionProgressStream,
  text: TrimmedNonEmptyStringSchema,
});
const GitActionHookFinishedEvent = effect_Schema.Struct({
  ...GitActionProgressBase.fields,
  kind: effect_Schema.Literal("hook_finished"),
  hookName: TrimmedNonEmptyStringSchema,
  exitCode: effect_Schema.NullOr(effect_Schema.Int),
  durationMs: effect_Schema.NullOr(NonNegativeInt),
});
const GitActionFinishedEvent = effect_Schema.Struct({
  ...GitActionProgressBase.fields,
  kind: effect_Schema.Literal("action_finished"),
  result: GitRunStackedActionResult,
});
const GitActionFailedEvent = effect_Schema.Struct({
  ...GitActionProgressBase.fields,
  kind: effect_Schema.Literal("action_failed"),
  phase: effect_Schema.NullOr(GitActionProgressPhase),
  message: TrimmedNonEmptyStringSchema,
});
const GitActionProgressEvent = effect_Schema.Union([
  GitActionStartedEvent,
  GitActionPhaseStartedEvent,
  GitActionHookStartedEvent,
  GitActionHookOutputEvent,
  GitActionHookFinishedEvent,
  GitActionFinishedEvent,
  GitActionFailedEvent,
]);

//#endregion
//#region ../../packages/contracts/src/project.ts
const PROJECT_SEARCH_ENTRIES_MAX_LIMIT = 200;
const PROJECT_WRITE_FILE_PATH_MAX_LENGTH = 512;
const ProjectSearchEntriesInput = effect_Schema.Struct({
  cwd: TrimmedNonEmptyString,
  query: TrimmedNonEmptyString.check(effect_Schema.isMaxLength(256)),
  limit: PositiveInt.check(effect_Schema.isLessThanOrEqualTo(PROJECT_SEARCH_ENTRIES_MAX_LIMIT)),
});
const ProjectEntryKind = effect_Schema.Literals(["file", "directory"]);
const ProjectEntry = effect_Schema.Struct({
  path: TrimmedNonEmptyString,
  kind: ProjectEntryKind,
  parentPath: effect_Schema.optional(TrimmedNonEmptyString),
});
const ProjectSearchEntriesResult = effect_Schema.Struct({
  entries: effect_Schema.Array(ProjectEntry),
  truncated: effect_Schema.Boolean,
});
var ProjectSearchEntriesError = class extends effect_Schema.TaggedErrorClass()(
  "ProjectSearchEntriesError",
  {
    message: TrimmedNonEmptyString,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {};
const ProjectWriteFileInput = effect_Schema.Struct({
  cwd: TrimmedNonEmptyString,
  relativePath: TrimmedNonEmptyString.check(
    effect_Schema.isMaxLength(PROJECT_WRITE_FILE_PATH_MAX_LENGTH),
  ),
  contents: effect_Schema.String,
});
const ProjectWriteFileResult = effect_Schema.Struct({ relativePath: TrimmedNonEmptyString });
var ProjectWriteFileError = class extends effect_Schema.TaggedErrorClass()(
  "ProjectWriteFileError",
  {
    message: TrimmedNonEmptyString,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {};

//#endregion
//#region ../../packages/contracts/src/filesystem.ts
const FILESYSTEM_PATH_MAX_LENGTH = 512;
const FilesystemBrowseInput = effect_Schema.Struct({
  partialPath: TrimmedNonEmptyString.check(effect_Schema.isMaxLength(FILESYSTEM_PATH_MAX_LENGTH)),
  cwd: effect_Schema.optional(
    TrimmedNonEmptyString.check(effect_Schema.isMaxLength(FILESYSTEM_PATH_MAX_LENGTH)),
  ),
});
const FilesystemBrowseEntry = effect_Schema.Struct({
  name: TrimmedNonEmptyString,
  fullPath: TrimmedNonEmptyString,
});
const FilesystemBrowseResult = effect_Schema.Struct({
  parentPath: TrimmedNonEmptyString,
  entries: effect_Schema.Array(FilesystemBrowseEntry),
});
var FilesystemBrowseError = class extends effect_Schema.TaggedErrorClass()(
  "FilesystemBrowseError",
  {
    message: TrimmedNonEmptyString,
    cause: effect_Schema.optional(effect_Schema.Defect),
  },
) {};

//#endregion
//#region ../../packages/contracts/src/rpc.ts
const WS_METHODS = {
  projectsList: "projects.list",
  projectsAdd: "projects.add",
  projectsRemove: "projects.remove",
  projectsSearchEntries: "projects.searchEntries",
  projectsWriteFile: "projects.writeFile",
  shellOpenInEditor: "shell.openInEditor",
  filesystemBrowse: "filesystem.browse",
  vcsPull: "vcs.pull",
  vcsRefreshStatus: "vcs.refreshStatus",
  vcsListRefs: "vcs.listRefs",
  vcsCreateWorktree: "vcs.createWorktree",
  vcsRemoveWorktree: "vcs.removeWorktree",
  vcsCreateRef: "vcs.createRef",
  vcsSwitchRef: "vcs.switchRef",
  vcsInit: "vcs.init",
  gitRunStackedAction: "git.runStackedAction",
  gitResolvePullRequest: "git.resolvePullRequest",
  gitPreparePullRequestThread: "git.preparePullRequestThread",
  terminalOpen: "terminal.open",
  terminalWrite: "terminal.write",
  terminalResize: "terminal.resize",
  terminalClear: "terminal.clear",
  terminalRestart: "terminal.restart",
  terminalClose: "terminal.close",
  serverGetConfig: "server.getConfig",
  serverRefreshProviders: "server.refreshProviders",
  serverUpdateProvider: "server.updateProvider",
  serverUpsertKeybinding: "server.upsertKeybinding",
  serverRemoveKeybinding: "server.removeKeybinding",
  serverGetSettings: "server.getSettings",
  serverUpdateSettings: "server.updateSettings",
  serverDiscoverSourceControl: "server.discoverSourceControl",
  serverGetTraceDiagnostics: "server.getTraceDiagnostics",
  serverGetProcessDiagnostics: "server.getProcessDiagnostics",
  serverGetProcessResourceHistory: "server.getProcessResourceHistory",
  serverSignalProcess: "server.signalProcess",
  sourceControlLookupRepository: "sourceControl.lookupRepository",
  sourceControlCloneRepository: "sourceControl.cloneRepository",
  sourceControlPublishRepository: "sourceControl.publishRepository",
  subscribeVcsStatus: "subscribeVcsStatus",
  subscribeTerminalEvents: "subscribeTerminalEvents",
  subscribeServerConfig: "subscribeServerConfig",
  subscribeServerLifecycle: "subscribeServerLifecycle",
  subscribeAuthAccess: "subscribeAuthAccess",
};
const WsServerUpsertKeybindingRpc = effect_unstable_rpc_Rpc.make(
  WS_METHODS.serverUpsertKeybinding,
  {
    payload: ServerUpsertKeybindingInput,
    success: ServerUpsertKeybindingResult,
    error: KeybindingsConfigError,
  },
);
const WsServerRemoveKeybindingRpc = effect_unstable_rpc_Rpc.make(
  WS_METHODS.serverRemoveKeybinding,
  {
    payload: ServerRemoveKeybindingInput,
    success: ServerRemoveKeybindingResult,
    error: KeybindingsConfigError,
  },
);
const WsServerGetConfigRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.serverGetConfig, {
  payload: effect_Schema.Struct({}),
  success: ServerConfig,
  error: effect_Schema.Union([KeybindingsConfigError, ServerSettingsError]),
});
const WsServerRefreshProvidersRpc = effect_unstable_rpc_Rpc.make(
  WS_METHODS.serverRefreshProviders,
  {
    payload: effect_Schema.Struct({ instanceId: effect_Schema.optional(ProviderInstanceId) }),
    success: ServerProviderUpdatedPayload,
  },
);
const WsServerUpdateProviderRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.serverUpdateProvider, {
  payload: ServerProviderUpdateInput,
  success: ServerProviderUpdatedPayload,
  error: ServerProviderUpdateError,
});
const WsServerGetSettingsRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.serverGetSettings, {
  payload: effect_Schema.Struct({}),
  success: ServerSettings,
  error: ServerSettingsError,
});
const WsServerUpdateSettingsRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.serverUpdateSettings, {
  payload: effect_Schema.Struct({ patch: ServerSettingsPatch }),
  success: ServerSettings,
  error: ServerSettingsError,
});
const WsServerDiscoverSourceControlRpc = effect_unstable_rpc_Rpc.make(
  WS_METHODS.serverDiscoverSourceControl,
  {
    payload: effect_Schema.Struct({}),
    success: SourceControlDiscoveryResult,
  },
);
const WsServerGetTraceDiagnosticsRpc = effect_unstable_rpc_Rpc.make(
  WS_METHODS.serverGetTraceDiagnostics,
  {
    payload: effect_Schema.Struct({}),
    success: ServerTraceDiagnosticsResult,
  },
);
const WsServerGetProcessDiagnosticsRpc = effect_unstable_rpc_Rpc.make(
  WS_METHODS.serverGetProcessDiagnostics,
  {
    payload: effect_Schema.Struct({}),
    success: ServerProcessDiagnosticsResult,
  },
);
const WsServerGetProcessResourceHistoryRpc = effect_unstable_rpc_Rpc.make(
  WS_METHODS.serverGetProcessResourceHistory,
  {
    payload: ServerProcessResourceHistoryInput,
    success: ServerProcessResourceHistoryResult,
  },
);
const WsServerSignalProcessRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.serverSignalProcess, {
  payload: ServerSignalProcessInput,
  success: ServerSignalProcessResult,
});
const WsSourceControlLookupRepositoryRpc = effect_unstable_rpc_Rpc.make(
  WS_METHODS.sourceControlLookupRepository,
  {
    payload: SourceControlRepositoryLookupInput,
    success: SourceControlRepositoryInfo,
    error: SourceControlRepositoryError,
  },
);
const WsSourceControlCloneRepositoryRpc = effect_unstable_rpc_Rpc.make(
  WS_METHODS.sourceControlCloneRepository,
  {
    payload: SourceControlCloneRepositoryInput,
    success: SourceControlCloneRepositoryResult,
    error: SourceControlRepositoryError,
  },
);
const WsSourceControlPublishRepositoryRpc = effect_unstable_rpc_Rpc.make(
  WS_METHODS.sourceControlPublishRepository,
  {
    payload: SourceControlPublishRepositoryInput,
    success: SourceControlPublishRepositoryResult,
    error: SourceControlRepositoryError,
  },
);
const WsProjectsSearchEntriesRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.projectsSearchEntries, {
  payload: ProjectSearchEntriesInput,
  success: ProjectSearchEntriesResult,
  error: ProjectSearchEntriesError,
});
const WsProjectsWriteFileRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.projectsWriteFile, {
  payload: ProjectWriteFileInput,
  success: ProjectWriteFileResult,
  error: ProjectWriteFileError,
});
const WsShellOpenInEditorRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.shellOpenInEditor, {
  payload: LaunchEditorInput,
  error: ExternalLauncherError,
});
const WsFilesystemBrowseRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.filesystemBrowse, {
  payload: FilesystemBrowseInput,
  success: FilesystemBrowseResult,
  error: FilesystemBrowseError,
});
const WsSubscribeVcsStatusRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.subscribeVcsStatus, {
  payload: VcsStatusInput,
  success: VcsStatusStreamEvent,
  error: GitManagerServiceError,
  stream: true,
});
const WsVcsPullRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.vcsPull, {
  payload: VcsPullInput,
  success: VcsPullResult,
  error: GitCommandError,
});
const WsVcsRefreshStatusRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.vcsRefreshStatus, {
  payload: VcsStatusInput,
  success: VcsStatusResult,
  error: GitManagerServiceError,
});
const WsGitRunStackedActionRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.gitRunStackedAction, {
  payload: GitRunStackedActionInput,
  success: GitActionProgressEvent,
  error: GitManagerServiceError,
  stream: true,
});
const WsGitResolvePullRequestRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.gitResolvePullRequest, {
  payload: GitPullRequestRefInput,
  success: GitResolvePullRequestResult,
  error: GitManagerServiceError,
});
const WsGitPreparePullRequestThreadRpc = effect_unstable_rpc_Rpc.make(
  WS_METHODS.gitPreparePullRequestThread,
  {
    payload: GitPreparePullRequestThreadInput,
    success: GitPreparePullRequestThreadResult,
    error: GitManagerServiceError,
  },
);
const WsVcsListRefsRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.vcsListRefs, {
  payload: VcsListRefsInput,
  success: VcsListRefsResult,
  error: GitCommandError,
});
const WsVcsCreateWorktreeRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.vcsCreateWorktree, {
  payload: VcsCreateWorktreeInput,
  success: VcsCreateWorktreeResult,
  error: GitCommandError,
});
const WsVcsRemoveWorktreeRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.vcsRemoveWorktree, {
  payload: VcsRemoveWorktreeInput,
  error: GitCommandError,
});
const WsVcsCreateRefRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.vcsCreateRef, {
  payload: VcsCreateRefInput,
  success: VcsCreateRefResult,
  error: GitCommandError,
});
const WsVcsSwitchRefRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.vcsSwitchRef, {
  payload: VcsSwitchRefInput,
  success: VcsSwitchRefResult,
  error: GitCommandError,
});
const WsVcsInitRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.vcsInit, {
  payload: VcsInitInput,
  error: VcsError,
});
const WsTerminalOpenRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.terminalOpen, {
  payload: TerminalOpenInput,
  success: TerminalSessionSnapshot,
  error: TerminalError,
});
const WsTerminalWriteRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.terminalWrite, {
  payload: TerminalWriteInput,
  error: TerminalError,
});
const WsTerminalResizeRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.terminalResize, {
  payload: TerminalResizeInput,
  error: TerminalError,
});
const WsTerminalClearRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.terminalClear, {
  payload: TerminalClearInput,
  error: TerminalError,
});
const WsTerminalRestartRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.terminalRestart, {
  payload: TerminalRestartInput,
  success: TerminalSessionSnapshot,
  error: TerminalError,
});
const WsTerminalCloseRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.terminalClose, {
  payload: TerminalCloseInput,
  error: TerminalError,
});
const WsOrchestrationDispatchCommandRpc = effect_unstable_rpc_Rpc.make(
  ORCHESTRATION_WS_METHODS.dispatchCommand,
  {
    payload: ClientOrchestrationCommand,
    success: OrchestrationRpcSchemas.dispatchCommand.output,
    error: OrchestrationDispatchCommandError,
  },
);
const WsOrchestrationGetTurnDiffRpc = effect_unstable_rpc_Rpc.make(
  ORCHESTRATION_WS_METHODS.getTurnDiff,
  {
    payload: OrchestrationGetTurnDiffInput,
    success: OrchestrationRpcSchemas.getTurnDiff.output,
    error: OrchestrationGetTurnDiffError,
  },
);
const WsOrchestrationGetFullThreadDiffRpc = effect_unstable_rpc_Rpc.make(
  ORCHESTRATION_WS_METHODS.getFullThreadDiff,
  {
    payload: OrchestrationGetFullThreadDiffInput,
    success: OrchestrationRpcSchemas.getFullThreadDiff.output,
    error: OrchestrationGetFullThreadDiffError,
  },
);
const WsOrchestrationReplayEventsRpc = effect_unstable_rpc_Rpc.make(
  ORCHESTRATION_WS_METHODS.replayEvents,
  {
    payload: OrchestrationReplayEventsInput,
    success: OrchestrationRpcSchemas.replayEvents.output,
    error: OrchestrationReplayEventsError,
  },
);
const WsOrchestrationGetArchivedShellSnapshotRpc = effect_unstable_rpc_Rpc.make(
  ORCHESTRATION_WS_METHODS.getArchivedShellSnapshot,
  {
    payload: OrchestrationRpcSchemas.getArchivedShellSnapshot.input,
    success: OrchestrationRpcSchemas.getArchivedShellSnapshot.output,
    error: OrchestrationGetSnapshotError,
  },
);
const WsOrchestrationSubscribeShellRpc = effect_unstable_rpc_Rpc.make(
  ORCHESTRATION_WS_METHODS.subscribeShell,
  {
    payload: OrchestrationRpcSchemas.subscribeShell.input,
    success: OrchestrationRpcSchemas.subscribeShell.output,
    error: OrchestrationGetSnapshotError,
    stream: true,
  },
);
const WsOrchestrationSubscribeThreadRpc = effect_unstable_rpc_Rpc.make(
  ORCHESTRATION_WS_METHODS.subscribeThread,
  {
    payload: OrchestrationRpcSchemas.subscribeThread.input,
    success: OrchestrationRpcSchemas.subscribeThread.output,
    error: OrchestrationGetSnapshotError,
    stream: true,
  },
);
const WsSubscribeTerminalEventsRpc = effect_unstable_rpc_Rpc.make(
  WS_METHODS.subscribeTerminalEvents,
  {
    payload: effect_Schema.Struct({}),
    success: TerminalEvent,
    stream: true,
  },
);
const WsSubscribeServerConfigRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.subscribeServerConfig, {
  payload: effect_Schema.Struct({}),
  success: ServerConfigStreamEvent,
  error: effect_Schema.Union([KeybindingsConfigError, ServerSettingsError]),
  stream: true,
});
const WsSubscribeServerLifecycleRpc = effect_unstable_rpc_Rpc.make(
  WS_METHODS.subscribeServerLifecycle,
  {
    payload: effect_Schema.Struct({}),
    success: ServerLifecycleStreamEvent,
    stream: true,
  },
);
const WsSubscribeAuthAccessRpc = effect_unstable_rpc_Rpc.make(WS_METHODS.subscribeAuthAccess, {
  payload: effect_Schema.Struct({}),
  success: AuthAccessStreamEvent,
  stream: true,
});
const WsRpcGroup = effect_unstable_rpc_RpcGroup.make(
  WsServerGetConfigRpc,
  WsServerRefreshProvidersRpc,
  WsServerUpdateProviderRpc,
  WsServerUpsertKeybindingRpc,
  WsServerRemoveKeybindingRpc,
  WsServerGetSettingsRpc,
  WsServerUpdateSettingsRpc,
  WsServerDiscoverSourceControlRpc,
  WsServerGetTraceDiagnosticsRpc,
  WsServerGetProcessDiagnosticsRpc,
  WsServerGetProcessResourceHistoryRpc,
  WsServerSignalProcessRpc,
  WsSourceControlLookupRepositoryRpc,
  WsSourceControlCloneRepositoryRpc,
  WsSourceControlPublishRepositoryRpc,
  WsProjectsSearchEntriesRpc,
  WsProjectsWriteFileRpc,
  WsShellOpenInEditorRpc,
  WsFilesystemBrowseRpc,
  WsSubscribeVcsStatusRpc,
  WsVcsPullRpc,
  WsVcsRefreshStatusRpc,
  WsGitRunStackedActionRpc,
  WsGitResolvePullRequestRpc,
  WsGitPreparePullRequestThreadRpc,
  WsVcsListRefsRpc,
  WsVcsCreateWorktreeRpc,
  WsVcsRemoveWorktreeRpc,
  WsVcsCreateRefRpc,
  WsVcsSwitchRefRpc,
  WsVcsInitRpc,
  WsTerminalOpenRpc,
  WsTerminalWriteRpc,
  WsTerminalResizeRpc,
  WsTerminalClearRpc,
  WsTerminalRestartRpc,
  WsTerminalCloseRpc,
  WsSubscribeTerminalEventsRpc,
  WsSubscribeServerConfigRpc,
  WsSubscribeServerLifecycleRpc,
  WsSubscribeAuthAccessRpc,
  WsOrchestrationDispatchCommandRpc,
  WsOrchestrationGetTurnDiffRpc,
  WsOrchestrationGetFullThreadDiffRpc,
  WsOrchestrationReplayEventsRpc,
  WsOrchestrationGetArchivedShellSnapshotRpc,
  WsOrchestrationSubscribeShellRpc,
  WsOrchestrationSubscribeThreadRpc,
);

//#endregion
//#region ../../packages/shared/src/schemaJson.ts
/**
 * A `Getter` that parses a lenient JSON string (tolerating trailing commas
 * and JS-style comments) into an unknown value.
 *
 * Mirrors `SchemaGetter.parseJson()` but uses `parseLenientJson` instead
 * of `JSON.parse`.
 */
const parseLenientJsonGetter = effect_SchemaGetter.onSome((input) =>
  effect_Effect.try({
    try: () => {
      let stripped = input.replace(/("(?:[^"\\]|\\.)*")|\/\/[^\n]*/g, (match, stringLiteral) =>
        stringLiteral ? match : "",
      );
      stripped = stripped.replace(/("(?:[^"\\]|\\.)*")|\/\*[\s\S]*?\*\//g, (match, stringLiteral) =>
        stringLiteral ? match : "",
      );
      stripped = stripped.replace(/,(\s*[}\]])/g, "$1");
      return effect_Option.some(JSON.parse(stripped));
    },
    catch: (e) =>
      new effect_SchemaIssue.InvalidValue(effect_Option.some(input), { message: String(e) }),
  }),
);
/**
 * Schema transformation: lenient JSONC string ↔ unknown.
 *
 * Same API as `SchemaTransformation.fromJsonString`, but the decode side
 * strips trailing commas and JS-style comments before parsing.
 * Encoding produces strict JSON via `JSON.stringify`.
 */
const fromLenientJsonString = new effect_SchemaTransformation.Transformation(
  parseLenientJsonGetter,
  effect_SchemaGetter.stringifyJson(),
);
const prettyJsonString = effect_SchemaGetter
  .parseJson()
  .compose(effect_SchemaGetter.stringifyJson({ space: 2 }));
/**
 * Build a schema that decodes a lenient JSON string into `A`.
 *
 * Drop-in replacement for `Schema.fromJsonString(schema)` that tolerates
 * trailing commas and comments in the input.
 */
const fromLenientJson = (schema) =>
  effect_Schema.String.pipe(effect_Schema.decodeTo(schema, fromLenientJsonString));
function extractJsonObject(raw) {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return trimmed;
  const start = trimmed.indexOf("{");
  if (start < 0) return trimmed;
  let depth = 0;
  let inString = false;
  let escaping = false;
  for (let index = start; index < trimmed.length; index += 1) {
    const char = trimmed[index];
    if (inString) {
      if (escaping) escaping = false;
      else if (char === "\\") escaping = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "{") {
      depth += 1;
      continue;
    }
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return trimmed.slice(start, index + 1);
    }
  }
  return trimmed.slice(start);
}

//#endregion
//#region src/updates/updateChannels.ts
const NIGHTLY_VERSION_PATTERN = /-nightly\.\d{8}\.\d+$/;
function isNightlyDesktopVersion(version) {
  return NIGHTLY_VERSION_PATTERN.test(version);
}
function resolveDefaultDesktopUpdateChannel(appVersion) {
  return isNightlyDesktopVersion(appVersion) ? "nightly" : "latest";
}

//#endregion
//#region src/settings/DesktopAppSettings.ts
const DEFAULT_TAILSCALE_SERVE_PORT$1 = 443;
const DEFAULT_DESKTOP_SETTINGS = {
  serverExposureMode: "local-only",
  tailscaleServeEnabled: false,
  tailscaleServePort: DEFAULT_TAILSCALE_SERVE_PORT$1,
  updateChannel: "latest",
  updateChannelConfiguredByUser: false,
};
const DesktopSettingsJson = fromLenientJson(
  effect_Schema.Struct({
    serverExposureMode: effect_Schema.optionalKey(DesktopServerExposureModeSchema),
    tailscaleServeEnabled: effect_Schema.optionalKey(effect_Schema.Boolean),
    tailscaleServePort: effect_Schema.optionalKey(effect_Schema.Number),
    updateChannel: effect_Schema.optionalKey(DesktopUpdateChannelSchema),
    updateChannelConfiguredByUser: effect_Schema.optionalKey(effect_Schema.Boolean),
  }),
);
const decodeDesktopSettingsJson = effect_Schema.decodeEffect(DesktopSettingsJson);
const encodeDesktopSettingsJson = effect_Schema.encodeEffect(DesktopSettingsJson);
const settingsChange = (settings, changed) => ({
  settings,
  changed,
});
var DesktopSettingsWriteError = class extends effect_Data.TaggedError("DesktopSettingsWriteError") {
  get message() {
    return `Failed to write desktop settings: ${this.cause.message}`;
  }
};
var DesktopAppSettings = class extends effect_Context.Service()("t3/desktop/AppSettings") {};
function resolveDefaultDesktopSettings(appVersion) {
  return {
    ...DEFAULT_DESKTOP_SETTINGS,
    updateChannel: resolveDefaultDesktopUpdateChannel(appVersion),
  };
}
function normalizeTailscaleServePort(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 65535
    ? value
    : DEFAULT_TAILSCALE_SERVE_PORT$1;
}
function normalizeDesktopSettingsDocument(parsed, appVersion) {
  const defaultSettings = resolveDefaultDesktopSettings(appVersion);
  const parsedUpdateChannel = effect_Option.fromNullishOr(parsed.updateChannel);
  const isLegacySettings = parsed.updateChannelConfiguredByUser === void 0;
  const updateChannelConfiguredByUser =
    parsed.updateChannelConfiguredByUser === true ||
    (isLegacySettings && effect_Option.contains(parsedUpdateChannel, "nightly"));
  return {
    serverExposureMode:
      parsed.serverExposureMode === "network-accessible" ? "network-accessible" : "local-only",
    tailscaleServeEnabled: parsed.tailscaleServeEnabled === true,
    tailscaleServePort: normalizeTailscaleServePort(parsed.tailscaleServePort),
    updateChannel: updateChannelConfiguredByUser
      ? effect_Option.getOrElse(parsedUpdateChannel, () => defaultSettings.updateChannel)
      : defaultSettings.updateChannel,
    updateChannelConfiguredByUser,
  };
}
function toDesktopSettingsDocument(settings, defaults) {
  const document = {};
  if (settings.serverExposureMode !== defaults.serverExposureMode)
    document.serverExposureMode = settings.serverExposureMode;
  if (settings.tailscaleServeEnabled !== defaults.tailscaleServeEnabled)
    document.tailscaleServeEnabled = settings.tailscaleServeEnabled;
  if (settings.tailscaleServePort !== defaults.tailscaleServePort)
    document.tailscaleServePort = settings.tailscaleServePort;
  if (settings.updateChannel !== defaults.updateChannel)
    document.updateChannel = settings.updateChannel;
  if (settings.updateChannelConfiguredByUser !== defaults.updateChannelConfiguredByUser)
    document.updateChannelConfiguredByUser = settings.updateChannelConfiguredByUser;
  return document;
}
function setServerExposureMode$1(settings, requestedMode) {
  return settings.serverExposureMode === requestedMode
    ? settings
    : {
        ...settings,
        serverExposureMode: requestedMode,
      };
}
function setTailscaleServe(settings, input) {
  const port = effect_Option.match(input.port, {
    onNone: () => settings.tailscaleServePort,
    onSome: normalizeTailscaleServePort,
  });
  return settings.tailscaleServeEnabled === input.enabled && settings.tailscaleServePort === port
    ? settings
    : {
        ...settings,
        tailscaleServeEnabled: input.enabled,
        tailscaleServePort: port,
      };
}
function setUpdateChannel$1(settings, requestedChannel) {
  return settings.updateChannel === requestedChannel
    ? settings
    : {
        ...settings,
        updateChannel: requestedChannel,
        updateChannelConfiguredByUser: true,
      };
}
function readSettings(fileSystem, settingsPath, appVersion) {
  const defaultSettings = resolveDefaultDesktopSettings(appVersion);
  return fileSystem.readFileString(settingsPath).pipe(
    effect_Effect.option,
    effect_Effect.flatMap(
      effect_Option.match({
        onNone: () => effect_Effect.succeed(defaultSettings),
        onSome: (raw) =>
          decodeDesktopSettingsJson(raw).pipe(
            effect_Effect.map((parsed) => normalizeDesktopSettingsDocument(parsed, appVersion)),
            effect_Effect.catch(() => effect_Effect.succeed(defaultSettings)),
          ),
      }),
    ),
  );
}
const writeSettings = effect_Effect.fn("desktop.settings.writeSettings")(function* (input) {
  const directory = input.path.dirname(input.settingsPath);
  const suffix = (yield* effect_Random.nextUUIDv4).replace(/-/g, "");
  const tempPath = `${input.settingsPath}.${process.pid}.${suffix}.tmp`;
  const encoded = yield* encodeDesktopSettingsJson(
    toDesktopSettingsDocument(input.settings, input.defaultSettings),
  );
  yield* input.fileSystem.makeDirectory(directory, { recursive: true });
  yield* input.fileSystem.writeFileString(tempPath, `${encoded}\n`);
  yield* input.fileSystem.rename(tempPath, input.settingsPath);
});
const layer$24 = effect_Layer.effect(
  DesktopAppSettings,
  effect_Effect.gen(function* () {
    const environment = yield* DesktopEnvironment;
    const fileSystem = yield* effect_FileSystem.FileSystem;
    const path = yield* effect_Path.Path;
    const settingsRef = yield* effect_SynchronizedRef.make(environment.defaultDesktopSettings);
    const persist = (update) =>
      effect_SynchronizedRef.modifyEffect(settingsRef, (settings) => {
        const nextSettings = update(settings);
        if (nextSettings === settings)
          return effect_Effect.succeed([settingsChange(settings, false), settings]);
        return writeSettings({
          fileSystem,
          path,
          settingsPath: environment.desktopSettingsPath,
          settings: nextSettings,
          defaultSettings: environment.defaultDesktopSettings,
        }).pipe(
          effect_Effect.mapError((cause) => new DesktopSettingsWriteError({ cause })),
          effect_Effect.as([settingsChange(nextSettings, true), nextSettings]),
        );
      });
    return DesktopAppSettings.of({
      get: effect_SynchronizedRef.get(settingsRef),
      load: effect_Effect
        .gen(function* () {
          const settings = yield* readSettings(
            fileSystem,
            environment.desktopSettingsPath,
            environment.appVersion,
          );
          return yield* effect_SynchronizedRef.setAndGet(settingsRef, settings);
        })
        .pipe(effect_Effect.withSpan("desktop.settings.load")),
      setServerExposureMode: (mode) =>
        persist((settings) => setServerExposureMode$1(settings, mode)).pipe(
          effect_Effect.withSpan("desktop.settings.setServerExposureMode", {
            attributes: { mode },
          }),
        ),
      setTailscaleServe: (input) =>
        persist((settings) => setTailscaleServe(settings, input)).pipe(
          effect_Effect.withSpan("desktop.settings.setTailscaleServe", { attributes: input }),
        ),
      setUpdateChannel: (channel) =>
        persist((settings) => setUpdateChannel$1(settings, channel)).pipe(
          effect_Effect.withSpan("desktop.settings.setUpdateChannel", { attributes: { channel } }),
        ),
    });
  }),
);

//#endregion
//#region src/app/DesktopConfig.ts
const trimNonEmptyOption = (value) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? effect_Option.some(trimmed) : effect_Option.none();
};
const trimmedString = (name) =>
  effect_Config
    .string(name)
    .pipe(effect_Config.option, effect_Config.map(effect_Option.flatMap(trimNonEmptyOption)));
const optionalBoolean = (name) =>
  effect_Config
    .boolean(name)
    .pipe(effect_Config.option, effect_Config.map(effect_Option.getOrElse(() => false)));
const commaSeparatedStrings = (name) =>
  trimmedString(name).pipe(
    effect_Config.map(
      effect_Option.match({
        onNone: () => [],
        onSome: (value) =>
          value
            .split(",")
            .map((entry) => entry.trim())
            .filter((entry) => entry.length > 0),
      }),
    ),
  );
const DesktopConfig = effect_Config.all({
  appDataDirectory: trimmedString("APPDATA"),
  xdgConfigHome: trimmedString("XDG_CONFIG_HOME"),
  t3Home: trimmedString("PEARCE_CODES_HOME"),
  devServerUrl: effect_Config.url("VITE_DEV_SERVER_URL").pipe(effect_Config.option),
  devRemoteT3ServerEntryPath: trimmedString("T3CODE_DEV_REMOTE_T3_SERVER_ENTRY_PATH"),
  configuredBackendPort: effect_Config.port("T3CODE_PORT").pipe(effect_Config.option),
  commitHashOverride: trimmedString("T3CODE_COMMIT_HASH"),
  desktopLanHostOverride: trimmedString("T3CODE_DESKTOP_LAN_HOST"),
  desktopHttpsEndpointUrls: commaSeparatedStrings("T3CODE_DESKTOP_HTTPS_ENDPOINTS"),
  otlpTracesUrl: trimmedString("T3CODE_OTLP_TRACES_URL"),
  otlpExportIntervalMs: effect_Config
    .int("T3CODE_OTLP_EXPORT_INTERVAL_MS")
    .pipe(effect_Config.withDefault(1e4)),
  appImagePath: trimmedString("APPIMAGE"),
  disableAutoUpdate: optionalBoolean("T3CODE_DISABLE_AUTO_UPDATE"),
  mockUpdates: optionalBoolean("T3CODE_DESKTOP_MOCK_UPDATES"),
  mockUpdateServerPort: effect_Config
    .port("T3CODE_DESKTOP_MOCK_UPDATE_SERVER_PORT")
    .pipe(effect_Config.withDefault(3e3)),
});

//#endregion
//#region src/app/DesktopEnvironment.ts
var DesktopEnvironment = class extends effect_Context.Service()("t3/desktop/Environment") {};
const APP_BASE_NAME = "Pearce Codes";
function resolveDesktopAppStageLabel(input) {
  if (input.isDevelopment) return "Dev";
  return isNightlyDesktopVersion(input.appVersion) ? "Nightly" : "Alpha";
}
function resolveDesktopAppBranding(input) {
  const stageLabel = resolveDesktopAppStageLabel(input);
  return {
    baseName: APP_BASE_NAME,
    stageLabel,
    displayName: `${APP_BASE_NAME} (${stageLabel})`,
  };
}
function normalizeDesktopArch(arch) {
  if (arch === "arm64") return "arm64";
  if (arch === "x64") return "x64";
  return "other";
}
function resolveDesktopRuntimeInfo(input) {
  const appArch = normalizeDesktopArch(input.processArch);
  if (input.platform !== "darwin")
    return {
      hostArch: appArch,
      appArch,
      runningUnderArm64Translation: false,
    };
  return {
    hostArch: appArch === "arm64" || input.runningUnderArm64Translation ? "arm64" : appArch,
    appArch,
    runningUnderArm64Translation: input.runningUnderArm64Translation,
  };
}
const makeDesktopEnvironment = effect_Effect.fn("desktop.environment.make")(function* (input) {
  const path = yield* effect_Path.Path;
  const config = yield* DesktopConfig;
  const homeDirectory = input.homeDirectory;
  const devServerUrl = config.devServerUrl;
  const isDevelopment = effect_Option.isSome(devServerUrl);
  const appDataDirectory =
    input.platform === "win32"
      ? effect_Option.getOrElse(config.appDataDirectory, () =>
          path.join(homeDirectory, "AppData", "Roaming"),
        )
      : input.platform === "darwin"
        ? path.join(homeDirectory, "Library", "Application Support")
        : effect_Option.getOrElse(config.xdgConfigHome, () => path.join(homeDirectory, ".config"));
  const baseDir = effect_Option.getOrElse(config.t3Home, () =>
    path.join(homeDirectory, ".pearce-codes"),
  );
  const rootDir = path.resolve(input.dirname, "../../..");
  const appRoot = input.isPackaged ? input.appPath : rootDir;
  const branding = resolveDesktopAppBranding({
    isDevelopment,
    appVersion: input.appVersion,
  });
  const displayName = branding.displayName;
  const stateDir = path.join(baseDir, isDevelopment ? "dev" : "userdata");
  const userDataDirName = isDevelopment ? "pearce-codes-dev" : "pearce-codes";
  const legacyUserDataDirName = isDevelopment ? "Pearce Codes (Dev)" : "Pearce Codes (Alpha)";
  const resourcesPath = input.resourcesPath;
  return DesktopEnvironment.of({
    path,
    dirname: input.dirname,
    platform: input.platform,
    processArch: input.processArch,
    isPackaged: input.isPackaged,
    isDevelopment,
    appVersion: input.appVersion,
    appPath: input.appPath,
    resourcesPath,
    homeDirectory,
    appDataDirectory,
    baseDir,
    stateDir,
    desktopSettingsPath: path.join(stateDir, "desktop-settings.json"),
    clientSettingsPath: path.join(stateDir, "client-settings.json"),
    savedEnvironmentRegistryPath: path.join(stateDir, "saved-environments.json"),
    serverSettingsPath: path.join(stateDir, "settings.json"),
    logDir: path.join(stateDir, "logs"),
    rootDir,
    appRoot,
    backendEntryPath: path.join(appRoot, "apps/server/dist/bin.mjs"),
    backendCwd: input.isPackaged ? homeDirectory : appRoot,
    preloadPath: path.join(input.dirname, "preload.cjs"),
    appUpdateYmlPath: input.isPackaged
      ? path.join(resourcesPath, "app-update.yml")
      : path.join(input.appPath, "dev-app-update.yml"),
    devServerUrl,
    devRemoteT3ServerEntryPath: config.devRemoteT3ServerEntryPath,
    configuredBackendPort: config.configuredBackendPort,
    commitHashOverride: config.commitHashOverride,
    otlpTracesUrl: config.otlpTracesUrl,
    otlpExportIntervalMs: config.otlpExportIntervalMs,
    branding,
    displayName,
    appUserModelId: isDevelopment
      ? "com.pearcecodes.pearcecodes.dev"
      : "com.pearcecodes.pearcecodes",
    linuxDesktopEntryName: isDevelopment ? "pearce-codes-dev.desktop" : "pearce-codes.desktop",
    linuxWmClass: isDevelopment ? "pearce-codes-dev" : "pearce-codes",
    userDataDirName,
    legacyUserDataDirName,
    defaultDesktopSettings: resolveDefaultDesktopSettings(input.appVersion),
    runtimeInfo: resolveDesktopRuntimeInfo({
      platform: input.platform,
      processArch: input.processArch,
      runningUnderArm64Translation: input.runningUnderArm64Translation,
    }),
    resolvePickFolderDefaultPath: (rawOptions) => {
      if (typeof rawOptions !== "object" || rawOptions === null) return effect_Option.none();
      const { initialPath } = rawOptions;
      if (typeof initialPath !== "string") return effect_Option.none();
      const trimmedPath = initialPath.trim();
      if (trimmedPath.length === 0) return effect_Option.none();
      if (trimmedPath === "~") return effect_Option.some(homeDirectory);
      if (trimmedPath.startsWith("~/") || trimmedPath.startsWith("~\\"))
        return effect_Option.some(path.join(homeDirectory, trimmedPath.slice(2)));
      return effect_Option.some(path.resolve(trimmedPath));
    },
    resolveResourcePathCandidates: (fileName) => [
      path.join(input.dirname, "../resources", fileName),
      path.join(input.dirname, "../prod-resources", fileName),
      path.join(resourcesPath, "resources", fileName),
      path.join(resourcesPath, fileName),
    ],
    developmentDockIconPath: path.join(rootDir, "assets", "dev", "blueprint-macos-1024.png"),
  });
});
const layer$23 = (input) => effect_Layer.effect(DesktopEnvironment, makeDesktopEnvironment(input));

//#endregion
//#region src/electron/ElectronProtocol.ts
const DESKTOP_SCHEME = "t3";
var ElectronProtocolRegistrationError = class extends effect_Data.TaggedError(
  "ElectronProtocolRegistrationError",
) {
  get message() {
    return `Failed to register ${this.scheme}: file protocol.`;
  }
};
var ElectronProtocolStaticBundleMissingError = class extends effect_Data.TaggedError(
  "ElectronProtocolStaticBundleMissingError",
) {
  get message() {
    return "Desktop static bundle missing. Build apps/server (with bundled client) first.";
  }
};
var ElectronProtocol = class extends effect_Context.Service()("t3/desktop/electron/Protocol") {};
function normalizeDesktopProtocolPathname(rawPath) {
  const segments = [];
  for (const segment of rawPath.split("/")) {
    if (segment.length === 0 || segment === ".") continue;
    if (segment === "..") return effect_Option.none();
    segments.push(segment);
  }
  return effect_Option.some(segments.join("/"));
}
const registerDesktopSchemePrivileges = effect_Effect
  .sync(() => {
    electron.protocol.registerSchemesAsPrivileged([
      {
        scheme: DESKTOP_SCHEME,
        privileges: {
          standard: true,
          secure: true,
          supportFetchAPI: true,
          corsEnabled: true,
        },
      },
    ]);
  })
  .pipe(effect_Effect.withSpan("desktop.electron.protocol.registerSchemePrivileges"));
const layerSchemePrivileges = effect_Layer.effectDiscard(registerDesktopSchemePrivileges);
const resolveDesktopStaticDir = effect_Effect.gen(function* () {
  const fileSystem = yield* effect_FileSystem.FileSystem;
  const environment = yield* DesktopEnvironment;
  const candidates = [
    environment.path.join(environment.appRoot, "apps/server/dist/client"),
    environment.path.join(environment.appRoot, "apps/web/dist"),
  ];
  for (const candidate of candidates)
    if (
      yield* fileSystem
        .exists(environment.path.join(candidate, "index.html"))
        .pipe(effect_Effect.orElseSucceed(() => false))
    )
      return effect_Option.some(candidate);
  return effect_Option.none();
});
const resolveDesktopStaticPath = effect_Effect.fn(
  "desktop.electron.protocol.resolveDesktopStaticPath",
)(function* (staticRoot, requestUrl) {
  const fileSystem = yield* effect_FileSystem.FileSystem;
  const environment = yield* DesktopEnvironment;
  const url = new URL(requestUrl);
  const normalizedPath = normalizeDesktopProtocolPathname(decodeURIComponent(url.pathname));
  if (effect_Option.isNone(normalizedPath)) return environment.path.join(staticRoot, "index.html");
  const requestedPath = normalizedPath.value.length > 0 ? normalizedPath.value : "index.html";
  const resolvedPath = environment.path.join(staticRoot, requestedPath);
  if (environment.path.extname(resolvedPath)) return resolvedPath;
  const nestedIndex = environment.path.join(resolvedPath, "index.html");
  if (yield* fileSystem.exists(nestedIndex).pipe(effect_Effect.orElseSucceed(() => false)))
    return nestedIndex;
  return environment.path.join(staticRoot, "index.html");
});
function isStaticAssetRequest(requestUrl, environment) {
  try {
    const url = new URL(requestUrl);
    return environment.path.extname(url.pathname).length > 0;
  } catch {
    return false;
  }
}
const make$13 = effect_Effect.gen(function* () {
  const registeredProtocols = yield* effect_Ref.make(/* @__PURE__ */ new Set());
  const registerFileProtocol = effect_Effect.fn("desktop.electron.protocol.registerFileProtocol")(
    function* ({ scheme, handler, onFailure }) {
      yield* effect_Effect.annotateCurrentSpan({ scheme });
      if (
        yield* effect_Ref
          .get(registeredProtocols)
          .pipe(effect_Effect.map((protocols) => protocols.has(scheme)))
      )
        return;
      const context = yield* effect_Effect.context();
      const runPromise = effect_Effect.runPromiseWith(context);
      yield* effect_Effect.acquireRelease(
        effect_Effect
          .try({
            try: () => {
              if (
                !electron.protocol.registerFileProtocol(scheme, (request, callback) => {
                  runPromise(
                    handler(request).pipe(
                      effect_Effect.withSpan("desktop.electron.protocol.handleFileRequest"),
                      effect_Effect.catchCause((cause) =>
                        effect_Effect.succeed(onFailure?.(request, cause) ?? { error: -2 }),
                      ),
                    ),
                  ).then(callback, () => callback({ error: -2 }));
                })
              )
                throw new ElectronProtocolRegistrationError({
                  scheme,
                  cause: "registerFileProtocol returned false",
                });
            },
            catch: (cause) =>
              cause instanceof ElectronProtocolRegistrationError
                ? cause
                : new ElectronProtocolRegistrationError({
                    scheme,
                    cause,
                  }),
          })
          .pipe(
            effect_Effect.andThen(
              effect_Ref.update(registeredProtocols, (protocols) => new Set(protocols).add(scheme)),
            ),
          ),
        () =>
          effect_Effect
            .sync(() => {
              electron.protocol.unregisterProtocol(scheme);
            })
            .pipe(
              effect_Effect.andThen(
                effect_Ref.update(registeredProtocols, (protocols) => {
                  const next = new Set(protocols);
                  next.delete(scheme);
                  return next;
                }),
              ),
            ),
      );
    },
  );
  const registerDesktopFileProtocol = effect_Effect
    .gen(function* () {
      const environment = yield* DesktopEnvironment;
      if (environment.isDevelopment) return;
      const staticRoot = yield* resolveDesktopStaticDir;
      if (effect_Option.isNone(staticRoot))
        return yield* new ElectronProtocolStaticBundleMissingError();
      const staticRootResolved = environment.path.resolve(staticRoot.value);
      const staticRootPrefix = `${staticRootResolved}${environment.path.sep}`;
      const fallbackIndex = environment.path.join(staticRootResolved, "index.html");
      yield* registerFileProtocol({
        scheme: DESKTOP_SCHEME,
        handler: effect_Effect.fn("desktop.electron.protocol.handleDesktopFileRequest")(
          function* (request) {
            const fileSystem = yield* effect_FileSystem.FileSystem;
            const environment = yield* DesktopEnvironment;
            const candidate = yield* resolveDesktopStaticPath(staticRootResolved, request.url);
            const resolvedCandidate = environment.path.resolve(candidate);
            const isInRoot =
              resolvedCandidate === fallbackIndex || resolvedCandidate.startsWith(staticRootPrefix);
            const isAssetRequest = isStaticAssetRequest(request.url, environment);
            const exists = yield* fileSystem
              .exists(resolvedCandidate)
              .pipe(effect_Effect.orElseSucceed(() => false));
            if (!isInRoot || !exists)
              return isAssetRequest ? { error: -6 } : { path: fallbackIndex };
            return { path: resolvedCandidate };
          },
        ),
        onFailure: () => ({ path: fallbackIndex }),
      });
    })
    .pipe(effect_Effect.withSpan("desktop.electron.protocol.registerDesktopFileProtocol"));
  return ElectronProtocol.of({
    registerFileProtocol,
    registerDesktopFileProtocol,
  });
});
const layer$22 = effect_Layer.effect(ElectronProtocol, make$13);

//#endregion
//#region src/electron/ElectronSafeStorage.ts
var ElectronSafeStorageAvailabilityError = class extends effect_Data.TaggedError(
  "ElectronSafeStorageAvailabilityError",
) {
  get message() {
    return "Electron safe storage failed to check encryption availability.";
  }
};
var ElectronSafeStorageEncryptError = class extends effect_Data.TaggedError(
  "ElectronSafeStorageEncryptError",
) {
  get message() {
    return "Electron safe storage failed to encrypt a string.";
  }
};
var ElectronSafeStorageDecryptError = class extends effect_Data.TaggedError(
  "ElectronSafeStorageDecryptError",
) {
  get message() {
    return "Electron safe storage failed to decrypt a string.";
  }
};
var ElectronSafeStorage = class extends effect_Context.Service()(
  "@t3tools/desktop/ElectronSafeStorage",
) {};
const make$12 = ElectronSafeStorage.of({
  isEncryptionAvailable: effect_Effect.try({
    try: () => electron.safeStorage.isEncryptionAvailable(),
    catch: (cause) => new ElectronSafeStorageAvailabilityError({ cause }),
  }),
  encryptString: (value) =>
    effect_Effect.try({
      try: () => electron.safeStorage.encryptString(value),
      catch: (cause) => new ElectronSafeStorageEncryptError({ cause }),
    }),
  decryptString: (value) =>
    effect_Effect.try({
      try: () => electron.safeStorage.decryptString(Buffer.from(value)),
      catch: (cause) => new ElectronSafeStorageDecryptError({ cause }),
    }),
});
const layer$21 = effect_Layer.succeed(ElectronSafeStorage, make$12);

//#endregion
//#region src/electron/ElectronShell.ts
const SAFE_EXTERNAL_PROTOCOLS = new Set(["http:", "https:"]);
function parseSafeExternalUrl(rawUrl) {
  if (typeof rawUrl !== "string") return effect_Option.none();
  try {
    const url = new URL(rawUrl);
    return SAFE_EXTERNAL_PROTOCOLS.has(url.protocol)
      ? effect_Option.some(url.href)
      : effect_Option.none();
  } catch {
    return effect_Option.none();
  }
}
var ElectronShell = class extends effect_Context.Service()("t3/desktop/electron/Shell") {};
const make$11 = ElectronShell.of({
  openExternal: (rawUrl) =>
    effect_Option.match(parseSafeExternalUrl(rawUrl), {
      onNone: () => effect_Effect.succeed(false),
      onSome: (externalUrl) =>
        effect_Effect.promise(() =>
          electron.shell.openExternal(externalUrl).then(
            () => true,
            () => false,
          ),
        ),
    }),
  copyText: (text) =>
    effect_Effect.sync(() => {
      electron.clipboard.writeText(text);
    }),
});
const layer$20 = effect_Layer.succeed(ElectronShell, make$11);

//#endregion
//#region src/electron/ElectronTheme.ts
var ElectronTheme = class extends effect_Context.Service()("t3/desktop/electron/Theme") {};
const make$10 = ElectronTheme.of({
  shouldUseDarkColors: effect_Effect.sync(() => electron.nativeTheme.shouldUseDarkColors),
  setSource: (theme) =>
    effect_Effect.suspend(() => {
      electron.nativeTheme.themeSource = theme;
      return effect_Effect.void;
    }),
  onUpdated: (listener) =>
    effect_Effect.acquireRelease(
      effect_Effect.suspend(() => {
        electron.nativeTheme.on("updated", listener);
        return effect_Effect.void;
      }),
      () =>
        effect_Effect.suspend(() => {
          electron.nativeTheme.removeListener("updated", listener);
          return effect_Effect.void;
        }),
    ),
});
const layer$19 = effect_Layer.succeed(ElectronTheme, make$10);

//#endregion
//#region src/electron/ElectronUpdater.ts
var ElectronUpdaterCheckForUpdatesError = class extends effect_Data.TaggedError(
  "ElectronUpdaterCheckForUpdatesError",
) {
  get message() {
    return "Electron updater failed to check for updates.";
  }
};
var ElectronUpdaterDownloadUpdateError = class extends effect_Data.TaggedError(
  "ElectronUpdaterDownloadUpdateError",
) {
  get message() {
    return "Electron updater failed to download the update.";
  }
};
var ElectronUpdaterQuitAndInstallError = class extends effect_Data.TaggedError(
  "ElectronUpdaterQuitAndInstallError",
) {
  get message() {
    return "Electron updater failed to quit and install the update.";
  }
};
var ElectronUpdater = class extends effect_Context.Service()("t3/desktop/electron/Updater") {};
const layer$18 = effect_Layer.succeed(ElectronUpdater, {
  setFeedURL: (options) =>
    effect_Effect.suspend(() => {
      electron_updater.autoUpdater.setFeedURL(options);
      return effect_Effect.void;
    }),
  setAutoDownload: (value) =>
    effect_Effect.suspend(() => {
      electron_updater.autoUpdater.autoDownload = value;
      return effect_Effect.void;
    }),
  setAutoInstallOnAppQuit: (value) =>
    effect_Effect.suspend(() => {
      electron_updater.autoUpdater.autoInstallOnAppQuit = value;
      return effect_Effect.void;
    }),
  setChannel: (channel) =>
    effect_Effect.suspend(() => {
      electron_updater.autoUpdater.channel = channel;
      return effect_Effect.void;
    }),
  setAllowPrerelease: (value) =>
    effect_Effect.suspend(() => {
      electron_updater.autoUpdater.allowPrerelease = value;
      return effect_Effect.void;
    }),
  allowDowngrade: effect_Effect.sync(() => electron_updater.autoUpdater.allowDowngrade),
  setAllowDowngrade: (value) =>
    effect_Effect.suspend(() => {
      electron_updater.autoUpdater.allowDowngrade = value;
      return effect_Effect.void;
    }),
  setDisableDifferentialDownload: (value) =>
    effect_Effect.suspend(() => {
      electron_updater.autoUpdater.disableDifferentialDownload = value;
      return effect_Effect.void;
    }),
  checkForUpdates: effect_Effect
    .tryPromise({
      try: () => electron_updater.autoUpdater.checkForUpdates(),
      catch: (cause) => new ElectronUpdaterCheckForUpdatesError({ cause }),
    })
    .pipe(effect_Effect.asVoid),
  downloadUpdate: effect_Effect
    .tryPromise({
      try: () => electron_updater.autoUpdater.downloadUpdate(),
      catch: (cause) => new ElectronUpdaterDownloadUpdateError({ cause }),
    })
    .pipe(effect_Effect.asVoid),
  quitAndInstall: ({ isSilent, isForceRunAfter }) =>
    effect_Effect.try({
      try: () => electron_updater.autoUpdater.quitAndInstall(isSilent, isForceRunAfter),
      catch: (cause) => new ElectronUpdaterQuitAndInstallError({ cause }),
    }),
  on: (eventName, listener) => {
    const eventTarget = electron_updater.autoUpdater;
    const untypedListener = listener;
    return effect_Effect
      .acquireRelease(
        effect_Effect.sync(() => {
          eventTarget.on(eventName, untypedListener);
        }),
        () =>
          effect_Effect.sync(() => {
            eventTarget.removeListener(eventName, untypedListener);
          }),
      )
      .pipe(effect_Effect.asVoid);
  },
});

//#endregion
//#region src/electron/ElectronWindow.ts
var ElectronWindowCreateError = class extends effect_Data.TaggedError("ElectronWindowCreateError") {
  get message() {
    return "Failed to create Electron BrowserWindow.";
  }
};
var ElectronWindow = class extends effect_Context.Service()("t3/desktop/electron/Window") {};
const make$9 = effect_Effect.gen(function* () {
  const mainWindowRef = yield* effect_Ref.make(effect_Option.none());
  const liveMain = effect_Ref
    .get(mainWindowRef)
    .pipe(effect_Effect.map(effect_Option.filter((value) => !value.isDestroyed())));
  const currentMainOrFirst = effect_Effect.gen(function* () {
    const main = yield* liveMain;
    if (effect_Option.isSome(main)) return main;
    return effect_Option
      .fromNullishOr(electron.BrowserWindow.getAllWindows()[0] ?? null)
      .pipe(effect_Option.filter((window) => !window.isDestroyed()));
  });
  const focusedMainOrFirst = effect_Effect
    .sync(() =>
      effect_Option
        .fromNullishOr(electron.BrowserWindow.getFocusedWindow() ?? null)
        .pipe(effect_Option.filter((window) => !window.isDestroyed())),
    )
    .pipe(
      effect_Effect.flatMap((focused) =>
        effect_Option.isSome(focused) ? effect_Effect.succeed(focused) : currentMainOrFirst,
      ),
    );
  return ElectronWindow.of({
    create: (options) =>
      effect_Effect.try({
        try: () => new electron.BrowserWindow(options),
        catch: (cause) => new ElectronWindowCreateError({ cause }),
      }),
    main: liveMain,
    currentMainOrFirst,
    focusedMainOrFirst,
    setMain: (window) => effect_Ref.set(mainWindowRef, effect_Option.some(window)),
    clearMain: (window) =>
      effect_Ref.update(mainWindowRef, (current) => {
        if (effect_Option.isNone(current)) return current;
        if (effect_Option.isSome(window) && current.value !== window.value) return current;
        return effect_Option.none();
      }),
    reveal: (window) =>
      effect_Effect.sync(() => {
        if (window.isDestroyed()) return;
        if (window.isMinimized()) window.restore();
        if (!window.isVisible()) window.show();
        if (process.platform === "darwin") electron.app.focus({ steal: true });
        window.focus();
      }),
    sendAll: (channel, ...args) =>
      effect_Effect.sync(() => {
        for (const window of electron.BrowserWindow.getAllWindows()) {
          if (window.isDestroyed()) continue;
          window.webContents.send(channel, ...args);
        }
      }),
    destroyAll: effect_Effect.sync(() => {
      for (const window of electron.BrowserWindow.getAllWindows()) window.destroy();
    }),
    syncAllAppearance: effect_Effect.fn("desktop.electron.window.syncAllAppearance")(
      function* (sync) {
        const windows = electron.BrowserWindow.getAllWindows();
        for (const window of windows) {
          if (window.isDestroyed()) continue;
          yield* sync(window);
        }
      },
    ),
  });
});
const layer$17 = effect_Layer.effect(ElectronWindow, make$9);

//#endregion
//#region src/settings/DesktopClientSettings.ts
const ClientSettingsDocumentSchema = effect_Schema.Struct({ settings: ClientSettingsSchema });
const ClientSettingsJson = fromLenientJson(ClientSettingsSchema);
const LegacyClientSettingsDocumentJson = fromLenientJson(ClientSettingsDocumentSchema);
const decodeLegacyClientSettingsDocumentJson = effect_Schema.decodeEffect(
  LegacyClientSettingsDocumentJson,
);
const decodeClientSettingsJsonValue = effect_Schema.decodeEffect(ClientSettingsJson);
const decodeClientSettingsJson = (raw) =>
  decodeLegacyClientSettingsDocumentJson(raw).pipe(
    effect_Effect.map((document) => document.settings),
    effect_Effect.catch(() => decodeClientSettingsJsonValue(raw)),
  );
const encodeClientSettingsJson = effect_Schema.encodeEffect(ClientSettingsJson);
var DesktopClientSettingsWriteError = class extends effect_Data.TaggedError(
  "DesktopClientSettingsWriteError",
) {
  get message() {
    return `Failed to write desktop client settings: ${this.cause.message}`;
  }
};
var DesktopClientSettings = class extends effect_Context.Service()("t3/desktop/ClientSettings") {};
const readClientSettings = (fileSystem, settingsPath) =>
  fileSystem.readFileString(settingsPath).pipe(
    effect_Effect.option,
    effect_Effect.flatMap(
      effect_Option.match({
        onNone: () => effect_Effect.succeed(effect_Option.none()),
        onSome: (raw) =>
          decodeClientSettingsJson(raw).pipe(
            effect_Effect.map((settings) => effect_Option.some(settings)),
            effect_Effect.catch(() => effect_Effect.succeed(effect_Option.none())),
          ),
      }),
    ),
  );
const writeClientSettings = effect_Effect.fnUntraced(function* (input) {
  const directory = input.path.dirname(input.settingsPath);
  const suffix = (yield* effect_Random.nextUUIDv4).replace(/-/g, "");
  const tempPath = `${input.settingsPath}.${process.pid}.${suffix}.tmp`;
  const encoded = yield* encodeClientSettingsJson(input.settings);
  yield* input.fileSystem.makeDirectory(directory, { recursive: true });
  yield* input.fileSystem.writeFileString(tempPath, `${encoded}\n`);
  yield* input.fileSystem.rename(tempPath, input.settingsPath);
});
const layer$16 = effect_Layer.effect(
  DesktopClientSettings,
  effect_Effect.gen(function* () {
    const environment = yield* DesktopEnvironment;
    const fileSystem = yield* effect_FileSystem.FileSystem;
    const path = yield* effect_Path.Path;
    return DesktopClientSettings.of({
      get: readClientSettings(fileSystem, environment.clientSettingsPath).pipe(
        effect_Effect.withSpan("desktop.clientSettings.get"),
      ),
      set: (settings) =>
        writeClientSettings({
          fileSystem,
          path,
          settingsPath: environment.clientSettingsPath,
          settings,
        }).pipe(
          effect_Effect.mapError((cause) => new DesktopClientSettingsWriteError({ cause })),
          effect_Effect.withSpan("desktop.clientSettings.set"),
        ),
    });
  }),
);

//#endregion
//#region src/ipc/channels.ts
const PICK_FOLDER_CHANNEL = "desktop:pick-folder";
const CONFIRM_CHANNEL = "desktop:confirm";
const SET_THEME_CHANNEL = "desktop:set-theme";
const CONTEXT_MENU_CHANNEL = "desktop:context-menu";
const OPEN_EXTERNAL_CHANNEL = "desktop:open-external";
const MENU_ACTION_CHANNEL = "desktop:menu-action";
const UPDATE_STATE_CHANNEL = "desktop:update-state";
const UPDATE_GET_STATE_CHANNEL = "desktop:update-get-state";
const UPDATE_SET_CHANNEL_CHANNEL = "desktop:update-set-channel";
const UPDATE_DOWNLOAD_CHANNEL = "desktop:update-download";
const UPDATE_INSTALL_CHANNEL = "desktop:update-install";
const UPDATE_CHECK_CHANNEL = "desktop:update-check";
const GET_APP_BRANDING_CHANNEL = "desktop:get-app-branding";
const GET_LOCAL_ENVIRONMENT_BOOTSTRAP_CHANNEL = "desktop:get-local-environment-bootstrap";
const GET_CLIENT_SETTINGS_CHANNEL = "desktop:get-client-settings";
const SET_CLIENT_SETTINGS_CHANNEL = "desktop:set-client-settings";
const GET_SAVED_ENVIRONMENT_REGISTRY_CHANNEL = "desktop:get-saved-environment-registry";
const SET_SAVED_ENVIRONMENT_REGISTRY_CHANNEL = "desktop:set-saved-environment-registry";
const GET_SAVED_ENVIRONMENT_SECRET_CHANNEL = "desktop:get-saved-environment-secret";
const SET_SAVED_ENVIRONMENT_SECRET_CHANNEL = "desktop:set-saved-environment-secret";
const REMOVE_SAVED_ENVIRONMENT_SECRET_CHANNEL = "desktop:remove-saved-environment-secret";
const DISCOVER_SSH_HOSTS_CHANNEL = "desktop:discover-ssh-hosts";
const ENSURE_SSH_ENVIRONMENT_CHANNEL = "desktop:ensure-ssh-environment";
const DISCONNECT_SSH_ENVIRONMENT_CHANNEL = "desktop:disconnect-ssh-environment";
const FETCH_SSH_ENVIRONMENT_DESCRIPTOR_CHANNEL = "desktop:fetch-ssh-environment-descriptor";
const BOOTSTRAP_SSH_BEARER_SESSION_CHANNEL = "desktop:bootstrap-ssh-bearer-session";
const FETCH_SSH_SESSION_STATE_CHANNEL = "desktop:fetch-ssh-session-state";
const ISSUE_SSH_WEBSOCKET_TOKEN_CHANNEL = "desktop:issue-ssh-websocket-token";
const SSH_PASSWORD_PROMPT_CHANNEL = "desktop:ssh-password-prompt";
const RESOLVE_SSH_PASSWORD_PROMPT_CHANNEL = "desktop:resolve-ssh-password-prompt";
const GET_SERVER_EXPOSURE_STATE_CHANNEL = "desktop:get-server-exposure-state";
const SET_SERVER_EXPOSURE_MODE_CHANNEL = "desktop:set-server-exposure-mode";
const SET_TAILSCALE_SERVE_ENABLED_CHANNEL = "desktop:set-tailscale-serve-enabled";
const GET_ADVERTISED_ENDPOINTS_CHANNEL = "desktop:get-advertised-endpoints";

//#endregion
//#region src/ipc/methods/clientSettings.ts
const getClientSettings = makeIpcMethod({
  channel: GET_CLIENT_SETTINGS_CHANNEL,
  payload: effect_Schema.Void,
  result: effect_Schema.NullOr(ClientSettingsSchema),
  handler: effect_Effect.fn("desktop.ipc.clientSettings.get")(function* () {
    const clientSettings = yield* DesktopClientSettings;
    return effect_Option.getOrNull(yield* clientSettings.get);
  }),
});
const setClientSettings = makeIpcMethod({
  channel: SET_CLIENT_SETTINGS_CHANNEL,
  payload: ClientSettingsSchema,
  result: effect_Schema.Void,
  handler: effect_Effect.fn("desktop.ipc.clientSettings.set")(function* (settings) {
    yield* (yield* DesktopClientSettings).set(settings);
  }),
});

//#endregion
//#region src/settings/DesktopSavedEnvironments.ts
const DesktopSshTargetSchema = effect_Schema.Struct({
  alias: effect_Schema.String,
  hostname: effect_Schema.String,
  username: effect_Schema.NullOr(effect_Schema.String),
  port: effect_Schema.NullOr(effect_Schema.Number),
});
const PersistedSavedEnvironmentStorageRecordSchema = effect_Schema.Struct({
  environmentId: EnvironmentId,
  label: effect_Schema.String,
  httpBaseUrl: effect_Schema.String,
  wsBaseUrl: effect_Schema.String,
  createdAt: effect_Schema.String,
  lastConnectedAt: effect_Schema.NullOr(effect_Schema.String),
  desktopSsh: effect_Schema.optionalKey(DesktopSshTargetSchema),
  encryptedBearerToken: effect_Schema.optionalKey(effect_Schema.String),
});
const SavedEnvironmentRegistryDocumentJson = fromLenientJson(
  effect_Schema.Struct({
    version: effect_Schema.optionalKey(effect_Schema.Number),
    records: effect_Schema.optionalKey(
      effect_Schema.Array(PersistedSavedEnvironmentStorageRecordSchema),
    ),
  }),
);
const decodeSavedEnvironmentRegistryDocumentJson = effect_Schema.decodeEffect(
  SavedEnvironmentRegistryDocumentJson,
);
const encodeSavedEnvironmentRegistryDocumentJson = effect_Schema.encodeEffect(
  SavedEnvironmentRegistryDocumentJson,
);
var DesktopSavedEnvironmentsWriteError = class extends effect_Data.TaggedError(
  "DesktopSavedEnvironmentsWriteError",
) {
  get message() {
    return `Failed to write desktop saved environments: ${this.cause.message}`;
  }
};
var DesktopSavedEnvironmentSecretDecodeError = class extends effect_Data.TaggedError(
  "DesktopSavedEnvironmentSecretDecodeError",
) {
  get message() {
    return "Failed to decode desktop saved environment secret.";
  }
};
var DesktopSavedEnvironments = class extends effect_Context.Service()(
  "t3/desktop/SavedEnvironments",
) {};
function toPersistedSavedEnvironmentRecord(record) {
  const nextRecord = {
    environmentId: record.environmentId,
    label: record.label,
    httpBaseUrl: record.httpBaseUrl,
    wsBaseUrl: record.wsBaseUrl,
    createdAt: record.createdAt,
    lastConnectedAt: record.lastConnectedAt,
  };
  return record.desktopSsh
    ? {
        ...nextRecord,
        desktopSsh: record.desktopSsh,
      }
    : nextRecord;
}
function toSavedEnvironmentStorageRecord(record, encryptedBearerToken) {
  const nextRecord = {
    environmentId: record.environmentId,
    label: record.label,
    httpBaseUrl: record.httpBaseUrl,
    wsBaseUrl: record.wsBaseUrl,
    createdAt: record.createdAt,
    lastConnectedAt: record.lastConnectedAt,
  };
  const desktopSsh = record.desktopSsh;
  if (desktopSsh)
    return effect_Option.match(encryptedBearerToken, {
      onNone: () => ({
        ...nextRecord,
        desktopSsh,
      }),
      onSome: (value) => ({
        ...nextRecord,
        desktopSsh,
        encryptedBearerToken: value,
      }),
    });
  return effect_Option.match(encryptedBearerToken, {
    onNone: () => nextRecord,
    onSome: (value) => ({
      ...nextRecord,
      encryptedBearerToken: value,
    }),
  });
}
function normalizeSavedEnvironmentRegistryDocument(document) {
  return {
    version: document.version ?? 1,
    records: document.records ?? [],
  };
}
function readRegistryDocument(fileSystem, registryPath) {
  return fileSystem.readFileString(registryPath).pipe(
    effect_Effect.option,
    effect_Effect.flatMap(
      effect_Option.match({
        onNone: () =>
          effect_Effect.succeed({
            version: 1,
            records: [],
          }),
        onSome: (raw) =>
          decodeSavedEnvironmentRegistryDocumentJson(raw).pipe(
            effect_Effect.map(normalizeSavedEnvironmentRegistryDocument),
            effect_Effect.catch(() =>
              effect_Effect.succeed({
                version: 1,
                records: [],
              }),
            ),
          ),
      }),
    ),
  );
}
const writeRegistryDocument = effect_Effect.fn("desktop.savedEnvironments.writeRegistryDocument")(
  function* (input) {
    const directory = input.path.dirname(input.registryPath);
    const suffix = (yield* effect_Random.nextUUIDv4).replace(/-/g, "");
    const tempPath = `${input.registryPath}.${process.pid}.${suffix}.tmp`;
    const encoded = yield* encodeSavedEnvironmentRegistryDocumentJson(input.document);
    yield* input.fileSystem.makeDirectory(directory, { recursive: true });
    yield* input.fileSystem.writeFileString(tempPath, `${encoded}\n`);
    yield* input.fileSystem.rename(tempPath, input.registryPath);
  },
);
function preserveExistingSecrets(currentDocument, records) {
  const encryptedBearerTokenById = new Map(
    currentDocument.records.flatMap((record) =>
      record.encryptedBearerToken ? [[record.environmentId, record.encryptedBearerToken]] : [],
    ),
  );
  return {
    version: currentDocument.version,
    records: records.map((record) => {
      const encryptedBearerToken = encryptedBearerTokenById.get(record.environmentId);
      return toSavedEnvironmentStorageRecord(
        record,
        effect_Option.fromNullishOr(encryptedBearerToken),
      );
    }),
  };
}
function decodeSecretBytes(encoded) {
  return effect_Effect
    .fromResult(effect_Encoding.decodeBase64(encoded))
    .pipe(
      effect_Effect.mapError((cause) => new DesktopSavedEnvironmentSecretDecodeError({ cause })),
    );
}
const layer$15 = effect_Layer.effect(
  DesktopSavedEnvironments,
  effect_Effect.gen(function* () {
    const environment = yield* DesktopEnvironment;
    const fileSystem = yield* effect_FileSystem.FileSystem;
    const path = yield* effect_Path.Path;
    const safeStorage = yield* ElectronSafeStorage;
    const writeDocument = (document) =>
      writeRegistryDocument({
        fileSystem,
        path,
        registryPath: environment.savedEnvironmentRegistryPath,
        document,
      }).pipe(effect_Effect.mapError((cause) => new DesktopSavedEnvironmentsWriteError({ cause })));
    return DesktopSavedEnvironments.of({
      getRegistry: readRegistryDocument(fileSystem, environment.savedEnvironmentRegistryPath).pipe(
        effect_Effect.map((document) =>
          document.records.map((record) => toPersistedSavedEnvironmentRecord(record)),
        ),
        effect_Effect.withSpan("desktop.savedEnvironments.getRegistry"),
      ),
      setRegistry: effect_Effect.fn("desktop.savedEnvironments.setRegistry")(function* (records) {
        yield* writeDocument(
          preserveExistingSecrets(
            yield* readRegistryDocument(fileSystem, environment.savedEnvironmentRegistryPath),
            records,
          ),
        );
      }),
      getSecret: effect_Effect.fn("desktop.savedEnvironments.getSecret")(function* (environmentId) {
        yield* effect_Effect.annotateCurrentSpan({ environmentId });
        const document = yield* readRegistryDocument(
          fileSystem,
          environment.savedEnvironmentRegistryPath,
        );
        const encoded = effect_Option.fromNullishOr(
          document.records.find((record) => record.environmentId === environmentId)
            ?.encryptedBearerToken,
        );
        if (effect_Option.isNone(encoded) || !(yield* safeStorage.isEncryptionAvailable))
          return effect_Option.none();
        const secretBytes = yield* decodeSecretBytes(encoded.value);
        return effect_Option.some(yield* safeStorage.decryptString(secretBytes));
      }),
      setSecret: effect_Effect.fn("desktop.savedEnvironments.setSecret")(function* (input) {
        const { environmentId, secret } = input;
        yield* effect_Effect.annotateCurrentSpan({ environmentId });
        const document = yield* readRegistryDocument(
          fileSystem,
          environment.savedEnvironmentRegistryPath,
        );
        if (!(yield* safeStorage.isEncryptionAvailable)) return false;
        const encryptedBearerToken = effect_Encoding.encodeBase64(
          yield* safeStorage.encryptString(secret),
        );
        let found = false;
        const nextDocument = {
          version: document.version,
          records: document.records.map((record) => {
            if (record.environmentId !== environmentId) return record;
            found = true;
            return toSavedEnvironmentStorageRecord(
              record,
              effect_Option.some(encryptedBearerToken),
            );
          }),
        };
        if (found) yield* writeDocument(nextDocument);
        return found;
      }),
      removeSecret: effect_Effect.fn("desktop.savedEnvironments.removeSecret")(
        function* (environmentId) {
          yield* effect_Effect.annotateCurrentSpan({ environmentId });
          const document = yield* readRegistryDocument(
            fileSystem,
            environment.savedEnvironmentRegistryPath,
          );
          if (
            !document.records.some(
              (record) =>
                record.environmentId === environmentId && record.encryptedBearerToken !== void 0,
            )
          )
            return;
          yield* writeDocument({
            version: document.version,
            records: document.records.map((record) => {
              if (record.environmentId !== environmentId) return record;
              return toPersistedSavedEnvironmentRecord(record);
            }),
          });
        },
      ),
    });
  }),
);

//#endregion
//#region src/ipc/methods/savedEnvironments.ts
const SavedEnvironmentRegistryPayload = effect_Schema.Array(PersistedSavedEnvironmentRecordSchema);
const NonBlankString = effect_Schema.String.check(
  effect_Schema.makeFilter((value) =>
    value.trim().length > 0 ? void 0 : "Expected a non-empty string",
  ),
);
const SetSavedEnvironmentSecretInput = effect_Schema.Struct({
  environmentId: EnvironmentId,
  secret: NonBlankString,
});
const getSavedEnvironmentRegistry = makeIpcMethod({
  channel: GET_SAVED_ENVIRONMENT_REGISTRY_CHANNEL,
  payload: effect_Schema.Void,
  result: SavedEnvironmentRegistryPayload,
  handler: effect_Effect.fn("desktop.ipc.savedEnvironments.getRegistry")(function* () {
    return yield* (yield* DesktopSavedEnvironments).getRegistry;
  }),
});
const setSavedEnvironmentRegistry = makeIpcMethod({
  channel: SET_SAVED_ENVIRONMENT_REGISTRY_CHANNEL,
  payload: SavedEnvironmentRegistryPayload,
  result: effect_Schema.Void,
  handler: effect_Effect.fn("desktop.ipc.savedEnvironments.setRegistry")(function* (records) {
    yield* (yield* DesktopSavedEnvironments).setRegistry(records);
  }),
});
const getSavedEnvironmentSecret = makeIpcMethod({
  channel: GET_SAVED_ENVIRONMENT_SECRET_CHANNEL,
  payload: EnvironmentId,
  result: effect_Schema.NullOr(effect_Schema.String),
  handler: effect_Effect.fn("desktop.ipc.savedEnvironments.getSecret")(function* (environmentId) {
    const savedEnvironments = yield* DesktopSavedEnvironments;
    return effect_Option.getOrNull(yield* savedEnvironments.getSecret(environmentId));
  }),
});
const setSavedEnvironmentSecret = makeIpcMethod({
  channel: SET_SAVED_ENVIRONMENT_SECRET_CHANNEL,
  payload: SetSavedEnvironmentSecretInput,
  result: effect_Schema.Boolean,
  handler: effect_Effect.fn("desktop.ipc.savedEnvironments.setSecret")(function* ({
    environmentId,
    secret,
  }) {
    return yield* (yield* DesktopSavedEnvironments).setSecret({
      environmentId,
      secret,
    });
  }),
});
const removeSavedEnvironmentSecret = makeIpcMethod({
  channel: REMOVE_SAVED_ENVIRONMENT_SECRET_CHANNEL,
  payload: EnvironmentId,
  result: effect_Schema.Void,
  handler: effect_Effect.fn("desktop.ipc.savedEnvironments.removeSecret")(
    function* (environmentId) {
      yield* (yield* DesktopSavedEnvironments).removeSecret(environmentId);
    },
  ),
});

//#endregion
//#region ../../packages/shared/src/logging.ts
var RotatingFileSink = class {
  filePath;
  maxBytes;
  maxFiles;
  throwOnError;
  currentSize = 0;
  constructor(options) {
    if (options.maxBytes < 1)
      throw new Error(`maxBytes must be >= 1 (received ${options.maxBytes})`);
    if (options.maxFiles < 1)
      throw new Error(`maxFiles must be >= 1 (received ${options.maxFiles})`);
    this.filePath = options.filePath;
    this.maxBytes = options.maxBytes;
    this.maxFiles = options.maxFiles;
    this.throwOnError = options.throwOnError ?? false;
    node_fs.default.mkdirSync(node_path.default.dirname(this.filePath), { recursive: true });
    this.pruneOverflowBackups();
    this.currentSize = this.readCurrentSize();
  }
  write(chunk) {
    const buffer = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
    if (buffer.length === 0) return;
    try {
      if (this.currentSize > 0 && this.currentSize + buffer.length > this.maxBytes) this.rotate();
      node_fs.default.appendFileSync(this.filePath, buffer);
      this.currentSize += buffer.length;
      if (this.currentSize > this.maxBytes) this.rotate();
    } catch {
      this.currentSize = this.readCurrentSize();
      if (this.throwOnError) throw new Error(`Failed to write log chunk to ${this.filePath}`);
    }
  }
  rotate() {
    try {
      const oldest = this.withSuffix(this.maxFiles);
      if (node_fs.default.existsSync(oldest)) node_fs.default.rmSync(oldest, { force: true });
      for (let index = this.maxFiles - 1; index >= 1; index -= 1) {
        const source = this.withSuffix(index);
        const target = this.withSuffix(index + 1);
        if (node_fs.default.existsSync(source)) node_fs.default.renameSync(source, target);
      }
      if (node_fs.default.existsSync(this.filePath))
        node_fs.default.renameSync(this.filePath, this.withSuffix(1));
      this.currentSize = 0;
    } catch {
      this.currentSize = this.readCurrentSize();
      if (this.throwOnError) throw new Error(`Failed to rotate log file ${this.filePath}`);
    }
  }
  pruneOverflowBackups() {
    try {
      const dir = node_path.default.dirname(this.filePath);
      const baseName = node_path.default.basename(this.filePath);
      for (const entry of node_fs.default.readdirSync(dir)) {
        if (!entry.startsWith(`${baseName}.`)) continue;
        const suffix = Number(entry.slice(baseName.length + 1));
        if (!Number.isInteger(suffix) || suffix <= this.maxFiles) continue;
        node_fs.default.rmSync(node_path.default.join(dir, entry), { force: true });
      }
    } catch {
      if (this.throwOnError) throw new Error(`Failed to prune log backups for ${this.filePath}`);
    }
  }
  readCurrentSize() {
    try {
      return node_fs.default.statSync(this.filePath).size;
    } catch {
      return 0;
    }
  }
  withSuffix(index) {
    return `${this.filePath}.${index}`;
  }
};

//#endregion
//#region ../../packages/shared/src/observability.ts
const FLUSH_BUFFER_THRESHOLD = 32;
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function markSeen(value, seen) {
  if (seen.has(value)) return true;
  seen.add(value);
  return false;
}
function normalizeJsonValue(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (
    value === null ||
    value === void 0 ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  )
    return value ?? null;
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? "Invalid Date" : value.toISOString();
  if (value instanceof Error)
    return {
      name: value.name,
      message: value.message,
      ...(value.stack ? { stack: value.stack } : {}),
    };
  if (Array.isArray(value)) {
    if (markSeen(value, seen)) return "[Circular]";
    return value.map((entry) => normalizeJsonValue(entry, seen));
  }
  if (value instanceof Map) {
    if (markSeen(value, seen)) return "[Circular]";
    return Object.fromEntries(
      Array.from(value.entries(), ([key, entryValue]) => [
        String(key),
        normalizeJsonValue(entryValue, seen),
      ]),
    );
  }
  if (value instanceof Set) {
    if (markSeen(value, seen)) return "[Circular]";
    return Array.from(value.values(), (entry) => normalizeJsonValue(entry, seen));
  }
  if (!isPlainObject(value)) return String(value);
  if (markSeen(value, seen)) return "[Circular]";
  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [key, normalizeJsonValue(entryValue, seen)]),
  );
}
function compactTraceAttributes(attributes) {
  return Object.fromEntries(
    Object.entries(attributes)
      .filter(([, value]) => value !== void 0)
      .map(([key, value]) => [key, normalizeJsonValue(value)]),
  );
}
function formatTraceExit(exit) {
  if (effect_Exit.isSuccess(exit)) return { _tag: "Success" };
  if (effect_Cause.hasInterruptsOnly(exit.cause))
    return {
      _tag: "Interrupted",
      cause: effect_Cause.pretty(exit.cause),
    };
  return {
    _tag: "Failure",
    cause: effect_Cause.pretty(exit.cause),
  };
}
function spanToTraceRecord(span) {
  const status = span.status;
  const parentSpanId = effect_Option.getOrUndefined(span.parent)?.spanId;
  return {
    type: "effect-span",
    name: span.name,
    traceId: span.traceId,
    spanId: span.spanId,
    ...(parentSpanId ? { parentSpanId } : {}),
    sampled: span.sampled,
    kind: span.kind,
    startTimeUnixNano: String(status.startTime),
    endTimeUnixNano: String(status.endTime),
    durationMs: Number(status.endTime - status.startTime) / 1e6,
    attributes: compactTraceAttributes(Object.fromEntries(span.attributes)),
    events: span.events.map(([name, startTime, attributes]) => ({
      name,
      timeUnixNano: String(startTime),
      attributes: compactTraceAttributes(attributes),
    })),
    links: span.links.map((link) => ({
      traceId: link.span.traceId,
      spanId: link.span.spanId,
      attributes: compactTraceAttributes(link.attributes),
    })),
    exit: formatTraceExit(status.exit),
  };
}
const makeTraceSink = effect_Effect.fn("makeTraceSink")(function* (options) {
  const sink = new RotatingFileSink({
    filePath: options.filePath,
    maxBytes: options.maxBytes,
    maxFiles: options.maxFiles,
  });
  let buffer = [];
  const flushUnsafe = () => {
    if (buffer.length === 0) return;
    const chunk = buffer.join("");
    buffer = [];
    try {
      sink.write(chunk);
    } catch {
      buffer.unshift(chunk);
    }
  };
  const flush = effect_Effect.sync(flushUnsafe).pipe(effect_Effect.withTracerEnabled(false));
  yield* effect_Effect.addFinalizer(() => flush.pipe(effect_Effect.ignore));
  yield* effect_Effect.forkScoped(
    effect_Effect
      .sleep(`${options.batchWindowMs} millis`)
      .pipe(effect_Effect.andThen(flush), effect_Effect.forever),
  );
  return {
    filePath: options.filePath,
    push(record) {
      try {
        buffer.push(`${JSON.stringify(record)}\n`);
        if (buffer.length >= FLUSH_BUFFER_THRESHOLD) flushUnsafe();
      } catch {
        return;
      }
    },
    flush,
    close: () => flush,
  };
});
var LocalFileSpan = class {
  _tag = "Span";
  name;
  spanId;
  traceId;
  parent;
  annotations;
  links;
  sampled;
  kind;
  status;
  attributes;
  events;
  delegate;
  push;
  constructor(options, delegate, push) {
    this.delegate = delegate;
    this.push = push;
    this.name = delegate.name;
    this.spanId = delegate.spanId;
    this.traceId = delegate.traceId;
    this.parent = options.parent;
    this.annotations = options.annotations;
    this.links = [...options.links];
    this.sampled = delegate.sampled;
    this.kind = delegate.kind;
    this.status = {
      _tag: "Started",
      startTime: options.startTime,
    };
    this.attributes = /* @__PURE__ */ new Map();
    this.events = [];
  }
  end(endTime, exit) {
    this.status = {
      _tag: "Ended",
      startTime: this.status.startTime,
      endTime,
      exit,
    };
    this.delegate.end(endTime, exit);
    if (this.sampled) this.push(spanToTraceRecord(this));
  }
  attribute(key, value) {
    this.attributes.set(key, value);
    this.delegate.attribute(key, value);
  }
  event(name, startTime, attributes) {
    const nextAttributes = attributes ?? {};
    this.events.push([name, startTime, nextAttributes]);
    this.delegate.event(name, startTime, nextAttributes);
  }
  addLinks(links) {
    this.links.push(...links);
    this.delegate.addLinks(links);
  }
};
const makeLocalFileTracer = effect_Effect.fn("makeLocalFileTracer")(function* (options) {
  const sink =
    options.sink ??
    (yield* makeTraceSink({
      filePath: options.filePath,
      maxBytes: options.maxBytes,
      maxFiles: options.maxFiles,
      batchWindowMs: options.batchWindowMs,
    }));
  const delegate =
    options.delegate ??
    effect_Tracer.make({ span: (spanOptions) => new effect_Tracer.NativeSpan(spanOptions) });
  return effect_Tracer.make({
    span(spanOptions) {
      return new LocalFileSpan(spanOptions, delegate.span(spanOptions), sink.push);
    },
    ...(delegate.context ? { context: delegate.context } : {}),
  });
});

//#endregion
//#region ../../packages/shared/src/model.ts
const DEFAULT_PROVIDER_DRIVER_KIND = ProviderDriverKind.make("codex");

//#endregion
//#region ../../packages/shared/src/serverSettings.ts
const ServerSettingsJson = fromLenientJson(ServerSettings);
const decodeServerSettingsJson = effect_Schema.decodeUnknownOption(ServerSettingsJson);
function normalizePersistedServerSettingString(value) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : void 0;
}
function extractPersistedServerObservabilitySettings(input) {
  return {
    otlpTracesUrl: normalizePersistedServerSettingString(input.observability?.otlpTracesUrl),
    otlpMetricsUrl: normalizePersistedServerSettingString(input.observability?.otlpMetricsUrl),
  };
}
function parsePersistedServerObservabilitySettings(raw) {
  const decoded = decodeServerSettingsJson(raw);
  if (effect_Option.isSome(decoded))
    return extractPersistedServerObservabilitySettings(decoded.value);
  return {
    otlpTracesUrl: void 0,
    otlpMetricsUrl: void 0,
  };
}

//#endregion
//#region src/app/DesktopObservability.ts
const DESKTOP_LOG_FILE_MAX_BYTES = 10 * 1024 * 1024;
const DESKTOP_LOG_FILE_MAX_FILES = 10;
const DESKTOP_BACKEND_CHILD_LOG_FIBER_ID = "#backend-child";
const DESKTOP_TRACE_BATCH_WINDOW_MS = 200;
var DesktopBackendOutputLog = class extends effect_Context.Service()(
  "t3/desktop/BackendOutputLog",
) {};
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
function makeComponentLogger(component) {
  const annotate = (effect, annotations) =>
    effect.pipe(
      effect_Effect.annotateLogs({
        component,
        ...annotations,
      }),
    );
  return {
    annotate,
    logDebug: (message, annotations) => annotate(effect_Effect.logDebug(message), annotations),
    logInfo: (message, annotations) => annotate(effect_Effect.logInfo(message), annotations),
    logWarning: (message, annotations) => annotate(effect_Effect.logWarning(message), annotations),
    logError: (message, annotations) => annotate(effect_Effect.logError(message), annotations),
  };
}
var DesktopLogFileWriterConfigurationError = class extends effect_Data.TaggedError(
  "DesktopLogFileWriterConfigurationError",
) {
  get message() {
    return `${this.option} must be >= 1 (received ${this.value})`;
  }
};
const sanitizeLogValue = (value) => value.replace(/\s+/g, " ").trim();
const DesktopBackendChildLogRecord = effect_Schema.Struct({
  message: effect_Schema.String,
  level: effect_Schema.Literals(["INFO", "ERROR"]),
  timestamp: effect_Schema.String,
  annotations: effect_Schema.Record(effect_Schema.String, effect_Schema.Unknown),
  spans: effect_Schema.Record(effect_Schema.String, effect_Schema.Unknown),
  fiberId: effect_Schema.String,
});
const encodeDesktopBackendChildLogRecord = effect_Schema.encodeEffect(
  effect_Schema.fromJsonString(DesktopBackendChildLogRecord),
);
const DesktopBackendOutputLogNoop = {
  writeSessionBoundary: () => effect_Effect.void,
  writeOutputChunk: () => effect_Effect.void,
};
const currentDesktopRunId = effect_Effect.gen(function* () {
  const runId = (yield* effect_References.CurrentLogAnnotations).runId;
  return typeof runId === "string" && runId.length > 0 ? runId : "unknown";
});
const refreshFileSize = (fileSystem, filePath) =>
  fileSystem.stat(filePath).pipe(
    effect_Effect.map((stat) => Number(stat.size)),
    effect_Effect.orElseSucceed(() => 0),
  );
const makeRotatingLogFileWriter = effect_Effect.fn("makeRotatingLogFileWriter")(function* (input) {
  const fileSystem = yield* effect_FileSystem.FileSystem;
  const path = yield* effect_Path.Path;
  const maxBytes = input.maxBytes ?? DESKTOP_LOG_FILE_MAX_BYTES;
  const maxFiles = input.maxFiles ?? DESKTOP_LOG_FILE_MAX_FILES;
  const directory = path.dirname(input.filePath);
  const baseName = path.basename(input.filePath);
  if (maxBytes < 1)
    return yield* new DesktopLogFileWriterConfigurationError({
      option: "maxBytes",
      value: maxBytes,
    });
  if (maxFiles < 1)
    return yield* new DesktopLogFileWriterConfigurationError({
      option: "maxFiles",
      value: maxFiles,
    });
  yield* fileSystem.makeDirectory(directory, { recursive: true });
  const withSuffix = (index) => `${input.filePath}.${index}`;
  const currentSize = yield* effect_Ref.make(yield* refreshFileSize(fileSystem, input.filePath));
  const mutex = yield* effect_Semaphore.make(1);
  const pruneOverflowBackups = effect_Effect.gen(function* () {
    const entries = yield* fileSystem
      .readDirectory(directory)
      .pipe(effect_Effect.orElseSucceed(() => []));
    for (const entry of entries) {
      if (!entry.startsWith(`${baseName}.`)) continue;
      const suffix = Number(entry.slice(baseName.length + 1));
      if (!Number.isInteger(suffix) || suffix <= maxFiles) continue;
      yield* fileSystem
        .remove(path.join(directory, entry), { force: true })
        .pipe(effect_Effect.ignore);
    }
  });
  const rotate = effect_Effect
    .gen(function* () {
      yield* fileSystem.remove(withSuffix(maxFiles), { force: true }).pipe(effect_Effect.ignore);
      for (let index = maxFiles - 1; index >= 1; index -= 1) {
        const source = withSuffix(index);
        if (yield* fileSystem.exists(source).pipe(effect_Effect.orElseSucceed(() => false)))
          yield* fileSystem.rename(source, withSuffix(index + 1));
      }
      if (yield* fileSystem.exists(input.filePath).pipe(effect_Effect.orElseSucceed(() => false)))
        yield* fileSystem.rename(input.filePath, withSuffix(1));
      yield* effect_Ref.set(currentSize, 0);
    })
    .pipe(
      effect_Effect.catch(() =>
        refreshFileSize(fileSystem, input.filePath).pipe(
          effect_Effect.flatMap((size) => effect_Ref.set(currentSize, size)),
        ),
      ),
    );
  const writeBytes = (chunk) => {
    if (chunk.byteLength === 0) return effect_Effect.void;
    return mutex.withPermits(1)(
      effect_Effect
        .gen(function* () {
          const beforeSize = yield* effect_Ref.get(currentSize);
          if (beforeSize > 0 && beforeSize + chunk.byteLength > maxBytes) yield* rotate;
          yield* fileSystem.writeFile(input.filePath, chunk, { flag: "a" });
          const afterSize = (yield* effect_Ref.get(currentSize)) + chunk.byteLength;
          yield* effect_Ref.set(currentSize, afterSize);
          if (afterSize > maxBytes) yield* rotate;
        })
        .pipe(
          effect_Effect.catch(() =>
            refreshFileSize(fileSystem, input.filePath).pipe(
              effect_Effect.flatMap((size) => effect_Ref.set(currentSize, size)),
            ),
          ),
        ),
    );
  };
  yield* pruneOverflowBackups;
  return {
    writeBytes,
    writeText: (chunk) => writeBytes(textEncoder.encode(chunk)),
  };
});
const readPersistedOtlpTracesUrl = effect_Effect.gen(function* () {
  const fileSystem = yield* effect_FileSystem.FileSystem;
  const environment = yield* DesktopEnvironment;
  const raw = yield* fileSystem
    .readFileString(environment.serverSettingsPath)
    .pipe(effect_Effect.option);
  if (effect_Option.isNone(raw)) return effect_Option.none();
  const parsed = parsePersistedServerObservabilitySettings(raw.value);
  return effect_Option.fromNullishOr(parsed.otlpTracesUrl);
});
const resolveOtlpTracesUrl = effect_Effect.gen(function* () {
  const environment = yield* DesktopEnvironment;
  if (effect_Option.isSome(environment.otlpTracesUrl)) return environment.otlpTracesUrl;
  return yield* readPersistedOtlpTracesUrl;
});
const writeDevelopmentConsoleOutput = (streamName, chunk) =>
  effect_Effect
    .sync(() => {
      (streamName === "stderr" ? process.stderr : process.stdout).write(chunk);
    })
    .pipe(effect_Effect.ignore);
const writeBackendChildLogRecord = effect_Effect.fn(
  "desktop.observability.writeBackendChildLogRecord",
)(function* (logFile, input) {
  return yield* effect_Effect
    .gen(function* () {
      const timestamp = effect_DateTime.formatIso(yield* effect_DateTime.now);
      const encoded = yield* encodeDesktopBackendChildLogRecord({
        message: input.message,
        level: input.level,
        timestamp,
        annotations: input.annotations,
        spans: {},
        fiberId: DESKTOP_BACKEND_CHILD_LOG_FIBER_ID,
      });
      yield* logFile.writeText(`${encoded}\n`);
    })
    .pipe(effect_Effect.ignore({ log: true }));
});
const backendOutputLogLayer = effect_Layer.effect(
  DesktopBackendOutputLog,
  effect_Effect.gen(function* () {
    const environment = yield* DesktopEnvironment;
    const writer = yield* makeRotatingLogFileWriter({
      filePath: environment.path.join(environment.logDir, "server-child.log"),
    }).pipe(effect_Effect.option);
    return effect_Option.match(writer, {
      onNone: () => DesktopBackendOutputLogNoop,
      onSome: (logFile) => ({
        writeSessionBoundary: effect_Effect.fn(
          "desktop.observability.backendOutput.writeSessionBoundary",
        )(function* ({ phase, details }) {
          const runId = yield* currentDesktopRunId;
          yield* writeBackendChildLogRecord(logFile, {
            message: `backend child process session ${phase.toLowerCase()}`,
            level: "INFO",
            annotations: {
              component: "desktop-backend-child",
              runId,
              phase,
              details: sanitizeLogValue(details),
            },
          });
        }),
        writeOutputChunk: effect_Effect.fn("desktop.observability.backendOutput.writeOutputChunk")(
          function* (streamName, chunk) {
            if (environment.isDevelopment) yield* writeDevelopmentConsoleOutput(streamName, chunk);
            const runId = yield* currentDesktopRunId;
            yield* writeBackendChildLogRecord(logFile, {
              message: "backend child process output",
              level: streamName === "stderr" ? "ERROR" : "INFO",
              annotations: {
                component: "desktop-backend-child",
                runId,
                stream: streamName,
                text: textDecoder.decode(chunk),
              },
            });
          },
        ),
      }),
    });
  }),
);
const desktopLoggerLayer = effect_Layer.mergeAll(
  effect_Logger.layer([effect_Logger.consolePretty(), effect_Logger.tracerLogger], {
    mergeWithExisting: false,
  }),
  effect_Layer.succeed(effect_References.MinimumLogLevel, "Info"),
);
const tracerLayer = effect_Layer
  .unwrap(
    effect_Effect.gen(function* () {
      const environment = yield* DesktopEnvironment;
      const otlpTracesUrl = yield* resolveOtlpTracesUrl;
      const tracePath = environment.path.join(environment.logDir, "desktop.trace.ndjson");
      const sink = yield* makeTraceSink({
        filePath: tracePath,
        maxBytes: DESKTOP_LOG_FILE_MAX_BYTES,
        maxFiles: DESKTOP_LOG_FILE_MAX_FILES,
        batchWindowMs: DESKTOP_TRACE_BATCH_WINDOW_MS,
      });
      const delegate = effect_Option.isNone(otlpTracesUrl)
        ? void 0
        : yield* effect_unstable_observability.OtlpTracer.make({
            url: otlpTracesUrl.value,
            exportInterval: `${environment.otlpExportIntervalMs} millis`,
            resource: {
              serviceName: "desktop",
              attributes: {
                "service.runtime": "desktop",
                "service.mode": environment.isDevelopment ? "development" : "packaged",
              },
            },
          });
      const tracer = yield* makeLocalFileTracer({
        filePath: tracePath,
        maxBytes: DESKTOP_LOG_FILE_MAX_BYTES,
        maxFiles: DESKTOP_LOG_FILE_MAX_FILES,
        batchWindowMs: DESKTOP_TRACE_BATCH_WINDOW_MS,
        sink,
        ...(delegate ? { delegate } : {}),
      });
      return effect_Layer.succeed(effect_Tracer.Tracer, tracer);
    }),
  )
  .pipe(effect_Layer.provideMerge(effect_unstable_observability.OtlpSerialization.layerJson));
const layer$14 = effect_Layer.mergeAll(
  backendOutputLogLayer,
  desktopLoggerLayer,
  tracerLayer,
  effect_Layer.succeed(effect_Tracer.MinimumTraceLevel, "Info"),
  effect_Layer.succeed(effect_References.TracerTimingEnabled, true),
);

//#endregion
//#region src/app/DesktopState.ts
var DesktopState = class extends effect_Context.Service()("t3/desktop/State") {};
const layer$13 = effect_Layer.effect(
  DesktopState,
  effect_Effect.all({
    backendReady: effect_Ref.make(false),
    quitting: effect_Ref.make(false),
  }),
);

//#endregion
//#region src/app/DesktopAssets.ts
var DesktopAssets = class extends effect_Context.Service()("t3/desktop/Assets") {};
const resolveResourcePath = effect_Effect.fn("desktop.assets.resolveResourcePath")(
  function* (fileName) {
    const fileSystem = yield* effect_FileSystem.FileSystem;
    const candidates = (yield* DesktopEnvironment).resolveResourcePathCandidates(fileName);
    for (const candidate of candidates)
      if (yield* fileSystem.exists(candidate).pipe(effect_Effect.orElseSucceed(() => false)))
        return effect_Option.some(candidate);
    return effect_Option.none();
  },
);
const resolveIconPath = effect_Effect.fn("desktop.assets.resolveIconPath")(function* (ext) {
  const fileSystem = yield* effect_FileSystem.FileSystem;
  const environment = yield* DesktopEnvironment;
  if (environment.isDevelopment && process.platform === "darwin" && ext === "png") {
    const developmentDockIconPath = environment.developmentDockIconPath;
    if (
      yield* fileSystem
        .exists(developmentDockIconPath)
        .pipe(effect_Effect.orElseSucceed(() => false))
    )
      return effect_Option.some(developmentDockIconPath);
  }
  return yield* resolveResourcePath(`icon.${ext}`);
});
const make$8 = effect_Effect.gen(function* () {
  const context = yield* effect_Effect.context();
  const [ico, icns, png] = yield* effect_Effect.all(
    [resolveIconPath("ico"), resolveIconPath("icns"), resolveIconPath("png")],
    { concurrency: "unbounded" },
  );
  const iconPaths = {
    ico,
    icns,
    png,
  };
  return DesktopAssets.of({
    iconPaths: effect_Effect.succeed(iconPaths),
    resolveResourcePath: effect_Effect.fn("desktop.assets.resolveResourcePath.scoped")(
      function* (fileName) {
        return yield* resolveResourcePath(fileName).pipe(effect_Effect.provide(context));
      },
    ),
  });
});
const layer$12 = effect_Layer.effect(DesktopAssets, make$8);

//#endregion
//#region ../../packages/shared/src/advertisedEndpoint.ts
function normalizeHttpBaseUrl(rawValue) {
  const url = new URL(rawValue);
  if (url.protocol === "ws:") url.protocol = "http:";
  else if (url.protocol === "wss:") url.protocol = "https:";
  if (url.protocol !== "http:" && url.protocol !== "https:")
    throw new Error(`Endpoint must use HTTP or HTTPS. Received ${url.protocol}`);
  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url.toString();
}
function deriveWsBaseUrl(httpBaseUrl) {
  const url = new URL(normalizeHttpBaseUrl(httpBaseUrl));
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}
function classifyHostedHttpsCompatibility(httpBaseUrl, fallback = "unknown") {
  if (new URL(normalizeHttpBaseUrl(httpBaseUrl)).protocol === "http:")
    return "mixed-content-blocked";
  return fallback === "mixed-content-blocked" ? "unknown" : fallback;
}
function createAdvertisedEndpoint(input) {
  const httpBaseUrl = normalizeHttpBaseUrl(input.httpBaseUrl);
  return {
    id: input.id,
    label: input.label,
    provider: input.provider,
    httpBaseUrl,
    wsBaseUrl: deriveWsBaseUrl(httpBaseUrl),
    reachability: input.reachability,
    compatibility: {
      hostedHttpsApp:
        input.hostedHttpsCompatibility ?? classifyHostedHttpsCompatibility(httpBaseUrl),
      desktopApp: input.desktopCompatibility ?? "compatible",
    },
    source: input.source,
    status: input.status ?? "available",
    ...(input.isDefault === void 0 ? {} : { isDefault: input.isDefault }),
    ...(input.description === void 0 ? {} : { description: input.description }),
  };
}

//#endregion
//#region ../../packages/tailscale/src/tailscale.ts
const DEFAULT_TAILSCALE_SERVE_PORT = 443;
const TAILSCALE_STATUS_TIMEOUT_MS = 1500;
const TAILSCALE_PROBE_TIMEOUT_MS = 2500;
var TailscaleCommandError = class extends effect_Data.TaggedError("TailscaleCommandError") {};
var TailscaleStatusParseError = class extends effect_Data.TaggedError(
  "TailscaleStatusParseError",
) {};
const TailscaleStatusSelf = effect_Schema.Struct({
  DNSName: effect_Schema.optional(effect_Schema.Unknown),
  TailscaleIPs: effect_Schema.optional(effect_Schema.Unknown),
});
const TailscaleStatusJson = effect_Schema.Struct({
  Self: effect_Schema.optional(TailscaleStatusSelf),
});
const collectStdout = (stream) =>
  stream.pipe(
    effect_Stream.decodeText(),
    effect_Stream.runFold(
      () => "",
      (acc, chunk) => acc + chunk,
    ),
  );
const collectStderr = collectStdout;
const tailscaleCommandError = (args, message, exitCode, stderr = "") =>
  new TailscaleCommandError({
    command: ["tailscale", ...args],
    message,
    exitCode,
    stderr,
  });
const decodeTailscaleStatusJson = effect_Schema.decodeEffect(
  effect_Schema.fromJsonString(TailscaleStatusJson),
);
function normalizeMagicDnsName(status) {
  const dnsName = status.Self?.DNSName;
  if (typeof dnsName !== "string") return null;
  const normalized = dnsName.trim().replace(/\.$/u, "");
  return normalized.length > 0 ? normalized : null;
}
const parseTailscaleMagicDnsName = (rawStatusJson) =>
  decodeTailscaleStatusJson(rawStatusJson).pipe(
    effect_Effect.mapError((cause) => new TailscaleStatusParseError({ cause })),
    effect_Effect.map(normalizeMagicDnsName),
  );
function isTailscaleIpv4Address(address) {
  const parts = address.split(".");
  if (parts.length !== 4) return false;
  const [first, second, third, fourth] = parts.map((part) => Number.parseInt(part, 10));
  if (
    first === void 0 ||
    second === void 0 ||
    third === void 0 ||
    fourth === void 0 ||
    [first, second, third, fourth].some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  )
    return false;
  return first === 100 && second >= 64 && second <= 127;
}
const parseTailscaleStatus = (rawStatusJson) =>
  decodeTailscaleStatusJson(rawStatusJson).pipe(
    effect_Effect.mapError((cause) => new TailscaleStatusParseError({ cause })),
    effect_Effect.map((parsed) => {
      const rawIps = parsed.Self?.TailscaleIPs;
      const tailnetIpv4Addresses = Array.isArray(rawIps)
        ? rawIps.filter((address) => typeof address === "string").filter(isTailscaleIpv4Address)
        : [];
      return {
        magicDnsName: normalizeMagicDnsName(parsed),
        tailnetIpv4Addresses,
      };
    }),
  );
const readTailscaleStatus = effect_Effect
  .gen(function* () {
    const args = ["status", "--json"];
    const child = yield* (yield* effect_unstable_process.ChildProcessSpawner.ChildProcessSpawner)
      .spawn(
        effect_unstable_process.ChildProcess.make("tailscale", args, {
          shell: process.platform === "win32",
        }),
      )
      .pipe(
        effect_Effect.mapError((cause) =>
          tailscaleCommandError(
            args,
            cause instanceof Error ? cause.message : "Failed to spawn tailscale status.",
            null,
          ),
        ),
      );
    const [stdout, stderr, exitCode] = yield* effect_Effect
      .all(
        [
          collectStdout(child.stdout),
          collectStderr(child.stderr),
          child.exitCode.pipe(effect_Effect.map(Number)),
        ],
        { concurrency: "unbounded" },
      )
      .pipe(
        effect_Effect.mapError((cause) =>
          tailscaleCommandError(
            args,
            cause instanceof Error ? cause.message : "Failed to run tailscale status.",
            null,
          ),
        ),
      );
    if (exitCode !== 0)
      return yield* tailscaleCommandError(
        args,
        `Tailscale status exited with code ${exitCode}.`,
        exitCode,
        stderr,
      );
    return yield* parseTailscaleStatus(stdout);
  })
  .pipe(
    effect_Effect.scoped,
    effect_Effect.timeoutOption(TAILSCALE_STATUS_TIMEOUT_MS),
    effect_Effect.flatMap((result) =>
      effect_Option.match(result, {
        onNone: () =>
          effect_Effect.fail(
            tailscaleCommandError(["status", "--json"], "Tailscale status timed out.", null),
          ),
        onSome: effect_Effect.succeed,
      }),
    ),
  );
function buildTailscaleHttpsBaseUrl(input) {
  const url = new URL(`https://${input.magicDnsName}`);
  const servePort = input.servePort ?? DEFAULT_TAILSCALE_SERVE_PORT;
  if (servePort !== DEFAULT_TAILSCALE_SERVE_PORT) url.port = String(servePort);
  url.pathname = "/";
  return url.toString();
}
const probeTailscaleHttpsEndpoint = (input) =>
  effect_Effect
    .gen(function* () {
      const client = yield* effect_unstable_http.HttpClient.HttpClient;
      const response = yield* effect_Effect
        .gen(function* () {
          const url = new URL("/.well-known/t3/environment", input.baseUrl);
          const request = effect_unstable_http.HttpClientRequest.get(url.toString());
          return yield* client.execute(request);
        })
        .pipe(effect_Effect.timeoutOption(input.timeoutMs ?? TAILSCALE_PROBE_TIMEOUT_MS));
      return effect_Option.match(response, {
        onNone: () => false,
        onSome: (httpResponse) => httpResponse.status >= 200 && httpResponse.status < 300,
      });
    })
    .pipe(effect_Effect.catch(() => effect_Effect.succeed(false)));

//#endregion
//#region src/backend/tailscaleEndpointProvider.ts
const TAILSCALE_ENDPOINT_PROVIDER = {
  id: "tailscale",
  label: "Tailscale",
  kind: "private-network",
  isAddon: true,
};
function resolveTailscaleIpAdvertisedEndpoints(input) {
  const seen = /* @__PURE__ */ new Set();
  const endpoints = [];
  for (const interfaceAddresses of Object.values(input.networkInterfaces)) {
    if (!interfaceAddresses) continue;
    for (const address of interfaceAddresses) {
      if (address.internal) continue;
      if (address.family !== "IPv4") continue;
      if (!isTailscaleIpv4Address(address.address)) continue;
      if (seen.has(address.address)) continue;
      seen.add(address.address);
      endpoints.push(
        createAdvertisedEndpoint({
          provider: TAILSCALE_ENDPOINT_PROVIDER,
          source: "desktop-addon",
          id: `tailscale-ip:http://${address.address}:${input.port}`,
          label: "Tailscale IP",
          httpBaseUrl: `http://${address.address}:${input.port}`,
          reachability: "private-network",
          status: "available",
          description: "Reachable from devices on the same Tailnet.",
        }),
      );
    }
  }
  return endpoints;
}
const resolveTailscaleMagicDnsAdvertisedEndpoint = effect_Effect.fn(
  "resolveTailscaleMagicDnsAdvertisedEndpoint",
)(function* (input) {
  if (!input.dnsName) return effect_Option.none();
  const httpBaseUrl = buildTailscaleHttpsBaseUrl({
    magicDnsName: input.dnsName,
    ...(input.servePort === void 0 ? {} : { servePort: input.servePort }),
  });
  const probe = input.probe?.(httpBaseUrl) ?? probeTailscaleHttpsEndpoint({ baseUrl: httpBaseUrl });
  const isReachable = input.serveEnabled ? yield* probe : false;
  return effect_Option.some(
    createAdvertisedEndpoint({
      provider: TAILSCALE_ENDPOINT_PROVIDER,
      source: "desktop-addon",
      id: `tailscale-magicdns:${httpBaseUrl}`,
      label: "Tailscale HTTPS",
      httpBaseUrl,
      reachability: "private-network",
      hostedHttpsCompatibility: isReachable ? "compatible" : "requires-configuration",
      status: isReachable ? "available" : "unavailable",
      description: isReachable
        ? "HTTPS endpoint served by Tailscale Serve."
        : "MagicDNS hostname. Configure Tailscale Serve for HTTPS access.",
    }),
  );
});
const resolveTailscaleAdvertisedEndpoints = effect_Effect.fn("resolveTailscaleAdvertisedEndpoints")(
  function* (input) {
    const ipEndpoints = resolveTailscaleIpAdvertisedEndpoints(input);
    const magicDnsEndpoint = yield* resolveTailscaleMagicDnsAdvertisedEndpoint({
      dnsName:
        input.statusJson === void 0
          ? yield* readTailscaleStatus.pipe(
              effect_Effect.map((status) => status.magicDnsName),
              effect_Effect.catch(() => effect_Effect.succeed(null)),
            )
          : input.statusJson
            ? yield* parseTailscaleMagicDnsName(input.statusJson).pipe(
                effect_Effect.catch(() => effect_Effect.succeed(null)),
              )
            : null,
      serveEnabled: input.serveEnabled === true,
      ...(input.servePort === void 0 ? {} : { servePort: input.servePort }),
      ...(input.probe === void 0 ? {} : { probe: input.probe }),
    });
    return effect_Option.match(magicDnsEndpoint, {
      onNone: () => ipEndpoints,
      onSome: (endpoint) => [...ipEndpoints, endpoint],
    });
  },
);

//#endregion
//#region src/backend/DesktopServerExposure.ts
const DESKTOP_LOOPBACK_HOST = "127.0.0.1";
const DESKTOP_LAN_BIND_HOST = "0.0.0.0";
const DESKTOP_CORE_ENDPOINT_PROVIDER = {
  id: "desktop-core",
  label: "Desktop",
  kind: "core",
  isAddon: false,
};
const DESKTOP_MANUAL_ENDPOINT_PROVIDER = {
  id: "manual",
  label: "Manual",
  kind: "manual",
  isAddon: false,
};
const normalizeOptionalHost = (value) => {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : void 0;
};
const isUsableLanIpv4Address = (address) =>
  !address.startsWith("127.") && !address.startsWith("169.254.");
const isHttpsEndpointUrl = (value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};
const resolveLanAdvertisedHost = (networkInterfaces, explicitHost) => {
  const normalizedExplicitHost = normalizeOptionalHost(explicitHost);
  if (normalizedExplicitHost) return normalizedExplicitHost;
  for (const interfaceAddresses of Object.values(networkInterfaces)) {
    if (!interfaceAddresses) continue;
    for (const address of interfaceAddresses) {
      if (address.internal) continue;
      if (address.family !== "IPv4") continue;
      if (!isUsableLanIpv4Address(address.address)) continue;
      return address.address;
    }
  }
  return null;
};
const resolveDesktopServerExposure = (input) => {
  const localHttpUrl = `http://${DESKTOP_LOOPBACK_HOST}:${input.port}`;
  const localWsUrl = `ws://${DESKTOP_LOOPBACK_HOST}:${input.port}`;
  if (input.mode === "local-only")
    return {
      mode: input.mode,
      bindHost: DESKTOP_LOOPBACK_HOST,
      localHttpUrl,
      localWsUrl,
      endpointUrl: null,
      advertisedHost: null,
    };
  const advertisedHost = resolveLanAdvertisedHost(
    input.networkInterfaces,
    input.advertisedHostOverride,
  );
  return {
    mode: input.mode,
    bindHost: DESKTOP_LAN_BIND_HOST,
    localHttpUrl,
    localWsUrl,
    endpointUrl: advertisedHost ? `http://${advertisedHost}:${input.port}` : null,
    advertisedHost,
  };
};
const createDesktopEndpoint = (input) =>
  createAdvertisedEndpoint({
    ...input,
    provider: DESKTOP_CORE_ENDPOINT_PROVIDER,
    source: "desktop-core",
  });
const createManualEndpoint = (input) =>
  createAdvertisedEndpoint({
    ...input,
    provider: DESKTOP_MANUAL_ENDPOINT_PROVIDER,
    source: "user",
  });
const resolveDesktopCoreAdvertisedEndpoints = (input) => {
  const endpoints = [
    createDesktopEndpoint({
      id: `desktop-loopback:${input.port}`,
      label: "This machine",
      httpBaseUrl: input.exposure.localHttpUrl,
      reachability: "loopback",
      status: "available",
      description: "Loopback endpoint for this desktop app.",
    }),
  ];
  if (input.exposure.endpointUrl)
    endpoints.push(
      createDesktopEndpoint({
        id: `desktop-lan:${input.exposure.endpointUrl}`,
        label: "Local network",
        httpBaseUrl: input.exposure.endpointUrl,
        reachability: "lan",
        status: "available",
        isDefault: true,
        description: "Reachable from devices on the same network.",
      }),
    );
  for (const customEndpointUrl of input.customHttpsEndpointUrls ?? [])
    try {
      const isHttpsEndpoint = isHttpsEndpointUrl(customEndpointUrl);
      endpoints.push(
        createManualEndpoint({
          id: `manual:${customEndpointUrl}`,
          label: isHttpsEndpoint ? "Custom HTTPS" : "Custom endpoint",
          httpBaseUrl: customEndpointUrl,
          reachability: "public",
          ...(isHttpsEndpoint ? { hostedHttpsCompatibility: "compatible" } : {}),
          status: "unknown",
          description: isHttpsEndpoint
            ? "User-configured HTTPS endpoint for this desktop backend."
            : "User-configured endpoint for this desktop backend.",
        }),
      );
    } catch {}
  return endpoints;
};
var DesktopServerExposureNoNetworkAddressError = class extends effect_Data.TaggedError(
  "DesktopServerExposureNoNetworkAddressError",
) {
  get message() {
    return `No reachable network address is available for desktop network access on port ${this.port}.`;
  }
};
var DesktopServerExposurePersistenceError = class extends effect_Data.TaggedError(
  "DesktopServerExposurePersistenceError",
) {
  get message() {
    return `Failed to persist desktop ${this.operation} settings.`;
  }
};
var DesktopServerExposure = class extends effect_Context.Service()("t3/desktop/ServerExposure") {};
var DesktopNetworkInterfacesService = class extends effect_Context.Service()(
  "t3/desktop/ServerExposure/NetworkInterfaces",
) {};
const initialRuntimeState = () =>
  runtimeStateFromResolvedExposure({
    requestedMode: DEFAULT_DESKTOP_SETTINGS.serverExposureMode,
    settings: DEFAULT_DESKTOP_SETTINGS,
    exposure: resolveDesktopServerExposure({
      mode: DEFAULT_DESKTOP_SETTINGS.serverExposureMode,
      port: 0,
      networkInterfaces: {},
    }),
    port: 0,
  });
const toContractState = (state) => ({
  mode: state.mode,
  endpointUrl: effect_Option.getOrNull(state.endpointUrl),
  advertisedHost: effect_Option.getOrNull(state.advertisedHost),
  tailscaleServeEnabled: state.tailscaleServeEnabled,
  tailscaleServePort: state.tailscaleServePort,
});
const toBackendConfig = (state) => ({
  port: state.port,
  bindHost: state.bindHost,
  httpBaseUrl: state.httpBaseUrl,
  tailscaleServeEnabled: state.tailscaleServeEnabled,
  tailscaleServePort: state.tailscaleServePort,
});
const toResolvedExposure = (state) => ({
  mode: state.mode,
  bindHost: state.bindHost,
  localHttpUrl: state.localHttpUrl,
  localWsUrl: state.localWsUrl,
  endpointUrl: effect_Option.getOrNull(state.endpointUrl),
  advertisedHost: effect_Option.getOrNull(state.advertisedHost),
});
function runtimeStateFromResolvedExposure(input) {
  return {
    requestedMode: input.requestedMode,
    mode: input.exposure.mode,
    port: input.port,
    bindHost: input.exposure.bindHost,
    localHttpUrl: input.exposure.localHttpUrl,
    localWsUrl: input.exposure.localWsUrl,
    httpBaseUrl: new URL(input.exposure.localHttpUrl),
    endpointUrl: effect_Option.fromNullishOr(input.exposure.endpointUrl),
    advertisedHost: effect_Option.fromNullishOr(input.exposure.advertisedHost),
    tailscaleServeEnabled: input.settings.tailscaleServeEnabled,
    tailscaleServePort: input.settings.tailscaleServePort,
  };
}
function resolveRuntimeState(input) {
  const advertisedHostOverride = effect_Option.getOrUndefined(input.advertisedHostOverride);
  const requestedExposure = resolveDesktopServerExposure({
    mode: input.requestedMode,
    port: input.port,
    networkInterfaces: input.networkInterfaces,
    ...(advertisedHostOverride ? { advertisedHostOverride } : {}),
  });
  const unavailable =
    input.requestedMode === "network-accessible" && requestedExposure.endpointUrl === null;
  const exposure = unavailable
    ? resolveDesktopServerExposure({
        mode: "local-only",
        port: input.port,
        networkInterfaces: input.networkInterfaces,
        ...(advertisedHostOverride ? { advertisedHostOverride } : {}),
      })
    : requestedExposure;
  return {
    state: runtimeStateFromResolvedExposure({
      requestedMode: input.requestedMode,
      settings: input.settings,
      exposure,
      port: input.port,
    }),
    unavailable,
  };
}
const requiresBackendRelaunch = (previous, next) =>
  previous.port !== next.port ||
  previous.bindHost !== next.bindHost ||
  previous.localHttpUrl !== next.localHttpUrl;
const make$7 = effect_Effect.gen(function* () {
  const config = yield* DesktopConfig;
  const networkInterfaces = yield* DesktopNetworkInterfacesService;
  const childProcessSpawner =
    yield* effect_unstable_process.ChildProcessSpawner.ChildProcessSpawner;
  const httpClient = yield* effect_unstable_http.HttpClient.HttpClient;
  const desktopSettings = yield* DesktopAppSettings;
  const stateRef = yield* effect_Ref.make(initialRuntimeState());
  const readNetworkInterfaces = networkInterfaces.read;
  const getState = effect_Ref.get(stateRef).pipe(effect_Effect.map(toContractState));
  const backendConfig = effect_Ref.get(stateRef).pipe(effect_Effect.map(toBackendConfig));
  const configureFromSettings = effect_Effect.fn("desktop.serverExposure.configureFromSettings")(
    function* ({ port }) {
      yield* effect_Effect.annotateCurrentSpan({ port });
      const settings = yield* desktopSettings.get;
      const currentNetworkInterfaces = yield* readNetworkInterfaces;
      const resolved = resolveRuntimeState({
        requestedMode: settings.serverExposureMode,
        settings,
        port,
        networkInterfaces: currentNetworkInterfaces,
        advertisedHostOverride: config.desktopLanHostOverride,
      });
      yield* effect_Ref.set(stateRef, resolved.state);
      return toContractState(resolved.state);
    },
  );
  const setMode = effect_Effect.fn("desktop.serverExposure.setMode")(function* (mode) {
    yield* effect_Effect.annotateCurrentSpan({ mode });
    const previous = yield* effect_Ref.get(stateRef);
    const nextSettings = {
      ...(yield* desktopSettings.get),
      serverExposureMode: mode,
    };
    const currentNetworkInterfaces = yield* readNetworkInterfaces;
    const resolved = resolveRuntimeState({
      requestedMode: mode,
      settings: nextSettings,
      port: previous.port,
      networkInterfaces: currentNetworkInterfaces,
      advertisedHostOverride: config.desktopLanHostOverride,
    });
    if (resolved.unavailable)
      return yield* new DesktopServerExposureNoNetworkAddressError({ port: previous.port });
    const change = yield* desktopSettings.setServerExposureMode(mode).pipe(
      effect_Effect.mapError(
        (cause) =>
          new DesktopServerExposurePersistenceError({
            operation: "server-exposure-mode",
            cause,
          }),
      ),
    );
    yield* effect_Ref.set(stateRef, resolved.state);
    return {
      state: toContractState(resolved.state),
      requiresRelaunch: change.changed || requiresBackendRelaunch(previous, resolved.state),
    };
  });
  const setTailscaleServeEnabled = effect_Effect.fn(
    "desktop.serverExposure.setTailscaleServeEnabled",
  )(function* (input) {
    yield* effect_Effect.annotateCurrentSpan({
      enabled: input.enabled,
      ...(input.port === void 0 ? {} : { port: input.port }),
    });
    const result = yield* desktopSettings
      .setTailscaleServe({
        enabled: input.enabled,
        port: effect_Option.fromNullishOr(input.port),
      })
      .pipe(
        effect_Effect.mapError(
          (cause) =>
            new DesktopServerExposurePersistenceError({
              operation: "tailscale-serve",
              cause,
            }),
        ),
      );
    return {
      state: toContractState(
        yield* effect_Ref.updateAndGet(stateRef, (current) => ({
          ...current,
          tailscaleServeEnabled: result.settings.tailscaleServeEnabled,
          tailscaleServePort: result.settings.tailscaleServePort,
        })),
      ),
      requiresRelaunch: result.changed,
    };
  });
  const getAdvertisedEndpoints = effect_Effect
    .gen(function* () {
      const state = yield* effect_Ref.get(stateRef);
      const currentNetworkInterfaces = yield* readNetworkInterfaces;
      const coreEndpoints = resolveDesktopCoreAdvertisedEndpoints({
        port: state.port,
        exposure: toResolvedExposure(state),
        customHttpsEndpointUrls: config.desktopHttpsEndpointUrls,
      });
      const tailscaleEndpoints = yield* resolveTailscaleAdvertisedEndpoints({
        port: state.port,
        serveEnabled: state.tailscaleServeEnabled,
        servePort: state.tailscaleServePort,
        networkInterfaces: currentNetworkInterfaces,
      }).pipe(
        effect_Effect.provideService(
          effect_unstable_process.ChildProcessSpawner.ChildProcessSpawner,
          childProcessSpawner,
        ),
        effect_Effect.provideService(effect_unstable_http.HttpClient.HttpClient, httpClient),
      );
      return [...coreEndpoints, ...tailscaleEndpoints];
    })
    .pipe(effect_Effect.withSpan("desktop.serverExposure.getAdvertisedEndpoints"));
  return DesktopServerExposure.of({
    getState,
    backendConfig,
    configureFromSettings,
    setMode,
    setTailscaleServeEnabled,
    getAdvertisedEndpoints,
  });
});
const layer$11 = effect_Layer.effect(DesktopServerExposure, make$7);
const networkInterfacesLayer = effect_Layer.succeed(
  DesktopNetworkInterfacesService,
  DesktopNetworkInterfacesService.of({
    read: effect_Effect.sync(() => node_os.networkInterfaces()),
  }),
);

//#endregion
//#region src/window/DesktopWindow.ts
const TITLEBAR_HEIGHT = 40;
const TITLEBAR_COLOR = "#01000000";
const TITLEBAR_LIGHT_SYMBOL_COLOR = "#1f2937";
const TITLEBAR_DARK_SYMBOL_COLOR = "#f8fafc";
var DesktopWindowDevServerUrlMissingError = class extends effect_Data.TaggedError(
  "DesktopWindowDevServerUrlMissingError",
) {
  get message() {
    return "VITE_DEV_SERVER_URL is required in desktop development.";
  }
};
var DesktopWindow = class extends effect_Context.Service()("t3/desktop/Window") {};
const { logInfo: logWindowInfo, logWarning: logWindowWarning } =
  makeComponentLogger("desktop-window");
function resolveDesktopDevServerUrl(environment) {
  return effect_Option.match(environment.devServerUrl, {
    onNone: () => effect_Effect.fail(new DesktopWindowDevServerUrlMissingError()),
    onSome: (url) => effect_Effect.succeed(url.href),
  });
}
function getIconOption(iconPaths) {
  if (process.platform === "darwin") return {};
  const ext = process.platform === "win32" ? "ico" : "png";
  return effect_Option.match(iconPaths[ext], {
    onNone: () => ({}),
    onSome: (icon) => ({ icon }),
  });
}
function getInitialWindowBackgroundColor(shouldUseDarkColors) {
  return shouldUseDarkColors ? "#0a0a0a" : "#ffffff";
}
function getWindowTitleBarOptions(shouldUseDarkColors) {
  if (process.platform === "darwin")
    return {
      titleBarStyle: "hiddenInset",
      trafficLightPosition: {
        x: 16,
        y: 18,
      },
    };
  return {
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: TITLEBAR_COLOR,
      height: TITLEBAR_HEIGHT,
      symbolColor: shouldUseDarkColors ? TITLEBAR_DARK_SYMBOL_COLOR : TITLEBAR_LIGHT_SYMBOL_COLOR,
    },
  };
}
function syncWindowAppearance(window, shouldUseDarkColors) {
  return effect_Effect.sync(() => {
    if (window.isDestroyed()) return;
    window.setBackgroundColor(getInitialWindowBackgroundColor(shouldUseDarkColors));
    const { titleBarOverlay } = getWindowTitleBarOptions(shouldUseDarkColors);
    if (typeof titleBarOverlay === "object") window.setTitleBarOverlay(titleBarOverlay);
  });
}
function bindFirstRevealTrigger(subscribers, reveal) {
  let revealed = false;
  const fire = () => {
    if (revealed) return;
    revealed = true;
    reveal();
  };
  for (const subscribe of subscribers) subscribe(fire);
}
const make$6 = effect_Effect.gen(function* () {
  const environment = yield* DesktopEnvironment;
  const assets = yield* DesktopAssets;
  const electronMenu = yield* ElectronMenu;
  const electronShell = yield* ElectronShell;
  const electronTheme = yield* ElectronTheme;
  const electronWindow = yield* ElectronWindow;
  const serverExposure = yield* DesktopServerExposure;
  const state = yield* DesktopState;
  const context = yield* effect_Effect.context();
  const runPromise = effect_Effect.runPromiseWith(context);
  const createWindow = effect_Effect.fn("desktop.window.createWindow")(function* (backendHttpUrl) {
    const iconOption = getIconOption(yield* assets.iconPaths);
    const shouldUseDarkColors = yield* electronTheme.shouldUseDarkColors;
    const window = yield* electronWindow.create({
      width: 1100,
      height: 780,
      minWidth: 840,
      minHeight: 620,
      show: false,
      autoHideMenuBar: true,
      backgroundColor: getInitialWindowBackgroundColor(shouldUseDarkColors),
      ...iconOption,
      title: environment.displayName,
      ...getWindowTitleBarOptions(shouldUseDarkColors),
      webPreferences: {
        preload: environment.preloadPath,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    });
    window.webContents.on("context-menu", (event, params) => {
      event.preventDefault();
      const menuTemplate = [];
      if (params.misspelledWord) {
        for (const suggestion of params.dictionarySuggestions.slice(0, 5))
          menuTemplate.push({
            label: suggestion,
            click: () => window.webContents.replaceMisspelling(suggestion),
          });
        if (params.dictionarySuggestions.length === 0)
          menuTemplate.push({
            label: "No suggestions",
            enabled: false,
          });
        menuTemplate.push({ type: "separator" });
      }
      if (effect_Option.isSome(parseSafeExternalUrl(params.linkURL)))
        menuTemplate.push(
          {
            label: "Copy Link",
            click: () => {
              runPromise(electronShell.copyText(params.linkURL));
            },
          },
          { type: "separator" },
        );
      if (params.mediaType === "image") {
        menuTemplate.push({
          label: "Copy Image",
          click: () => window.webContents.copyImageAt(params.x, params.y),
        });
        menuTemplate.push({ type: "separator" });
      }
      menuTemplate.push(
        {
          role: "cut",
          enabled: params.editFlags.canCut,
        },
        {
          role: "copy",
          enabled: params.editFlags.canCopy,
        },
        {
          role: "paste",
          enabled: params.editFlags.canPaste,
        },
        {
          role: "selectAll",
          enabled: params.editFlags.canSelectAll,
        },
      );
      runPromise(
        electronMenu.popupTemplate({
          window,
          template: menuTemplate,
        }),
      );
    });
    window.webContents.setWindowOpenHandler(({ url }) => {
      if (effect_Option.isSome(parseSafeExternalUrl(url)))
        runPromise(electronShell.openExternal(url));
      return { action: "deny" };
    });
    window.on("page-title-updated", (event) => {
      event.preventDefault();
      window.setTitle(environment.displayName);
    });
    window.webContents.on("did-finish-load", () => {
      window.setTitle(environment.displayName);
    });
    window.webContents.on(
      "did-fail-load",
      (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
        if (!isMainFrame) return;
        runPromise(
          logWindowWarning("main window failed to load", {
            errorCode,
            errorDescription,
            url: validatedURL,
          }),
        );
      },
    );
    window.webContents.on("render-process-gone", (_event, details) => {
      runPromise(
        logWindowWarning("main window render process gone", {
          reason: details.reason,
          exitCode: details.exitCode,
        }),
      );
    });
    const revealSubscribers = [(fire) => window.once("ready-to-show", fire)];
    if (process.platform === "linux")
      revealSubscribers.push((fire) => window.webContents.once("did-finish-load", fire));
    bindFirstRevealTrigger(revealSubscribers, () => {
      runPromise(electronWindow.reveal(window));
    });
    if (environment.isDevelopment) {
      const devServerUrl = yield* resolveDesktopDevServerUrl(environment);
      window.loadURL(devServerUrl);
      window.webContents.openDevTools({ mode: "detach" });
    } else window.loadURL(backendHttpUrl.href);
    window.on("closed", () => {
      runPromise(electronWindow.clearMain(effect_Option.some(window)));
    });
    return window;
  });
  const createMain = effect_Effect
    .gen(function* () {
      const window = yield* createWindow((yield* serverExposure.backendConfig).httpBaseUrl);
      yield* electronWindow.setMain(window);
      yield* logWindowInfo("main window created");
      return window;
    })
    .pipe(effect_Effect.withSpan("desktop.window.createMain"));
  const ensureMain = effect_Effect
    .gen(function* () {
      const existingWindow = yield* electronWindow.currentMainOrFirst;
      if (effect_Option.isSome(existingWindow)) return existingWindow.value;
      return yield* createMain;
    })
    .pipe(effect_Effect.withSpan("desktop.window.ensureMain"));
  const revealOrCreateMain = effect_Effect
    .gen(function* () {
      const window = yield* ensureMain;
      yield* electronWindow.reveal(window);
      return window;
    })
    .pipe(effect_Effect.withSpan("desktop.window.revealOrCreateMain"));
  const createMainIfBackendReady = effect_Effect
    .gen(function* () {
      if (!(yield* effect_Ref.get(state.backendReady))) return;
      const existingWindow = yield* electronWindow.currentMainOrFirst;
      if (effect_Option.isSome(existingWindow)) return;
      yield* createMain;
    })
    .pipe(effect_Effect.withSpan("desktop.window.createMainIfBackendReady"));
  return DesktopWindow.of({
    createMain,
    ensureMain,
    revealOrCreateMain,
    activate: effect_Effect
      .gen(function* () {
        const existingWindow = yield* electronWindow.currentMainOrFirst;
        if (effect_Option.isSome(existingWindow))
          yield* electronWindow.reveal(existingWindow.value);
        else yield* createMainIfBackendReady;
      })
      .pipe(effect_Effect.withSpan("desktop.window.activate")),
    createMainIfBackendReady,
    handleBackendReady: effect_Effect
      .gen(function* () {
        yield* effect_Ref.set(state.backendReady, true);
        yield* logWindowInfo("backend ready", { source: "http" });
        yield* createMainIfBackendReady;
      })
      .pipe(effect_Effect.withSpan("desktop.window.handleBackendReady")),
    dispatchMenuAction: effect_Effect.fn("desktop.window.dispatchMenuAction")(function* (action) {
      yield* effect_Effect.annotateCurrentSpan({ action });
      const existingWindow = yield* electronWindow.focusedMainOrFirst;
      const targetWindow = effect_Option.isSome(existingWindow)
        ? existingWindow.value
        : yield* createMain;
      const send = () => {
        if (targetWindow.isDestroyed()) return;
        targetWindow.webContents.send(MENU_ACTION_CHANNEL, action);
        runPromise(electronWindow.reveal(targetWindow));
      };
      if (targetWindow.webContents.isLoadingMainFrame()) {
        targetWindow.webContents.once("did-finish-load", send);
        return;
      }
      send();
    }),
    syncAppearance: effect_Effect
      .gen(function* () {
        const shouldUseDarkColors = yield* electronTheme.shouldUseDarkColors;
        yield* electronWindow.syncAllAppearance((window) =>
          syncWindowAppearance(window, shouldUseDarkColors),
        );
      })
      .pipe(effect_Effect.withSpan("desktop.window.syncAppearance")),
  });
});
const layer$10 = effect_Layer.effect(DesktopWindow, make$6);

//#endregion
//#region src/app/DesktopLifecycle.ts
var DesktopShutdown = class extends effect_Context.Service()("t3/desktop/Shutdown") {};
const makeShutdown = effect_Effect.gen(function* () {
  const requested = yield* effect_Deferred.make();
  const completed = yield* effect_Deferred.make();
  const completedRef = yield* effect_Ref.make(false);
  return DesktopShutdown.of({
    request: effect_Deferred.succeed(requested, void 0).pipe(effect_Effect.asVoid),
    awaitRequest: effect_Deferred.await(requested),
    markComplete: effect_Ref
      .set(completedRef, true)
      .pipe(
        effect_Effect.andThen(effect_Deferred.succeed(completed, void 0)),
        effect_Effect.asVoid,
      ),
    awaitComplete: effect_Deferred.await(completed),
    isComplete: effect_Ref.get(completedRef),
  });
});
const layerShutdown = effect_Layer.effect(DesktopShutdown, makeShutdown);
var DesktopLifecycle = class extends effect_Context.Service()("t3/desktop/Lifecycle") {};
const { logInfo: logLifecycleInfo, logError: logLifecycleError } =
  makeComponentLogger("desktop-lifecycle");
function addScopedListener(target, eventName, listener) {
  const eventTarget = target;
  const untypedListener = listener;
  return effect_Effect
    .acquireRelease(
      effect_Effect.sync(() => {
        eventTarget.on(eventName, untypedListener);
      }),
      () =>
        effect_Effect.sync(() => {
          eventTarget.removeListener(eventName, untypedListener);
        }),
    )
    .pipe(effect_Effect.asVoid);
}
const requestDesktopShutdownAndWait = effect_Effect.fn("desktop.lifecycle.requestShutdownAndWait")(
  function* () {
    const shutdown = yield* DesktopShutdown;
    yield* shutdown.request;
    yield* shutdown.awaitComplete;
  },
);
function handleBeforeQuit(event, runEffect, allowQuit, markQuitAllowed) {
  if (allowQuit()) {
    runEffect(
      effect_Effect
        .gen(function* () {
          const state = yield* DesktopState;
          yield* effect_Ref.set(state.quitting, true);
          yield* logLifecycleInfo("before-quit received");
        })
        .pipe(effect_Effect.withSpan("desktop.lifecycle.beforeQuit")),
    );
    return;
  }
  event.preventDefault();
  runEffect(
    effect_Effect
      .gen(function* () {
        const state = yield* DesktopState;
        yield* effect_Ref.set(state.quitting, true);
        yield* logLifecycleInfo("before-quit received");
        yield* requestDesktopShutdownAndWait();
      })
      .pipe(effect_Effect.withSpan("desktop.lifecycle.beforeQuit")),
  ).finally(() => {
    markQuitAllowed();
    runEffect(
      effect_Effect
        .gen(function* () {
          yield* (yield* ElectronApp).quit;
        })
        .pipe(effect_Effect.withSpan("desktop.lifecycle.quitAfterShutdown")),
    );
  });
}
function quitFromSignal(signal, runEffect) {
  runEffect(
    effect_Effect
      .gen(function* () {
        yield* effect_Effect.annotateCurrentSpan({ signal });
        const electronApp = yield* ElectronApp;
        const state = yield* DesktopState;
        if (yield* effect_Ref.getAndSet(state.quitting, true)) return;
        yield* logLifecycleInfo("process signal received", { signal });
        yield* requestDesktopShutdownAndWait();
        yield* electronApp.quit;
      })
      .pipe(effect_Effect.withSpan("desktop.lifecycle.processSignal")),
  );
}
const layer$9 = effect_Layer.succeed(
  DesktopLifecycle,
  DesktopLifecycle.of({
    relaunch: effect_Effect.fn("desktop.lifecycle.relaunch")(function* (reason) {
      const electronApp = yield* ElectronApp;
      const environment = yield* DesktopEnvironment;
      const state = yield* DesktopState;
      yield* logLifecycleInfo("desktop relaunch requested", { reason });
      yield* effect_Effect
        .gen(function* () {
          yield* effect_Effect.yieldNow;
          yield* effect_Ref.set(state.quitting, true);
          yield* requestDesktopShutdownAndWait();
          if (environment.isDevelopment) {
            yield* electronApp.exit(75);
            return;
          }
          yield* electronApp.relaunch({
            execPath: process.execPath,
            args: process.argv.slice(1),
          });
          yield* electronApp.exit(0);
        })
        .pipe(
          effect_Effect.catchCause((cause) =>
            logLifecycleError("desktop relaunch failed", { cause: effect_Cause.pretty(cause) }),
          ),
          effect_Effect.forkDetach,
          effect_Effect.asVoid,
        );
    }),
    register: effect_Effect
      .gen(function* () {
        const desktopWindow = yield* DesktopWindow;
        const electronApp = yield* ElectronApp;
        const electronTheme = yield* ElectronTheme;
        const environment = yield* DesktopEnvironment;
        const context = yield* effect_Effect.context();
        const runEffect = effect_Effect.runPromiseWith(context);
        let quitAllowed = false;
        yield* electronTheme.onUpdated(() => {
          runEffect(
            desktopWindow.syncAppearance.pipe(
              effect_Effect.withSpan("desktop.lifecycle.themeUpdated"),
            ),
          );
        });
        yield* electronApp.on("before-quit", (event) => {
          handleBeforeQuit(
            event,
            runEffect,
            () => quitAllowed,
            () => {
              quitAllowed = true;
            },
          );
        });
        yield* electronApp.on("activate", () => {
          runEffect(
            desktopWindow.activate.pipe(effect_Effect.withSpan("desktop.lifecycle.activate")),
          );
        });
        yield* electronApp.on("window-all-closed", () => {
          runEffect(
            effect_Effect
              .gen(function* () {
                const app = yield* ElectronApp;
                const state = yield* DesktopState;
                if (environment.platform !== "darwin" && !(yield* effect_Ref.get(state.quitting)))
                  yield* app.quit;
              })
              .pipe(effect_Effect.withSpan("desktop.lifecycle.windowAllClosed")),
          );
        });
        if (environment.platform !== "win32") {
          yield* addScopedListener(process, "SIGINT", () => {
            quitFromSignal("SIGINT", runEffect);
          });
          yield* addScopedListener(process, "SIGTERM", () => {
            quitFromSignal("SIGTERM", runEffect);
          });
        }
      })
      .pipe(effect_Effect.withSpan("desktop.lifecycle.register")),
  }),
);

//#endregion
//#region src/ipc/methods/serverExposure.ts
const SetTailscaleServeEnabledInput = effect_Schema.Struct({
  enabled: effect_Schema.Boolean,
  port: effect_Schema.optionalKey(effect_Schema.Number),
});
const getServerExposureState = makeIpcMethod({
  channel: GET_SERVER_EXPOSURE_STATE_CHANNEL,
  payload: effect_Schema.Void,
  result: DesktopServerExposureStateSchema,
  handler: effect_Effect.fn("desktop.ipc.serverExposure.getState")(function* () {
    return yield* (yield* DesktopServerExposure).getState;
  }),
});
const setServerExposureMode = makeIpcMethod({
  channel: SET_SERVER_EXPOSURE_MODE_CHANNEL,
  payload: DesktopServerExposureModeSchema,
  result: DesktopServerExposureStateSchema,
  handler: effect_Effect.fn("desktop.ipc.serverExposure.setMode")(function* (mode) {
    const lifecycle = yield* DesktopLifecycle;
    const change = yield* (yield* DesktopServerExposure).setMode(mode);
    if (change.requiresRelaunch) yield* lifecycle.relaunch(`serverExposureMode=${mode}`);
    return change.state;
  }),
});
const setTailscaleServeEnabled = makeIpcMethod({
  channel: SET_TAILSCALE_SERVE_ENABLED_CHANNEL,
  payload: SetTailscaleServeEnabledInput,
  result: DesktopServerExposureStateSchema,
  handler: effect_Effect.fn("desktop.ipc.serverExposure.setTailscaleServeEnabled")(
    function* (input) {
      const lifecycle = yield* DesktopLifecycle;
      const change = yield* (yield* DesktopServerExposure).setTailscaleServeEnabled(input);
      if (change.requiresRelaunch)
        yield* lifecycle.relaunch(
          change.state.tailscaleServeEnabled
            ? "tailscale-serve-enabled"
            : "tailscale-serve-disabled",
        );
      return change.state;
    },
  ),
});
const getAdvertisedEndpoints = makeIpcMethod({
  channel: GET_ADVERTISED_ENDPOINTS_CHANNEL,
  payload: effect_Schema.Void,
  result: effect_Schema.Array(AdvertisedEndpoint),
  handler: effect_Effect.fn("desktop.ipc.serverExposure.getAdvertisedEndpoints")(function* () {
    return yield* (yield* DesktopServerExposure).getAdvertisedEndpoints;
  }),
});

//#endregion
//#region ../../packages/ssh/src/config.ts
const NO_HOSTS = [];
function stripInlineComment(line) {
  const hashIndex = line.indexOf("#");
  return (hashIndex >= 0 ? line.slice(0, hashIndex) : line).trim();
}
function splitDirectiveArgs(value) {
  return value
    .replace(/=(?!=)/gu, " ")
    .trim()
    .split(/\s+/u)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}
function expandHomePath(input, homeDir) {
  return input.replace(/^~(?=$|\/|\\)/u, homeDir);
}
const resolveSshConfigIncludePattern = effect_Effect.fnUntraced(
  function* (includePattern, _directory, homeDir) {
    const path = yield* effect_Path.Path;
    const expandedPattern = expandHomePath(includePattern, homeDir);
    return path.isAbsolute(expandedPattern)
      ? expandedPattern
      : path.resolve(path.join(homeDir, ".ssh"), expandedPattern);
  },
);
function hasSshPattern(value) {
  return value.includes("*") || value.includes("?") || value.startsWith("!");
}
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
function globToRegExp(pattern) {
  return new RegExp(
    `^${escapeRegex(pattern).replace(/\\\*/gu, ".*").replace(/\\\?/gu, ".")}$`,
    "u",
  );
}
const expandGlob = effect_Effect.fnUntraced(function* (pattern) {
  const fs = yield* effect_FileSystem.FileSystem;
  const path = yield* effect_Path.Path;
  if (!pattern.includes("*") && !pattern.includes("?"))
    return (yield* fs.exists(pattern)) ? [pattern] : NO_HOSTS;
  const directory = path.dirname(pattern);
  const basePattern = path.basename(pattern);
  if (!(yield* fs.exists(directory))) return NO_HOSTS;
  const matcher = globToRegExp(basePattern);
  const entries = yield* fs.readDirectory(directory);
  const matchedPaths = [];
  for (const entry of entries) {
    if (!matcher.test(entry)) continue;
    const entryPath = path.join(directory, entry);
    if (yield* fs.exists(entryPath)) matchedPaths.push(entryPath);
  }
  return matchedPaths.toSorted((left, right) => left.localeCompare(right));
});
const collectSshConfigAliasesFromFile = effect_Effect.fnUntraced(function* (
  filePath,
  visited = /* @__PURE__ */ new Set(),
  homeDir,
) {
  const fs = yield* effect_FileSystem.FileSystem;
  const path = yield* effect_Path.Path;
  const resolvedPath = path.resolve(filePath);
  if (visited.has(resolvedPath) || !(yield* fs.exists(resolvedPath))) return NO_HOSTS;
  visited.add(resolvedPath);
  const aliases = /* @__PURE__ */ new Set();
  const directory = path.dirname(resolvedPath);
  const raw = yield* fs.readFileString(resolvedPath);
  for (const line of raw.split(/\r?\n/u)) {
    const stripped = stripInlineComment(line);
    if (stripped.length === 0) continue;
    const [directive = "", ...rawArgs] = splitDirectiveArgs(stripped);
    const normalizedDirective = directive.toLowerCase();
    if (normalizedDirective === "include") {
      for (const includePattern of rawArgs) {
        const includedPaths = yield* expandGlob(
          yield* resolveSshConfigIncludePattern(includePattern, directory, homeDir),
        );
        for (const includedPath of includedPaths) {
          const includedAliases = yield* collectSshConfigAliasesFromFile(
            includedPath,
            visited,
            homeDir,
          );
          for (const alias of includedAliases) aliases.add(alias);
        }
      }
      continue;
    }
    if (normalizedDirective !== "host") continue;
    for (const alias of rawArgs) {
      if (alias.length === 0 || hasSshPattern(alias)) continue;
      aliases.add(alias);
    }
  }
  return [...aliases].toSorted((left, right) => left.localeCompare(right));
});
function normalizeKnownHostsHostname(rawHost) {
  const bracketMatch = /^\[([^\]]+)\]:(\d+)$/u.exec(rawHost);
  if (bracketMatch?.[1]) return bracketMatch[1];
  if (!rawHost.includes(":")) return rawHost;
  const firstColonIndex = rawHost.indexOf(":");
  const lastColonIndex = rawHost.lastIndexOf(":");
  return firstColonIndex === lastColonIndex ? rawHost.slice(0, lastColonIndex) : rawHost;
}
function parseKnownHostsHostnames(raw) {
  const hostnames = /* @__PURE__ */ new Set();
  for (const line of raw.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith("#")) continue;
    const [hostField = ""] = (
      trimmed.startsWith("@") ? trimmed.split(/\s+/u).slice(1).join(" ") : trimmed
    ).split(/\s+/u);
    if (hostField.length === 0 || hostField.startsWith("|")) continue;
    for (const rawHost of hostField.split(",")) {
      const host = normalizeKnownHostsHostname(rawHost).trim();
      if (host.length === 0 || hasSshPattern(host)) continue;
      hostnames.add(host);
    }
  }
  return [...hostnames].toSorted((left, right) => left.localeCompare(right));
}
const readKnownHostsHostnames = effect_Effect.fnUntraced(function* (filePath) {
  const fs = yield* effect_FileSystem.FileSystem;
  if (!(yield* fs.exists(filePath))) return NO_HOSTS;
  return parseKnownHostsHostnames(yield* fs.readFileString(filePath));
});
const discoverSshHosts$1 = effect_Effect.fnUntraced(
  function* (input) {
    const path = yield* effect_Path.Path;
    const homeDir = input?.homeDir ?? process.env.HOME ?? process.env.USERPROFILE ?? "";
    if (homeDir.trim().length === 0) return [];
    const sshDirectory = path.join(homeDir, ".ssh");
    const configAliases = yield* collectSshConfigAliasesFromFile(
      path.join(sshDirectory, "config"),
      /* @__PURE__ */ new Set(),
      homeDir,
    );
    const knownHosts = yield* readKnownHostsHostnames(path.join(sshDirectory, "known_hosts"));
    const discovered = /* @__PURE__ */ new Map();
    for (const alias of configAliases)
      discovered.set(alias, {
        alias,
        hostname: alias,
        username: null,
        port: null,
        source: "ssh-config",
      });
    for (const hostname of knownHosts) {
      if (discovered.has(hostname)) continue;
      discovered.set(hostname, {
        alias: hostname,
        hostname,
        username: null,
        port: null,
        source: "known-hosts",
      });
    }
    return [...discovered.values()].toSorted((left, right) =>
      left.alias.localeCompare(right.alias),
    );
  },
  effect_Effect.mapError(
    (cause) =>
      new SshHostDiscoveryError({
        message: "Failed to discover SSH hosts.",
        cause,
      }),
  ),
);

//#endregion
//#region ../../packages/shared/src/semver.ts
/**
 * Small semver range checker for CLI/runtime gates.
 *
 * Keep the function body valid plain JavaScript: SSH startup stringifies this
 * function and runs it on remote Node versions before TypeScript support is known.
 *
 * @param rawVersion Version string, with or without a leading `v`.
 * @param range Space-separated comparators, with `||` range groups.
 * @returns Whether `rawVersion` satisfies the supported range syntax.
 */
const satisfiesSemverRange = function satisfiesSemverRange(rawVersion, range) {
  const versionMatch = String(rawVersion)
    .trim()
    .replace(/^v/, "")
    .match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-[0-9A-Za-z.-]+)?$/);
  if (!versionMatch) return false;
  const version = {
    major: Number(versionMatch[1]),
    minor: Number(versionMatch[2] || 0),
    patch: Number(versionMatch[3] || 0),
  };
  return range.split("||").some((group) => {
    const comparators = group.trim().split(/\s+/).filter(Boolean);
    if (comparators.length === 0) return false;
    return comparators.every((comparator) => {
      const match = comparator.trim().match(/^(\^|>=|>|<=|<|=)?\s*v?(\d+(?:\.\d+){0,2})$/);
      if (!match) return false;
      const targetVersion = match[2];
      if (targetVersion === void 0) return false;
      const targetMatch = targetVersion.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?$/);
      if (!targetMatch) return false;
      const target = {
        major: Number(targetMatch[1]),
        minor: Number(targetMatch[2] || 0),
        patch: Number(targetMatch[3] || 0),
      };
      const compared =
        version.major !== target.major
          ? version.major > target.major
            ? 1
            : -1
          : version.minor !== target.minor
            ? version.minor > target.minor
              ? 1
              : -1
            : version.patch !== target.patch
              ? version.patch > target.patch
                ? 1
                : -1
              : 0;
      switch (match[1] || "=") {
        case "^":
          if (compared < 0) return false;
          if (target.major > 0) return version.major === target.major;
          if (target.minor > 0) return version.major === 0 && version.minor === target.minor;
          return version.major === 0 && version.minor === 0 && version.patch === target.patch;
        case ">=":
          return compared >= 0;
        case ">":
          return compared > 0;
        case "<=":
          return compared <= 0;
        case "<":
          return compared < 0;
        case "=":
          return compared === 0;
        default:
          return false;
      }
    });
  });
};

//#endregion
//#region ../../packages/ssh/src/tunnel.ts
const DEFAULT_REMOTE_PORT = 3773;
const REMOTE_PORT_SCAN_WINDOW = 200;
const SSH_READY_TIMEOUT_MS = 2e4;
const SSH_READY_PROBE_TIMEOUT_MS = 1e3;
const TUNNEL_SHUTDOWN_TIMEOUT_MS = 2e3;
const REMOTE_READY_TIMEOUT_MS = 15e3;
const REMOTE_REUSE_READY_TIMEOUT_MS = 2e3;
function makeSshTunnelCancelledError(target) {
  return new SshCommandError({
    command: ["ssh"],
    exitCode: null,
    stderr: "",
    message: `SSH environment connection was cancelled for ${target.alias || target.hostname}.`,
  });
}
function sshTargetLogFields(target) {
  return {
    alias: target.alias,
    hostname: target.hostname,
    username: target.username,
    port: target.port,
  };
}
function sshRunnerLogFields(runner) {
  if (runner?.nodeScriptPath?.trim())
    return {
      runner: "node-script",
      nodeScriptPath: runner.nodeScriptPath.trim(),
    };
  if (runner?.packageSpec?.trim())
    return {
      runner: "package",
      packageSpec: runner.packageSpec.trim(),
    };
  return { runner: "default" };
}
const RemoteLaunchResult = effect_Schema.Struct({
  remotePort: effect_Schema.Number,
  serverKind: effect_Schema.optional(effect_Schema.Literals(["external", "managed"])),
});
const RemotePairingResult = effect_Schema.Struct({ credential: effect_Schema.String });
const RemoteHttpError = effect_Schema.Struct({
  error: effect_Schema.optional(effect_Schema.String),
});
const decodeRemoteLaunchResult = effect_Schema.decodeEffect(fromLenientJson(RemoteLaunchResult));
const decodeRemotePairingResult = effect_Schema.decodeEffect(fromLenientJson(RemotePairingResult));
const decodeRemoteHttpError = effect_Schema.decodeEffect(
  effect_Schema.fromJsonString(RemoteHttpError),
);
const decodeRemoteJsonOutput = (stdout, decode) =>
  decode(stdout).pipe(
    effect_Effect.catch((error) =>
      effect_Effect.gen(function* () {
        const jsonObject = extractJsonObject(stdout);
        if (jsonObject === stdout.trim()) return yield* effect_Effect.fail(error);
        const exit = yield* effect_Effect.exit(decode(jsonObject));
        if (effect_Exit.isSuccess(exit)) return exit.value;
        return yield* effect_Effect.fail(error);
      }),
    ),
  );
const decodeRemoteLaunchOutput = (stdout) =>
  decodeRemoteJsonOutput(stdout, decodeRemoteLaunchResult);
const decodeRemotePairingOutput = (stdout) =>
  decodeRemoteJsonOutput(stdout, decodeRemotePairingResult);
const remoteNodeEngineCheckMain = function remoteNodeEngineCheckMain() {
  const range = process.argv[2] || "";
  const rawVersion =
    process.versions && process.versions.node ? process.versions.node : process.version;
  if (!satisfiesSemverRange(rawVersion, range)) {
    process.stderr.write(
      "Remote node " + rawVersion + " does not satisfy required range " + range + ".\n",
    );
    process.exit(1);
  }
};
function buildRemoteNodeEngineCheckScript() {
  return `${satisfiesSemverRange.toString()}
(${remoteNodeEngineCheckMain.toString()})();`;
}
function normalizeSshErrorMessage(stderr, fallbackMessage) {
  const cleaned = stderr.trim();
  return cleaned.length > 0 ? cleaned : fallbackMessage;
}
function stripTrailingNewlines(value) {
  return value.replace(/\n+$/u, "");
}
function shellSingleQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}
function applyScriptPlaceholders(template, replacements) {
  let result = template;
  for (const [token, value] of Object.entries(replacements))
    result = result.replaceAll(`@@${token}@@`, value);
  return result;
}
function describeReadinessCause(cause) {
  if (cause instanceof SshReadinessError)
    return {
      _tag: cause._tag,
      message: cause.message,
      ...(cause.cause === void 0 ? {} : { cause: describeReadinessCause(cause.cause) }),
    };
  if (cause instanceof Error)
    return {
      name: cause.name,
      message: cause.message,
      ...(cause.cause === void 0 ? {} : { cause: describeReadinessCause(cause.cause) }),
    };
  if (typeof cause !== "object" || cause === null) return cause;
  const record = cause;
  return {
    ...(typeof record._tag === "string" ? { _tag: record._tag } : {}),
    ...(typeof record.message === "string" ? { message: record.message } : {}),
    ...(record.reason === void 0 ? {} : { reason: describeReadinessCause(record.reason) }),
    ...(record.cause === void 0 ? {} : { cause: describeReadinessCause(record.cause) }),
  };
}
const REMOTE_PICK_PORT_SCRIPT = `const fs = require("node:fs");
const net = require("node:net");
const filePath = process.argv[2] ?? "";
const defaultPort = Number.parseInt(process.argv[3] ?? "", 10);
const scanWindow = Number.parseInt(process.argv[4] ?? "", 10);
const raw = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8").trim() : "";
const preferred = Number.parseInt(raw, 10);
const start = Number.isInteger(preferred) ? preferred : defaultPort;
const end = start + scanWindow;

function tryPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.listen(port, "127.0.0.1", () => {
      server.close((error) => resolve(error ? false : port));
    });
  });
}

(async () => {
  for (let port = start; port < end; port += 1) {
    const available = await tryPort(port);
    if (available) {
      process.stdout.write(String(port));
      return;
    }
  }
  process.exit(1);
})().catch(() => process.exit(1));
`;
const REMOTE_WAIT_READY_SCRIPT = `const http = require("node:http");
const port = Number.parseInt(process.argv[2] ?? "", 10);
const timeoutMs = Number.parseInt(process.argv[3] ?? "", 10);
const probeTimeoutMs = Number.parseInt(process.argv[4] ?? "", 10);
if (!Number.isInteger(port) || !Number.isInteger(timeoutMs) || !Number.isInteger(probeTimeoutMs)) {
  process.exit(1);
}
const deadline = Date.now() + timeoutMs;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function probe() {
  return new Promise((resolve) => {
    const request = http.get(
      {
        hostname: "127.0.0.1",
        port,
        path: "/",
        timeout: probeTimeoutMs,
      },
      (response) => {
        response.resume();
        response.once("end", () => {
          resolve(response.statusCode >= 200 && response.statusCode < 300);
        });
      },
    );
    request.once("timeout", () => {
      request.destroy();
      resolve(false);
    });
    request.once("error", () => resolve(false));
  });
}

(async () => {
  while (Date.now() < deadline) {
    if (await probe()) {
      process.exit(0);
    }
    await sleep(100);
  }
  process.exit(1);
})().catch(() => process.exit(1));
`;
const REMOTE_NODE_ENV_SCRIPT = `prepend_path_if_dir() {
  if [ -d "$1" ]; then
    case ":$PATH:" in
      *":$1:"*) ;;
      *) PATH="$1:$PATH" ;;
    esac
  fi
}

remote_node_satisfies_engine() {
  T3_NODE_ENGINE_RANGE=@@T3_NODE_ENGINE_RANGE@@
  if [ -z "$T3_NODE_ENGINE_RANGE" ]; then
    return 0
  fi
  node - "$T3_NODE_ENGINE_RANGE" <<'NODE'
@@T3_NODE_ENGINE_CHECK_SCRIPT@@
NODE
}

ensure_remote_node_path() {
  if command -v node >/dev/null 2>&1 && remote_node_satisfies_engine >/dev/null 2>&1; then
    return 0
  fi

  prepend_path_if_dir "$HOME/.local/bin"
  prepend_path_if_dir "$HOME/bin"
  prepend_path_if_dir "/opt/homebrew/bin"
  prepend_path_if_dir "/usr/local/bin"
  prepend_path_if_dir "/usr/bin"
  prepend_path_if_dir "/bin"

  if [ -z "\${VOLTA_HOME:-}" ]; then
    VOLTA_HOME="$HOME/.volta"
  fi
  export VOLTA_HOME
  prepend_path_if_dir "$VOLTA_HOME/bin"

  prepend_path_if_dir "$HOME/.asdf/shims"
  prepend_path_if_dir "$HOME/.asdf/bin"
  if [ ! -x "$HOME/.asdf/shims/node" ] && [ -s "$HOME/.asdf/asdf.sh" ]; then
    # shellcheck disable=SC1090
    . "$HOME/.asdf/asdf.sh"
  fi

  prepend_path_if_dir "$HOME/.local/share/mise/shims"
  prepend_path_if_dir "$HOME/.mise/shims"
  if ! command -v node >/dev/null 2>&1 && command -v mise >/dev/null 2>&1; then
    eval "$(mise activate sh)" >/dev/null 2>&1 || true
  fi

  if [ -z "\${FNM_DIR:-}" ]; then
    FNM_DIR="$HOME/.local/share/fnm"
  fi
  export FNM_DIR
  prepend_path_if_dir "$FNM_DIR"
  prepend_path_if_dir "$HOME/.fnm"
  if ! command -v node >/dev/null 2>&1 && command -v fnm >/dev/null 2>&1; then
    eval "$(fnm env --use-on-cd --shell sh)" >/dev/null 2>&1 || eval "$(fnm env --shell sh)" >/dev/null 2>&1 || true
  fi

  prepend_path_if_dir "$HOME/.nodenv/bin"
  prepend_path_if_dir "$HOME/.nodenv/shims"
  if ! command -v node >/dev/null 2>&1 && command -v nodenv >/dev/null 2>&1; then
    eval "$(nodenv init -)" >/dev/null 2>&1 || true
  fi

  if [ -z "\${NVM_DIR:-}" ]; then
    NVM_DIR="$HOME/.nvm"
  fi
  export NVM_DIR

  if [ -s "$NVM_DIR/nvm.sh" ]; then
    # shellcheck disable=SC1090
    . "$NVM_DIR/nvm.sh"
    if ! command -v node >/dev/null 2>&1 && command -v nvm >/dev/null 2>&1; then
      nvm use --silent default >/dev/null 2>&1 || nvm use --silent node >/dev/null 2>&1 || nvm use --silent --lts >/dev/null 2>&1 || true
    fi
  fi

  if ! command -v node >/dev/null 2>&1 && [ -d "$NVM_DIR/versions/node" ]; then
    for T3_NODE_BIN in "$NVM_DIR"/versions/node/*/bin; do
      if [ -x "$T3_NODE_BIN/node" ]; then
        PATH="$T3_NODE_BIN:$PATH"
        export PATH
      fi
    done
  fi

  command -v node >/dev/null 2>&1 && remote_node_satisfies_engine
}
`;
const REMOTE_RUNNER_SCRIPT = `#!/bin/sh
set -eu
@@T3_NODE_ENV_SCRIPT@@
ensure_remote_node_path || true
T3_NODE_SCRIPT_PATH=@@T3_NODE_SCRIPT_PATH@@
if [ -n "$T3_NODE_SCRIPT_PATH" ]; then
  if ! command -v node >/dev/null 2>&1; then
    printf 'Remote host is missing node on PATH. Install Node or configure a supported version manager for non-interactive shells.\\n' >&2
    exit 1
  fi
  exec node "$T3_NODE_SCRIPT_PATH" "$@"
fi
if command -v t3 >/dev/null 2>&1; then
  exec t3 "$@"
fi
if command -v npx >/dev/null 2>&1; then
  exec npx --yes @@T3_PACKAGE_SPEC@@ "$@"
fi
if command -v npm >/dev/null 2>&1; then
  exec npm exec --yes @@T3_PACKAGE_SPEC@@ -- "$@"
fi
printf 'Remote host is missing the t3 CLI and could not install @@T3_PACKAGE_SPEC@@ because node/npm/npx are unavailable on PATH. Install Node or configure a supported version manager for non-interactive shells.\\n' >&2
exit 1
`;
const REMOTE_LAUNCH_SCRIPT = `set -eu
@@T3_NODE_ENV_SCRIPT@@
STATE_KEY="$1"
STATE_DIR="$HOME/.t3/ssh-launch/$STATE_KEY"
DEFAULT_SERVER_HOME="$HOME/.t3"
DEFAULT_RUNTIME_FILE="$DEFAULT_SERVER_HOME/userdata/server-runtime.json"
PORT_FILE="$STATE_DIR/port"
PID_FILE="$STATE_DIR/pid"
MANAGED_FILE="$STATE_DIR/managed"
LOG_FILE="$STATE_DIR/server.log"
RUNNER_FILE="$STATE_DIR/run-t3.sh"
RUNNER_NEXT="$STATE_DIR/run-t3.next.$$"
mkdir -p "$STATE_DIR"
cleanup_runner_next() {
  rm -f "$RUNNER_NEXT"
}
trap cleanup_runner_next EXIT
cat >"$RUNNER_NEXT" <<'SH'
@@T3_RUNNER_SCRIPT@@
SH
RUNNER_CHANGED=0
if [ ! -f "$RUNNER_FILE" ] || ! cmp -s "$RUNNER_NEXT" "$RUNNER_FILE"; then
  RUNNER_CHANGED=1
fi
mv "$RUNNER_NEXT" "$RUNNER_FILE"
chmod 700 "$RUNNER_FILE"
if ! ensure_remote_node_path; then
  printf 'Remote host is missing node on PATH. Install Node or configure a supported version manager for non-interactive shells.\\n' >&2
  exit 1
fi
pick_port() {
  node - "$PORT_FILE" "@@T3_DEFAULT_REMOTE_PORT@@" "@@T3_REMOTE_PORT_SCAN_WINDOW@@" <<'NODE'
@@T3_PICK_PORT_SCRIPT@@
NODE
}
wait_ready() {
  node - "$REMOTE_PORT" "$1" "@@T3_READY_PROBE_TIMEOUT_MS@@" <<'NODE'
@@T3_WAIT_READY_SCRIPT@@
NODE
}
wait_for_pid_exit() {
  PID_TO_WAIT="$1"
  WAIT_COUNT=0
  while kill -0 "$PID_TO_WAIT" 2>/dev/null && [ "$WAIT_COUNT" -lt 20 ]; do
    WAIT_COUNT=$((WAIT_COUNT + 1))
    sleep 0.1
  done
}
resolve_default_runtime_port() {
  node - "$DEFAULT_RUNTIME_FILE" <<'NODE'
const fs = require("node:fs");
const runtimePath = process.argv[2] ?? "";
try {
	  const runtime = JSON.parse(fs.readFileSync(runtimePath, "utf8"));
	  const pid = Number(runtime.pid);
	  const port = Number(runtime.port);
	  if (!Number.isInteger(pid) || pid <= 0 || !Number.isInteger(port)) {
	    process.exit(1);
	  }
  const origin = new URL(String(runtime.origin ?? ""));
  if (origin.protocol !== "http:" || !["127.0.0.1", "localhost"].includes(origin.hostname)) {
    process.exit(1);
  }
  process.kill(pid, 0);
  process.stdout.write(\`\${pid} \${port}\`);
} catch {
  process.exit(1);
}
NODE
}
REMOTE_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
REMOTE_PORT="$(cat "$PORT_FILE" 2>/dev/null || true)"
REMOTE_MANAGED="$(cat "$MANAGED_FILE" 2>/dev/null || true)"
DEFAULT_RUNTIME_INFO="$(resolve_default_runtime_port 2>/dev/null || true)"
DEFAULT_RUNTIME_PID=""
DEFAULT_REMOTE_PORT=""
if [ -n "$DEFAULT_RUNTIME_INFO" ]; then
  DEFAULT_RUNTIME_PID="\${DEFAULT_RUNTIME_INFO%% *}"
  DEFAULT_REMOTE_PORT="\${DEFAULT_RUNTIME_INFO#* }"
fi
if [ -n "$DEFAULT_REMOTE_PORT" ]; then
  REMOTE_PORT="$DEFAULT_REMOTE_PORT"
  if wait_ready "@@T3_REUSE_READY_TIMEOUT_MS@@"; then
    if [ "$REMOTE_MANAGED" = "managed" ]; then
      PID_TO_STOP="\${REMOTE_PID:-$DEFAULT_RUNTIME_PID}"
      if [ -n "$PID_TO_STOP" ] && kill -0 "$PID_TO_STOP" 2>/dev/null; then
        kill "$PID_TO_STOP" 2>/dev/null || true
        wait_for_pid_exit "$PID_TO_STOP"
      fi
      REMOTE_PID=""
      REMOTE_PORT="$DEFAULT_REMOTE_PORT"
      REMOTE_MANAGED="external"
      rm -f "$PID_FILE"
      printf '%s\\n' "$REMOTE_PORT" >"$PORT_FILE"
      printf 'external\\n' >"$MANAGED_FILE"
    else
      printf '%s\\n' "$REMOTE_PORT" >"$PORT_FILE"
      printf 'external\\n' >"$MANAGED_FILE"
      REMOTE_PID=""
      REMOTE_MANAGED="external"
    fi
  else
    REMOTE_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
    REMOTE_PORT="$(cat "$PORT_FILE" 2>/dev/null || true)"
    REMOTE_MANAGED="$(cat "$MANAGED_FILE" 2>/dev/null || true)"
  fi
fi
if [ "$REMOTE_MANAGED" = "external" ]; then
  if [ -z "$REMOTE_PORT" ] || ! wait_ready "@@T3_REUSE_READY_TIMEOUT_MS@@"; then
    REMOTE_PID=""
    REMOTE_PORT=""
    REMOTE_MANAGED=""
  fi
elif [ -n "$REMOTE_PID" ] && [ -n "$REMOTE_PORT" ] && kill -0 "$REMOTE_PID" 2>/dev/null; then
  if [ "$RUNNER_CHANGED" -eq 1 ]; then
    kill "$REMOTE_PID" 2>/dev/null || true
    wait_for_pid_exit "$REMOTE_PID"
    REMOTE_PID=""
    REMOTE_PORT=""
    REMOTE_MANAGED=""
  elif ! wait_ready "@@T3_REUSE_READY_TIMEOUT_MS@@"; then
    kill "$REMOTE_PID" 2>/dev/null || true
    wait_for_pid_exit "$REMOTE_PID"
    REMOTE_PID=""
    REMOTE_PORT=""
    REMOTE_MANAGED=""
  fi
else
  REMOTE_PID=""
  REMOTE_PORT=""
  REMOTE_MANAGED=""
fi
if [ -z "$REMOTE_PORT" ]; then
  REMOTE_PORT="$(pick_port)" || true
  if [ -z "$REMOTE_PORT" ]; then
    printf 'Failed to find an available port on the remote host. Ensure node is available on PATH.\\n' >&2
    exit 1
  fi
  nohup env T3CODE_NO_BROWSER=1 "$RUNNER_FILE" serve --host 127.0.0.1 --port "$REMOTE_PORT" --base-dir "$DEFAULT_SERVER_HOME" >>"$LOG_FILE" 2>&1 < /dev/null &
  REMOTE_PID="$!"
  printf '%s\\n' "$REMOTE_PID" >"$PID_FILE"
  printf '%s\\n' "$REMOTE_PORT" >"$PORT_FILE"
  printf 'managed\\n' >"$MANAGED_FILE"
  if ! wait_ready "@@T3_READY_TIMEOUT_MS@@"; then
    printf 'Remote T3 server did not become ready on 127.0.0.1:%s.\\n' "$REMOTE_PORT" >&2
    tail -n 80 "$LOG_FILE" >&2 2>/dev/null || true
    kill "$REMOTE_PID" 2>/dev/null || true
    wait_for_pid_exit "$REMOTE_PID"
    rm -f "$PID_FILE" "$PORT_FILE" "$MANAGED_FILE"
    exit 1
  fi
fi
printf '{"remotePort":%s,"serverKind":"%s"}\\n' "$REMOTE_PORT" "\${REMOTE_MANAGED:-managed}"
`;
const REMOTE_PAIRING_SCRIPT = `set -eu
STATE_DIR="$HOME/.t3/ssh-launch/@@T3_STATE_KEY@@"
DEFAULT_SERVER_HOME="$HOME/.t3"
RUNNER_FILE="$STATE_DIR/run-t3.sh"
mkdir -p "$STATE_DIR"
cat >"$RUNNER_FILE" <<'SH'
@@T3_RUNNER_SCRIPT@@
SH
chmod 700 "$RUNNER_FILE"
PAIRING_BASE_DIR="$DEFAULT_SERVER_HOME"
"$RUNNER_FILE" auth pairing create --base-dir "$PAIRING_BASE_DIR" --json
`;
const REMOTE_STOP_SCRIPT = `set -eu
STATE_DIR="$HOME/.t3/ssh-launch/@@T3_STATE_KEY@@"
PID_FILE="$STATE_DIR/pid"
PORT_FILE="$STATE_DIR/port"
MANAGED_FILE="$STATE_DIR/managed"
REMOTE_MANAGED="$(cat "$MANAGED_FILE" 2>/dev/null || true)"
REMOTE_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
if [ "$REMOTE_MANAGED" != "external" ] && [ -n "$REMOTE_PID" ] && kill -0 "$REMOTE_PID" 2>/dev/null; then
  kill "$REMOTE_PID" 2>/dev/null || true
  WAIT_COUNT=0
  while kill -0 "$REMOTE_PID" 2>/dev/null && [ "$WAIT_COUNT" -lt 20 ]; do
    WAIT_COUNT=$((WAIT_COUNT + 1))
    sleep 0.1
  done
fi
rm -f "$PID_FILE" "$PORT_FILE" "$MANAGED_FILE"
printf '{"stopped":true}\\n'
`;
const REMOTE_LOG_TAIL_SCRIPT = `set -eu
STATE_DIR="$HOME/.t3/ssh-launch/@@T3_STATE_KEY@@"
LOG_FILE="$STATE_DIR/server.log"
if [ -f "$LOG_FILE" ]; then
  tail -n 80 "$LOG_FILE" 2>/dev/null || true
fi
`;
function buildRemoteT3RunnerScript(input) {
  return stripTrailingNewlines(
    applyScriptPlaceholders(REMOTE_RUNNER_SCRIPT, {
      T3_PACKAGE_SPEC: shellSingleQuote(input?.packageSpec?.trim() || "t3@latest"),
      T3_NODE_SCRIPT_PATH: shellSingleQuote(input?.nodeScriptPath?.trim() || ""),
      T3_NODE_ENV_SCRIPT: buildRemoteNodeEnvScript(input),
    }),
  );
}
function buildRemoteNodeEnvScript(input) {
  return stripTrailingNewlines(
    applyScriptPlaceholders(REMOTE_NODE_ENV_SCRIPT, {
      T3_NODE_ENGINE_RANGE: shellSingleQuote(input?.nodeEngineRange?.trim() || ""),
      T3_NODE_ENGINE_CHECK_SCRIPT: stripTrailingNewlines(buildRemoteNodeEngineCheckScript()),
    }),
  );
}
function buildRemoteLaunchScript(input) {
  return applyScriptPlaceholders(REMOTE_LAUNCH_SCRIPT, {
    T3_NODE_ENV_SCRIPT: buildRemoteNodeEnvScript(input),
    T3_RUNNER_SCRIPT: stripTrailingNewlines(buildRemoteT3RunnerScript(input)),
    T3_PICK_PORT_SCRIPT: stripTrailingNewlines(REMOTE_PICK_PORT_SCRIPT),
    T3_WAIT_READY_SCRIPT: stripTrailingNewlines(REMOTE_WAIT_READY_SCRIPT),
    T3_DEFAULT_REMOTE_PORT: String(DEFAULT_REMOTE_PORT),
    T3_REMOTE_PORT_SCAN_WINDOW: String(REMOTE_PORT_SCAN_WINDOW),
    T3_READY_TIMEOUT_MS: String(REMOTE_READY_TIMEOUT_MS),
    T3_REUSE_READY_TIMEOUT_MS: String(REMOTE_REUSE_READY_TIMEOUT_MS),
    T3_READY_PROBE_TIMEOUT_MS: String(SSH_READY_PROBE_TIMEOUT_MS),
  });
}
function buildRemotePairingScript(target, input) {
  return applyScriptPlaceholders(REMOTE_PAIRING_SCRIPT, {
    T3_STATE_KEY: remoteStateKey(target),
    T3_RUNNER_SCRIPT: stripTrailingNewlines(buildRemoteT3RunnerScript(input)),
  });
}
function buildRemoteStopScript(target) {
  return applyScriptPlaceholders(REMOTE_STOP_SCRIPT, { T3_STATE_KEY: remoteStateKey(target) });
}
function buildRemoteLogTailScript(target) {
  return applyScriptPlaceholders(REMOTE_LOG_TAIL_SCRIPT, { T3_STATE_KEY: remoteStateKey(target) });
}
const launchOrReuseRemoteServer = effect_Effect.fn("ssh/tunnel.launchOrReuseRemoteServer")(
  function* (target, input, runner) {
    yield* effect_Effect.logInfo("ssh.remoteServer.launch.start", {
      ...sshTargetLogFields(target),
      ...sshRunnerLogFields(runner),
      stateKey: remoteStateKey(target),
    });
    const result = yield* runSshCommand(target, {
      remoteCommandArgs: ["sh", "-s", "--", remoteStateKey(target)],
      stdin: buildRemoteLaunchScript(runner),
      ...(input?.authSecret === void 0 ? {} : { authSecret: input.authSecret }),
      ...(input?.batchMode === void 0 ? {} : { batchMode: input.batchMode }),
      ...(input?.interactiveAuth === void 0 ? {} : { interactiveAuth: input.interactiveAuth }),
    });
    if (!getLastNonEmptyOutputLine(result.stdout))
      return yield* new SshLaunchError({
        message: "SSH launch did not return a remote port.",
        stdout: result.stdout,
      });
    const parsed = yield* decodeRemoteLaunchOutput(result.stdout).pipe(
      effect_Effect.mapError(
        (cause) =>
          new SshLaunchError({
            message: "SSH launch returned unparseable output.",
            stdout: result.stdout,
            cause,
          }),
      ),
    );
    if (!Number.isInteger(parsed.remotePort))
      return yield* new SshLaunchError({
        message: `SSH launch returned an invalid remote port: ${String(parsed.remotePort)}.`,
        stdout: result.stdout,
      });
    yield* effect_Effect.logInfo("ssh.remoteServer.launch.ready", {
      ...sshTargetLogFields(target),
      remotePort: parsed.remotePort,
      remoteServerKind: parsed.serverKind ?? null,
      stateKey: remoteStateKey(target),
    });
    return {
      remotePort: parsed.remotePort,
      remoteServerKind: parsed.serverKind ?? null,
    };
  },
);
const issueRemotePairingToken = effect_Effect.fn("ssh/tunnel.issueRemotePairingToken")(
  function* (target, input, runner) {
    yield* effect_Effect.logDebug("ssh.remoteServer.pairingToken.start", {
      ...sshTargetLogFields(target),
      stateKey: remoteStateKey(target),
    });
    const result = yield* runSshCommand(target, {
      remoteCommandArgs: ["sh", "-s"],
      stdin: buildRemotePairingScript(target, runner),
      ...(input?.authSecret === void 0 ? {} : { authSecret: input.authSecret }),
      ...(input?.batchMode === void 0 ? {} : { batchMode: input.batchMode }),
      ...(input?.interactiveAuth === void 0 ? {} : { interactiveAuth: input.interactiveAuth }),
    });
    if (!getLastNonEmptyOutputLine(result.stdout))
      return yield* new SshPairingError({
        message: "SSH pairing did not return a credential.",
        stdout: result.stdout,
      });
    const parsed = yield* decodeRemotePairingOutput(result.stdout).pipe(
      effect_Effect.mapError(
        (cause) =>
          new SshPairingError({
            message: "SSH pairing returned unparseable output.",
            stdout: result.stdout,
            cause,
          }),
      ),
    );
    if (parsed.credential.trim().length === 0)
      return yield* new SshPairingError({
        message: "SSH pairing command returned an invalid credential.",
        stdout: result.stdout,
      });
    yield* effect_Effect.logDebug("ssh.remoteServer.pairingToken.created", {
      ...sshTargetLogFields(target),
      stateKey: remoteStateKey(target),
    });
    return { credential: parsed.credential };
  },
);
const stopRemoteServer = effect_Effect.fn("ssh/tunnel.stopRemoteServer")(function* (target, input) {
  yield* effect_Effect.logInfo("ssh.remoteServer.stop.start", {
    ...sshTargetLogFields(target),
    stateKey: remoteStateKey(target),
  });
  yield* runSshCommand(target, {
    remoteCommandArgs: ["sh", "-s"],
    stdin: buildRemoteStopScript(target),
    ...(input?.authSecret === void 0 ? {} : { authSecret: input.authSecret }),
    ...(input?.batchMode === void 0 ? {} : { batchMode: input.batchMode }),
    ...(input?.interactiveAuth === void 0 ? {} : { interactiveAuth: input.interactiveAuth }),
  });
  yield* effect_Effect.logInfo("ssh.remoteServer.stop.succeeded", {
    ...sshTargetLogFields(target),
    stateKey: remoteStateKey(target),
  });
});
const readRemoteServerLogTail = effect_Effect.fn("ssh/tunnel.readRemoteServerLogTail")(
  function* (target, input) {
    return (yield* runSshCommand(target, {
      remoteCommandArgs: ["sh", "-s"],
      stdin: buildRemoteLogTailScript(target),
      timeoutMs: 1e4,
      ...(input?.authSecret === void 0 ? {} : { authSecret: input.authSecret }),
      ...(input?.batchMode === void 0 ? {} : { batchMode: input.batchMode }),
      ...(input?.interactiveAuth === void 0 ? {} : { interactiveAuth: input.interactiveAuth }),
    })).stdout.trim();
  },
);
const waitForHttpReady$1 = effect_Effect.fn("ssh/tunnel.waitForHttpReady")(function* (input) {
  const timeoutMs = input.timeoutMs ?? 3e4;
  const intervalMs = input.intervalMs ?? 100;
  const probeTimeoutMs = input.probeTimeoutMs ?? SSH_READY_PROBE_TIMEOUT_MS;
  const retryPolicy = effect_Schedule
    .spaced(effect_Duration.millis(intervalMs))
    .pipe(effect_Schedule.take(Math.max(0, Math.ceil(timeoutMs / intervalMs))));
  const requestUrl = new URL(input.path ?? "/", input.baseUrl).toString();
  const client = yield* effect_unstable_http.HttpClient.HttpClient;
  const lastProbeFailure = yield* effect_Ref.make(null);
  let attempt = 0;
  yield* effect_Effect.logDebug("ssh.tunnel.httpReady.start", {
    baseUrl: input.baseUrl,
    requestUrl,
    timeoutMs,
    intervalMs,
    probeTimeoutMs,
  });
  const result = yield* client
    .pipe(
      effect_unstable_http.HttpClient.filterStatusOk,
      effect_unstable_http.HttpClient.transform((effect) =>
        effect_Effect
          .gen(function* () {
            attempt += 1;
            const responseOption = yield* effect.pipe(
              effect_Effect.timeoutOption(effect_Duration.millis(probeTimeoutMs)),
              effect_Effect.mapError(
                (cause) =>
                  new SshReadinessError({
                    message: `Backend readiness probe failed at ${requestUrl}.`,
                    cause,
                  }),
              ),
            );
            return yield* effect_Option.match(responseOption, {
              onSome: effect_Effect.succeed,
              onNone: () =>
                effect_Effect.fail(
                  new SshReadinessError({
                    message: `Backend readiness probe exceeded ${probeTimeoutMs}ms at ${requestUrl}.`,
                    cause: {
                      kind: "probe-timeout",
                      attempt,
                      probeTimeoutMs,
                    },
                  }),
                ),
            });
          })
          .pipe(
            effect_Effect.mapError((cause) =>
              cause instanceof SshReadinessError
                ? cause
                : new SshReadinessError({
                    message: `Backend readiness probe failed at ${requestUrl}.`,
                    cause,
                  }),
            ),
            effect_Effect.tapError((cause) =>
              effect_Ref.set(lastProbeFailure, {
                attempt,
                cause: describeReadinessCause(cause),
              }),
            ),
          ),
      ),
      effect_unstable_http.HttpClient.tap((response) => response.text.pipe(effect_Effect.ignore)),
      effect_unstable_http.HttpClient.retry(retryPolicy),
    )
    .execute(effect_unstable_http.HttpClientRequest.get(requestUrl))
    .pipe(
      effect_Effect.mapError((cause) =>
        cause instanceof SshReadinessError
          ? cause
          : new SshReadinessError({
              message: `Backend readiness probe failed at ${requestUrl}.`,
              cause,
            }),
      ),
      effect_Effect.timeoutOption(effect_Duration.millis(timeoutMs)),
    );
  return yield* effect_Option.match(result, {
    onSome: () =>
      effect_Effect.logDebug("ssh.tunnel.httpReady.succeeded", {
        baseUrl: input.baseUrl,
        requestUrl,
        attempts: attempt,
      }),
    onNone: () =>
      effect_Effect.gen(function* () {
        const lastFailure = yield* effect_Ref.get(lastProbeFailure);
        yield* effect_Effect.logWarning("ssh.tunnel.httpReady.timedOut", {
          baseUrl: input.baseUrl,
          requestUrl,
          timeoutMs,
          intervalMs,
          probeTimeoutMs,
          attempts: attempt,
          lastFailure,
        });
        return yield* new SshReadinessError({
          message: `Timed out waiting ${timeoutMs}ms for backend readiness at ${input.baseUrl}.`,
          cause: lastFailure,
        });
      }),
  });
});
function isLoopbackHostname(hostname) {
  const normalized = hostname
    .trim()
    .toLowerCase()
    .replace(/^\[(.*)\]$/, "$1");
  return normalized === "127.0.0.1" || normalized === "::1" || normalized === "localhost";
}
function resolveLoopbackSshHttpUrl(rawHttpBaseUrl, pathname) {
  return effect_Effect.try({
    try: () => {
      if (typeof rawHttpBaseUrl !== "string" || rawHttpBaseUrl.trim().length === 0)
        throw new Error("Invalid SSH forwarded http base URL.");
      const baseUrl = new URL(rawHttpBaseUrl);
      if (!isLoopbackHostname(baseUrl.hostname))
        throw new Error("SSH desktop bridge only supports loopback forwarded URLs.");
      const url = new URL(baseUrl.toString());
      url.pathname = pathname;
      url.search = "";
      url.hash = "";
      return url;
    },
    catch: (cause) =>
      new SshHttpBridgeError({
        message: cause instanceof Error ? cause.message : "Invalid SSH forwarded http base URL.",
        cause,
      }),
  });
}
const fetchLoopbackSshJson = effect_Effect.fn("ssh/tunnel.fetchLoopbackSshJson")(function* (input) {
  const requestUrl = yield* resolveLoopbackSshHttpUrl(input.httpBaseUrl, input.pathname);
  const bearerToken =
    typeof input.bearerToken === "string" && input.bearerToken.trim().length > 0
      ? input.bearerToken
      : null;
  const request = (
    input.method === "POST"
      ? effect_unstable_http.HttpClientRequest.post(requestUrl.toString())
      : effect_unstable_http.HttpClientRequest.get(requestUrl.toString())
  ).pipe(
    input.body === void 0
      ? (req) => req
      : effect_unstable_http.HttpClientRequest.bodyJsonUnsafe(input.body),
    bearerToken
      ? effect_unstable_http.HttpClientRequest.setHeader("authorization", `Bearer ${bearerToken}`)
      : (req) => req,
  );
  const response = yield* (yield* effect_unstable_http.HttpClient.HttpClient).execute(request).pipe(
    effect_Effect.mapError(
      (cause) =>
        new SshHttpBridgeError({
          message: `Failed to reach SSH forwarded endpoint ${requestUrl.toString()}.`,
          cause,
        }),
    ),
  );
  if (response.status < 200 || response.status >= 300) {
    const text = yield* response.text.pipe(effect_Effect.catch(() => effect_Effect.succeed("")));
    const parsedError = yield* decodeRemoteHttpError(text).pipe(
      effect_Effect.catch(() => effect_Effect.succeed(null)),
    );
    const message =
      parsedError?.error && parsedError.error.trim().length > 0
        ? parsedError.error
        : text || `SSH forwarded request failed (${response.status}).`;
    return yield* new SshHttpBridgeError({
      status: response.status,
      message: `[ssh_http:${response.status}] ${message} (${input.method ?? "GET"} ${requestUrl.toString()})`,
    });
  }
  return yield* response.json.pipe(
    effect_Effect.mapError(
      (cause) =>
        new SshHttpBridgeError({
          message: `SSH forwarded endpoint ${requestUrl.toString()} returned invalid JSON.`,
          cause,
        }),
    ),
  );
});
const reserveLocalTunnelPort = effect_Effect.fn("ssh/tunnel.reserveLocalTunnelPort")(function* () {
  return yield* (yield* NetService).reserveLoopbackPort();
});
const startSshTunnel = effect_Effect.fn("ssh/tunnel.startSshTunnel")(function* (input) {
  const hostSpec = yield* buildSshHostSpecEffect(input.resolvedTarget);
  const childEnvironment = yield* buildSshChildEnvironment({
    ...(input.authOptions.authSecret === void 0
      ? {}
      : { authSecret: input.authOptions.authSecret }),
    ...(input.authOptions.interactiveAuth === void 0
      ? {}
      : { interactiveAuth: input.authOptions.interactiveAuth }),
  }).pipe(
    effect_Effect.mapError(
      (cause) =>
        new SshCommandError({
          command: ["ssh"],
          exitCode: null,
          stderr: "",
          message: "Failed to prepare SSH authentication helpers.",
          cause,
        }),
    ),
  );
  const args = [
    ...baseSshArgs(input.resolvedTarget, { batchMode: input.authOptions.batchMode ?? "no" }),
    "-o",
    "ExitOnForwardFailure=yes",
    "-o",
    "ServerAliveInterval=15",
    "-o",
    "ServerAliveCountMax=3",
    "-n",
    "-N",
    "-L",
    `${input.localPort}:127.0.0.1:${input.remotePort}`,
    hostSpec,
  ];
  const tunnelCommand = ["ssh", ...args];
  const spawner = yield* effect_unstable_process.ChildProcessSpawner.ChildProcessSpawner;
  const scope = yield* effect_Scope.Scope;
  yield* effect_Effect.logDebug("ssh.tunnel.spawn.start", {
    ...sshTargetLogFields(input.resolvedTarget),
    command: tunnelCommand,
    localPort: input.localPort,
    remotePort: input.remotePort,
    remoteServerKind: input.remoteServerKind,
    httpBaseUrl: input.httpBaseUrl,
  });
  const child = yield* spawner
    .spawn(
      effect_unstable_process.ChildProcess.make("ssh", args, {
        env: childEnvironment,
        shell: process.platform === "win32",
        stdin: {
          stream: effect_Stream.empty,
          endOnDone: true,
        },
      }),
    )
    .pipe(
      effect_Effect.mapError(
        (cause) =>
          new SshCommandError({
            command: tunnelCommand,
            exitCode: null,
            stderr: "",
            message:
              cause instanceof Error
                ? cause.message
                : `Failed to spawn SSH tunnel for ${input.resolvedTarget.alias}.`,
            cause,
          }),
      ),
    );
  yield* effect_Effect.logDebug("ssh.tunnel.spawn.succeeded", {
    ...sshTargetLogFields(input.resolvedTarget),
    command: tunnelCommand,
    pid: child.pid,
    localPort: input.localPort,
    remotePort: input.remotePort,
    httpBaseUrl: input.httpBaseUrl,
  });
  const tunnelEntry = {
    key: input.key,
    target: input.resolvedTarget,
    remotePort: input.remotePort,
    remoteServerKind: input.remoteServerKind,
    localPort: input.localPort,
    httpBaseUrl: input.httpBaseUrl,
    wsBaseUrl: input.wsBaseUrl,
    process: child,
    scope,
  };
  const exitFailure = effect_Effect
    .all([collectProcessOutput(child.stderr), child.exitCode.pipe(effect_Effect.map(Number))], {
      concurrency: "unbounded",
    })
    .pipe(
      effect_Effect.mapError(
        (cause) =>
          new SshCommandError({
            command: tunnelCommand,
            exitCode: null,
            stderr: "",
            message:
              cause instanceof Error
                ? cause.message
                : `Failed to monitor SSH tunnel for ${input.resolvedTarget.alias}.`,
            cause,
          }),
      ),
      effect_Effect.flatMap(([stderr, exitCode]) => {
        const error = new SshCommandError({
          command: tunnelCommand,
          exitCode,
          stderr,
          message: normalizeSshErrorMessage(
            stderr,
            `SSH tunnel exited unexpectedly for ${input.resolvedTarget.alias} (exit ${exitCode}).`,
          ),
        });
        return effect_Effect
          .logWarning("ssh.tunnel.process.exited", {
            ...sshTargetLogFields(input.resolvedTarget),
            command: tunnelCommand,
            pid: child.pid,
            localPort: input.localPort,
            remotePort: input.remotePort,
            httpBaseUrl: input.httpBaseUrl,
            exitCode,
            stderr,
          })
          .pipe(effect_Effect.andThen(effect_Effect.fail(error)));
      }),
    );
  yield* effect_Effect
    .raceFirst(
      waitForHttpReady$1({
        baseUrl: input.httpBaseUrl,
        timeoutMs: SSH_READY_TIMEOUT_MS,
      }),
      exitFailure,
    )
    .pipe(
      effect_Effect.tap(() =>
        effect_Effect.logInfo("ssh.tunnel.ready", {
          ...sshTargetLogFields(input.resolvedTarget),
          command: tunnelCommand,
          pid: child.pid,
          localPort: input.localPort,
          remotePort: input.remotePort,
          httpBaseUrl: input.httpBaseUrl,
        }),
      ),
      effect_Effect.tapError((cause) =>
        effect_Effect.gen(function* () {
          const net = yield* NetService;
          const processRunningExit = yield* effect_Effect.exit(child.isRunning);
          const localPortAvailableExit = yield* effect_Effect.exit(
            net.canListenOnHost(input.localPort, "127.0.0.1"),
          );
          const remoteLogTailExit = yield* effect_Effect.exit(
            readRemoteServerLogTail(input.resolvedTarget, input.authOptions),
          );
          const processRunning = effect_Exit.isSuccess(processRunningExit)
            ? processRunningExit.value
            : null;
          const localPortAvailable = effect_Exit.isSuccess(localPortAvailableExit)
            ? localPortAvailableExit.value
            : null;
          const remoteLogTail = effect_Exit.isSuccess(remoteLogTailExit)
            ? remoteLogTailExit.value || null
            : null;
          yield* effect_Effect.logWarning("ssh.tunnel.ready.failed", {
            ...sshTargetLogFields(input.resolvedTarget),
            command: tunnelCommand,
            pid: child.pid,
            processRunning,
            ...(effect_Exit.isSuccess(processRunningExit)
              ? {}
              : { processRunningError: processRunningExit.cause }),
            localPort: input.localPort,
            localPortListening: localPortAvailable === null ? null : !localPortAvailable,
            remotePort: input.remotePort,
            httpBaseUrl: input.httpBaseUrl,
            ...(effect_Exit.isSuccess(localPortAvailableExit)
              ? {}
              : { localPortProbeError: localPortAvailableExit.cause }),
            ...(remoteLogTail === null ? {} : { remoteLogTail }),
            ...(effect_Exit.isSuccess(remoteLogTailExit)
              ? {}
              : { remoteLogTailError: remoteLogTailExit.cause }),
            cause,
          });
        }),
      ),
      effect_Effect.onExit((exit) =>
        effect_Exit.isSuccess(exit)
          ? effect_Effect.void
          : child
              .kill({
                killSignal: "SIGTERM",
                forceKillAfter: TUNNEL_SHUTDOWN_TIMEOUT_MS,
              })
              .pipe(effect_Effect.ignore),
      ),
    );
  return tunnelEntry;
});
const makeSshEnvironmentManager = effect_Effect.fn("ssh/tunnel.SshEnvironmentManager.make")(
  function* (options = {}) {
    const managerScope = yield* effect_Scope.Scope;
    const tunnels = /* @__PURE__ */ new Map();
    const pendingTunnelEntries = /* @__PURE__ */ new Map();
    const authSecrets = /* @__PURE__ */ new Map();
    const closeTunnelEntry = effect_Effect.fn("ssh/tunnel.closeTunnelEntry")(function* (entry) {
      yield* effect_Effect.logDebug("ssh.tunnel.close.start", {
        ...sshTargetLogFields(entry.target),
        key: entry.key,
        localPort: entry.localPort,
        remotePort: entry.remotePort,
      });
      yield* effect_Scope.close(entry.scope, effect_Exit.void).pipe(effect_Effect.ignore);
      yield* effect_Effect.logInfo("ssh.tunnel.close.succeeded", {
        ...sshTargetLogFields(entry.target),
        key: entry.key,
        localPort: entry.localPort,
        remotePort: entry.remotePort,
      });
    });
    const cancelPendingTunnelEntry = effect_Effect.fn("ssh/tunnel.cancelPendingTunnelEntry")(
      function* (key, target) {
        const pending = pendingTunnelEntries.get(key);
        if (!pending) return;
        pendingTunnelEntries.delete(key);
        yield* effect_Deferred
          .fail(pending, makeSshTunnelCancelledError(target))
          .pipe(effect_Effect.ignore);
      },
    );
    yield* effect_Scope.addFinalizer(
      managerScope,
      effect_Effect
        .sync(() => [...tunnels.values()])
        .pipe(
          effect_Effect.flatMap((entries) =>
            effect_Effect.forEach(entries, closeTunnelEntry, { concurrency: "unbounded" }),
          ),
          effect_Effect.ignore,
        ),
    );
    const promptForPassword = effect_Effect.fn("ssh/tunnel.promptForPassword")(
      function* (target, attempt) {
        const promptService = yield* SshPasswordPrompt;
        const hostSpec = yield* buildSshHostSpecEffect(target);
        if (!promptService.isAvailable) {
          yield* effect_Effect.logWarning("ssh.auth.passwordPrompt.unavailable", {
            ...sshTargetLogFields(target),
            attempt,
          });
          return yield* new SshPasswordPromptError({
            message: `SSH authentication failed for ${hostSpec}.`,
          });
        }
        yield* effect_Effect.logInfo("ssh.auth.passwordPrompt.request", {
          ...sshTargetLogFields(target),
          attempt,
        });
        const password = yield* promptService.request({
          attempt,
          destination: target.alias.trim() || target.hostname.trim(),
          username: target.username,
          prompt: `Enter the SSH password for ${hostSpec}.`,
        });
        if (password === null) {
          yield* effect_Effect.logWarning("ssh.auth.passwordPrompt.cancelled", {
            ...sshTargetLogFields(target),
            attempt,
          });
          return yield* new SshPasswordPromptError({
            message: `SSH authentication cancelled for ${hostSpec}.`,
          });
        }
        yield* effect_Effect.logInfo("ssh.auth.passwordPrompt.received", {
          ...sshTargetLogFields(target),
          attempt,
        });
        return password;
      },
    );
    const handleSshAuthFailure = effect_Effect.fn("ssh/tunnel.runWithSshAuthAttempt.handleFailure")(
      function* (input) {
        if (!isSshAuthFailure(input.error)) return yield* input.error;
        yield* effect_Effect.logWarning("ssh.auth.failed", {
          ...sshTargetLogFields(input.target),
          key: input.key,
          promptCount: input.promptCount,
          cause: input.error,
        });
        if (!(yield* SshPasswordPrompt).isAvailable) return yield* input.error;
        if (input.authSecret !== null) authSecrets.delete(input.key);
        if (input.promptCount >= 2) return yield* input.error;
        const nextPromptCount = input.promptCount + 1;
        const nextAuthSecret = yield* promptForPassword(input.target, nextPromptCount);
        authSecrets.set(input.key, nextAuthSecret);
        return yield* runWithSshAuthAttempt({
          ...input,
          promptCount: nextPromptCount,
          authSecret: nextAuthSecret,
        });
      },
    );
    const runWithSshAuthAttempt = effect_Effect.fn("ssh/tunnel.runWithSshAuthAttempt")(
      function* (input) {
        const promptService = yield* SshPasswordPrompt;
        const authOptions =
          input.authSecret === null
            ? {
                batchMode: promptService.isAvailable ? "yes" : "no",
                interactiveAuth: !promptService.isAvailable,
              }
            : {
                authSecret: input.authSecret,
                batchMode: "no",
                interactiveAuth: true,
              };
        return yield* input.operation(authOptions).pipe(
          effect_Effect.catch((error) =>
            handleSshAuthFailure({
              ...input,
              error,
            }),
          ),
        );
      },
    );
    const runWithSshAuth = effect_Effect.fn("ssh/tunnel.runWithSshAuth")(function* (input) {
      return yield* runWithSshAuthAttempt({
        ...input,
        promptCount: 0,
        authSecret: authSecrets.get(input.key) ?? null,
      });
    });
    const createTunnelEntry = effect_Effect.fn("ssh/tunnel.ensureTunnelEntry.create")(
      function* (input) {
        yield* effect_Effect.logDebug("ssh.environment.tunnel.create.start", {
          ...sshTargetLogFields(input.resolvedTarget),
          ...sshRunnerLogFields(input.runner),
          key: input.key,
        });
        const remoteLaunch = yield* runWithSshAuth({
          key: input.key,
          target: input.resolvedTarget,
          operation: (authOptions) =>
            launchOrReuseRemoteServer(input.resolvedTarget, authOptions, input.runner),
        });
        const remotePort = remoteLaunch.remotePort;
        yield* effect_Effect.logDebug("ssh.environment.remotePort.ready", {
          ...sshTargetLogFields(input.resolvedTarget),
          key: input.key,
          remotePort,
          remoteServerKind: remoteLaunch.remoteServerKind,
        });
        const localPort = yield* reserveLocalTunnelPort();
        const httpBaseUrl = `http://127.0.0.1:${localPort}/`;
        const wsBaseUrl = `ws://127.0.0.1:${localPort}/`;
        yield* effect_Effect.logDebug("ssh.environment.localPort.reserved", {
          ...sshTargetLogFields(input.resolvedTarget),
          key: input.key,
          localPort,
          remotePort,
        });
        const entryScope = yield* effect_Scope.make("sequential");
        const tunnelEntry = yield* runWithSshAuth({
          key: input.key,
          target: input.resolvedTarget,
          operation: (authOptions) =>
            startSshTunnel({
              key: input.key,
              resolvedTarget: input.resolvedTarget,
              remotePort,
              localPort,
              httpBaseUrl,
              wsBaseUrl,
              authOptions,
              remoteServerKind: remoteLaunch.remoteServerKind,
            }).pipe(effect_Effect.provideService(effect_Scope.Scope, entryScope)),
        }).pipe(
          effect_Effect.onExit((exit) =>
            effect_Exit.isSuccess(exit)
              ? effect_Effect.void
              : effect_Scope.close(entryScope, effect_Exit.void).pipe(effect_Effect.ignore),
          ),
        );
        tunnels.set(input.key, tunnelEntry);
        const spawnerService =
          yield* effect_unstable_process.ChildProcessSpawner.ChildProcessSpawner;
        const fileSystemService = yield* effect_FileSystem.FileSystem;
        const pathService = yield* effect_Path.Path;
        yield* effect_Scope.addFinalizer(
          entryScope,
          effect_Effect
            .gen(function* () {
              if (tunnels.get(tunnelEntry.key) !== tunnelEntry) return;
              yield* effect_Effect.logDebug("ssh.environment.tunnel.finalizer.start", {
                ...sshTargetLogFields(tunnelEntry.target),
                key: tunnelEntry.key,
                localPort: tunnelEntry.localPort,
                remotePort: tunnelEntry.remotePort,
              });
              tunnels.delete(tunnelEntry.key);
              const authSecret = authSecrets.get(tunnelEntry.key) ?? null;
              yield* effect_Effect
                .all(
                  [
                    tunnelEntry.process.kill({
                      killSignal: "SIGTERM",
                      forceKillAfter: TUNNEL_SHUTDOWN_TIMEOUT_MS,
                    }),
                    stopRemoteServer(
                      tunnelEntry.target,
                      authSecret === null
                        ? {
                            batchMode: "yes",
                            interactiveAuth: false,
                          }
                        : {
                            authSecret,
                            batchMode: "no",
                            interactiveAuth: true,
                          },
                    ).pipe(
                      effect_Effect.provideService(
                        effect_unstable_process.ChildProcessSpawner.ChildProcessSpawner,
                        spawnerService,
                      ),
                      effect_Effect.provideService(effect_FileSystem.FileSystem, fileSystemService),
                      effect_Effect.provideService(effect_Path.Path, pathService),
                    ),
                  ],
                  { concurrency: "unbounded" },
                )
                .pipe(effect_Effect.ignore);
              yield* effect_Effect.logDebug("ssh.environment.tunnel.finalizer.succeeded", {
                ...sshTargetLogFields(tunnelEntry.target),
                key: tunnelEntry.key,
                localPort: tunnelEntry.localPort,
                remotePort: tunnelEntry.remotePort,
              });
            })
            .pipe(effect_Effect.ignore),
        );
        yield* effect_Effect.logDebug("ssh.environment.tunnel.create.succeeded", {
          ...sshTargetLogFields(input.resolvedTarget),
          key: input.key,
          localPort,
          remotePort,
        });
        return tunnelEntry;
      },
    );
    const ensureTunnelEntry = effect_Effect.fn("ssh/tunnel.ensureTunnelEntry")(
      function* (key, resolvedTarget, runner) {
        let entry = tunnels.get(key) ?? null;
        if (entry !== null) {
          yield* effect_Effect.logDebug("ssh.environment.tunnel.existing.check", {
            ...sshTargetLogFields(resolvedTarget),
            key,
            localPort: entry.localPort,
            remotePort: entry.remotePort,
          });
          const readinessExit = yield* effect_Effect.exit(
            waitForHttpReady$1({
              baseUrl: entry.httpBaseUrl,
              timeoutMs: 2e3,
            }),
          );
          if (effect_Exit.isSuccess(readinessExit)) {
            yield* effect_Effect.logDebug("ssh.environment.tunnel.reused", {
              ...sshTargetLogFields(resolvedTarget),
              key,
              localPort: entry.localPort,
              remotePort: entry.remotePort,
            });
            return entry;
          }
          yield* effect_Effect.logWarning("ssh.environment.tunnel.existing.stale", {
            ...sshTargetLogFields(resolvedTarget),
            key,
            localPort: entry.localPort,
            remotePort: entry.remotePort,
            cause: readinessExit.cause,
          });
          yield* closeTunnelEntry(entry);
          yield* cancelPendingTunnelEntry(key, resolvedTarget);
          entry = null;
        }
        const pending = pendingTunnelEntries.get(key);
        if (pending) {
          yield* effect_Effect.logDebug("ssh.environment.tunnel.pending.await", {
            ...sshTargetLogFields(resolvedTarget),
            key,
          });
          return yield* effect_Deferred.await(pending);
        }
        const deferred = yield* effect_Deferred.make();
        pendingTunnelEntries.set(key, deferred);
        return yield* createTunnelEntry({
          key,
          resolvedTarget,
          ...(runner === void 0 ? {} : { runner }),
        }).pipe(
          effect_Effect.tapError((cause) =>
            effect_Effect.logWarning("ssh.environment.tunnel.create.failed", {
              ...sshTargetLogFields(resolvedTarget),
              key,
              cause,
            }),
          ),
          effect_Effect.onExit((exit) =>
            effect_Effect
              .sync(() => {
                if (pendingTunnelEntries.get(key) === deferred) pendingTunnelEntries.delete(key);
              })
              .pipe(effect_Effect.andThen(effect_Deferred.done(deferred, exit))),
          ),
        );
      },
    );
    const ensureEnvironment = effect_Effect.fn("ssh/tunnel.ensureEnvironment")(
      function* (target, requestOptions) {
        yield* effect_Effect.logInfo("ssh.environment.ensure.start", {
          ...sshTargetLogFields(target),
          issuePairingToken: requestOptions?.issuePairingToken === true,
        });
        const resolvedTarget = {
          ...(yield* resolveSshTarget(target.alias || target.hostname)),
          ...(target.username !== null ? { username: target.username } : {}),
          ...(target.port !== null ? { port: target.port } : {}),
        };
        const key = targetConnectionKey(resolvedTarget);
        yield* effect_Effect.logDebug("ssh.environment.target.resolved", {
          ...sshTargetLogFields(resolvedTarget),
          key,
        });
        const packageSpec = options.resolveCliPackageSpec?.();
        const runner =
          options.resolveCliRunner === void 0
            ? packageSpec === void 0
              ? void 0
              : { packageSpec }
            : yield* options.resolveCliRunner;
        yield* effect_Effect.logDebug("ssh.environment.runner.resolved", {
          ...sshTargetLogFields(resolvedTarget),
          ...sshRunnerLogFields(runner),
          key,
        });
        const entry = yield* ensureTunnelEntry(key, resolvedTarget, runner);
        const pairingToken =
          (requestOptions?.issuePairingToken
            ? yield* runWithSshAuth({
                key,
                target: entry.target,
                operation: (authOptions) =>
                  issueRemotePairingToken(entry.target, authOptions, runner),
              })
            : null
          )?.credential ?? null;
        yield* effect_Effect.logInfo("ssh.environment.ensure.succeeded", {
          ...sshTargetLogFields(entry.target),
          key,
          localPort: entry.localPort,
          remotePort: entry.remotePort,
          remoteServerKind: entry.remoteServerKind,
          issuedPairingToken: pairingToken !== null,
        });
        return {
          target: entry.target,
          httpBaseUrl: entry.httpBaseUrl,
          wsBaseUrl: entry.wsBaseUrl,
          pairingToken,
          remotePort: entry.remotePort,
          ...(entry.remoteServerKind ? { remoteServerKind: entry.remoteServerKind } : {}),
        };
      },
    );
    const disconnectEnvironment = effect_Effect.fn("ssh/tunnel.disconnectEnvironment")(
      function* (target) {
        yield* effect_Effect.logInfo(
          "ssh.environment.disconnect.start",
          sshTargetLogFields(target),
        );
        const resolvedTarget = {
          ...(yield* resolveSshTarget(target.alias || target.hostname)),
          ...(target.username !== null ? { username: target.username } : {}),
          ...(target.port !== null ? { port: target.port } : {}),
        };
        const key = targetConnectionKey(resolvedTarget);
        const entry = tunnels.get(key) ?? null;
        yield* effect_Effect.logDebug("ssh.environment.disconnect.targetResolved", {
          ...sshTargetLogFields(resolvedTarget),
          key,
          hasTunnel: entry !== null,
          hasPendingTunnel: pendingTunnelEntries.has(key),
        });
        if (entry !== null) yield* closeTunnelEntry(entry);
        yield* cancelPendingTunnelEntry(key, resolvedTarget);
        if (entry === null)
          yield* runWithSshAuth({
            key,
            target: resolvedTarget,
            operation: (authOptions) => stopRemoteServer(resolvedTarget, authOptions),
          });
        yield* effect_Effect.logInfo("ssh.environment.disconnect.succeeded", {
          ...sshTargetLogFields(resolvedTarget),
          key,
        });
      },
    );
    return SshEnvironmentManager.of({
      ensureEnvironment,
      disconnectEnvironment,
    });
  },
);
var SshEnvironmentManager = class SshEnvironmentManager extends effect_Context.Service()(
  "@t3tools/ssh/SshEnvironmentManager",
) {
  static layer = (options = {}) =>
    effect_Layer.effect(SshEnvironmentManager, makeSshEnvironmentManager(options));
};

//#endregion
//#region src/ssh/DesktopSshPasswordPrompts.ts
const DEFAULT_SSH_PASSWORD_PROMPT_TIMEOUT_MS = 180 * 1e3;
const WINDOW_UNAVAILABLE_MESSAGE = "Pearce Codes window is not available for SSH authentication.";
var DesktopSshPromptWindowUnavailableError = class extends effect_Data.TaggedError(
  "DesktopSshPromptWindowUnavailableError",
) {
  get message() {
    return WINDOW_UNAVAILABLE_MESSAGE;
  }
};
var DesktopSshPromptSendError = class extends effect_Data.TaggedError("DesktopSshPromptSendError") {
  get message() {
    return WINDOW_UNAVAILABLE_MESSAGE;
  }
};
var DesktopSshPromptTimedOutError = class extends effect_Data.TaggedError(
  "DesktopSshPromptTimedOutError",
) {
  get message() {
    return `SSH authentication timed out for ${this.destination}.`;
  }
};
var DesktopSshPromptCancelledError = class extends effect_Data.TaggedError(
  "DesktopSshPromptCancelledError",
) {
  get message() {
    return this.reason;
  }
};
var DesktopSshPromptInvalidRequestIdError = class extends effect_Data.TaggedError(
  "DesktopSshPromptInvalidRequestIdError",
) {
  get message() {
    return "Invalid SSH password prompt id.";
  }
};
var DesktopSshPromptExpiredError = class extends effect_Data.TaggedError(
  "DesktopSshPromptExpiredError",
) {
  get message() {
    return "SSH password prompt expired. Try connecting again.";
  }
};
function isDesktopSshPasswordPromptCancellation$1(error) {
  return (
    error instanceof DesktopSshPromptCancelledError ||
    error instanceof DesktopSshPromptTimedOutError
  );
}
var DesktopSshPasswordPrompts = class extends effect_Context.Service()(
  "t3/desktop/SshPasswordPrompts",
) {};
const removePending = (pendingRef, requestId) =>
  effect_Ref.modify(pendingRef, (pending) => {
    const entry = pending.get(requestId);
    if (entry === void 0) return [effect_Option.none(), pending];
    const nextPending = new Map(pending);
    nextPending.delete(requestId);
    return [effect_Option.some(entry), nextPending];
  });
const failPending = (pending, error) =>
  effect_Deferred.fail(pending.deferred, error).pipe(effect_Effect.asVoid);
const make$5 = effect_Effect.fn("desktop.sshPasswordPrompts.make")(function* (options = {}) {
  const electronWindow = yield* ElectronWindow;
  const pendingRef = yield* effect_Ref.make(/* @__PURE__ */ new Map());
  const passwordPromptTimeoutMs =
    options.passwordPromptTimeoutMs ?? DEFAULT_SSH_PASSWORD_PROMPT_TIMEOUT_MS;
  const cancelPending = (reason) =>
    effect_Ref.getAndSet(pendingRef, /* @__PURE__ */ new Map()).pipe(
      effect_Effect.flatMap((pending) =>
        effect_Effect.forEach(
          pending.values(),
          (entry) =>
            failPending(
              entry,
              new DesktopSshPromptCancelledError({
                requestId: entry.requestId,
                destination: entry.destination,
                reason,
              }),
            ),
          { discard: true },
        ),
      ),
      effect_Effect.asVoid,
    );
  yield* effect_Effect.addFinalizer(() =>
    cancelPending("SSH password prompt service stopped.").pipe(effect_Effect.ignore),
  );
  const resolve = effect_Effect.fn("desktop.sshPasswordPrompts.resolve")(function* (input) {
    const requestId = input.requestId.trim();
    if (requestId.length === 0)
      return yield* new DesktopSshPromptInvalidRequestIdError({ requestId: input.requestId });
    const pending = yield* removePending(pendingRef, requestId);
    if (effect_Option.isNone(pending))
      return yield* new DesktopSshPromptExpiredError({ requestId });
    const entry = pending.value;
    if (input.password === null) {
      yield* failPending(
        entry,
        new DesktopSshPromptCancelledError({
          requestId,
          destination: entry.destination,
          reason: `SSH authentication cancelled for ${entry.destination}.`,
        }),
      );
      return;
    }
    yield* effect_Deferred.succeed(entry.deferred, input.password).pipe(effect_Effect.asVoid);
  });
  const request = effect_Effect.fn("desktop.sshPasswordPrompts.request")(function* (input) {
    const window = yield* electronWindow.main;
    if (effect_Option.isNone(window) || window.value.isDestroyed())
      return yield* new DesktopSshPromptWindowUnavailableError({ destination: input.destination });
    const requestId = yield* effect_Random.nextUUIDv4;
    const now = yield* effect_DateTime.now;
    const expiresAt = effect_DateTime.formatIso(
      effect_DateTime.add(now, { milliseconds: passwordPromptTimeoutMs }),
    );
    const promptRequest = {
      requestId,
      destination: input.destination,
      username: input.username,
      prompt: input.prompt,
      expiresAt,
    };
    const deferred = yield* effect_Deferred.make();
    const pending = {
      requestId,
      destination: input.destination,
      deferred,
    };
    yield* effect_Ref.update(pendingRef, (entries) => new Map(entries).set(requestId, pending));
    const context = yield* effect_Effect.context();
    const runFork = effect_Effect.runForkWith(context);
    const cancelOnWindowClosed = () => {
      runFork(
        removePending(pendingRef, requestId).pipe(
          effect_Effect.flatMap((entry) =>
            effect_Option.match(entry, {
              onNone: () => effect_Effect.void,
              onSome: (pending) =>
                failPending(
                  pending,
                  new DesktopSshPromptCancelledError({
                    requestId,
                    destination: input.destination,
                    reason: "SSH authentication was cancelled because the app window closed.",
                  }),
                ),
            }),
          ),
        ),
      );
    };
    const cleanup = effect_Effect
      .sync(() => {
        if (!window.value.isDestroyed())
          window.value.removeListener("closed", cancelOnWindowClosed);
      })
      .pipe(effect_Effect.andThen(removePending(pendingRef, requestId)), effect_Effect.asVoid);
    const waitForPassword = effect_Deferred.await(deferred).pipe(
      effect_Effect.timeoutOption(effect_Duration.millis(passwordPromptTimeoutMs)),
      effect_Effect.flatMap(
        effect_Option.match({
          onNone: () =>
            effect_Effect.fail(
              new DesktopSshPromptTimedOutError({
                requestId,
                destination: input.destination,
              }),
            ),
          onSome: effect_Effect.succeed,
        }),
      ),
    );
    return yield* effect_Effect
      .try({
        try: () => {
          if (window.value.isDestroyed()) throw new Error(WINDOW_UNAVAILABLE_MESSAGE);
          window.value.once("closed", cancelOnWindowClosed);
          window.value.webContents.send(SSH_PASSWORD_PROMPT_CHANNEL, promptRequest);
          if (window.value.isDestroyed()) throw new Error(WINDOW_UNAVAILABLE_MESSAGE);
          if (window.value.isMinimized()) window.value.restore();
          if (window.value.isDestroyed()) throw new Error(WINDOW_UNAVAILABLE_MESSAGE);
          window.value.focus();
        },
        catch: (cause) =>
          new DesktopSshPromptSendError({
            requestId,
            destination: input.destination,
            cause,
          }),
      })
      .pipe(effect_Effect.andThen(waitForPassword), effect_Effect.ensuring(cleanup));
  });
  return DesktopSshPasswordPrompts.of({
    request,
    resolve,
    cancelPending,
  });
});
const layer$8 = (options = {}) => effect_Layer.effect(DesktopSshPasswordPrompts, make$5(options));

//#endregion
//#region src/ssh/DesktopSshEnvironment.ts
var DesktopSshEnvironment = class extends effect_Context.Service()("t3/desktop/SshEnvironment") {};
function discoverDesktopSshHostsEffect(input) {
  return discoverSshHosts$1(input ?? {});
}
function isDesktopSshPasswordPromptCancellation(error) {
  return (
    error instanceof SshPasswordPromptError && isDesktopSshPasswordPromptCancellation$1(error.cause)
  );
}
const makePasswordPrompt = (prompts) => ({
  isAvailable: true,
  request: (request) =>
    prompts.request(request).pipe(
      effect_Effect.mapError(
        (cause) =>
          new SshPasswordPromptError({
            message: cause.message,
            cause,
          }),
      ),
    ),
});
const make$4 = effect_Effect.gen(function* () {
  const manager = yield* SshEnvironmentManager;
  const prompts = yield* DesktopSshPasswordPrompts;
  const runtimeContext = yield* effect_Effect.context();
  const passwordPrompt = SshPasswordPrompt.of(makePasswordPrompt(prompts));
  return DesktopSshEnvironment.of({
    discoverHosts: (input) =>
      discoverDesktopSshHostsEffect(input).pipe(
        effect_Effect.provide(runtimeContext),
        effect_Effect.withSpan("desktop.ssh.discoverHosts"),
      ),
    ensureEnvironment: (target, ensureOptions) =>
      manager
        .ensureEnvironment(target, ensureOptions)
        .pipe(
          effect_Effect.provideService(SshPasswordPrompt, passwordPrompt),
          effect_Effect.provide(runtimeContext),
          effect_Effect.withSpan("desktop.ssh.ensureEnvironment"),
        ),
    disconnectEnvironment: (target) =>
      manager
        .disconnectEnvironment(target)
        .pipe(
          effect_Effect.provideService(SshPasswordPrompt, passwordPrompt),
          effect_Effect.provide(runtimeContext),
          effect_Effect.withSpan("desktop.ssh.disconnectEnvironment"),
        ),
  });
});
const layer$7 = (options = {}) =>
  effect_Layer.effect(DesktopSshEnvironment, make$4).pipe(
    effect_Layer.provide(
      SshEnvironmentManager.layer({
        ...(options.resolveCliPackageSpec === void 0
          ? {}
          : { resolveCliPackageSpec: options.resolveCliPackageSpec }),
        ...(options.resolveCliRunner === void 0
          ? {}
          : { resolveCliRunner: options.resolveCliRunner }),
      }),
    ),
  );

//#endregion
//#region src/ssh/DesktopSshRemoteApi.ts
var DesktopSshRemoteApiError = class extends effect_Data.TaggedError("DesktopSshRemoteApiError") {
  get message() {
    return `SSH remote API request failed during ${this.operation}.`;
  }
};
var DesktopSshRemoteApi = class extends effect_Context.Service()("t3/desktop/SshRemoteApi") {};
const decodeExecutionEnvironmentDescriptor = effect_Schema.decodeUnknownEffect(
  ExecutionEnvironmentDescriptor,
);
const decodeAuthBearerBootstrapResult =
  effect_Schema.decodeUnknownEffect(AuthBearerBootstrapResult);
const decodeAuthSessionState = effect_Schema.decodeUnknownEffect(AuthSessionState);
const decodeAuthWebSocketTokenResult = effect_Schema.decodeUnknownEffect(AuthWebSocketTokenResult);
const mapError = (operation) => (cause) =>
  new DesktopSshRemoteApiError({
    operation,
    cause,
  });
const make$3 = effect_Effect.gen(function* () {
  const httpClient = yield* effect_unstable_http.HttpClient.HttpClient;
  const provideHttpClient = (effect) =>
    effect.pipe(
      effect_Effect.provideService(effect_unstable_http.HttpClient.HttpClient, httpClient),
    );
  return DesktopSshRemoteApi.of({
    fetchEnvironmentDescriptor: ({ httpBaseUrl }) =>
      fetchLoopbackSshJson({
        httpBaseUrl,
        pathname: "/.well-known/t3/environment",
      }).pipe(
        effect_Effect.flatMap(decodeExecutionEnvironmentDescriptor),
        effect_Effect.mapError(mapError("fetch-environment-descriptor")),
        provideHttpClient,
        effect_Effect.withSpan("desktop.sshRemoteApi.fetchEnvironmentDescriptor"),
      ),
    bootstrapBearerSession: ({ httpBaseUrl, credential }) =>
      fetchLoopbackSshJson({
        httpBaseUrl,
        pathname: "/api/auth/bootstrap/bearer",
        method: "POST",
        body: { credential },
      }).pipe(
        effect_Effect.flatMap(decodeAuthBearerBootstrapResult),
        effect_Effect.mapError(mapError("bootstrap-bearer-session")),
        provideHttpClient,
        effect_Effect.withSpan("desktop.sshRemoteApi.bootstrapBearerSession"),
      ),
    fetchSessionState: ({ httpBaseUrl, bearerToken }) =>
      fetchLoopbackSshJson({
        httpBaseUrl,
        pathname: "/api/auth/session",
        bearerToken,
      }).pipe(
        effect_Effect.flatMap(decodeAuthSessionState),
        effect_Effect.mapError(mapError("fetch-session-state")),
        provideHttpClient,
        effect_Effect.withSpan("desktop.sshRemoteApi.fetchSessionState"),
      ),
    issueWebSocketToken: ({ httpBaseUrl, bearerToken }) =>
      fetchLoopbackSshJson({
        httpBaseUrl,
        pathname: "/api/auth/ws-token",
        method: "POST",
        bearerToken,
      }).pipe(
        effect_Effect.flatMap(decodeAuthWebSocketTokenResult),
        effect_Effect.mapError(mapError("issue-websocket-token")),
        provideHttpClient,
        effect_Effect.withSpan("desktop.sshRemoteApi.issueWebSocketToken"),
      ),
  });
});
const layer$6 = effect_Layer.effect(DesktopSshRemoteApi, make$3);

//#endregion
//#region src/ipc/methods/sshEnvironment.ts
const discoverSshHosts = makeIpcMethod({
  channel: DISCOVER_SSH_HOSTS_CHANNEL,
  payload: effect_Schema.Void,
  result: effect_Schema.Array(DesktopDiscoveredSshHostSchema),
  handler: effect_Effect.fn("desktop.ipc.sshEnvironment.discoverHosts")(function* () {
    return yield* (yield* DesktopSshEnvironment).discoverHosts();
  }),
});
const ensureSshEnvironment = makeIpcMethod({
  channel: ENSURE_SSH_ENVIRONMENT_CHANNEL,
  payload: DesktopSshEnvironmentEnsureInputSchema,
  result: DesktopSshEnvironmentEnsureResultSchema,
  handler: effect_Effect.fn("desktop.ipc.sshEnvironment.ensureEnvironment")(function* ({
    target,
    options,
  }) {
    return yield* (yield* DesktopSshEnvironment).ensureEnvironment(target, options).pipe(
      effect_Effect.catch((error) =>
        isDesktopSshPasswordPromptCancellation(error)
          ? effect_Effect.succeed({
              type: DesktopSshPasswordPromptCancelledType,
              message: error.message,
            })
          : effect_Effect.fail(error),
      ),
    );
  }),
});
const disconnectSshEnvironment = makeIpcMethod({
  channel: DISCONNECT_SSH_ENVIRONMENT_CHANNEL,
  payload: DesktopSshEnvironmentTargetSchema,
  result: effect_Schema.Void,
  handler: effect_Effect.fn("desktop.ipc.sshEnvironment.disconnectEnvironment")(function* (target) {
    yield* (yield* DesktopSshEnvironment).disconnectEnvironment(target);
  }),
});
const fetchSshEnvironmentDescriptor = makeIpcMethod({
  channel: FETCH_SSH_ENVIRONMENT_DESCRIPTOR_CHANNEL,
  payload: DesktopSshHttpBaseUrlInputSchema,
  result: ExecutionEnvironmentDescriptor,
  handler: effect_Effect.fn("desktop.ipc.sshEnvironment.fetchDescriptor")(function* ({
    httpBaseUrl,
  }) {
    return yield* (yield* DesktopSshRemoteApi).fetchEnvironmentDescriptor({ httpBaseUrl });
  }),
});
const bootstrapSshBearerSession = makeIpcMethod({
  channel: BOOTSTRAP_SSH_BEARER_SESSION_CHANNEL,
  payload: DesktopSshBearerBootstrapInputSchema,
  result: AuthBearerBootstrapResult,
  handler: effect_Effect.fn("desktop.ipc.sshEnvironment.bootstrapBearerSession")(function* ({
    httpBaseUrl,
    credential,
  }) {
    return yield* (yield* DesktopSshRemoteApi).bootstrapBearerSession({
      httpBaseUrl,
      credential,
    });
  }),
});
const fetchSshSessionState = makeIpcMethod({
  channel: FETCH_SSH_SESSION_STATE_CHANNEL,
  payload: DesktopSshBearerRequestInputSchema,
  result: AuthSessionState,
  handler: effect_Effect.fn("desktop.ipc.sshEnvironment.fetchSessionState")(function* ({
    httpBaseUrl,
    bearerToken,
  }) {
    return yield* (yield* DesktopSshRemoteApi).fetchSessionState({
      httpBaseUrl,
      bearerToken,
    });
  }),
});
const issueSshWebSocketToken = makeIpcMethod({
  channel: ISSUE_SSH_WEBSOCKET_TOKEN_CHANNEL,
  payload: DesktopSshBearerRequestInputSchema,
  result: AuthWebSocketTokenResult,
  handler: effect_Effect.fn("desktop.ipc.sshEnvironment.issueWebSocketToken")(function* ({
    httpBaseUrl,
    bearerToken,
  }) {
    return yield* (yield* DesktopSshRemoteApi).issueWebSocketToken({
      httpBaseUrl,
      bearerToken,
    });
  }),
});
const resolveSshPasswordPrompt = makeIpcMethod({
  channel: RESOLVE_SSH_PASSWORD_PROMPT_CHANNEL,
  payload: DesktopSshPasswordPromptResolutionInputSchema,
  result: effect_Schema.Void,
  handler: effect_Effect.fn("desktop.ipc.sshEnvironment.resolvePasswordPrompt")(function* ({
    requestId,
    password,
  }) {
    yield* (yield* DesktopSshPasswordPrompts).resolve({
      requestId,
      password,
    });
  }),
});

//#endregion
//#region src/backend/DesktopBackendConfiguration.ts
var DesktopBackendConfiguration = class extends effect_Context.Service()(
  "t3/desktop/BackendConfiguration",
) {};
const emptyBackendObservabilitySettings = {
  otlpTracesUrl: effect_Option.none(),
  otlpMetricsUrl: effect_Option.none(),
};
const DESKTOP_BACKEND_ENV_NAMES = [
  "T3CODE_PORT",
  "T3CODE_MODE",
  "T3CODE_NO_BROWSER",
  "T3CODE_HOST",
  "T3CODE_DESKTOP_WS_URL",
  "T3CODE_DESKTOP_LAN_ACCESS",
  "T3CODE_DESKTOP_LAN_HOST",
  "T3CODE_DESKTOP_HTTPS_ENDPOINTS",
  "T3CODE_TAILSCALE_SERVE",
  "T3CODE_TAILSCALE_SERVE_PORT",
];
const backendChildEnvPatch = () =>
  Object.fromEntries(DESKTOP_BACKEND_ENV_NAMES.map((name) => [name, void 0]));
const { logWarning: logBackendConfigurationWarning } = makeComponentLogger(
  "desktop-backend-configuration",
);
const readPersistedBackendObservabilitySettings = effect_Effect.gen(function* () {
  const fileSystem = yield* effect_FileSystem.FileSystem;
  const environment = yield* DesktopEnvironment;
  if (
    !(yield* fileSystem
      .exists(environment.serverSettingsPath)
      .pipe(effect_Effect.orElseSucceed(() => false)))
  )
    return emptyBackendObservabilitySettings;
  const raw = yield* fileSystem
    .readFileString(environment.serverSettingsPath)
    .pipe(effect_Effect.option);
  if (effect_Option.isNone(raw)) {
    yield* logBackendConfigurationWarning(
      "failed to read persisted backend observability settings",
    );
    return emptyBackendObservabilitySettings;
  }
  const parsed = parsePersistedServerObservabilitySettings(raw.value);
  return {
    otlpTracesUrl: effect_Option.fromNullishOr(parsed.otlpTracesUrl),
    otlpMetricsUrl: effect_Option.fromNullishOr(parsed.otlpMetricsUrl),
  };
});
const getOrCreateBootstrapToken = effect_Effect.fn("desktop.backendConfiguration.bootstrapToken")(
  function* (tokenRef) {
    const existing = yield* effect_Ref.get(tokenRef);
    if (effect_Option.isSome(existing)) return existing.value;
    let token = "";
    while (token.length < 48) token += (yield* effect_Random.nextUUIDv4).replace(/-/g, "");
    token = token.slice(0, 48);
    yield* effect_Ref.set(tokenRef, effect_Option.some(token));
    return token;
  },
);
const resolveBackendStartConfig = effect_Effect.fn(
  "desktop.backendConfiguration.resolveStartConfig",
)(function* (input) {
  const environment = yield* DesktopEnvironment;
  const backendExposure = yield* (yield* DesktopServerExposure).backendConfig;
  return {
    executablePath: process.execPath,
    entryPath: environment.backendEntryPath,
    cwd: environment.backendCwd,
    env: {
      ...backendChildEnvPatch(),
      ELECTRON_RUN_AS_NODE: "1",
    },
    bootstrap: {
      mode: "desktop",
      noBrowser: true,
      port: backendExposure.port,
      t3Home: environment.baseDir,
      host: backendExposure.bindHost,
      desktopBootstrapToken: input.bootstrapToken,
      tailscaleServeEnabled: backendExposure.tailscaleServeEnabled,
      tailscaleServePort: backendExposure.tailscaleServePort,
      ...effect_Option.match(input.observabilitySettings.otlpTracesUrl, {
        onNone: () => ({}),
        onSome: (otlpTracesUrl) => ({ otlpTracesUrl }),
      }),
      ...effect_Option.match(input.observabilitySettings.otlpMetricsUrl, {
        onNone: () => ({}),
        onSome: (otlpMetricsUrl) => ({ otlpMetricsUrl }),
      }),
    },
    httpBaseUrl: backendExposure.httpBaseUrl,
    captureOutput: true,
  };
});
const layer$5 = effect_Layer.effect(
  DesktopBackendConfiguration,
  effect_Effect.gen(function* () {
    const environment = yield* DesktopEnvironment;
    const fileSystem = yield* effect_FileSystem.FileSystem;
    const serverExposure = yield* DesktopServerExposure;
    const tokenRef = yield* effect_Ref.make(effect_Option.none());
    return DesktopBackendConfiguration.of({
      resolve: effect_Effect
        .gen(function* () {
          return yield* resolveBackendStartConfig({
            bootstrapToken: yield* getOrCreateBootstrapToken(tokenRef),
            observabilitySettings: yield* readPersistedBackendObservabilitySettings.pipe(
              effect_Effect.provideService(effect_FileSystem.FileSystem, fileSystem),
              effect_Effect.provideService(DesktopEnvironment, environment),
            ),
          }).pipe(
            effect_Effect.provideService(DesktopEnvironment, environment),
            effect_Effect.provideService(DesktopServerExposure, serverExposure),
          );
        })
        .pipe(effect_Effect.withSpan("desktop.backendConfiguration.resolve")),
    });
  }),
);

//#endregion
//#region src/backend/DesktopBackendManager.ts
const INITIAL_RESTART_DELAY = effect_Duration.millis(500);
const MAX_RESTART_DELAY = effect_Duration.seconds(10);
const DEFAULT_BACKEND_READINESS_TIMEOUT = effect_Duration.minutes(1);
const DEFAULT_BACKEND_READINESS_INTERVAL = effect_Duration.millis(100);
const DEFAULT_BACKEND_READINESS_REQUEST_TIMEOUT = effect_Duration.seconds(1);
const DEFAULT_BACKEND_TERMINATE_GRACE = effect_Duration.seconds(2);
const BACKEND_READINESS_PATH = "/.well-known/t3/environment";
var BackendTimeoutError = class extends effect_Data.TaggedError("BackendTimeoutError") {
  get message() {
    return `Timed out waiting for backend readiness at ${this.url.href}.`;
  }
};
var BackendProcessBootstrapEncodeError = class extends effect_Data.TaggedError(
  "BackendProcessBootstrapEncodeError",
) {
  get message() {
    return `Failed to encode desktop backend bootstrap payload: ${this.cause.message}`;
  }
};
var BackendProcessSpawnError = class extends effect_Data.TaggedError("BackendProcessSpawnError") {
  get message() {
    return `Failed to spawn desktop backend process: ${this.cause.message}`;
  }
};
var DesktopBackendManager = class extends effect_Context.Service()("t3/desktop/BackendManager") {};
const { logWarning: logBackendManagerWarning, logError: logBackendManagerError } =
  makeComponentLogger("desktop-backend-manager");
const initialState = {
  desiredRunning: false,
  ready: false,
  config: effect_Option.none(),
  active: effect_Option.none(),
  restartAttempt: 0,
  restartFiber: effect_Option.none(),
  nextRunId: 1,
};
const activePid = (active) => effect_Option.flatMap(active, (run) => run.pid);
const withActiveRun = (runId, f) => (state) => ({
  ...state,
  active: effect_Option.map(state.active, (run) => (run.id === runId ? f(run) : run)),
});
const calculateRestartDelay = (attempt) =>
  effect_Duration.min(
    effect_Duration.times(INITIAL_RESTART_DELAY, 2 ** attempt),
    MAX_RESTART_DELAY,
  );
const closeRun = (run, options) => {
  const waitForFiber = effect_Option.match(run.fiber, {
    onNone: () => effect_Effect.void,
    onSome: (fiber) => effect_Fiber.await(fiber).pipe(effect_Effect.asVoid),
  });
  const close = effect_Scope
    .close(run.scope, effect_Exit.void)
    .pipe(effect_Effect.andThen(waitForFiber));
  return (
    options?.timeout
      ? close.pipe(effect_Effect.timeoutOption(options.timeout), effect_Effect.asVoid)
      : close
  ).pipe(effect_Effect.ignore);
};
const waitForHttpReady = effect_Effect.fn("desktop.backendManager.waitForHttpReady")(
  function* (baseUrl, timeout) {
    const readinessUrl = new URL(BACKEND_READINESS_PATH, baseUrl);
    yield* (yield* effect_unstable_http.HttpClient.HttpClient)
      .pipe(
        effect_unstable_http.HttpClient.filterStatusOk,
        effect_unstable_http.HttpClient.transformResponse(
          effect_Effect.timeout(DEFAULT_BACKEND_READINESS_REQUEST_TIMEOUT),
        ),
        effect_unstable_http.HttpClient.retry(
          effect_Schedule.spaced(DEFAULT_BACKEND_READINESS_INTERVAL),
        ),
      )
      .get(readinessUrl)
      .pipe(
        effect_Effect.asVoid,
        effect_Effect.timeout(timeout),
        effect_Effect.mapError(() => new BackendTimeoutError({ url: readinessUrl })),
      );
  },
);
function describeProcessExit(result) {
  if (effect_Result.isSuccess(result))
    return {
      code: effect_Option.some(result.success),
      reason: `code=${result.success}`,
      result,
    };
  return {
    code: effect_Option.none(),
    reason: result.failure.message,
    result,
  };
}
function drainBackendOutput(streamName, stream, onOutput) {
  return stream.pipe(
    effect_Stream.runForEach((chunk) => onOutput(streamName, chunk)),
    effect_Effect.ignore,
  );
}
const encodeBootstrapJson = effect_Schema.encodeEffect(
  effect_Schema.fromJsonString(DesktopBackendBootstrap),
);
const runBackendProcess = effect_Effect.fn("runBackendProcess")(function* (options) {
  const spawner = yield* effect_unstable_process.ChildProcessSpawner.ChildProcessSpawner;
  const bootstrapJson = yield* encodeBootstrapJson(options.bootstrap).pipe(
    effect_Effect.mapError((cause) => new BackendProcessBootstrapEncodeError({ cause })),
  );
  const onOutput = options.onOutput ?? (() => effect_Effect.void);
  const command = effect_unstable_process.ChildProcess.make(
    options.executablePath,
    [options.entryPath, "--bootstrap-fd", "3"],
    {
      cwd: options.cwd,
      env: options.env,
      extendEnv: true,
      stdin: "ignore",
      stdout: options.captureOutput ? "pipe" : "inherit",
      stderr: options.captureOutput ? "pipe" : "inherit",
      killSignal: "SIGTERM",
      forceKillAfter: DEFAULT_BACKEND_TERMINATE_GRACE,
      additionalFds: {
        fd3: {
          type: "input",
          stream: effect_Stream.encodeText(effect_Stream.make(`${bootstrapJson}\n`)),
        },
      },
    },
  );
  const handle = yield* spawner
    .spawn(command)
    .pipe(effect_Effect.mapError((cause) => new BackendProcessSpawnError({ cause })));
  yield* options.onStarted?.(handle.pid) ?? effect_Effect.void;
  if (options.captureOutput) {
    yield* drainBackendOutput("stdout", handle.stdout, onOutput).pipe(effect_Effect.forkScoped);
    yield* drainBackendOutput("stderr", handle.stderr, onOutput).pipe(effect_Effect.forkScoped);
  }
  yield* waitForHttpReady(
    options.httpBaseUrl,
    options.readinessTimeout ?? DEFAULT_BACKEND_READINESS_TIMEOUT,
  ).pipe(
    effect_Effect.tap(() => options.onReady?.() ?? effect_Effect.void),
    effect_Effect.catch((error) => options.onReadinessFailure?.(error) ?? effect_Effect.void),
    effect_Effect.forkScoped,
  );
  return describeProcessExit(yield* effect_Effect.result(handle.exitCode));
});
const makeDesktopBackendManager = effect_Effect.fn("makeDesktopBackendManager")(function* () {
  const parentScope = yield* effect_Scope.Scope;
  const fileSystem = yield* effect_FileSystem.FileSystem;
  const configuration = yield* DesktopBackendConfiguration;
  const backendOutputLog = yield* DesktopBackendOutputLog;
  const desktopState = yield* DesktopState;
  const desktopWindow = yield* DesktopWindow;
  const spawner = yield* effect_unstable_process.ChildProcessSpawner.ChildProcessSpawner;
  const httpClient = yield* effect_unstable_http.HttpClient.HttpClient;
  const state = yield* effect_Ref.make(initialState);
  const mutex = yield* effect_Semaphore.make(1);
  const updateActiveRun = (runId, f) => effect_Ref.update(state, withActiveRun(runId, f));
  const snapshot = effect_Ref.get(state).pipe(
    effect_Effect.map((current) => ({
      desiredRunning: current.desiredRunning,
      ready: current.ready,
      activePid: activePid(current.active),
      restartAttempt: current.restartAttempt,
      restartScheduled: effect_Option.isSome(current.restartFiber),
    })),
  );
  const currentConfig = effect_Ref.get(state).pipe(effect_Effect.map((current) => current.config));
  const cancelRestart = effect_Effect.gen(function* () {
    const restartFiber = yield* effect_Ref.modify(state, (current) => [
      current.restartFiber,
      {
        ...current,
        restartFiber: effect_Option.none(),
      },
    ]);
    yield* effect_Option.match(restartFiber, {
      onNone: () => effect_Effect.void,
      onSome: (fiber) => effect_Fiber.interrupt(fiber).pipe(effect_Effect.asVoid),
    });
  });
  const start = effect_Effect
    .suspend(() =>
      mutex.withPermits(1)(
        effect_Effect.gen(function* () {
          const current = yield* effect_Ref.get(state);
          if (effect_Option.isSome(current.active)) return;
          yield* effect_Ref.set(desktopState.backendReady, false);
          const config = yield* configuration.resolve;
          const entryExists = yield* fileSystem
            .exists(config.entryPath)
            .pipe(effect_Effect.orElseSucceed(() => false));
          yield* cancelRestart;
          yield* effect_Ref.update(state, (latest) => ({
            ...latest,
            desiredRunning: true,
            ready: false,
            config: effect_Option.some(config),
          }));
          if (!entryExists) {
            yield* scheduleRestart(`missing server entry at ${config.entryPath}`);
            return;
          }
          const runScope = yield* effect_Scope.make("sequential");
          const runId = yield* effect_Ref.modify(state, (latest) => [
            latest.nextRunId,
            {
              ...latest,
              active: effect_Option.some({
                id: latest.nextRunId,
                scope: runScope,
                fiber: effect_Option.none(),
                pid: effect_Option.none(),
              }),
              nextRunId: latest.nextRunId + 1,
            },
          ]);
          const finalizeRun = effect_Effect.fn("desktop.backendManager.finalizeRun")(
            function* (reason) {
              yield* mutex.withPermits(1)(
                effect_Effect.gen(function* () {
                  const { isCurrentRun, nextState, pid } = yield* effect_Ref.modify(
                    state,
                    (latest) => {
                      const currentRun = effect_Option.getOrUndefined(latest.active);
                      if (currentRun?.id !== runId)
                        return [
                          {
                            isCurrentRun: false,
                            nextState: latest,
                            pid: effect_Option.none(),
                          },
                          latest,
                        ];
                      const next = {
                        ...latest,
                        active: effect_Option.none(),
                        ready: false,
                      };
                      return [
                        {
                          isCurrentRun: true,
                          nextState: next,
                          pid: currentRun.pid,
                        },
                        next,
                      ];
                    },
                  );
                  if (isCurrentRun) {
                    if (effect_Option.isSome(pid))
                      yield* backendOutputLog.writeSessionBoundary({
                        phase: "END",
                        details: `pid=${pid.value} ${reason}`,
                      });
                    yield* effect_Ref.set(desktopState.backendReady, false);
                  }
                  if (isCurrentRun && nextState.desiredRunning) yield* scheduleRestart(reason);
                }),
              );
            },
          );
          const program = runBackendProcess({
            ...config,
            onStarted: effect_Effect.fn("desktop.backendManager.onStarted")(function* (pid) {
              yield* updateActiveRun(runId, (run) => ({
                ...run,
                pid: effect_Option.some(pid),
              }));
              yield* backendOutputLog.writeSessionBoundary({
                phase: "START",
                details: `pid=${pid} port=${config.bootstrap.port} cwd=${config.cwd}`,
              });
            }),
            onReady: effect_Effect.fn("desktop.backendManager.onReady")(function* () {
              if (
                !(yield* effect_Ref.modify(state, (latest) => {
                  if (effect_Option.getOrUndefined(latest.active)?.id !== runId)
                    return [false, latest];
                  return [
                    true,
                    {
                      ...latest,
                      restartAttempt: 0,
                      ready: true,
                    },
                  ];
                }))
              )
                return;
              yield* effect_Ref.set(desktopState.backendReady, true);
              yield* desktopWindow.handleBackendReady.pipe(
                effect_Effect.catch((error) =>
                  logBackendManagerError("failed to open main window after backend readiness", {
                    message: error.message,
                  }),
                ),
              );
            }),
            onReadinessFailure: (error) =>
              logBackendManagerWarning("backend readiness check failed during bootstrap", {
                error: error.message,
              }),
            onOutput: (streamName, chunk) => backendOutputLog.writeOutputChunk(streamName, chunk),
          }).pipe(
            effect_Effect.provideService(
              effect_unstable_process.ChildProcessSpawner.ChildProcessSpawner,
              spawner,
            ),
            effect_Effect.provideService(effect_unstable_http.HttpClient.HttpClient, httpClient),
            effect_Scope.provide(runScope),
            effect_Effect.matchEffect({
              onFailure: (error) => finalizeRun(error.message),
              onSuccess: (exit) => finalizeRun(exit.reason),
            }),
            effect_Effect.ensuring(
              effect_Scope.close(runScope, effect_Exit.void).pipe(effect_Effect.ignore),
            ),
          );
          const fiber = yield* effect_Effect.forkIn(program, parentScope);
          yield* updateActiveRun(runId, (run) => ({
            ...run,
            fiber: effect_Option.some(fiber),
          }));
        }),
      ),
    )
    .pipe(effect_Effect.withSpan("desktop.backendManager.start"));
  const scheduleRestart = effect_Effect.fn("desktop.backendManager.scheduleRestart")(
    function* (reason) {
      const scheduled = yield* effect_Ref.modify(state, (latest) => {
        if (!latest.desiredRunning || effect_Option.isSome(latest.restartFiber))
          return [effect_Option.none(), latest];
        const delay = calculateRestartDelay(latest.restartAttempt);
        return [
          effect_Option.some(delay),
          {
            ...latest,
            restartAttempt: latest.restartAttempt + 1,
          },
        ];
      });
      yield* effect_Option.match(scheduled, {
        onNone: () => effect_Effect.void,
        onSome: effect_Effect.fn("desktop.backendManager.scheduleRestartFiber")(function* (delay) {
          yield* logBackendManagerError("backend exited unexpectedly; restart scheduled", {
            reason,
            delayMs: effect_Duration.toMillis(delay),
          });
          const restartFiber = yield* effect_Effect.forkIn(
            effect_Effect.sleep(delay).pipe(
              effect_Effect.andThen(
                effect_Ref.modify(state, (latest) => {
                  return [
                    latest.desiredRunning,
                    {
                      ...latest,
                      restartFiber: effect_Option.none(),
                    },
                  ];
                }),
              ),
              effect_Effect.flatMap((shouldRestart) =>
                shouldRestart ? start : effect_Effect.void,
              ),
              effect_Effect.catchCause((cause) =>
                logBackendManagerError("desktop backend restart fiber failed", {
                  cause: effect_Cause.pretty(cause),
                }),
              ),
            ),
            parentScope,
          );
          yield* effect_Ref.update(state, (latest) =>
            effect_Option.isNone(latest.restartFiber)
              ? {
                  ...latest,
                  restartFiber: effect_Option.some(restartFiber),
                }
              : latest,
          );
        }),
      });
    },
  );
  const stop = effect_Effect.fn("desktop.backendManager.stop")(function* (options) {
    const { active, restartFiber } = yield* mutex.withPermits(1)(
      effect_Effect.gen(function* () {
        const result = yield* effect_Ref.modify(state, (latest) => [
          {
            active: latest.active,
            restartFiber: latest.restartFiber,
          },
          {
            ...latest,
            desiredRunning: false,
            ready: false,
            active: effect_Option.none(),
            restartFiber: effect_Option.none(),
          },
        ]);
        yield* effect_Ref.set(desktopState.backendReady, false);
        return result;
      }),
    );
    yield* effect_Option.match(restartFiber, {
      onNone: () => effect_Effect.void,
      onSome: (fiber) => effect_Fiber.interrupt(fiber).pipe(effect_Effect.asVoid),
    });
    yield* effect_Option.match(active, {
      onNone: () => effect_Effect.void,
      onSome: (run) => closeRun(run, options),
    });
  });
  yield* effect_Effect.addFinalizer(() => stop());
  return DesktopBackendManager.of({
    start,
    stop,
    currentConfig,
    snapshot,
  });
});
const layer$4 = effect_Layer.effect(DesktopBackendManager, makeDesktopBackendManager());

//#endregion
//#region src/updates/updateMachine.ts
function nextStatusAfterDownloadFailure(currentState) {
  return currentState.availableVersion ? "available" : "error";
}
function getCanRetryAfterDownloadFailure(currentState) {
  return currentState.availableVersion !== null;
}
function createInitialDesktopUpdateState(currentVersion, runtimeInfo, channel) {
  return {
    enabled: false,
    status: "disabled",
    channel,
    currentVersion,
    hostArch: runtimeInfo.hostArch,
    appArch: runtimeInfo.appArch,
    runningUnderArm64Translation: runtimeInfo.runningUnderArm64Translation,
    availableVersion: null,
    downloadedVersion: null,
    downloadPercent: null,
    checkedAt: null,
    message: null,
    errorContext: null,
    canRetry: false,
  };
}
function reduceDesktopUpdateStateOnCheckStart(state, checkedAt) {
  return {
    ...state,
    status: "checking",
    checkedAt,
    message: null,
    downloadPercent: null,
    errorContext: null,
    canRetry: false,
  };
}
function reduceDesktopUpdateStateOnCheckFailure(state, message, checkedAt) {
  return {
    ...state,
    status: "error",
    message,
    checkedAt,
    downloadPercent: null,
    errorContext: "check",
    canRetry: true,
  };
}
function reduceDesktopUpdateStateOnUpdateAvailable(state, version, checkedAt) {
  return {
    ...state,
    status: "available",
    availableVersion: version,
    downloadedVersion: null,
    downloadPercent: null,
    checkedAt,
    message: null,
    errorContext: null,
    canRetry: false,
  };
}
function reduceDesktopUpdateStateOnNoUpdate(state, checkedAt) {
  return {
    ...state,
    status: "up-to-date",
    availableVersion: null,
    downloadedVersion: null,
    downloadPercent: null,
    checkedAt,
    message: null,
    errorContext: null,
    canRetry: false,
  };
}
function reduceDesktopUpdateStateOnDownloadStart(state) {
  return {
    ...state,
    status: "downloading",
    downloadPercent: 0,
    message: null,
    errorContext: null,
    canRetry: false,
  };
}
function reduceDesktopUpdateStateOnDownloadFailure(state, message) {
  return {
    ...state,
    status: nextStatusAfterDownloadFailure(state),
    message,
    downloadPercent: null,
    errorContext: "download",
    canRetry: getCanRetryAfterDownloadFailure(state),
  };
}
function reduceDesktopUpdateStateOnDownloadProgress(state, percent) {
  return {
    ...state,
    status: "downloading",
    downloadPercent: percent,
    message: null,
    errorContext: null,
    canRetry: false,
  };
}
function reduceDesktopUpdateStateOnDownloadComplete(state, version) {
  return {
    ...state,
    status: "downloaded",
    availableVersion: version,
    downloadedVersion: version,
    downloadPercent: 100,
    message: null,
    errorContext: null,
    canRetry: true,
  };
}
function reduceDesktopUpdateStateOnInstallFailure(state, message) {
  return {
    ...state,
    status: "downloaded",
    message,
    errorContext: "install",
    canRetry: true,
  };
}

//#endregion
//#region src/updates/DesktopUpdates.ts
const AUTO_UPDATE_STARTUP_DELAY = "15 seconds";
const AUTO_UPDATE_POLL_INTERVAL = "4 minutes";
const AppUpdateYmlConfig = effect_Schema.Record(effect_Schema.String, effect_Schema.String);
const UpdateInfo = effect_Schema.Struct({ version: effect_Schema.String });
const DownloadProgressInfo = effect_Schema.Struct({ percent: effect_Schema.Number });
const decodeAppUpdateYmlConfig = effect_Schema.decodeUnknownEffect(AppUpdateYmlConfig);
const decodeUpdateInfo = effect_Schema.decodeUnknownEffect(UpdateInfo);
const decodeDownloadProgressInfo = effect_Schema.decodeUnknownEffect(DownloadProgressInfo);
const currentIsoTimestamp = effect_DateTime.now.pipe(effect_Effect.map(effect_DateTime.formatIso));
var DesktopUpdateActionInProgressError = class extends effect_Data.TaggedError(
  "DesktopUpdateActionInProgressError",
) {
  get message() {
    return `Cannot change update tracks while an update ${this.action} action is in progress.`;
  }
};
var DesktopUpdatePersistenceError = class extends effect_Data.TaggedError(
  "DesktopUpdatePersistenceError",
) {
  get message() {
    return "Failed to persist desktop update settings.";
  }
};
var DesktopUpdates = class extends effect_Context.Service()("t3/desktop/Updates") {};
const {
  logInfo: logUpdaterInfo$1,
  logWarning: logUpdaterWarning,
  logError: logUpdaterError,
} = makeComponentLogger("desktop-updater");
function parseAppUpdateYml(raw) {
  const entries = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match?.[1] && match[2]) entries[match[1]] = match[2].trim();
  }
  return decodeAppUpdateYmlConfig(entries).pipe(
    effect_Effect.map((config) =>
      config.provider ? effect_Option.some(config) : effect_Option.none(),
    ),
    effect_Effect.catch(() => effect_Effect.succeed(effect_Option.none())),
  );
}
function createBaseUpdateState(channel, enabled, environment) {
  return {
    ...createInitialDesktopUpdateState(environment.appVersion, environment.runtimeInfo, channel),
    enabled,
    status: enabled ? "idle" : "disabled",
  };
}
function getCanRetryFromState(state) {
  return state.availableVersion !== null || state.downloadedVersion !== null;
}
function shouldBroadcastDownloadProgress(currentState, nextPercent) {
  if (currentState.status !== "downloading") return true;
  const currentPercent = currentState.downloadPercent;
  if (currentPercent === null) return true;
  const previousStep = Math.floor(currentPercent / 10);
  return Math.floor(nextPercent / 10) !== previousStep || nextPercent === 100;
}
function getAutoUpdateDisabledReason(args) {
  if (!args.hasUpdateFeedConfig)
    return "Automatic updates are not available because no update feed is configured.";
  if (args.isDevelopment || !args.isPackaged)
    return "Automatic updates are only available in packaged production builds.";
  if (args.disabledByEnv)
    return "Automatic updates are disabled by the T3CODE_DISABLE_AUTO_UPDATE setting.";
  if (args.platform === "linux" && !args.appImage)
    return "Automatic updates on Linux require running the AppImage build.";
  return null;
}
function isArm64HostRunningIntelBuild(runtimeInfo) {
  return runtimeInfo.hostArch === "arm64" && runtimeInfo.appArch === "x64";
}
const make$2 = effect_Effect.gen(function* () {
  const config = yield* DesktopConfig;
  const backendManager = yield* DesktopBackendManager;
  const desktopState = yield* DesktopState;
  const electronUpdater = yield* ElectronUpdater;
  const electronWindow = yield* ElectronWindow;
  const environment = yield* DesktopEnvironment;
  const fileSystem = yield* effect_FileSystem.FileSystem;
  const desktopSettings = yield* DesktopAppSettings;
  const appUpdateYmlConfigRef = yield* effect_Ref.make(effect_Option.none());
  const updateCheckInFlightRef = yield* effect_Ref.make(false);
  const updateDownloadInFlightRef = yield* effect_Ref.make(false);
  const updateInstallInFlightRef = yield* effect_Ref.make(false);
  const updaterConfiguredRef = yield* effect_Ref.make(false);
  const lastLoggedDownloadMilestoneRef = yield* effect_Ref.make(-1);
  const updateStateRef = yield* effect_Ref.make(
    createInitialDesktopUpdateState(
      environment.appVersion,
      environment.runtimeInfo,
      environment.defaultDesktopSettings.updateChannel,
    ),
  );
  const emitState = effect_Ref
    .get(updateStateRef)
    .pipe(effect_Effect.flatMap((state) => electronWindow.sendAll(UPDATE_STATE_CHANNEL, state)));
  const setState = (state) =>
    effect_Ref.set(updateStateRef, state).pipe(effect_Effect.andThen(emitState));
  const updateState = (f) =>
    effect_Ref.get(updateStateRef).pipe(
      effect_Effect.flatMap((state) => {
        const nextState = f(state);
        return setState(nextState).pipe(effect_Effect.as(nextState));
      }),
    );
  const readAppUpdateYml = fileSystem.readFileString(environment.appUpdateYmlPath, "utf-8").pipe(
    effect_Effect.option,
    effect_Effect.flatMap(
      effect_Option.match({
        onNone: () => effect_Effect.succeed(effect_Option.none()),
        onSome: parseAppUpdateYml,
      }),
    ),
  );
  const hasUpdateFeedConfig = effect_Ref
    .get(appUpdateYmlConfigRef)
    .pipe(
      effect_Effect.map(
        (appUpdateYmlConfig) => effect_Option.isSome(appUpdateYmlConfig) || config.mockUpdates,
      ),
    );
  const resolveDisabledReason = effect_Effect.gen(function* () {
    const hasFeedConfig = yield* hasUpdateFeedConfig;
    return effect_Option.fromNullishOr(
      getAutoUpdateDisabledReason({
        isDevelopment: environment.isDevelopment,
        isPackaged: environment.isPackaged,
        platform: environment.platform,
        appImage: effect_Option.getOrUndefined(config.appImagePath),
        disabledByEnv: config.disableAutoUpdate,
        hasUpdateFeedConfig: hasFeedConfig,
      }),
    );
  });
  const resolveUpdaterErrorContext = effect_Effect.gen(function* () {
    if (yield* effect_Ref.get(updateInstallInFlightRef)) return "install";
    if (yield* effect_Ref.get(updateDownloadInFlightRef)) return "download";
    if (yield* effect_Ref.get(updateCheckInFlightRef)) return "check";
    return (yield* effect_Ref.get(updateStateRef)).errorContext;
  });
  const activeUpdateAction = effect_Effect.gen(function* () {
    if (yield* effect_Ref.get(updateInstallInFlightRef)) return effect_Option.some("install");
    if (yield* effect_Ref.get(updateDownloadInFlightRef)) return effect_Option.some("download");
    if (yield* effect_Ref.get(updateCheckInFlightRef)) return effect_Option.some("check");
    return effect_Option.none();
  });
  const applyAutoUpdaterChannel = effect_Effect.fn("desktop.updates.applyAutoUpdaterChannel")(
    function* (channel) {
      yield* effect_Effect.annotateCurrentSpan({ channel });
      const allowsPrerelease = channel === "nightly";
      yield* electronUpdater.setChannel(channel);
      yield* electronUpdater.setAllowPrerelease(allowsPrerelease);
      yield* electronUpdater.setAllowDowngrade(allowsPrerelease);
      yield* logUpdaterInfo$1("using update channel", {
        channel,
        allowPrerelease: allowsPrerelease,
        allowDowngrade: allowsPrerelease,
      });
    },
  );
  const shouldEnableAutoUpdates = resolveDisabledReason.pipe(
    effect_Effect.map(effect_Option.isNone),
  );
  const checkForUpdates = effect_Effect.fn("desktop.updates.checkForUpdates")(function* (reason) {
    yield* effect_Effect.annotateCurrentSpan({ reason });
    if (yield* effect_Ref.get(desktopState.quitting)) return false;
    if (!(yield* effect_Ref.get(updaterConfiguredRef))) return false;
    if (yield* effect_Ref.get(updateCheckInFlightRef)) return false;
    const state = yield* effect_Ref.get(updateStateRef);
    if (state.status === "downloading" || state.status === "downloaded") {
      yield* logUpdaterInfo$1("skipping update check while update is active", {
        reason,
        status: state.status,
      });
      return false;
    }
    yield* effect_Ref.set(updateCheckInFlightRef, true);
    yield* setState(reduceDesktopUpdateStateOnCheckStart(state, yield* currentIsoTimestamp));
    yield* logUpdaterInfo$1("checking for updates", { reason });
    return yield* electronUpdater.checkForUpdates.pipe(
      effect_Effect.as(true),
      effect_Effect.catch(
        effect_Effect.fn("desktop.updates.handleCheckForUpdatesFailure")(function* (error) {
          const failedAt = yield* currentIsoTimestamp;
          yield* updateState((current) =>
            reduceDesktopUpdateStateOnCheckFailure(current, error.message, failedAt),
          );
          yield* logUpdaterError("failed to check for updates", { message: error.message });
          return true;
        }),
      ),
      effect_Effect.ensuring(effect_Ref.set(updateCheckInFlightRef, false)),
    );
  });
  const downloadAvailableUpdate = effect_Effect
    .gen(function* () {
      const state = yield* effect_Ref.get(updateStateRef);
      if (
        !(yield* effect_Ref.get(updaterConfiguredRef)) ||
        (yield* effect_Ref.get(updateDownloadInFlightRef)) ||
        state.status !== "available"
      )
        return {
          accepted: false,
          completed: false,
        };
      yield* effect_Ref.set(updateDownloadInFlightRef, true);
      return yield* effect_Effect
        .gen(function* () {
          yield* setState(reduceDesktopUpdateStateOnDownloadStart(state));
          yield* electronUpdater.setDisableDifferentialDownload(
            isArm64HostRunningIntelBuild(environment.runtimeInfo),
          );
          yield* logUpdaterInfo$1("downloading update");
          yield* electronUpdater.downloadUpdate;
          return {
            accepted: true,
            completed: true,
          };
        })
        .pipe(
          effect_Effect.catch(
            effect_Effect.fn("desktop.updates.handleDownloadFailure")(function* (error) {
              yield* updateState((current) =>
                reduceDesktopUpdateStateOnDownloadFailure(current, error.message),
              );
              yield* logUpdaterError("failed to download update", { message: error.message });
              return {
                accepted: true,
                completed: false,
              };
            }),
          ),
          effect_Effect.ensuring(effect_Ref.set(updateDownloadInFlightRef, false)),
        );
    })
    .pipe(effect_Effect.withSpan("desktop.updates.downloadAvailableUpdate"));
  const installDownloadedUpdate = effect_Effect
    .gen(function* () {
      const state = yield* effect_Ref.get(updateStateRef);
      if (
        (yield* effect_Ref.get(desktopState.quitting)) ||
        !(yield* effect_Ref.get(updaterConfiguredRef)) ||
        state.status !== "downloaded"
      )
        return {
          accepted: false,
          completed: false,
        };
      yield* effect_Ref.set(desktopState.quitting, true);
      yield* effect_Ref.set(updateInstallInFlightRef, true);
      return yield* effect_Effect
        .gen(function* () {
          yield* backendManager.stop({ timeout: effect_Duration.seconds(5) });
          yield* electronWindow.destroyAll;
          yield* electronUpdater.quitAndInstall({
            isSilent: true,
            isForceRunAfter: true,
          });
          return {
            accepted: true,
            completed: false,
          };
        })
        .pipe(
          effect_Effect.catch(
            effect_Effect.fn("desktop.updates.handleInstallFailure")(function* (error) {
              yield* effect_Ref.set(updateInstallInFlightRef, false);
              yield* updateState((current) =>
                reduceDesktopUpdateStateOnInstallFailure(current, error.message),
              );
              yield* effect_Ref.set(desktopState.quitting, false);
              yield* logUpdaterError("failed to install update", { message: error.message });
              return {
                accepted: true,
                completed: false,
              };
            }),
          ),
        );
    })
    .pipe(effect_Effect.withSpan("desktop.updates.installDownloadedUpdate"));
  const startUpdatePollers = effect_Effect
    .gen(function* () {
      yield* effect_Effect.sleep(AUTO_UPDATE_STARTUP_DELAY).pipe(
        effect_Effect.andThen(checkForUpdates("startup")),
        effect_Effect.catchCause((cause) =>
          logUpdaterError("startup update check failed", { cause: effect_Cause.pretty(cause) }),
        ),
        effect_Effect.forkScoped,
      );
      yield* effect_Effect.sleep(AUTO_UPDATE_POLL_INTERVAL).pipe(
        effect_Effect.andThen(checkForUpdates("poll")),
        effect_Effect.forever,
        effect_Effect.catchCause((cause) =>
          logUpdaterError("poll update check failed", { cause: effect_Cause.pretty(cause) }),
        ),
        effect_Effect.forkScoped,
      );
    })
    .pipe(effect_Effect.withSpan("desktop.updates.startPollers"));
  const handleUpdateAvailable = effect_Effect.fn("desktop.updates.handleUpdateAvailable")(
    function* (raw) {
      yield* decodeUpdateInfo(raw).pipe(
        effect_Effect.flatMap(
          effect_Effect.fn("desktop.updates.applyUpdateAvailable")(function* (info) {
            const state = yield* effect_Ref.get(updateStateRef);
            if (resolveDefaultDesktopUpdateChannel(info.version) !== state.channel) {
              yield* logUpdaterInfo$1("ignoring update that does not match selected channel", {
                version: info.version,
                channel: state.channel,
              });
              yield* setState(
                reduceDesktopUpdateStateOnNoUpdate(state, yield* currentIsoTimestamp),
              );
              yield* effect_Ref.set(lastLoggedDownloadMilestoneRef, -1);
              return;
            }
            const checkedAt = yield* currentIsoTimestamp;
            yield* setState(
              reduceDesktopUpdateStateOnUpdateAvailable(state, info.version, checkedAt),
            );
            yield* effect_Ref.set(lastLoggedDownloadMilestoneRef, -1);
            yield* logUpdaterInfo$1("update available", { version: info.version });
          }),
        ),
        effect_Effect.catchCause((cause) =>
          logUpdaterWarning("ignored malformed update-available event", {
            cause: effect_Cause.pretty(cause),
          }),
        ),
      );
    },
  );
  const handleUpdateNotAvailable = effect_Effect
    .gen(function* () {
      const checkedAt = yield* currentIsoTimestamp;
      yield* setState(
        reduceDesktopUpdateStateOnNoUpdate(yield* effect_Ref.get(updateStateRef), checkedAt),
      );
      yield* effect_Ref.set(lastLoggedDownloadMilestoneRef, -1);
      yield* logUpdaterInfo$1("no updates available");
    })
    .pipe(effect_Effect.withSpan("desktop.updates.handleUpdateNotAvailable"));
  const handleUpdaterError = effect_Effect.fn("desktop.updates.handleUpdaterError")(
    function* (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (yield* effect_Ref.get(updateInstallInFlightRef)) {
        yield* effect_Ref.set(updateInstallInFlightRef, false);
        yield* effect_Ref.set(desktopState.quitting, false);
        yield* updateState((current) => reduceDesktopUpdateStateOnInstallFailure(current, message));
        yield* logUpdaterError("updater error", { message });
        return;
      }
      if (
        !(yield* effect_Ref.get(updateCheckInFlightRef)) &&
        !(yield* effect_Ref.get(updateDownloadInFlightRef))
      ) {
        const errorContext = yield* resolveUpdaterErrorContext;
        const checkedAt = yield* currentIsoTimestamp;
        yield* updateState((current) => ({
          ...current,
          status: "error",
          message,
          checkedAt,
          downloadPercent: null,
          errorContext,
          canRetry: getCanRetryFromState(current),
        }));
      }
      yield* logUpdaterError("updater error", { message });
    },
  );
  const handleDownloadProgress = effect_Effect.fn("desktop.updates.handleDownloadProgress")(
    function* (raw) {
      yield* decodeDownloadProgressInfo(raw).pipe(
        effect_Effect.flatMap(
          effect_Effect.fn("desktop.updates.applyDownloadProgress")(function* (progress) {
            const state = yield* effect_Ref.get(updateStateRef);
            const percent = Math.floor(progress.percent);
            if (shouldBroadcastDownloadProgress(state, progress.percent) || state.message !== null)
              yield* setState(reduceDesktopUpdateStateOnDownloadProgress(state, progress.percent));
            const milestone = percent - (percent % 10);
            if (milestone > (yield* effect_Ref.get(lastLoggedDownloadMilestoneRef))) {
              yield* effect_Ref.set(lastLoggedDownloadMilestoneRef, milestone);
              yield* logUpdaterInfo$1("download progress", { percent });
            }
          }),
        ),
        effect_Effect.catchCause((cause) =>
          logUpdaterWarning("ignored malformed download-progress event", {
            cause: effect_Cause.pretty(cause),
          }),
        ),
      );
    },
  );
  const handleUpdateDownloaded = effect_Effect.fn("desktop.updates.handleUpdateDownloaded")(
    function* (raw) {
      yield* decodeUpdateInfo(raw).pipe(
        effect_Effect.flatMap(
          effect_Effect.fn("desktop.updates.applyUpdateDownloaded")(function* (info) {
            yield* setState(
              reduceDesktopUpdateStateOnDownloadComplete(
                yield* effect_Ref.get(updateStateRef),
                info.version,
              ),
            );
            yield* logUpdaterInfo$1("update downloaded", { version: info.version });
          }),
        ),
        effect_Effect.catchCause((cause) =>
          logUpdaterWarning("ignored malformed update-downloaded event", {
            cause: effect_Cause.pretty(cause),
          }),
        ),
      );
    },
  );
  return DesktopUpdates.of({
    getState: effect_Ref.get(updateStateRef),
    emitState,
    disabledReason: resolveDisabledReason,
    configure: effect_Effect
      .gen(function* () {
        const context = yield* effect_Effect.context();
        const runEffect = (effect) => {
          effect_Effect.runPromiseWith(context)(effect);
        };
        const appUpdateYmlConfig = yield* readAppUpdateYml;
        yield* effect_Ref.set(appUpdateYmlConfigRef, appUpdateYmlConfig);
        if (config.mockUpdates)
          yield* electronUpdater.setFeedURL({
            provider: "generic",
            url: `http://localhost:${config.mockUpdateServerPort}`,
          });
        const settings = yield* desktopSettings.get;
        const enabled = yield* shouldEnableAutoUpdates;
        yield* setState(createBaseUpdateState(settings.updateChannel, enabled, environment));
        if (!enabled) return;
        yield* effect_Ref.set(updaterConfiguredRef, true);
        yield* electronUpdater.setAutoDownload(false);
        yield* electronUpdater.setAutoInstallOnAppQuit(false);
        yield* applyAutoUpdaterChannel(settings.updateChannel);
        yield* electronUpdater.setDisableDifferentialDownload(
          isArm64HostRunningIntelBuild(environment.runtimeInfo),
        );
        if (isArm64HostRunningIntelBuild(environment.runtimeInfo))
          yield* logUpdaterInfo$1(
            "Apple Silicon host detected while running Intel build; updates will switch to arm64 packages",
          );
        yield* electronUpdater.on("checking-for-update", () => {
          runEffect(
            logUpdaterInfo$1("looking for updates").pipe(
              effect_Effect.withSpan("desktop.updates.handleCheckingForUpdate"),
            ),
          );
        });
        yield* electronUpdater.on("update-available", (info) => {
          runEffect(handleUpdateAvailable(info));
        });
        yield* electronUpdater.on("update-not-available", () => {
          runEffect(handleUpdateNotAvailable);
        });
        yield* electronUpdater.on("error", (error) => {
          runEffect(handleUpdaterError(error));
        });
        yield* electronUpdater.on("download-progress", (progress) => {
          runEffect(handleDownloadProgress(progress));
        });
        yield* electronUpdater.on("update-downloaded", (info) => {
          runEffect(handleUpdateDownloaded(info));
        });
        yield* startUpdatePollers;
      })
      .pipe(effect_Effect.withSpan("desktop.updates.configure")),
    setChannel: effect_Effect.fn("desktop.updates.setChannel")(function* (nextChannel) {
      yield* effect_Effect.annotateCurrentSpan({ channel: nextChannel });
      const activeAction = yield* activeUpdateAction;
      if (effect_Option.isSome(activeAction))
        return yield* new DesktopUpdateActionInProgressError({ action: activeAction.value });
      const state = yield* effect_Ref.get(updateStateRef);
      if (nextChannel === state.channel) return state;
      yield* desktopSettings
        .setUpdateChannel(nextChannel)
        .pipe(effect_Effect.mapError((cause) => new DesktopUpdatePersistenceError({ cause })));
      const enabled = yield* shouldEnableAutoUpdates;
      yield* setState(createBaseUpdateState(nextChannel, enabled, environment));
      if (!enabled || !(yield* effect_Ref.get(updaterConfiguredRef)))
        return yield* effect_Ref.get(updateStateRef);
      yield* applyAutoUpdaterChannel(nextChannel);
      const allowDowngrade = yield* electronUpdater.allowDowngrade;
      yield* electronUpdater.setAllowDowngrade(true);
      yield* checkForUpdates("channel-change").pipe(
        effect_Effect.ensuring(
          electronUpdater.setAllowDowngrade(allowDowngrade).pipe(effect_Effect.ignore),
        ),
      );
      return yield* effect_Ref.get(updateStateRef);
    }),
    check: effect_Effect.fn("desktop.updates.check")(function* (reason) {
      yield* effect_Effect.annotateCurrentSpan({ reason });
      if (!(yield* effect_Ref.get(updaterConfiguredRef)))
        return {
          checked: false,
          state: yield* effect_Ref.get(updateStateRef),
        };
      return {
        checked: yield* checkForUpdates(reason),
        state: yield* effect_Ref.get(updateStateRef),
      };
    }),
    download: effect_Effect
      .gen(function* () {
        const result = yield* downloadAvailableUpdate;
        return {
          accepted: result.accepted,
          completed: result.completed,
          state: yield* effect_Ref.get(updateStateRef),
        };
      })
      .pipe(effect_Effect.withSpan("desktop.updates.download")),
    install: effect_Effect
      .gen(function* () {
        if (yield* effect_Ref.get(desktopState.quitting))
          return {
            accepted: false,
            completed: false,
            state: yield* effect_Ref.get(updateStateRef),
          };
        const result = yield* installDownloadedUpdate;
        return {
          accepted: result.accepted,
          completed: result.completed,
          state: yield* effect_Ref.get(updateStateRef),
        };
      })
      .pipe(effect_Effect.withSpan("desktop.updates.install")),
  });
});
const layer$3 = effect_Layer.effect(DesktopUpdates, make$2);

//#endregion
//#region src/ipc/methods/updates.ts
const getUpdateState = makeIpcMethod({
  channel: UPDATE_GET_STATE_CHANNEL,
  payload: effect_Schema.Void,
  result: DesktopUpdateStateSchema,
  handler: effect_Effect.fn("desktop.ipc.updates.getState")(function* () {
    return yield* (yield* DesktopUpdates).getState;
  }),
});
const setUpdateChannel = makeIpcMethod({
  channel: UPDATE_SET_CHANNEL_CHANNEL,
  payload: DesktopUpdateChannelSchema,
  result: DesktopUpdateStateSchema,
  handler: effect_Effect.fn("desktop.ipc.updates.setChannel")(function* (channel) {
    return yield* (yield* DesktopUpdates).setChannel(channel);
  }),
});
const downloadUpdate = makeIpcMethod({
  channel: UPDATE_DOWNLOAD_CHANNEL,
  payload: effect_Schema.Void,
  result: DesktopUpdateActionResultSchema,
  handler: effect_Effect.fn("desktop.ipc.updates.download")(function* () {
    return yield* (yield* DesktopUpdates).download;
  }),
});
const installUpdate = makeIpcMethod({
  channel: UPDATE_INSTALL_CHANNEL,
  payload: effect_Schema.Void,
  result: DesktopUpdateActionResultSchema,
  handler: effect_Effect.fn("desktop.ipc.updates.install")(function* () {
    return yield* (yield* DesktopUpdates).install;
  }),
});
const checkForUpdate = makeIpcMethod({
  channel: UPDATE_CHECK_CHANNEL,
  payload: effect_Schema.Void,
  result: DesktopUpdateCheckResultSchema,
  handler: effect_Effect.fn("desktop.ipc.updates.check")(function* () {
    return yield* (yield* DesktopUpdates).check("web-ui");
  }),
});

//#endregion
//#region src/ipc/methods/window.ts
const ContextMenuPosition = effect_Schema.Struct({
  x: effect_Schema.Number,
  y: effect_Schema.Number,
});
const ContextMenuInput = effect_Schema.Struct({
  items: effect_Schema.Array(ContextMenuItemSchema),
  position: effect_Schema.optionalKey(ContextMenuPosition),
});
function toWebSocketBaseUrl(httpBaseUrl) {
  const url = new URL(httpBaseUrl.href);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.href;
}
const getAppBranding = makeSyncIpcMethod({
  channel: GET_APP_BRANDING_CHANNEL,
  result: effect_Schema.NullOr(DesktopAppBrandingSchema),
  handler: effect_Effect.fn("desktop.ipc.window.getAppBranding")(function* () {
    return (yield* DesktopEnvironment).branding;
  }),
});
const getLocalEnvironmentBootstrap = makeSyncIpcMethod({
  channel: GET_LOCAL_ENVIRONMENT_BOOTSTRAP_CHANNEL,
  result: effect_Schema.NullOr(DesktopEnvironmentBootstrapSchema),
  handler: effect_Effect.fn("desktop.ipc.window.getLocalEnvironmentBootstrap")(function* () {
    const config = yield* (yield* DesktopBackendManager).currentConfig;
    return effect_Option.match(config, {
      onNone: () => null,
      onSome: ({ bootstrap, httpBaseUrl }) => ({
        label: "Local environment",
        httpBaseUrl: httpBaseUrl.href,
        wsBaseUrl: toWebSocketBaseUrl(httpBaseUrl),
        ...(bootstrap.desktopBootstrapToken
          ? { bootstrapToken: bootstrap.desktopBootstrapToken }
          : {}),
      }),
    });
  }),
});
const pickFolder = makeIpcMethod({
  channel: PICK_FOLDER_CHANNEL,
  payload: effect_Schema.UndefinedOr(PickFolderOptionsSchema),
  result: effect_Schema.NullOr(effect_Schema.String),
  handler: effect_Effect.fn("desktop.ipc.window.pickFolder")(function* (options) {
    const dialog = yield* ElectronDialog;
    const electronWindow = yield* ElectronWindow;
    const environment = yield* DesktopEnvironment;
    const selectedPath = yield* dialog.pickFolder({
      owner: yield* electronWindow.focusedMainOrFirst,
      defaultPath: environment.resolvePickFolderDefaultPath(options),
    });
    return effect_Option.getOrNull(selectedPath);
  }),
});
const confirm = makeIpcMethod({
  channel: CONFIRM_CHANNEL,
  payload: effect_Schema.String,
  result: effect_Schema.Boolean,
  handler: effect_Effect.fn("desktop.ipc.window.confirm")(function* (message) {
    const dialog = yield* ElectronDialog;
    return yield* (yield* ElectronWindow).focusedMainOrFirst.pipe(
      effect_Effect.flatMap((owner) =>
        dialog.confirm({
          owner,
          message,
        }),
      ),
    );
  }),
});
const setTheme = makeIpcMethod({
  channel: SET_THEME_CHANNEL,
  payload: DesktopThemeSchema,
  result: effect_Schema.Void,
  handler: effect_Effect.fn("desktop.ipc.window.setTheme")(function* (theme) {
    yield* (yield* ElectronTheme).setSource(theme);
  }),
});
const showContextMenu = makeIpcMethod({
  channel: CONTEXT_MENU_CHANNEL,
  payload: ContextMenuInput,
  result: effect_Schema.NullOr(effect_Schema.String),
  handler: effect_Effect.fn("desktop.ipc.window.showContextMenu")(function* (input) {
    const electronMenu = yield* ElectronMenu;
    const window = yield* (yield* ElectronWindow).focusedMainOrFirst;
    if (effect_Option.isNone(window)) return null;
    const selectedItemId = yield* electronMenu.showContextMenu({
      window: window.value,
      items: input.items,
      position: effect_Option.fromNullishOr(input.position),
    });
    return effect_Option.getOrNull(selectedItemId);
  }),
});
const openExternal = makeIpcMethod({
  channel: OPEN_EXTERNAL_CHANNEL,
  payload: effect_Schema.String,
  result: effect_Schema.Boolean,
  handler: effect_Effect.fn("desktop.ipc.window.openExternal")(function* (url) {
    return yield* (yield* ElectronShell).openExternal(url);
  }),
});

//#endregion
//#region src/ipc/DesktopIpcHandlers.ts
const installDesktopIpcHandlers = effect_Effect
  .gen(function* () {
    const ipc = yield* DesktopIpc;
    yield* ipc.handleSync(getAppBranding);
    yield* ipc.handleSync(getLocalEnvironmentBootstrap);
    yield* ipc.handle(getClientSettings);
    yield* ipc.handle(setClientSettings);
    yield* ipc.handle(getSavedEnvironmentRegistry);
    yield* ipc.handle(setSavedEnvironmentRegistry);
    yield* ipc.handle(getSavedEnvironmentSecret);
    yield* ipc.handle(setSavedEnvironmentSecret);
    yield* ipc.handle(removeSavedEnvironmentSecret);
    yield* ipc.handle(discoverSshHosts);
    yield* ipc.handle(ensureSshEnvironment);
    yield* ipc.handle(disconnectSshEnvironment);
    yield* ipc.handle(fetchSshEnvironmentDescriptor);
    yield* ipc.handle(bootstrapSshBearerSession);
    yield* ipc.handle(fetchSshSessionState);
    yield* ipc.handle(issueSshWebSocketToken);
    yield* ipc.handle(resolveSshPasswordPrompt);
    yield* ipc.handle(getServerExposureState);
    yield* ipc.handle(setServerExposureMode);
    yield* ipc.handle(setTailscaleServeEnabled);
    yield* ipc.handle(getAdvertisedEndpoints);
    yield* ipc.handle(pickFolder);
    yield* ipc.handle(confirm);
    yield* ipc.handle(setTheme);
    yield* ipc.handle(showContextMenu);
    yield* ipc.handle(openExternal);
    yield* ipc.handle(getUpdateState);
    yield* ipc.handle(setUpdateChannel);
    yield* ipc.handle(downloadUpdate);
    yield* ipc.handle(installUpdate);
    yield* ipc.handle(checkForUpdate);
  })
  .pipe(effect_Effect.withSpan("desktop.ipc.installHandlers"));

//#endregion
//#region src/app/DesktopAppIdentity.ts
const COMMIT_HASH_PATTERN = /^[0-9a-f]{7,40}$/i;
const COMMIT_HASH_DISPLAY_LENGTH = 12;
const AppPackageMetadata = effect_Schema.Struct({
  t3codeCommitHash: effect_Schema.optional(effect_Schema.String),
});
const decodeAppPackageMetadata = effect_Schema.decodeEffect(
  effect_Schema.fromJsonString(AppPackageMetadata),
);
var DesktopAppIdentity = class extends effect_Context.Service()("t3/desktop/AppIdentity") {};
const normalizeCommitHash = (value) => {
  const trimmed = value.trim();
  return COMMIT_HASH_PATTERN.test(trimmed)
    ? effect_Option.some(trimmed.slice(0, COMMIT_HASH_DISPLAY_LENGTH).toLowerCase())
    : effect_Option.none();
};
const make$1 = effect_Effect.gen(function* () {
  const assets = yield* DesktopAssets;
  const electronApp = yield* ElectronApp;
  const environment = yield* DesktopEnvironment;
  const fileSystem = yield* effect_FileSystem.FileSystem;
  const commitHashCache = yield* effect_Ref.make(effect_Option.none());
  const resolveEmbeddedCommitHash = effect_Effect.gen(function* () {
    const packageJsonPath = environment.path.join(environment.appRoot, "package.json");
    const raw = yield* fileSystem.readFileString(packageJsonPath).pipe(effect_Effect.option);
    return yield* effect_Option.match(raw, {
      onNone: () => effect_Effect.succeed(effect_Option.none()),
      onSome: (value) =>
        decodeAppPackageMetadata(value).pipe(
          effect_Effect.map((parsed) =>
            effect_Option
              .fromNullishOr(parsed.t3codeCommitHash)
              .pipe(effect_Option.flatMap(normalizeCommitHash)),
          ),
          effect_Effect.catch(() => effect_Effect.succeed(effect_Option.none())),
        ),
    });
  });
  const resolveAboutCommitHash = effect_Effect.gen(function* () {
    const cached = yield* effect_Ref.get(commitHashCache);
    if (effect_Option.isSome(cached)) return cached.value;
    const override = effect_Option.flatMap(environment.commitHashOverride, normalizeCommitHash);
    if (effect_Option.isSome(override)) {
      yield* effect_Ref.set(commitHashCache, effect_Option.some(override));
      return override;
    }
    if (!environment.isPackaged) {
      const empty = effect_Option.none();
      yield* effect_Ref.set(commitHashCache, effect_Option.some(empty));
      return empty;
    }
    const commitHash = yield* resolveEmbeddedCommitHash;
    yield* effect_Ref.set(commitHashCache, effect_Option.some(commitHash));
    return commitHash;
  });
  const resolveUserDataPath = effect_Effect
    .gen(function* () {
      const legacyPath = environment.path.join(
        environment.appDataDirectory,
        environment.legacyUserDataDirName,
      );
      return (yield* fileSystem.exists(legacyPath).pipe(effect_Effect.orElseSucceed(() => false)))
        ? legacyPath
        : environment.path.join(environment.appDataDirectory, environment.userDataDirName);
    })
    .pipe(effect_Effect.withSpan("desktop.appIdentity.resolveUserDataPath"));
  const configure = effect_Effect
    .gen(function* () {
      const commitHash = yield* resolveAboutCommitHash;
      yield* electronApp.setName(environment.displayName);
      yield* electronApp.setAboutPanelOptions({
        applicationName: environment.displayName,
        applicationVersion: environment.appVersion,
        version: effect_Option.getOrElse(commitHash, () => "unknown"),
      });
      if (environment.platform === "win32")
        yield* electronApp.setAppUserModelId(environment.appUserModelId);
      if (environment.platform === "linux")
        yield* electronApp.setDesktopName(environment.linuxDesktopEntryName);
      if (environment.platform === "darwin") {
        const iconPaths = yield* assets.iconPaths;
        yield* effect_Option.match(iconPaths.png, {
          onNone: () => effect_Effect.void,
          onSome: electronApp.setDockIcon,
        });
      }
    })
    .pipe(effect_Effect.withSpan("desktop.appIdentity.configure"));
  return DesktopAppIdentity.of({
    resolveUserDataPath,
    configure,
  });
});
const layer$2 = effect_Layer.effect(DesktopAppIdentity, make$1);

//#endregion
//#region src/window/DesktopApplicationMenu.ts
var DesktopApplicationMenu = class extends effect_Context.Service()(
  "t3/desktop/ApplicationMenu",
) {};
const { logInfo: logUpdaterInfo } = makeComponentLogger("desktop-updater");
const { logError: logMenuError } = makeComponentLogger("desktop-menu");
const dispatchMenuAction = effect_Effect.fn("desktop.menu.dispatchMenuAction")(function* (action) {
  yield* (yield* DesktopWindow).dispatchMenuAction(action);
});
const checkForUpdatesFromMenu = effect_Effect
  .gen(function* () {
    const updates = yield* DesktopUpdates;
    const electronDialog = yield* ElectronDialog;
    const updateState = (yield* updates.check("menu")).state;
    if (updateState.status === "up-to-date")
      yield* electronDialog.showMessageBox({
        type: "info",
        title: "You're up to date!",
        message: `Pearce Codes ${updateState.currentVersion} is currently the newest version available.`,
        buttons: ["OK"],
      });
    else if (updateState.status === "error")
      yield* electronDialog.showMessageBox({
        type: "warning",
        title: "Update check failed",
        message: "Could not check for updates.",
        detail: updateState.message ?? "An unknown error occurred. Please try again later.",
        buttons: ["OK"],
      });
  })
  .pipe(effect_Effect.withSpan("desktop.menu.checkForUpdates"));
const handleCheckForUpdatesMenuClick = effect_Effect
  .gen(function* () {
    const updates = yield* DesktopUpdates;
    const electronDialog = yield* ElectronDialog;
    const disabledReason = yield* updates.disabledReason;
    if (effect_Option.isSome(disabledReason)) {
      yield* logUpdaterInfo("manual update check requested, but updates are disabled", {
        disabledReason: disabledReason.value,
      });
      yield* electronDialog.showMessageBox({
        type: "info",
        title: "Updates unavailable",
        message: "Automatic updates are not available right now.",
        detail: disabledReason.value,
        buttons: ["OK"],
      });
      return;
    }
    yield* (yield* DesktopWindow).ensureMain;
    yield* checkForUpdatesFromMenu;
  })
  .pipe(effect_Effect.withSpan("desktop.menu.handleCheckForUpdatesClick"));
const make = effect_Effect.gen(function* () {
  const electronApp = yield* ElectronApp;
  const electronMenu = yield* ElectronMenu;
  const environment = yield* DesktopEnvironment;
  const appName = yield* electronApp.name;
  const context = yield* effect_Effect.context();
  const runPromise = effect_Effect.runPromiseWith(context);
  const runMenuEffect = (action, effect) => {
    runPromise(
      effect.pipe(
        effect_Effect.annotateLogs({ action }),
        effect_Effect.withSpan("desktop.menu.action"),
        effect_Effect.catchCause((cause) =>
          logMenuError("desktop menu action failed", {
            action,
            cause: effect_Cause.pretty(cause),
          }),
        ),
      ),
    );
  };
  const configure = effect_Effect
    .gen(function* () {
      const checkForUpdatesClick = () => {
        runMenuEffect("check-for-updates", handleCheckForUpdatesMenuClick);
      };
      const settingsClick = () => {
        runMenuEffect("open-settings", dispatchMenuAction("open-settings"));
      };
      const template = [];
      if (environment.platform === "darwin")
        template.push({
          label: appName,
          submenu: [
            { role: "about" },
            {
              label: "Check for Updates...",
              click: checkForUpdatesClick,
            },
            { type: "separator" },
            {
              label: "Settings...",
              accelerator: "CmdOrCtrl+,",
              click: settingsClick,
            },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        });
      template.push(
        {
          label: "File",
          submenu: [
            ...(environment.platform === "darwin"
              ? []
              : [
                  {
                    label: "Settings...",
                    accelerator: "CmdOrCtrl+,",
                    click: settingsClick,
                  },
                  { type: "separator" },
                ]),
            { role: environment.platform === "darwin" ? "close" : "quit" },
          ],
        },
        { role: "editMenu" },
        {
          label: "View",
          submenu: [
            { role: "reload" },
            { role: "forceReload" },
            { role: "toggleDevTools" },
            { type: "separator" },
            { role: "resetZoom" },
            {
              role: "zoomIn",
              accelerator: "CmdOrCtrl+=",
            },
            {
              role: "zoomIn",
              accelerator: "CmdOrCtrl+Plus",
              visible: false,
            },
            { role: "zoomOut" },
            { type: "separator" },
            { role: "togglefullscreen" },
          ],
        },
        { role: "windowMenu" },
        {
          role: "help",
          submenu: [
            {
              label: "Check for Updates...",
              click: checkForUpdatesClick,
            },
          ],
        },
      );
      yield* electronMenu.setApplicationMenu(template);
    })
    .pipe(effect_Effect.withSpan("desktop.menu.configure"));
  return DesktopApplicationMenu.of({ configure });
});
const layer$1 = effect_Layer.effect(DesktopApplicationMenu, make);

//#endregion
//#region src/shell/DesktopShellEnvironment.ts
var DesktopShellEnvironment = class extends effect_Context.Service()(
  "t3/desktop/ShellEnvironment",
) {};
const LOGIN_SHELL_ENV_NAMES = [
  "PATH",
  "SSH_AUTH_SOCK",
  "HOMEBREW_PREFIX",
  "HOMEBREW_CELLAR",
  "HOMEBREW_REPOSITORY",
  "XDG_CONFIG_HOME",
  "XDG_DATA_HOME",
];
const WINDOWS_PROFILE_ENV_NAMES = ["PATH", "FNM_DIR", "FNM_MULTISHELL_PATH"];
const WINDOWS_SHELL_CANDIDATES = ["pwsh.exe", "powershell.exe"];
const LOGIN_SHELL_TIMEOUT = effect_Duration.seconds(5);
const LAUNCHCTL_TIMEOUT = effect_Duration.seconds(2);
const PROCESS_TERMINATE_GRACE = effect_Duration.seconds(1);
const trimNonEmpty = (value) =>
  effect_Option.fromNullishOr(value).pipe(
    effect_Option.map((entry) => entry.trim()),
    effect_Option.filter((entry) => entry.length > 0),
  );
const pathDelimiter = (platform) => (platform === "win32" ? ";" : ":");
const readEnvPath = (env) => trimNonEmpty(env.PATH ?? env.Path ?? env.path);
const pathComparisonKey = (entry, platform) => {
  const normalized = entry.trim().replace(/^"+|"+$/g, "");
  return platform === "win32" ? normalized.toLowerCase() : normalized;
};
const mergePaths = (platform, values) => {
  const delimiter = pathDelimiter(platform);
  const entries = [];
  const seen = /* @__PURE__ */ new Set();
  for (const value of values) {
    if (effect_Option.isNone(value)) continue;
    for (const entry of value.value.split(delimiter)) {
      const trimmed = entry.trim();
      if (trimmed.length === 0) continue;
      const key = pathComparisonKey(trimmed, platform);
      if (key.length === 0 || seen.has(key)) continue;
      seen.add(key);
      entries.push(trimmed);
    }
  }
  return entries.length > 0 ? effect_Option.some(entries.join(delimiter)) : effect_Option.none();
};
const listLoginShellCandidates = (config) => {
  const fallback =
    config.platform === "darwin" ? "/bin/zsh" : config.platform === "linux" ? "/bin/bash" : "";
  const seen = /* @__PURE__ */ new Set();
  const candidates = [];
  for (const candidate of [
    trimNonEmpty(config.env.SHELL),
    config.userShell,
    trimNonEmpty(fallback),
  ]) {
    if (effect_Option.isNone(candidate) || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    candidates.push(candidate.value);
  }
  return candidates;
};
const knownWindowsCliDirs = (env) => [
  ...trimNonEmpty(env.APPDATA).pipe(
    effect_Option.match({
      onNone: () => [],
      onSome: (value) => [`${value}\\npm`],
    }),
  ),
  ...trimNonEmpty(env.LOCALAPPDATA).pipe(
    effect_Option.match({
      onNone: () => [],
      onSome: (value) => [`${value}\\Programs\\nodejs`, `${value}\\Volta\\bin`, `${value}\\pnpm`],
    }),
  ),
  ...trimNonEmpty(env.USERPROFILE).pipe(
    effect_Option.match({
      onNone: () => [],
      onSome: (value) => [`${value}\\.bun\\bin`, `${value}\\scoop\\shims`],
    }),
  ),
];
const startMarker = (name) => `__T3CODE_ENV_${name}_START__`;
const endMarker = (name) => `__T3CODE_ENV_${name}_END__`;
const capturePosixEnvironmentCommand = (names) =>
  names
    .map((name) => {
      return [
        `printf '%s\\n' '${startMarker(name)}'`,
        `printenv ${name} || true`,
        `printf '%s\\n' '${endMarker(name)}'`,
      ].join("; ");
    })
    .join("; ");
const captureWindowsEnvironmentCommand = (names) =>
  [
    "$ErrorActionPreference = 'Stop'",
    ...names.flatMap((name) => {
      return [
        `Write-Output '${startMarker(name)}'`,
        `$value = [Environment]::GetEnvironmentVariable('${name}')`,
        "if ($null -ne $value -and $value.Length -gt 0) { Write-Output $value }",
        `Write-Output '${endMarker(name)}'`,
      ];
    }),
  ].join("; ");
const extractEnvironment = (output, names) => {
  const environment = {};
  for (const name of names) {
    const start = output.indexOf(startMarker(name));
    if (start === -1) continue;
    const valueStart = start + startMarker(name).length;
    const end = output.indexOf(endMarker(name), valueStart);
    if (end === -1) continue;
    const value = output
      .slice(valueStart, end)
      .replace(/^\r?\n/, "")
      .replace(/\r?\n$/, "");
    if (value.length > 0) environment[name] = value;
  }
  return environment;
};
const runCommandOutput = effect_Effect.fn("desktop.shellEnvironment.runCommandOutput")(
  function* (input) {
    return yield* (yield* effect_unstable_process.ChildProcessSpawner.ChildProcessSpawner)
      .string(
        effect_unstable_process.ChildProcess.make(input.command, input.args, {
          shell: input.shell ?? false,
          stdin: "ignore",
          stdout: "pipe",
          stderr: "pipe",
          killSignal: "SIGTERM",
          forceKillAfter: PROCESS_TERMINATE_GRACE,
        }),
      )
      .pipe(
        effect_Effect.timeoutOption(input.timeout),
        effect_Effect.map(effect_Option.getOrElse(() => "")),
        effect_Effect.catch(() => effect_Effect.succeed("")),
      );
  },
);
const readLoginShellEnvironment = (shell, names) =>
  names.length === 0
    ? effect_Effect.succeed({})
    : runCommandOutput({
        command: shell,
        args: ["-ilc", capturePosixEnvironmentCommand(names)],
        timeout: LOGIN_SHELL_TIMEOUT,
      }).pipe(effect_Effect.map((output) => extractEnvironment(output, names)));
const readLaunchctlPath = runCommandOutput({
  command: "/bin/launchctl",
  args: ["getenv", "PATH"],
  timeout: LAUNCHCTL_TIMEOUT,
}).pipe(effect_Effect.map(trimNonEmpty));
const readWindowsEnvironment = effect_Effect.fn("desktop.shellEnvironment.readWindowsEnvironment")(
  function* (names, options) {
    if (names.length === 0) return {};
    const args = [
      "-NoLogo",
      ...(options.loadProfile ? [] : ["-NoProfile"]),
      "-NonInteractive",
      "-Command",
      captureWindowsEnvironmentCommand(names),
    ];
    for (const command of WINDOWS_SHELL_CANDIDATES) {
      const environment = extractEnvironment(
        yield* runCommandOutput({
          command,
          args,
          shell: true,
          timeout: LOGIN_SHELL_TIMEOUT,
        }),
        names,
      );
      if (Object.keys(environment).length > 0) return environment;
    }
    return {};
  },
);
const installWindowsEnvironment = effect_Effect.fn(
  "desktop.shellEnvironment.installWindowsEnvironment",
)(function* (config) {
  const noProfile = yield* readWindowsEnvironment(["PATH"], { loadProfile: false });
  const profile = yield* readWindowsEnvironment(WINDOWS_PROFILE_ENV_NAMES, { loadProfile: true });
  const mergedPath = mergePaths("win32", [
    trimNonEmpty(profile.PATH),
    trimNonEmpty(knownWindowsCliDirs(config.env).join(";")),
    trimNonEmpty(noProfile.PATH),
    readEnvPath(config.env),
  ]);
  if (effect_Option.isSome(mergedPath)) config.env.PATH = mergedPath.value;
  if (!config.env.FNM_DIR && profile.FNM_DIR) config.env.FNM_DIR = profile.FNM_DIR;
  if (!config.env.FNM_MULTISHELL_PATH && profile.FNM_MULTISHELL_PATH)
    config.env.FNM_MULTISHELL_PATH = profile.FNM_MULTISHELL_PATH;
});
const installPosixEnvironment = effect_Effect.fn(
  "desktop.shellEnvironment.installPosixEnvironment",
)(function* (config) {
  const shellEnvironment = {};
  for (const shell of listLoginShellCandidates(config)) {
    Object.assign(shellEnvironment, yield* readLoginShellEnvironment(shell, LOGIN_SHELL_ENV_NAMES));
    if (shellEnvironment.PATH) break;
  }
  const launchctlPath =
    config.platform === "darwin" && !shellEnvironment.PATH
      ? yield* readLaunchctlPath
      : effect_Option.none();
  const mergedPath = mergePaths(config.platform, [
    trimNonEmpty(shellEnvironment.PATH).pipe(effect_Option.orElse(() => launchctlPath)),
    readEnvPath(config.env),
  ]);
  if (effect_Option.isSome(mergedPath)) config.env.PATH = mergedPath.value;
  if (!config.env.SSH_AUTH_SOCK && shellEnvironment.SSH_AUTH_SOCK)
    config.env.SSH_AUTH_SOCK = shellEnvironment.SSH_AUTH_SOCK;
  for (const name of [
    "HOMEBREW_PREFIX",
    "HOMEBREW_CELLAR",
    "HOMEBREW_REPOSITORY",
    "XDG_CONFIG_HOME",
    "XDG_DATA_HOME",
  ])
    if (!config.env[name] && shellEnvironment[name]) config.env[name] = shellEnvironment[name];
});
const installShellEnvironment = (config) => {
  if (config.platform === "win32") return installWindowsEnvironment(config);
  if (config.platform === "darwin" || config.platform === "linux")
    return installPosixEnvironment(config);
  return effect_Effect.void;
};
const layer = effect_Layer.effect(
  DesktopShellEnvironment,
  effect_Effect.gen(function* () {
    const environment = yield* DesktopEnvironment;
    const spawner = yield* effect_unstable_process.ChildProcessSpawner.ChildProcessSpawner;
    return DesktopShellEnvironment.of({
      installIntoProcess: installShellEnvironment({
        env: process.env,
        platform: environment.platform,
        userShell: effect_Option.none(),
      }).pipe(
        effect_Effect.provideService(
          effect_unstable_process.ChildProcessSpawner.ChildProcessSpawner,
          spawner,
        ),
        effect_Effect.withSpan("desktop.shellEnvironment.installIntoProcess"),
      ),
    });
  }),
);

//#endregion
//#region src/app/DesktopApp.ts
const DEFAULT_DESKTOP_BACKEND_PORT = 3773;
const MAX_TCP_PORT = 65535;
const DESKTOP_BACKEND_PORT_PROBE_HOSTS = ["127.0.0.1", "0.0.0.0", "::"];
const makeDesktopRunId = effect_Random.nextUUIDv4.pipe(
  effect_Effect.map((value) => value.replaceAll("-", "").slice(0, 12)),
);
var DesktopBackendPortUnavailableError = class extends effect_Data.TaggedError(
  "DesktopBackendPortUnavailableError",
) {
  get message() {
    return `No desktop backend port is available on hosts ${this.hosts.join(", ")} between ${this.startPort} and ${this.maxPort}.`;
  }
};
var DesktopDevelopmentBackendPortRequiredError = class extends effect_Data.TaggedError(
  "DesktopDevelopmentBackendPortRequiredError",
) {
  get message() {
    return "T3CODE_PORT is required in desktop development.";
  }
};
const { logInfo: logBootstrapInfo, logWarning: logBootstrapWarning } =
  makeComponentLogger("desktop-bootstrap");
const { logInfo: logStartupInfo, logError: logStartupError } =
  makeComponentLogger("desktop-startup");
const resolveDesktopBackendPort = effect_Effect.fn("resolveDesktopBackendPort")(
  function* (configuredPort) {
    if (effect_Option.isSome(configuredPort))
      return {
        port: configuredPort.value,
        selectedByScan: false,
      };
    const net = yield* NetService;
    for (let port = DEFAULT_DESKTOP_BACKEND_PORT; port <= MAX_TCP_PORT; port += 1) {
      let availableOnEveryHost = true;
      for (const host of DESKTOP_BACKEND_PORT_PROBE_HOSTS)
        if (!(yield* net.canListenOnHost(port, host))) {
          availableOnEveryHost = false;
          break;
        }
      if (availableOnEveryHost)
        return {
          port,
          selectedByScan: true,
        };
    }
    return yield* new DesktopBackendPortUnavailableError({
      startPort: DEFAULT_DESKTOP_BACKEND_PORT,
      maxPort: MAX_TCP_PORT,
      hosts: DESKTOP_BACKEND_PORT_PROBE_HOSTS,
    });
  },
);
const handleFatalStartupError = effect_Effect.fn("desktop.startup.handleFatalStartupError")(
  function* (stage, error) {
    const shutdown = yield* DesktopShutdown;
    const state = yield* DesktopState;
    const electronApp = yield* ElectronApp;
    const electronDialog = yield* ElectronDialog;
    const message = error instanceof Error ? error.message : String(error);
    const detail =
      error instanceof Error && typeof error.stack === "string" ? `\n${error.stack}` : "";
    yield* logStartupError("fatal startup error", {
      stage,
      message,
      ...(detail.length > 0 ? { detail } : {}),
    });
    if (!(yield* effect_Ref.getAndSet(state.quitting, true)))
      yield* electronDialog.showErrorBox(
        "Pearce Codes failed to start",
        `Stage: ${stage}\n${message}${detail}`,
      );
    yield* shutdown.request;
    yield* electronApp.quit;
  },
);
const fatalStartupCause = (stage, cause) =>
  handleFatalStartupError(stage, effect_Cause.pretty(cause)).pipe(
    effect_Effect.andThen(effect_Effect.failCause(cause)),
  );
const bootstrap = effect_Effect
  .gen(function* () {
    const backendManager = yield* DesktopBackendManager;
    const state = yield* DesktopState;
    const environment = yield* DesktopEnvironment;
    const desktopSettings = yield* DesktopAppSettings;
    const serverExposure = yield* DesktopServerExposure;
    yield* logBootstrapInfo("bootstrap start");
    if (environment.isDevelopment && effect_Option.isNone(environment.configuredBackendPort))
      return yield* new DesktopDevelopmentBackendPortRequiredError();
    const backendPortSelection = yield* resolveDesktopBackendPort(
      environment.configuredBackendPort,
    );
    const backendPort = backendPortSelection.port;
    yield* logBootstrapInfo(
      backendPortSelection.selectedByScan
        ? "selected backend port via sequential scan"
        : "using configured backend port",
      {
        port: backendPort,
        ...(backendPortSelection.selectedByScan ? { startPort: DEFAULT_DESKTOP_BACKEND_PORT } : {}),
      },
    );
    const settings = yield* desktopSettings.get;
    if (settings.serverExposureMode !== environment.defaultDesktopSettings.serverExposureMode)
      yield* logBootstrapInfo("bootstrap restoring persisted server exposure mode", {
        mode: settings.serverExposureMode,
      });
    const serverExposureState = yield* serverExposure.configureFromSettings({ port: backendPort });
    yield* logBootstrapInfo("bootstrap resolved backend endpoint", {
      baseUrl: (yield* serverExposure.backendConfig).httpBaseUrl.href,
    });
    if (serverExposureState.endpointUrl)
      yield* logBootstrapInfo("bootstrap enabled network access", {
        endpointUrl: serverExposureState.endpointUrl,
      });
    else if (settings.serverExposureMode === "network-accessible")
      yield* logBootstrapWarning(
        "bootstrap fell back to local-only because no advertised network host was available",
      );
    yield* installDesktopIpcHandlers;
    yield* logBootstrapInfo("bootstrap ipc handlers registered");
    if (!(yield* effect_Ref.get(state.quitting))) {
      yield* backendManager.start;
      yield* logBootstrapInfo("bootstrap backend start requested");
    }
  })
  .pipe(effect_Effect.withSpan("desktop.bootstrap"));
const startup = effect_Effect
  .gen(function* () {
    const appIdentity = yield* DesktopAppIdentity;
    const applicationMenu = yield* DesktopApplicationMenu;
    const electronApp = yield* ElectronApp;
    const electronProtocol = yield* ElectronProtocol;
    const lifecycle = yield* DesktopLifecycle;
    const shellEnvironment = yield* DesktopShellEnvironment;
    const desktopSettings = yield* DesktopAppSettings;
    const updates = yield* DesktopUpdates;
    const environment = yield* DesktopEnvironment;
    yield* shellEnvironment.installIntoProcess;
    const userDataPath = yield* appIdentity.resolveUserDataPath;
    yield* electronApp.setPath("userData", userDataPath);
    yield* logStartupInfo("runtime logging configured", { logDir: environment.logDir });
    yield* desktopSettings.load;
    if (environment.platform === "linux")
      yield* electronApp.appendCommandLineSwitch("class", environment.linuxWmClass);
    yield* appIdentity.configure;
    yield* lifecycle.register;
    yield* electronApp.whenReady.pipe(
      effect_Effect.withSpan("desktop.electron.whenReady"),
      effect_Effect.catchCause((cause) => fatalStartupCause("whenReady", cause)),
    );
    yield* logStartupInfo("app ready");
    yield* appIdentity.configure;
    yield* applicationMenu.configure;
    yield* electronProtocol.registerDesktopFileProtocol;
    yield* updates.configure;
    yield* bootstrap.pipe(
      effect_Effect.catchCause((cause) => fatalStartupCause("bootstrap", cause)),
    );
  })
  .pipe(effect_Effect.withSpan("desktop.startup"));
const scopedProgram = effect_Effect.scoped(
  effect_Effect.gen(function* () {
    const runId = yield* makeDesktopRunId;
    yield* effect_Effect.annotateLogsScoped({
      scope: "desktop",
      runId,
    });
    yield* effect_Effect.annotateCurrentSpan({
      scope: "desktop",
      runId,
    });
    const shutdown = yield* DesktopShutdown;
    const backendManager = yield* DesktopBackendManager;
    yield* effect_Effect.addFinalizer(() =>
      backendManager.stop().pipe(effect_Effect.ensuring(shutdown.markComplete)),
    );
    yield* startup;
    yield* shutdown.awaitRequest;
  }),
);
const program = scopedProgram.pipe(effect_Effect.withSpan("desktop.app"));

//#endregion
//#region src/main.ts
const desktopEnvironmentLayer = effect_Layer.unwrap(
  effect_Effect.gen(function* () {
    const metadata = yield* effect_Effect
      .service(ElectronApp)
      .pipe(effect_Effect.flatMap((app) => app.metadata));
    return layer$23({
      dirname: __dirname,
      homeDirectory: node_os.homedir(),
      platform: process.platform,
      processArch: process.arch,
      ...metadata,
    });
  }),
);
const resolveDesktopSshCliRunner = (environment, settings) => {
  const devRemoteEntryPath = effect_Option.getOrUndefined(environment.devRemoteT3ServerEntryPath);
  if (environment.isDevelopment && devRemoteEntryPath !== void 0)
    return {
      nodeScriptPath: devRemoteEntryPath,
      nodeEngineRange: engines.node,
    };
  return {
    packageSpec: resolveRemoteT3CliPackageSpec({
      appVersion: environment.appVersion,
      updateChannel: settings.updateChannel,
      isDevelopment: environment.isDevelopment,
    }),
    nodeEngineRange: engines.node,
  };
};
const desktopSshEnvironmentLayer = effect_Layer.unwrap(
  effect_Effect.gen(function* () {
    const environment = yield* DesktopEnvironment;
    const settings = yield* DesktopAppSettings;
    return layer$7({
      resolveCliRunner: settings.get.pipe(
        effect_Effect.map((currentSettings) =>
          resolveDesktopSshCliRunner(environment, currentSettings),
        ),
      ),
    });
  }),
);
const electronLayer = effect_Layer.mergeAll(
  layer$27,
  layer$26,
  layer$25,
  layer$22,
  layer$21,
  layer$20,
  layer$19,
  layer$18,
  layer$17,
  effect_Layer.succeed(DesktopIpc, make$16(electron.ipcMain)),
);
const desktopFoundationLayer = effect_Layer
  .mergeAll(layer$13, layerShutdown, layer$24, layer$16, layer$15, layer$12, layer$14)
  .pipe(effect_Layer.provideMerge(desktopEnvironmentLayer));
const desktopSshLayer = effect_Layer
  .mergeAll(desktopSshEnvironmentLayer, layer$6)
  .pipe(effect_Layer.provideMerge(layer$8()));
const desktopServerExposureLayer = layer$11.pipe(
  effect_Layer.provideMerge(networkInterfacesLayer),
  effect_Layer.provideMerge(desktopFoundationLayer),
);
const desktopWindowLayer = layer$10.pipe(effect_Layer.provideMerge(desktopServerExposureLayer));
const desktopBackendLayer = layer$4.pipe(
  effect_Layer.provideMerge(layer$2),
  effect_Layer.provideMerge(layer$5),
  effect_Layer.provideMerge(desktopWindowLayer),
);
const desktopApplicationLayer = effect_Layer
  .mergeAll(layer$9, layer$1, layer, desktopSshLayer)
  .pipe(effect_Layer.provideMerge(layer$3), effect_Layer.provideMerge(desktopBackendLayer));
const desktopRuntimeLayer = layerSchemePrivileges.pipe(
  effect_Layer.flatMap(() =>
    desktopApplicationLayer.pipe(
      effect_Layer.provideMerge(_effect_platform_node_NodeServices.layer),
      effect_Layer.provideMerge(_effect_platform_node_NodeHttpClient.layerUndici),
      effect_Layer.provideMerge(layer$28),
      effect_Layer.provideMerge(electronLayer),
    ),
  ),
);
program.pipe(effect_Effect.provide(desktopRuntimeLayer), _effect_platform_node_NodeRuntime.runMain);

//#endregion
//# sourceMappingURL=main.cjs.map
