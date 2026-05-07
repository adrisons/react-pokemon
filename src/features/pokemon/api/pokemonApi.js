import { get } from "@core/api";

export function getPokemonList(url) {
  return get(url);
}

export function getPokemonDetail(id) {
  return get(`/pokemon/${id}`);
}
