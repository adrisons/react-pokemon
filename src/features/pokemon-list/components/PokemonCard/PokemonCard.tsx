import { useCallback, useRef, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Swords } from "lucide-react";
import type { PokemonDetail } from "@core/domain/pokemon";
import Badge from "@shared/ui/components/Badge/Badge";
import { Button } from "@shared/ui/components/ui/button";
import { statColorVar } from "@shared/constants/statColors";
import typeColors from "@shared/constants/typeColors";
import cardBack from "@shared/assets/pokemon-card-back.svg";
import { useCompareStore } from "@features/compare/store/compareStore";
import { cn } from "@shared/lib/utils";

const STAT_SHORT: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.A",
  "special-defense": "SP.D",
  speed: "SPD",
};

const CARD_RADIUS = "rounded-xl sm:rounded-2xl";
const CARD_INNER_RADIUS =
  "rounded-[calc(1.25rem-2px)] sm:rounded-[calc(1.75rem-2px)]";

interface Props {
  pokemon: PokemonDetail;
}

function PokemonCard({ pokemon }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const isHovering = useRef(false);
  const navigate = useNavigate();
  const { slotA, slotB, selectPokemon, removePokemon } = useCompareStore();

  const pokemonIdStr = String(pokemon.id);
  const isInCompare = slotA === pokemonIdStr || slotB === pokemonIdStr;
  const compareSlotsFull = slotA !== null && slotB !== null;

  const backStats = pokemon.stats?.slice(0, 3) ?? [];
  const maxBackStat = Math.max(...backStats.map((s) => s.value));
  const primaryType = pokemon.types[0]?.typeName;
  const typeColor = primaryType ? typeColors[primaryType] : "var(--color-text-muted)";

  const handleCardTap = useCallback(() => {
    if (!isHovering.current) setIsFlipped((prev) => !prev);
  }, []);

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

  return (
    <div
      className="group [perspective:900px] aspect-[2/3] sm:aspect-auto sm:h-96 select-none cursor-pointer motion-safe:animate-card-entry"
      style={{ "--type-color": typeColor } as CSSProperties}
      onClick={handleCardTap}
      onMouseEnter={() => { isHovering.current = true; setIsFlipped(true); }}
      onMouseLeave={() => { isHovering.current = false; setIsFlipped(false); }}
      data-testid="pokemon-card"
      data-pokemon-name={pokemon.name}
    >
      <div className={cn(CARD_RADIUS, "h-full shadow-card group-hover:shadow-card-hover transition-shadow duration-300 [transform-style:preserve-3d]")}>
        <div className={cn("h-full card-inner", isFlipped && "is-flipped")}>

          {/* ── FRONT ─────────────────────────────────── */}
          <div className={cn("card-face pkm-card-border absolute inset-0 overflow-hidden p-[2px] flex flex-col", CARD_RADIUS)}>
            <div className={cn("pkm-card-inner flex-1 overflow-hidden relative flex flex-col", CARD_INNER_RADIUS)}>

              <div className="flex items-center justify-center relative flex-1 min-h-0">
                <img
                  src={pokemon.imageUrl ?? cardBack}
                  alt={pokemon.name}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    "w-3/4 h-3/4 object-contain",
                    pokemon.imageUrl && "pkm-card-image"
                  )}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = cardBack;
                  }}
                />
              </div>

              <div className="px-2 pb-2 sm:px-3 sm:pb-3 flex flex-col gap-1 sm:gap-2 relative z-10 shrink-0">
                <span className="text-caption tracking-widest font-bold font-pixel text-accent-gold">
                  #{String(pokemon.id).padStart(3, "0")}
                </span>
                <div className="flex items-center gap-2">
                  <span className="capitalize font-bold text-caption sm:text-body text-text-primary leading-tight truncate">
                    {pokemon.name}
                  </span>
                  <div className="flex gap-1 shrink-0 sm:hidden">
                    {pokemon.types.map((t) => (
                      <Badge key={t.slot} name={t.typeName} compact />
                    ))}
                  </div>
                </div>
                <div className="hidden sm:flex flex-wrap gap-2">
                  {pokemon.types.map((t) => (
                    <Badge key={t.slot} name={t.typeName} />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ── BACK ──────────────────────────────────── */}
          <div className={cn("card-face card-face-back pkm-card-border absolute inset-0 overflow-hidden p-[2px] flex flex-col", CARD_RADIUS)}>
            <div className={cn("pkm-card-inner flex-1 overflow-hidden relative flex flex-col", CARD_INNER_RADIUS, "p-3 gap-2 sm:p-4 sm:gap-3")}>

              <div className="flex justify-between items-baseline gap-2 border-b border-dark-600 pb-2 sm:pb-3">
                <span className="capitalize font-bold text-label sm:text-body text-text-primary truncate">
                  {pokemon.name}
                </span>
                <span className="text-caption tracking-wider font-bold font-pixel text-accent-gold shrink-0">
                  #{String(pokemon.id).padStart(3, "0")}
                </span>
              </div>

              <div className="flex flex-col gap-2 flex-1 justify-center">
                {backStats.map((stat) => (
                  <div
                    key={stat.name}
                    className="flex items-center gap-1 sm:gap-2"
                    style={{ "--stat-color": statColorVar(stat.name), "--bar-w": `${(stat.value / maxBackStat) * 100}%` } as CSSProperties}
                  >
                    <span className="text-right uppercase shrink-0 text-caption sm:w-16 text-text-muted sm:capitalize">
                      <span className="sm:hidden">{STAT_SHORT[stat.name] ?? stat.name}</span>
                      <span className="hidden sm:inline">{stat.name.replace("-", " ")}</span>
                    </span>
                    <span className="text-right shrink-0 font-bold text-mono w-6 sm:w-8 font-pixel text-[var(--stat-color)]">
                      {stat.value}
                    </span>
                    <div className="flex-1 h-1 sm:h-2 rounded-full overflow-hidden bg-dark-700">
                      <div
                        className="h-full rounded-full bg-[var(--stat-color)] w-[var(--bar-w)]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-1 sm:flex-col sm:gap-2 shrink-0 min-w-0">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDetailClick}
                  className="min-w-0 flex-1 sm:flex-none sm:w-full"
                  data-testid="pokemon-card-detail-btn"
                >
                  <span className="sm:hidden">Info</span>
                  <span className="hidden sm:inline">Details</span>
                  <ArrowRight className="hidden sm:block shrink-0" aria-hidden="true" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCompareClick}
                  disabled={!isInCompare && compareSlotsFull}
                  className={cn(
                    "min-w-0 shrink-0 sm:w-full",
                    isInCompare && "border-accent-gold/60 bg-accent-gold/15 text-accent-gold"
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
                  {isInCompare ? (
                    <>
                      <Check className="shrink-0" aria-hidden="true" />
                      <span className="hidden sm:inline truncate">Selected</span>
                    </>
                  ) : (
                    <>
                      <Swords className="shrink-0" aria-hidden="true" />
                      <span className="hidden sm:inline truncate">Compare</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
