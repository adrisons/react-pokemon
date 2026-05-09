import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

vi.mock("@features/pokemon-detail/api/evolutionApi", () => ({
  getPokemonSpecies: vi.fn(),
  getEvolutionChain: vi.fn(),
}));

vi.mock("@features/pokemon-detail/api/pokemonDetailApi", () => ({
  getPokemonDetail: vi.fn(),
}));

vi.mock("@features/pokemon-list/store", () => {
  const allPokemons = [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
  ];
  const store = {
    getState: () => ({
      allPokemons,
      loadAllPokemons: async () => allPokemons,
    }),
  };
  return { usePokemonListStore: store };
});

import { useEvolutionChain } from "./useEvolutionChain";
import { getPokemonSpecies, getEvolutionChain } from "@features/pokemon-detail/api/evolutionApi";
import { getPokemonDetail } from "@features/pokemon-detail/api/pokemonDetailApi";

const rawSpecies = {
  evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/1/" },
};

const rawChain = {
  chain: {
    species: { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
    evolution_details: [],
    evolves_to: [
      {
        species: { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon-species/2/" },
        evolution_details: [{ min_level: 16, item: null, trigger: { name: "level-up" } }],
        evolves_to: [],
      },
    ],
  },
};

const makeRawDetail = (id: number, imageUrl: string) => ({
  id,
  sprites: {
    front_default: imageUrl,
    other: { dream_world: { front_default: null } },
  },
});

beforeEach(() => {
  vi.mocked(getPokemonSpecies).mockResolvedValue(rawSpecies);
  vi.mocked(getEvolutionChain).mockResolvedValue(rawChain);
  vi.mocked(getPokemonDetail)
    .mockResolvedValueOnce(makeRawDetail(1, "bulbasaur.png") as never)
    .mockResolvedValueOnce(makeRawDetail(2, "ivysaur.png") as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("GIVEN: useEvolutionChain", () => {
  describe("WHEN: id is provided", () => {
    it("THEN: should start with empty stages and loading=true", () => {
      const { result } = renderHook(() => useEvolutionChain("1"));
      expect(result.current.loading).toBe(true);
      expect(result.current.stages).toEqual([]);
    });

    it("THEN: should return adapted stages with images after fetch", async () => {
      const { result } = renderHook(() => useEvolutionChain("1"));
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.stages).toHaveLength(2);
      expect(result.current.stages[0].name).toBe("bulbasaur");
      expect(result.current.stages[0].imageUrl).toBe("bulbasaur.png");
      expect(result.current.stages[1].name).toBe("ivysaur");
      expect(result.current.stages[1].trigger).toBe("Lv. 16");
    });

    it("THEN: should call getPokemonSpecies with the given id", async () => {
      renderHook(() => useEvolutionChain("42"));
      await waitFor(() => expect(getPokemonSpecies).toHaveBeenCalledWith("42"));
    });

    it("THEN: should call getEvolutionChain with the url from species", async () => {
      renderHook(() => useEvolutionChain("1"));
      await waitFor(() =>
        expect(getEvolutionChain).toHaveBeenCalledWith(rawSpecies.evolution_chain.url)
      );
    });

    it("THEN: should call getPokemonDetail for each stage", async () => {
      const { result } = renderHook(() => useEvolutionChain("1"));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(getPokemonDetail).toHaveBeenCalledTimes(2);
    });
  });

  describe("WHEN: id is undefined", () => {
    it("THEN: should not fetch and keep loading=true with empty stages", () => {
      const { result } = renderHook(() => useEvolutionChain(undefined));
      expect(result.current.loading).toBe(true);
      expect(result.current.stages).toEqual([]);
      expect(getPokemonSpecies).not.toHaveBeenCalled();
    });
  });
});
