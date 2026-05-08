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

export interface PokemonDetail {
  id: number;
  name: string;
  types: PokemonType[];
  movesCount: number;
  imageUrl: string | null;
}
