import { useState, useRef, useCallback } from "react";
import { usePokemonListStore } from "@features/pokemon-list/store";
import type { PokemonSummary } from "@core/domain/pokemon";

const DEBOUNCE_MS = 150;

export function _resetCacheForTesting() {
  usePokemonListStore.getState().resetAllPokemons();
}

export function usePokemonSearch() {
  const [results, setResults] = useState<PokemonSummary[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setNotFound(false);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const all = await usePokemonListStore.getState().loadAllPokemons();
        const filtered = all.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase().trim())
        );
        setResults(filtered);
        setNotFound(filtered.length === 0);
      } catch {
        setResults([]);
        setNotFound(true);
      } finally {
        setSearching(false);
      }
    }, DEBOUNCE_MS);
  }, []);

  const clear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setResults([]);
    setNotFound(false);
    setSearching(false);
  }, []);

  return { search, clear, results, notFound, searching };
}
