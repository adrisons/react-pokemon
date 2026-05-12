import { getPokemonIdFromUrl } from "@core/domain/pokemon";
import type { PokemonSummary } from "@core/domain/pokemon";
import { usePokemonDetail } from "@features/pokemon-detail/hooks/usePokemonDetail";
import PokemonCard from "@features/pokemon-list/components/PokemonCard/PokemonCard";

function CardLoader({ url }: PokemonSummary) {
  const id = getPokemonIdFromUrl(url);
  const { pokemon, loading } = usePokemonDetail(id);

  if (loading || !pokemon) {
    return <div className="pkm-card-skeleton aspect-[2/3] sm:aspect-auto sm:h-96 bg-[length:400px_100%] motion-safe:animate-shimmer rounded-xl sm:rounded-2xl border border-accent-gold/15 shadow-card" />;
  }

  return <PokemonCard pokemon={pokemon} />;
}

interface Props {
  pokemons: PokemonSummary[];
}

function PokemonCardGrid({ pokemons }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {pokemons.map((p) => (
        <CardLoader key={p.name} {...p} />
      ))}
    </div>
  );
}

export default PokemonCardGrid;
