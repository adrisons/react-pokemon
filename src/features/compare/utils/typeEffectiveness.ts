import type { PokemonTypeName } from "@core/domain/pokemon";
import type { EffectivenessMap } from "@core/domain/type";

/** Multiplier when `attackerTypes` attacks a defender with `defenderTypes` */
export function getOffensiveMultiplier(
  map: EffectivenessMap,
  attackerTypes: PokemonTypeName[],
  defenderTypes: PokemonTypeName[],
): number {
  let best = 0;
  for (const atk of attackerTypes) {
    let multi = 1;
    for (const def of defenderTypes) {
      const row = map[atk] ?? {};
      const val = row[def];
      multi *= val !== undefined ? val : 1;
    }
    if (multi > best) best = multi;
  }
  return best;
}

/** Multiplier when `attackerTypes` attacks `defenderTypes` — same as offensive but named for clarity */
export function getVulnerability(
  map: EffectivenessMap,
  defenderTypes: PokemonTypeName[],
  attackerTypes: PokemonTypeName[],
): number {
  return getOffensiveMultiplier(map, attackerTypes, defenderTypes);
}

/** Count how many of the 18 types deal 0× damage to a set of types */
export function countImmunities(
  map: EffectivenessMap,
  defenderTypes: PokemonTypeName[],
): number {
  const allTypes = Object.keys(map) as PokemonTypeName[];
  return allTypes.filter(
    (atk) => getOffensiveMultiplier(map, [atk], defenderTypes) === 0,
  ).length;
}
