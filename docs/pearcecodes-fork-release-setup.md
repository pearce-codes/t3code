# Pearcecodes Fork Release Setup

This fork is configured for public GitHub Releases, Blacksmith runners, macOS
signing when Apple credentials are present, and npm publishing under the
`pearcecodes` npm organization.

## P1 release setup

### GitHub

- Repository: `Pearcekieser/t3code`
- Keep the repository public so GitHub Releases can be used directly by
  `electron-updater`.
- Enable GitHub Actions for the fork.
- Install the Blacksmith GitHub app for this repository.
- In repository Actions settings, allow workflows to create and approve pull
  requests if needed, and set workflow permissions to allow read/write tokens.

The release workflow uses the built-in `GITHUB_TOKEN` for GitHub Releases and
stable-version bump commits. It does not require a custom release GitHub App.

### npm

- Package: `@pearcecodes/t3code`
- Binary: `t3code`
- Access: public
- Dist-tags:
  - stable releases publish `latest`
  - nightly releases publish `nightly`

The internal workspace package remains named `t3` so Effect deterministic
service keys keep matching source paths. The release publish script rewrites the
published package name to `@pearcecodes/t3code` immediately before `npm publish`.

Configure npm trusted publishing for `@pearcecodes/t3code`:

- Provider: GitHub Actions
- Repository: `Pearcekieser/t3code`
- Workflow file: `.github/workflows/release.yml`

The npm publish job intentionally uses a GitHub-hosted runner, because npm
trusted publishing does not currently support self-hosted runners. Keep the
desktop build jobs on Blacksmith, but keep `publish_cli` on `ubuntu-24.04`
unless this npm restriction changes.

### Apple signing and notarization

Add these GitHub Actions secrets after enrolling in the Apple Developer Program:

- `CSC_LINK`: base64-encoded `.p12` export of the Developer ID Application
  certificate and private key
- `CSC_KEY_PASSWORD`: password for the `.p12`
- `APPLE_API_KEY`: raw App Store Connect API key `.p8` contents
- `APPLE_API_KEY_ID`: App Store Connect API key ID
- `APPLE_API_ISSUER`: App Store Connect issuer ID

If any of these are missing, macOS release artifacts are built unsigned.

## P2 hosted web app

The Vercel deployment is intentionally deferred. Planned domains:

- router: `https://code.pearcecodes.com`
- stable: `latest.code.pearcecodes.com`
- nightly: `nightly.code.pearcecodes.com`

Before enabling the Vercel job, make `apps/web/vercel.ts` use environment-driven
hostnames instead of hardcoded `app.t3.codes` origins.
