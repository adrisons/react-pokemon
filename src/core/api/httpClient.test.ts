import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Must mock httpCache before importing httpClient so cachedFetch is injectable
vi.mock("./httpCache", () => ({
  cachedFetch: vi.fn((key: string, fetcher: () => Promise<unknown>) => fetcher()),
  clearHttpCache: vi.fn(),
  invalidateHttpCacheKey: vi.fn(),
}));

import { get, invalidateGet } from "./httpClient";
import { invalidateHttpCacheKey } from "./httpCache";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

function makeResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  };
}

describe("get", () => {
  describe("WHEN: path is relative", () => {
    it("THEN: prepends the PokeAPI base URL", async () => {
      mockFetch.mockResolvedValue(makeResponse({ id: 1 }));
      await get("/pokemon/1");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon/1"
      );
    });

    it("THEN: returns parsed JSON", async () => {
      mockFetch.mockResolvedValue(makeResponse({ id: 25 }));
      const result = await get<{ id: number }>("/pokemon/25");
      expect(result).toEqual({ id: 25 });
    });
  });

  describe("WHEN: path is an absolute URL", () => {
    it("THEN: uses the URL as-is", async () => {
      const absoluteUrl = "https://other-host.example/data";
      mockFetch.mockResolvedValue(makeResponse({ foo: "bar" }));
      await get(absoluteUrl);
      expect(mockFetch).toHaveBeenCalledWith(absoluteUrl);
    });
  });

  describe("WHEN: the HTTP response is not ok", () => {
    it("THEN: throws an error with the status code", async () => {
      mockFetch.mockResolvedValue(makeResponse(null, false, 404));
      await expect(get("/pokemon/9999")).rejects.toThrow("HTTP error: 404");
    });
  });
});

describe("invalidateGet", () => {
  it("THEN: resolves a relative path and invalidates the cache entry", () => {
    invalidateGet("/pokemon/25");
    expect(invalidateHttpCacheKey).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon/25"
    );
  });

  it("THEN: passes an absolute URL as-is", () => {
    invalidateGet("https://other-host.example/data");
    expect(invalidateHttpCacheKey).toHaveBeenCalledWith(
      "https://other-host.example/data"
    );
  });
});
