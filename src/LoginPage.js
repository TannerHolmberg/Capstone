import React from "react";
import logo from "./images/ClassroomConnect.png";
import ChalkTray from "./Components/ChalkTray";
import Navbar from "./Components/LoginSignUpLandingNavbar";
import "./LoginPage.css";
import { NavLink } from "react-router-dom";

function LoginPage() {
  return (
    <div>
      <Navbar />
      <div className="login-container">
        <div className="login-logo-quote-container">
          <img className="login-logo" src={logo} alt="Classroom Connect Logo" />
          <div className="login-quote">
            <h1>Supporting Teachers,<br /> &nbsp;&nbsp;Empowering <br /> &nbsp;Classrooms.</h1>
          </div>
        </div>
        <div className="login-form">
          <form>
            <h2>Login</h2>
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
      <ChalkTray />
    </div>
  );
}

export default LoginPage;