import { describe, it, expect } from "vitest";
import {
  getPokemonImageUrl,
  getPokemonIdFromUrl,
  adaptPokemonSummary,
  adaptPokemonDetail,
} from "./adapters";
import type { RawPokemonDetail, RawPokemonSummary } from "./api.types";
import type { PokemonAbility } from "./models";

const makeRawDetail = (overrides: Partial<RawPokemonDetail> = {}): RawPokemonDetail => ({
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  sprites: {
    front_default: "front.png",
    other: {
      dream_world: {
        front_default: "dream.png",
      },
    },
  },
  types: [{ slot: 1, type: { name: "grass" } }],
  moves: [{}, {}],
  stats: [{ base_stat: 45, stat: { name: "hp" } }],
  abilities: [{ ability: { name: "overgrow", url: "" }, is_hidden: false, slot: 1 }],
  ...overrides,
});

describe("GIVEN: getPokemonImageUrl", () => {
  it("THEN: returns dream_world image when available", () => {
    const raw = makeRawDetail();
    expect(getPokemonImageUrl(raw)).toBe("dream.png");
  });

  it("THEN: returns front_default when dream_world is null", () => {
    const raw = makeRawDetail({
      sprites: {
        front_default: "front.png",
        other: { dream_world: { front_default: null } },
      },
    });
    expect(getPokemonImageUrl(raw)).toBe("front.png");
  });

  it("THEN: returns null when both sprites are null", () => {
    const raw = makeRawDetail({
      sprites: {
        front_default: null,
        other: { dream_world: { front_default: null } },
      },
    });
    expect(getPokemonImageUrl(raw)).toBeNull();
  });
});

describe("GIVEN: getPokemonIdFromUrl", () => {
  it("THEN: extracts the numeric ID from a standard PokeAPI URL", () => {
    expect(getPokemonIdFromUrl("https://pokeapi.co/api/v2/pokemon/1/")).toBe("1");
  });

  it("THEN: extracts the ID for a multi-digit number", () => {
    expect(getPokemonIdFromUrl("https://pokeapi.co/api/v2/pokemon/150/")).toBe("150");
  });

  it("THEN: handles URLs without trailing slash", () => {
    expect(getPokemonIdFromUrl("https://pokeapi.co/api/v2/pokemon/25")).toBe("25");
  });
});

describe("GIVEN: adaptPokemonSummary", () => {
  it("THEN: maps name and url correctly", () => {
    const raw: RawPokemonSummary = {
      name: "pikachu",
      url: "https://pokeapi.co/api/v2/pokemon/25/",
    };
    expect(adaptPokemonSummary(raw)).toEqual({ name: "pikachu", url: raw.url });
  });
});

describe("GIVEN: adaptPokemonDetail", () => {
  it("THEN: maps all fields correctly", () => {
    const raw = makeRawDetail();
    const abilities: PokemonAbility[] = [
      { name: "overgrow", isHidden: false, description: "Powers up Grass moves." },
    ];
    const result = adaptPokemonDetail(raw, abilities);

    expect(result.id).toBe(1);
    expect(result.name).toBe("bulbasaur");
    expect(result.movesCount).toBe(2);
    expect(result.imageUrl).toBe("dream.png");
    expect(result.types).toEqual([{ slot: 1, typeName: "grass" }]);
    expect(result.stats).toEqual([{ name: "hp", value: 45 }]);
    expect(result.abilities).toBe(abilities);
  });

  it("THEN: maps multiple types correctly", () => {
    const raw = makeRawDetail({
      types: [
        { slot: 1, type: { name: "water" } },
        { slot: 2, type: { name: "flying" } },
      ],
    });
    const result = adaptPokemonDetail(raw, []);
    expect(result.types).toEqual([
      { slot: 1, typeName: "water" },
      { slot: 2, typeName: "flying" },
    ]);
  });

  it("THEN: maps multiple stats correctly", () => {
    const raw = makeRawDetail({
      stats: [
        { base_stat: 45, stat: { name: "hp" } },
        { base_stat: 49, stat: { name: "attack" } },
      ],
    });
    const result = adaptPokemonDetail(raw, []);
    expect(result.stats).toEqual([
      { name: "hp", value: 45 },
      { name: "attack", value: 49 },
    ]);
  });
});
