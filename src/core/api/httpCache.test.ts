import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cachedFetch, clearHttpCache, invalidateHttpCacheKey } from "./httpCache";

beforeEach(() => {
  clearHttpCache();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("cachedFetch", () => {
  describe("WHEN: called once", () => {
    it("THEN: calls fetcher and returns its value", async () => {
      const fetcher = vi.fn().mockResolvedValue({ data: 42 });
      const result = await cachedFetch("key-1", fetcher);
      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ data: 42 });
    });
  });

  describe("WHEN: called twice with the same key within TTL", () => {
    it("THEN: returns cached value without calling fetcher again", async () => {
      const fetcher = vi.fn().mockResolvedValue("cached-value");
      await cachedFetch("key-cache", fetcher);
      const second = await cachedFetch("key-cache", fetcher);
      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(second).toBe("cached-value");
    });
  });

  describe("WHEN: TTL has expired", () => {
    it("THEN: calls fetcher again after expiry", async () => {
      const fetcher = vi.fn().mockResolvedValue("fresh");
      const ttlMs = 1000;
      await cachedFetch("key-ttl", fetcher, { ttlMs });
      vi.advanceTimersByTime(ttlMs + 1);
      await cachedFetch("key-ttl", fetcher, { ttlMs });
      expect(fetcher).toHaveBeenCalledTimes(2);
    });
  });

  describe("WHEN: two concurrent calls share the same key", () => {
    it("THEN: fetcher is called only once (stampede protection)", async () => {
      let resolveFirst!: (v: string) => void;
      const fetcher = vi.fn(
        () => new Promise<string>((resolve) => { resolveFirst = resolve; })
      );

      const p1 = cachedFetch("key-inflight", fetcher);
      const p2 = cachedFetch("key-inflight", fetcher);

      resolveFirst("deduped");
      const [r1, r2] = await Promise.all([p1, p2]);

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(r1).toBe("deduped");
      expect(r2).toBe("deduped");
    });
  });

  describe("WHEN: fetcher rejects", () => {
    it("THEN: error propagates and entry is removed from in-flight", async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error("fetch failed"));
      await expect(cachedFetch("key-err", fetcher)).rejects.toThrow("fetch failed");
      // After failure the cache entry should not exist — a retry must call fetcher again
      const fetcher2 = vi.fn().mockResolvedValue("retry-ok");
      const result = await cachedFetch("key-err", fetcher2);
      expect(fetcher2).toHaveBeenCalledTimes(1);
      expect(result).toBe("retry-ok");
    });
  });
});

describe("clearHttpCache", () => {
  it("THEN: forces a fresh fetch after clearing", async () => {
    const fetcher = vi.fn().mockResolvedValue("original");
    await cachedFetch("key-clear", fetcher);
    clearHttpCache();
    const fetcher2 = vi.fn().mockResolvedValue("after-clear");
    const result = await cachedFetch("key-clear", fetcher2);
    expect(fetcher2).toHaveBeenCalledTimes(1);
    expect(result).toBe("after-clear");
  });
});

describe("invalidateHttpCacheKey", () => {
  it("THEN: forces a fresh fetch only for the invalidated key", async () => {
    const fetcherA = vi.fn().mockResolvedValue("a");
    const fetcherB = vi.fn().mockResolvedValue("b");
    await cachedFetch("key-a", fetcherA);
    await cachedFetch("key-b", fetcherB);

    invalidateHttpCacheKey("key-a");

    const fetcherA2 = vi.fn().mockResolvedValue("a2");
    const fetcherB2 = vi.fn().mockResolvedValue("b2");
    await cachedFetch("key-a", fetcherA2);
    await cachedFetch("key-b", fetcherB2);

    expect(fetcherA2).toHaveBeenCalledTimes(1);
    expect(fetcherB2).not.toHaveBeenCalled(); // key-b still cached
  });
});
