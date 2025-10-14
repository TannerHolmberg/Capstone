import React from "react";
import Navbar from "./Components/LoginSignUpLandingNavbar";
import "./SignupPage.css";
import logo from "./images/ClassroomConnect.png";
import ChalkTray from "./Components/ChalkTray";



function SignupPage() {
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
                    <form>
                        <h2>Signup Page</h2>
                        <input type="First" placeholder="First Name" required />
                        <input type="Last" placeholder="Last Name" required />
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Password" required />    
                        <button type="submit">Create Account</button>
                    </form>
                </div>    
            </div>
            <ChalkTray />
        </div> 
     );
}
 
export default SignupPage;