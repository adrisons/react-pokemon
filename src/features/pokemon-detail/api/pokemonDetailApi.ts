import { get } from "@core/api";
import type { RawPokemonDetail, RawPokemonSpecies } from "@core/domain/pokemon";

export function getPokemonDetail(id: string | number): Promise<RawPokemonDetail> {
  return get<RawPokemonDetail>(`/pokemon/${id}`);
}

export function getPokemonSpecies(id: string | number): Promise<RawPokemonSpecies> {
  return get<RawPokemonSpecies>(`/pokemon-species/${id}`);
}
