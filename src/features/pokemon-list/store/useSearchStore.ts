import { create } from "zustand";
import { usePokemonListStore } from "./index";
import type { PokemonSummary } from "@core/domain/pokemon";

const DEBOUNCE_MS = 150;
const MAX_SUGGESTIONS = 8;

interface SearchStore {
  isOpen: boolean;
  query: string;
  results: PokemonSummary[];
  searching: boolean;
  notFound: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setQuery: (value: string) => void;
  reset: () => void;
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let activeRequestId = 0;

function runSearch(query: string, set: (partial: Partial<SearchStore>) => void) {
  if (debounceTimer) clearTimeout(debounceTimer);

  const trimmed = query.trim();
  if (!trimmed) {
    set({ results: [], notFound: false, searching: false });
    return;
  }

  set({ searching: true });
  const requestId = ++activeRequestId;

  debounceTimer = setTimeout(async () => {
    try {
      const all = await usePokemonListStore.getState().loadAllPokemons();
      if (requestId !== activeRequestId) return;
      const needle = trimmed.toLowerCase();
      const filtered = all.filter((p) => p.name.toLowerCase().includes(needle));
      set({
        results: filtered.slice(0, MAX_SUGGESTIONS),
        notFound: filtered.length === 0,
        searching: false,
      });
    } catch {
      if (requestId !== activeRequestId) return;
      set({ results: [], notFound: true, searching: false });
    }
  }, DEBOUNCE_MS);
}

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,
  query: "",
  results: [],
  searching: false,
  notFound: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),

  setQuery: (value: string) => {
    set({ query: value });
    runSearch(value, set);
  },

  reset: () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    activeRequestId++;
    set({ query: "", results: [], notFound: false, searching: false });
  },
}));
