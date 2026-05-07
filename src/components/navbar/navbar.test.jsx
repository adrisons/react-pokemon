import { act } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";
import logo from "../../assets/pokemon-logo.png";
import Navbar from "./navbar";

describe("WHEN: Navbar", () => {
  let tree;
  beforeEach(() => {
    let component;
    act(() => {
      component = renderer.create(
        <Router>
          <Navbar />
        </Router>
      );
    });
    tree = component.toJSON();
  });
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  it("THEN: img must have src = pokemon-logo.png and alt = logo", () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", logo);
    expect(img).toHaveAttribute("alt", "logo");
  });
});
