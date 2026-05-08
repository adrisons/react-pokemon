import { useParams } from "react-router-dom";
import { Badge, Loading } from "@shared/ui";
import { usePokemonDetail } from "@features/pokemon-detail/hooks/usePokemonDetail";
import PokemonPicture from "@features/pokemon-detail/components/PokemonPicture/PokemonPicture";

const STAT_COLORS: Record<string, string> = {
  hp: "#ff5959",
  attack: "#f5ac78",
  defense: "#fae078",
  "special-attack": "#9db7f5",
  "special-defense": "#a7db8d",
  speed: "#fa92b2",
};

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

      <section className="mt-6">
        <h2 className="font-bold mb-3">Base Stats</h2>
        <div className="flex flex-col gap-2">
          {pokemon.stats.map((stat) => (
            <div key={stat.name} className="flex items-center gap-2">
              <span className="w-32 text-sm capitalize text-right text-poke-gray-500">
                {stat.name.replace("-", " ")}
              </span>
              <span className="w-8 text-sm font-bold text-right">{stat.value}</span>
              <div className="flex-1 h-3 bg-poke-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (stat.value / 255) * 100)}%`,
                    backgroundColor: STAT_COLORS[stat.name] ?? "#aaa",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 mb-8">
        <h2 className="font-bold mb-3">Abilities</h2>
        <div className="flex flex-col gap-3">
          {pokemon.abilities.map((ability) => (
            <div key={ability.name} className="border border-poke-gray-100 rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="capitalize font-semibold text-sm">
                  {ability.name.replace("-", " ")}
                </span>
                {ability.isHidden && (
                  <span className="text-xs px-1.5 py-0.5 border border-poke-gray-100 rounded text-poke-gray-500">
                    hidden
                  </span>
                )}
              </div>
              {ability.description && (
                <p className="text-sm text-poke-gray-500">{ability.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PokemonDetailPage;
