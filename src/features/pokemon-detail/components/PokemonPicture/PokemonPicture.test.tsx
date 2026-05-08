import { render } from "@testing-library/react";
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
});
