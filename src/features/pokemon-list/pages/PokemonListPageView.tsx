import { useEffect, useRef } from "react";
import { X } from "lucide-react";
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

  const isSearching = query.trim().length > 0;

  return (
    <section
      aria-labelledby="list-heading"
      className="max-w-6xl mx-auto px-6 space-y-8"
      data-testid="list-page"
    >
      <header className="flex flex-col items-start gap-2 pt-2">
        <span className="font-pixel text-caption tracking-[0.22em] uppercase text-accent-gold/75">
          Pokédex
        </span>
        <h1
          id="list-heading"
          className="font-pixel text-h1 tracking-[0.06em] text-text-primary drop-shadow-[0_0_18px_rgba(255,215,0,0.12)]"
          data-testid="list-page-title"
        >
          Browse the Collection
        </h1>
        <p className="text-body text-text-muted mt-1">
          Search by name or scroll through every generation.
        </p>
      </header>

      <search role="search" aria-label="Search Pokémon" className="w-full">
        <label htmlFor="search" className="sr-only">Search Pokémon</label>
        <div className="w-full max-w-md relative">
          <input
            ref={searchInputRef}
            className="peer animate-search-fade text-body bg-dark-800 text-text-primary border-2 border-dark-600 px-4 py-3 rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.4)] focus:border-accent-gold focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,215,0,0.15),0_8px_24px_rgba(255,215,0,0.2)] placeholder:text-text-muted w-full"
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
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center size-10 rounded-md bg-transparent text-text-muted transition-colors hover:text-accent-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-800"
              data-testid="search-clear-btn"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
          {!isSearching && <kbd className="absolute right-3 top-1/2 -translate-y-1/2 bg-dark-700 border border-dark-600 text-text-muted py-1 px-2 rounded-md text-caption font-pixel pointer-events-none font-semibold tracking-[0.08em] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] transition-all duration-200 peer-focus:text-accent-gold peer-focus:border-accent-gold peer-focus:bg-dark-800 peer-focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_0_8px_rgba(255,215,0,0.2)]">⌘K</kbd>}
        </div>
      </search>

      {loading && <Loading />}

      {error && (
        <div
          role="alert"
          className="max-w-md mx-auto mt-16 px-6 py-12 text-center rounded-3xl border border-danger/30 bg-danger/5 shadow-[0_8px_32px_rgba(220,38,38,0.08)]"
          data-testid="list-error"
        >
          <div className="text-4xl mb-3" aria-hidden="true">📡</div>
          <h2 className="font-pixel text-h3 tracking-[0.12em] uppercase text-danger-soft mb-2">
            Signal lost
          </h2>
          <p className="text-body text-text-primary leading-relaxed">
            Couldn't find pokémons. Use candy to attract them — or check your internet connection.
          </p>
        </div>
      )}

      {!loading && !error && isSearching && (
        <>
          {searching && <Loading />}
          {notFound && (
            <div
              className="flex flex-col items-center gap-2 py-16 text-center"
              data-testid="search-not-found"
            >
              <div className="text-3xl opacity-50 mb-1" aria-hidden="true">🎣</div>
              <p className="text-body text-text-primary font-medium">Not even a nibble…</p>
              <p className="text-body text-text-muted">Try searching for something else.</p>
            </div>
          )}
          {!searching && !notFound && searchResults.length > 0 && (
            <PokemonCardGrid pokemons={searchResults} />
          )}
        </>
      )}

      {!loading && !error && !isSearching && (
        <>
          <RecentlyViewed />
          <PokemonCardGrid pokemons={pokemons} />
          <Pagination gotoNextPage={gotoNextPage} gotoPrevPage={gotoPrevPage} />
        </>
      )}
    </section>
  );
}

export default PokemonListPageView;
