import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import DetailPage from "./detail-page";

describe("GIVEN: DetailPage", () => {
  it("THEN: it renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <Router>
        <DetailPage />
      </Router>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
