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
    const [schoolName, setSchoolName] = useState("");
    const [isdName, setIsdName] = useState("");
    const navigate = useNavigate();

    function normalize(text) {
      return text.trim().toLowerCase().replace(/\s+/g, '');
    }

    const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      const userData = {
        uid: userCredential.user.uid,
        firstName,
        lastName,
        email,
        isTeacher,
        createdAt: new Date(),
      };

      // only include school info if isTeacher = true
      if (isTeacher) {
        userData.schoolName = schoolName;
        userData.isdName = normalize(isdName);
        const teacherData ={
          teacherName: `${firstName} ${lastName}`,
          schoolName: schoolName,
          isdName: normalize(isdName),
          email: email,
          searchName: normalize(`${firstName} ${lastName}`),
        }

        await setDoc(doc(db, "teachers", userCredential.user.uid), teacherData);
        await setDoc(doc(db, "isds", normalize(isdName)), {
          displayName: isdName,
          searchKey: normalize(isdName),
        });
      }

      await setDoc(doc(db, "users", userCredential.user.uid), userData);

      alert("Account created successfully!");
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
                        <div className="radio-group">
              <label htmlFor="teacher">Are you a Teacher?</label>
              <input
                type="checkbox"
                id="teacher"
                name="role"
                checked={isTeacher}
                onChange={(e) => setIsTeacher(e.target.checked)}
              />
            </div>

            {/* ✅ Show school + ISD fields only when checked */}
            {isTeacher && (
              <div className="teacher-extra-fields">
                <input
                  type="text"
                  placeholder="School Name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required={isTeacher}
                />
                <input
                  type="text"
                  placeholder="ISD Name"
                  value={isdName}
                  onChange={(e) => setIsdName(e.target.value)}
                  required={isTeacher}
                />
              </div>
            )}
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