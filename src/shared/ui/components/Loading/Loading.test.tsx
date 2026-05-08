import { render, screen } from "@testing-library/react";
import pokeball from "@shared/assets/pokeball.png";
import Loading from "./Loading";

describe("WHEN: Loading", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("THEN: img must have src = pokeball.png and alt = loading", () => {
    render(<Loading />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", pokeball);
    expect(img).toHaveAttribute("alt", "loading");
  });
});
