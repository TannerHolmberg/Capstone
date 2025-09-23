import React, { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(user => console.log("Signed Up:", user))
      .catch(err => console.error(err));
  };

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(user => console.log("Logged In:", user))
      .catch(err => console.error(err));
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <div className = "Background">
      <div id="LoginForm">
        <h3 id="LoginHeader">Login</h3>
        <div className="inputField" id="emailField">
          <label>Email:</label>
          <input className="" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="inputField">
          <label>Password:</label>
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        </div>
        <div id="buttonContainer">
          <button id="signUp" onClick={signup}>Sign Up</button>
          <button onClick={login}>Login</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default App;
