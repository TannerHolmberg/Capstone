import "./AddWishlistPage.css";
import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';
import { db } from "./firebase";
import { collection, addDoc, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import MobileNavbar from "./Components/MobileNavbar";
import ChalkTray from "./Components/ChalkTray"; 
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddWishlistPage = () => {
  const [wishlistName, setWishlistName] = useState('');
  const [wishlistUrl, setWishlistUrl] = useState('');
  const navigate = useNavigate();

  const greeting = "Add a Wishlist!";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Swal.fire({
          title: "Not signed in",
          text: "You must be logged in to create a wishlist.",
          icon: "warning",
        });
        return;
      }

      // Step 1: Create global wishlist entry
      const wishlistData = {
        name: wishlistName,
        url: wishlistUrl,
        createdAt: new Date(),
        userId: user.uid,
      };

      const wishlistRef = await addDoc(collection(db, "wishlists"), wishlistData);

      // Step 2: Create user-specific reference under /users/{uid}/wishlists
      await setDoc(doc(db, "users", user.uid, "wishlists", wishlistRef.id), {
        wishlistId: wishlistRef.id,
        createdAt: new Date(),
      });

      // Step 3: Success message + redirect
      Swal.fire({
        title: "Wishlist Created!",
        text: "Your wishlist has been successfully added.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/managewishlists");
      });

      // Step 4: Reset form fields
      setWishlistName('');
      setWishlistUrl('');
    } catch (error) {
      console.error("Error creating wishlist:", error);
      Swal.fire({
        title: "Error",
        text: "There was an issue adding your wishlist. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <div>
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
                <label htmlFor="wishlistName">Wishlist Name:</label>
                <input
                  type="text"
                  id="wishlistName"
                  value={wishlistName}
                  onChange={(e) => setWishlistName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="wishlistUrl">Wishlist URL:</label>
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
      
    </div>
    <ChalkTray />
    </div>
  );
};

export default AddWishlistPage;
