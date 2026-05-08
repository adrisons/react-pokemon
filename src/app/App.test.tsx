import { render } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import App from "./App";

describe("WHEN: PokemonList with no pokemons", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(
      <Router initialEntries={["/react-pokemon/"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </Router>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
