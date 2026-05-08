import { render } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import PokemonDetailPage from "./PokemonDetailPage";

describe("GIVEN: PokemonDetailPage", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PokemonDetailPage />
      </Router>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  describe("WHEN: data not loaded", () => {
    it("THEN: should display loading", () => {
      const { container } = render(
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <PokemonDetailPage />
        </Router>
      );
      expect(container.firstChild).toHaveClass("justify-center");
    });
  });
});
