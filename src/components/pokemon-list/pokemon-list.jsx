import React from "react";
import "./pokemon-list.styles.scss";
import { Link } from "react-router-dom";

function PokemonList({ pokemons }) {
  return (
    <ul className="list-group">
      {pokemons && !!pokemons.length ? (
        pokemons.map(({ name, url }) => {
          const id = getPokemonIdFromUrl(url);
          return !!name ? (
            <li key={id}>
              <Link to={`/react-pokemon/detail/${id}`} className="option">
                <div className="id">#{id}</div>
                <div className="name">{name}</div>
              </Link>
            </li>
          ) : null;
        })
      ) : (
        <div className="not-found">No pokemons found</div>
      )}
    </ul>
  );
}

function getPokemonIdFromUrl(url) {
  const parts = url.split("/");
  const realParts = parts.filter((e) => !!e);
  return realParts[realParts.length - 1];
}

export default PokemonList;
