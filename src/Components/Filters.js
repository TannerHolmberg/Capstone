import "./Filters.css";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useState } from "react";

const MobileFilters = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleFilters = () => {
        setIsOpen(!isOpen);
    };

    return ( 
        <div className={`mobile-filters ${isOpen ? "open" : ""}`}>
            <div className="filters-header" onClick={toggleFilters}>
                <ArrowUpwardIcon className={`arrow-icon ${isOpen ? "rotated" : ""}`}/>
                <p>Filters</p>
                <ArrowUpwardIcon className={`arrow-icon ${isOpen ? "rotated" : ""}`}/>
            </div>
        </div>
     );
}
 
export default MobileFilters;