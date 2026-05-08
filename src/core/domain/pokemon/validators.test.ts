import { describe, it, expect } from "vitest";
import { isValidPokemon } from "./validators";

describe("GIVEN: isValidPokemon", () => {
  const validRaw = {
    id: 1,
    name: "bulbasaur",
    types: [],
    moves: [],
    sprites: { front_default: null, other: { dream_world: { front_default: null } } },
    stats: [],
    abilities: [],
  };

  describe("WHEN: value is a valid pokemon object", () => {
    it("THEN: returns true", () => {
      expect(isValidPokemon(validRaw)).toBe(true);
    });
  });

  describe("WHEN: value is null or undefined", () => {
    it("THEN: returns false for null", () => {
      expect(isValidPokemon(null)).toBe(false);
    });

    it("THEN: returns false for undefined", () => {
      expect(isValidPokemon(undefined)).toBe(false);
    });
  });

  describe("WHEN: value is not an object", () => {
    it("THEN: returns false for a string", () => {
      expect(isValidPokemon("bulbasaur")).toBe(false);
    });

    it("THEN: returns false for a number", () => {
      expect(isValidPokemon(42)).toBe(false);
    });
  });

  describe("WHEN: required fields are missing or wrong type", () => {
    it("THEN: returns false when id is a string", () => {
      expect(isValidPokemon({ ...validRaw, id: "1" })).toBe(false);
    });

    it("THEN: returns false when name is a number", () => {
      expect(isValidPokemon({ ...validRaw, name: 1 })).toBe(false);
    });

    it("THEN: returns false when types is not an array", () => {
      expect(isValidPokemon({ ...validRaw, types: "grass" })).toBe(false);
    });

    it("THEN: returns false when moves is not an array", () => {
      expect(isValidPokemon({ ...validRaw, moves: null })).toBe(false);
    });

    it("THEN: returns false when id field is missing", () => {
      const { id: _, ...withoutId } = validRaw;
      expect(isValidPokemon(withoutId)).toBe(false);
    });

    it("THEN: returns false when name field is missing", () => {
      const { name: _, ...withoutName } = validRaw;
      expect(isValidPokemon(withoutName)).toBe(false);
    });
  });
});
