import { render, screen } from "@testing-library/react";
import Pagination from "./Pagination";

describe("WHEN: Pagination with no prev page link", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(<Pagination gotoNextPage={() => {}} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("THEN: component should not display prev page button", () => {
    render(<Pagination gotoNextPage={() => {}} />);
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });
});

describe("WHEN: Pagination with prev page link", () => {
  it("THEN: should match snapshot", () => {
    const { container } = render(
      <Pagination gotoNextPage={() => {}} gotoPrevPage={() => {}} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("THEN: component should display prev page button", () => {
    render(<Pagination gotoNextPage={() => {}} gotoPrevPage={() => {}} />);
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });
});
