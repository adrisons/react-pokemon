import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

export function createWrapper(initialSearch = "") {
  const initialEntries = initialSearch ? [`/${initialSearch}`] : ["/"];
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter
        initialEntries={initialEntries}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        {children}
      </MemoryRouter>
    );
  };
}
