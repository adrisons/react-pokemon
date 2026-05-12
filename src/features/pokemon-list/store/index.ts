import { create } from "zustand";
import {
  getAllPokemons,
  invalidateAllPokemonsCache,
} from "@features/pokemon-list/api/pokemonListApi";
import type { PokemonSummary } from "@core/domain/pokemon";

interface PokemonListStore {
  allPokemons: PokemonSummary[] | null;
  /** Loads all Pokémon names, delegating HTTP caching to the API layer (TTL + stampede protection). */
  loadAllPokemons: () => Promise<PokemonSummary[]>;
  /** Resets both the domain state and the HTTP cache entry. Use only in tests. */
  resetAllPokemons: () => void;
}

export const usePokemonListStore = create<PokemonListStore>((set, get) => ({
  allPokemons: null,

  loadAllPokemons: async () => {
    const cached = get().allPokemons;
    if (cached) return cached;

    const result = await getAllPokemons();
    set({ allPokemons: result });
    return result;
  },

  resetAllPokemons: () => {
    set({ allPokemons: null });
    invalidateAllPokemonsCache();
  },
}));

export { useSearchStore } from "./useSearchStore";
