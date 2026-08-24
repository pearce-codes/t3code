# Pearce Codes Release Checklist

Releases are created only from reviewed `origin/main` commits.

## Before dispatch

- Confirm the latest upstream sync pull request is merged or intentionally deferred.
- Confirm the downstream ledger matches the current customization set.
- Run focused package tests, `vp run icons:check`, and `node scripts/release-smoke.ts`.
- Confirm npm trusted publishing targets `@pearcecodes/t3code`.
- Confirm the production environment contains the required Clerk, relay, signing,
  and platform credentials for the artifacts being published.

## Channels

- Stable releases use an explicit semantic version and publish npm tag `latest`.
- Nightly releases use the next patch prerelease and publish npm tag `nightly`.
- GitHub and npm releases must use the same version.

Hosted web deployment, AUR publication, automatic version-bump commits, and
Discord announcements remain disabled for the Pearce fork until their
credentials and destinations are configured explicitly.

## After release

- Install the published CLI in a clean temporary directory.
- Launch a newly downloaded desktop artifact.
- Confirm update metadata points at `pearce-codes/t3code`.
- Record any release-only failure in the next downstream sync review.
