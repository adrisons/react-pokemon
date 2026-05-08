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
        pokemons.map(({ name, url }) => {
          const id = getPokemonIdFromUrl(url);
          return !!name ? (
            <li
              key={id}
              className="border border-poke-gray-100 flex justify-between items-center cursor-pointer
                hover:bg-poke-yellow
                first:rounded-t-lg last:rounded-b-lg only:rounded-lg
                not-first:border-t-0"
            >
              <Link
                to={`/react-pokemon/detail/${id}`}
                className="w-full h-full no-underline text-inherit flex"
              >
                <div className="border-r border-poke-gray-100 min-w-12 flex justify-center p-2">
                  #{id}
                </div>
                <div className="flex-1 capitalize p-2">{name}</div>
              </Link>
            </li>
          ) : null;
        })
      ) : (
        <div className="p-2">No pokemons found</div>
      )}
    </ul>
  );
}

export default PokemonList;
