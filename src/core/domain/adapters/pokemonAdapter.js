export function getPokemonImageUrl(pokemon) {
  if (
    pokemon.sprites?.other?.dream_world?.front_default
  ) {
    return pokemon.sprites.other.dream_world.front_default;
  }
  return pokemon.sprites?.front_default ?? null;
}

export function getPokemonIdFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}
