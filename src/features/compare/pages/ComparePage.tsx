import { useEffect } from "react";
import { useNavigate, useSearchParams, useNavigationType } from "react-router-dom";
import { Loading } from "@shared/ui";
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

  const { pokemonA, pokemonB, loading } = useCompare(idA, idB);

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

  const bothLoaded = pokemonA && pokemonB;

  return (
    <div className="min-h-screen px-6 py-8 pb-16">
      <div className="max-w-[860px] mx-auto">

        <button
          onClick={() => navigate("/react-pokemon/")}
          className="relative px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2 text-accent-gold border-2 border-dark-600 bg-transparent tracking-[0.02em] hover:border-accent-gold hover:bg-accent-gold/5 hover:shadow-[0_4px_12px_rgba(255,215,0,0.15)] active:bg-accent-gold/10 mb-8"
          data-testid="compare-back-btn"
        >
          <span>←</span>
          <span>Back to Collection</span>
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] font-bold tracking-[0.1em] text-accent-gold leading-none mb-2 font-pixel">
            Compare
          </h1>
          <p className="text-sm text-text-muted">
            Select two Pokémon to see how their stats stack up
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-10 bg-dark-800 border border-dark-600 rounded-[1.25rem] p-6">
          <PokemonSelector
            label="Pokémon A"
            selectedId={idA}
            onSelect={handleSelectA}
            onClear={handleClearA}
          />
          <div className="text-[0.9rem] font-bold tracking-[0.12em] text-text-muted text-center px-2 font-pixel">
            VS
          </div>
          <PokemonSelector
            label="Pokémon B"
            selectedId={idB}
            onSelect={handleSelectB}
            onClear={handleClearB}
            disabled={!idA}
          />
        </div>

        <div className="mt-2">
          {loading && (
            <div className="py-16">
              <Loading />
            </div>
          )}

          {!loading && bothLoaded && (
            <CompareStats pokemonA={pokemonA} pokemonB={pokemonB} />
          )}

          {!loading && !bothLoaded && (
            <div className="flex items-center justify-center px-8 py-16">
              {!idA && !idB && (
                <p className="text-[0.9rem] text-text-muted text-center">
                  Search for two Pokémon to begin comparing
                </p>
              )}
              {idA && !idB && (
                <p className="text-[0.9rem] text-text-muted text-center">
                  Now pick a second Pokémon to challenge
                </p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ComparePage;
