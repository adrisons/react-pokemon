import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PokemonDetail } from "@core/domain/pokemon";

const MAX_ENTRIES = 10;

export interface HistoryEntry {
  id: number;
  name: string;
  imageUrl: string | null;
  types: PokemonDetail["types"];
}

interface HistoryStore {
  entries: HistoryEntry[];
  addEntry: (pokemon: PokemonDetail) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (pokemon) =>
        set((state) => {
          const filtered = state.entries.filter((e) => e.id !== pokemon.id);
          const next: HistoryEntry = {
            id: pokemon.id,
            name: pokemon.name,
            imageUrl: pokemon.imageUrl,
            types: pokemon.types,
          };
          return { entries: [next, ...filtered].slice(0, MAX_ENTRIES) };
        }),
      clear: () => set({ entries: [] }),
    }),
    {
      name: "pokemon-history",
      partialize: (state) => ({ entries: state.entries }),
    }
  )
);
