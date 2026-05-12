/**
 * Stat color tokens live in `src/index.css` (@theme as `--color-stat-*`).
 * This helper returns the matching CSS variable reference so callers can
 * inject it as a `--stat-color` custom property and let Tailwind consume it
 * via `bg-[var(--stat-color)]` / `text-[var(--stat-color)]` etc.
 */
const STAT_TOKENS: Record<string, string> = {
  hp: "var(--color-stat-hp)",
  attack: "var(--color-stat-attack)",
  defense: "var(--color-stat-defense)",
  "special-attack": "var(--color-stat-special-attack)",
  "special-defense": "var(--color-stat-special-defense)",
  speed: "var(--color-stat-speed)",
};

export function statColorVar(name: string): string {
  return STAT_TOKENS[name] ?? "var(--color-text-muted)";
}
