import React from "react";
import "./pokemon-list.styles.scss";

function PokemonList({ pokemons }) {
  return (
    <ul className="list-group">
      {pokemons &&
        pokemons.map(({ name, url }) =>
          !!name ? (
            <li key={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</li>
          ) : null
        )}
    </ul>
  );
}

export default PokemonList;
