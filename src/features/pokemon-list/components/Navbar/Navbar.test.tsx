import { render, screen } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import logo from "@shared/assets/pokemon-logo.png";
import Navbar from "./Navbar";

describe("WHEN: Navbar", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Navbar />
      </Router>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("THEN: img must have src = pokemon-logo.png and alt = logo", () => {
    render(
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Navbar />
      </Router>
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", logo);
    expect(img).toHaveAttribute("alt", "logo");
  });
});
