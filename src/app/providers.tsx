import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

function Providers({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {children}
    </BrowserRouter>
  );
}

export default Providers;
