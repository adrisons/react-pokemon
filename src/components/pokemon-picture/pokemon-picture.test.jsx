import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";
import Picture from "./pokemon-picture";

describe("WHEN: Picture", () => {
  const component = renderer.create(
    <Router>
      <Picture imageUrl={"imageUrl"} />
    </Router>
  );
  const tree = component.toJSON();
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  it("THEN: img must have src with pokemon id url and alt = Pokemon", () => {
    render(
      <Router>
        <Picture imageUrl={"imageUrl"} />
      </Router>
    );
    const img = screen.getByAltText("Pokemon");
    expect(img).toHaveAttribute("src", "imageUrl");
    expect(img).toHaveAttribute("alt", "Pokemon");
  });
});
