import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@core/api", () => ({ get: vi.fn() }));
vi.mock("@core/api/httpCache", () => ({
  cachedFetch: vi.fn(),
  invalidateHttpCacheKey: vi.fn(),
}));

import { getPokemonList, getAllPokemons, invalidateAllPokemonsCache, ALL_POKEMON_URL } from "./pokemonListApi";
import { get } from "@core/api";
import { cachedFetch, invalidateHttpCacheKey } from "@core/api/httpCache";

afterEach(() => vi.clearAllMocks());

describe("getPokemonList", () => {
  it("THEN: calls get with the provided URL", async () => {
    const url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20";
    vi.mocked(get).mockResolvedValue({ results: [], next: null, previous: null });
    await getPokemonList(url);
    expect(get).toHaveBeenCalledWith(url);
  });

  it("THEN: returns the raw list response", async () => {
    const raw = {
      results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }],
      next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
      previous: null,
    };
    vi.mocked(get).mockResolvedValue(raw);
    const result = await getPokemonList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20");
    expect(result).toEqual(raw);
  });

  it("THEN: passes different URLs correctly", async () => {
    const url = "https://pokeapi.co/api/v2/pokemon?offset=40&limit=20";
    vi.mocked(get).mockResolvedValue({ results: [], next: null, previous: null });
    await getPokemonList(url);
    expect(get).toHaveBeenCalledWith(url);
  });
});

describe("getAllPokemons", () => {
  it("THEN: delegates to cachedFetch with ALL_POKEMON_URL", async () => {
    const pokemons = [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }];
    vi.mocked(cachedFetch).mockResolvedValue(pokemons);
    const result = await getAllPokemons();
    expect(cachedFetch).toHaveBeenCalledWith(ALL_POKEMON_URL, expect.any(Function), expect.objectContaining({ ttlMs: expect.any(Number) }));
    expect(result).toEqual(pokemons);
  });
});

describe("invalidateAllPokemonsCache", () => {
  it("THEN: calls invalidateHttpCacheKey with ALL_POKEMON_URL", () => {
    invalidateAllPokemonsCache();
    expect(invalidateHttpCacheKey).toHaveBeenCalledWith(ALL_POKEMON_URL);
  });
});
