import { Link } from "react-router-dom";
import type { PokemonDetail } from "@core/domain/pokemon";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/components/ui/card";
import Badge from "@shared/ui/components/Badge/Badge";

interface Props {
  pokemon: PokemonDetail;
}

function PokemonCard({ pokemon }: Props) {
  return (
    <Link to={`/react-pokemon/detail/${pokemon.id}`} className="no-underline text-inherit">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        {pokemon.imageUrl && (
          <img
            src={pokemon.imageUrl}
            alt={pokemon.name}
            className="w-full object-contain h-32 pt-4"
          />
        )}
        <CardHeader>
          <CardTitle className="capitalize">
            <span className="text-muted-foreground mr-2">#{pokemon.id}</span>
            {pokemon.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {pokemon.types.map((t) => (
              <Badge key={t.slot} name={t.typeName} />
            ))}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">{pokemon.movesCount} moves</div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default PokemonCard;
