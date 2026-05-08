import { render } from "@testing-library/react";
import Loading from "./Loading";

describe("WHEN: Loading", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
