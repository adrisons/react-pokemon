import { get } from "@core/api";
import type { RawPokemonDetail } from "@core/domain/pokemon";

export function getPokemonDetail(id: string | number): Promise<RawPokemonDetail> {
  return get<RawPokemonDetail>(`/pokemon/${id}`);
}
