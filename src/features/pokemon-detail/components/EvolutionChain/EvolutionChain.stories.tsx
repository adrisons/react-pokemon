import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import EvolutionChain from "./EvolutionChain";
import type { EvolutionStage } from "@core/domain/evolution";

const sprite = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const bulbasaurChain: EvolutionStage[] = [
  { name: "bulbasaur", pokemonId: 1, imageUrl: sprite(1), trigger: null },
  { name: "ivysaur", pokemonId: 2, imageUrl: sprite(2), trigger: "level 16" },
  { name: "venusaur", pokemonId: 3, imageUrl: sprite(3), trigger: "level 32" },
];

const eeveeChain: EvolutionStage[] = [
  { name: "eevee", pokemonId: 133, imageUrl: sprite(133), trigger: null },
  { name: "vaporeon", pokemonId: 134, imageUrl: sprite(134), trigger: "water stone" },
];

const singleStage: EvolutionStage[] = [
  { name: "tauros", pokemonId: 128, imageUrl: sprite(128), trigger: null },
];

const meta: Meta<typeof EvolutionChain> = {
  title: "Features/PokemonDetail/EvolutionChain",
  component: EvolutionChain,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders the evolution line for a species. Highlights the current Pokémon (disabled, `aria-current`) and navigates to others on click. Returns null when the species has no evolutions.",
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="p-6 bg-dark-800 rounded-3xl max-w-4xl mx-auto">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EvolutionChain>;

export const ThreeStages: Story = {
  name: "Three stages (Bulbasaur line)",
  args: { stages: bulbasaurChain, currentId: 2 },
};

export const StartOfChain: Story = {
  name: "Start of chain (Bulbasaur)",
  args: { stages: bulbasaurChain, currentId: 1 },
};

export const TwoStages: Story = {
  name: "Two stages (Eevee → Vaporeon)",
  args: { stages: eeveeChain, currentId: 134 },
};

export const NoEvolutions: Story = {
  name: "No evolutions (renders null)",
  args: { stages: singleStage, currentId: 128 },
};
