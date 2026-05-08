import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import PokemonListPageView from "./PokemonListPageView";
import type { PokemonSummary } from "@core/domain/pokemon";

const samplePokemons: PokemonSummary[] = [
  { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
  { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
  { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
  { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
  { name: "charmeleon", url: "https://pokeapi.co/api/v2/pokemon/5/" },
];

const pikResults: PokemonSummary[] = [
  { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
  { name: "pikipek", url: "https://pokeapi.co/api/v2/pokemon/731/" },
];

const meta: Meta<typeof PokemonListPageView> = {
  title: "Features/PokemonListPage",
  component: PokemonListPageView,
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
  args: {
    onQueryChange: () => {},
    gotoNextPage: () => {},
    gotoPrevPage: () => {},
  },
  parameters: {
    docs: {
      description: {
        component:
          "Main pokémon list page with auto-search (debounced 500ms). Supports partial name matching — typing 'pik' returns pikachu, pikipek, etc.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PokemonListPageView>;

export const Default: Story = {
  name: "Default list (no search)",
  args: {
    pokemons: samplePokemons,
    loading: false,
    error: false,
    query: "",
    searchResults: [],
    searching: false,
    notFound: false,
  },
};

export const Loading: Story = {
  name: "Loading state",
  args: {
    pokemons: [],
    loading: true,
    error: false,
    query: "",
    searchResults: [],
    searching: false,
    notFound: false,
    gotoNextPage: null,
    gotoPrevPage: null,
  },
};

export const SearchInProgress: Story = {
  name: "Searching... (debounce pending)",
  parameters: {
    docs: {
      description: {
        story:
          "Shows the loading indicator while the debounced search request is in flight. The pokémon list and pagination are hidden.",
      },
    },
  },
  args: {
    pokemons: samplePokemons,
    loading: false,
    error: false,
    query: "pik",
    searchResults: [],
    searching: true,
    notFound: false,
  },
};

export const WithResults: Story = {
  name: "Search results (partial match 'pik')",
  parameters: {
    docs: {
      description: {
        story:
          "After typing 'pik', the search returns all pokémons whose name contains that substring. 'pichu' is excluded since it contains 'pic', not 'pik'.",
      },
    },
  },
  args: {
    pokemons: samplePokemons,
    loading: false,
    error: false,
    query: "pik",
    searchResults: pikResults,
    searching: false,
    notFound: false,
    gotoNextPage: null,
    gotoPrevPage: null,
  },
};

export const NotFound: Story = {
  name: "Not even a nibble... (no results)",
  parameters: {
    docs: {
      description: {
        story:
          "When the search query doesn't match any pokémon, 'Not even a nibble...' is shown. Hovering over it reveals the tooltip 'No pokemon found'.",
      },
    },
  },
  args: {
    pokemons: samplePokemons,
    loading: false,
    error: false,
    query: "xyznotexists",
    searchResults: [],
    searching: false,
    notFound: true,
    gotoNextPage: null,
    gotoPrevPage: null,
  },
};

export const Error: Story = {
  name: "Error state",
  args: {
    pokemons: [],
    loading: false,
    error: true,
    query: "",
    searchResults: [],
    searching: false,
    notFound: false,
    gotoNextPage: null,
    gotoPrevPage: null,
  },
};
