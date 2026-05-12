import { useId } from "react";
import type { PokemonStat } from "@core/domain/pokemon";
import { statColorVar } from "@shared/constants/statColors";

const LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SPA",
  "special-defense": "SPD",
  speed: "SPE",
};

const ORDER = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
];
const N = 6;
const R = 60;
const LABEL_R = 78;

function polar(index: number, radius: number): [number, number] {
  const angle = ((360 / N) * index - 90) * (Math.PI / 180);
  return [
    +(radius * Math.cos(angle)).toFixed(2),
    +(radius * Math.sin(angle)).toFixed(2),
  ];
}

function hexPoints(radius: number): string {
  return Array.from({ length: N }, (_, i) =>
    polar(i, radius).join(","),
  ).join(" ");
}

interface Props {
  stats: PokemonStat[];
  typeColor: string;
  className?: string;
}

export default function StatRadar({ stats, typeColor, className }: Props) {
  const uid = useId().replace(/:/g, "");

  const ordered = ORDER.map((name) => ({
    name,
    value: stats.find((s) => s.name === name)?.value ?? 0,
  }));
  const bst = ordered.reduce((sum, s) => sum + s.value, 0);
  const maxStat = Math.max(...ordered.map((s) => s.value), 1);

  const dataPath = ordered
    .map((s, i) => polar(i, (s.value / maxStat) * R).join(","))
    .join(" ");

  return (
    <div className={className}>
      <svg
        viewBox="-94 -94 188 188"
        className="w-full h-auto"
        role="img"
        aria-label="Base stats radar chart"
      >
        <defs>
          <radialGradient id={`rg-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={typeColor} stopOpacity="0.22" />
            <stop offset="70%" stopColor={typeColor} stopOpacity="0.06" />
            <stop offset="100%" stopColor={typeColor} stopOpacity="0" />
          </radialGradient>
          <filter id={`glow-${uid}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient background glow */}
        <circle cx={0} cy={0} r={R + 6} fill={`url(#rg-${uid})`} />

        {/* Outer boundary — gold accent ring */}
        <polygon
          points={hexPoints(R)}
          fill="none"
          stroke="var(--color-accent-gold)"
          strokeWidth="0.6"
          strokeOpacity="0.25"
        />

        {/* Inner grid rings */}
        {[0.33, 0.66].map((pct) => (
          <polygon
            key={pct}
            points={hexPoints(R * pct)}
            fill="none"
            stroke="var(--color-dark-600)"
            strokeWidth="0.5"
          />
        ))}

        {/* Axes */}
        {Array.from({ length: N }, (_, i) => {
          const [x, y] = polar(i, R);
          return (
            <line
              key={i}
              x1={0}
              y1={0}
              x2={x}
              y2={y}
              stroke="var(--color-dark-600)"
              strokeWidth="0.4"
            />
          );
        })}

        {/* Data polygon — with glow filter */}
        <polygon
          points={dataPath}
          fill={typeColor}
          fillOpacity="0.14"
          stroke={typeColor}
          strokeWidth="1.8"
          strokeLinejoin="round"
          filter={`url(#glow-${uid})`}
        />

        {/* Vertex dots — colored per stat */}
        {ordered.map((s, i) => {
          const [cx, cy] = polar(i, (s.value / maxStat) * R);
          return (
            <circle
              key={`dot-${s.name}`}
              cx={cx}
              cy={cy}
              r="2.5"
              fill={statColorVar(s.name)}
            />
          );
        })}

        {/* Stat labels */}
        {ordered.map((s, i) => {
          const [x, y] = polar(i, LABEL_R);
          return (
            <text
              key={`lbl-${s.name}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--color-text-muted)"
              fontSize="8"
              fontWeight="700"
              fontFamily="var(--font-pixel)"
            >
              {LABELS[s.name]}
            </text>
          );
        })}

        {/* BST centre badge */}
        <circle cx={0} cy={0} r="12" fill="var(--color-dark-900)" fillOpacity="0.9" />
        <circle
          cx={0}
          cy={0}
          r="12"
          fill="none"
          stroke="var(--color-accent-gold)"
          strokeWidth="0.6"
          strokeOpacity="0.4"
        />
        <text
          x={0}
          y={-2.5}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--color-text-muted)"
          fontSize="4.5"
          fontWeight="700"
          fontFamily="var(--font-pixel)"
        >
          BST
        </text>
        <text
          x={0}
          y={5}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--color-accent-gold)"
          fontSize="7"
          fontWeight="700"
          fontFamily="var(--font-pixel)"
        >
          {bst}
        </text>
      </svg>
    </div>
  );
}
