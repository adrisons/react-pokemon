import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Badge, Loading } from "@shared/ui";
import { usePokemonDetail } from "@features/pokemon-detail/hooks/usePokemonDetail";
import { useEvolutionChain } from "@features/pokemon-detail/hooks/useEvolutionChain";
import PokemonPicture from "@features/pokemon-detail/components/PokemonPicture/PokemonPicture";
import EvolutionChain from "@features/pokemon-detail/components/EvolutionChain/EvolutionChain";
import { STAT_COLORS } from "@shared/constants/statColors";

function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function handleCompare() {
    const existingA = searchParams.get("a");
    if (existingA) {
      navigate(`/react-pokemon/compare?a=${existingA}&b=${id}`);
    } else {
      navigate(`/react-pokemon/compare?a=${id}`);
    }
  }
  const { pokemon, loading } = usePokemonDetail(id, { trackHistory: true });
  const { stages } = useEvolutionChain(id);

  if (loading) return <Loading />;
  if (!pokemon) return null;

  return (
    <div className="min-h-screen px-6 py-8 pb-16">
      <div className="max-w-[1100px] mx-auto">

        {/* Top nav row */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <button
            onClick={() => navigate("/react-pokemon/")}
            className="relative px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2 text-accent-gold border-2 border-dark-600 bg-transparent tracking-[0.02em] hover:border-accent-gold hover:bg-accent-gold/5 hover:shadow-[0_4px_12px_rgba(255,215,0,0.15)] active:bg-accent-gold/10"
            data-testid="back-to-list-btn"
          >
            <span>←</span>
            <span>Back to Collection</span>
          </button>
          <button
            onClick={handleCompare}
            className="py-2 px-[1.1rem] text-[0.8rem] font-bold tracking-[0.06em] rounded-[0.75rem] bg-accent-gold/8 border border-accent-gold/30 text-accent-gold cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-accent-gold/15 hover:border-accent-gold/60 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:-translate-y-px"
            data-testid="compare-btn"
          >
            ⚔ Compare
          </button>
        </div>

        {/* ── Hero header ─────────────────────────────────── */}
        <div className="flex flex-col gap-8 bg-dark-800 border border-dark-600 rounded-3xl p-8 md:flex-row md:items-start md:px-12 md:py-10 md:gap-12">
          {/* Left column: id, name, types, image */}
          <div className="flex flex-col items-start shrink-0 md:min-w-[220px] md:max-w-[260px]">
            <div className="text-[1.05rem] font-bold text-accent-gold tracking-[0.08em] leading-none mb-2 opacity-85 font-pixel">
              #{String(pokemon.id).padStart(3, "0")}
            </div>
            <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.05] text-text-primary tracking-[-0.01em] mb-3 capitalize" data-testid="detail-pokemon-name">
              {pokemon.name}
            </h1>
            <div className="flex items-center flex-wrap gap-2.5 mb-3">
              {pokemon.types.map((t) => (
                <Badge key={t.slot} name={t.typeName} />
              ))}
            </div>
            <div className="text-sm mb-5 text-text-muted">
              {pokemon.movesCount} moves
            </div>
            <div className="w-full max-w-[220px] mt-2 md:max-w-[200px]" data-testid="detail-hero-image">
              <PokemonPicture imageUrl={pokemon.imageUrl} />
            </div>
          </div>

          {/* Right column: stats + abilities */}
          <div className="flex-1 min-w-0">
            {/* Base Stats */}
            <section className="detail-section">
              <h2 className="flex items-center gap-2.5 text-[0.85rem] uppercase tracking-[0.14em] text-accent-gold/90 font-pixel mb-5">
                <span className="inline-block w-4 h-[2px] rounded-full bg-accent-gold/50" aria-hidden="true" />
                Base Stats
              </h2>
              <div className="flex flex-col gap-3">
                {pokemon.stats.map((stat) => (
                  <div key={stat.name} className="flex items-center gap-3">
                    <span className="text-[0.8rem] w-[8.5rem] min-w-[8.5rem] capitalize text-right text-text-muted">
                      {stat.name.replace("-", " ")}
                    </span>
                    <span
                      className="text-[0.8rem] w-[2.25rem] min-w-[2.25rem] text-right font-pixel"
                      style={{ color: STAT_COLORS[stat.name] ?? "#aaa" }}
                    >
                      {stat.value}
                    </span>
                    <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(100, (stat.value / 255) * 100)}%`,
                          backgroundColor: STAT_COLORS[stat.name] ?? "#aaa",
                          boxShadow: `0 0 8px ${STAT_COLORS[stat.name] ?? "#aaa"}60`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Abilities */}
            <section className="detail-section mt-6">
              <h2 className="flex items-center gap-2.5 text-[0.85rem] uppercase tracking-[0.14em] text-accent-gold/90 font-pixel mb-5">
                <span className="inline-block w-4 h-[2px] rounded-full bg-accent-gold/50" aria-hidden="true" />
                Abilities
              </h2>
              <div className="flex flex-col gap-3">
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability.name}
                    className="border border-dark-600 rounded-[0.875rem] px-4 py-3.5 bg-dark-700 transition-colors duration-200 hover:border-[#33335a]"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="capitalize font-semibold text-sm text-text-primary">
                        {ability.name.replace("-", " ")}
                      </span>
                      {ability.isHidden && (
                        <span className="text-xs px-1.5 py-0.5 rounded border border-dark-600 text-text-muted">
                          hidden
                        </span>
                      )}
                    </div>
                    {ability.description && (
                      <p className="text-sm leading-relaxed text-text-muted">
                        {ability.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ── Evolution chain (full width below) ─────────── */}
        <div className="bg-dark-800 border border-dark-600 rounded-3xl px-8 py-7 mt-5">
          <EvolutionChain stages={stages} currentId={pokemon.id} />
        </div>

      </div>
    </div>
  );
}

export default PokemonDetailPage;
