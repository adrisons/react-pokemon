import { render } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
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
});
