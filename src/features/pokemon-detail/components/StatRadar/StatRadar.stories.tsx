import type { Meta, StoryObj } from "@storybook/react-vite";
import type { PokemonStat } from "@core/domain/pokemon";
import StatRadar from "./StatRadar";

const pikachu: PokemonStat[] = [
  { name: "hp", value: 35 },
  { name: "attack", value: 55 },
  { name: "defense", value: 40 },
  { name: "special-attack", value: 50 },
  { name: "special-defense", value: 50 },
  { name: "speed", value: 90 },
];

const mewtwo: PokemonStat[] = [
  { name: "hp", value: 106 },
  { name: "attack", value: 110 },
  { name: "defense", value: 90 },
  { name: "special-attack", value: 154 },
  { name: "special-defense", value: 90 },
  { name: "speed", value: 130 },
];

const snorlax: PokemonStat[] = [
  { name: "hp", value: 160 },
  { name: "attack", value: 110 },
  { name: "defense", value: 65 },
  { name: "special-attack", value: 65 },
  { name: "special-defense", value: 110 },
  { name: "speed", value: 30 },
];

const mew: PokemonStat[] = [
  { name: "hp", value: 100 },
  { name: "attack", value: 100 },
  { name: "defense", value: 100 },
  { name: "special-attack", value: 100 },
  { name: "special-defense", value: 100 },
  { name: "speed", value: 100 },
];

const meta: Meta<typeof StatRadar> = {
  title: "Features/PokemonDetail/StatRadar",
  component: StatRadar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "SVG radar chart showing the 6 base stats as a hexagonal polygon normalized to the highest stat. Type color tints the data fill, stat-specific colors mark each vertex. BST badge in the centre.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-dark-900 min-h-screen flex items-center justify-center">
        <div className="border border-dark-600 rounded-2xl bg-dark-700/50 p-4 w-56">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StatRadar>;

export const Pikachu: Story = {
  name: "Pikachu (electric)",
  args: { stats: pikachu, typeColor: "#eed535" },
};

export const Mewtwo: Story = {
  name: "Mewtwo (psychic)",
  args: { stats: mewtwo, typeColor: "#f366b9" },
};

export const Snorlax: Story = {
  name: "Snorlax (normal)",
  args: { stats: snorlax, typeColor: "#a4acaf" },
};

export const Mew: Story = {
  name: "Mew (balanced)",
  args: { stats: mew, typeColor: "#f366b9" },
};

export const CompactSize: Story = {
  name: "Compact (140px)",
  decorators: [
    (Story) => (
      <div className="p-8 bg-dark-900 min-h-screen flex items-center justify-center">
        <div className="border border-dark-600 rounded-2xl bg-dark-700/50 p-3 w-36">
          <Story />
        </div>
      </div>
    ),
  ],
  args: { stats: mewtwo, typeColor: "#f366b9" },
};
