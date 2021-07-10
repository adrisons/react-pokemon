import React from "react";
import "./pokemon-list.styles.scss";

function PokemonList({ pokemon }) {
  return (
    <ul className="list-group">
      {pokemon.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
}

export default PokemonList;
