# ADR-009: Code Splitting with React.lazy and Suspense

**Status:** Accepted
**Date:** 2026-05-08
**Commit:** `aeb7812`

## Context

Without code splitting, Vite bundles all application code into a single JavaScript chunk. For this app that means `PokemonListPage` and `PokemonDetailPage` — along with all their dependencies — are downloaded, parsed, and executed on the very first page load, regardless of which route the user visits.

As the UI grew richer (flip animations, Tailwind utilities, shadcn components, custom hooks), the initial bundle size increased. A user landing on the list page should not pay the parse cost of detail page code they may never visit.

## Decision

Use **`React.lazy()`** to split each page into its own chunk, wrapped in a single **`<Suspense>`** boundary at the router level.

`src/app/router.tsx`:

```tsx
const PokemonListPage   = lazy(() => import("@features/pokemon-list/pages/PokemonListPage"));
const PokemonDetailPage = lazy(() => import("@features/pokemon-detail/pages/PokemonDetailPage"));

function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/react-pokemon/"            element={<PokemonListPage />} />
        <Route path="/react-pokemon/detail/:id"  element={<PokemonDetailPage />} />
      </Routes>
    </Suspense>
  );
}
```

Vite automatically emits a separate chunk for each dynamic import. Measured output after this change:

| Chunk | Gzipped size |
|-------|-------------|
| List page | 8.4 kB |
| Detail page | 3.2 kB |

`vite.config.ts` has `build.sourcemap: true` enabled so `source-map-explorer` can inspect bundle contents. A dedicated `analyze` npm script (`source-map-explorer 'dist/assets/*.js' --no-border-checks`) is provided for ongoing bundle auditing.

The `<Loading />` component intentionally receives `decoding="async"` on its image only where it is used as an image container; when used as a Suspense fallback it must render eagerly (no lazy loading on the spinner itself).

## Consequences

- The initial page load only downloads the chunk for the route being visited.
- Navigating to a route for the first time triggers a brief `<Loading />` fallback while the chunk is fetched; subsequent visits use the browser's module cache.
- Adding new page-level routes should follow the same `React.lazy()` + dynamic import pattern.
- The `source-map-explorer` `analyze` script requires a completed `pnpm build` before it can run.
- Chunk boundaries are at the page level only; intra-page code splitting (e.g., modal dialogs) is not currently applied and can be added if profiling shows it is needed.
