import { Route, Routes } from "react-router-dom";
import { PokemonListPage, PokemonDetailPage } from "@features/pokemon/pages";

function AppRouter() {
  return (
    <Routes>
      <Route path="/react-pokemon/" element={<PokemonListPage />} />
      <Route path="/react-pokemon/detail/:id" element={<PokemonDetailPage />} />
    </Routes>
  );
}

export default AppRouter;
