import React from "react";
import { Link } from "react-router-dom";
import "./navbar.styles.scss";
import logo from "../../assets/pokemon-logo.png";

const Navbar = () => (
  <div className="navbar">
    <Link to="/react-pokemon/" className="logo-container">
      <img src={logo} alt="logo" className="logo" />
    </Link>
  </div>
);

export default Navbar;
