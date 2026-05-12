import type { CSSProperties } from "react";
import {
  Sparkles,
  Crown,
  Baby,
  Skull,
  Eye,
  EyeOff,
  Feather,
  Rat,
  Cat,
  Dog,
  PawPrint,
  PersonStanding,
  Car,
  Bus,
  Fish,
  Coins,
  Smartphone,
  Trophy,
  House,
  TreePine,
  Bird,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@shared/lib/utils";
import { Badge } from "@shared/ui";
import type { PokemonDetail } from "@core/domain/pokemon";
import { getWeaknesses } from "@shared/constants/typeChart";
import {
  getDensity,
  getWeightComparison,
  getHeightComparison,
  formatRatio,
  formatHeightRatio,
  getMovePoolVerdict,
  getCaptureVerdict,
  getRarityStatus,
  type IntelTone,
  type RealWorldIcon,
  type RarityKind,
} from "@features/pokemon-detail/lib/insights";

interface Props {
  pokemon: PokemonDetail;
}

/** Tailwind utility class per tone token (consumes --color-intel-* tokens). */
const TONE_TEXT: Record<IntelTone, string> = {
  extreme: "text-intel-extreme",
  high: "text-intel-high",
  normal: "text-accent-gold",
  low: "text-intel-low",
  ghostly: "text-intel-ghostly",
  good: "text-intel-good",
  mythical: "text-intel-mythical",
  baby: "text-intel-baby",
};

/** CSS variable value per tone (for tinted backgrounds/borders via .intel-tone-tint). */
const TONE_VAR: Record<IntelTone, string> = {
  extreme: "var(--color-intel-extreme)",
  high: "var(--color-intel-high)",
  normal: "var(--color-accent-gold)",
  low: "var(--color-intel-low)",
  ghostly: "var(--color-intel-ghostly)",
  good: "var(--color-intel-good)",
  mythical: "var(--color-intel-mythical)",
  baby: "var(--color-intel-baby)",
};

const REAL_WORLD_ICON: Record<RealWorldIcon, LucideIcon> = {
  feather: Feather,
  rat: Rat,
  cat: Cat,
  dog: Dog,
  wolf: PawPrint,
  person: PersonStanding,
  bear: PawPrint,
  horse: PawPrint,
  car: Car,
  elephant: Bus,
  whale: Fish,
  coin: Coins,
  phone: Smartphone,
  baby: Baby,
  hoop: Trophy,
  giraffe: Bird,
  house: House,
  tree: TreePine,
};

const RARITY_ICON: Record<RarityKind, LucideIcon> = {
  legendary: Crown,
  mythical: Sparkles,
  baby: Baby,
  common: Skull,
};

function Tile({
  label,
  testId,
  className,
  children,
}: {
  label: string;
  testId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-testid={testId}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-dark-600 bg-dark-700/60 p-4 sm:p-6",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="intel-tile-grid pointer-events-none absolute inset-0 opacity-[0.06]"
      />
      <div className="relative flex items-center gap-2 mb-3">
        <span className="size-2 rounded-full bg-accent-gold shadow-[0_0_6px_var(--color-accent-gold)]" aria-hidden="true" />
        <span className="font-pixel text-caption uppercase tracking-[0.18em] text-text-muted">
          {label}
        </span>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function DensityTile({ weightKg, heightM }: { weightKg: number; heightM: number }) {
  const { value, label, tone } = getDensity(weightKg, heightM);
  // Logarithmic needle: 1 kg/m² → 0%, 10000 kg/m² → 100%.
  const needlePct = Math.max(0, Math.min(100, (Math.log10(Math.max(value, 0.1)) / 4) * 100));
  return (
    <Tile label="Density · kg/m²" testId="intel-density" className="md:col-span-2">
      <div className="flex items-baseline gap-3">
        <span className={cn("font-pixel text-h1 sm:text-display leading-none tabular-nums", TONE_TEXT[tone])}>
          {value < 10 ? value.toFixed(1) : Math.round(value).toLocaleString()}
        </span>
        <span className="font-pixel text-caption uppercase tracking-wider text-text-muted">
          kg/m²
        </span>
      </div>
      <div className="mt-4 mb-2 h-2 w-full rounded-full bg-dark-900 overflow-hidden">
        <div
          className="intel-meter-density h-full rounded-full motion-safe:transition-all motion-safe:duration-700 w-[var(--needle-pct)]"
          style={{ "--needle-pct": `${needlePct}%` } as CSSProperties}
        />
      </div>
      <p className="text-body text-text-primary mt-2">{label}</p>
    </Tile>
  );
}

function ComparisonTile({ weightKg, heightM }: { weightKg: number; heightM: number }) {
  const w = getWeightComparison(weightKg);
  const h = getHeightComparison(heightM);
  const WIcon = REAL_WORLD_ICON[w.ref.icon];
  const HIcon = REAL_WORLD_ICON[h.ref.icon];
  return (
    <Tile label="Real-world scale" testId="intel-comparison" className="md:col-span-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-dark-600 bg-dark-800 text-accent-gold"
            aria-hidden="true"
          >
            <WIcon className="size-6" />
          </span>
          <div className="min-w-0">
            <div className="font-pixel text-caption uppercase tracking-widest text-accent-gold">
              {weightKg.toFixed(1)} kg
            </div>
            <p className="text-body text-text-primary leading-tight">
              <span className="text-text-muted">{formatRatio(w.ratio)}</span>{" "}
              <span className="font-semibold">{w.ref.label}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-dark-600 bg-dark-800 text-accent-gold"
            aria-hidden="true"
          >
            <HIcon className="size-6" />
          </span>
          <div className="min-w-0">
            <div className="font-pixel text-caption uppercase tracking-widest text-accent-gold">
              {heightM.toFixed(2)} m
            </div>
            <p className="text-body text-text-primary leading-tight">
              <span className="text-text-muted">{formatHeightRatio(h.ratio)}</span>{" "}
              <span className="font-semibold">{h.ref.label}</span>
            </p>
          </div>
        </div>
      </div>
    </Tile>
  );
}

function MovePoolTile({ movesCount }: { movesCount: number }) {
  const v = getMovePoolVerdict(movesCount);
  const segments = 20;
  const litCount = Math.round(v.fillRatio * segments);
  return (
    <Tile label="Move pool" testId="intel-movepool" className="md:col-span-2">
      <div className="flex items-baseline gap-2">
        <span className="font-pixel text-h1 sm:text-display leading-none text-accent-gold tabular-nums">
          {v.count}
        </span>
        <span className="font-pixel text-caption uppercase tracking-wider text-text-muted">
          learnable
        </span>
      </div>
      <div className="mt-4 flex gap-1" aria-hidden="true">
        {Array.from({ length: segments }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-3 flex-1 rounded-xs",
              i < litCount
                ? "bg-accent-gold shadow-[0_0_4px_var(--color-accent-gold)]"
                : "bg-dark-600"
            )}
          />
        ))}
      </div>
      <p className="text-body text-text-primary mt-3">{v.label}</p>
    </Tile>
  );
}

function HiddenAbilityTile({ pokemon }: { pokemon: PokemonDetail }) {
  const hidden = pokemon.abilities.find((a) => a.isHidden);
  const has = Boolean(hidden);
  const Icon = has ? Eye : EyeOff;
  return (
    <Tile label="Hidden ability" testId="intel-hidden-ability" className="md:col-span-3">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-1 inline-flex size-8 items-center justify-center rounded-full border",
            has
              ? "border-accent-gold bg-accent-gold/15 text-accent-gold"
              : "border-dark-600 bg-dark-800 text-text-muted"
          )}
          aria-hidden="true"
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          {has ? (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="capitalize font-semibold text-body text-text-primary">
                  {hidden!.name.replace(/-/g, " ")}
                </span>
                <span className="font-pixel text-caption uppercase tracking-widest text-accent-gold px-2 py-1 border border-accent-gold/40 rounded-sm">
                  rare
                </span>
              </div>
              {hidden!.description && (
                <p className="text-body text-text-muted leading-relaxed mt-1 line-clamp-3">
                  {hidden!.description}
                </p>
              )}
            </>
          ) : (
            <>
              <div className="font-semibold text-body text-text-primary">No hidden ability</div>
              <p className="text-body text-text-muted leading-relaxed mt-1">
                This species reveals all its tricks up front.
              </p>
            </>
          )}
        </div>
      </div>
    </Tile>
  );
}

function CaptureRateTile({ rate }: { rate: number }) {
  const v = getCaptureVerdict(rate);
  const pct = Math.min(100, (rate / 255) * 100);
  return (
    <Tile label="Capture rate" testId="intel-capture-rate" className="md:col-span-3">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className={cn("font-pixel text-h1 leading-none tabular-nums", TONE_TEXT[v.tone])}>
            {v.rate}
          </span>
          <span className="font-pixel text-caption uppercase tracking-wider text-text-muted">
            / 255
          </span>
        </div>
        <span className="font-pixel text-caption uppercase tracking-widest text-text-muted">
          ~{v.ballsApprox} ball{v.ballsApprox === 1 ? "" : "s"}
        </span>
      </div>
      <div
        className="relative mt-4 h-2 rounded-full bg-dark-900 overflow-hidden"
        style={{ "--meter-pct": `${pct}%` } as CSSProperties}
      >
        <div
          aria-hidden="true"
          className="intel-meter-capture absolute inset-0 opacity-60 w-[var(--meter-pct)]"
        />
        <span
          aria-hidden="true"
          className="absolute top-0 h-full w-px bg-accent-gold shadow-[0_0_6px_var(--color-accent-gold)] left-[var(--meter-pct)]"
        />
      </div>
      <p className="text-body text-text-primary mt-3">{v.label}</p>
    </Tile>
  );
}

function RarityTile({ pokemon }: { pokemon: PokemonDetail }) {
  const { kind, label, tone } = getRarityStatus(pokemon);
  const Icon = RARITY_ICON[kind];
  return (
    <Tile label="Status" testId="intel-rarity" className="md:col-span-2">
      <div className="flex items-center gap-3">
        <span
          className="intel-tone-tint inline-flex size-12 items-center justify-center rounded-xl border"
          style={{ "--tone-color": TONE_VAR[tone] } as CSSProperties}
          aria-hidden="true"
        >
          <Icon className="size-6" />
        </span>
        <div className="min-w-0">
          <div className={cn("font-pixel uppercase tracking-[0.16em] text-h3", TONE_TEXT[tone])}>
            {label}
          </div>
          {kind !== "common" && (
            <p className="text-caption text-text-muted leading-tight mt-1">
              {kind === "legendary" && "One of a kind. Rarely seen, rarely caught."}
              {kind === "mythical" && "Distributed only through special events."}
              {kind === "baby" && "Pre-evolution, hatched from an egg."}
            </p>
          )}
        </div>
      </div>
    </Tile>
  );
}

function WeaknessesTile({ pokemon }: { pokemon: PokemonDetail }) {
  const weaknesses = getWeaknesses(pokemon.types.map((t) => t.typeName));
  return (
    <Tile label="Feared types · 2× damage" testId="intel-weaknesses" className="md:col-span-4">
      {weaknesses.length === 0 ? (
        <p className="text-body text-text-primary">
          No weaknesses — a fortress against every type.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {weaknesses.map((w) => (
            <div
              key={w.type}
              className="relative flex items-center gap-2"
              data-testid={`weakness-${w.type}`}
            >
              <Badge name={w.type} />
              <span
                className={cn(
                  "font-pixel text-caption tabular-nums px-2 py-1 rounded-sm border",
                  w.multiplier >= 4
                    ? "text-intel-extreme bg-intel-extreme/14 border-intel-extreme/40"
                    : "text-accent-gold bg-accent-gold/12 border-accent-gold/30"
                )}
              >
                {w.multiplier}×
              </span>
            </div>
          ))}
        </div>
      )}
    </Tile>
  );
}

function PokedexIntel({ pokemon }: Props) {
  const weightKg = pokemon.weightHg / 10;
  const heightM = pokemon.heightDm / 10;

  return (
    <section
      aria-labelledby="intel-heading"
      className="bg-dark-800 border border-dark-600 rounded-3xl px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12 mt-6"
      data-testid="pokedex-intel"
    >
      <header className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2
          id="intel-heading"
          className="flex items-center gap-3 text-h3 uppercase tracking-[0.16em] text-accent-gold font-pixel"
        >
          <span className="inline-block w-6 h-1 rounded-full bg-accent-gold/80" aria-hidden="true" />
          Pokédex Intel
        </h2>
        <span className="font-pixel text-caption uppercase tracking-[0.2em] text-text-muted">
          dex · 0x{pokemon.id.toString(16).padStart(4, "0").toUpperCase()}
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <DensityTile weightKg={weightKg} heightM={heightM} />
        <ComparisonTile weightKg={weightKg} heightM={heightM} />
        <MovePoolTile movesCount={pokemon.movesCount} />
        <HiddenAbilityTile pokemon={pokemon} />
        <RarityTile pokemon={pokemon} />
        <CaptureRateTile rate={pokemon.captureRate} />
        <WeaknessesTile pokemon={pokemon} />
      </div>
    </section>
  );
}

export default PokedexIntel;
