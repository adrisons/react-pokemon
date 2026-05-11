import { useState, useEffect } from "react";
import { getPokemonDetail, getPokemonSpecies } from "@features/pokemon-detail/api/pokemonDetailApi";
import { adaptPokemonDetail } from "@core/domain/pokemon";
import type { PokemonDetail, RawPokemonDetail, RawPokemonSpecies } from "@core/domain/pokemon";

async function fetchPokemonWithSpecies(id: string): Promise<PokemonDetail> {
  const [raw, species] = await Promise.all([
    getPokemonDetail(id),
    getPokemonSpecies(id).catch(() => undefined),
  ]);
  return adaptPokemonDetail(raw as RawPokemonDetail, [], species as RawPokemonSpecies | undefined);
}

export function useCompare(idA: string | null, idB: string | null) {
  const [pokemonA, setPokemonA] = useState<PokemonDetail | null>(null);
  const [pokemonB, setPokemonB] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!idA && !idB) {
      setPokemonA(null);
      setPokemonB(null);
      return;
    }
    setLoading(true);
    setError(false);
    Promise.all([
      idA ? fetchPokemonWithSpecies(idA) : Promise.resolve(null),
      idB ? fetchPokemonWithSpecies(idB) : Promise.resolve(null),
    ])
      .then(([a, b]) => {
        setPokemonA(a);
        setPokemonB(b);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [idA, idB]);

  return { pokemonA, pokemonB, loading, error };
}
