import "./MobileNavbar.css";
import { useRef, useEffect } from "react";

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
      <div className="mobile-navbar-content" ref={contentRef}></div>
    </div>
  );
};

export default MobileNavbar;
