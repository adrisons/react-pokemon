import { act } from "react";
import renderer from "react-test-renderer";
import Pagination from "./Pagination";

describe("WHEN: Pagination with no prev page link", () => {
  let tree;
  beforeEach(() => {
    let component;
    act(() => {
      component = renderer.create(<Pagination gotoNextPage="next-page" />);
    });
    tree = component.toJSON();
  });
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  it("THEN: component should not display prev page button", () => {
    expect(tree.children.length).toEqual(1);
  });
});

describe("WHEN: Pagination with prev page link", () => {
  let tree;
  beforeEach(() => {
    let component;
    act(() => {
      component = renderer.create(
        <Pagination gotoNextPage="next-page" gotoPrevPage="prev-page" />
      );
    });
    tree = component.toJSON();
  });
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  it("THEN: component should display prev page button", () => {
    expect(tree.children.length).toEqual(2);
  });
});
