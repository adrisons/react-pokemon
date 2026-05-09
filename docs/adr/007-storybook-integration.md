# ADR-007: Storybook Integration

**Status:** Accepted
**Date:** 2026-05-08
**Commits:** `346310b`, `e152103`

## Context

As the component library grew (Badge, Loading, Pagination, PokemonCard, PokemonList, Navbar, PokemonPicture), there was no isolated environment in which to develop, inspect, or document them. All visual validation happened by running the full app and navigating to the relevant page.

This created two problems:
- **Development friction**: testing edge-case states (loading, error, empty results, search not found) required mocking application state or navigating specific flows.
- **No visual baseline**: there was no lightweight way to detect unintended visual regressions in UI components without running the full app.

## Decision

Integrate **Storybook 10** using the `@storybook/react-vite` builder, which shares the same Vite config (including path aliases and Tailwind) as the main app.

Key integration choices:

**Stories co-located with components**: each story file lives next to the component it documents (e.g., `PokemonCard.stories.tsx` alongside `PokemonCard.tsx`), following the feature-based architecture pattern.

**`@storybook/addon-vitest`**: stories are executed as browser-based tests inside a dedicated vitest project named `storybook`. This means:
- `pnpm test` runs unit tests only (jsdom, fast).
- `pnpm test:storybook` runs story render tests in a real Playwright/Chromium browser (headless).
- Both share the same `vite.config.ts` via the `extends: true` pattern.

**Storybook configuration** (`.storybook/main.ts`, `.storybook/preview.ts`) imports global styles and sets up decorators needed for the Tailwind + React context.

**`@storybook/addon-a11y`** is included to surface accessibility violations during component development.

## Consequences

- Every presentational component should have at least a default story; this serves as living documentation.
- The `storybook` vitest project requires Playwright and Chromium; CI must install them (`playwright install --with-deps chromium`).
- `pnpm test` is intentionally scoped to `--project=unit` to keep the fast feedback loop; storybook tests are opt-in.
- Storybook build artifacts (`storybook-static/`) are gitignored; they can be deployed to Chromatic or any static host separately.
- Stories that rely on React Router or other providers need decorators wrapping `<MemoryRouter>` or equivalent.
