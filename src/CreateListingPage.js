import "./CreateListingPage.css";
import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';
import { NavLink } from "react-router-dom";

function CreateListingPage() {
    return (
        <div>
            <NavLeft />
            <TopBar />
        </div>
    );
}

export default CreateListingPage;