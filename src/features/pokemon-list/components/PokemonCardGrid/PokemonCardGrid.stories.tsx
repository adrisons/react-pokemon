import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import PokemonCardGrid from "./PokemonCardGrid";
import type { PokemonSummary } from "@core/domain/pokemon";

const pokemons: PokemonSummary[] = [
  { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
  { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
  { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
  { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
  { name: "charmeleon", url: "https://pokeapi.co/api/v2/pokemon/5/" },
  { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
  { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" },
  { name: "wartortle", url: "https://pokeapi.co/api/v2/pokemon/8/" },
];

const meta: Meta<typeof PokemonCardGrid> = {
  title: "Features/PokemonList/PokemonCardGrid",
  component: PokemonCardGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Responsive grid that hydrates each summary via `usePokemonDetail`. While loading, a shimmer skeleton occupies each slot. In Storybook the network call hits the real PokéAPI; if offline only skeletons appear.",
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="p-6 bg-dark-900 min-h-screen">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PokemonCardGrid>;

export const Default: Story = {
  args: { pokemons },
};

export const Empty: Story = {
  name: "Empty list",
  args: { pokemons: [] },
};

export const Single: Story = {
  name: "Single card",
  args: { pokemons: pokemons.slice(0, 1) },
};
