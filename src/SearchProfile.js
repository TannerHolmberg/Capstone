import React, { useState, useEffect } from "react"; 
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { db } from "./firebase"; 
import { useParams } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import NavLeft from "./Components/NavLeft";
import TopBar from "./Components/TopBar";
import MobileNavbar from "./Components/MobileNavbar";
import LoadingPage from "./Components/LoadingPage";
import "./ISDSearchPage.css";
const SearchProfile = () => {
    const greeting = "Teacher Profile";



    return ( <div>
        <NavLeft />
        <MobileNavbar />
        <TopBar message={greeting}/>
        <div className="Main-container-isdsearch">
            <h3>Take over here, notice the teachers name in the url</h3>
        </div>
    </div> );
}
 
export default SearchProfile;