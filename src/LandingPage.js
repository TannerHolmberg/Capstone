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
import OutsideFooter from "./Components/Footer";
import PushPin from "./Components/PushPin";
import Bulb from './images/icons8-bulb-96.png';
import Glass from './images/glass.png';
import Trust from './images/trust.png';
import Teaching from './images/teaching.png';



function LandingPage() {
  return (
    <div>
        <Navbar />
        <div className="landing-first-container">
            <div className="landing-images-container">
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
          <div className="bullitenBorderL"></div>
          <div className="bullitenBorderR"></div>
          <div className="postIt1">
            <div className="pushPinTop">
                <PushPin />
              </div>
            <h2 className="PostitHeader">How It Works</h2>
            <div className="postItImage">
              <img src={Bulb} alt="Light Bulb" />
            </div>
          </div>
          <div className="postItContainer">
            <div className="postIt2" id="postItGreen">
              <div className="pushPinTop">
                <PushPin />
              </div>
              <h2 className="PostitHeaderSub">Post and Browse Listings</h2>
              <div className="postItImage">
                <img src={Glass} alt="Magnifying Glass" />
              </div>
              <div className="postItText">
                <p>Teachers share supplies or find affordable items.</p>
              </div>
            </div>
            <div className="postIt2" id="postItBlue">
              <div className="pushPinTop">
                <PushPin />
              </div>
            <h2 className="PostitHeaderSub">Give to Teachers</h2>
            <div className="postItImage">
            <img src={Trust} alt="Hand holding heart" />
            </div>
            <div className="postItText">
                <p>Parents shop wishlists directly for classrooms.</p>
              </div>

            </div>
            <div className="postIt2" id="postItPink">
              <div className="pushPinTop">
                <PushPin />
              </div>
            <h2 className="PostitHeaderSub">Equip Classrooms</h2>
            <div className="postItImage">
            <img src={Teaching} alt="School supplies" />
            </div>
            <div className="postItText">
              <p>Students benefit from better-supplied learning.</p>
            </div>

            </div>
          </div>
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
        <section className="ReportCard">
          <img className="rcLogo" src={logo} alt="Classroom Connect Logo" />
          <h2 className="ReportCardHeader">Report Card</h2>
          <table>
            <tr>
              <th>Subject</th>
              <th>Grade</th>
            </tr>
            <tr>
              <td className="subjectData">Teachers save money</td>
              <td><span style={{ color: 'red', fontFamily: 'Handlee, cursive' }}>A+</span></td>
            </tr>
            <tr>
              <td>Parents give directly</td>
              <td><span style={{ color: 'red', fontFamily: 'Handlee, cursive' }}>A+</span></td>
            </tr>
            <tr>
              <td>Students succeed</td>
              <td><span style={{ color: 'red', fontFamily: 'Handlee, cursive' }}>A+</span></td>
            </tr>
          </table>
          <p className="reportCardText">Join today!</p>
          <div>
                    <button id="reportCardButton1" className="BrowseListingsButton">Browse<br />Wishlists</button>
                    <button id="reportCardButton2" className="PostListingsButton">Post<br />Listings</button>
                </div>
        </section>
      <OutsideFooter />
    </div>
  );
}

export default LandingPage;
