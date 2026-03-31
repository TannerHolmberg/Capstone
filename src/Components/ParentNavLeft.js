import React, { useState, useEffect } from "react";
import "./NavLeft.css"; // reuses the same .nav-left / .nav-link styles
import { NavLink } from "react-router-dom";
import { auth } from "../firebase";

const ParentNavLeft = () => {
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
            <h1>Classroom<br />Connect</h1>
            <NavLink to='/parentdashboard' className="nav-link">Dashboard</NavLink>
            <NavLink to='/map' className="nav-link">Map</NavLink>
            <NavLink to='/isdsearch' className="nav-link">Find Teachers</NavLink>
            <NavLink to='/chatoverview' className="nav-link">Messages</NavLink>
        </div>
    );
}
 
export default ParentNavLeft;
