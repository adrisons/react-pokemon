import { Link } from "react-router-dom";
import logo from "@shared/assets/pokemon-logo.png";

const Navbar = () => (
  <div className="h-17.5 w-full flex justify-center mt-20 mb-20">
    <Link to="/react-pokemon/" className="h-full">
      <img src={logo} alt="logo" className="h-full" />
    </Link>
  </div>
);

export default Navbar;
