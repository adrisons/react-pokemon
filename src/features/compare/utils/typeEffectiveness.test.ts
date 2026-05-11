import { describe, it, expect } from "vitest";
import type { PokemonTypeName } from "@core/domain/pokemon";
import {
  getOffensiveMultiplier,
  getVulnerability,
  countImmunities,
} from "./typeEffectiveness";

describe("getOffensiveMultiplier", () => {
  it("returns 1 for neutral matchups", () => {
    expect(getOffensiveMultiplier(["normal"], ["fire"])).toBe(1);
  });

  it("returns 2 for super-effective single-type matchups", () => {
    expect(getOffensiveMultiplier(["fire"], ["grass"])).toBe(2);
    expect(getOffensiveMultiplier(["water"], ["fire"])).toBe(2);
    expect(getOffensiveMultiplier(["electric"], ["water"])).toBe(2);
  });

  it("returns 0.5 for not-very-effective single-type matchups", () => {
    expect(getOffensiveMultiplier(["fire"], ["water"])).toBe(0.5);
    expect(getOffensiveMultiplier(["grass"], ["fire"])).toBe(0.5);
  });

  it("returns 0 for immune matchups", () => {
    expect(getOffensiveMultiplier(["normal"], ["ghost"])).toBe(0);
    expect(getOffensiveMultiplier(["electric"], ["ground"])).toBe(0);
    expect(getOffensiveMultiplier(["fighting"], ["ghost"])).toBe(0);
    expect(getOffensiveMultiplier(["ground"], ["flying"])).toBe(0);
    expect(getOffensiveMultiplier(["psychic"], ["dark"])).toBe(0);
    expect(getOffensiveMultiplier(["ghost"], ["normal"])).toBe(0);
    expect(getOffensiveMultiplier(["dragon"], ["fairy"])).toBe(0);
    expect(getOffensiveMultiplier(["poison"], ["steel"])).toBe(0);
  });

  it("stacks multipliers against dual-type defenders", () => {
    // fire vs grass/ice → 2 * 2 = 4
    expect(getOffensiveMultiplier(["fire"], ["grass", "ice"])).toBe(4);
    // ground vs fire/steel → 2 * 2 = 4
    expect(getOffensiveMultiplier(["ground"], ["fire", "steel"])).toBe(4);
  });

  it("returns 0 if any defender type grants immunity, even with other super-effective types", () => {
    // electric vs water/ground → 2 * 0 = 0
    expect(getOffensiveMultiplier(["electric"], ["water", "ground"])).toBe(0);
    // normal vs ghost/rock → 0 * 0.5 = 0
    expect(getOffensiveMultiplier(["normal"], ["ghost", "rock"])).toBe(0);
  });

  it("picks the best multiplier among multiple attacker types", () => {
    // fire/flying vs grass → fire=2, flying=2 → best=2
    expect(getOffensiveMultiplier(["fire", "flying"], ["grass"])).toBe(2);
    // normal/fighting vs ghost → normal=0, fighting=0 → best=0
    expect(getOffensiveMultiplier(["normal", "fighting"], ["ghost"])).toBe(0);
    // normal/fighting vs steel → normal=0.5, fighting=2 → best=2
    expect(getOffensiveMultiplier(["normal", "fighting"], ["steel"])).toBe(2);
  });

  it("handles dual-type attacker against dual-type defender", () => {
    // fire/ground vs grass/ice → fire=4, ground=2 → best=4
    expect(
      getOffensiveMultiplier(["fire", "ground"], ["grass", "ice"])
    ).toBe(4);
    // water/ice vs ground/dragon → water=2*0.5=1, ice=2*2=4 → best=4
    expect(
      getOffensiveMultiplier(["water", "ice"], ["ground", "dragon"])
    ).toBe(4);
  });

  it("handles double not-very-effective against dual types", () => {
    // fire vs water/dragon → 0.5 * 0.5 = 0.25
    expect(getOffensiveMultiplier(["fire"], ["water", "dragon"])).toBe(0.25);
  });

  it("handles mixed effectiveness against dual types (super + resist = neutral)", () => {
    // fire vs grass/water → 2 * 0.5 = 1
    expect(getOffensiveMultiplier(["fire"], ["grass", "water"])).toBe(1);
  });

  it("returns 0 when attacker types array is empty", () => {
    expect(getOffensiveMultiplier([], ["fire"])).toBe(0);
  });

  it("returns 1 when defender types array is empty (no types to resist)", () => {
    expect(getOffensiveMultiplier(["fire"], [])).toBe(1);
  });
});

describe("getVulnerability", () => {
  it("delegates to getOffensiveMultiplier with swapped args", () => {
    expect(getVulnerability(["grass"], ["fire"])).toBe(2);
    expect(getVulnerability(["fire"], ["water"])).toBe(2);
    expect(getVulnerability(["ghost"], ["normal"])).toBe(0);
  });

  it("handles dual-type defender vulnerability", () => {
    // grass/ice defending against fire → 4×
    expect(getVulnerability(["grass", "ice"], ["fire"])).toBe(4);
  });
});

describe("countImmunities", () => {
  it("returns 0 for types with no immunities", () => {
    expect(countImmunities(["fire"])).toBe(0);
    expect(countImmunities(["water"])).toBe(0);
    expect(countImmunities(["ice"])).toBe(0);
  });

  it("returns 1 for ghost (immune to normal and fighting)", () => {
    expect(countImmunities(["ghost"])).toBe(2);
  });

  it("returns 1 for normal (immune to ghost)", () => {
    expect(countImmunities(["normal"])).toBe(1);
  });

  it("returns 2 for ground (immune to electric and flying)", () => {
    expect(countImmunities(["ground"])).toBe(2);
  });

  it("returns 1 for flying (immune to ground)", () => {
    expect(countImmunities(["flying"])).toBe(1);
  });

  it("returns 1 for fairy (immune to dragon)", () => {
    expect(countImmunities(["fairy"])).toBe(1);
  });

  it("returns 1 for dark (immune to psychic)", () => {
    expect(countImmunities(["dark"])).toBe(1);
  });

  it("returns 1 for steel (immune to poison)", () => {
    expect(countImmunities(["steel"])).toBe(1);
  });

  it("accumulates immunities for dual types", () => {
    // normal/ghost → immune to normal, fighting, ghost = 3
    expect(countImmunities(["normal", "ghost"])).toBe(3);
    // ghost/dark → immune to normal, fighting, psychic = 3
    expect(countImmunities(["ghost", "dark"])).toBe(3);
  });

  it("returns correct count for dual types that share no immunities", () => {
    // ground/fairy → immune to electric, flying, dragon = 3
    expect(countImmunities(["ground", "fairy"])).toBe(3);
    // flying/dark → immune to ground, psychic = 2
    expect(countImmunities(["flying", "dark"])).toBe(2);
  });

  it("returns 0 for dual types with no immunities", () => {
    expect(countImmunities(["fire", "water"])).toBe(0);
  });
});
