import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import CompareStats from "./CompareStats";
import type { PokemonDetail } from "@core/domain/pokemon";
import type { EffectivenessMap } from "@core/domain/type";

const pikachu: PokemonDetail = {
  id: 25,
  name: "pikachu",
  types: [{ slot: 1, typeName: "electric" }],
  movesCount: 76,
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  stats: [
    { name: "hp", value: 35 },
    { name: "attack", value: 55 },
    { name: "defense", value: 40 },
    { name: "special-attack", value: 50 },
    { name: "special-defense", value: 50 },
    { name: "speed", value: 90 },
  ],
  abilities: [],
  captureRate: 190,
  isLegendary: false,
  isMythical: false,
  isBaby: false,
    heightDm: 7,
    weightHg: 69,
};

const charizard: PokemonDetail = {
  id: 6,
  name: "charizard",
  types: [{ slot: 1, typeName: "fire" }, { slot: 2, typeName: "flying" }],
  movesCount: 114,
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
  stats: [
    { name: "hp", value: 78 },
    { name: "attack", value: 84 },
    { name: "defense", value: 78 },
    { name: "special-attack", value: 109 },
    { name: "special-defense", value: 85 },
    { name: "speed", value: 100 },
  ],
  abilities: [],
  captureRate: 45,
  isLegendary: false,
  isMythical: false,
  isBaby: false,
    heightDm: 7,
    weightHg: 69,
};

const mewtwo: PokemonDetail = {
  id: 150,
  name: "mewtwo",
  types: [{ slot: 1, typeName: "psychic" }],
  movesCount: 99,
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
  stats: [
    { name: "hp", value: 106 },
    { name: "attack", value: 110 },
    { name: "defense", value: 90 },
    { name: "special-attack", value: 154 },
    { name: "special-defense", value: 90 },
    { name: "speed", value: 130 },
  ],
  abilities: [],
  captureRate: 3,
  isLegendary: true,
  isMythical: false,
  isBaby: false,
    heightDm: 7,
    weightHg: 69,
};

const effectivenessMap: EffectivenessMap = {
  normal:   { rock: 0.5, steel: 0.5, ghost: 0 },
  fire:     { fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5, grass: 2, ice: 2, bug: 2, steel: 2 },
  water:    { water: 0.5, grass: 0.5, dragon: 0.5, fire: 2, ground: 2, rock: 2 },
  electric: { electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0, water: 2, flying: 2 },
  grass:    { fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5, water: 2, ground: 2, rock: 2 },
  ice:      { water: 0.5, ice: 0.5, steel: 0.5, fire: 0.5, grass: 2, ground: 2, flying: 2, dragon: 2 },
  fighting: { poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0, normal: 2, ice: 2, rock: 2, dark: 2, steel: 2 },
  poison:   { poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, grass: 2, fairy: 2 },
  ground:   { grass: 0.5, bug: 0.5, flying: 0, fire: 2, electric: 2, poison: 2, rock: 2, steel: 2 },
  flying:   { electric: 0.5, rock: 0.5, steel: 0.5, ground: 0, grass: 2, fighting: 2, bug: 2 },
  psychic:  { psychic: 0.5, steel: 0.5, dark: 0, fighting: 2, poison: 2 },
  bug:      { fire: 0.5, fighting: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5, grass: 2, psychic: 2, dark: 2 },
  rock:     { fighting: 0.5, ground: 0.5, steel: 0.5, fire: 2, ice: 2, flying: 2, bug: 2 },
  ghost:    { normal: 0, dark: 0.5, ghost: 2, psychic: 2 },
  dragon:   { steel: 0.5, fairy: 0, dragon: 2 },
  dark:     { fighting: 0.5, dark: 0.5, fairy: 0.5, ghost: 2, psychic: 2 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5, ice: 2, rock: 2, fairy: 2 },
  fairy:    { fire: 0.5, poison: 0.5, steel: 0.5, fighting: 2, dragon: 2, dark: 2 },
};

const meta: Meta<typeof CompareStats> = {
  title: "Features/Compare/CompareStats",
  component: CompareStats,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="max-w-2xl mx-auto p-6">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CompareStats>;

export const AWinsMost: Story = {
  name: "B wins most (Charizard vs Pikachu)",
  args: { pokemonA: charizard, pokemonB: pikachu, effectivenessMap },
};

export const BWinsMost: Story = {
  name: "A wins most (Pikachu vs Mewtwo)",
  args: { pokemonA: pikachu, pokemonB: mewtwo, effectivenessMap },
};

export const EvenMatch: Story = {
  name: "Balanced match (Charizard vs Mewtwo)",
  args: { pokemonA: charizard, pokemonB: mewtwo, effectivenessMap },
};
