import { useEffect, useState } from "react";
import { getPokemonDetail } from "@features/pokemon-detail/api/pokemonDetailApi";
import { adaptPokemonDetail } from "@core/domain/pokemon";
import type { PokemonDetail } from "@core/domain/pokemon";

export function usePokemonDetail(id: string | undefined) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPokemonDetail(id).then((data) => {
      setPokemon(adaptPokemonDetail(data));
      setLoading(false);
    });
  }, [id]);

  return { pokemon, loading };
}
