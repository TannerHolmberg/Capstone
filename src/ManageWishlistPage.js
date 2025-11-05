import "./ManageWishlistPage.css";
import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';
import books from "./images/books.png";
import { NavLink } from "react-router-dom";
import { collection, getDocs, doc, getDoc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase";
import ChalkTray from "./Components/ChalkTray"; 
import MobileNavbar from "./Components/MobileNavbar";
import React, { useState, useEffect } from "react";



function ManageWishlistPage() {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noWishlists, setNoWishlists] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (!user) {
          setWishlists([]);
          setNoWishlists(true);
          setLoading(false);
          return;
        }

        // Get user's wishlist references
        const userWishlistsCol = collection(db, "users", user.uid, "wishlists");
        const userWishlistSnap = await getDocs(userWishlistsCol);
        setNoWishlists(userWishlistSnap.empty);

        // Extract global wishlist IDs
        const wishlistIds = userWishlistSnap.docs
          .map((d) => d.data().wishlistId)
          .filter(Boolean);

        // Fetch actual wishlist data from global collection
        const wishlistPromises = wishlistIds.map(async (id) => {
          const wishlistDoc = await getDoc(doc(db, "wishlists", id));
          if (wishlistDoc.exists())
            return { id: wishlistDoc.id, ...wishlistDoc.data() };
          return null;
        });

        const results = await Promise.all(wishlistPromises);
        const finalWishlists = results.filter(Boolean);
        setWishlists(finalWishlists);
        if (finalWishlists.length > 0) setNoWishlists(false);
      } catch (err) {
        console.error("Error loading wishlists:", err);
        setWishlists([]);
        setNoWishlists(true);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Delete wishlist (both global + user reference)
  const handleDelete = async (wishlistId) => {
    if (!wishlistId) return;
    const confirm = window.confirm("Are you sure you want to delete this wishlist?");
    if (!confirm) return;

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("You must be signed in to delete a wishlist.");
      return;
    }

    setWishlists((prev) => prev.filter((w) => w.id !== wishlistId));
    setDeletingIds((prev) => [...prev, wishlistId]);

    try {
      // delete from global collection
      await deleteDoc(doc(db, "wishlists", wishlistId));

      // delete from user subcollection
      const userWishlistsCol = collection(db, "users", user.uid, "wishlists");
      const q = query(userWishlistsCol, where("wishlistId", "==", wishlistId));
      const snap = await getDocs(q);
      const deletePromises = snap.docs.map((d) =>
        deleteDoc(doc(db, "users", user.uid, "wishlists", d.id))
      );
      await Promise.all(deletePromises);
    } catch (err) {
      console.error("Error deleting wishlist:", err);
      alert("Failed to delete wishlist. Reloading list...");

      // reload wishlists
      try {
        setLoading(true);
        const userWishlistsCol = collection(db, "users", user.uid, "wishlists");
        const snap = await getDocs(userWishlistsCol);
        const wishlistIds = snap.docs.map((d) => d.data().wishlistId);
        const promises = wishlistIds.map(async (id) => {
          const docRef = await getDoc(doc(db, "wishlists", id));
          return docRef.exists() ? { id: docRef.id, ...docRef.data() } : null;
        });
        const results = await Promise.all(promises);
        setWishlists(results.filter(Boolean));
      } catch (reloadErr) {
        console.error("Error reloading wishlists:", reloadErr);
      } finally {
        setLoading(false);
      }
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== wishlistId));
    }
  };

  return (
    <div>
      <NavLeft />
      <TopBar />
      <div className="Main-container-wishlist">
        <div className="Header-container-wishlist">
          <h1>Your Wishlists</h1>
          <img className="wishlist-pic" src={books} alt="Classroom Connect Logo" />
        </div>

        <div className="list-container-wishlist">
          <div className="List-box-wishlist">
            {loading ? (
              <div className="loading-text">Loading wishlists...</div>
            ) : noWishlists ? (
              <div className="no-wishlist-text">No wishlists found</div>
            ) : (
              wishlists.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <p>{item.name || "Untitled Wishlist"}</p>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingIds.includes(item.id)}
                    className="delete-button"
                  >
                    {deletingIds.includes(item.id)
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              ))
            )}
          </div>
          <NavLink to="/addwishlist" className="add-wishlist-button">
            Add
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default ManageWishlistPage;