import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { EvolutionStage } from "@core/domain/evolution";
import cardBack from "@shared/assets/pokemon-card-back.svg";
import { cn } from "@shared/lib/utils";

interface Props {
  stages: EvolutionStage[];
  currentId: number;
}

function EvolutionChain({ stages, currentId }: Props) {
  const navigate = useNavigate();

  if (stages.length <= 1) return null;

  function handleNavigate(pokemonId: number) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      navigate(`/react-pokemon/detail/${pokemonId}`);
    }, 350);
  }

  return (
    <section aria-labelledby="evolution-heading" data-testid="evolution-chain">
      <h2
        id="evolution-heading"
        className="flex items-center gap-3 text-h3 uppercase tracking-[0.14em] text-accent-gold font-pixel mb-6"
      >
        <span
          className="inline-block w-6 h-[3px] rounded-full bg-accent-gold/80 shadow-[0_0_8px_rgba(255,215,0,0.4)]"
          aria-hidden="true"
        />
        Evolution Chain
      </h2>
      <ol className="flex items-center justify-center flex-wrap gap-3 list-none p-0 m-0">
        {stages.map((stage, index) => {
          const isCurrent = stage.pokemonId === currentId;
          return (
            <li key={stage.pokemonId} className="flex items-center gap-3">
              {index > 0 && (
                <div className="flex flex-col items-center gap-1 px-1" aria-hidden="true">
                  <ArrowRight className="size-5 text-accent-gold" />
                  {stage.trigger && (
                    <span className="text-caption text-text-muted capitalize whitespace-nowrap">
                      {stage.trigger}
                    </span>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => !isCurrent && handleNavigate(stage.pokemonId)}
                disabled={isCurrent}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "group flex flex-col items-center gap-2 p-4 rounded-2xl w-28 min-h-40 cursor-pointer",
                  "transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-800",
                  "enabled:motion-safe:hover:-translate-y-0.5 enabled:hover:border-accent-gold/50",
                  "disabled:cursor-default",
                  isCurrent ? "pkm-evo-card-current" : "pkm-evo-card"
                )}
                data-testid={`evolution-stage-${stage.pokemonId}`}
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img
                    src={stage.imageUrl ?? cardBack}
                    alt={stage.name}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "w-20 h-20 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-transform duration-200",
                      !isCurrent && "motion-safe:group-hover:scale-110"
                    )}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = cardBack; }}
                  />
                </div>
                <span className="text-caption tracking-wider font-pixel text-accent-gold">
                  #{String(stage.pokemonId).padStart(3, "0")}
                </span>
                <span
                  className={cn(
                    "text-label text-center leading-tight capitalize",
                    isCurrent ? "text-text-primary font-bold" : "text-text-muted font-medium"
                  )}
                >
                  {stage.name}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default EvolutionChain;
