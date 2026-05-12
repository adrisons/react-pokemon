import { useEffect } from "react";
import { useNavigate, useSearchParams, useNavigationType } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Loading } from "@shared/ui";
import { Button } from "@shared/ui/components/ui/button";
import { useCompare } from "@features/compare/hooks/useCompare";
import { useCompareStore } from "@features/compare/store/compareStore";
import CompareStats from "@features/compare/components/CompareStats/CompareStats";
import PokemonSelector from "@features/compare/components/PokemonSelector/PokemonSelector";

function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const { clear } = useCompareStore();

  useEffect(() => {
    if (navigationType === "POP") {
      setSearchParams({}, { replace: true });
    }
    return () => { clear(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const idA = searchParams.get("a");
  const idB = searchParams.get("b");

  const { pokemonA, pokemonB, effectivenessMap, loading } = useCompare(idA, idB);

  function handleSelectA(id: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("a", id);
      return next;
    });
  }

  function handleSelectB(id: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("b", id);
      return next;
    });
  }

  function handleClearA() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("a");
      return next;
    });
  }

  function handleClearB() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("b");
      return next;
    });
  }

  const bothLoaded = pokemonA && pokemonB && effectivenessMap;

  return (
    <section
      aria-labelledby="compare-heading"
      className="min-h-screen px-4 sm:px-6 py-8 pb-16"
      data-testid="compare-page"
    >
      <div className="max-w-[860px] mx-auto">

        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate("/react-pokemon/")}
          className="mb-8"
          data-testid="compare-back-btn"
        >
          <ArrowLeft aria-hidden="true" />
          <span>Back to Collection</span>
        </Button>

        <header className="mb-12 text-center">
          <h1
            id="compare-heading"
            className="text-display font-bold tracking-[0.06em] text-accent-gold font-pixel drop-shadow-[0_0_20px_rgba(255,215,0,0.15)]"
            data-testid="compare-page-title"
          >
            Compare
          </h1>
          <p className="font-pixel text-caption tracking-[0.22em] uppercase text-text-muted mt-4">
            Two enter · one wins
          </p>
          <p className="text-body text-text-muted mt-3 max-w-sm mx-auto leading-relaxed">
            Select two Pokémon to see how their stats stack up.
          </p>
        </header>

        <section
          aria-label="Pokémon selectors"
          className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4 mb-12 bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6"
        >
          <PokemonSelector
            label="Pokémon A"
            selectedId={idA}
            onSelect={handleSelectA}
            onClear={handleClearA}
          />
          <div className="text-label font-bold tracking-[0.12em] text-text-muted text-center px-2 font-pixel">
            VS
          </div>
          <PokemonSelector
            label="Pokémon B"
            selectedId={idB}
            onSelect={handleSelectB}
            onClear={handleClearB}
            disabled={!idA}
          />
        </section>

        {loading && (
          <div className="py-16">
            <Loading />
          </div>
        )}

        {!loading && bothLoaded && (
          <CompareStats pokemonA={pokemonA} pokemonB={pokemonB} effectivenessMap={effectivenessMap} />
        )}

        {!loading && !bothLoaded && (
          <div
            className="flex flex-col items-center justify-center gap-3 px-8 py-16 text-center"
            data-testid="compare-empty"
          >
            <div className="text-2xl opacity-40" aria-hidden="true">
              {idA && !idB ? "⚔" : "✦"}
            </div>
            {!idA && !idB && (
              <p className="text-body text-text-muted max-w-xs leading-relaxed">
                Search for two Pokémon to begin comparing.
              </p>
            )}
            {idA && !idB && (
              <p className="text-body text-text-muted max-w-xs leading-relaxed">
                Now pick a second Pokémon to challenge.
              </p>
            )}
          </div>
        )}

      </div>
    </section>
  );
}

export default ComparePage;
