import { render } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import PokemonList from "./PokemonList";

const pokemonsMock = [
  { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
  { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
  { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
];

describe("GIVEN: PokemonList", () => {
  describe("WHEN: PokemonList with no pokemons", () => {
    it("THEN: should match snapshot", () => {
      const { container } = render(<PokemonList />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("WHEN: PokemonList with pokemons", () => {
    it("THEN: should match snapshot", () => {
      const { container } = render(
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <PokemonList pokemons={pokemonsMock} />
        </Router>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
