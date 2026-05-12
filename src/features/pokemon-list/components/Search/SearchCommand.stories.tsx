import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import SearchCommand from "./SearchCommand";
import { useSearchStore } from "@features/pokemon-list/store";
import type { PokemonSummary } from "@core/domain/pokemon";

const sampleResults: PokemonSummary[] = [
  { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
  { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
  { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
  { name: "mewtwo", url: "https://pokeapi.co/api/v2/pokemon/150/" },
];

interface PrimeArgs {
  isOpen?: boolean;
  query?: string;
  results?: PokemonSummary[];
  searching?: boolean;
  notFound?: boolean;
}

function PrimeStore({ isOpen = true, query = "", results = [], searching = false, notFound = false }: PrimeArgs) {
  useEffect(() => {
    useSearchStore.setState({ isOpen, query, results, searching, notFound });
    return () => {
      useSearchStore.setState({ isOpen: false, query: "", results: [], searching: false, notFound: false });
    };
  }, [isOpen, query, results, searching, notFound]);
  return null;
}

const meta: Meta<typeof SearchCommand> = {
  title: "Features/Search/SearchCommand",
  component: SearchCommand,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Command palette dialog driven by `useSearchStore`. Stories prime the store state directly to render closed/open/empty/results variants without triggering real API calls.",
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-dark-900">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchCommand>;

export const Empty: Story = {
  name: "Open · empty query",
  render: () => (
    <>
      <PrimeStore isOpen query="" />
      <SearchCommand />
    </>
  ),
};

export const Searching: Story = {
  name: "Open · searching",
  render: () => (
    <>
      <PrimeStore isOpen query="pika" searching />
      <SearchCommand />
    </>
  ),
};

export const WithResults: Story = {
  name: "Open · with results",
  render: () => (
    <>
      <PrimeStore isOpen query="a" results={sampleResults} />
      <SearchCommand />
    </>
  ),
};

export const NotFound: Story = {
  name: "Open · no matches",
  render: () => (
    <>
      <PrimeStore isOpen query="zzzzz" notFound />
      <SearchCommand />
    </>
  ),
};
