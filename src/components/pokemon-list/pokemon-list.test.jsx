import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";
import PokemonList from "./pokemon-list";
describe("GIVEN: PokemonList", () => {
  describe("WHEN: PokemonList with no pokemons", () => {
    const component = renderer.create(<PokemonList />);
    const tree = component.toJSON();
    it("THEN: should match snapshot", () => {
      expect(tree).toMatchSnapshot();
    });

    it("THEN: component should display no pokemons found message", () => {
      expect(tree.children.length).toEqual(1);
      expect(tree.children[0].props.className).toEqual("not-found");
    });
  });

  describe("WHEN: PokemonList with pokemons", () => {
    const pokemonsMock = [
      {
        name: "bulbasaur",
        url: "https://pokeapi.co/api/v2/pokemon/1/",
      },
      {
        name: "ivysaur",
        url: "https://pokeapi.co/api/v2/pokemon/2/",
      },
      {
        name: "venusaur",
        url: "https://pokeapi.co/api/v2/pokemon/3/",
      },
    ];
    const component = renderer.create(
      <Router>
        <PokemonList pokemons={pokemonsMock} />
      </Router>
    );
    const tree = component.toJSON();
    it("THEN: should match snapshot", () => {
      expect(tree).toMatchSnapshot();
    });

    it("THEN: component should display pokemons list", () => {
      expect(tree.children.length).toEqual(3);
    });
    it("THEN: each element should have a link with its ID", () => {
      expect(tree.children[0].children[0].props.href).toEqual("/detail/1");
      expect(tree.children[1].children[0].props.href).toEqual("/detail/2");
      expect(tree.children[2].children[0].props.href).toEqual("/detail/3");
    });
    it("THEN: each element should display pokemon name and ID", () => {
      const linkObj = tree.children[0].children[0];
      expect(linkObj.children[0].children.join("")).toEqual("#1");
      expect(linkObj.children[1].children.join("")).toEqual("bulbasaur");
    });
  });
});
