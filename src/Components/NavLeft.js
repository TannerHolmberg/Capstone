import React from "react";
import "./NavLeft.css";
import { NavLink } from "react-router-dom";

const NavLeft = () => {
    return ( 
        <div className="nav-left">
            <h1>Classroom<br></br>Connect</h1>
            <NavLink to='/dashboard' className="nav-link">Dashboard</NavLink>
            <NavLink to='/map' className="nav-link">Map</NavLink>
            <NavLink to='/managelistings' className="nav-link">Manage Listings</NavLink>
            <NavLink to='/managewishlists' className="nav-link">Manage WishLists</NavLink>
            <NavLink to='/' className="nav-link">Messages</NavLink>
            <NavLink to='/' className="nav-link">Profile</NavLink>

        </div>
     );
}
 
export default NavLeft;