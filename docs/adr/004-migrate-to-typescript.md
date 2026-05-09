# ADR-004: Migrate to TypeScript

**Status:** Accepted
**Date:** 2026-05-08
**Commit:** `dd3bd84`

## Context

The entire codebase was written in JavaScript (`.js` / `.jsx`). As the project underwent architectural changes (feature-based layout, new hooks, API adapters), the absence of static type checking created real risk:

- API response shapes were implicit; a field rename or missing key caused runtime errors rather than compile-time feedback.
- Refactoring (e.g., moving components between directories) relied on manual tracing of usages.
- Editor tooling (autocomplete, go-to-definition) was limited without type information.
- onboarding cost was higher because function signatures and data shapes were undocumented in the code.

## Decision

Migrate all source files from `.js`/`.jsx` to **TypeScript** (`.ts`/`.tsx`).

Key configuration decisions:

- `tsconfig.json` is added with `"strict": true` to catch the most common class of type errors (implicit `any`, null safety, etc.).
- API response shapes are separated into `api.types.ts` files (raw PokeAPI JSON shapes) and `models.ts` files (domain models used inside the app), with explicit adapters in `adapters.ts`.
- `@types/*` packages cover all third-party dependencies.
- `.jsx` files that were not yet migrated are excluded from test coverage thresholds to avoid blocking CI while the migration proceeds.

Files that are pure configuration or auto-generated (shadcn primitives, barrel `index` files) are also excluded from coverage since they contain no business logic.

## Consequences

- Type errors are caught at build time via `tsc`; the project fails to build if types are violated.
- API contract between `src/core/domain/` and feature hooks is enforced by shared type definitions.
- Adding new PokeAPI fields requires updating `api.types.ts` and `models.ts`, but the compiler will surface all usages that need updating.
- Some legacy `.jsx` files coexist temporarily until full migration; they are treated as JavaScript by TypeScript (`allowJs` is not required since they are excluded from coverage but still processed by Vite).
- `@types/redux-logger` remains in `devDependencies` as an artifact from the pre-Redux-removal era; it can be removed once confirmed unused.
