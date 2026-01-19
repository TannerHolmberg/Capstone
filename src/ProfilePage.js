import "./ManageWishlistPage.css";
import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';
import books from "./images/books.png";
import { NavLink } from "react-router-dom";
import { collection, getDocs, doc, getDoc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase";
import ChalkTray from "./Components/ChalkTray"; 
import MobileNavbar from "./Components/MobileNavbar";
import React, { useState, useEffect } from "react";

function ProfilePage() {
    return (
        <div>
            <NavLeft />
            <TopBar />
        </div>
    );
}

export default ProfilePage;