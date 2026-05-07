import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPokemonList } from "@features/pokemon/api";
import {
  selectCurrentPageUrl,
  selectNextPageUrl,
  selectPreviousPageUrl,
  setCurrentPageUrl,
  setSearchResult,
} from "@features/pokemon/store";

export function usePokemonList() {
  const dispatch = useDispatch();
  const currentPageUrl = useSelector(selectCurrentPageUrl);
  const nextPageUrl = useSelector(selectNextPageUrl);
  const prevPageUrl = useSelector(selectPreviousPageUrl);
  const [pokemons, setPokemons] = useState([]);
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
    dispatch(setCurrentPageUrl(nextPageUrl));
  }

  function gotoPrevPage() {
    dispatch(setCurrentPageUrl(prevPageUrl));
  }

  return {
    pokemons,
    loading,
    error,
    gotoNextPage: nextPageUrl ? gotoNextPage : null,
    gotoPrevPage: prevPageUrl ? gotoPrevPage : null,
  };
}
