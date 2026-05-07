import { useState } from "react";
import { Loading, Pagination } from "@shared/ui";
import { usePokemonList } from "@features/pokemon/hooks";
import PokemonList from "@features/pokemon/components/PokemonList";
import "./PokemonListPage.css";

function PokemonListPage() {
  const { pokemons, loading, error, gotoNextPage, gotoPrevPage } = usePokemonList();
  const [filter, setFilter] = useState("");

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="pokemon-list">
        <div className="center">Couldn't find pokemons.</div>
        <div className="center">
          You can use candy to attract them or check your internet connection.
        </div>
      </div>
    );
  }

  return (
    <div className="pokemon-list">
      <div className="center">
        <input
          className="filter-input"
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
        <Pagination
          gotoNextPage={gotoNextPage}
          gotoPrevPage={gotoPrevPage}
        />
      )}
    </div>
  );
}

export default PokemonListPage;
