import type { CSSProperties } from "react";
import { cn } from "@shared/lib/utils";
import { statColorVar } from "@shared/constants/statColors";
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
  hp: { title: "Hit Points", body: "Total health. Determines how much damage a Pokémon can absorb before fainting.", icon: "❤️" },
  attack: { title: "Attack", body: "Power of physical moves like Tackle or Earthquake. Higher = harder physical hits.", icon: "⚔️" },
  defense: { title: "Defense", body: "Resistance to physical moves. Reduces incoming damage from attacks like Tackle.", icon: "🛡️" },
  "special-attack": { title: "Special Attack", body: "Power of special moves like Flamethrower or Psychic. Higher = stronger special hits.", icon: "✨" },
  "special-defense": { title: "Special Defense", body: "Resistance to special moves. Reduces incoming damage from Flamethrower and alike.", icon: "🔮" },
  speed: { title: "Speed", body: "Determines turn order. The faster Pokémon attacks first each round.", icon: "⚡" },
};

const STAT_ORDER = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];

function StatLabel({ statName, label }: { statName: string; label: string }) {
  const desc = STAT_DESCRIPTIONS[statName];
  if (!desc) {
    return (
      <span className="font-pixel text-caption tracking-[0.12em] uppercase leading-none text-[var(--stat-color)]">
        {label}
      </span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger render={
        <span className="font-pixel text-caption tracking-[0.12em] uppercase leading-none cursor-help underline decoration-dotted underline-offset-2 text-[var(--stat-color)]">
          {label}
        </span>
      } />
      <TooltipContent
        side="top"
        className={cn(
          "max-w-55 rounded-xl border px-4 py-3",
          "bg-dark-900/95 border-dark-600 backdrop-blur-md shadow-xl shadow-black/40",
          "text-left"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-body leading-none">{desc.icon}</span>
          <span className="text-label font-semibold tracking-wide uppercase font-pixel text-[var(--stat-color)]">
            {desc.title}
          </span>
        </div>
        <p className="text-caption leading-relaxed text-text-primary/80">{desc.body}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function CompareStats({ pokemonA, pokemonB }: Props) {
  const statsA = Object.fromEntries(pokemonA.stats.map((s) => [s.name, s.value]));
  const statsB = Object.fromEntries(pokemonB.stats.map((s) => [s.name, s.value]));

  const colorA = pokemonA.types[0] ? typeColors[pokemonA.types[0].typeName] : "var(--color-text-muted)";
  const colorB = pokemonB.types[0] ? typeColors[pokemonB.types[0].typeName] : "var(--color-text-muted)";

  const globalMax = Math.max(
    ...pokemonA.stats.map((s) => s.value),
    ...pokemonB.stats.map((s) => s.value),
    1,
  );

  return (
    <section
      aria-labelledby="compare-stats-heading"
      className="bg-dark-800 border border-dark-600 rounded-3xl p-8 motion-safe:animate-compare-in"
      data-testid="compare-stats"
      style={{
        "--color-a": colorA,
        "--color-b": colorB,
        "--insight-color-a": colorA,
        "--insight-color-b": colorB,
      } as CSSProperties}
    >
      <h2 id="compare-stats-heading" className="sr-only">Stats comparison</h2>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-8 pb-8 border-b border-dark-600">
        <PokemonHeader pokemon={pokemonA} typeColor={colorA} />
        <div className="flex items-center justify-center px-2" aria-hidden="true">
          <span className="font-pixel text-label tracking-[0.12em] text-text-muted">VS</span>
        </div>
        <PokemonHeader pokemon={pokemonB} typeColor={colorB} />
      </div>

      <div className="flex flex-col gap-4">
        {STAT_ORDER.map((statName) => {
          const valA = statsA[statName] ?? 0;
          const valB = statsB[statName] ?? 0;
          const aWins = valA > valB;
          const bWins = valB > valA;

          const pctA = (valA / globalMax) * 100;
          const pctB = (valB / globalMax) * 100;

          return (
            <div
              key={statName}
              className="grid grid-cols-[2.75rem_1fr_3.5rem_1fr_2.75rem] items-center gap-2 motion-safe:animate-stat-row"
              style={{ "--stat-color": statColorVar(statName), "--pct-a": `${pctA}%`, "--pct-b": `${pctB}%` } as CSSProperties}
              data-testid={`stat-row-${statName}`}
            >
              <span
                className={cn(
                  "font-pixel text-label font-bold transition-colors duration-200 leading-none text-right",
                  aWins ? "text-[var(--color-a)]" : "text-text-muted"
                )}
                data-testid={`stat-a-${statName}`}
              >
                {valA}
              </span>

              <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden flex justify-end">
                <div
                  className={cn(
                    "h-full rounded-full bg-[var(--stat-color)] w-[var(--pct-a)]",
                    "motion-safe:[transition:width_0.6s_cubic-bezier(0.34,1.56,0.64,1),opacity_0.3s_ease]",
                    !aWins && bWins && "opacity-40"
                  )}
                />
              </div>

              <div className="flex items-center justify-center">
                <StatLabel statName={statName} label={STAT_LABELS[statName] ?? statName} />
              </div>

              <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden flex justify-start">
                <div
                  className={cn(
                    "h-full rounded-full bg-[var(--stat-color)] w-[var(--pct-b)]",
                    "motion-safe:[transition:width_0.6s_cubic-bezier(0.34,1.56,0.64,1),opacity_0.3s_ease]",
                    !bWins && aWins && "opacity-40"
                  )}
                />
              </div>

              <span
                className={cn(
                  "font-pixel text-label font-bold transition-colors duration-200 leading-none text-left",
                  bWins ? "text-[var(--color-b)]" : "text-text-muted"
                )}
                data-testid={`stat-b-${statName}`}
              >
                {valB}
              </span>
            </div>
          );
        })}
      </div>

      <TotalRow pokemonA={pokemonA} pokemonB={pokemonB} />
      <CompareInsights pokemonA={pokemonA} pokemonB={pokemonB} />
    </section>
  );
}

function PokemonHeader({
  pokemon,
  typeColor,
}: {
  pokemon: PokemonDetail;
  typeColor: string;
}) {
  return (
    <div
      className="group/pokemon flex flex-col items-center gap-1 text-center"
      style={{ "--type-color": typeColor } as CSSProperties}
    >
      <div className="pkm-compare-avatar-bg w-28 h-28 flex items-center justify-center rounded-full mb-2">
        <img
          src={pokemon.imageUrl ?? cardBack}
          alt={pokemon.name}
          className="pkm-compare-avatar-image w-26 h-26 object-contain motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/pokemon:scale-[1.08]"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = cardBack;
          }}
        />
      </div>
      <span className="text-caption font-bold tracking-[0.12em] opacity-85 font-pixel text-accent-gold">
        #{String(pokemon.id).padStart(3, "0")}
      </span>
      <span className="text-body font-bold text-text-primary capitalize">
        {pokemon.name}
      </span>
      <div className="flex gap-2 flex-wrap justify-center mt-1">
        {pokemon.types.map((t) => (
          <span
            key={t.slot}
            className="pkm-type-pill text-caption font-semibold tracking-[0.06em] uppercase py-1 px-2 rounded-full border"
            style={{ "--type-color": typeColors[t.typeName] } as CSSProperties}
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
}: {
  pokemonA: PokemonDetail;
  pokemonB: PokemonDetail;
}) {
  const totalA = pokemonA.stats.reduce((s, x) => s + x.value, 0);
  const totalB = pokemonB.stats.reduce((s, x) => s + x.value, 0);
  const aWins = totalA > totalB;
  const bWins = totalB > totalA;

  return (
    <div className="grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-3 mt-6 pt-6 border-t border-dark-600">
      <span
        className={cn(
          "font-pixel text-label font-bold transition-colors duration-200 text-right",
          aWins ? "text-[var(--color-a)]" : "text-text-muted"
        )}
        data-testid="total-a"
      >
        {totalA}
      </span>
      <span className="text-caption tracking-[0.18em] uppercase text-text-muted text-center font-pixel">
        BST
      </span>
      <span
        className={cn(
          "font-pixel text-label font-bold transition-colors duration-200 text-left",
          bWins ? "text-[var(--color-b)]" : "text-text-muted"
        )}
        data-testid="total-b"
      >
        {totalB}
      </span>
    </div>
  );
}

export default CompareStats;
