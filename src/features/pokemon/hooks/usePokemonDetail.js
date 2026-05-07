import { useEffect, useState } from "react";
import { getPokemonDetail } from "@features/pokemon/api";

export function usePokemonDetail(id) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPokemonDetail(id).then((data) => {
      setPokemon(data);
      setLoading(false);
    });
  }, [id]);

  return { pokemon, loading };
}
