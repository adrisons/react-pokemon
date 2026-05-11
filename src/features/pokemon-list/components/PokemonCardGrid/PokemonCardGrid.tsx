import { getPokemonIdFromUrl } from "@core/domain/pokemon";
import type { PokemonSummary } from "@core/domain/pokemon";
import { usePokemonDetail } from "@features/pokemon-detail/hooks/usePokemonDetail";
import PokemonCard from "@features/pokemon-list/components/PokemonCard/PokemonCard";

function CardLoader({ url }: PokemonSummary) {
  const id = getPokemonIdFromUrl(url);
  const { pokemon, loading } = usePokemonDetail(id);

  if (loading || !pokemon) {
    return <div className="bg-[linear-gradient(90deg,#13131f_25%,#1a1a2e_50%,#13131f_75%)] bg-[length:400px_100%] animate-shimmer rounded-[1.25rem] border-[1.5px] border-accent-gold/15 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.3)]" style={{ height: '24rem' }} />;
  }

  return <PokemonCard pokemon={pokemon} />;
}

interface Props {
  pokemons: PokemonSummary[];
}

function PokemonCardGrid({ pokemons }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {pokemons.map((p) => (
        <CardLoader key={p.name} {...p} />
      ))}
    </div>
  );
}

export default PokemonCardGrid;
