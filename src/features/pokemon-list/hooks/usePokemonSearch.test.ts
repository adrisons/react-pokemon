import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

vi.mock("@features/pokemon-list/api/pokemonListApi", () => ({
  getPokemonList: vi.fn(),
}));

import { usePokemonSearch, _resetCacheForTesting } from "./usePokemonSearch";
import { getPokemonList } from "@features/pokemon-list/api/pokemonListApi";

const mockPokemons = [
  { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
  { name: "pichu", url: "https://pokeapi.co/api/v2/pokemon/172/" },
  { name: "pikipek", url: "https://pokeapi.co/api/v2/pokemon/731/" },
  { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
  { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
];

beforeEach(() => {
  vi.useFakeTimers();
  _resetCacheForTesting();
  vi.mocked(getPokemonList).mockResolvedValue({
    results: mockPokemons,
    next: null,
    previous: null,
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("GIVEN: usePokemonSearch", () => {
  describe("WHEN: search is called with an empty string", () => {
    it("THEN: should not trigger a search or set searching to true", () => {
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search(""));

      expect(result.current.searching).toBe(false);
      expect(result.current.results).toHaveLength(0);
      expect(result.current.notFound).toBe(false);
    });

    it("THEN: should not call the API", () => {
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search(""));

      expect(getPokemonList).not.toHaveBeenCalled();
    });
  });

  describe("WHEN: search is called with a query", () => {
    it("THEN: should set searching to true immediately", () => {
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search("pik"));

      expect(result.current.searching).toBe(true);
    });

    it("THEN: should NOT call the API before 500ms (debounce)", () => {
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search("pik"));
      act(() => vi.advanceTimersByTime(499));

      expect(getPokemonList).not.toHaveBeenCalled();
    });

    it("THEN: should call the API after 500ms", async () => {
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search("pik"));
      await act(async () => { await vi.advanceTimersByTimeAsync(500); });

      expect(getPokemonList).toHaveBeenCalledTimes(1);
      expect(result.current.searching).toBe(false);
    });

    it("THEN: should return all pokemons whose name contains the query (partial match)", async () => {
      // "pik" matches: pikachu (p-i-k-a-c-h-u), pikipek (p-i-k-i-p-e-k)
      // "pichu" (p-i-c-h-u) does NOT contain "pik"
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search("pik"));
      await act(async () => { await vi.advanceTimersByTimeAsync(500); });

      const names = result.current.results.map((p) => p.name);
      expect(names).toEqual(expect.arrayContaining(["pikachu", "pikipek"]));
      expect(names).not.toContain("pichu");
      expect(result.current.results).toHaveLength(2);
    });

    it("THEN: should match names containing 'pic' which includes pichu", async () => {
      // "pic" matches: pichu (p-i-c-h-u)
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search("pic"));
      await act(async () => { await vi.advanceTimersByTimeAsync(500); });

      const names = result.current.results.map((p) => p.name);
      expect(names).toContain("pichu");
    });

    it("THEN: should match names case-insensitively", async () => {
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search("PIK"));
      await act(async () => { await vi.advanceTimersByTimeAsync(500); });

      expect(result.current.results).toHaveLength(2);
      expect(result.current.results.map((p) => p.name)).toEqual(
        expect.arrayContaining(["pikachu", "pikipek"])
      );
    });

    it("THEN: should return a single exact match when query is the full name", async () => {
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search("bulbasaur"));
      await act(async () => { await vi.advanceTimersByTimeAsync(500); });

      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].name).toBe("bulbasaur");
    });
  });

  describe("WHEN: search finds no matching pokemons", () => {
    it("THEN: should set notFound to true", async () => {
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search("zzznomatch"));
      await act(async () => { await vi.advanceTimersByTimeAsync(500); });

      expect(result.current.notFound).toBe(true);
      expect(result.current.results).toHaveLength(0);
    });

    it("THEN: should set searching to false", async () => {
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search("zzznomatch"));
      await act(async () => { await vi.advanceTimersByTimeAsync(500); });

      expect(result.current.searching).toBe(false);
    });
  });

  describe("WHEN: user types rapidly (debounce cancellation)", () => {
    it("THEN: should only execute the last search after 500ms", async () => {
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search("p"));
      act(() => { vi.advanceTimersByTime(100); });
      act(() => result.current.search("pi"));
      act(() => { vi.advanceTimersByTime(100); });
      act(() => result.current.search("pik"));

      await act(async () => { await vi.advanceTimersByTimeAsync(500); });

      // Only one API call total (last debounced query "pik")
      expect(getPokemonList).toHaveBeenCalledTimes(1);
      expect(result.current.results.map((p) => p.name)).toEqual(
        expect.arrayContaining(["pikachu", "pikipek"])
      );
    });
  });

  describe("WHEN: clear() is called", () => {
    it("THEN: should reset all state", async () => {
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search("pik"));
      await act(async () => { await vi.advanceTimersByTimeAsync(500); });

      act(() => result.current.clear());

      expect(result.current.results).toHaveLength(0);
      expect(result.current.notFound).toBe(false);
      expect(result.current.searching).toBe(false);
    });

    it("THEN: should cancel a pending debounced search", async () => {
      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search("pik"));
      act(() => result.current.clear());

      await act(async () => { await vi.advanceTimersByTimeAsync(500); });

      expect(result.current.searching).toBe(false);
      expect(result.current.results).toHaveLength(0);
    });
  });

  describe("WHEN: the API call fails", () => {
    it("THEN: should set notFound to true and clear results", async () => {
      vi.mocked(getPokemonList).mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => usePokemonSearch());

      act(() => result.current.search("pik"));
      await act(async () => { await vi.advanceTimersByTimeAsync(500); });

      expect(result.current.notFound).toBe(true);
      expect(result.current.results).toHaveLength(0);
      expect(result.current.searching).toBe(false);
    });
  });
});
