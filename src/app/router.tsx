import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Loading } from "@shared/ui";

const PokemonListPage = lazy(
  () => import("@features/pokemon-list/pages/PokemonListPage")
);
const PokemonDetailPage = lazy(
  () => import("@features/pokemon-detail/pages/PokemonDetailPage")
);

function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/react-pokemon/" element={<PokemonListPage />} />
        <Route path="/react-pokemon/detail/:id" element={<PokemonDetailPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
