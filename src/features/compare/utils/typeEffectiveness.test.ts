import { describe, it, expect } from "vitest";
import type { PokemonTypeName } from "@core/domain/pokemon";
import type { EffectivenessMap } from "@core/domain/type";
import {
  getOffensiveMultiplier,
  getVulnerability,
  countImmunities,
} from "./typeEffectiveness";

const MAP: EffectivenessMap = {
  normal:   { rock: 0.5, steel: 0.5, ghost: 0 },
  fire:     { fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5, grass: 2, ice: 2, bug: 2, steel: 2 },
  water:    { water: 0.5, grass: 0.5, dragon: 0.5, fire: 2, ground: 2, rock: 2 },
  electric: { electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0, water: 2, flying: 2 },
  grass:    { fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5, water: 2, ground: 2, rock: 2 },
  ice:      { water: 0.5, ice: 0.5, steel: 0.5, fire: 0.5, grass: 2, ground: 2, flying: 2, dragon: 2 },
  fighting: { poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0, normal: 2, ice: 2, rock: 2, dark: 2, steel: 2 },
  poison:   { poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, grass: 2, fairy: 2 },
  ground:   { grass: 0.5, bug: 0.5, flying: 0, fire: 2, electric: 2, poison: 2, rock: 2, steel: 2 },
  flying:   { electric: 0.5, rock: 0.5, steel: 0.5, ground: 0, grass: 2, fighting: 2, bug: 2 },
  psychic:  { psychic: 0.5, steel: 0.5, dark: 0, fighting: 2, poison: 2 },
  bug:      { fire: 0.5, fighting: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5, grass: 2, psychic: 2, dark: 2 },
  rock:     { fighting: 0.5, ground: 0.5, steel: 0.5, fire: 2, ice: 2, flying: 2, bug: 2 },
  ghost:    { normal: 0, dark: 0.5, ghost: 2, psychic: 2 },
  dragon:   { steel: 0.5, fairy: 0, dragon: 2 },
  dark:     { fighting: 0.5, dark: 0.5, fairy: 0.5, ghost: 2, psychic: 2 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5, ice: 2, rock: 2, fairy: 2 },
  fairy:    { fire: 0.5, poison: 0.5, steel: 0.5, fighting: 2, dragon: 2, dark: 2 },
};

describe("getOffensiveMultiplier", () => {
  it("returns 1 for neutral matchups", () => {
    expect(getOffensiveMultiplier(MAP, ["normal"], ["fire"])).toBe(1);
  });

  it("returns 2 for super-effective single-type matchups", () => {
    expect(getOffensiveMultiplier(MAP, ["fire"], ["grass"])).toBe(2);
    expect(getOffensiveMultiplier(MAP, ["water"], ["fire"])).toBe(2);
    expect(getOffensiveMultiplier(MAP, ["electric"], ["water"])).toBe(2);
  });

  it("returns 0.5 for not-very-effective single-type matchups", () => {
    expect(getOffensiveMultiplier(MAP, ["fire"], ["water"])).toBe(0.5);
    expect(getOffensiveMultiplier(MAP, ["grass"], ["fire"])).toBe(0.5);
  });

  it("returns 0 for immune matchups", () => {
    expect(getOffensiveMultiplier(MAP, ["normal"], ["ghost"])).toBe(0);
    expect(getOffensiveMultiplier(MAP, ["electric"], ["ground"])).toBe(0);
    expect(getOffensiveMultiplier(MAP, ["fighting"], ["ghost"])).toBe(0);
    expect(getOffensiveMultiplier(MAP, ["ground"], ["flying"])).toBe(0);
    expect(getOffensiveMultiplier(MAP, ["psychic"], ["dark"])).toBe(0);
    expect(getOffensiveMultiplier(MAP, ["ghost"], ["normal"])).toBe(0);
    expect(getOffensiveMultiplier(MAP, ["dragon"], ["fairy"])).toBe(0);
    expect(getOffensiveMultiplier(MAP, ["poison"], ["steel"])).toBe(0);
  });

  it("stacks multipliers against dual-type defenders", () => {
    expect(getOffensiveMultiplier(MAP, ["fire"], ["grass", "ice"])).toBe(4);
    expect(getOffensiveMultiplier(MAP, ["ground"], ["fire", "steel"])).toBe(4);
  });

  it("returns 0 if any defender type grants immunity, even with other super-effective types", () => {
    expect(getOffensiveMultiplier(MAP, ["electric"], ["water", "ground"])).toBe(0);
    expect(getOffensiveMultiplier(MAP, ["normal"], ["ghost", "rock"])).toBe(0);
  });

  it("picks the best multiplier among multiple attacker types", () => {
    expect(getOffensiveMultiplier(MAP, ["fire", "flying"], ["grass"])).toBe(2);
    expect(getOffensiveMultiplier(MAP, ["normal", "fighting"], ["ghost"])).toBe(0);
    expect(getOffensiveMultiplier(MAP, ["normal", "fighting"], ["steel"])).toBe(2);
  });

  it("handles dual-type attacker against dual-type defender", () => {
    expect(
      getOffensiveMultiplier(MAP, ["fire", "ground"], ["grass", "ice"]),
    ).toBe(4);
    expect(
      getOffensiveMultiplier(MAP, ["water", "ice"], ["ground", "dragon"]),
    ).toBe(4);
  });

  it("handles double not-very-effective against dual types", () => {
    expect(getOffensiveMultiplier(MAP, ["fire"], ["water", "dragon"])).toBe(0.25);
  });

  it("handles mixed effectiveness against dual types (super + resist = neutral)", () => {
    expect(getOffensiveMultiplier(MAP, ["fire"], ["grass", "water"])).toBe(1);
  });

  it("returns 0 when attacker types array is empty", () => {
    expect(getOffensiveMultiplier(MAP, [], ["fire"])).toBe(0);
  });

  it("returns 1 when defender types array is empty (no types to resist)", () => {
    expect(getOffensiveMultiplier(MAP, ["fire"], [])).toBe(1);
  });
});

describe("getVulnerability", () => {
  it("delegates to getOffensiveMultiplier with swapped args", () => {
    expect(getVulnerability(MAP, ["grass"], ["fire"])).toBe(2);
    expect(getVulnerability(MAP, ["fire"], ["water"])).toBe(2);
    expect(getVulnerability(MAP, ["ghost"], ["normal"])).toBe(0);
  });

  it("handles dual-type defender vulnerability", () => {
    expect(getVulnerability(MAP, ["grass", "ice"], ["fire"])).toBe(4);
  });
});

describe("countImmunities", () => {
  it("returns 0 for types with no immunities", () => {
    expect(countImmunities(MAP, ["fire"])).toBe(0);
    expect(countImmunities(MAP, ["water"])).toBe(0);
    expect(countImmunities(MAP, ["ice"])).toBe(0);
  });

  it("returns 1 for ghost (immune to normal and fighting)", () => {
    expect(countImmunities(MAP, ["ghost"])).toBe(2);
  });

  it("returns 1 for normal (immune to ghost)", () => {
    expect(countImmunities(MAP, ["normal"])).toBe(1);
  });

  it("returns 2 for ground (immune to electric and flying)", () => {
    expect(countImmunities(MAP, ["ground"])).toBe(2);
  });

  it("returns 1 for flying (immune to ground)", () => {
    expect(countImmunities(MAP, ["flying"])).toBe(1);
  });

  it("returns 1 for fairy (immune to dragon)", () => {
    expect(countImmunities(MAP, ["fairy"])).toBe(1);
  });

  it("returns 1 for dark (immune to psychic)", () => {
    expect(countImmunities(MAP, ["dark"])).toBe(1);
  });

  it("returns 1 for steel (immune to poison)", () => {
    expect(countImmunities(MAP, ["steel"])).toBe(1);
  });

  it("accumulates immunities for dual types", () => {
    expect(countImmunities(MAP, ["normal", "ghost"])).toBe(3);
    expect(countImmunities(MAP, ["ghost", "dark"])).toBe(3);
  });

  it("returns correct count for dual types that share no immunities", () => {
    expect(countImmunities(MAP, ["ground", "fairy"])).toBe(3);
    expect(countImmunities(MAP, ["flying", "dark"])).toBe(2);
  });

  it("returns 0 for dual types with no immunities", () => {
    expect(countImmunities(MAP, ["fire", "water"])).toBe(0);
  });
});
