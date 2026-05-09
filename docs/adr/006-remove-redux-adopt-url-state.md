# ADR-006: Remove Redux, Adopt URL-based Pagination State

**Status:** Accepted
**Date:** 2026-05-08
**Commit:** `5b973e9`

## Context

Redux Toolkit was used to manage a single piece of state: the current pagination offset (which page of Pokémon to display). This required:

- A `store.ts` file wiring the Redux store
- A slice with actions and a reducer
- A `Provider` wrapping the app
- `useSelector` / `useDispatch` calls in the component

This is significant boilerplate for a value that is, semantically, part of the URL — the user is browsing "page 3" of Pokémon, not triggering an internal state transition.

Alternatives considered:

| Option | Notes |
|--------|-------|
| Keep Redux | Excessive overhead for a single scalar value; no other global state exists |
| Zustand | Appropriate for domain state, but still client-only; URL would not be shareable |
| React context | Same problem as Zustand — no URL shareability |
| **URL search params** | URL is the canonical representation of "which page"; naturally shareable and bookmarkable |

## Decision

Remove Redux entirely. Encode pagination state in **URL search params** (`?offset=N&limit=20`) managed via React Router's `useSearchParams` hook.

The `usePokemonList` hook reads `offset` and `limit` from the URL on each render:

```ts
const offset = searchParams.get("offset") ?? "0";
const limit  = searchParams.get("limit")  ?? "20";
```

Navigation to the next or previous page calls `setSearchParams(...)`, which updates the URL and triggers a re-fetch via the `useEffect` that depends on the constructed URL string.

## Consequences

- Pagination state is reflected in the URL: sharing or bookmarking a URL preserves the user's position in the list.
- The browser back/forward buttons work correctly for pagination without any custom history management.
- `store.ts`, Redux slices, and the `Provider` wrapper are removed — ~50 lines of boilerplate gone.
- Testing pagination now means navigating with URL parameters (via `MemoryRouter` with initial entries) instead of mocking a Redux store.
- If more complex client state is needed in the future, Zustand (see ADR-011) is the preferred approach; Redux will not be reintroduced.
