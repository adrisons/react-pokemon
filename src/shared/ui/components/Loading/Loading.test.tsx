import { act } from "react";
import { render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import pokeball from "@shared/assets/pokeball.png";
import Loading from "./Loading";

describe("WHEN: Loading", () => {
  let tree: renderer.ReactTestRendererJSON | null;
  beforeEach(() => {
    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(<Loading />);
    });
    tree = component!.toJSON() as renderer.ReactTestRendererJSON;
  });
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  it("THEN: img must have src = pokeball.png and alt = loading", () => {
    render(<Loading />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", pokeball);
    expect(img).toHaveAttribute("alt", "loading");
  });
});
