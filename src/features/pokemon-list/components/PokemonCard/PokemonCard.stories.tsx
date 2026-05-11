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
export const Mewtwo: Story = { args: { pokemon: mewtwo } };
export const NoImage: Story = { name: "No image", args: { pokemon: noImage } };

export const Grid: Story = {
  name: "Card grid",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-150 p-4">
      {[bulbasaur, charizard, mewtwo].map((p) => (
        <PokemonCard key={p.id} pokemon={p} />
      ))}
    </div>
  ),
};
