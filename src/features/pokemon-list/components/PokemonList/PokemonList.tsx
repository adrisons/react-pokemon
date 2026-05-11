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
              className="group animate-pokemon-entry transition-colors duration-150 border border-dark-600 flex justify-between items-center cursor-pointer
                hover:bg-dark-700
                first:rounded-t-lg last:rounded-b-lg only:rounded-lg
                not-first:border-t-0"
              style={{ animationDelay: `${index * 35}ms` }}
            >
              <Link
                to={`/react-pokemon/detail/${id}`}
                className="w-full h-full no-underline text-inherit flex items-center"
              >
                <div className="font-pixel text-[0.72rem] leading-none w-[5.5rem] min-w-[5.5rem] text-right text-accent-gold tracking-[0.02em] transition-colors duration-150 group-hover:text-text-primary border-r border-dark-600 flex items-center justify-end px-3 py-2.5">
                  #{id}
                </div>
                <div className="text-sm font-medium tracking-[0.01em] flex-1 capitalize px-3 py-2.5">{name}</div>
              </Link>
            </li>
          ) : null;
        })
      ) : (
        <div className="p-2 text-sm">
          No pokemons found
        </div>
      )}
    </ul>
  );
}

export default PokemonList;
