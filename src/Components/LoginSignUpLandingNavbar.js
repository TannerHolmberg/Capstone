import React from "react";
import "./LoginSignUpLandingNavbar.css";

function LandingPage() {
  return (
    <div className="navbar">
      <h1 className="landing-page-title">Classroom Connect</h1>
      <div className="login-button-group">
        <button className="login-button">Login</button>
        <button className="signup-button">Sign Up</button>
      </div>
    </div>
  );
}

export default LandingPage;
