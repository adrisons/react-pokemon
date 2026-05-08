import { render, screen } from "@testing-library/react";
import typeColors from "@shared/constants/typeColors";
import Badge from "./Badge";

describe("WHEN: Badge", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(<Badge name="bug" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("THEN: should display correct border color", () => {
    render(<Badge name="bug" />);
    const badge = screen.getByText("bug");
    // jsdom normalizes hex colors to rgb in computed styles
    expect(badge.style.borderLeftColor).toBe("rgb(114, 159, 63)");
    expect(badge.style.borderLeftColor).not.toBe("rgb(83, 164, 207)");
  });
});
