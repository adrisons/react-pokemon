import { Loading, Pagination } from "@shared/ui";
import PokemonList from "@features/pokemon-list/components/PokemonList/PokemonList";
import type { PokemonSummary } from "@core/domain/pokemon";

interface Props {
  pokemons: PokemonSummary[];
  loading: boolean;
  error: boolean;
  gotoNextPage: (() => void) | null;
  gotoPrevPage: (() => void) | null;
  query: string;
  onQueryChange: (value: string) => void;
  searchResults: PokemonSummary[];
  searching: boolean;
  notFound: boolean;
}

function PokemonListPageView({
  pokemons,
  loading,
  error,
  gotoNextPage,
  gotoPrevPage,
  query,
  onQueryChange,
  searchResults,
  searching,
  notFound,
}: Props) {
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
      <div className="flex items-baseline justify-center w-full mb-8">
        <input
          className="w-full"
          id="search"
          name="search"
          type="text"
          placeholder="Search by name"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      {isSearching ? (
        <>
          {searching && <Loading />}
          {notFound && (
            <div
              className="p-2 text-center text-poke-gray-500 cursor-default"
              title="No pokemon found"
            >
              Not even a nibble...
            </div>
          )}
          {!searching && !notFound && <PokemonList pokemons={searchResults} />}
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

export default PokemonListPageView;
