import { Link } from "react-router-dom";
import logo from "@shared/assets/pokemon-logo.png";

const Navbar = () => (
  <div
    className="flex items-center py-3"
    data-testid="primary-nav"
  >
    <Link
      to="/react-pokemon/"
      aria-label="Go to Pokémon home"
      className="h-12 block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
    >
      <img
        src={logo}
        alt="Pokémon"
        className="h-full drop-shadow-[0_0_10px_rgba(255,215,0,0.35)]"
      />
    </Link>
  </div>
);

export default Navbar;
