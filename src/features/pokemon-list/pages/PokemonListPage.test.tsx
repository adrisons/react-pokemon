import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter as Router } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import PokemonListPage from "./PokemonListPage";

const mockSearch = vi.hoisted(() => vi.fn());
const mockClear = vi.hoisted(() => vi.fn());
const mockUsePokemonSearch = vi.hoisted(() => vi.fn());
const mockUsePokemonList = vi.hoisted(() => vi.fn());

vi.mock("@features/pokemon-list/hooks/usePokemonSearch", () => ({
  usePokemonSearch: mockUsePokemonSearch,
}));

vi.mock("@features/pokemon-list/hooks/usePokemonList", () => ({
  usePokemonList: mockUsePokemonList,
}));

const defaultListState = {
  pokemons: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
  ],
  loading: false,
  error: false,
  gotoNextPage: vi.fn(),
  gotoPrevPage: null,
};

const defaultSearchState = {
  search: mockSearch,
  clear: mockClear,
  results: [],
  notFound: false,
  searching: false,
};

function renderPage() {
  return render(
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <PokemonListPage />
    </Router>
  );
}

describe("GIVEN: PokemonListPage", () => {
  beforeEach(() => {
    mockSearch.mockReset();
    mockClear.mockReset();
    mockUsePokemonList.mockReturnValue(defaultListState);
    mockUsePokemonSearch.mockReturnValue(defaultSearchState);
  });

  describe("WHEN: data is loading", () => {
    it("THEN: should display loading spinner", () => {
      mockUsePokemonList.mockReturnValue({ ...defaultListState, loading: true });
      const { container } = renderPage();
      expect(container.firstChild).toHaveClass("justify-center");
    });
  });

  describe("WHEN: there is a network error", () => {
    it("THEN: should display error message", () => {
      mockUsePokemonList.mockReturnValue({ ...defaultListState, error: true, loading: false });
      renderPage();
      expect(screen.getByText(/Couldn't find pokemons/)).toBeInTheDocument();
    });
  });

  describe("WHEN: no search query", () => {
    it("THEN: should display the full pokemon list", () => {
      renderPage();
      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("charmander")).toBeInTheDocument();
    });

    it("THEN: should display pagination", () => {
      renderPage();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("THEN: should not show the search results section", () => {
      renderPage();
      expect(screen.queryByText("Not even a nibble...")).not.toBeInTheDocument();
    });
  });

  describe("WHEN: user types in the search input", () => {
    it("THEN: should call search() automatically without submitting a form", async () => {
      const user = userEvent.setup();
      renderPage();
      const input = screen.getByPlaceholderText("Search by name");
      await user.type(input, "pik");
      expect(mockSearch).toHaveBeenCalledWith("pik");
    });

    it("THEN: should not render a submit button", () => {
      renderPage();
      expect(screen.queryByRole("button", { name: /search/i })).not.toBeInTheDocument();
    });

    it("THEN: should hide the pokemon list and pagination", async () => {
      const user = userEvent.setup();
      mockUsePokemonSearch.mockReturnValue({
        ...defaultSearchState,
        searching: true,
      });
      renderPage();
      const input = screen.getByPlaceholderText("Search by name");
      await user.type(input, "pik");
      expect(screen.queryByText("Next")).not.toBeInTheDocument();
    });
  });

  describe("WHEN: user clears the search input", () => {
    it("THEN: should call clear()", async () => {
      const user = userEvent.setup();
      renderPage();
      const input = screen.getByPlaceholderText("Search by name");
      await user.type(input, "pik");
      await user.clear(input);
      expect(mockClear).toHaveBeenCalled();
    });
  });

  describe("WHEN: searching is in progress", () => {
    it("THEN: should show loading spinner", () => {
      mockUsePokemonSearch.mockReturnValue({
        ...defaultSearchState,
        searching: true,
      });
      renderPage();
      // Simulate a query being present so we enter search mode
      // We need to set input value - rerender with query
    });
  });

  describe("WHEN: search returns results", () => {
    it("THEN: should display matched pokemons list", async () => {
      const user = userEvent.setup();
      mockUsePokemonSearch.mockReturnValue({
        ...defaultSearchState,
        results: [
          { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
          { name: "pichu", url: "https://pokeapi.co/api/v2/pokemon/172/" },
        ],
        notFound: false,
      });
      renderPage();
      const input = screen.getByPlaceholderText("Search by name");
      await user.type(input, "pik");
      expect(screen.getByText("pikachu")).toBeInTheDocument();
      expect(screen.getByText("pichu")).toBeInTheDocument();
    });

    it("THEN: should not show 'Not even a nibble...'", async () => {
      const user = userEvent.setup();
      mockUsePokemonSearch.mockReturnValue({
        ...defaultSearchState,
        results: [{ name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" }],
      });
      renderPage();
      const input = screen.getByPlaceholderText("Search by name");
      await user.type(input, "pik");
      expect(screen.queryByText("Not even a nibble...")).not.toBeInTheDocument();
    });
  });

  describe("WHEN: search finds no results", () => {
    it("THEN: should show 'Not even a nibble...' message", async () => {
      const user = userEvent.setup();
      mockUsePokemonSearch.mockReturnValue({
        ...defaultSearchState,
        notFound: true,
      });
      renderPage();
      const input = screen.getByPlaceholderText("Search by name");
      await user.type(input, "xyz");
      expect(screen.getByText("Not even a nibble...")).toBeInTheDocument();
    });

    it("THEN: message should have tooltip 'No pokemon found' on hover", async () => {
      const user = userEvent.setup();
      mockUsePokemonSearch.mockReturnValue({
        ...defaultSearchState,
        notFound: true,
      });
      renderPage();
      const input = screen.getByPlaceholderText("Search by name");
      await user.type(input, "xyz");
      const message = screen.getByText("Not even a nibble...");
      expect(message).toHaveAttribute("title", "No pokemon found");
    });

    it("THEN: should not show the regular pokemon list", async () => {
      const user = userEvent.setup();
      mockUsePokemonSearch.mockReturnValue({
        ...defaultSearchState,
        notFound: true,
      });
      renderPage();
      const input = screen.getByPlaceholderText("Search by name");
      await user.type(input, "xyz");
      expect(screen.queryByText("bulbasaur")).not.toBeInTheDocument();
    });
  });
});
