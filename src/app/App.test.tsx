import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";
import { store } from "./store";
import App from "./App";

describe("WHEN: PokemonList with no pokemons", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(
      <Provider store={store}>
        <Router initialEntries={["/react-pokemon/"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </Router>
      </Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
