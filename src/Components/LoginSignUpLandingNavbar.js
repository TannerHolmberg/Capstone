import React from "react";
import "./LoginSignUpLandingNavbar.css";
import { NavLink } from "react-router-dom";

function LandingPage() {
  return (
    <div className="navbar">
      <h1 className="landing-page-title">Classroom Connect</h1>
      <div className="login-button-group">
        <NavLink to='/login' className="login-button">Login</NavLink>
        <NavLink to='/signup' className="signup-button">Sign Up</NavLink>
      </div>
    </div>
  );
}

export default LandingPage;
