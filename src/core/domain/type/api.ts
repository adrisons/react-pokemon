import { get } from "@core/api";
import { cachedFetch } from "@core/api/httpCache";
import type { PokemonTypeName } from "@core/domain/pokemon";
import type { RawTypeDetail } from "./api.types";
import type { EffectivenessMap } from "./models";
import { adaptTypeDetailsToEffectivenessMap } from "./adapters";

const POKEMON_TYPES: PokemonTypeName[] = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

const DERIVED_CACHE_KEY = "derived://effectiveness-map";
const ONE_HOUR_MS = 60 * 60 * 1000;

export function getEffectivenessMap(): Promise<EffectivenessMap> {
  return cachedFetch<EffectivenessMap>(
    DERIVED_CACHE_KEY,
    async () => {
      const rawTypes = await Promise.all(
        POKEMON_TYPES.map((name) => get<RawTypeDetail>(`/type/${name}`)),
      );
      return adaptTypeDetailsToEffectivenessMap(rawTypes);
    },
    { ttlMs: ONE_HOUR_MS },
  );
}
