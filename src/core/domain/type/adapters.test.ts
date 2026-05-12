import { describe, it, expect } from "vitest";
import type { RawTypeDetail } from "./api.types";
import { adaptTypeDetailsToEffectivenessMap } from "./adapters";

function makeRawType(
  name: string,
  relations: {
    double_damage_to?: string[];
    half_damage_to?: string[];
    no_damage_to?: string[];
  },
): RawTypeDetail {
  return {
    id: 1,
    name,
    damage_relations: {
      double_damage_from: [],
      double_damage_to: (relations.double_damage_to ?? []).map((n) => ({ name: n, url: "" })),
      half_damage_from: [],
      half_damage_to: (relations.half_damage_to ?? []).map((n) => ({ name: n, url: "" })),
      no_damage_from: [],
      no_damage_to: (relations.no_damage_to ?? []).map((n) => ({ name: n, url: "" })),
    },
  };
}

describe("adaptTypeDetailsToEffectivenessMap", () => {
  it("maps double_damage_to as 2", () => {
    const map = adaptTypeDetailsToEffectivenessMap([
      makeRawType("fire", { double_damage_to: ["grass", "ice"] }),
    ]);
    expect(map.fire.grass).toBe(2);
    expect(map.fire.ice).toBe(2);
  });

  it("maps half_damage_to as 0.5", () => {
    const map = adaptTypeDetailsToEffectivenessMap([
      makeRawType("fire", { half_damage_to: ["water", "rock"] }),
    ]);
    expect(map.fire.water).toBe(0.5);
    expect(map.fire.rock).toBe(0.5);
  });

  it("maps no_damage_to as 0", () => {
    const map = adaptTypeDetailsToEffectivenessMap([
      makeRawType("normal", { no_damage_to: ["ghost"] }),
    ]);
    expect(map.normal.ghost).toBe(0);
  });

  it("combines multiple type entries into a single map", () => {
    const map = adaptTypeDetailsToEffectivenessMap([
      makeRawType("fire", { double_damage_to: ["grass"] }),
      makeRawType("water", { double_damage_to: ["fire"] }),
    ]);
    expect(map.fire.grass).toBe(2);
    expect(map.water.fire).toBe(2);
  });

  it("returns empty relations for types with no special matchups", () => {
    const map = adaptTypeDetailsToEffectivenessMap([makeRawType("normal", {})]);
    expect(map.normal).toEqual({});
  });
});
