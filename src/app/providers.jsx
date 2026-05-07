import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store";

function Providers({ children }) {
  return (
    <BrowserRouter>
      <Provider store={store}>{children}</Provider>
    </BrowserRouter>
  );
}

export default Providers;
