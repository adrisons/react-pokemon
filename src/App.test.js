import { BrowserRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";
import App from "./App";

describe("WHEN: PokemonList with no pokemons", () => {
  const component = renderer.create(
    <Router>
      <App />
    </Router>
  );
  const tree = component.toJSON();
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });
});
