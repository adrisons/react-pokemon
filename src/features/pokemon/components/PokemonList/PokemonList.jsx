import { Link } from "react-router-dom";
import { getPokemonIdFromUrl } from "@core/domain/adapters";
import "./PokemonList.css";

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

export default PokemonList;
