import { get } from "@core/api";
import type { RawPokemonListResponse } from "@core/domain/pokemon";

export function getPokemonList(url: string): Promise<RawPokemonListResponse> {
  return get<RawPokemonListResponse>(url);
}
