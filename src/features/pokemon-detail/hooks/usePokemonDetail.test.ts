import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

vi.mock("@features/pokemon-detail/api/pokemonDetailApi", () => ({
  getPokemonDetail: vi.fn(),
  getPokemonSpecies: vi.fn(),
}));
vi.mock("@features/pokemon-detail/api/abilityApi", () => ({
  getAbilityDescription: vi.fn(),
}));
const mockAddEntry = vi.fn();
vi.mock("@features/history/store/historyStore", () => ({
  useHistoryStore: vi.fn((selector: (s: { addEntry: () => void }) => unknown) =>
    selector({ addEntry: mockAddEntry })
  ),
}));

import { usePokemonDetail } from "./usePokemonDetail";
import { getPokemonDetail, getPokemonSpecies } from "@features/pokemon-detail/api/pokemonDetailApi";
import { getAbilityDescription } from "@features/pokemon-detail/api/abilityApi";

const rawBulbasaur = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  sprites: {
    front_default: "front.png",
    other: { dream_world: { front_default: "dream.png" } },
  },
  types: [{ slot: 1, type: { name: "grass" } }],
  moves: [{}, {}],
  stats: [{ base_stat: 45, stat: { name: "hp" } }],
  abilities: [
    { ability: { name: "overgrow", url: "" }, is_hidden: false, slot: 1 },
  ],
};

beforeEach(() => {
  vi.mocked(getPokemonDetail).mockResolvedValue(rawBulbasaur);
  vi.mocked(getPokemonSpecies).mockResolvedValue({
    capture_rate: 45,
    is_legendary: false,
    is_mythical: false,
    is_baby: false,
  });
  vi.mocked(getAbilityDescription).mockResolvedValue("Powers up Grass-type moves.");
  mockAddEntry.mockClear();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("GIVEN: usePokemonDetail", () => {
  describe("WHEN: id is provided", () => {
    it("THEN: should start loading", () => {
      const { result } = renderHook(() => usePokemonDetail("1"));
      expect(result.current.loading).toBe(true);
      expect(result.current.pokemon).toBeNull();
    });

    it("THEN: should return adapted pokemon after fetch", async () => {
      const { result } = renderHook(() => usePokemonDetail("1"));
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.pokemon).not.toBeNull();
      expect(result.current.pokemon?.id).toBe(1);
      expect(result.current.pokemon?.name).toBe("bulbasaur");
      expect(result.current.pokemon?.movesCount).toBe(2);
      expect(result.current.pokemon?.imageUrl).toBe("dream.png");
    });

    it("THEN: should call getPokemonDetail with the given id", async () => {
      renderHook(() => usePokemonDetail("25"));
      await waitFor(() => expect(getPokemonDetail).toHaveBeenCalledWith("25"));
    });

    it("THEN: should resolve ability descriptions", async () => {
      const { result } = renderHook(() => usePokemonDetail("1"));
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(getAbilityDescription).toHaveBeenCalledWith("overgrow");
      expect(result.current.pokemon?.abilities[0]).toEqual({
        name: "overgrow",
        isHidden: false,
        description: "Powers up Grass-type moves.",
      });
    });

    it("THEN: should map types from raw data", async () => {
      const { result } = renderHook(() => usePokemonDetail("1"));
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.pokemon?.types).toEqual([{ slot: 1, typeName: "grass" }]);
    });

    it("THEN: should call addEntry with the adapted pokemon", async () => {
      const { result } = renderHook(() => usePokemonDetail("1", { trackHistory: true }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(mockAddEntry).toHaveBeenCalledOnce();
      expect(mockAddEntry).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, name: "bulbasaur" })
      );
    });
  });

  describe("WHEN: id is undefined", () => {
    it("THEN: should not fetch and remain loading=true with null pokemon", () => {
      const { result } = renderHook(() => usePokemonDetail(undefined));
      expect(result.current.loading).toBe(true);
      expect(result.current.pokemon).toBeNull();
      expect(getPokemonDetail).not.toHaveBeenCalled();
    });
  });

  describe("WHEN: id changes", () => {
    it("THEN: should fetch again with the new id", async () => {
      const { result, rerender } = renderHook(
        ({ id }: { id: string }) => usePokemonDetail(id),
        { initialProps: { id: "1" } }
      );
      await waitFor(() => expect(result.current.loading).toBe(false));

      vi.mocked(getPokemonDetail).mockResolvedValue({ ...rawBulbasaur, id: 4, name: "charmander" });
      rerender({ id: "4" });

      await waitFor(() => expect(getPokemonDetail).toHaveBeenCalledWith("4"));
      await waitFor(() => expect(result.current.pokemon?.name).toBe("charmander"));
    });
  });
});
