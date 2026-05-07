import { act } from "react";
import { MemoryRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";
import PokemonDetailPage from "./PokemonDetailPage";

describe("GIVEN: PokemonDetailPage", () => {
  let tree;
  beforeEach(() => {
    let component;
    act(() => {
      component = renderer.create(
        <Router>
          <PokemonDetailPage />
        </Router>
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
