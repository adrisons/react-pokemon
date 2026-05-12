import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@features/pokemon-detail/api/pokemonDetailApi", () => ({
  getPokemonDetail: vi.fn(),
  getPokemonSpecies: vi.fn(),
}));

vi.mock("@core/domain/type", () => ({
  getEffectivenessMap: vi.fn(() => Promise.resolve({ fire: { grass: 2 } })),
}));

import { useCompare } from "./useCompare";
import { getPokemonDetail } from "@features/pokemon-detail/api/pokemonDetailApi";
import { getPokemonSpecies } from "@features/pokemon-detail/api/pokemonDetailApi";

const rawPikachu = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  sprites: { front_default: "pika.png", other: { dream_world: { front_default: null } } },
  types: [{ slot: 1, type: { name: "electric" } }],
  moves: [],
  stats: [
    { base_stat: 35, stat: { name: "hp" } },
    { base_stat: 55, stat: { name: "attack" } },
  ],
  abilities: [],
};

const rawCharizard = {
  id: 6,
  name: "charizard",
  height: 17,
  weight: 905,
  sprites: { front_default: "char.png", other: { dream_world: { front_default: null } } },
  types: [{ slot: 1, type: { name: "fire" } }],
  moves: [],
  stats: [
    { base_stat: 78, stat: { name: "hp" } },
    { base_stat: 84, stat: { name: "attack" } },
  ],
  abilities: [],
};

beforeEach(() => {
  vi.mocked(getPokemonDetail).mockImplementation((id) => {
    if (String(id) === "25") return Promise.resolve(rawPikachu);
    if (String(id) === "6") return Promise.resolve(rawCharizard);
    return Promise.reject(new Error("not found"));
  });
  vi.mocked(getPokemonSpecies).mockImplementation(() =>
    Promise.resolve({
      capture_rate: 190,
      is_legendary: false,
      is_mythical: false,
      is_baby: false,
    })
  );
});

describe("useCompare", () => {
  it("returns null for both when no ids are provided", () => {
    const { result } = renderHook(() => useCompare(null, null));
    expect(result.current.pokemonA).toBeNull();
    expect(result.current.pokemonB).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("fetches both pokémon in parallel", async () => {
    const { result } = renderHook(() => useCompare("25", "6"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(getPokemonDetail).toHaveBeenCalledWith("25");
    expect(getPokemonDetail).toHaveBeenCalledWith("6");
    expect(result.current.pokemonA?.name).toBe("pikachu");
    expect(result.current.pokemonB?.name).toBe("charizard");
  });

  it("fetches only pokémon A when only idA is provided", async () => {
    const { result } = renderHook(() => useCompare("25", null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.pokemonA?.name).toBe("pikachu");
    expect(result.current.pokemonB).toBeNull();
  });

  it("exposes stats from adapted pokémon", async () => {
    const { result } = renderHook(() => useCompare("25", "6"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.pokemonA?.stats[0].name).toBe("hp");
    expect(result.current.pokemonA?.stats[0].value).toBe(35);
    expect(result.current.pokemonB?.stats[0].value).toBe(78);
  });

  it("exposes the effectiveness map once loaded", async () => {
    const { result } = renderHook(() => useCompare("25", "6"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.effectivenessMap).toBeTruthy();
  });

  it("sets error on fetch failure", async () => {
    vi.mocked(getPokemonDetail).mockRejectedValue(new Error("network"));
    const { result } = renderHook(() => useCompare("999", "888"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(true);
  });
});
