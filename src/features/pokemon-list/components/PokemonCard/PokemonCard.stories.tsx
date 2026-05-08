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
};

const mewtwo: PokemonDetail = {
  id: 150,
  name: "mewtwo",
  types: [{ slot: 1, typeName: "psychic" }],
  movesCount: 99,
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
};

const noImage: PokemonDetail = {
  id: 999,
  name: "unknown",
  types: [{ slot: 1, typeName: "normal" }],
  movesCount: 0,
  imageUrl: null,
};

const meta: Meta<typeof PokemonCard> = {
  title: "Features/PokemonCard",
  component: PokemonCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
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
