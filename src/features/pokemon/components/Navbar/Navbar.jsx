import { Link } from "react-router-dom";
import logo from "@shared/assets/pokemon-logo.png";
import "./Navbar.css";

const Navbar = () => (
  <div className="navbar">
    <Link to="/react-pokemon/" className="logo-container">
      <img src={logo} alt="logo" className="logo" />
    </Link>
  </div>
);

export default Navbar;
