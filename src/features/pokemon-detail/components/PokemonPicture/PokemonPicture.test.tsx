import { render, screen } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import PokemonPicture from "./PokemonPicture";

describe("WHEN: Picture", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PokemonPicture imageUrl={"imageUrl"} />
      </Router>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("THEN: img must have src with pokemon id url and alt = Pokemon", () => {
    render(
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PokemonPicture imageUrl={"imageUrl"} />
      </Router>
    );
    const img = screen.getByAltText("Pokemon");
    expect(img).toHaveAttribute("src", "imageUrl");
    expect(img).toHaveAttribute("alt", "Pokemon");
  });
});
