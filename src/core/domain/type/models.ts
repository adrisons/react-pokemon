import type { PokemonTypeName } from "@core/domain/pokemon";

/**
 * Damage multiplier table: map[attackingType][defendingType] → multiplier.
 * Only non-1× entries are stored (0, 0.5, 2).
 */
export type EffectivenessMap = Record<
  PokemonTypeName,
  Partial<Record<PokemonTypeName, number>>
>;
