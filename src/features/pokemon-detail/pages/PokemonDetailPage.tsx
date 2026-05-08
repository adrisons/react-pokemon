import { useNavigate, useParams } from "react-router-dom";
import { Badge, Loading } from "@shared/ui";
import { usePokemonDetail } from "@features/pokemon-detail/hooks/usePokemonDetail";
import PokemonPicture from "@features/pokemon-detail/components/PokemonPicture/PokemonPicture";
import { STAT_COLORS } from "@shared/constants/statColors";

function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pokemon, loading } = usePokemonDetail(id);

  if (loading) return <Loading />;
  if (!pokemon) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 pt-4">
      <button
        onClick={() => navigate('/react-pokemon/')}
        className="pokemon-back-btn mb-6"
      >
        <span>←</span>
        <span>Back to Collection</span>
      </button>
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8">
        <h1
          className="flex capitalize text-text-primary mb-3"
          style={{ fontFamily: "var(--font-elegant)", fontWeight: 700 }}
        >
          <span
            className="mr-4 text-accent-gold"
            style={{ fontFamily: "var(--font-pixel)", fontSize: "0.9em" }}
          >
            #{String(pokemon.id).padStart(3, "0")}
          </span>
          {pokemon.name}
        </h1>

        <div className="flex items-center flex-wrap gap-2.5 mb-4">
          {pokemon.types.map((t) => (
            <Badge key={t.slot} name={t.typeName} />
          ))}
        </div>

        <div className="text-text-muted mb-4" style={{ fontFamily: "var(--font-elegant)" }}>
          {pokemon.movesCount} moves
        </div>

        <PokemonPicture imageUrl={pokemon.imageUrl} />

        <section className="mt-6">
          <h2
            className="font-bold mb-3 text-text-primary"
            style={{ fontFamily: "var(--font-elegant)" }}
          >
            Base Stats
          </h2>
          <div className="flex flex-col gap-2.5">
            {pokemon.stats.map((stat) => (
              <div key={stat.name} className="flex items-center gap-3">
                <span
                  className="w-32 text-sm capitalize text-right text-text-muted"
                  style={{ fontFamily: "var(--font-elegant)" }}
                >
                  {stat.name.replace("-", " ")}
                </span>
                <span
                  className="w-8 text-sm text-right"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    color: STAT_COLORS[stat.name] ?? "#aaa",
                  }}
                >
                  {stat.value}
                </span>
                <div className="flex-1 h-2.5 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (stat.value / 255) * 100)}%`,
                      backgroundColor: STAT_COLORS[stat.name] ?? "#aaa",
                      boxShadow: `0 0 6px ${STAT_COLORS[stat.name] ?? "#aaa"}80`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 mb-2">
          <h2
            className="font-bold mb-3 text-text-primary"
            style={{ fontFamily: "var(--font-elegant)" }}
          >
            Abilities
          </h2>
          <div className="flex flex-col gap-3">
            {pokemon.abilities.map((ability) => (
              <div
                key={ability.name}
                className="border border-dark-600 rounded-xl p-3 bg-dark-700"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="capitalize font-semibold text-sm text-text-primary"
                    style={{ fontFamily: "var(--font-elegant)" }}
                  >
                    {ability.name.replace("-", " ")}
                  </span>
                  {ability.isHidden && (
                    <span className="text-xs px-1.5 py-0.5 border border-dark-600 rounded text-text-muted">
                      hidden
                    </span>
                  )}
                </div>
                {ability.description && (
                  <p
                    className="text-sm text-text-muted"
                    style={{ fontFamily: "var(--font-elegant)" }}
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
  );
}

export default PokemonDetailPage;
