import { get } from "@core/api";
import type { RawEvolutionChain, RawPokemonSpecies } from "@core/domain/evolution";

export async function getPokemonSpecies(id: string | number): Promise<RawPokemonSpecies> {
  return get<RawPokemonSpecies>(`/pokemon-species/${id}`);
}

export async function getEvolutionChain(url: string): Promise<RawEvolutionChain> {
  return get<RawEvolutionChain>(url);
}
