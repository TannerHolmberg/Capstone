import NavLeft from "./Components/NavLeft";
import TopBar from "./Components/TopBar";
import MobileNavbar from "./Components/MobileNavbar";
import LoadingPage from "./Components/LoadingPage";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import List from "./images/list.png"
import Wishlist from "./images/wishlist.png"
import "./Dashboard.css";
const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const Navigate = useNavigate();
    const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
        if (auth.currentUser) {
            setUser(auth.currentUser);
            setLoading(false);
            return;
        }
          if(!auth.currentUser) {
              Navigate('/login');
          }

          const user = auth.currentUser;
          

          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          const data = docSnap.data();
          console.log("CHeck here alright");
          console.log(data);

          if (docSnap) {
              if(data.isTeacher == false){
                Navigate('/login');
              }
          }

          setTimeout(() => {
              setLoading(false);
            }, 400);
        };
        checkUser();
      }, []);


    const greeting = "Welcome!";

    if (loading) {
        return <LoadingPage />;
    }
    return ( <div>
        <NavLeft />
        <MobileNavbar />
        <TopBar message={greeting}/>
        <div className="dashboard-content">
            <div className="dashboard-postit-section">
                <div id="postit1" className="postit-dashboard">
                    <div className="tape"></div>
                </div>
                <div id="postit2" className="postit-dashboard">
                    <div className="tape"></div>
                </div>
                <div id="postit3" className="postit-dashboard">
                    <div className="tape"></div>
                </div>
                <div id="postit4" className="postit-dashboard">
                    <div className="tape"></div>
                </div>
            </div>
            <div className="dashboard-recent-listings-section">
                <div className="section-describer">
                    <img src={List} alt="Recent Listings"/>
                    <h2>Recent Listings</h2>
                </div>
                <div className="recentListingsBox"></div>
            </div>
            <div className="dashboard-recent-wishlists-section">
                <div className="recentListingsBox"></div>
                <div className="section-describer">
                    <img src={Wishlist} alt="Recent Wishlists"/>
                    <h2>Recent Wishlists</h2>
                </div>
            </div>
        </div>
    </div> );
}
 
export default Dashboard;