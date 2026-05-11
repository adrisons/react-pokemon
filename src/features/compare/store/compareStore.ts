import { create } from "zustand";

interface CompareStore {
  slotA: string | null;
  slotB: string | null;
  setSlotA: (id: string | null) => void;
  setSlotB: (id: string | null) => void;
  /** Select a pokémon into the next available slot (A first, then B). Returns which slot was filled. */
  selectPokemon: (id: string) => "a" | "b" | null;
  /** Remove a pokémon from whichever slot it occupies. */
  removePokemon: (id: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  slotA: null,
  slotB: null,
  setSlotA: (id) => set({ slotA: id }),
  setSlotB: (id) => set({ slotB: id }),
  selectPokemon: (id) => {
    const { slotA, slotB } = get();
    if (slotA === id || slotB === id) return null;
    if (!slotA) {
      set({ slotA: id });
      return "a";
    }
    if (!slotB) {
      set({ slotB: id });
      return "b";
    }
    return null;
  },
  removePokemon: (id) =>
    set((s) => ({
      slotA: s.slotA === id ? null : s.slotA,
      slotB: s.slotB === id ? null : s.slotB,
    })),
  clear: () => set({ slotA: null, slotB: null }),
}));
