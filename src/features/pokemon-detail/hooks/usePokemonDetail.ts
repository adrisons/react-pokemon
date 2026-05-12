import { useEffect, useState } from "react";
import { getPokemonDetail, getPokemonSpecies } from "@features/pokemon-detail/api/pokemonDetailApi";
import { getAbilityDescription } from "@features/pokemon-detail/api/abilityApi";
import { adaptPokemonDetail } from "@core/domain/pokemon";
import type { PokemonDetail } from "@core/domain/pokemon";
import { useHistoryStore } from "@features/history/store/historyStore";

export function usePokemonDetail(id: string | undefined, { trackHistory = false } = {}) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const addEntry = useHistoryStore((s) => s.addEntry);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPokemonDetail(id)
      .then(async (raw) => {
        const [abilities, species] = await Promise.all([
          Promise.all(
            raw.abilities.map(async (a) => ({
              name: a.ability.name,
              isHidden: a.is_hidden,
              description: await getAbilityDescription(a.ability.name),
            }))
          ),
          getPokemonSpecies(raw.id).catch(() => undefined),
        ]);
        const detail = adaptPokemonDetail(raw, abilities, species);
        setPokemon(detail);
        if (trackHistory) addEntry(detail);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, addEntry, trackHistory]);

  return { pokemon, loading };
}
