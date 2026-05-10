import { useNavigate, useParams } from "react-router-dom";
import { Badge, Loading } from "@shared/ui";
import { usePokemonDetail } from "@features/pokemon-detail/hooks/usePokemonDetail";
import { useEvolutionChain } from "@features/pokemon-detail/hooks/useEvolutionChain";
import PokemonPicture from "@features/pokemon-detail/components/PokemonPicture/PokemonPicture";
import EvolutionChain from "@features/pokemon-detail/components/EvolutionChain/EvolutionChain";
import { STAT_COLORS } from "@shared/constants/statColors";

function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pokemon, loading } = usePokemonDetail(id);
  const { stages } = useEvolutionChain(id);

  if (loading) return <Loading />;
  if (!pokemon) return null;

  return (
    <div className="detail-page-root">
      <div className="detail-page-inner">

        {/* Back button */}
        <button
          onClick={() => navigate("/react-pokemon/")}
          className="pokemon-back-btn mb-8"
          data-testid="back-to-list-btn"
        >
          <span>←</span>
          <span>Back to Collection</span>
        </button>

        {/* ── Hero header ─────────────────────────────────── */}
        <div className="detail-hero">
          {/* Left column: id, name, types, image */}
          <div className="detail-hero-left">
            <div className="detail-pokemon-id" style={{ fontFamily: "var(--font-pixel)" }}>
              #{String(pokemon.id).padStart(3, "0")}
            </div>
            <h1 className="detail-pokemon-name capitalize" style={{ fontFamily: "var(--font-elegant)" }} data-testid="detail-pokemon-name">
              {pokemon.name}
            </h1>
            <div className="flex items-center flex-wrap gap-2.5 mb-3">
              {pokemon.types.map((t) => (
                <Badge key={t.slot} name={t.typeName} />
              ))}
            </div>
            <div
              className="text-sm mb-5"
              style={{ fontFamily: "var(--font-elegant)", color: "var(--color-text-muted)" }}
            >
              {pokemon.movesCount} moves
            </div>
            <div className="detail-hero-image" data-testid="detail-hero-image">
              <PokemonPicture imageUrl={pokemon.imageUrl} />
            </div>
          </div>

          {/* Right column: stats + abilities */}
          <div className="detail-hero-right">
            {/* Base Stats */}
            <section className="detail-section">
              <h2 className="detail-section-title" style={{ fontFamily: "var(--font-pixel)" }}>
                Base Stats
              </h2>
              <div className="flex flex-col gap-3">
                {pokemon.stats.map((stat) => (
                  <div key={stat.name} className="flex items-center gap-3">
                    <span
                      className="detail-stat-label capitalize text-right"
                      style={{ fontFamily: "var(--font-elegant)", color: "var(--color-text-muted)" }}
                    >
                      {stat.name.replace("-", " ")}
                    </span>
                    <span
                      className="detail-stat-value text-right"
                      style={{
                        fontFamily: "var(--font-pixel)",
                        color: STAT_COLORS[stat.name] ?? "#aaa",
                      }}
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
              <h2 className="detail-section-title" style={{ fontFamily: "var(--font-pixel)" }}>
                Abilities
              </h2>
              <div className="flex flex-col gap-3">
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability.name}
                    className="detail-ability-card"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="capitalize font-semibold text-sm"
                        style={{
                          fontFamily: "var(--font-elegant)",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {ability.name.replace("-", " ")}
                      </span>
                      {ability.isHidden && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            fontFamily: "var(--font-elegant)",
                            border: "1px solid var(--color-dark-600)",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          hidden
                        </span>
                      )}
                    </div>
                    {ability.description && (
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          fontFamily: "var(--font-elegant)",
                          color: "var(--color-text-muted)",
                        }}
                      >
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
        <div className="detail-evolution-section">
          <EvolutionChain stages={stages} currentId={pokemon.id} />
        </div>

      </div>
    </div>
  );
}

export default PokemonDetailPage;
