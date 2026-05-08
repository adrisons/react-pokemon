import { useParams } from "react-router-dom";
import { Badge, Loading } from "@shared/ui";
import { usePokemonDetail } from "@features/pokemon-detail/hooks/usePokemonDetail";
import PokemonPicture from "@features/pokemon-detail/components/PokemonPicture/PokemonPicture";

function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { pokemon, loading } = usePokemonDetail(id);

  if (loading) return <Loading />;
  if (!pokemon) return null;

  return (
    <div className="max-w-[30em] mx-auto">
      <h1 className="flex capitalize">
        <div className="mr-4">#{pokemon.id}</div>
        {pokemon.name}
      </h1>
      <div className="flex items-center flex-wrap gap-2.5">
        {pokemon.types.map((t) => (
          <Badge key={t.slot} name={t.typeName} />
        ))}
      </div>
      <div className="mt-4 font-bold">{pokemon.movesCount} moves</div>
      <PokemonPicture imageUrl={pokemon.imageUrl} />
    </div>
  );
}

export default PokemonDetailPage;
