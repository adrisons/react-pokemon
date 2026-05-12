import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useHistory } from "./useHistory";
import { useHistoryStore } from "@features/history/store/historyStore";
import type { PokemonDetail } from "@core/domain/pokemon";

function makePokemon(id: number): PokemonDetail {
  return {
    id,
    name: `pokemon-${id}`,
    imageUrl: null,
    types: [{ slot: 1, typeName: "fire" }],
    movesCount: 10,
    stats: [],
    abilities: [],
    captureRate: 45,
    isLegendary: false,
    isMythical: false,
    isBaby: false,
    heightDm: 7,
    weightHg: 69,
  };
}

beforeEach(() => {
  useHistoryStore.setState({ entries: [] });
});

describe("GIVEN: useHistory hook", () => {
  describe("WHEN: rendered with an empty store", () => {
    it("THEN: entries is an empty array", () => {
      const { result } = renderHook(() => useHistory());
      expect(result.current.entries).toEqual([]);
    });

    it("THEN: addEntry and clear are functions", () => {
      const { result } = renderHook(() => useHistory());
      expect(typeof result.current.addEntry).toBe("function");
      expect(typeof result.current.clear).toBe("function");
    });
  });

  describe("WHEN: addEntry is called", () => {
    it("THEN: entries reflects the new entry", () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.addEntry(makePokemon(25));
      });

      expect(result.current.entries).toHaveLength(1);
      expect(result.current.entries[0]).toEqual(
        expect.objectContaining({ id: 25, name: "pokemon-25" })
      );
    });
  });

  describe("WHEN: clear is called after adding entries", () => {
    it("THEN: entries becomes empty", () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.addEntry(makePokemon(1));
        result.current.addEntry(makePokemon(2));
      });
      expect(result.current.entries).toHaveLength(2);

      act(() => {
        result.current.clear();
      });
      expect(result.current.entries).toEqual([]);
    });
  });
});
