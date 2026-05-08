import type { RawPokemonDetail } from "./api.types";

export function isValidPokemon(value: unknown): value is RawPokemonDetail {
  if (value == null || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p["id"] === "number" &&
    typeof p["name"] === "string" &&
    Array.isArray(p["types"]) &&
    Array.isArray(p["moves"])
  );
}
