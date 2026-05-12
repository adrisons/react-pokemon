import { describe, it, expect } from "vitest";
import typeColors from "./typeColors";

describe("typeColors", () => {
  it("exports a color for all 18 Pokémon types", () => {
    const expectedTypes = [
      "bug", "dark", "dragon", "electric", "fairy", "fighting",
      "fire", "flying", "ghost", "grass", "ground", "ice",
      "normal", "poison", "psychic", "rock", "steel", "water",
    ] as const;

    for (const t of expectedTypes) {
      expect(typeColors[t]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("has exactly 18 entries", () => {
    expect(Object.keys(typeColors)).toHaveLength(18);
  });
});
