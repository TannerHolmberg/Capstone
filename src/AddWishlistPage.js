import "./AddWishlistPage.css";
import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';
import { NavLink } from "react-router-dom";

function AddWishlistPage() {
    return (
        <div>
            <NavLeft />
            <TopBar />
        </div>
    );
}

export default AddWishlistPage;