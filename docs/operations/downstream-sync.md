# Downstream Sync

Pearce Codes is a managed downstream of `pingdotgg/t3code`.

## Git model

- `upstream/main` is canonical T3 Code.
- `origin/main` is the releasable Pearce Codes branch.
- `sync/upstream-YYYY-MM-DD-SHA` branches are temporary integration branches.
- Pearce releases are tagged from `origin/main`.

Published `main` history is never routinely rebased. Upstream is merged into a
sync branch, reviewed, and then merged into downstream `main`.

## Routine intake

The Upstream Sync workflow checks weekly and can also be dispatched manually.
It opens a draft pull request only when the upstream merge is clean. It never
merges or publishes automatically.

When automation reports conflicts:

```bash
git fetch origin
git fetch upstream main
git switch main
git pull --ff-only origin main
git switch -c sync/upstream-YYYY-MM-DD-SHA
git merge --no-ff upstream/main
```

Resolve conflicts by the owning downstream feature listed in
`docs/internals/downstream-changes.md`. Preserve upstream architecture first,
then reapply the smallest Pearce-specific behavior.

## Verification

Use focused tests for the affected packages. Every sync must explicitly check:

- Pearce Codes names, icons, package IDs, URL schemes, and data-home isolation.
- Local, SSH, relay, and tunnel behavior changed by the intake.
- Kiro turns, plans, tools, subagents, steering, and usage rendering.
- Web, desktop, and mobile surfaces touched by the diff.
- CLI and desktop packaging when release code changes.

Before release, run the release smoke test and verify generated brand assets.
Do not point a development server at `~/.t3/userdata`.

## Promotion and rollback

Merge the reviewed sync pull request into `origin/main`. Stable and nightly
tags are cut from that branch only.

If a sync regresses a release, revert the sync merge commit. Do not rewrite
published `main` or reset it to an earlier upstream commit.

Security and serious compatibility fixes may bypass the weekly cadence, but
they follow the same sync branch, review, and promotion process.
