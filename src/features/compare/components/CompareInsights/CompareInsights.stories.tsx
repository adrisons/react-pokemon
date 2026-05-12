import type { Meta, StoryObj } from "@storybook/react-vite";
import CompareInsights from "./CompareInsights";
import type { PokemonDetail } from "@core/domain/pokemon";
import type { EffectivenessMap } from "@core/domain/type";

const pikachu: PokemonDetail = {
  id: 25,
  name: "pikachu",
  types: [{ slot: 1, typeName: "electric" }],
  movesCount: 76,
  imageUrl: null,
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
  heightDm: 4,
  weightHg: 60,
};

const charizard: PokemonDetail = {
  id: 6,
  name: "charizard",
  types: [
    { slot: 1, typeName: "fire" },
    { slot: 2, typeName: "flying" },
  ],
  movesCount: 114,
  imageUrl: null,
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
  heightDm: 17,
  weightHg: 905,
};

const mewtwo: PokemonDetail = {
  id: 150,
  name: "mewtwo",
  types: [{ slot: 1, typeName: "psychic" }],
  movesCount: 99,
  imageUrl: null,
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
  heightDm: 20,
  weightHg: 1220,
};

const mew: PokemonDetail = {
  id: 151,
  name: "mew",
  types: [{ slot: 1, typeName: "psychic" }],
  movesCount: 200,
  imageUrl: null,
  stats: [
    { name: "hp", value: 100 },
    { name: "attack", value: 100 },
    { name: "defense", value: 100 },
    { name: "special-attack", value: 100 },
    { name: "special-defense", value: 100 },
    { name: "speed", value: 100 },
  ],
  abilities: [],
  captureRate: 45,
  isLegendary: false,
  isMythical: true,
  isBaby: false,
  heightDm: 4,
  weightHg: 40,
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

const meta: Meta<typeof CompareInsights> = {
  title: "Features/Compare/CompareInsights",
  component: CompareInsights,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Computes and renders qualitative insights for two Pokémon (BST diff, glass-cannon vs tank, type advantage, immunities, capture rate, move pool). Renders nothing when no insight rule fires.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto p-6 bg-dark-800 rounded-3xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CompareInsights>;

export const PikachuVsCharizard: Story = {
  args: { pokemonA: pikachu, pokemonB: charizard, effectivenessMap },
};

export const PikachuVsMewtwo: Story = {
  name: "Pikachu vs Mewtwo (legendary)",
  args: { pokemonA: pikachu, pokemonB: mewtwo, effectivenessMap },
};

export const MewtwoVsMew: Story = {
  name: "Mewtwo vs Mew (legendary vs mythical)",
  args: { pokemonA: mewtwo, pokemonB: mew, effectivenessMap },
};
