import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";
import { store } from "@app/store";
import PokemonListPage from "./PokemonListPage";

describe("GIVEN: PokemonListPage", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(
      <Provider store={store}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <PokemonListPage />
        </Router>
      </Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  describe("WHEN: data not loaded", () => {
    it("THEN: should display loading", () => {
      const { container } = render(
        <Provider store={store}>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <PokemonListPage />
          </Router>
        </Provider>
      );
      expect(container.firstChild).toHaveClass("justify-center");
    });
  });
});
