import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import Navbar from "./Components/LoginSignUpLandingNavbar";
import ChalkTray from "./Components/ChalkTray";
import "./SignupPage.css";
import logo from "./images/ClassroomConnect.png";

function SignupPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
            displayName: `${firstName} ${lastName}`,
        });
        alert("Account created successfully!");
        console.log("User created:", userCredential.user);
        navigate("/login");
        } catch (err) {
            alert(err.message);
        }
    };

    return ( 
        <div>
            <Navbar />
            <div className="signup-container">
                <div className="signup-logo-quote-container">
                    <img className="signup-logo" src={logo} alt="Classroom Connect Logo" />
                    <div className="signup-quote">
                        <h1>Supporting Teachers,<br /> &nbsp;&nbsp;Empowering <br /> &nbsp;Classrooms.</h1>
                    </div>
                </div>
                <div className="signup-form">      
                    <form onSubmit={handleSignup}>
                        <h2>Signup Page</h2>
                        <input type="First" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} required />
                        <input type="Last" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} required />
                        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />    
                        <button type="submit">Create Account</button>
                    </form>
                </div>    
            </div>
            <ChalkTray />
        </div> 
     );
}
 
export default SignupPage;