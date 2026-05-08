import type { Meta, StoryObj } from "@storybook/react-vite";
import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Shared/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Pokemon type badge wrapping shadcn Badge. Each type has a unique color from the official Pokedex palette.",
      },
    },
  },
  argTypes: {
    name: {
      control: "select",
      options: [
        "bug", "dark", "dragon", "electric", "fairy", "fighting",
        "fire", "flying", "ghost", "grass", "ground", "ice",
        "normal", "poison", "psychic", "rock", "steel", "water",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Fire: Story = { args: { name: "fire" } };
export const Water: Story = { args: { name: "water" } };
export const Grass: Story = { args: { name: "grass" } };
export const Psychic: Story = { args: { name: "psychic" } };
export const Dragon: Story = { args: { name: "dragon" } };

export const AllTypes: Story = {
  name: "All types",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["bug","dark","dragon","electric","fairy","fighting","fire","flying",
         "ghost","grass","ground","ice","normal","poison","psychic","rock",
         "steel","water"] as const).map((type) => (
        <Badge key={type} name={type} />
      ))}
    </div>
  ),
};
