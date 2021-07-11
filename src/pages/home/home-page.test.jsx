import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";
import HomePage from "./home-page";

describe("GIVEN: HomePage", () => {
  const component = renderer.create(
    <Router>
      <HomePage />
    </Router>
  );
  const tree = component.toJSON();
  it("THEN: should match snapshot", () => {
    expect(tree).toMatchSnapshot();
  });

  describe("WHEN: data not loaded", () => {
    beforeEach(() => {
      jest.spyOn(window, "fetch").getMockImplementation(
        () =>
          new Promise((resolve, reject) => {
            resolve();
          })
      );
    });
    it("THEN: should display loading", () => {
      expect(tree.props.className).toEqual("loading");
    });
  });
});
