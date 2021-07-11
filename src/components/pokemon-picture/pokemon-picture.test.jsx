import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";
import Picture from "./pokemon-picture";

describe("WHEN: Picture", () => {
  const component = renderer.create(
    <Router>
      <Picture id={1} />
    </Router>
  );
  const tree = component.toJSON();
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  it("THEN: img must have src with pokemon id url and alt = Pokemon", () => {
    render(
      <Router>
        <Picture id={1} />
      </Router>
    );
    const img = screen.getByAltText("Pokemon");
    expect(img).toHaveAttribute(
      "src",
      "https://pokeres.bastionbot.org/images/pokemon/1.png"
    );
    expect(img).toHaveAttribute("alt", "Pokemon");
  });
});
