import React, { useState, useEffect } from "react";
import "./NavLeft.css";
import { NavLink } from "react-router-dom";
import { auth } from "../firebase";

const NavLeft = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    return ( 
        <div className="nav-left">
            <h1>Classroom<br></br>Connect</h1>
            <NavLink to='/dashboard' className="nav-link">Dashboard</NavLink>
            <NavLink to='/map' className="nav-link">Map</NavLink>
            <NavLink to='/managelistings' className="nav-link">Manage Listings</NavLink>
            <NavLink to='/managewishlists' className="nav-link">Manage WishLists</NavLink>
            <NavLink to='/chatoverview' className="nav-link">Messages</NavLink>
            <NavLink to='/isdsearch' className="nav-link">Teacher Search</NavLink>
            <NavLink to={user ? `/profile/${user}` : '/profile'} className="nav-link">Profile</NavLink>
        </div>
     );
}
 
export default NavLeft;