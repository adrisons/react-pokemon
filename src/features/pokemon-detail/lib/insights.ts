import type { PokemonDetail } from "@core/domain/pokemon";

export type RealWorldIcon =
  | "feather"
  | "rat"
  | "cat"
  | "dog"
  | "wolf"
  | "person"
  | "bear"
  | "horse"
  | "car"
  | "elephant"
  | "whale"
  | "coin"
  | "phone"
  | "baby"
  | "hoop"
  | "giraffe"
  | "house"
  | "tree";

export interface RealWorldRef {
  label: string;
  icon: RealWorldIcon;
  /** Kilograms. */
  weight: number;
  /** Metres. */
  height: number;
}

const WEIGHT_REFS: RealWorldRef[] = [
  { label: "a feather",        icon: "feather",  weight: 0.005, height: 0 },
  { label: "a hamster",        icon: "rat",      weight: 0.15,  height: 0 },
  { label: "a house cat",      icon: "cat",      weight: 4,     height: 0 },
  { label: "a beagle",         icon: "dog",      weight: 12,    height: 0 },
  { label: "a wolf",           icon: "wolf",     weight: 40,    height: 0 },
  { label: "an adult human",   icon: "person",   weight: 75,    height: 0 },
  { label: "a brown bear",     icon: "bear",     weight: 300,   height: 0 },
  { label: "a horse",          icon: "horse",    weight: 500,   height: 0 },
  { label: "a small car",      icon: "car",      weight: 1200,  height: 0 },
  { label: "an elephant",      icon: "elephant", weight: 5000,  height: 0 },
  { label: "a humpback whale", icon: "whale",    weight: 30000, height: 0 },
];

const HEIGHT_REFS: RealWorldRef[] = [
  { label: "a coin",            icon: "coin",     weight: 0, height: 0.02 },
  { label: "a smartphone",      icon: "phone",    weight: 0, height: 0.15 },
  { label: "a house cat",       icon: "cat",      weight: 0, height: 0.25 },
  { label: "a beagle",          icon: "dog",      weight: 0, height: 0.4 },
  { label: "a toddler",         icon: "baby",     weight: 0, height: 0.9 },
  { label: "an adult human",    icon: "person",   weight: 0, height: 1.7 },
  { label: "a basketball hoop", icon: "hoop",     weight: 0, height: 3.05 },
  { label: "a giraffe",         icon: "giraffe",  weight: 0, height: 5.5 },
  { label: "a two-story house", icon: "house",    weight: 0, height: 8 },
  { label: "a sequoia tree",    icon: "tree",     weight: 0, height: 80 },
];

function pickClosest<T extends RealWorldRef>(refs: T[], value: number, dim: "weight" | "height"): T {
  return refs.reduce((best, r) => {
    const diff = Math.abs(Math.log(r[dim] / value));
    const bestDiff = Math.abs(Math.log(best[dim] / value));
    return diff < bestDiff ? r : best;
  });
}

export function getWeightComparison(weightKg: number): { ref: RealWorldRef; ratio: number } {
  const ref = pickClosest(WEIGHT_REFS, Math.max(weightKg, 0.001), "weight");
  return { ref, ratio: weightKg / ref.weight };
}

export function getHeightComparison(heightM: number): { ref: RealWorldRef; ratio: number } {
  const ref = pickClosest(HEIGHT_REFS, Math.max(heightM, 0.001), "height");
  return { ref, ratio: heightM / ref.height };
}

export function formatRatio(ratio: number): string {
  if (ratio >= 0.92 && ratio <= 1.08) return "about the same as";
  if (ratio > 1) return `${ratio.toFixed(ratio >= 10 ? 0 : 1)}× heavier than`;
  return `${(1 / ratio).toFixed(ratio <= 0.1 ? 0 : 1)}× lighter than`;
}

export function formatHeightRatio(ratio: number): string {
  if (ratio >= 0.92 && ratio <= 1.08) return "about as tall as";
  if (ratio > 1) return `${ratio.toFixed(ratio >= 10 ? 0 : 1)}× taller than`;
  return `${(1 / ratio).toFixed(ratio <= 0.1 ? 0 : 1)}× shorter than`;
}

export type IntelTone =
  | "extreme"
  | "high"
  | "normal"
  | "low"
  | "ghostly"
  | "good"
  | "mythical"
  | "baby";

export interface DensityVerdict {
  value: number;
  label: string;
  tone: IntelTone;
}

/** kg/m². Same shape as BMI. */
export function getDensity(weightKg: number, heightM: number): DensityVerdict {
  const value = weightKg / (heightM * heightM);
  let label: string;
  let tone: IntelTone;
  if (value >= 10000) { label = "Denser than a neutron star"; tone = "extreme"; }
  else if (value >= 1000) { label = "Denser than osmium"; tone = "extreme"; }
  else if (value >= 300) { label = "Solid metal core"; tone = "high"; }
  else if (value >= 80) { label = "Stout & sturdy"; tone = "high"; }
  else if (value >= 25) { label = "Average build"; tone = "normal"; }
  else if (value >= 8) { label = "Lean & airy"; tone = "low"; }
  else { label = "Practically floating"; tone = "ghostly"; }
  return { value, label, tone };
}

export interface MovePoolVerdict {
  count: number;
  /** 0–1 vs. ~100 moves cap. */
  fillRatio: number;
  label: string;
}

export function getMovePoolVerdict(count: number): MovePoolVerdict {
  const fillRatio = Math.min(1, count / 100);
  let label: string;
  if (count >= 90) label = "Master of all trades";
  else if (count >= 60) label = "Highly versatile";
  else if (count >= 35) label = "Well-rounded";
  else if (count >= 18) label = "Focused fighter";
  else label = "Specialist";
  return { count, fillRatio, label };
}

export interface CaptureVerdict {
  rate: number;
  /** Approx. Poké Balls needed at full HP. */
  ballsApprox: number;
  label: string;
  tone: IntelTone;
}

export function getCaptureVerdict(rate: number): CaptureVerdict {
  const safeRate = Math.max(rate, 1);
  const ballsApprox = Math.round(255 / safeRate);
  let label: string;
  let tone: IntelTone;
  if (rate >= 220) { label = "Practically jumps in the ball"; tone = "good"; }
  else if (rate >= 150) { label = "Easy catch"; tone = "good"; }
  else if (rate >= 75) { label = "Bring snacks"; tone = "normal"; }
  else if (rate >= 30) { label = "Bring a lot of snacks"; tone = "high"; }
  else { label = "Master Ball territory"; tone = "extreme"; }
  return { rate, ballsApprox, label, tone };
}

export type RarityKind = "legendary" | "mythical" | "baby" | "common";

export function getRarityStatus(p: Pick<PokemonDetail, "isLegendary" | "isMythical" | "isBaby">): {
  kind: RarityKind;
  label: string;
  tone: IntelTone;
} {
  if (p.isMythical) return { kind: "mythical", label: "Mythical", tone: "mythical" };
  if (p.isLegendary) return { kind: "legendary", label: "Legendary", tone: "normal" };
  if (p.isBaby) return { kind: "baby", label: "Baby", tone: "baby" };
  return { kind: "common", label: "Common species", tone: "low" };
}
