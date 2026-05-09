import { useEffect, useState } from "react";
import { getPokemonSpecies, getEvolutionChain } from "@features/pokemon-detail/api/evolutionApi";
import { getPokemonDetail } from "@features/pokemon-detail/api/pokemonDetailApi";
import { adaptEvolutionChain } from "@core/domain/evolution";
import { getPokemonIdFromUrl } from "@core/domain/pokemon";
import { usePokemonListStore } from "@features/pokemon-list/store";
import type { EvolutionStage } from "@core/domain/evolution";

export function useEvolutionChain(id: string | undefined) {
  const [stages, setStages] = useState<EvolutionStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const { allPokemons, loadAllPokemons } = usePokemonListStore.getState();

    getPokemonSpecies(id)
      .then((species) => getEvolutionChain(species.evolution_chain.url))
      .then(async (raw) => {
        const base = adaptEvolutionChain(raw.chain);
        const summaries = allPokemons ?? (await loadAllPokemons());

        const resolved = await Promise.all(
          base.map(async (stage) => {
            const summary = summaries.find((s) => s.name === stage.name);
            const pokemonId = summary
              ? Number(getPokemonIdFromUrl(summary.url))
              : stage.pokemonId;
            const detail = await getPokemonDetail(pokemonId);
            const imageUrl =
              detail.sprites?.other?.dream_world?.front_default ??
              detail.sprites?.front_default ??
              null;
            return { ...stage, imageUrl };
          })
        );

        setStages(resolved);
        setLoading(false);
      });
  }, [id]);

  return { stages, loading };
}
