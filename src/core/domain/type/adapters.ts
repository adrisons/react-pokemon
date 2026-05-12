import type { PokemonTypeName } from "@core/domain/pokemon";
import type { RawTypeDetail } from "./api.types";
import type { EffectivenessMap } from "./models";

export function adaptTypeDetailsToEffectivenessMap(
  rawTypes: RawTypeDetail[],
): EffectivenessMap {
  const map = {} as EffectivenessMap;

  for (const raw of rawTypes) {
    const attacking = raw.name as PokemonTypeName;
    const relations: Partial<Record<PokemonTypeName, number>> = {};

    for (const t of raw.damage_relations.double_damage_to) {
      relations[t.name as PokemonTypeName] = 2;
    }
    for (const t of raw.damage_relations.half_damage_to) {
      relations[t.name as PokemonTypeName] = 0.5;
    }
    for (const t of raw.damage_relations.no_damage_to) {
      relations[t.name as PokemonTypeName] = 0;
    }

    map[attacking] = relations;
  }

  return map;
}
