import { useEffect, useState } from "react";
import { getPokemonDetail } from "@features/pokemon-detail/api/pokemonDetailApi";
import { getAbilityDescription } from "@features/pokemon-detail/api/abilityApi";
import { adaptPokemonDetail } from "@core/domain/pokemon";
import type { PokemonDetail } from "@core/domain/pokemon";

export function usePokemonDetail(id: string | undefined) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPokemonDetail(id).then(async (raw) => {
      const abilities = await Promise.all(
        raw.abilities.map(async (a) => ({
          name: a.ability.name,
          isHidden: a.is_hidden,
          description: await getAbilityDescription(a.ability.name),
        }))
      );
      setPokemon(adaptPokemonDetail(raw, abilities));
      setLoading(false);
    });
  }, [id]);

  return { pokemon, loading };
}
