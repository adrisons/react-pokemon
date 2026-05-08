import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PokemonDetail } from "@core/domain/pokemon";
import Badge from "@shared/ui/components/Badge/Badge";
import { STAT_COLORS } from "@shared/constants/statColors";
import typeColors from "@shared/constants/typeColors";

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

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rot-x", "0deg");
    card.style.setProperty("--rot-y", "0deg");
    card.style.setProperty("--holo-opacity", "0");
  }

  function handleClick() {
    setIsFlipped(!isFlipped);
  }

  function handleDetailClick(e: React.MouseEvent) {
    e.stopPropagation();
    navigate(`/react-pokemon/detail/${pokemon.id}`);
  }

  return (
    <div
      ref={cardRef}
      className="card-scene cursor-pointer select-none"
      style={{ height: '20rem' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="card-tilt">
        <div className={`card-inner${isFlipped ? " is-flipped" : ""}`}>

          {/* ── FRONT ─────────────────────────────────── */}
          <div
            className="card-face flex flex-col bg-gradient-to-br from-dark-700 via-dark-800 to-dark-900"
            style={{
              background: `linear-gradient(135deg, ${typeColor}15 0%, #13131f 45%, #0d0d14 100%)`,
              boxShadow: `
                0 20px 60px rgba(0, 0, 0, 0.8),
                inset 0 1px 0 rgba(255, 215, 0, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.5)
              `,
              border: `2px solid transparent`,
              backgroundClip: 'padding-box',
              position: 'relative'
            }}
          >
            {/* Outer border effect (gold) */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${typeColor}40 0%, transparent 50%)`,
                padding: '1px',
                borderRadius: '1.25rem'
              }}
            />

            {/* Image area with type-colored gradient */}
            <div
              className="flex items-center justify-center flex-1 relative"
              style={{ background: `radial-gradient(ellipse at 50% 60%, ${typeColor}20 0%, transparent 70%)` }}
            >
              {pokemon.imageUrl ? (
                <img
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  className="w-28 h-28 object-contain drop-shadow-lg"
                  style={{ filter: `drop-shadow(0 2px 8px ${typeColor}40)` }}
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-dark-700 opacity-40" />
              )}
            </div>

            {/* Card info */}
            <div className="px-4 pb-4 flex flex-col gap-2 relative z-10">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-xs tracking-widest font-bold"
                  style={{ fontFamily: "var(--font-pixel)", color: "var(--color-accent-gold)" }}
                >
                  #{String(pokemon.id).padStart(3, "0")}
                </span>
              </div>
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

            {/* Holographic overlays - much more subtle */}
            <div className="card-holo" />
            <div className="card-gloss" />
          </div>

          {/* ── BACK ──────────────────────────────────── */}
          <div
            className="card-face card-face-back flex flex-col p-4 gap-3"
            style={{
              background: `linear-gradient(135deg, ${typeColor}15 0%, #13131f 45%, #0d0d14 100%)`,
              boxShadow: `
                0 20px 60px rgba(0, 0, 0, 0.8),
                inset 0 1px 0 rgba(255, 215, 0, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.5)
              `,
              border: `2px solid transparent`,
              backgroundClip: 'padding-box'
            }}
          >
            {/* Outer border effect */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${typeColor}40 0%, transparent 50%)`,
                padding: '1px',
                borderRadius: '1.25rem'
              }}
            />

            {/* Header */}
            <div className="flex justify-between items-baseline border-b border-dark-600 pb-3 relative z-10">
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
            <div className="flex flex-col gap-2 flex-1 relative z-10">
              {pokemon.stats.slice(0, 3).map((stat) => (
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
              className="pokemon-detail-btn w-full mt-3 relative z-10"
            >
              View Full Detail →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
