import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@core/api", () => ({ get: vi.fn() }));

import { getAbilityDescription } from "./abilityApi";
import { get } from "@core/api";

afterEach(() => vi.clearAllMocks());

const makeAbilityResponse = (entries: { short_effect: string; language: { name: string } }[]) => ({
  effect_entries: entries,
});

describe("getAbilityDescription", () => {
  it("THEN: calls get with the correct ability path", async () => {
    vi.mocked(get).mockResolvedValue(makeAbilityResponse([]));
    await getAbilityDescription("overgrow");
    expect(get).toHaveBeenCalledWith("/ability/overgrow");
  });

  it("THEN: returns the English short_effect when present", async () => {
    vi.mocked(get).mockResolvedValue(
      makeAbilityResponse([
        { short_effect: "Potencia los ataques de tipo planta.", language: { name: "es" } },
        { short_effect: "Powers up Grass-type moves.", language: { name: "en" } },
      ])
    );
    const result = await getAbilityDescription("overgrow");
    expect(result).toBe("Powers up Grass-type moves.");
  });

  it("THEN: returns empty string when no English entry exists", async () => {
    vi.mocked(get).mockResolvedValue(
      makeAbilityResponse([
        { short_effect: "Potencia los ataques.", language: { name: "es" } },
      ])
    );
    const result = await getAbilityDescription("overgrow");
    expect(result).toBe("");
  });

  it("THEN: returns empty string when effect_entries is empty", async () => {
    vi.mocked(get).mockResolvedValue(makeAbilityResponse([]));
    const result = await getAbilityDescription("unknown-ability");
    expect(result).toBe("");
  });
});
