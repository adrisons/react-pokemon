import { act } from "react";
import renderer from "react-test-renderer";
import typeColors from "@shared/constants/typeColors";
import Badge from "./Badge";

describe("WHEN: Badge", () => {
  let tree: renderer.ReactTestRendererJSON | null;
  beforeEach(() => {
    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(<Badge name="bug" />);
    });
    tree = component!.toJSON() as renderer.ReactTestRendererJSON;
  });
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });
  it("THEN: should display correct border color", () => {
    expect(tree!.props.style.border.includes(typeColors["bug"])).toBeTruthy();
    expect(tree!.props.style.border.includes(typeColors["dragon"])).toBeFalsy();
  });
});
