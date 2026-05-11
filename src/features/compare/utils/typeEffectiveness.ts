import type { PokemonTypeName } from "@core/domain/pokemon";

// Damage multiplier table: EFFECTIVENESS[attackingType][defendingType]
// 0 = immune, 0.5 = not very effective, 1 = normal, 2 = super effective
const EFFECTIVENESS: Record<PokemonTypeName, Partial<Record<PokemonTypeName, number>>> = {
  normal:   { rock: 0.5, steel: 0.5, ghost: 0 },
  fire:     { fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5, grass: 2, ice: 2, bug: 2, steel: 2 },
  water:    { water: 0.5, grass: 0.5, dragon: 0.5, fire: 2, ground: 2, rock: 2 },
  electric: { electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0, water: 2, flying: 2 },
  grass:    { fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5, water: 2, ground: 2, rock: 2 },
  ice:      { water: 0.5, ice: 0.5, steel: 0.5, fire: 0.5, grass: 2, ground: 2, flying: 2, dragon: 2 },
  fighting: { poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0, normal: 2, ice: 2, rock: 2, dark: 2, steel: 2 },
  poison:   { poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, grass: 2, fairy: 2 },
  ground:   { grass: 0.5, bug: 0.5, flying: 0, fire: 2, electric: 2, poison: 2, rock: 2, steel: 2 },
  flying:   { electric: 0.5, rock: 0.5, steel: 0.5, ground: 0, grass: 2, fighting: 2, bug: 2 },
  psychic:  { psychic: 0.5, steel: 0.5, dark: 0, fighting: 2, poison: 2 },
  bug:      { fire: 0.5, fighting: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5, grass: 2, psychic: 2, dark: 2 },
  rock:     { fighting: 0.5, ground: 0.5, steel: 0.5, fire: 2, ice: 2, flying: 2, bug: 2 },
  ghost:    { normal: 0, dark: 0.5, ghost: 2, psychic: 2 },
  dragon:   { steel: 0.5, fairy: 0, dragon: 2 },
  dark:     { fighting: 0.5, dark: 0.5, fairy: 0.5, ghost: 2, psychic: 2 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5, ice: 2, rock: 2, fairy: 2 },
  fairy:    { fire: 0.5, poison: 0.5, steel: 0.5, fighting: 2, dragon: 2, dark: 2 },
};

/** Multiplier when `attackerTypes` attacks a defender with `defenderTypes` */
export function getOffensiveMultiplier(
  attackerTypes: PokemonTypeName[],
  defenderTypes: PokemonTypeName[]
): number {
  let best = 0;
  for (const atk of attackerTypes) {
    let multi = 1;
    for (const def of defenderTypes) {
      const row = EFFECTIVENESS[atk] ?? {};
      const val = row[def];
      multi *= val !== undefined ? val : 1;
    }
    if (multi > best) best = multi;
  }
  return best;
}

/** Multiplier when `attackerTypes` attacks `defenderTypes` — same as offensive but named for clarity */
export function getVulnerability(
  defenderTypes: PokemonTypeName[],
  attackerTypes: PokemonTypeName[]
): number {
  return getOffensiveMultiplier(attackerTypes, defenderTypes);
}

/** Count how many of the 18 types deal 0× damage to a set of types */
export function countImmunities(defenderTypes: PokemonTypeName[]): number {
  const allTypes = Object.keys(EFFECTIVENESS) as PokemonTypeName[];
  return allTypes.filter((atk) => getOffensiveMultiplier([atk], defenderTypes) === 0).length;
}
