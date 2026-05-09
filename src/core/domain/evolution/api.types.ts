export interface RawEvolutionDetail {
  min_level: number | null;
  item: { name: string } | null;
  trigger: { name: string };
}

export interface RawChainLink {
  species: { name: string; url: string };
  evolution_details: RawEvolutionDetail[];
  evolves_to: RawChainLink[];
}

export interface RawEvolutionChain {
  chain: RawChainLink;
}

export interface RawPokemonSpecies {
  evolution_chain: { url: string };
}
