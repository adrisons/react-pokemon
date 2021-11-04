import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";
import { combineReducers, createStore } from "redux";
import pokemonsReducer from "../../redux/pokemons/pokemons.reducer";
import HomePage from "./home-page";

describe("GIVEN: HomePage", () => {
  let tree;
  beforeEach(() => {
    const store = createStore(
      combineReducers({
        pokemons: pokemonsReducer,
      })
    );
    const component = renderer.create(
      <Provider store={store}>
        <Router>
          <HomePage />
        </Router>
      </Provider>
    );
    tree = component.toJSON();
  });
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  describe("WHEN: data not loaded", () => {
    beforeEach(() => {
      jest.spyOn(window, "fetch").getMockImplementation(
        () =>
          new Promise((resolve, reject) => {
            resolve();
          })
      );
    });
    it("THEN: should display loading", () => {
      expect(tree.props.className).toEqual("loading");
    });
  });
});
