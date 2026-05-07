import { act } from "react";
import { Provider } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";
import { combineReducers, createStore } from "redux";
import { pokemonsReducer } from "@features/pokemon/store";
import PokemonListPage from "./PokemonListPage";

describe("GIVEN: PokemonListPage", () => {
  let tree;
  beforeEach(() => {
    const store = createStore(
      combineReducers({ pokemons: pokemonsReducer })
    );
    let component;
    act(() => {
      component = renderer.create(
        <Provider store={store}>
          <Router>
            <PokemonListPage />
          </Router>
        </Provider>
      );
    });
    tree = component.toJSON();
  });
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  describe("WHEN: data not loaded", () => {
    it("THEN: should display loading", () => {
      expect(tree.props.className).toEqual("loading");
    });
  });
});
