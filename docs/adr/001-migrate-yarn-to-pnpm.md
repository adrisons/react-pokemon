# ADR-001: Migrate from Yarn to pnpm

**Status:** Accepted
**Date:** 2026-05-07
**Commit:** `bcb5e60`

## Context

The project used Yarn (Classic, v1) as its package manager, reflected by the presence of `yarn.lock`. Several problems converged that made this untenable:

- `node-sass` (the native Sass binding) was incompatible with ARM64 (Apple Silicon) and Node.js v25.
- webpack 4 required the `--openssl-legacy-provider` flag via `NODE_OPTIONS` to work with OpenSSL 3, which ships with Node.js v17+.
- Yarn Classic has no built-in support for workspace-level dependency hoisting controls or `onlyBuiltDependencies` filtering, which makes native module compilation less predictable.

The combination of these issues meant the project could not build or install cleanly on a modern developer machine without manual workarounds.

## Decision

Switch from Yarn to **pnpm** as the project package manager.

pnpm was chosen over Yarn Berry (v2+) and npm because:
- It produces deterministic installs via a content-addressable store, similar to Yarn Berry, but with a simpler migration path from Yarn Classic.
- Its `pnpm-workspace.yaml` and `onlyBuiltDependencies` field give fine-grained control over which packages run install scripts — reducing the risk of malicious or broken postinstall steps.
- `pnpm` is actively maintained and widely adopted in the Vite/React ecosystem.

The `engines.node` field in `package.json` was pinned to `>=22` to document the minimum supported runtime and prevent accidental use on older Node versions.

## Consequences

- `yarn.lock` is deleted; `pnpm-lock.yaml` becomes the single source of truth for dependency resolution.
- All contributors and CI pipelines must use pnpm (e.g., `pnpm install`, `pnpm run build`).
- Native packages that require compilation (esbuild, `@parcel/watcher`, msw) are listed in `pnpm.onlyBuiltDependencies` to keep installs fast and explicit.
- The `.pnpm-store` directory is local by default; CI should cache it keyed on `pnpm-lock.yaml` for speed.
