import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { useState } from "react";
import PokemonSelector from "./PokemonSelector";

const meta: Meta<typeof PokemonSelector> = {
  title: "Features/Compare/PokemonSelector",
  component: PokemonSelector,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="max-w-sm mx-auto p-6">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PokemonSelector>;

export const Empty: Story = {
  render: () => {
    const [id, setId] = useState<string | null>(null);
    return (
      <PokemonSelector
        label="Pokémon A"
        selectedId={id}
        onSelect={setId}
        onClear={() => setId(null)}
      />
    );
  },
};

export const WithSelection: Story = {
  render: () => {
    const [id, setId] = useState<string | null>("25");
    return (
      <PokemonSelector
        label="Pokémon B"
        selectedId={id}
        onSelect={setId}
        onClear={() => setId(null)}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    label: "Pokémon B",
    selectedId: null,
    onSelect: () => {},
    onClear: () => {},
    disabled: true,
  },
};
