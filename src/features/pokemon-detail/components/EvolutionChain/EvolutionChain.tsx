import { useNavigate } from "react-router-dom";
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
    <section className="mt-8 mb-2">
      <h2 className="flex items-center gap-2.5 text-[0.85rem] uppercase tracking-[0.14em] text-accent-gold/90 font-pixel mb-5">
        <span className="inline-block w-4 h-[2px] rounded-full bg-accent-gold/50" aria-hidden="true" />
        Evolution Chain
      </h2>
      <div className="flex items-center justify-center flex-wrap gap-3">
        {stages.map((stage, index) => {
          const isCurrent = stage.pokemonId === currentId;
          return (
            <div key={stage.pokemonId} className="flex items-center gap-3">
              {index > 0 && (
                <div className="flex flex-col items-center gap-0.5 px-1">
                  <span className="text-accent-gold text-[1.4rem] leading-none">→</span>
                  {stage.trigger && (
                    <span className="text-[0.65rem] text-text-muted capitalize whitespace-nowrap">
                      {stage.trigger}
                    </span>
                  )}
                </div>
              )}
              <button
                onClick={() => !isCurrent && handleNavigate(stage.pokemonId)}
                disabled={isCurrent}
                className="group flex flex-col items-center gap-[0.4rem] p-4 px-3 pb-[0.85rem] rounded-2xl transition-all duration-200 w-28 enabled:hover:!border-accent-gold/50 enabled:hover:!shadow-[0_0_20px_rgba(255,215,0,0.18),0_4px_16px_rgba(0,0,0,0.4)] enabled:hover:-translate-y-[3px] enabled:active:-translate-y-px"
                style={{
                  border: isCurrent
                    ? "2px solid var(--color-accent-gold)"
                    : "2px solid var(--color-dark-600)",
                  background: isCurrent
                    ? "linear-gradient(145deg, var(--color-dark-700), var(--color-dark-800))"
                    : "var(--color-dark-800)",
                  boxShadow: isCurrent
                    ? "0 0 20px rgba(255,215,0,0.25), inset 0 1px 0 rgba(255,215,0,0.1)"
                    : "none",
                  cursor: isCurrent ? "default" : "pointer",
                }}
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img
                    src={stage.imageUrl ?? cardBack}
                    alt={stage.name}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "w-20 h-20 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-transform duration-200",
                      !isCurrent && "group-hover:scale-110"
                    )}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = cardBack; }}
                  />
                </div>
                <span className="text-[0.65rem] tracking-[0.05em] font-pixel text-accent-gold">
                  #{String(stage.pokemonId).padStart(3, "0")}
                </span>
                <span
                  className="text-[0.8rem] text-center leading-[1.2] capitalize"
                  style={{
                    color: isCurrent ? "var(--color-text-primary)" : "var(--color-text-muted)",
                    fontWeight: isCurrent ? 700 : 500,
                  }}
                >
                  {stage.name}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default EvolutionChain;
