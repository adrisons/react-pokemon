import { get } from "@core/api";
import { cachedFetch, invalidateHttpCacheKey } from "@core/api/httpCache";
import type { PokemonSummary, RawPokemonListResponse } from "@core/domain/pokemon";

export const ALL_POKEMON_URL =
  "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0";

// 1 hour — Pokémon names are a quasi-static dataset (new generations every ~3 years)
const ALL_POKEMON_TTL_MS = 60 * 60 * 1000;

export function getPokemonList(url: string): Promise<RawPokemonListResponse> {
  return get<RawPokemonListResponse>(url);
}

export function getAllPokemons(): Promise<PokemonSummary[]> {
  return cachedFetch(
    ALL_POKEMON_URL,
    () => getPokemonList(ALL_POKEMON_URL).then((d) => d.results),
    { ttlMs: ALL_POKEMON_TTL_MS }
  );
}

export function invalidateAllPokemonsCache(): void {
  invalidateHttpCacheKey(ALL_POKEMON_URL);
}
