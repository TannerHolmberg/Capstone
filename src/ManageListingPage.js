import "./ManageListingPage.css";
import ChalkTray from './Components/ChalkTray';
import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';

function ManageListingPage() {
    return (
        <div>
            <NavLeft />
            <TopBar />
            <div className="Main-container">
                <div className="Header-container">
                    <h1>Manage Listings</h1>
                </div>
                <div className="List-box"></div>
            </div>"
        </div>
    );
}

export default ManageListingPage;