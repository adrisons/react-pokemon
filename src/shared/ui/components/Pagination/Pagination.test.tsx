import { render } from "@testing-library/react";
import Pagination from "./Pagination";

describe("WHEN: Pagination with no prev page link", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(<Pagination gotoNextPage={() => {}} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("WHEN: Pagination with prev page link", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(
      <Pagination gotoNextPage={() => {}} gotoPrevPage={() => {}} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
