import "./MobileNavbar.css";
import { useRef, useEffect } from "react";
import ChalkTray from "./ChalkTray";
import { NavLink } from "react-router-dom";

const MobileNavbar = () => {
  const hamburgerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const hamburger = hamburgerRef.current;
    const content = contentRef.current;
    if (!hamburger || !content) return;

    const handleClick = () => {
      hamburger.classList.toggle("active");
      content.classList.toggle("active");
    };

    hamburger.addEventListener("click", handleClick);

    return () => {
      hamburger.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div>
      <div className="hamburger-container" ref={hamburgerRef}>
        <span className="horizontal-bar"></span>
        <span className="horizontal-bar"></span>
        <span className="horizontal-bar"></span>
      </div>
      <div className="mobile-navbar-content" ref={contentRef}>
        <div className="mobile-navbar-links">
        <NavLink to="/dashboard" className="nav-link-mobile">Dashboard</NavLink>
        <NavLink to="/map" className="nav-link-mobile">Map</NavLink>
        <NavLink to="/managelistings" className="nav-link-mobile">Manage Listings</NavLink>
        <NavLink to="/managewishlists" className="nav-link-mobile">Manage Wishlists</NavLink>
        <NavLink to="/" className="nav-link-mobile">Messages</NavLink>
        <NavLink to="/" className="nav-link-mobile">Profile</NavLink>
        </div>
        <ChalkTray className="c1" />
      </div>
    </div>
  );
};

export default MobileNavbar;
