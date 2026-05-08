import { Link } from "react-router-dom";
import logo from "@shared/assets/pokemon-logo.png";

const Navbar = () => (
  <div className="sticky top-0 z-50 w-full flex justify-center py-3 bg-dark-900/90 border-b border-dark-600 backdrop-blur-sm">
    <Link to="/react-pokemon/" className="h-12 block">
      <img
        src={logo}
        alt="logo"
        className="h-full"
        style={{ filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.35))" }}
      />
    </Link>
  </div>
);

export default Navbar;
