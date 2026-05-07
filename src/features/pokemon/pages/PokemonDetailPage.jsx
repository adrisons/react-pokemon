import { useParams } from "react-router-dom";
import { Badge, Loading } from "@shared/ui";
import { getPokemonImageUrl } from "@core/domain/adapters";
import { usePokemonDetail } from "@features/pokemon/hooks";
import PokemonPicture from "@features/pokemon/components/PokemonPicture";
import "./PokemonDetailPage.css";

function PokemonDetailPage() {
  const { id } = useParams();
  const { pokemon, loading } = usePokemonDetail(id);

  if (loading) return <Loading />;

  return (
    <div className="pokemon-detail">
      <h1 className="title">
        <div className="id">#{pokemon.id}</div>
        {pokemon.name}
      </h1>
      <div className="badge-list">
        {pokemon.types.map((e) => (
          <Badge key={e.slot} name={e.type.name} />
        ))}
      </div>
      <div className="moves">{pokemon.moves.length} moves</div>
      <PokemonPicture imageUrl={getPokemonImageUrl(pokemon)} />
    </div>
  );
}

export default PokemonDetailPage;
