import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePokemonList } from "@features/pokemon-list/hooks/usePokemonList";
import { usePokemonSearch } from "@features/pokemon-list/hooks/usePokemonSearch";
import PokemonListPageView from "./PokemonListPageView";

function PokemonListPage() {
  const { pokemons, loading, error, gotoNextPage, gotoPrevPage } = usePokemonList();
  const { search, clear, results, notFound, searching } = usePokemonSearch();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  useEffect(() => {
    if (query.trim()) {
      search(query);
    } else {
      clear();
    }
  }, [query, search, clear]);

  function handleClearQuery() {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next, { replace: true });
  }

  return (
    <PokemonListPageView
      pokemons={pokemons}
      loading={loading}
      error={error}
      gotoNextPage={gotoNextPage}
      gotoPrevPage={gotoPrevPage}
      query={query}
      onClearQuery={handleClearQuery}
      searchResults={results}
      searching={searching}
      notFound={notFound}
    />
  );
}

export default PokemonListPage;
