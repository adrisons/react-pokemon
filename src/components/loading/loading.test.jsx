import React from "react";
import renderer from "react-test-renderer";
import pokeball from "../../assets/pokeball.png";
import Loading from "./loading";
import { render, screen } from "@testing-library/react";

describe("WHEN: Loading", () => {
  const component = renderer.create(<Loading />);
  const tree = component.toJSON();
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  it("THEN: img must have src = pokeball.png and alt = loading", () => {
    render(<Loading />);
    const logo = screen.getByRole("img");
    expect(logo).toHaveAttribute("src", pokeball);
    expect(logo).toHaveAttribute("alt", "loading");
  });
});
