import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPokemonList } from "@features/pokemon-list/api/pokemonListApi";
import type { PokemonSummary } from "@core/domain/pokemon";
import type { RootState } from "@features/pokemon-list/store";
import {
  selectCurrentPageUrl,
  selectNextPageUrl,
  selectPreviousPageUrl,
  setCurrentPageUrl,
  setSearchResult,
} from "@features/pokemon-list/store";

export function usePokemonList() {
  const dispatch = useDispatch();
  const currentPageUrl = useSelector((state: RootState) => selectCurrentPageUrl(state));
  const nextPageUrl = useSelector((state: RootState) => selectNextPageUrl(state));
  const prevPageUrl = useSelector((state: RootState) => selectPreviousPageUrl(state));
  const [pokemons, setPokemons] = useState<PokemonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPokemonList(currentPageUrl)
      .then((data) => {
        dispatch(setSearchResult({ nextPageUrl: data.next, previousPageUrl: data.previous }));
        setPokemons(data.results);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [currentPageUrl, dispatch]);

  function gotoNextPage() {
    dispatch(setCurrentPageUrl(nextPageUrl!));
  }

  function gotoPrevPage() {
    dispatch(setCurrentPageUrl(prevPageUrl!));
  }

  return {
    pokemons,
    loading,
    error,
    gotoNextPage: nextPageUrl ? gotoNextPage : null,
    gotoPrevPage: prevPageUrl ? gotoPrevPage : null,
  };
}
