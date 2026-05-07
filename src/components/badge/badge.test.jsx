import { act } from "react";
import renderer from "react-test-renderer";
import typeColors from "../../helpers/type-colors";
import Badge from "./badge";

describe("WHEN: Badge", () => {
  let tree;
  beforeEach(() => {
    let component;
    act(() => {
      component = renderer.create(<Badge name="bug" />);
    });
    tree = component.toJSON();
  });
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });
  it("THEN: should display correct border color", () => {
    expect(tree.props.style.border.includes(typeColors["bug"])).toBeTruthy();
    expect(tree.props.style.border.includes(typeColors["dragon"])).toBeFalsy();
  });
});
