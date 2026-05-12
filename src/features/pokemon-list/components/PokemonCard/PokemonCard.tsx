import { useRef, useState, type CSSProperties } from "react";
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
  const typeColor = primaryType ? typeColors[primaryType] : "var(--color-text-muted)";

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

  return (
    <div
      ref={cardRef}
      className="group [perspective:900px] h-96 select-none cursor-pointer motion-safe:animate-card-entry"
      style={{ "--type-color": typeColor } as CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-testid="pokemon-card"
      data-pokemon-name={pokemon.name}
    >
      <div className="card-tilt rounded-3xl h-full shadow-card group-hover:shadow-card-hover">
        <div className={cn("h-full card-inner", isFlipped && "is-flipped")}>

          {/* ── FRONT ─────────────────────────────────── */}
          <div className="card-face pkm-card-border absolute inset-0 rounded-3xl overflow-hidden p-[2px] flex flex-col">
            <div className="pkm-card-inner flex-1 rounded-[calc(1.5rem-2px)] overflow-hidden relative flex flex-col">

              <div className="pkm-card-image-bg flex items-center justify-center relative flex-1 min-h-0">
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

              <div className="px-3 pb-3 flex flex-col gap-2 relative z-10 shrink-0">
                <span className="text-caption tracking-widest font-bold font-pixel text-accent-gold">
                  #{String(pokemon.id).padStart(3, "0")}
                </span>
                <span className="capitalize font-bold text-body text-text-primary leading-tight">
                  {pokemon.name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {pokemon.types.map((t) => (
                    <Badge key={t.slot} name={t.typeName} />
                  ))}
                </div>
              </div>

              <div className="card-holo pointer-events-none absolute inset-0 rounded-[inherit] z-10" aria-hidden="true" />
              <div className="card-gloss pointer-events-none absolute inset-0 rounded-[inherit] z-[11]" aria-hidden="true" />
            </div>
          </div>

          {/* ── BACK ──────────────────────────────────── */}
          <div className="card-face card-face-back pkm-card-border absolute inset-0 rounded-3xl overflow-hidden p-[2px] flex flex-col">
            <div className="pkm-card-inner flex-1 rounded-[calc(1.5rem-2px)] overflow-hidden relative flex flex-col p-4 gap-3">

              <div className="flex justify-between items-baseline border-b border-dark-600 pb-3">
                <span className="capitalize font-bold text-body text-text-primary">
                  {pokemon.name}
                </span>
                <span className="text-caption tracking-wider font-bold font-pixel text-accent-gold">
                  #{String(pokemon.id).padStart(3, "0")}
                </span>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                {pokemon.stats?.slice(0, 3).map((stat) => (
                  <div
                    key={stat.name}
                    className="flex items-center gap-2"
                    style={{ "--stat-color": statColorVar(stat.name), "--bar-w": `${Math.min(100, (stat.value / 255) * 100)}%` } as CSSProperties}
                  >
                    <span className="text-right capitalize shrink-0 text-caption w-16 text-text-muted">
                      {stat.name.replace("-", " ")}
                    </span>
                    <span className="text-right shrink-0 font-bold text-mono w-7 font-pixel text-[var(--stat-color)]">
                      {stat.value}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-dark-700">
                      <div
                        className="h-full rounded-full bg-[var(--stat-color)] w-[var(--bar-w)]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDetailClick}
                  className="w-full"
                  data-testid="pokemon-card-detail-btn"
                >
                  <span>View Full Detail</span>
                  <ArrowRight aria-hidden="true" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCompareClick}
                  disabled={!isInCompare && compareSlotsFull}
                  className={cn(
                    "w-full",
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
                      <Check aria-hidden="true" />
                      <span>Selected</span>
                    </>
                  ) : (
                    <>
                      <Swords aria-hidden="true" />
                      <span>Compare</span>
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
