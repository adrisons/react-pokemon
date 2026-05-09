# ADR-003: Feature-based Architecture

**Status:** Accepted
**Date:** 2026-05-07
**Commits:** `f8c6bbe`, `dd3bd84`

## Context

The original project had a flat structure rooted at `src/`:

```
src/
  components/   # all UI components, mixed concerns
  pages/        # page-level components
  styles/       # global styles
  index.js
```

This layout caused several problems as the codebase grew:
- Components with different concerns (shared UI, domain-specific UI, data-fetching) lived side by side with no enforced boundary.
- Adding a new feature required touching multiple top-level directories with no obvious co-location.
- Test files had no clear relationship to the feature they belonged to.
- Imports were relative and long (e.g., `../../components/pagination`).

## Decision

Adopt a **feature-based (vertical slice) architecture** with the following top-level directories under `src/`:

| Directory | Purpose |
|-----------|---------|
| `src/app/` | App bootstrap: router, providers, global `App` component |
| `src/core/` | Infrastructure shared across the whole app: HTTP client, domain models, API types |
| `src/features/{name}/` | Self-contained vertical slices (components, hooks, API calls, pages, stories, tests) |
| `src/shared/` | Truly cross-cutting utilities and UI primitives not tied to any single feature |
| `src/layouts/` | Page layout wrappers |

Each feature directory (`src/features/pokemon-list/`, `src/features/pokemon-detail/`) owns its own:
- `api/` — API call functions
- `components/` — feature-specific UI
- `hooks/` — data-fetching and state hooks
- `pages/` — routable page components
- `store/` — feature-level state (e.g., Zustand slice)

**Path aliases** are configured in `vite.config.ts` and `tsconfig.json`:

```ts
"@app"      → src/app
"@core"     → src/core
"@features" → src/features
"@shared"   → src/shared
"@layouts"  → src/layouts
```

This eliminates long relative imports and makes the intent of each import explicit.

## Consequences

- New features are added by creating a new directory under `src/features/` without touching other feature directories.
- Cross-feature communication must go through `src/core/` or `src/shared/`; direct imports between feature directories are discouraged.
- Path aliases require both Vite and TypeScript to be configured in sync; mismatches cause silent build failures.
- The `src/shared/ui/components/ui/` subdirectory is reserved for shadcn/ui auto-generated primitives and should not be hand-edited.
