import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import HomePage from "./pages/home/home-page";
import DetailPage from "./pages/detail/detail-page";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/react-pokemon/" element={<HomePage />} />
        <Route path="/react-pokemon/detail/:id" element={<DetailPage />} />
      </Routes>
    </>
  );
}

export default App;
