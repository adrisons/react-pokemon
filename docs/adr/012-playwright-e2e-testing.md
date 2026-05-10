# ADR-012: Playwright for End-to-End Testing with Page Object Model

**Status:** Accepted
**Date:** 2026-05-10
**Commit:** `de2ac5e`

## Context

The project had two testing layers — unit tests (Vitest + jsdom) and story render tests (`@storybook/addon-vitest` in a real browser via Playwright). Neither layer exercised full user flows: navigating between pages, interacting with the live PokeAPI network, or verifying that the composed app behaves correctly from a browser perspective.

Specific gaps that neither layer covered:

- Pagination flow: clicking "next", verifying cards change, clicking "back" and verifying the original state is restored.
- Search flow: typing a Pokémon name, verifying filtered results, clearing and verifying the full list returns.
- Navigation: clicking a card's detail button, verifying the detail page loads with the correct Pokémon, returning to the list.

Additionally, there was no automated signal in CI that a deployment-breaking regression had been introduced.

## Decision

Introduce **Playwright** as a dedicated E2E testing framework, configured in `playwright.config.ts`, with tests living in `src/__tests__/e2e/`.

### Page Object Model

All E2E tests use the **Page Object Model (POM)** pattern. Each page in the app has a corresponding class:

```
src/__tests__/e2e/pages/
  BasePage.ts           ← shared navigate() + waitForNetworkIdle()
  PokemonListPage.ts    ← list-specific locators and interactions
  PokemonDetailPage.ts  ← detail-specific locators and interactions
```

Page classes encapsulate locators and interaction helpers; spec files only orchestrate scenarios. This keeps specs readable and centralizes selector maintenance.

**Selectors** follow the project-wide convention of `data-testid` attributes (set on components before this ADR for unit/integration testing). CSS class selectors are used only where `data-testid` was not already present (e.g., `PokemonDetailPage`).

### Test target: live dev server

Tests run against `http://localhost:5173` via Playwright's `webServer` integration — a real Vite dev server with real PokeAPI network calls:

```ts
webServer: {
  command: "pnpm dev",
  url: "http://localhost:5173/react-pokemon/",
  reuseExistingServer: !process.env.CI,
},
```

This was chosen over mocking the network because:
- The HTTP cache (ADR-010) and Zustand store (ADR-011) are part of what is being tested.
- Mocking PokeAPI at the E2E layer would duplicate the mocking already done at unit level, reducing the value of the test tier.
- PokeAPI is a stable public API; test flakiness from network variance is managed via `retries: 2` in CI.

### CI integration

A dedicated `e2e` job is added to the GitHub Actions workflow, running in parallel with the deploy job. It installs Playwright Chromium, runs `pnpm test:e2e`, and uploads the HTML report as an artifact (7-day retention).

Only **Chromium** is included in the project configuration. Cross-browser E2E coverage is deferred until it is needed.

## Consequences

- Full user flows (pagination, search, navigation) are now automatically verified on every push.
- New user flows should be added as new `test.describe` blocks in `app.spec.ts` or new spec files; page interactions must go through the POM classes, not inline in specs.
- Components that need E2E targeting must expose `data-testid` attributes — this reinforces the existing project convention.
- The E2E job requires the dev server to start successfully; a broken build will cause the job to fail at startup rather than at assertions.
- Tests make real network requests to PokeAPI; they will fail in environments without internet access (e.g., air-gapped CI runners).
- `playwright-report/` and `test-results/` are gitignored; HTML reports are only available as CI artifacts.
