import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@core/api", () => ({ get: vi.fn() }));

import { getPokemonSpecies, getEvolutionChain } from "./evolutionApi";
import { get } from "@core/api";

afterEach(() => vi.clearAllMocks());

describe("getPokemonSpecies", () => {
  it("THEN: calls get with the correct path for a numeric id", async () => {
    vi.mocked(get).mockResolvedValue({ id: 1 });
    await getPokemonSpecies(1);
    expect(get).toHaveBeenCalledWith("/pokemon-species/1");
  });

  it("THEN: calls get with the correct path for a string id", async () => {
    vi.mocked(get).mockResolvedValue({ id: 1 });
    await getPokemonSpecies("bulbasaur");
    expect(get).toHaveBeenCalledWith("/pokemon-species/bulbasaur");
  });

  it("THEN: returns the raw species data", async () => {
    const raw = { id: 1, evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/1/" } };
    vi.mocked(get).mockResolvedValue(raw);
    const result = await getPokemonSpecies(1);
    expect(result).toEqual(raw);
  });
});

describe("getEvolutionChain", () => {
  it("THEN: calls get with the provided URL", async () => {
    const url = "https://pokeapi.co/api/v2/evolution-chain/1/";
    vi.mocked(get).mockResolvedValue({ id: 1 });
    await getEvolutionChain(url);
    expect(get).toHaveBeenCalledWith(url);
  });

  it("THEN: returns the raw evolution chain data", async () => {
    const raw = { id: 1, chain: { species: { name: "bulbasaur" }, evolves_to: [] } };
    vi.mocked(get).mockResolvedValue(raw);
    const url = "https://pokeapi.co/api/v2/evolution-chain/1/";
    const result = await getEvolutionChain(url);
    expect(result).toEqual(raw);
  });
});
