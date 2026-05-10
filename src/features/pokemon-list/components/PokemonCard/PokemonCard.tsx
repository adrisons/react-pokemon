import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PokemonDetail } from "@core/domain/pokemon";
import Badge from "@shared/ui/components/Badge/Badge";
import { STAT_COLORS } from "@shared/constants/statColors";
import typeColors from "@shared/constants/typeColors";
import cardBack from "@shared/assets/pokemon-card-back.svg";

interface Props {
  pokemon: PokemonDetail;
}

function PokemonCard({ pokemon }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const primaryType = pokemon.types[0]?.typeName;
  const typeColor = primaryType ? typeColors[primaryType] : "#6868aa";

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const rotX = ((y - 50) / 50) * -8;
    const rotY = ((x - 50) / 50) * 8;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
    card.style.setProperty("--rot-x", `${rotX}deg`);
    card.style.setProperty("--rot-y", `${rotY}deg`);
    card.style.setProperty("--holo-opacity", "0.15");
  }

  function handleMouseEnter() {
    setIsFlipped(true);
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rot-x", "0deg");
    card.style.setProperty("--rot-y", "0deg");
    card.style.setProperty("--holo-opacity", "0");
    setIsFlipped(false);
  }

  function handleDetailClick(e: React.MouseEvent) {
    e.stopPropagation();
    navigate(`/react-pokemon/detail/${pokemon.id}`);
  }

  const cardBorderStyle = {
    background: `linear-gradient(135deg, ${typeColor}80 0%, ${typeColor}30 25%, rgba(255,215,0,0.15) 50%, ${typeColor}20 75%, ${typeColor}60 100%)`,
  };

  const cardInnerStyle = {
    background: `linear-gradient(135deg, ${typeColor}15 0%, #13131f 45%, #0d0d14 100%)`,
    boxShadow: `inset 0 1px 0 rgba(255, 215, 0, 0.15), inset 0 -1px 0 rgba(0, 0, 0, 0.4)`,
  };

  return (
    <div
      ref={cardRef}
      className="card-scene cursor-pointer select-none"
      style={{ height: '24rem' }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-tilt">
        <div className={`card-inner${isFlipped ? " is-flipped" : ""}`}>

          {/* ── FRONT ─────────────────────────────────── */}
          {/* Outer gradient border wrapper */}
          <div className="card-face card-border-wrap" style={cardBorderStyle}>
            <div className="card-border-inner flex flex-col" style={cardInnerStyle}>

              {/* Image area */}
              <div
                className="flex items-center justify-center relative"
                style={{
                  flex: '1 1 0',
                  minHeight: 0,
                  background: `radial-gradient(ellipse at 50% 60%, ${typeColor}25 0%, transparent 70%)`
                }}
              >
                <img
                  src={pokemon.imageUrl ?? cardBack}
                  alt={pokemon.name}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '75%',
                    height: '75%',
                    objectFit: 'contain',
                    filter: pokemon.imageUrl ? `drop-shadow(0 4px 12px ${typeColor}50)` : 'none',
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = cardBack;
                    (e.currentTarget as HTMLImageElement).style.filter = 'none';
                  }}
                />
              </div>

              {/* Card info */}
              <div className="px-3 pb-3 flex flex-col gap-1.5 relative z-10" style={{ flexShrink: 0 }}>
                <span
                  className="text-xs tracking-widest font-bold"
                  style={{ fontFamily: "var(--font-pixel)", color: "var(--color-accent-gold)" }}
                >
                  #{String(pokemon.id).padStart(3, "0")}
                </span>
                <span
                  className="capitalize font-bold text-sm text-text-primary leading-tight"
                  style={{ fontFamily: "var(--font-elegant)" }}
                >
                  {pokemon.name}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {pokemon.types.map((t) => (
                    <Badge key={t.slot} name={t.typeName} />
                  ))}
                </div>
              </div>

              {/* Holographic overlays */}
              <div className="card-holo" />
              <div className="card-gloss" />
            </div>
          </div>

          {/* ── BACK ──────────────────────────────────── */}
          <div className="card-face card-face-back card-border-wrap" style={cardBorderStyle}>
            <div className="card-border-inner flex flex-col p-4 gap-3" style={cardInnerStyle}>

              {/* Header */}
              <div className="flex justify-between items-baseline border-b border-dark-600 pb-3">
                <span
                  className="capitalize font-bold text-sm text-text-primary"
                  style={{ fontFamily: "var(--font-elegant)" }}
                >
                  {pokemon.name}
                </span>
                <span
                  className="text-xs tracking-wider font-bold"
                  style={{ fontFamily: "var(--font-pixel)", color: "var(--color-accent-gold)" }}
                >
                  #{String(pokemon.id).padStart(3, "0")}
                </span>
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-2 flex-1">
                {pokemon.stats?.slice(0, 3).map((stat) => (
                  <div key={stat.name} className="flex items-center gap-2">
                    <span
                      className="text-right capitalize shrink-0"
                      style={{
                        fontSize: "0.65rem",
                        width: "4rem",
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-elegant)",
                      }}
                    >
                      {stat.name.replace("-", " ")}
                    </span>
                    <span
                      className="text-right shrink-0 font-bold"
                      style={{
                        fontSize: "0.7rem",
                        width: "1.75rem",
                        fontFamily: "var(--font-pixel)",
                        color: STAT_COLORS[stat.name] ?? "#aaa",
                      }}
                    >
                      {stat.value}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-dark-700">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (stat.value / 255) * 100)}%`,
                          backgroundColor: STAT_COLORS[stat.name] ?? "#aaa",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Detail button */}
              <button
                onClick={handleDetailClick}
                className="pokemon-detail-btn w-full"
              >
                View Full Detail →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
