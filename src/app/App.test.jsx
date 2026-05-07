import { act } from "react";
import { MemoryRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";
import App from "./App";

describe("WHEN: PokemonList with no pokemons", () => {
  let tree;
  beforeEach(() => {
    let component;
    act(() => {
      component = renderer.create(
        <Router>
          <App />
        </Router>
      );
    });
    tree = component.toJSON();
  });
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });
});
