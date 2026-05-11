import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@core/api", () => ({ get: vi.fn() }));

import { getPokemonDetail, getPokemonSpecies } from "./pokemonDetailApi";
import { get } from "@core/api";

afterEach(() => vi.clearAllMocks());

describe("getPokemonDetail", () => {
  it("THEN: calls get with the correct path for a numeric id", async () => {
    vi.mocked(get).mockResolvedValue({ id: 1, name: "bulbasaur" });
    await getPokemonDetail(1);
    expect(get).toHaveBeenCalledWith("/pokemon/1");
  });

  it("THEN: calls get with the correct path for a string id", async () => {
    vi.mocked(get).mockResolvedValue({ id: 4, name: "charmander" });
    await getPokemonDetail("charmander");
    expect(get).toHaveBeenCalledWith("/pokemon/charmander");
  });

  it("THEN: returns the raw pokemon data from the API", async () => {
    const raw = { id: 25, name: "pikachu" };
    vi.mocked(get).mockResolvedValue(raw);
    const result = await getPokemonDetail(25);
    expect(result).toEqual(raw);
  });
});

describe("getPokemonSpecies", () => {
  it("THEN: calls get with the correct path for a numeric id", async () => {
    vi.mocked(get).mockResolvedValue({ capture_rate: 45 });
    await getPokemonSpecies(1);
    expect(get).toHaveBeenCalledWith("/pokemon-species/1");
  });

  it("THEN: calls get with the correct path for a string id", async () => {
    vi.mocked(get).mockResolvedValue({ capture_rate: 45 });
    await getPokemonSpecies("bulbasaur");
    expect(get).toHaveBeenCalledWith("/pokemon-species/bulbasaur");
  });

  it("THEN: returns the raw species data from the API", async () => {
    const raw = {
      capture_rate: 45,
      is_legendary: false,
      is_mythical: false,
      is_baby: false,
    };
    vi.mocked(get).mockResolvedValue(raw);
    const result = await getPokemonSpecies(1);
    expect(result).toEqual(raw);
  });

  it("THEN: returns legendary species data correctly", async () => {
    const raw = {
      capture_rate: 3,
      is_legendary: true,
      is_mythical: false,
      is_baby: false,
    };
    vi.mocked(get).mockResolvedValue(raw);
    const result = await getPokemonSpecies(150);
    expect(result).toEqual(raw);
  });
});
