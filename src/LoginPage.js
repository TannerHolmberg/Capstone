import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./images/ClassroomConnect.png";
import ChalkTray from "./Components/ChalkTray";
import Navbar from "./Components/LoginSignUpLandingNavbar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./LoginPage.css";
import { NavLink } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log(email, password);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

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
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Sign In</button>
          </form>
          <div className="signup-redirect">
            <p>Don't have an account?</p>
            <NavLink to="/signup">Sign up here</NavLink>
          </div>
        </div>
      </div>
      <ChalkTray />
    </div>
  );
}

export default LoginPage;