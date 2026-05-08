import { useState } from "react";
import { Link } from "react-router-dom";
import { Loading, Pagination } from "@shared/ui";
import { usePokemonList } from "@features/pokemon-list/hooks/usePokemonList";
import { usePokemonSearch } from "@features/pokemon-list/hooks/usePokemonSearch";
import PokemonList from "@features/pokemon-list/components/PokemonList/PokemonList";
import { getPokemonIdFromUrl } from "@core/domain/pokemon";

function PokemonListPage() {
  const { pokemons, loading, error, gotoNextPage, gotoPrevPage } = usePokemonList();
  const { search, clear, result, notFound, searching } = usePokemonSearch();
  const [query, setQuery] = useState("");

  function handleSearchChange(value: string) {
    setQuery(value);
    if (!value.trim()) {
      clear();
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(query);
  }

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

  const isSearching = query.trim().length > 0;

  return (
    <div className="flex flex-col w-80 mx-auto">
      <form className="flex items-baseline justify-center w-full mb-8 gap-2" onSubmit={handleSearchSubmit}>
        <input
          className="flex-1"
          id="search"
          name="search"
          type="text"
          placeholder="Search by name"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <button type="submit" disabled={searching}>
          {searching ? "…" : "Search"}
        </button>
      </form>

      {isSearching ? (
        <>
          {searching && <Loading />}
          {notFound && (
            <div className="p-2 text-center text-poke-gray-500">
              No pokemon found for &ldquo;{query}&rdquo;.
            </div>
          )}
          {result && (() => {
            const id = getPokemonIdFromUrl(result.url);
            return (
              <ul className="list-none m-0 p-0 w-full">
                <li className="border border-poke-gray-100 flex justify-between items-center cursor-pointer hover:bg-poke-yellow rounded-lg">
                  <Link
                    to={`/react-pokemon/detail/${id}`}
                    className="w-full h-full no-underline text-inherit flex"
                  >
                    <div className="border-r border-poke-gray-100 min-w-12 flex justify-center p-2">
                      #{id}
                    </div>
                    <div className="flex-1 capitalize p-2">{result.name}</div>
                  </Link>
                </li>
              </ul>
            );
          })()}
        </>
      ) : (
        <>
          <PokemonList pokemons={pokemons} />
          <Pagination gotoNextPage={gotoNextPage} gotoPrevPage={gotoPrevPage} />
        </>
      )}
    </div>
  );
}

export default PokemonListPage;
