import type { RawChainLink } from "./api.types";
import type { EvolutionStage } from "./models";
import { getPokemonIdFromUrl } from "@core/domain/pokemon";

function formatTrigger(details: RawChainLink["evolution_details"]): string | null {
  if (!details.length) return null;
  const d = details[0];
  if (d.trigger.name === "level-up" && d.min_level != null) {
    return `Lv. ${d.min_level}`;
  }
  if (d.trigger.name === "use-item" && d.item) {
    return d.item.name.replace(/-/g, " ");
  }
  if (d.trigger.name === "trade") {
    return "trade";
  }
  return d.trigger.name.replace(/-/g, " ");
}

export function adaptEvolutionChain(chain: RawChainLink): EvolutionStage[] {
  const stages: EvolutionStage[] = [];

  function walk(link: RawChainLink, trigger: string | null): void {
    const id = Number(getPokemonIdFromUrl(link.species.url));
    stages.push({
      name: link.species.name,
      pokemonId: id,
      imageUrl: null,
      trigger,
    });
    for (const next of link.evolves_to) {
      walk(next, formatTrigger(next.evolution_details));
    }
  }

  walk(chain, null);
  return stages;
}
