import { render } from "@testing-library/react";
import Badge from "./Badge";

describe("WHEN: Badge", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(<Badge name="bug" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
