import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PokemonDetail } from "@core/domain/pokemon";
import Badge from "@shared/ui/components/Badge/Badge";
import { STAT_COLORS } from "@shared/constants/statColors";
import typeColors from "@shared/constants/typeColors";
import cardBack from "@shared/assets/pokemon-card-back.svg";
import { useCompareStore } from "@features/compare/store/compareStore";
import { cn } from "@shared/lib/utils";

interface Props {
  pokemon: PokemonDetail;
}

function PokemonCard({ pokemon }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { slotA, slotB, selectPokemon, removePokemon } = useCompareStore();

  const pokemonIdStr = String(pokemon.id);
  const isInCompare = slotA === pokemonIdStr || slotB === pokemonIdStr;
  const compareSlotsFull = slotA !== null && slotB !== null;

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

  function handleCompareClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isInCompare) {
      removePokemon(pokemonIdStr);
      return;
    }
    const slot = selectPokemon(pokemonIdStr);
    if (slot === "b" && slotA !== null) {
      navigate(`/react-pokemon/compare?a=${slotA}&b=${pokemonIdStr}`);
    }
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
      className="h-100 group [perspective:900px] animate-card-entry cursor-pointer select-none h-96"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-testid="pokemon-card"
      data-pokemon-name={pokemon.name}
    >
      <div className="card-tilt rounded-[1.25rem] h-full shadow-[0_8px_24px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.3)] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.6),0_6px_16px_rgba(255,215,0,0.1)]">
        <div className={`h-100 card-inner${isFlipped ? " is-flipped" : ""}`}>

          {/* ── FRONT ─────────────────────────────────── */}
          {/* Outer gradient border wrapper */}
          <div className="card-face absolute inset-0 rounded-[1.25rem] overflow-hidden p-[2px] flex flex-col" style={cardBorderStyle}>
            <div className="flex-1 rounded-[calc(1.25rem-2px)] overflow-hidden relative flex flex-col" style={cardInnerStyle}>

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
              <div className="px-3 pb-3 flex flex-col gap-1.5 relative z-10 shrink-0">
                <span className="text-xs tracking-widest font-bold font-pixel text-accent-gold">
                  #{String(pokemon.id).padStart(3, "0")}
                </span>
                <span className="capitalize font-bold text-sm text-text-primary leading-tight">
                  {pokemon.name}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {pokemon.types.map((t) => (
                    <Badge key={t.slot} name={t.typeName} />
                  ))}
                </div>
              </div>

              {/* Holographic overlays */}
              <div className="card-holo pointer-events-none absolute inset-0 rounded-[inherit] z-10" />
              <div className="card-gloss pointer-events-none absolute inset-0 rounded-[inherit] z-[11]" />
            </div>
          </div>

          {/* ── BACK ──────────────────────────────────── */}
          <div className="card-face card-face-back absolute inset-0 rounded-[1.25rem] overflow-hidden p-[2px] flex flex-col" style={cardBorderStyle}>
            <div className="flex-1 rounded-[calc(1.25rem-2px)] overflow-hidden relative flex flex-col p-4 gap-3" style={cardInnerStyle}>

              {/* Header */}
              <div className="flex justify-between items-baseline border-b border-dark-600 pb-3">
                <span className="capitalize font-bold text-sm text-text-primary">
                  {pokemon.name}
                </span>
                <span className="text-xs tracking-wider font-bold font-pixel text-accent-gold">
                  #{String(pokemon.id).padStart(3, "0")}
                </span>
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-2 flex-1">
                {pokemon.stats?.slice(0, 3).map((stat) => (
                  <div key={stat.name} className="flex items-center gap-2">
                    <span className="text-right capitalize shrink-0 text-[0.65rem] w-16 text-text-muted">
                      {stat.name.replace("-", " ")}
                    </span>
                    <span
                      className="text-right shrink-0 font-bold text-[0.7rem] w-7 font-pixel"
                      style={{ color: STAT_COLORS[stat.name] ?? "#aaa" }}
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

              {/* Action buttons */}
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={handleDetailClick}
                  className="relative overflow-hidden px-4 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 text-[#13131f] bg-[linear-gradient(135deg,#ffd700_0%,#ffed4e_100%)] border-2 border-[#ffed4e] shadow-[0_4px_12px_rgba(255,215,0,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_6px_20px_rgba(255,215,0,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-px active:translate-y-0 active:shadow-[0_2px_8px_rgba(255,215,0,0.25),inset_0_2px_4px_rgba(0,0,0,0.2)] before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] before:[transition:left_0.5s_ease] hover:before:left-full w-full"
                  data-testid="pokemon-card-detail-btn"
                >
                  <span className="relative z-[1]">View Full Detail →</span>
                </button>
                <button
                  onClick={handleCompareClick}
                  disabled={!isInCompare && compareSlotsFull}
                  className={cn(
                    "relative overflow-hidden py-[0.45rem] px-3 text-[0.72rem] font-bold tracking-[0.05em] rounded-[0.6rem] bg-dark-700 border border-dark-600 text-text-muted cursor-pointer transition-all duration-200 w-full",
                    "hover:enabled:bg-accent-gold/8 hover:enabled:border-accent-gold/35 hover:enabled:text-accent-gold hover:enabled:shadow-[0_2px_12px_rgba(255,215,0,0.15)]",
                    isInCompare && "!bg-accent-gold/12 !border-accent-gold/50 !text-accent-gold",
                    !isInCompare && compareSlotsFull && "opacity-35 !cursor-not-allowed"
                  )}
                  title={
                    isInCompare
                      ? "Remove from comparison"
                      : compareSlotsFull
                      ? "Comparison slots full"
                      : slotA === null
                      ? "Add to compare (slot A)"
                      : "Add to compare (slot B) — will open comparison"
                  }
                  data-testid="compare-btn"
                >
                  {isInCompare ? "✓ Selected for Compare" : "⚔ Compare"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
