import { render, screen } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import PokemonList from "./PokemonList";

describe("GIVEN: PokemonList", () => {
  describe("WHEN: PokemonList with no pokemons", () => {
    it("THEN: should match snapshot", () => {
      const { container } = render(<PokemonList />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("THEN: component should display no pokemons found message", () => {
      render(<PokemonList />);
      expect(screen.getByText("No pokemons found")).toBeInTheDocument();
    });
  });

  describe("WHEN: PokemonList with pokemons", () => {
    const pokemonsMock = [
      { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
      { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
    ];

    it("THEN: should match snapshot", () => {
      const { container } = render(
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <PokemonList pokemons={pokemonsMock} />
        </Router>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("THEN: component should display pokemons list", () => {
      render(
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <PokemonList pokemons={pokemonsMock} />
        </Router>
      );
      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(3);
    });

    it("THEN: each element should have a link with its ID", () => {
      render(
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <PokemonList pokemons={pokemonsMock} />
        </Router>
      );
      const links = screen.getAllByRole("link");
      expect(links[0]).toHaveAttribute("href", "/react-pokemon/detail/1");
      expect(links[1]).toHaveAttribute("href", "/react-pokemon/detail/2");
      expect(links[2]).toHaveAttribute("href", "/react-pokemon/detail/3");
    });

    it("THEN: each element should display pokemon name and ID", () => {
      render(
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <PokemonList pokemons={pokemonsMock} />
        </Router>
      );
      expect(screen.getByText("#1")).toBeInTheDocument();
      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    });
  });
});
