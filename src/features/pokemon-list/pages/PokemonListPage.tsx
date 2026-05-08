import { useState } from "react";
import { usePokemonList } from "@features/pokemon-list/hooks/usePokemonList";
import { usePokemonSearch } from "@features/pokemon-list/hooks/usePokemonSearch";
import PokemonListPageView from "./PokemonListPageView";

function PokemonListPage() {
  const { pokemons, loading, error, gotoNextPage, gotoPrevPage } = usePokemonList();
  const { search, clear, results, notFound, searching } = usePokemonSearch();
  const [query, setQuery] = useState("");

  function handleQueryChange(value: string) {
    setQuery(value);
    if (!value.trim()) {
      clear();
    } else {
      search(value);
    }
  }

  return (
    <PokemonListPageView
      pokemons={pokemons}
      loading={loading}
      error={error}
      gotoNextPage={gotoNextPage}
      gotoPrevPage={gotoPrevPage}
      query={query}
      onQueryChange={handleQueryChange}
      searchResults={results}
      searching={searching}
      notFound={notFound}
    />
  );
}

export default PokemonListPage;
