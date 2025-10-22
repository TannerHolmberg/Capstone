import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
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
    const [isTeacher, setIsTeacher] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name in Firebase Auth
            await updateProfile(userCredential.user, {
            displayName: `${firstName} ${lastName}`,
            });

            // Create Firestore document for user
            await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            firstName: firstName,
            lastName: lastName,
            email: email,
            isTeacher: isTeacher,
            createdAt: new Date(),
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
                        <h2>Signup</h2>
                        <input type="First" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} required />
                        <input type="Last" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} required />
                        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />  
                        <div class="radio-group">
                            <label for="teacher">Are you a Teacher?</label>
                            <input type="checkbox" id="teacher" name="role" value="teacher" onChange={(e) => setIsTeacher(e.target.checked)} required />
                        </div>
                        <button type="submit">Create Account</button>
                    </form>
                    <div className="login-redirect">
                        <p>Already have an account?</p>
                        <NavLink to="/login">Login here</NavLink>
                    </div>
                </div>    
            </div>
        </div> 
     );
}
 
export default SignupPage;