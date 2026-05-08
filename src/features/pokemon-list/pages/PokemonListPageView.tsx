import { useEffect, useRef } from "react";
import { Loading, Pagination } from "@shared/ui";
import PokemonList from "@features/pokemon-list/components/PokemonList/PokemonList";
import PokemonCardGrid from "@features/pokemon-list/components/PokemonCardGrid/PokemonCardGrid";
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
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-text-muted">
        <p>Couldn't find pokemons.</p>
        <p>You can use candy to attract them or check your internet connection.</p>
      </div>
    );
  }

  const isSearching = query.trim().length > 0;

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex items-baseline justify-center w-full mb-10">
        <div className="w-full max-w-sm relative search-input-container">
          <input
            ref={searchInputRef}
            className="pokemon-search-input w-full"
            id="search"
            name="search"
            type="text"
            placeholder="Search Pokémon…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          {isSearching && (
            <button
              onClick={() => onQueryChange('')}
              className="search-clear-btn"
              title="Clear search"
            >
              ✕
            </button>
          )}
          {!isSearching && <kbd className="search-kbd">⌘K</kbd>}
        </div>
      </div>

      {isSearching ? (
        <>
          {searching && <Loading />}
          {notFound && (
            <div
              className="p-2 text-center text-text-muted cursor-default"
              title="No pokemon found"
            >
              Not even a nibble...
            </div>
          )}
          {!searching && !notFound && (
            <PokemonCardGrid pokemons={searchResults} />
          )}
        </>
      ) : (
        <>
          <PokemonCardGrid pokemons={pokemons} />
          <div className="mt-8">
            <Pagination gotoNextPage={gotoNextPage} gotoPrevPage={gotoPrevPage} />
          </div>
        </>
      )}
    </div>
  );
}

export default PokemonListPageView;
