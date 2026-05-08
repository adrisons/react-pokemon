/**
 * Caché en memoria para respuestas HTTP GET.
 *
 * Características:
 *  - TTL configurable por entrada (default 5 min).
 *  - Deduplicación de peticiones en vuelo: dos llamadas concurrentes a la
 *    misma URL comparten la misma promesa (stampede protection).
 *  - Si la petición falla, la entrada se invalida para no cachear errores.
 *
 * El estado vive a nivel de módulo: se reinstancia tras hot-reload o test.
 */

const DEFAULT_TTL_MS = 5 * 60 * 1000;

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

const cache = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();

export interface CachedFetchOptions {
  ttlMs?: number;
}

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  { ttlMs = DEFAULT_TTL_MS }: CachedFetchOptions = {}
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key) as CacheEntry<T> | undefined;
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const existing = inFlight.get(key) as Promise<T> | undefined;
  if (existing) {
    return existing;
  }

  const promise = fetcher()
    .then((value) => {
      cache.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
}

export function clearHttpCache(): void {
  cache.clear();
  inFlight.clear();
}

export function invalidateHttpCacheKey(key: string): void {
  cache.delete(key);
  inFlight.delete(key);
}
