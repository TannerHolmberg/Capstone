import "./ManageWishlistPage.css";
import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';
import books from "./images/books.png";
import { NavLink } from "react-router-dom";

function ManageWishlistPage() {
    return (
        <div>
            <NavLeft />
            <TopBar />
            <div className="Main-container">
                <div className="Header-container">
                    <h1>Your Wishlists</h1>
                    <img className="wishlist-pic" src={books} alt="Classroom Connect Logo" />
                </div>
                <div className="list-container">
                    <div className="List-box">
                        {/* Placeholder items to demonstrate scrolling. Replace with real listing components later. */}
                        <div className="listing-item">Listing 1</div>
                        <div className="listing-item">Listing 2</div>
                        <div className="listing-item">Listing 3</div>
                        <div className="listing-item">Listing 4</div>
                        <div className="listing-item">Listing 5</div>
                        <div className="listing-item">Listing 6</div>
                        <div className="listing-item">Listing 7</div>
                        <div className="listing-item">Listing 8</div>
                        <div className="listing-item">Listing 9</div>
                        <div className="listing-item">Listing 10</div>
                    </div>
                    <NavLink to='/addwishlist' className="add-wishlist-button">Add</NavLink>
                </div>
            </div>
        </div>
    );
}

export default ManageWishlistPage;