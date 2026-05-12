import { describe, it, expect, vi, beforeEach } from "vitest";
import { getEffectivenessMap } from "./api";
import type { EffectivenessMap } from "./models";

vi.mock("@core/api", () => ({
  get: vi.fn(),
}));

vi.mock("@core/api/httpCache", () => ({
  cachedFetch: vi.fn(),
}));

import { cachedFetch } from "@core/api/httpCache";

const mockedCachedFetch = vi.mocked(cachedFetch);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getEffectivenessMap", () => {
  it("delegates to cachedFetch with a derived cache key and 1-hour TTL", async () => {
    const fakeMap: EffectivenessMap = {
      fire: { grass: 2 },
    } as EffectivenessMap;

    mockedCachedFetch.mockResolvedValue(fakeMap);

    const result = await getEffectivenessMap();

    expect(mockedCachedFetch).toHaveBeenCalledWith(
      "derived://effectiveness-map",
      expect.any(Function),
      { ttlMs: 3_600_000 },
    );
    expect(result).toBe(fakeMap);
  });

  it("inner fetcher calls get() for every type and adapts the result", async () => {
    const { get } = await import("@core/api");
    const mockedGet = vi.mocked(get);

    mockedGet.mockResolvedValue({
      id: 1,
      name: "fire",
      damage_relations: {
        double_damage_from: [],
        double_damage_to: [{ name: "grass", url: "" }],
        half_damage_from: [],
        half_damage_to: [],
        no_damage_from: [],
        no_damage_to: [],
      },
    });

    let innerFetcher!: () => Promise<EffectivenessMap>;
    mockedCachedFetch.mockImplementation(async (_key, fetcher) => {
      innerFetcher = fetcher as () => Promise<EffectivenessMap>;
      return fetcher();
    });

    await getEffectivenessMap();

    expect(mockedGet).toHaveBeenCalledWith("/type/fire");
    expect(mockedGet).toHaveBeenCalledWith("/type/water");
    expect(mockedGet).toHaveBeenCalledTimes(18);
  });
});
