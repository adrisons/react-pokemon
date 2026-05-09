import { useNavigate } from "react-router-dom";
import type { EvolutionStage } from "@core/domain/evolution";

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
      <h2
        className="text-sm uppercase tracking-widest mb-5 text-text-muted"
        style={{ fontFamily: "var(--font-pixel)", letterSpacing: "0.15em" }}
      >
        Evolution Chain
      </h2>
      <div className="flex items-center justify-center flex-wrap gap-3">
        {stages.map((stage, index) => {
          const isCurrent = stage.pokemonId === currentId;
          return (
            <div key={stage.pokemonId} className="flex items-center gap-3">
              {index > 0 && (
                <div className="flex flex-col items-center gap-0.5 px-1">
                  <span style={{ color: "var(--color-accent-gold)", fontSize: "1.4rem", lineHeight: 1 }}>→</span>
                  {stage.trigger && (
                    <span
                      className="text-xs text-text-muted capitalize whitespace-nowrap"
                      style={{ fontFamily: "var(--font-elegant)", fontSize: "0.65rem" }}
                    >
                      {stage.trigger}
                    </span>
                  )}
                </div>
              )}
              <button
                onClick={() => !isCurrent && handleNavigate(stage.pokemonId)}
                disabled={isCurrent}
                className="evolution-card"
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
                <div className="evolution-card-img-wrap">
                  {stage.imageUrl ? (
                    <img
                      src={stage.imageUrl}
                      alt={stage.name}
                      loading="lazy"
                      decoding="async"
                      className="evolution-card-img"
                    />
                  ) : (
                    <div
                      className="evolution-card-img"
                      style={{ background: "var(--color-dark-700)", borderRadius: "50%" }}
                    />
                  )}
                </div>
                <span
                  className="evolution-card-id"
                  style={{ fontFamily: "var(--font-pixel)", color: "var(--color-accent-gold)" }}
                >
                  #{String(stage.pokemonId).padStart(3, "0")}
                </span>
                <span
                  className="evolution-card-name capitalize"
                  style={{
                    fontFamily: "var(--font-elegant)",
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
