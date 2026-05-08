export interface RawPokemonListResponse {
  next: string | null;
  previous: string | null;
  results: RawPokemonSummary[];
}

export interface RawPokemonSummary {
  name: string;
  url: string;
}

export interface RawPokemonDetail {
  id: number;
  name: string;
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
}

export interface RawPokemonType {
  slot: number;
  type: {
    name: string;
  };
}
