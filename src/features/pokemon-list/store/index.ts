import { create } from "zustand";
import { cachedFetch, invalidateHttpCacheKey } from "@core/api/httpCache";
import { getPokemonList } from "@features/pokemon-list/api/pokemonListApi";
import type { PokemonSummary } from "@core/domain/pokemon";

export const ALL_POKEMON_URL =
  "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0";

// 1 hour — Pokémon names are a quasi-static dataset (new generations every ~3 years)
const ALL_POKEMON_TTL_MS = 60 * 60 * 1000;

interface PokemonListStore {
  allPokemons: PokemonSummary[] | null;
  /** Loads all Pokémon names, delegating HTTP caching to cachedFetch (TTL + stampede protection). */
  loadAllPokemons: () => Promise<PokemonSummary[]>;
  /** Resets both the domain state and the HTTP cache entry. Use only in tests. */
  resetAllPokemons: () => void;
}

export const usePokemonListStore = create<PokemonListStore>((set, get) => ({
  allPokemons: null,

  loadAllPokemons: async () => {
    const cached = get().allPokemons;
    if (cached) return cached;

    const result = await cachedFetch(
      ALL_POKEMON_URL,
      () => getPokemonList(ALL_POKEMON_URL).then((d) => d.results),
      { ttlMs: ALL_POKEMON_TTL_MS }
    );

    set({ allPokemons: result });
    return result;
  },

  resetAllPokemons: () => {
    set({ allPokemons: null });
    invalidateHttpCacheKey(ALL_POKEMON_URL);
  },
}));
