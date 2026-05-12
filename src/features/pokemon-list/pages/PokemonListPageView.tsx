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
  onClearQuery: () => void;
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
  onClearQuery,
  searchResults,
  searching,
  notFound,
}: Props) {
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

      {isSearching && (
        <div
          className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl border border-dark-600 bg-dark-800/60"
          data-testid="search-active-banner"
        >
          <span className="text-caption uppercase tracking-[0.18em] text-text-muted font-pixel">
            Filtering
          </span>
          <span className="text-body font-medium text-text-primary capitalize">“{query}”</span>
          <button
            type="button"
            onClick={onClearQuery}
            aria-label="Clear search"
            className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-caption text-text-muted hover:text-accent-gold hover:bg-dark-700/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
            data-testid="search-clear-btn"
          >
            <X className="size-3.5" aria-hidden="true" />
            Clear
          </button>
        </div>
      )}

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
