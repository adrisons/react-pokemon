import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@core/api", () => ({ get: vi.fn() }));

import { getPokemonDetail } from "./pokemonDetailApi";
import { get } from "@core/api";

afterEach(() => vi.clearAllMocks());

describe("getPokemonDetail", () => {
  it("THEN: calls get with the correct path for a numeric id", async () => {
    vi.mocked(get).mockResolvedValue({ id: 1, name: "bulbasaur" });
    await getPokemonDetail(1);
    expect(get).toHaveBeenCalledWith("/pokemon/1");
  });

  it("THEN: calls get with the correct path for a string id", async () => {
    vi.mocked(get).mockResolvedValue({ id: 4, name: "charmander" });
    await getPokemonDetail("charmander");
    expect(get).toHaveBeenCalledWith("/pokemon/charmander");
  });

  it("THEN: returns the raw pokemon data from the API", async () => {
    const raw = { id: 25, name: "pikachu" };
    vi.mocked(get).mockResolvedValue(raw);
    const result = await getPokemonDetail(25);
    expect(result).toEqual(raw);
  });
});
