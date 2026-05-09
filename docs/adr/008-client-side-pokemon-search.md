# ADR-008: Client-side Pokémon Search with Debounce

**Status:** Accepted
**Date:** 2026-05-08 (updated 2026-05-09)
**Commits:** `2a9e61b`, `907b0ed`

## Context

The app needed a way for users to filter Pokémon by name. The PokeAPI does not expose a server-side name-filter or search endpoint — the only options available via the public API are paginated list requests (`/pokemon?offset=N&limit=M`).

Alternatives considered:

| Option | Notes |
|--------|-------|
| Paginated search via proxy/BFF | Correct at scale, but introduces infrastructure that is out of scope for this project |
| Third-party search index (Algolia, Typesense) | Correct at scale; overkill for ~1 350 static records |
| Prefix-only filter on current page | Poor UX — users would need to navigate to the right page before searching |
| **Fetch all names once, filter client-side** | Simple; dataset is small and quasi-static; fits the project's scope |

## Decision

On the first search interaction, fetch the complete Pokémon name list in a single HTTP request using `limit=10000` as a deliberate upper bound (the actual PokeAPI dataset is ~1 350 entries). The response contains only `{name, url}` pairs — no images, stats, or descriptions — making the payload approximately **15–20 KB gzipped**.

The result is loaded and cached through a two-layer mechanism (see ADR-010 and ADR-011):
1. The `cachedFetch` HTTP cache holds the response for 1 hour (TTL set in `usePokemonListStore`).
2. The Zustand store (`usePokemonListStore`) holds the parsed results in reactive state for the page session.

Once loaded, all subsequent keystrokes filter the in-memory array without any network round-trip.

A **debounce of 150 ms** is applied via `useRef<ReturnType<typeof setTimeout>>` in `usePokemonSearch`. This value was reduced from an initial 500 ms after the Zustand store layer was introduced, because the store check is synchronous (no fetch cost on subsequent keystrokes).

### Trade-off note

This approach is appropriate because:
- The full name list is ~1 350 entries and grows only when a new Pokémon generation ships (every ~3 years).
- The data is name-only — not images, stats, or descriptions.
- There is no authentication, write operations, or user-specific data involved.

If the dataset grew significantly or the project moved to a production environment at scale, the appropriate next step would be a dedicated search index (Algolia, Typesense) or a BFF with server-side filtering.

## Consequences

- Search results appear instantly after the first load (subsequent keystrokes are zero-latency).
- There is a single network request on first search; all subsequent searches reuse the cached result.
- Pokémon added to the PokeAPI after the session started will not appear in search results until the page is reloaded (acceptable given the dataset's update frequency).
- The `usePokemonSearch` hook is decoupled from fetch mechanics — it delegates to `usePokemonListStore.getState().loadAllPokemons()` and only handles filtering and debouncing.
- Test isolation requires resetting both the Zustand store and the HTTP cache entry via `_resetCacheForTesting()` (which calls `usePokemonListStore.getState().resetAllPokemons()`).
