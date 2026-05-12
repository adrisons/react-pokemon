import type { CSSProperties } from "react";
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
              className="group motion-safe:animate-pokemon-entry [animation-delay:var(--delay)] transition-colors duration-150 border border-dark-600 flex justify-between items-center cursor-pointer hover:bg-dark-700 first:rounded-t-lg last:rounded-b-lg only:rounded-lg not-first:border-t-0"
              style={{ "--delay": `${index * 35}ms` } as CSSProperties}
            >
              <Link
                to={`/react-pokemon/detail/${id}`}
                className="w-full h-full no-underline text-inherit flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
              >
                <div className="font-pixel text-caption leading-none w-24 min-w-24 text-right text-accent-gold tracking-wider transition-colors duration-150 group-hover:text-text-primary border-r border-dark-600 flex items-center justify-end px-3 py-3">
                  #{id}
                </div>
                <div className="text-body font-medium flex-1 capitalize px-3 py-3">{name}</div>
              </Link>
            </li>
          ) : null;
        })
      ) : (
        <div className="p-2 text-body">
          No pokemons found
        </div>
      )}
    </ul>
  );
}

export default PokemonList;
