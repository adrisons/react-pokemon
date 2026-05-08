import { Route, Routes } from "react-router-dom";
import PokemonListPage from "@features/pokemon-list/pages/PokemonListPage";
import PokemonDetailPage from "@features/pokemon-detail/pages/PokemonDetailPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/react-pokemon/" element={<PokemonListPage />} />
      <Route path="/react-pokemon/detail/:id" element={<PokemonDetailPage />} />
    </Routes>
  );
}

export default AppRouter;
