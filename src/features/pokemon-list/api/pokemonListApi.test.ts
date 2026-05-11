import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@core/api", () => ({ get: vi.fn(), invalidateGet: vi.fn() }));

import { getPokemonList, getAllPokemons, invalidateAllPokemonsCache } from "./pokemonListApi";
import { get, invalidateGet } from "@core/api";

afterEach(() => vi.clearAllMocks());

describe("getPokemonList", () => {
  it("THEN: calls get with the provided path", async () => {
    const path = "/pokemon?offset=0&limit=20";
    vi.mocked(get).mockResolvedValue({ results: [], next: null, previous: null });
    await getPokemonList(path);
    expect(get).toHaveBeenCalledWith(path);
  });

  it("THEN: returns the raw list response", async () => {
    const raw = {
      results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }],
      next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
      previous: null,
    };
    vi.mocked(get).mockResolvedValue(raw);
    const result = await getPokemonList("/pokemon?offset=0&limit=20");
    expect(result).toEqual(raw);
  });

  it("THEN: passes different paths correctly", async () => {
    const path = "/pokemon?offset=40&limit=20";
    vi.mocked(get).mockResolvedValue({ results: [], next: null, previous: null });
    await getPokemonList(path);
    expect(get).toHaveBeenCalledWith(path);
  });
});

describe("getAllPokemons", () => {
  it("THEN: delegates to get with the all-pokemon path and a custom TTL", async () => {
    const raw = {
      results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }],
      next: null,
      previous: null,
    };
    vi.mocked(get).mockResolvedValue(raw);
    const result = await getAllPokemons();
    expect(get).toHaveBeenCalledWith(
      "/pokemon?limit=10000&offset=0",
      expect.objectContaining({ ttlMs: expect.any(Number) }),
    );
    expect(result).toEqual(raw.results);
  });
});

describe("invalidateAllPokemonsCache", () => {
  it("THEN: calls invalidateGet with the all-pokemon path", () => {
    invalidateAllPokemonsCache();
    expect(invalidateGet).toHaveBeenCalledWith("/pokemon?limit=10000&offset=0");
  });
});
