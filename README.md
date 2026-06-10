# T3 Code

T3 Code is an "agent harness control surface". It enables control of the agents on your machine with a best-in-class mobile app ([iOS](https://apps.apple.com/us/app/t3-code-remote-claude-more/id6787819824), [Android](https://play.google.com/store/apps/details?id=com.t3tools.t3code)), [web app](https://app.t3.codes) and [Electron-based desktop app](https://t3.codes).

Works with your subscriptions on Claude Code, Codex, Cursor, Grok Build, and OpenCode. If they're set up on your computer, T3 Code can control them.

## "Wait, what are you selling me?"

Nothing. We built T3 Code because we wanted the best possible development experience with agents. We were inspired by existing solutions like the Codex desktop app, Conductor, Claude Desktop and Cursor Glass, but none met our bar.

We wanted something performant, remote-ready, and truly open. If we ever go the wrong direction, we want you to have everything you need to fork and build the editor that you want.

## Installation

> [!WARNING]
> T3 Code currently supports Codex, Claude, Cursor, Grok Build and OpenCode. Install and authenticate at least one provider before use:
>
> - Codex: install [Codex CLI](https://developers.openai.com/codex/cli) and run `codex login`
> - Claude: install [Claude Code](https://claude.com/product/claude-code) and run `claude auth login`
> - Cursor: install [Cursor CLI](https://cursor.com/cli) and run `agent login`
> - Grok Build: install [Grok Build CLI](https://x.ai/cli) and run `grok login`
> - OpenCode: install [OpenCode](https://opencode.ai) and run `opencode auth login`

### Try it out (install-free)

The easiest way to test T3 Code is to run the server in your terminal (requires Node.js 22.16+, 23.11+, or 24.10+):

```bash
npx @pearcecodes/t3code@latest
```

This will launch T3 Code's backend on your machine as well as the local web app to control your agents.

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

Stable:

```bash
yay -S t3code-bin
```

Nightly:

```bash
yay -S t3code-nightly-bin
```

The AUR packaging is maintained in this repository under [`packaging/aur`](./packaging/aur).

## Pearce Codes fork

This is the **Pearce Codes** fork of T3 Code. It runs side-by-side with upstream `t3` and
deliberately uses its own names, ports, and data directories so the two never collide.

### Naming & prefixes

| Concept                   | Pearce Codes                                          | Upstream T3 |
| ------------------------- | ----------------------------------------------------- | ----------- |
| npm CLI package           | `@pearcecodes/t3code`                                 | `t3`        |
| CLI command / bin         | `pearcecodes`                                         | `t3`        |
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
`t3`) so a globally-installed upstream CLI can never be picked up on `PATH`. The remote-facing
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

We are (mostly) not accepting contributions yet. Small fixes may be considered. Big features will not be.

## Documentation

Full docs live in [docs/](./docs). There's no docs site yet.

- [Install and first run](./docs/user/install.md)
- [Permission modes](./docs/user/permission-modes.md)
- [Keyboard shortcuts](./docs/user/keybindings.md)
- [Customize a project icon](./docs/user/project-settings.md)
- [Remote access from a phone or another machine](./docs/user/remote-access.md)
- [Keeping app and server in sync](./docs/user/updating.md)
- [Source control integrations](./docs/user/source-control.md)
- Multiple accounts: [Codex](./docs/user/providers-codex.md) · [Claude](./docs/user/providers-claude.md)
- Linux: [run T3 Code as a background service](./docs/user/background-service.md)

Building from source? Start at [docs/internals/overview.md](./docs/internals/overview.md).

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
