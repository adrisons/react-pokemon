import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import PokemonList from "./PokemonList";
import type { PokemonSummary } from "@core/domain/pokemon";

const samplePokemons: PokemonSummary[] = [
  { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
  { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
  { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
  { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
  { name: "charmeleon", url: "https://pokeapi.co/api/v2/pokemon/5/" },
];

const meta: Meta<typeof PokemonList> = {
  title: "Features/PokemonList",
  component: PokemonList,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/react-pokemon/"]}>
        <div className="max-w-md mx-auto p-4">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "List of Pokemon summaries. Each row links to the detail page derived from the PokeAPI URL.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PokemonList>;

export const Populated: Story = {
  args: { pokemons: samplePokemons },
};

export const Empty: Story = {
  name: "Empty (no pokemons)",
  args: { pokemons: [] },
};

export const Undefined: Story = {
  name: "Undefined (loading/unknown)",
  args: { pokemons: undefined },
};

