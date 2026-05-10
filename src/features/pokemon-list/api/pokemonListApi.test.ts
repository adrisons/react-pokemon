import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@core/api", () => ({ get: vi.fn() }));

import { getPokemonList } from "./pokemonListApi";
import { get } from "@core/api";

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
