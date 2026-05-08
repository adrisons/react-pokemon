import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App, Providers } from "@app";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);

reportWebVitals();
