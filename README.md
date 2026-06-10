# T3 Code

T3 Code is a minimal web GUI for coding agents (currently Codex, Claude, Cursor, and OpenCode, more coming soon).

## Installation

> [!WARNING]
> T3 Code currently supports Codex, Claude, Cursor, and OpenCode.
> Install and authenticate at least one provider before use:
>
> - Codex: install [Codex CLI](https://developers.openai.com/codex/cli) and run `codex login`
> - Claude: install [Claude Code](https://claude.com/product/claude-code) and run `claude auth login`
> - Cursor: install [Cursor CLI](https://cursor.com/cli) and run `cursor-agent login`
> - OpenCode: install [OpenCode](https://opencode.ai) and run `opencode auth login`

### Run without installing

```bash
npx @pearcecodes/t3code@latest
```

Tip: Use `npx @pearcecodes/t3code@latest --help` for the full CLI reference.

### Desktop app

Install the latest version of the desktop app from [GitHub Releases](https://github.com/pearce-codes/t3code/releases), or from your favorite package registry:

#### Windows (`winget`)

```bash
winget install T3Tools.T3Code
```

#### macOS (Homebrew)

```bash
brew install --cask t3-code
```

#### Arch Linux (AUR)

```bash
yay -S t3code-bin
```

## Pearce Codes fork

This is the **Pearce Codes** fork of T3 Code. It runs side-by-side with upstream `t3` and
deliberately uses its own names, ports, and data directories so the two never collide.

### Naming & prefixes

| Concept                   | Pearce Codes                                          | Upstream T3 |
| ------------------------- | ----------------------------------------------------- | ----------- |
| npm CLI package           | `@pearcecodes/t3code`                                 | `t3`        |
| CLI command / bin         | `pearcecodes`                                         | `t3code`    |
| Desktop app name          | `Pearce Codes`                                        | `T3 Code`   |
| Desktop bundle id (appId) | `com.pearcecodes.pearcecodes`                         | `com.t3.*`  |
| Default local server port | `5656`                                                | `3773`      |
| Data / config home        | `~/.pearce-codes` (override with `PEARCE_CODES_HOME`) | `~/.t3`     |
| Effect service-key prefix | `pearcecodes-t3-cli/…`                                | `t3/…`      |

The Effect service-key prefix is derived automatically from the server package `name`
(`apps/server/package.json`), which stays `t3` so the keys keep matching source paths. It is
enforced by the `@effect/language-service` `deterministicKeys` rule — don't hand-edit the keys.
The publish script (`apps/server/scripts/cli.ts`) rewrites the package name to `@pearcecodes/t3code`
only at `npm publish` time. The CLI bin is the unique command `pearcecodes` (not upstream's
`t3code`) so a globally-installed upstream CLI can never be picked up on `PATH`. The remote-facing
package and bin names are centralized in the `REMOTE_CLI_PACKAGE_NAME` and `REMOTE_CLI_BIN_NAME`
constants (`packages/ssh/src/command.ts`).

### New features / behavior

- **Forked CLI distribution.** The desktop app installs and runs `@pearcecodes/t3code` (exposing the
  unique `pearcecodes` command) on remote SSH hosts via `npx`, instead of upstream `t3`, so remote
  sessions run fork code.
- **Isolated remote launch.** Remote servers are launched and tracked under
  `~/.pearce-codes/ssh-launch/<host>` with their default home at `~/.pearce-codes`. The fork never
  reuses, restarts, or kills a server living in an upstream `~/.t3` directory — an existing
  upstream `t3` server on the same host is left untouched.
- **Isolated local data home.** All local state lives under `~/.pearce-codes` (set
  `PEARCE_CODES_HOME` to relocate it), keeping fork and upstream installs separate.
- **Distinct default port (`5656`).** Avoids clashing with an upstream instance on `3773`.

## Some notes

We are very very early in this project. Expect bugs.

We are not accepting contributions yet.

There's no public docs site yet, checkout the miscellaneous markdown files in [docs](./docs).

## Documentation

- [Getting started](./docs/getting-started/quick-start.md)
- [Architecture overview](./docs/architecture/overview.md)
- [Provider guides](./docs/providers/codex.md)
- [Operations](./docs/operations/ci.md)
- [Reference](./docs/reference/encyclopedia.md)

## If you REALLY want to contribute still.... read this first

### Install `vp`

T3 Code uses Vite+ so you'll need to install the global `vp` command-line tool.

#### macOS / Linux

```bash
curl -fsSL https://vite.plus | bash
```

#### Windows

```bash
irm https://vite.plus/ps1 | iex
```

Checkout their getting started guide for more information: https://viteplus.dev/guide/

### Install dependencies

```bash
vp i
```

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening an issue or PR.

Need support? Join the [Discord](https://discord.gg/jn4EGJjrvv).
