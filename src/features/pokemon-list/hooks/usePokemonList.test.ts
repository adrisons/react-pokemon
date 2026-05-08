import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { createWrapper } from "@shared/test-utils/routerWrapper";

vi.mock("@features/pokemon-list/api/pokemonListApi", () => ({
  getPokemonList: vi.fn(),
}));

import { usePokemonList } from "./usePokemonList";
import { getPokemonList } from "@features/pokemon-list/api/pokemonListApi";

const mockPokemons = [
  { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
  { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
];

const defaultResponse = { results: mockPokemons, next: null, previous: null };

beforeEach(() => {
  vi.mocked(getPokemonList).mockResolvedValue(defaultResponse);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("GIVEN: usePokemonList", () => {
  describe("WHEN: initial render", () => {
    it("THEN: should start loading", () => {
      const { result } = renderHook(() => usePokemonList(), {
        wrapper: createWrapper(),
      });
      expect(result.current.loading).toBe(true);
    });

    it("THEN: should load pokemons after fetch", async () => {
      const { result } = renderHook(() => usePokemonList(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.pokemons).toEqual(mockPokemons);
      expect(result.current.error).toBe(false);
    });

    it("THEN: gotoNextPage should be null when there is no next page", async () => {
      const { result } = renderHook(() => usePokemonList(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.gotoNextPage).toBeNull();
    });

    it("THEN: gotoPrevPage should be null when there is no previous page", async () => {
      const { result } = renderHook(() => usePokemonList(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.gotoPrevPage).toBeNull();
    });
  });

  describe("WHEN: there is a next page", () => {
    it("THEN: gotoNextPage should be a function", async () => {
      vi.mocked(getPokemonList).mockResolvedValue({
        ...defaultResponse,
        next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
      });
      const { result } = renderHook(() => usePokemonList(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.gotoNextPage).toBeTypeOf("function");
    });

    it("THEN: calling gotoNextPage updates the offset search param", async () => {
      vi.mocked(getPokemonList).mockResolvedValue({
        ...defaultResponse,
        next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
      });
      const { result } = renderHook(() => usePokemonList(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      act(() => {
        result.current.gotoNextPage!();
      });
      await waitFor(() => expect(getPokemonList).toHaveBeenCalledTimes(2));
      const secondCallUrl = vi.mocked(getPokemonList).mock.calls[1][0];
      expect(secondCallUrl).toContain("offset=20");
    });
  });

  describe("WHEN: there is a previous page", () => {
    it("THEN: gotoPrevPage should be a function", async () => {
      vi.mocked(getPokemonList).mockResolvedValue({
        ...defaultResponse,
        previous: "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20",
      });
      const { result } = renderHook(() => usePokemonList(), {
        wrapper: createWrapper("?offset=20&limit=20"),
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.gotoPrevPage).toBeTypeOf("function");
    });

    it("THEN: calling gotoPrevPage decreases the offset", async () => {
      vi.mocked(getPokemonList).mockResolvedValue({
        ...defaultResponse,
        previous: "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20",
      });
      const { result } = renderHook(() => usePokemonList(), {
        wrapper: createWrapper("?offset=20&limit=20"),
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      act(() => {
        result.current.gotoPrevPage!();
      });
      await waitFor(() => expect(getPokemonList).toHaveBeenCalledTimes(2));
      const secondCallUrl = vi.mocked(getPokemonList).mock.calls[1][0];
      expect(secondCallUrl).toContain("offset=0");
    });
  });

  describe("WHEN: the API call fails", () => {
    it("THEN: should set error to true and loading to false", async () => {
      vi.mocked(getPokemonList).mockRejectedValue(new Error("Network error"));
      const { result } = renderHook(() => usePokemonList(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error).toBe(true);
      expect(result.current.pokemons).toEqual([]);
    });
  });
});
