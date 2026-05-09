# ADR-010: In-memory HTTP Cache with Deduplication

**Status:** Accepted
**Date:** 2026-05-08
**Commit:** `aeb7812`

## Context

Every navigation back to the list page or re-render of a component that called `fetch()` directly triggered a new HTTP request to the PokeAPI. There was no caching layer between the application and the network.

The browser's native HTTP cache was not a reliable solution here because:
- PokeAPI does not set long-lived `Cache-Control` headers.
- The app controls no server infrastructure and cannot configure cache headers.
- A `stale-while-revalidate` approach would require service worker setup, which is disproportionate for this app.

The same problem manifested as **stampede risk**: if two components mounted at the same time and both needed the same URL (e.g., the Pokémon list), both would fire separate fetch requests before either resolved.

## Decision

Implement a general-purpose **in-memory HTTP cache** in `src/core/api/httpCache.ts` that wraps every `GET` request made through the app's HTTP client.

The cache has two internal `Map` structures:

```ts
const cache    = new Map<string, CacheEntry<unknown>>();  // resolved responses
const inFlight = new Map<string, Promise<unknown>>();     // in-progress requests
```

**`cachedFetch<T>(key, fetcher, { ttlMs })`** is the public API:

1. If a non-expired entry exists in `cache` → return it immediately (synchronous).
2. If a promise exists in `inFlight` for the same key → return that shared promise (stampede protection).
3. Otherwise, call `fetcher()`, store the promise in `inFlight`, and on resolution write the result to `cache` with `expiresAt = Date.now() + ttlMs`.
4. Errors are not cached: the `inFlight` entry is always deleted in `.finally()`, so a failed request can be retried immediately.

The default TTL is **5 minutes**. Individual callers can override it (e.g., `usePokemonListStore` uses 1 hour for the full name list — see ADR-011).

All calls to `get()` in `httpClient.ts` pass through `cachedFetch` automatically:

```ts
export function get<T>(path: string, options?: CachedFetchOptions): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  return cachedFetch<T>(url, () => request<T>(url), options);
}
```

Two escape hatches are exported for test teardown:
- `clearHttpCache()` — clears both maps entirely.
- `invalidateHttpCacheKey(key)` — removes a single URL entry from both maps.

## Consequences

- Navigating back to the list page or re-mounting a component does not trigger a new network request if the cached response is still within TTL.
- Concurrent renders requesting the same URL share one fetch; no duplicate network requests.
- The cache is in JS module memory — it is cleared automatically on page reload or hot-module replacement (HMR).
- The cache is not shared between browser tabs.
- Tests that exercise fetch behavior must call `clearHttpCache()` (or `invalidateHttpCacheKey()`) in `beforeEach`/`afterEach` to prevent cross-test contamination.
- This layer is intentionally generic (URL-keyed, TTL-based); domain-specific caching concerns (e.g., reactive state for the Pokémon list) are handled at a higher layer via Zustand (see ADR-011).
