export function isValidPokemon(pokemon) {
  return (
    pokemon != null &&
    typeof pokemon.id === "number" &&
    typeof pokemon.name === "string" &&
    Array.isArray(pokemon.types) &&
    Array.isArray(pokemon.moves)
  );
}
