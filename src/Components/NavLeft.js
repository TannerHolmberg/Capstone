import React from "react";
import "./NavLeft.css";
import { NavLink } from "react-router-dom";

const NavLeft = () => {
    return ( 
        <div className="nav-left">
            <h1>Classroom<br></br>Connect</h1>
            <NavLink to='/Dashboard' className="nav-link">Dashboard</NavLink>
            <NavLink to='/MapPage' className="nav-link">Map</NavLink>
            <NavLink to='/ManageListings' className="nav-link">Manage Listings</NavLink>
            <NavLink to='/ManageWishlists' className="nav-link">Manage WishLists</NavLink>
            <NavLink to='/ManageWishlists' className="nav-link">Messages</NavLink>
            <NavLink to='/ManageWishlists' className="nav-link">Profile</NavLink>

        </div>
     );
}
 
export default NavLeft;