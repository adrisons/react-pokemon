import type { CSSProperties } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Swords } from "lucide-react";
import { Badge, Loading } from "@shared/ui";
import { Button } from "@shared/ui/components/ui/button";
import { usePokemonDetail } from "@features/pokemon-detail/hooks/usePokemonDetail";
import { useEvolutionChain } from "@features/pokemon-detail/hooks/useEvolutionChain";
import PokemonPicture from "@features/pokemon-detail/components/PokemonPicture/PokemonPicture";
import EvolutionChain from "@features/pokemon-detail/components/EvolutionChain/EvolutionChain";
import PokedexIntel from "@features/pokemon-detail/components/PokedexIntel/PokedexIntel";
import { statColorVar } from "@shared/constants/statColors";

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

  const maxStat = Math.max(...pokemon.stats.map((s) => s.value));

  return (
    <article
      aria-labelledby="detail-pokemon-name"
      className="min-h-screen px-4 sm:px-6 py-8 pb-16"
      data-testid="detail-page"
    >
      <div className="max-w-[1100px] mx-auto">

        <div className="flex items-center justify-between mb-8 gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate("/react-pokemon/")}
            data-testid="back-to-list-btn"
          >
            <ArrowLeft aria-hidden="true" />
            <span className="hidden sm:inline">Back to Collection</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={handleCompare}
            data-testid="detail-compare-btn"
          >
            <Swords aria-hidden="true" />
            <span>Compare</span>
          </Button>
        </div>

        <section
          aria-labelledby="detail-pokemon-name"
          className="flex flex-col gap-6 bg-dark-800 border border-dark-600 rounded-3xl p-4 sm:p-6 md:flex-row md:items-start md:px-12 md:py-12 md:gap-12"
        >
          <header className="flex flex-col items-start shrink-0 md:min-w-[220px] md:max-w-[260px]">
            <div className="text-label font-bold text-accent-gold tracking-[0.08em] mb-2 opacity-85 font-pixel">
              #{String(pokemon.id).padStart(3, "0")}
            </div>
            <h1
              id="detail-pokemon-name"
              className="text-h1 sm:text-display font-bold text-text-primary tracking-[-0.01em] mb-3 capitalize"
              data-testid="detail-pokemon-name"
            >
              {pokemon.name}
            </h1>
            <div className="flex items-center flex-wrap gap-2 mb-3">
              {pokemon.types.map((t) => (
                <Badge key={t.slot} name={t.typeName} />
              ))}
            </div>
            <div className="text-body mb-6 text-text-muted">
              {pokemon.movesCount} moves
            </div>
            <div className="w-full max-w-[180px] sm:max-w-[220px] mt-2 md:max-w-[200px]" data-testid="detail-hero-image">
              <PokemonPicture imageUrl={pokemon.imageUrl} />
            </div>
          </header>

          <div className="flex-1 min-w-0">
            <section aria-labelledby="base-stats-heading">
              <h2
                id="base-stats-heading"
                className="flex items-center gap-3 text-h3 uppercase tracking-[0.16em] text-accent-gold font-pixel mb-6"
              >
                <span className="inline-block w-6 h-[3px] rounded-full bg-accent-gold/80" aria-hidden="true" />
                Base Stats
              </h2>
              <div className="flex flex-col gap-3">
                {pokemon.stats.map((stat) => (
                  <div
                    key={stat.name}
                    className="flex items-center gap-2 sm:gap-4"
                    style={{ "--stat-color": statColorVar(stat.name), "--bar-w": `${(stat.value / maxStat) * 100}%` } as CSSProperties}
                    data-testid={`detail-stat-${stat.name}`}
                  >
                    <span className="text-caption sm:text-label w-16 min-w-16 sm:w-[8.5rem] sm:min-w-[8.5rem] capitalize text-right text-text-muted truncate">
                      {stat.name.replace("-", " ")}
                    </span>
                    <span className="text-caption sm:text-label w-8 min-w-8 sm:w-9 sm:min-w-9 text-right font-pixel text-[var(--stat-color)]">
                      {stat.value}
                    </span>
                    <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden min-w-12">
                      <div
                        className="h-full rounded-full motion-safe:transition-all motion-safe:duration-700 bg-[var(--stat-color)] shadow-[0_0_8px_color-mix(in_srgb,var(--stat-color)_38%,transparent)] w-[var(--bar-w)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="abilities-heading" className="mt-8">
              <h2
                id="abilities-heading"
                className="flex items-center gap-3 text-h3 uppercase tracking-[0.16em] text-accent-gold font-pixel mb-6"
              >
                <span className="inline-block w-6 h-[3px] rounded-full bg-accent-gold/80" aria-hidden="true" />
                Abilities
              </h2>
              <div className="flex flex-col gap-3">
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability.name}
                    className="border border-dark-600 rounded-2xl px-4 py-4 bg-dark-700 transition-colors duration-200 hover:border-dark-600/70"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="capitalize font-semibold text-body text-text-primary">
                        {ability.name.replace("-", " ")}
                      </span>
                      {ability.isHidden && (
                        <span className="text-caption px-2 py-0.5 rounded border border-dark-600 text-text-muted uppercase tracking-wide">
                          hidden
                        </span>
                      )}
                    </div>
                    {ability.description && (
                      <p className="text-body leading-relaxed text-text-muted">
                        {ability.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        <PokedexIntel pokemon={pokemon} />

        <section
          aria-labelledby="evolution-heading"
          className="bg-dark-800 border border-dark-600 rounded-3xl px-4 sm:px-8 py-6 sm:py-8 mt-6"
        >
          <EvolutionChain stages={stages} currentId={pokemon.id} />
        </section>

      </div>
    </article>
  );
}

export default PokemonDetailPage;
