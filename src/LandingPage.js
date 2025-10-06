import React from "react";
import Navbar from "./Components/LoginSignUpLandingNavbar";
import "./LandingPage.css";
import logo from "./images/ClassroomConnect.png";
import books from "./images/books.png";
import goal from "./images/goal.png";
import ChalkTray from "./Components/ChalkTray";
import dollarBag from "./images/dollarBag.png";
import family from "./images/family.png";
import wallet from "./images/Wallet.png";

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
        <div className="bullitenDivider"></div>
        <section className="bullitenBoard">
          <div className="bullitenBorderLR"></div>
          <div className="bullitenBorderLR"></div>
        </section>
        <div className="bullitenDivider"></div>

        <section className="WhiteBoard">
          <div className="HowItWorks">
            <h2>Why It Matters</h2>
          </div>
          <div className="stepsIconsContainer">
            <img src={dollarBag} alt="Dollar Bag" />
            <img src={wallet} alt="Wallet" />
            <img src={family} alt="Family" />
          </div>
          <div className="StepsContainer">
            <div className="Step">
              <p><span style={{ color: 'red' }}>94%</span> of teachers spend their own money on supplies.</p>
            </div>
            <div className="Step" id="middle-step">
              <p>The Average teacher spends <span style={{ color: 'blue' }}>$750</span> per year out of pocket.</p>
            </div>
            <div className="Step" id="last-step">
              <p><span style={{ color: 'rgb(255, 0, 255)' }}>Many</span> Parents want to help but don’t always know how.</p>
            </div>
          </div>
          
        </section>
    </div>
  );
}

export default LandingPage;
