import React from "react";
import { cn } from "@shared/lib/utils";
import { STAT_COLORS } from "@shared/constants/statColors";
import typeColors from "@shared/constants/typeColors";
import type { PokemonDetail } from "@core/domain/pokemon";
import cardBack from "@shared/assets/pokemon-card-back.svg";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@shared/ui/components/ui/tooltip";
import CompareInsights from "@features/compare/components/CompareInsights/CompareInsights";

interface Props {
  pokemonA: PokemonDetail;
  pokemonB: PokemonDetail;
}

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "Sp.ATK",
  "special-defense": "Sp.DEF",
  speed: "SPD",
};

const STAT_DESCRIPTIONS: Record<string, { title: string; body: string; icon: string }> = {
  hp: {
    title: "Hit Points",
    body: "Total health. Determines how much damage a Pokémon can absorb before fainting.",
    icon: "❤️",
  },
  attack: {
    title: "Attack",
    body: "Power of physical moves like Tackle or Earthquake. Higher = harder physical hits.",
    icon: "⚔️",
  },
  defense: {
    title: "Defense",
    body: "Resistance to physical moves. Reduces incoming damage from attacks like Tackle.",
    icon: "🛡️",
  },
  "special-attack": {
    title: "Special Attack",
    body: "Power of special moves like Flamethrower or Psychic. Higher = stronger special hits.",
    icon: "✨",
  },
  "special-defense": {
    title: "Special Defense",
    body: "Resistance to special moves. Reduces incoming damage from Flamethrower and alike.",
    icon: "🔮",
  },
  speed: {
    title: "Speed",
    body: "Determines turn order. The faster Pokémon attacks first each round.",
    icon: "⚡",
  },
};

const STAT_ORDER = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];

function StatLabel({ statName, label, color }: { statName: string; label: string; color: string }) {
  const desc = STAT_DESCRIPTIONS[statName];
  if (!desc) return <span className="font-pixel text-[0.55rem] tracking-[0.1em] uppercase text-text-muted leading-none" style={{ color }}>{label}</span>;

  return (
    <Tooltip>
      <TooltipTrigger render={
        <span
          className="font-pixel text-[0.55rem] tracking-[0.1em] uppercase text-text-muted leading-none cursor-help underline decoration-dotted underline-offset-2"
          style={{ color }}
        >
          {label}
        </span>
      } />
      <TooltipContent
        side="top"
        className={cn(
          "max-w-55 rounded-xl border px-3.5 py-2.5",
          "bg-[#0f1117]/95 border-white/10 backdrop-blur-md shadow-xl shadow-black/40",
          "text-left"
        )}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm leading-none">{desc.icon}</span>
          <span
            className="text-xs font-semibold tracking-wide uppercase font-pixel"
            style={{ color }}
          >
            {desc.title}
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-white/70">{desc.body}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function CompareStats({ pokemonA, pokemonB }: Props) {
  const statsA = Object.fromEntries(pokemonA.stats.map((s) => [s.name, s.value]));
  const statsB = Object.fromEntries(pokemonB.stats.map((s) => [s.name, s.value]));

  const colorA = pokemonA.types[0] ? typeColors[pokemonA.types[0].typeName] : "#6868aa";
  const colorB = pokemonB.types[0] ? typeColors[pokemonB.types[0].typeName] : "#6868aa";

  const globalMax = Math.max(
    ...pokemonA.stats.map((s) => s.value),
    ...pokemonB.stats.map((s) => s.value),
    1,
  );

  return (
    <div
      className="bg-dark-800 border border-dark-600 rounded-3xl p-7 animate-compare-in"
      data-testid="compare-stats"
      style={{ "--insight-color-a": colorA, "--insight-color-b": colorB } as React.CSSProperties}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-8 pb-7 border-b border-dark-600">
        <PokemonHeader pokemon={pokemonA} typeColor={colorA} side="a" />
        <div className="flex items-center justify-center px-2">
          <span className="font-pixel text-[0.85rem] tracking-[0.12em] text-text-muted">VS</span>
        </div>
        <PokemonHeader pokemon={pokemonB} typeColor={colorB} side="b" />
      </div>

      <div className="flex flex-col gap-3.5">
        {STAT_ORDER.map((statName) => {
          const valA = statsA[statName] ?? 0;
          const valB = statsB[statName] ?? 0;
          const aWins = valA > valB;
          const bWins = valB > valA;
          const color = STAT_COLORS[statName] ?? "#aaa";

          const pctA = (valA / globalMax) * 100;
          const pctB = (valB / globalMax) * 100;

          return (
            <div key={statName} className="grid grid-cols-[2.75rem_1fr_3.5rem_1fr_2.75rem] items-center gap-2 animate-stat-row" data-testid={`stat-row-${statName}`}>
              <span
                className={cn(
                  "font-pixel text-xs font-bold text-text-muted transition-colors duration-200 leading-none text-right",
                  aWins && "text-[0.82rem]"
                )}
                style={{ color: aWins ? colorA : undefined }}
                data-testid={`stat-a-${statName}`}
              >
                {valA}
              </span>

              <div className="h-[5px] bg-dark-700 rounded-full overflow-hidden flex justify-end">
                <div
                  className="h-full rounded-full [transition:width_0.6s_cubic-bezier(0.34,1.56,0.64,1),opacity_0.3s_ease]"
                  style={{
                    width: `${pctA}%`,
                    backgroundColor: color,
                    opacity: aWins || (!aWins && !bWins) ? 1 : 0.4,
                  }}
                />
              </div>

              <div className="flex items-center justify-center">
                <StatLabel statName={statName} label={STAT_LABELS[statName] ?? statName} color={color} />
              </div>

              <div className="h-[5px] bg-dark-700 rounded-full overflow-hidden flex justify-start">
                <div
                  className="h-full rounded-full [transition:width_0.6s_cubic-bezier(0.34,1.56,0.64,1),opacity_0.3s_ease]"
                  style={{
                    width: `${pctB}%`,
                    backgroundColor: color,
                    opacity: bWins || (!aWins && !bWins) ? 1 : 0.4,
                  }}
                />
              </div>

              <span
                className={cn(
                  "font-pixel text-xs font-bold text-text-muted transition-colors duration-200 leading-none text-left",
                  bWins && "text-[0.82rem]"
                )}
                style={{ color: bWins ? colorB : undefined }}
                data-testid={`stat-b-${statName}`}
              >
                {valB}
              </span>
            </div>
          );
        })}
      </div>

      <TotalRow pokemonA={pokemonA} pokemonB={pokemonB} colorA={colorA} colorB={colorB} />

      <CompareInsights pokemonA={pokemonA} pokemonB={pokemonB} />
    </div>
  );
}

function PokemonHeader({
  pokemon,
  typeColor,
}: {
  pokemon: PokemonDetail;
  typeColor: string;
  side: "a" | "b";
}) {
  return (
    <div className="group/pokemon flex flex-col items-center gap-1 text-center">
      <div
        className="w-28 h-28 flex items-center justify-center rounded-full mb-1.5"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${typeColor}25 0%, transparent 70%)`,
        }}
      >
        <img
          src={pokemon.imageUrl ?? cardBack}
          alt={pokemon.name}
          className="w-[6.5rem] h-[6.5rem] object-contain transition-transform duration-300 group-hover/pokemon:scale-[1.08] group-hover/pokemon:-translate-y-[3px]"
          style={{ filter: `drop-shadow(0 4px 16px ${typeColor}60)` }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = cardBack;
            (e.currentTarget as HTMLImageElement).style.filter = "none";
          }}
        />
      </div>
      <span className="text-[0.65rem] font-bold tracking-[0.06em] opacity-80 font-pixel text-accent-gold">
        #{String(pokemon.id).padStart(3, "0")}
      </span>
      <span className="text-[1.05rem] font-bold text-text-primary leading-[1.1] capitalize">
        {pokemon.name}
      </span>
      <div className="flex gap-1.5 flex-wrap justify-center mt-1">
        {pokemon.types.map((t) => (
          <span
            key={t.slot}
            className="text-[0.65rem] font-semibold tracking-[0.06em] uppercase py-[0.2rem] px-2 rounded-full border border-transparent"
            style={{
              backgroundColor: `${typeColors[t.typeName]}22`,
              color: typeColors[t.typeName],
              borderColor: `${typeColors[t.typeName]}50`,
            }}
          >
            {t.typeName}
          </span>
        ))}
      </div>
    </div>
  );
}

function TotalRow({
  pokemonA,
  pokemonB,
  colorA,
  colorB,
}: {
  pokemonA: PokemonDetail;
  pokemonB: PokemonDetail;
  colorA: string;
  colorB: string;
}) {
  const totalA = pokemonA.stats.reduce((s, x) => s + x.value, 0);
  const totalB = pokemonB.stats.reduce((s, x) => s + x.value, 0);
  const aWins = totalA > totalB;
  const bWins = totalB > totalA;

  return (
    <div className="grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-3 mt-5 pt-5 border-t border-dark-600">
      <span
        className={cn(
          "font-pixel text-[0.9rem] font-bold text-text-muted transition-colors duration-200 text-right",
          aWins && "text-base"
        )}
        style={aWins ? { color: colorA } : undefined}
        data-testid="total-a"
      >
        {totalA}
      </span>
      <span className="text-[0.6rem] tracking-[0.14em] uppercase text-text-muted text-center font-pixel">
        BST
      </span>
      <span
        className={cn(
          "font-pixel text-[0.9rem] font-bold text-text-muted transition-colors duration-200 text-left",
          bWins && "text-base"
        )}
        style={bWins ? { color: colorB } : undefined}
        data-testid="total-b"
      >
        {totalB}
      </span>
    </div>
  );
}

export default CompareStats;
