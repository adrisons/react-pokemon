export interface RawPokemonListResponse {
  next: string | null;
  previous: string | null;
  results: RawPokemonSummary[];
}

export interface RawPokemonSummary {
  name: string;
  url: string;
}

export interface RawPokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface RawPokemonAbility {
  ability: { name: string; url: string };
  is_hidden: boolean;
  slot: number;
}

export interface RawPokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other: {
      dream_world: {
        front_default: string | null;
      };
    };
  };
  types: RawPokemonType[];
  moves: unknown[];
  stats: RawPokemonStat[];
  abilities: RawPokemonAbility[];
}

export interface RawPokemonType {
  slot: number;
  type: {
    name: string;
  };
}

export interface RawPokemonSpecies {
  capture_rate: number;
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
}
