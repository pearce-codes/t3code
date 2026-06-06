# CI quality gates

- `.github/workflows/ci.yml` runs `vp check`, `vp run typecheck`, desktop build verification, `vp run test`, browser tests, mobile native static analysis, and release smoke checks on pull requests and pushes to `main`.
- Linux CI jobs use Blacksmith Ubuntu 24.04 runners. Mobile native static analysis uses Blacksmith macOS 15.
- `.github/workflows/release.yml` builds macOS (`arm64` and `x64`) and Linux (`x64`) desktop artifacts for stable and nightly releases, then publishes one GitHub release.
- Release preflight, Linux desktop packaging, Apple Silicon macOS packaging, release publishing, and finalization use Blacksmith runners. The Intel macOS package stays on GitHub's `macos-15-intel` runner, and `publish_cli` stays on GitHub's `ubuntu-24.04` runner for npm Trusted Publishing compatibility.
- The release workflow auto-enables macOS signing only when Apple credentials are present. Without secrets, it still releases unsigned artifacts.
- See [Release Checklist](./release.md) for the full release/signing setup checklist.
