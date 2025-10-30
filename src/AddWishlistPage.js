import "./AddWishlistPage.css";
import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import React, { useState } from "react";
import MobileNavbar from "./Components/MobileNavbar";
import ChalkTray from "./Components/ChalkTray";   // ✅ added

const AddWishlistPage = () => {
  const [wishlistName, setWishlistName] = useState('');
  const [wishlistUrl, setWishlistUrl] = useState('');

  const greeting = "Add a Wishlist!";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Future Firebase handling
    console.log("Wishlist Name:", wishlistName);
    console.log("Wishlist URL:", wishlistUrl);

    // Clear fields after submission
    setWishlistName('');
    setWishlistUrl('');
  };

  return (
    <div className="add-wishlist-page">
      <NavLeft />
      <TopBar message={greeting} />
      <MobileNavbar />

      <div className="main-wishlist-container">
        <div className="Header-Container-add-WL">
          <h2>Add Wishlist</h2>
        </div>

        <div className="Add-Wishlist-List-Container">
          <div className="Add-WL-Box">
            <form onSubmit={handleSubmit} className="wishlist-form">
              <div className="form-group">
                <label htmlFor="wishlistName">Wishlist Name:  </label>
                <input
                  type="text"
                  id="wishlistName"
                  value={wishlistName}
                  onChange={(e) => setWishlistName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="wishlistUrl">Wishlist URL:  </label>
                <input
                  type="url"
                  id="wishlistUrl"
                  value={wishlistUrl}
                  onChange={(e) => setWishlistUrl(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="add-wishlist-btn">
                Add Wishlist
              </button>
            </form>
          </div>
        </div>
      </div>

      <ChalkTray />  {}
    </div>
  );
};

export default AddWishlistPage;
