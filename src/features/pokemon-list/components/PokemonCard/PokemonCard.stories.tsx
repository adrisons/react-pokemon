import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import PokemonCard from "./PokemonCard";
import type { PokemonDetail } from "@core/domain/pokemon";

const bulbasaur: PokemonDetail = {
  id: 1,
  name: "bulbasaur",
  types: [
    { slot: 1, typeName: "grass" },
    { slot: 2, typeName: "poison" },
  ],
  movesCount: 82,
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  stats: [
    { name: "hp", value: 45 },
    { name: "attack", value: 49 },
    { name: "defense", value: 49 },
    { name: "special-attack", value: 65 },
    { name: "special-defense", value: 65 },
    { name: "speed", value: 45 },
  ],
  abilities: [
    { name: "overgrow", isHidden: false, description: "Powers up Grass-type moves when the Pokémon's HP is low." },
    { name: "chlorophyll", isHidden: true, description: "Boosts the Pokémon's Speed stat in sunshine." },
  ],
  captureRate: 45,
  isLegendary: false,
  isMythical: false,
  isBaby: false,
    heightDm: 7,
    weightHg: 69,
};

const charizard: PokemonDetail = {
  id: 6,
  name: "charizard",
  types: [
    { slot: 1, typeName: "fire" },
    { slot: 2, typeName: "flying" },
  ],
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
  abilities: [
    { name: "blaze", isHidden: false, description: "Powers up Fire-type moves when the Pokémon's HP is low." },
    { name: "solar-power", isHidden: true, description: "Boosts the Sp. Atk stat in sunshine, but HP decreases every turn." },
  ],
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
  abilities: [
    { name: "pressure", isHidden: false, description: "The Pokémon raises opposing Pokémon's PP usage." },
    { name: "unnerve", isHidden: true, description: "Unnerves opposing Pokémon and makes them unable to eat Berries." },
  ],
  captureRate: 3,
  isLegendary: true,
  isMythical: false,
  isBaby: false,
    heightDm: 7,
    weightHg: 69,
};

const mew: PokemonDetail = {
  id: 151,
  name: "mew",
  types: [{ slot: 1, typeName: "psychic" }],
  movesCount: 201,
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png",
  stats: [
    { name: "hp", value: 100 },
    { name: "attack", value: 100 },
    { name: "defense", value: 100 },
    { name: "special-attack", value: 100 },
    { name: "special-defense", value: 100 },
    { name: "speed", value: 100 },
  ],
  abilities: [
    { name: "synchronize", isHidden: false, description: "The attacker will receive the same status condition if it inflicts a burn, poison, or paralysis to the Pokémon." },
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
  movesCount: 38,
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png",
  stats: [
    { name: "hp", value: 20 },
    { name: "attack", value: 40 },
    { name: "defense", value: 15 },
    { name: "special-attack", value: 35 },
    { name: "special-defense", value: 35 },
    { name: "speed", value: 60 },
  ],
  abilities: [
    { name: "static", isHidden: false, description: "The Pokémon is charged with static electricity, so contact with it may cause paralysis." },
    { name: "lightning-rod", isHidden: true, description: "The Pokémon draws in all Electric-type moves." },
  ],
  captureRate: 190,
  isLegendary: false,
  isMythical: false,
  isBaby: true,
  heightDm: 3,
  weightHg: 20,
};

const noImage: PokemonDetail = {
  id: 999,
  name: "unknown",
  types: [{ slot: 1, typeName: "normal" }],
  movesCount: 0,
  imageUrl: null,
  stats: [],
  abilities: [],
  captureRate: 0,
  isLegendary: false,
  isMythical: false,
  isBaby: false,
    heightDm: 7,
    weightHg: 69,
};

const meta: Meta<typeof PokemonCard> = {
  title: "Features/PokemonCard",
  component: PokemonCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="w-48">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Pokemon card wrapping shadcn Card + Badge + Image. Links to the detail page. Shows id, name, types, and move count.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PokemonCard>;

export const Bulbasaur: Story = { args: { pokemon: bulbasaur } };
export const Charizard: Story = { args: { pokemon: charizard } };
export const Mewtwo: Story = { name: "Mewtwo (Legendary)", args: { pokemon: mewtwo } };
export const Mew: Story = { name: "Mew (Mythical)", args: { pokemon: mew } };
export const Pichu: Story = { name: "Pichu (Baby)", args: { pokemon: pichu } };
export const NoImage: Story = { name: "No image", args: { pokemon: noImage } };

export const Grid: Story = {
  name: "Card grid",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-150 p-4">
      {[bulbasaur, charizard, mewtwo, mew, pichu].map((p) => (
        <PokemonCard key={p.id} pokemon={p} />
      ))}
    </div>
  ),
};
