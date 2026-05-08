import { useState } from "react";
import { Loading, Pagination } from "@shared/ui";
import { usePokemonList } from "@features/pokemon-list/hooks/usePokemonList";
import PokemonList from "@features/pokemon-list/components/PokemonList/PokemonList";

function PokemonListPage() {
  const { pokemons, loading, error, gotoNextPage, gotoPrevPage } = usePokemonList();
  const [filter, setFilter] = useState("");

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="flex flex-col w-80 mx-auto">
        <div className="flex items-baseline justify-center w-full text-center">
          Couldn't find pokemons.
        </div>
        <div className="flex items-baseline justify-center w-full text-center">
          You can use candy to attract them or check your internet connection.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-80 mx-auto">
      <div className="flex items-baseline justify-center w-full mb-8">
        <input
          className="flex-1"
          id="filter"
          name="filter"
          type="text"
          placeholder="Filter by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <PokemonList pokemons={pokemons.filter((p) => p.name.includes(filter))} />
      {!filter && (
        <Pagination gotoNextPage={gotoNextPage} gotoPrevPage={gotoPrevPage} />
      )}
    </div>
  );
}

export default PokemonListPage;
