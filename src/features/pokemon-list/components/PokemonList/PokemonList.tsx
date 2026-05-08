import { Link } from "react-router-dom";
import { getPokemonIdFromUrl } from "@core/domain/pokemon";
import type { PokemonSummary } from "@core/domain/pokemon";

interface Props {
  pokemons?: PokemonSummary[];
}

function PokemonList({ pokemons }: Props) {
  return (
    <ul className="list-none m-0 p-0 w-full">
      {pokemons && !!pokemons.length ? (
        pokemons.map(({ name, url }, index) => {
          const id = getPokemonIdFromUrl(url);
          return !!name ? (
            <li
              key={id}
              className="pokemon-list-item border border-poke-gray-100 flex justify-between items-center cursor-pointer
                hover:bg-poke-yellow
                first:rounded-t-lg last:rounded-b-lg only:rounded-lg
                not-first:border-t-0"
              style={{ animationDelay: `${index * 35}ms` }}
            >
              <Link
                to={`/react-pokemon/detail/${id}`}
                className="w-full h-full no-underline text-inherit flex items-center"
              >
                <div className="pokemon-id border-r border-poke-gray-100 flex items-center justify-end px-3 py-2.5">
                  #{id}
                </div>
                <div className="pokemon-name flex-1 capitalize px-3 py-2.5">{name}</div>
              </Link>
            </li>
          ) : null;
        })
      ) : (
        <div className="p-2 text-sm" style={{ fontFamily: "var(--font-elegant)" }}>
          No pokemons found
        </div>
      )}
    </ul>
  );
}

export default PokemonList;
