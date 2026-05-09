# ADR-011: Zustand as Domain-layer Cache for Quasi-static Data

**Status:** Accepted
**Date:** 2026-05-09
**Commit:** `907b0ed`

## Context

After the initial implementation of client-side search (ADR-008), the complete Pokémon name list was cached in a plain **module-level variable**:

```ts
let allPokemonsCache: PokemonSummary[] | null = null;
```

This approach had two problems:

1. **Not reactive**: the variable lived outside React's state model. Components could not subscribe to changes, and React's reconciliation did not know about it.
2. **Brittle test isolation**: the module-level variable persisted across test files within a vitest worker. The `_resetCacheForTesting()` helper had to null the variable directly, and the HTTP cache (`cachedFetch`) had to be invalidated separately. These were two separate, easy-to-forget steps.

At the same time, Redux had been removed (ADR-006) to eliminate boilerplate. Reintroducing Redux for a single list slice would have been regressive. A lighter alternative was needed.

## Decision

Introduce **Zustand** (`zustand`) as a lightweight, scoped state manager for the `allPokemons` slice, implemented in `src/features/pokemon-list/store/index.ts`.

```ts
export const usePokemonListStore = create<PokemonListStore>((set, get) => ({
  allPokemons: null,

  loadAllPokemons: async () => {
    const cached = get().allPokemons;
    if (cached) return cached;                         // Layer 1: Zustand state

    const result = await cachedFetch(                  // Layer 2: HTTP cache (TTL 1h)
      ALL_POKEMON_URL,
      () => getPokemonList(ALL_POKEMON_URL).then(d => d.results),
      { ttlMs: ALL_POKEMON_TTL_MS }
    );

    set({ allPokemons: result });
    return result;
  },

  resetAllPokemons: () => {
    set({ allPokemons: null });
    invalidateHttpCacheKey(ALL_POKEMON_URL);           // Both layers cleared atomically
  },
}));
```

### Two-layer cache architecture

```
usePokemonSearch (hook)
       │
       ▼
usePokemonListStore.loadAllPokemons()
       │
       ├── Layer 1: Zustand state (allPokemons !== null)
       │     └── Returns synchronously if data is already in store
       │
       └── Layer 2: cachedFetch (HTTP cache, TTL = 1 hour)
               └── Returns from Map if within TTL, otherwise fetches network
```

The **TTL for this endpoint is set to 1 hour** (vs. the default 5 minutes used by other API calls) because Pokémon names are a quasi-static dataset — new entries appear only when a new game generation ships, roughly every 3 years.

Zustand was chosen over alternatives for this use case:

| Option | Why not |
|--------|---------|
| Module-level variable | Not reactive; test isolation is fragile |
| React context | Re-renders all consumers on change; requires Provider wiring |
| Redux Toolkit | Excessive boilerplate; already removed in ADR-006 |
| TanStack Query | Correct at a larger scale; adds a significant dependency for one endpoint |
| **Zustand** | Zero boilerplate; React-reactive; works outside React (`.getState()`); easily scoped to one feature |

The store scope is intentionally **narrow**: one slice, one feature, one use case. Zustand is not adopted as a global state solution for the whole app.

## Consequences

- `usePokemonSearch` is fully decoupled from fetch mechanics — it calls `usePokemonListStore.getState().loadAllPokemons()` and handles only filtering and debouncing.
- Test teardown is a single call: `usePokemonListStore.getState().resetAllPokemons()` clears both the Zustand state and the HTTP cache entry atomically.
- The debounce in `usePokemonSearch` was reduced from 500 ms to **150 ms** because the synchronous Zustand check makes subsequent search calls near-instant.
- If more domain slices need reactive state in the future, additional Zustand stores can be created per feature following the same pattern.
- The store state lives in JS memory and is cleared on page reload; it is not persisted to `localStorage` or `sessionStorage`.
