import type { Meta, StoryObj } from "@storybook/react-vite";
import PokemonPicture from "./PokemonPicture";

const meta: Meta<typeof PokemonPicture> = {
  title: "Features/PokemonPicture",
  component: PokemonPicture,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Pokemon image container that shows the Loading indicator until the image has finished loading.",
      },
    },
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof PokemonPicture>;

export const WithImage: Story = {
  args: {
    imageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  },
};

export const NoImage: Story = {
  name: "No image",
  args: { imageUrl: null },
};

