import { useState } from "react";
import { getPokemonDetail } from "@features/pokemon-detail/api/pokemonDetailApi";
import type { PokemonSummary } from "@core/domain/pokemon";

export function usePokemonSearch() {
  const [result, setResult] = useState<PokemonSummary | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);

  async function search(name: string) {
    if (!name.trim()) {
      setResult(null);
      setNotFound(false);
      return;
    }
    setSearching(true);
    setNotFound(false);
    try {
      const data = await getPokemonDetail(name.toLowerCase().trim());
      setResult({ name: data.name, url: `/pokemon/${data.id}` });
    } catch {
      setResult(null);
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  }

  function clear() {
    setResult(null);
    setNotFound(false);
  }

  return { search, clear, result, notFound, searching };
}
