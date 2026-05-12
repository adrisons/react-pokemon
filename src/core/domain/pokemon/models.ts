export type PokemonTypeName =
  | "bug"
  | "dark"
  | "dragon"
  | "electric"
  | "fairy"
  | "fighting"
  | "fire"
  | "flying"
  | "ghost"
  | "grass"
  | "ground"
  | "ice"
  | "normal"
  | "poison"
  | "psychic"
  | "rock"
  | "steel"
  | "water";

export interface PokemonSummary {
  name: string;
  url: string;
}

export interface PokemonType {
  slot: number;
  typeName: PokemonTypeName;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
  description: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: PokemonType[];
  movesCount: number;
  imageUrl: string | null;
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  captureRate: number;
  isLegendary: boolean;
  isMythical: boolean;
  isBaby: boolean;
  /** Decimetres as returned by the API (1 = 10 cm). */
  heightDm: number;
  /** Hectograms as returned by the API (1 = 100 g). */
  weightHg: number;
}
