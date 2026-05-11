import { useEffect, useRef } from "react";
import { Loading, Pagination } from "@shared/ui";
import PokemonCardGrid from "@features/pokemon-list/components/PokemonCardGrid/PokemonCardGrid";
import RecentlyViewed from "@features/history/components/RecentlyViewed/RecentlyViewed";
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
        <div className="w-full max-w-sm relative">
          <input
            ref={searchInputRef}
            className="peer animate-search-fade text-[0.95rem] bg-dark-800 text-text-primary border-2 border-dark-600 px-4 py-3 rounded-xl transition-all duration-250 shadow-[0_4px_12px_rgba(0,0,0,0.4)] focus:border-accent-gold focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,215,0,0.15),0_8px_24px_rgba(255,215,0,0.2)] placeholder:text-text-muted w-full"
            id="search"
            name="search"
            type="text"
            placeholder="Search Pokémon…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            data-testid="search-input"
          />
          {isSearching && (
            <button
              onClick={() => onQueryChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-text-muted text-xl font-bold p-1 px-2 cursor-pointer transition-all duration-200 flex items-center justify-center hover:[transform:translateY(-50%)_scale(1.15)] active:[transform:translateY(-50%)_scale(0.95)]"
              title="Clear search"
              data-testid="search-clear-btn"
            >
              ✕
            </button>
          )}
          {!isSearching && <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-dark-700 border border-dark-600 text-text-muted py-[5px] px-2.5 rounded-md text-[0.7rem] font-pixel pointer-events-none font-semibold tracking-[0.08em] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] transition-all duration-250 peer-focus:text-accent-gold peer-focus:border-accent-gold peer-focus:bg-dark-800 peer-focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_0_8px_rgba(255,215,0,0.2)]">⌘K</kbd>}
        </div>
      </div>

      {isSearching ? (
        <>
          {searching && <Loading />}
          {notFound && (
            <div
              className="p-8 text-center text-text-muted cursor-default"
              title="No pokemon found"
              data-testid="search-not-found"
            >
              <p className="text-lg">Not even a nibble...</p>
              <p className="text-sm mt-2">Try searching for something else</p>
            </div>
          )}
          {!searching && !notFound && searchResults.length > 0 && (
            <PokemonCardGrid pokemons={searchResults} />
          )}
        </>
      ) : (
        <>
          <RecentlyViewed />
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
