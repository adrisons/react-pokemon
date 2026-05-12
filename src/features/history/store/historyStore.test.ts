import { describe, it, expect, beforeEach } from "vitest";
import { useHistoryStore } from "./historyStore";
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

describe("GIVEN: historyStore", () => {
  describe("WHEN: adding a new entry", () => {
    it("THEN: it appears at the start of the list", () => {
      useHistoryStore.getState().addEntry(makePokemon(1));
      const { entries } = useHistoryStore.getState();
      expect(entries[0].id).toBe(1);
      expect(entries).toHaveLength(1);
    });
  });

  describe("WHEN: re-visiting a Pokémon already in history", () => {
    it("THEN: it moves to the front and is not duplicated", () => {
      useHistoryStore.getState().addEntry(makePokemon(1));
      useHistoryStore.getState().addEntry(makePokemon(2));
      useHistoryStore.getState().addEntry(makePokemon(1));
      const { entries } = useHistoryStore.getState();
      expect(entries[0].id).toBe(1);
      expect(entries).toHaveLength(2);
    });
  });

  describe("WHEN: adding more than 10 entries", () => {
    it("THEN: only the 10 most recent are kept", () => {
      for (let i = 1; i <= 12; i++) {
        useHistoryStore.getState().addEntry(makePokemon(i));
      }
      const { entries } = useHistoryStore.getState();
      expect(entries).toHaveLength(10);
      expect(entries[0].id).toBe(12);
      expect(entries[9].id).toBe(3);
    });
  });

  describe("WHEN: clear is called", () => {
    it("THEN: the history is empty", () => {
      useHistoryStore.getState().addEntry(makePokemon(1));
      useHistoryStore.getState().clear();
      expect(useHistoryStore.getState().entries).toHaveLength(0);
    });
  });
});
