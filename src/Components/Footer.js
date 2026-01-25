import React from 'react';
import "./Footer.css";
import ChalkTray from './ChalkTray';
import { NavLink } from 'react-router-dom';

const OutsideFooter = () => {
    return ( 
        <div className="footer-outside-container">
            <div className="Footer-Header">
                <h2>Classroom Connect</h2>
            </div>
            <div className="Footer-body">
            <div className="footer-links-section">
                <h4>Navigation Links</h4>
                <ul className="Footer-links">
                    <li><NavLink className="footer-link" to="/dashboard">Dashboard</NavLink></li>
                    <li><NavLink className="footer-link" to="/chatoverview">Messages</NavLink></li>
                    <li><NavLink className="footer-link" to="/managelisting">Manage Listings</NavLink></li>
                    <li><NavLink className="footer-link" to="/map">Map</NavLink></li>
                </ul>
                <p className="Footer-copy">&copy; {new Date().getFullYear()} Classroom Connect. All rights reserved.</p>
            </div>
            <div className="footer-links-section">
                <h4>Icon Credit</h4>
                <ul className="Footer-links">
                    <li><p>Books icon by Icons8</p></li>
                    <li><p>Goal icon by Icons8</p></li>
                </ul>
            </div>
            </div>
            <ChalkTray />
        </div>

     );
}
 
export default OutsideFooter;