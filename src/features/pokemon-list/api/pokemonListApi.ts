import { get, invalidateGet } from "@core/api";
import type { PokemonSummary, RawPokemonListResponse } from "@core/domain/pokemon";

const ALL_POKEMON_PATH = "/pokemon?limit=10000&offset=0";

// 1 hour — Pokémon names are a quasi-static dataset (new generations every ~3 years)
const ALL_POKEMON_TTL_MS = 60 * 60 * 1000;

export function getPokemonList(path: string): Promise<RawPokemonListResponse> {
  return get<RawPokemonListResponse>(path);
}

export function getAllPokemons(): Promise<PokemonSummary[]> {
  return get<RawPokemonListResponse>(ALL_POKEMON_PATH, {
    ttlMs: ALL_POKEMON_TTL_MS,
  }).then((d) => d.results);
}

export function invalidateAllPokemonsCache(): void {
  invalidateGet(ALL_POKEMON_PATH);
}
