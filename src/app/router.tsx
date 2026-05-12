import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Loading } from "@shared/ui";
import { TooltipProvider } from "@shared/ui/components/ui/tooltip";
import ScrollToTop from "@shared/ui/components/ScrollToTop/ScrollToTop";

const PokemonListPage = lazy(
  () => import("@features/pokemon-list/pages/PokemonListPage")
);
const PokemonDetailPage = lazy(
  () => import("@features/pokemon-detail/pages/PokemonDetailPage")
);
const ComparePage = lazy(
  () => import("@features/compare/pages/ComparePage")
);

function AppRouter() {
  return (
    <TooltipProvider delay={300}>
    <ScrollToTop />
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/react-pokemon/" element={<PokemonListPage />} />
        <Route path="/react-pokemon/detail/:id" element={<PokemonDetailPage />} />
        <Route path="/react-pokemon/compare" element={<ComparePage />} />
      </Routes>
    </Suspense>
    </TooltipProvider>
  );
}

export default AppRouter;
