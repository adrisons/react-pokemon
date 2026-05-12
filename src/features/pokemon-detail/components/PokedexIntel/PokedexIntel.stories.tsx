import type { Meta, StoryObj } from "@storybook/react-vite";
import PokedexIntel from "./PokedexIntel";
import type { PokemonDetail } from "@core/domain/pokemon";

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
  abilities: [
    { name: "static", isHidden: false, description: "Contact may paralyze the attacker." },
    { name: "lightning-rod", isHidden: true, description: "Draws in all Electric-type moves to boost its Sp. Atk stat." },
  ],
  captureRate: 190,
  isLegendary: false,
  isMythical: false,
  isBaby: false,
  heightDm: 4,
  weightHg: 60,
};

const snorlax: PokemonDetail = {
  id: 143,
  name: "snorlax",
  types: [{ slot: 1, typeName: "normal" }],
  movesCount: 102,
  imageUrl: null,
  stats: [
    { name: "hp", value: 160 },
    { name: "attack", value: 110 },
    { name: "defense", value: 65 },
    { name: "special-attack", value: 65 },
    { name: "special-defense", value: 110 },
    { name: "speed", value: 30 },
  ],
  abilities: [
    { name: "immunity", isHidden: false, description: "Prevents the Pokémon from getting poisoned." },
    { name: "thick-fat", isHidden: false, description: "Halves damage from Fire- and Ice-type moves." },
  ],
  captureRate: 25,
  isLegendary: false,
  isMythical: false,
  isBaby: false,
  heightDm: 21,
  weightHg: 4600,
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
  abilities: [
    { name: "pressure", isHidden: false, description: "Doubles the PP usage of the foe's moves." },
    { name: "unnerve", isHidden: true, description: "Prevents the foe from eating Berries." },
  ],
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
  abilities: [
    { name: "synchronize", isHidden: false, description: "Passes burn, poison, or paralysis back to the attacker." },
  ],
  captureRate: 45,
  isLegendary: false,
  isMythical: true,
  isBaby: false,
  heightDm: 4,
  weightHg: 40,
};

const pichu: PokemonDetail = {
  id: 172,
  name: "pichu",
  types: [{ slot: 1, typeName: "electric" }],
  movesCount: 49,
  imageUrl: null,
  stats: [
    { name: "hp", value: 20 },
    { name: "attack", value: 40 },
    { name: "defense", value: 15 },
    { name: "special-attack", value: 35 },
    { name: "special-defense", value: 35 },
    { name: "speed", value: 60 },
  ],
  abilities: [
    { name: "static", isHidden: false, description: "Contact may paralyze the attacker." },
  ],
  captureRate: 190,
  isLegendary: false,
  isMythical: false,
  isBaby: true,
  heightDm: 3,
  weightHg: 20,
};

const meta: Meta<typeof PokedexIntel> = {
  title: "Features/PokemonDetail/PokedexIntel",
  component: PokedexIntel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Telemetry-style insights panel: density, real-world scale, move pool, hidden ability, rarity, capture rate, and weakness chart.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-6 bg-dark-900 min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PokedexIntel>;

export const Pikachu: Story = { args: { pokemon: pikachu } };
export const Snorlax: Story = { name: "Snorlax (heavy)", args: { pokemon: snorlax } };
export const Mewtwo: Story = { name: "Mewtwo (legendary)", args: { pokemon: mewtwo } };
export const Mew: Story = { name: "Mew (mythical)", args: { pokemon: mew } };
export const Pichu: Story = { name: "Pichu (baby)", args: { pokemon: pichu } };
