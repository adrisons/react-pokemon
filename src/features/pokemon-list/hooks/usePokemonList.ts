import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPokemonList } from "@features/pokemon-list/api/pokemonListApi";
import type { PokemonSummary } from "@core/domain/pokemon";

export function usePokemonList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const offset = searchParams.get("offset") ?? "0";
  const limit = searchParams.get("limit") ?? "20";
  const path = `/pokemon?offset=${offset}&limit=${limit}`;

  const [pokemons, setPokemons] = useState<PokemonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPokemonList(path)
      .then((data) => {
        setPokemons(data.results);
        setHasNext(!!data.next);
        setHasPrev(!!data.previous);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [path]);

  function gotoNextPage() {
    setSearchParams({ offset: String(Number(offset) + Number(limit)), limit });
  }

  function gotoPrevPage() {
    setSearchParams({ offset: String(Math.max(0, Number(offset) - Number(limit))), limit });
  }

  return {
    pokemons,
    loading,
    error,
    gotoNextPage: hasNext ? gotoNextPage : null,
    gotoPrevPage: hasPrev ? gotoPrevPage : null,
  };
}
