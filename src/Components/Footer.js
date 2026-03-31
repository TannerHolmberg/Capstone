import React from 'react';
import "./Footer.css";
import ChalkTray from './ChalkTray';
import { NavLink } from 'react-router-dom';

const OutsideFooter = ({ iconCredits = [] }) => {
    return ( 
        <div className="footer-outside-container">
            <div className="Footer-Header">
                <h2>Classroom Connect</h2>
            </div>

            <div className="Footer-body">
                {/* Navigation links */}
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

                {/* Icon credits — rendered dynamically from the prop  */}
                {iconCredits.length > 0 && (
                    <div className="footer-links-section">
                        <h4>Icon Credits</h4>
                        <ul className="Footer-links">
                            {iconCredits.map((credit, index) => (
                                <li key={index}>
                                    {credit.url ? (
                                        <a
                                            href={credit.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="footer-credit-link"
                                        >
                                            {credit.name} icon by {credit.author}
                                        </a>
                                    ) : (
                                        <p>{credit.name} icon by {credit.author}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <ChalkTray />
        </div>
    );
}
 
export default OutsideFooter;
