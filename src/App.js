import React from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import HomePage from "./pages/home/home-page";
import DetailPage from "./pages/detail/detail-page";

function App() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/react-pokemon/">
          <HomePage />
        </Route>
        <Route path="/react-pokemon/detail/:id">
          <DetailPage />
        </Route>
      </Switch>
    </>
  );
}

export default App;
