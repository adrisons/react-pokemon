import type { RawPokemonDetail, RawPokemonSummary } from "./api.types";
import type { PokemonDetail, PokemonSummary, PokemonTypeName } from "./models";

export function getPokemonImageUrl(raw: RawPokemonDetail): string | null {
  return (
    raw.sprites?.other?.dream_world?.front_default ??
    raw.sprites?.front_default ??
    null
  );
}

export function getPokemonIdFromUrl(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export function adaptPokemonSummary(raw: RawPokemonSummary): PokemonSummary {
  return { name: raw.name, url: raw.url };
}

export function adaptPokemonDetail(raw: RawPokemonDetail): PokemonDetail {
  return {
    id: raw.id,
    name: raw.name,
    types: raw.types.map((t) => ({
      slot: t.slot,
      typeName: t.type.name as PokemonTypeName,
    })),
    movesCount: raw.moves.length,
    imageUrl: getPokemonImageUrl(raw),
  };
}
