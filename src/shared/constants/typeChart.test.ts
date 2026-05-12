import { describe, it, expect } from "vitest";
import { getDefensiveMatchups, getWeaknesses } from "./typeChart";

describe("getDefensiveMatchups", () => {
  it("returns 18 entries (one per attacking type)", () => {
    const matchups = getDefensiveMatchups(["normal"]);
    expect(matchups).toHaveLength(18);
  });

  it("returns 1× for a type with no special interaction", () => {
    const matchups = getDefensiveMatchups(["normal"]);
    const water = matchups.find((m) => m.type === "water");
    expect(water?.multiplier).toBe(1);
  });

  it("returns 2× for fighting vs normal", () => {
    const matchups = getDefensiveMatchups(["normal"]);
    const fighting = matchups.find((m) => m.type === "fighting");
    expect(fighting?.multiplier).toBe(2);
  });

  it("returns 0× for ghost immunity on normal", () => {
    const matchups = getDefensiveMatchups(["normal"]);
    const ghost = matchups.find((m) => m.type === "ghost");
    expect(ghost?.multiplier).toBe(0);
  });

  it("compounds multipliers for dual types", () => {
    const matchups = getDefensiveMatchups(["grass", "ice"]);
    const fire = matchups.find((m) => m.type === "fire");
    expect(fire?.multiplier).toBe(4);
  });

  it("handles single type correctly", () => {
    const matchups = getDefensiveMatchups(["fire"]);
    const water = matchups.find((m) => m.type === "water");
    expect(water?.multiplier).toBe(2);
  });
});

describe("getWeaknesses", () => {
  it("returns only types with ≥2× multiplier", () => {
    const weaknesses = getWeaknesses(["fire"]);
    expect(weaknesses.every((w) => w.multiplier >= 2)).toBe(true);
  });

  it("sorts by multiplier descending", () => {
    const weaknesses = getWeaknesses(["grass", "ice"]);
    for (let i = 1; i < weaknesses.length; i++) {
      expect(weaknesses[i - 1].multiplier).toBeGreaterThanOrEqual(weaknesses[i].multiplier);
    }
  });

  it("includes 4× weakness for dual types", () => {
    const weaknesses = getWeaknesses(["grass", "ice"]);
    const fire = weaknesses.find((w) => w.type === "fire");
    expect(fire?.multiplier).toBe(4);
  });

  it("returns empty array for a type with no weaknesses above 2×", () => {
    const weaknesses = getWeaknesses(["normal"]);
    expect(weaknesses.every((w) => w.multiplier >= 2)).toBe(true);
  });
});
