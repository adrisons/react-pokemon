import { useState, useRef } from "react";
import { getPokemonList } from "@features/pokemon-list/api/pokemonListApi";
import type { PokemonSummary } from "@core/domain/pokemon";

const ALL_POKEMON_URL = "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0";

let allPokemonsCache: PokemonSummary[] | null = null;

export function _resetCacheForTesting() {
  allPokemonsCache = null;
}

async function getAllPokemons(): Promise<PokemonSummary[]> {
  if (allPokemonsCache) return allPokemonsCache;
  const data = await getPokemonList(ALL_POKEMON_URL);
  allPokemonsCache = data.results;
  return allPokemonsCache;
}

export function usePokemonSearch() {
  const [results, setResults] = useState<PokemonSummary[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function search(query: string) {
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
        const all = await getAllPokemons();
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
    }, 500);
  }

  function clear() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setResults([]);
    setNotFound(false);
    setSearching(false);
  }

  return { search, clear, results, notFound, searching };
}
