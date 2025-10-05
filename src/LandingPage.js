import React from "react";
import Navbar from "./Components/LoginSignUpLandingNavbar";
import "./LandingPage.css";
import logo from "./images/ClassroomConnect.png";
import books from "./images/books.png";
import goal from "./images/goal.png";
import ChalkTray from "./Components/ChalkTray";

function LandingPage() {
  return (
    <div>
        <Navbar />
        
        <div className="landing-first-container">
            <div>
            <img className="Landing-Logo" src={logo} alt="Classroom Connect Logo" />
            <img className="Landing-Books" src={books} alt="Books" />
            <img className="Landing-Goal" src={goal} alt="Goal" />
            </div>
            <svg
          className="curve-line"
          viewBox="0 0 200 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 0 C120 200, 80 400, 100 600"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
            </svg>
            <div className="landing-quote">
                <h1>Supporting Teachers,<br /> &nbsp;&nbsp;&nbsp;&nbsp;Empowering Classrooms.</h1>
                <div className="landing-quote-subtext">
                    <p>A central place for teachers to share classroom needs and parents to help directly</p>
                </div>
                <div>
                    <button className="BrowseListingsButton">Browse<br />Wishlists</button>
                    <button className="PostListingsButton">Post<br />Listings</button>
                </div>
            </div>

        </div>
        <ChalkTray />

      <h1>Welcome to Classroom Connect</h1>
      <p>Connecting parents and teachers to support classroom needs.</p>
    </div>
  );
}

export default LandingPage;
