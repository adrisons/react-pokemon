import { cn } from "@shared/lib/utils";
import type { PokemonDetail } from "@core/domain/pokemon";
import { getOffensiveMultiplier, countImmunities } from "@features/compare/utils/typeEffectiveness";

interface Props {
  pokemonA: PokemonDetail;
  pokemonB: PokemonDetail;
}

interface Insight {
  icon: string;
  text: string;
  highlight?: "a" | "b" | "neutral";
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function bst(p: PokemonDetail) {
  return p.stats.reduce((acc, s) => acc + s.value, 0);
}

function getStat(p: PokemonDetail, name: string) {
  return p.stats.find((s) => s.name === name)?.value ?? 0;
}

function buildInsights(a: PokemonDetail, b: PokemonDetail): Insight[] {
  const insights: Insight[] = [];

  const typesA = a.types.map((t) => t.typeName);
  const typesB = b.types.map((t) => t.typeName);

  // --- Legendary / Mythical / Baby status ---
  const statusA = a.isLegendary ? "⚡ legendary" : a.isMythical ? "✨ mythical" : a.isBaby ? "🍼 baby" : null;
  const statusB = b.isLegendary ? "⚡ legendary" : b.isMythical ? "✨ mythical" : b.isBaby ? "🍼 baby" : null;
  if (statusA || statusB) {
    if (statusA && statusB) {
      insights.push({
        icon: "👑",
        text: `${capitalize(a.name)} is ${statusA} and ${capitalize(b.name)} is ${statusB}. An elite match!`,
        highlight: "neutral",
      });
    } else if (statusA) {
      insights.push({
        icon: "👑",
        text: `${capitalize(a.name)} is ${statusA}. The lineage advantage is real.`,
        highlight: "a",
      });
    } else if (statusB) {
      insights.push({
        icon: "👑",
        text: `${capitalize(b.name)} is ${statusB}. The lineage advantage is real.`,
        highlight: "b",
      });
    }
  }

  // --- BST comparison (only if difference >= 10%) ---
  const bstA = bst(a);
  const bstB = bst(b);
  const bstDiff = Math.abs(bstA - bstB);
  const bstPct = Math.round((bstDiff / Math.min(bstA, bstB)) * 100);
  if (bstPct >= 10) {
    const winner = bstA > bstB ? a : b;
    const loser = bstA > bstB ? b : a;
    insights.push({
      icon: "📊",
      text: `${capitalize(winner.name)} has ${bstPct}% more BST than ${capitalize(loser.name)}.`,
      highlight: bstA > bstB ? "a" : "b",
    });
  }

  // --- Speed advantage when BST loser has higher speed ---
  const spdA = getStat(a, "speed");
  const spdB = getStat(b, "speed");
  if (bstA !== bstB) {
    const lowerBst = bstA < bstB ? a : b;
    const higherBst = bstA < bstB ? b : a;
    const lowerSpd = lowerBst === a ? spdA : spdB;
    const higherSpd = higherBst === a ? spdA : spdB;
    if (lowerSpd > higherSpd) {
      insights.push({
        icon: "⚡",
        text: `Despite lower BST, ${capitalize(lowerBst.name)} is faster — it will strike first in almost any scenario.`,
        highlight: lowerBst === a ? "a" : "b",
      });
    }
  }

  // --- Glass cannon vs tank ---
  const atkA = getStat(a, "attack") + getStat(a, "special-attack");
  const defA = getStat(a, "defense") + getStat(a, "special-defense");
  const atkB = getStat(b, "attack") + getStat(b, "special-attack");
  const defB = getStat(b, "defense") + getStat(b, "special-defense");
  const ratioA = atkA / (defA || 1);
  const ratioB = atkB / (defB || 1);

  const isGlassCannonA = ratioA >= 1.5;
  const isTankA = ratioA <= 0.7;
  const isGlassCannonB = ratioB >= 1.5;
  const isTankB = ratioB <= 0.7;

  if (isGlassCannonA && !isGlassCannonB) {
    insights.push({ icon: "💥", text: `${capitalize(a.name)} is a glass cannon: high offense, low defense. Strike first or fall.`, highlight: "a" });
  } else if (isGlassCannonB && !isGlassCannonA) {
    insights.push({ icon: "💥", text: `${capitalize(b.name)} is a glass cannon: high offense, low defense. Strike first or fall.`, highlight: "b" });
  } else if (isGlassCannonA && isGlassCannonB) {
    insights.push({ icon: "💥", text: `Both are glass cannons. This fight is decided in the first turn.`, highlight: "neutral" });
  }

  if (isTankA && !isTankB) {
    insights.push({ icon: "🛡️", text: `${capitalize(a.name)} is a tank — prioritizes endurance over hitting.`, highlight: "a" });
  } else if (isTankB && !isTankA) {
    insights.push({ icon: "🛡️", text: `${capitalize(b.name)} is a tank — prioritizes endurance over hitting.`, highlight: "b" });
  }

  // --- Type vulnerability cross-check ---
  const multAvsB = getOffensiveMultiplier(typesA, typesB); // A attacks B
  const multBvsA = getOffensiveMultiplier(typesB, typesA); // B attacks A

  if (multAvsB >= 2) {
    const label = multAvsB === 4 ? "×4" : multAvsB >= 4 ? `×${multAvsB}` : "×2";
    insights.push({
      icon: "🎯",
      text: `${capitalize(a.name)} deals ${label} damage to ${capitalize(b.name)} due to type advantage.`,
      highlight: "a",
    });
  }
  if (multBvsA >= 2) {
    const label = multBvsA === 4 ? "×4" : multBvsA >= 4 ? `×${multBvsA}` : "×2";
    insights.push({
      icon: "🎯",
      text: `${capitalize(b.name)} deals ${label} damage to ${capitalize(a.name)} due to type advantage.`,
      highlight: "b",
    });
  }

  // --- Immunities ---
  const immA = countImmunities(typesA);
  const immB = countImmunities(typesB);
  if (immA !== immB) {
    const more = immA > immB ? a : b;
    const less = immA > immB ? b : a;
    const moreCount = immA > immB ? immA : immB;
    const lessCount = immA > immB ? immB : immA;
    const lessText = lessCount === 0 ? "none" : `only ${lessCount}`;
    insights.push({
      icon: "🚫",
      text: `${capitalize(more.name)} is immune to ${moreCount} type${moreCount !== 1 ? "s" : ""}, while ${capitalize(less.name)} has ${lessText}.`,
      highlight: more === a ? "a" : "b",
    });
  }

  // --- Capture rate ---
  const crA = a.captureRate;
  const crB = b.captureRate;
  if (crA > 0 && crB > 0 && crA !== crB) {
    const harder = crA < crB ? a : b;
    const ratio = Math.round(Math.max(crA, crB) / Math.min(crA, crB));
    if (ratio >= 2) {
      insights.push({
        icon: "🎣",
        text: `${capitalize(harder.name)} is ~${ratio}× harder to catch. Better bring plenty of Poké Balls.`,
        highlight: harder === a ? "a" : "b",
      });
    }
  }

  // --- Moves count ---
  const movA = a.movesCount;
  const movB = b.movesCount;
  if (movA > 0 && movB > 0) {
    const moreMoves = movA > movB ? a : b;
    const pct = Math.round((Math.max(movA, movB) / Math.min(movA, movB) - 1) * 100);
    if (pct >= 40) {
      insights.push({
        icon: "📚",
        text: `${capitalize(moreMoves.name)} learns ${pct}% more moves — its battle versatility is greater.`,
        highlight: moreMoves === a ? "a" : "b",
      });
    }
  }

  return insights;
}

const HIGHLIGHT_CLASSES: Record<string, string> = {
  a: "border-l-2 border-l-[var(--insight-color-a)] pl-3",
  b: "border-l-2 border-l-[var(--insight-color-b)] pl-3",
  neutral: "border-l-2 border-l-white/20 pl-3",
};

export default function CompareInsights({ pokemonA, pokemonB }: Props) {
  const insights = buildInsights(pokemonA, pokemonB);
  if (insights.length === 0) return null;

  return (
    <div className="mt-7 pt-6 border-t border-dark-600 animate-compare-in [animation-duration:0.5s] [animation-delay:150ms]" data-testid="compare-insights">
      <h3 className="flex items-center gap-2.5 text-[0.85rem] uppercase tracking-[0.14em] text-accent-gold/90 font-pixel mb-5">
        <span className="inline-block w-4 h-[2px] rounded-full bg-accent-gold/50" aria-hidden="true" />
        Insights
      </h3>
      <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
        {insights.map((ins, i) => (
          <li
            key={i}
            className={cn(
              "flex items-start gap-2.5 py-2.5 px-3 bg-dark-700 rounded-[0.625rem] transition-colors duration-150 hover:bg-dark-600",
              ins.highlight ? HIGHLIGHT_CLASSES[ins.highlight] : ""
            )}
          >
            <span className="text-[1.05rem] leading-[1.4] shrink-0">{ins.icon}</span>
            <span className="text-[0.82rem] leading-relaxed text-text-primary">{ins.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
