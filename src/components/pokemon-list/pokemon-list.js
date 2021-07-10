import React from "react";
import "./pokemon-list.styles.scss";

function PokemonList({ pokemon }) {
  return (
    <ul className="list-group">
      {pokemon &&
        pokemon.map((name) =>
          !!name ? (
            <li key={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</li>
          ) : null
        )}
    </ul>
  );
}

export default PokemonList;
