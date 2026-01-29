import "./ProfilePage.css";
import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';
import { useParams } from "react-router-dom";
import { db, auth } from "./firebase";
import { NavLink } from "react-router-dom";
import { collection, getDocs, doc, getDoc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MobileNavbar from "./Components/MobileNavbar";
import React, { useState, useEffect } from "react";

function ProfilePage() {
    const { userID } = useParams();

    const [listings, setListings] = useState([]);
    const [wishlists, setWishlists] = useState([]);
    const [loading, setLoading] = useState(true); // true when the user's `users/{uid}/listings` collection is empty or doesn't exist
    const [noListings, setNoListings] = useState(false);
    const [noWishlists, setNoWishlists] = useState(false);
    
        useEffect(() => {
        // subscribe to auth state so we can fetch when user is available
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);
            try {
                if (!user) {
                    setListings([]);
                    setWishlists([]);
                    setNoListings(false);
                    setNoWishlists(false);
                    setLoading(false);
                    return;
                }

                // get references to user's listings. Stored under users/{uid}/listings
                const userListingsCol = collection(db, "users", user.uid, "listings");
                const userListingsSnap = await getDocs(userListingsCol);
                // mark whether the user's listings collection is empty or doesn't exist
                setNoListings(userListingsSnap.empty);
                const listingIds = userListingsSnap.docs
                    .map((d) => d.data().listingId)
                    .filter(Boolean);

                // fetch listing documents
                const listingPromises = listingIds.map(async (id) => {
                    const listingDoc = await getDoc(doc(db, "listings", id));
                    if (listingDoc.exists()) return { id: listingDoc.id, ...listingDoc.data() };
                    return null;
                });

                const results = await Promise.all(listingPromises);
                const finalListings = results.filter(Boolean);
                setListings(finalListings);
                if (finalListings.length > 0) setNoListings(false);

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

                const wishlistResults = await Promise.all(wishlistPromises);
                const finalWishlists = wishlistResults.filter(Boolean);
                setWishlists(finalWishlists);
                if (finalWishlists.length > 0) setNoWishlists(false);
            } 
            catch (err) {
                console.error("Error loading listings and wishlists:", err);
                setListings([]);
                setWishlists([]);
                setNoListings(false);
                setNoWishlists(false);
            } 
            finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <NavLeft />
            <TopBar message="Profile"/>
            <div className="Main-container">
                
                <div className="description-container">
                    <div className="profile-picture-img"> 
                        <p>A picture will go here</p>
                    </div>
                    <div className="user-description">
                        <p>This is where the user description will go.</p>
                    </div>
                </div>

                <div className="Header-container">
                    <h1>Your listings</h1>
                </div>
                <div className="list-container">
                    <div className="List-box">
                        {loading ? (
                            <div className="listing-item">Loading listings...</div>
                        ) : noListings ? (
                            <div className="listing-item">No listings</div>
                        ) : listings.length === 0 ? (
                            <div className="listing-item">No listings yet.</div>
                        ) : (
                            listings.map((l) => (
                                <div className="listing-item" key={l.id}>
                                    <div className="listing-row">
                                        {l.images && l.images[0] ? (
                                            <img className="listing-thumb" src={l.images[0]} alt={l.title} />
                                        ) : null}
                                        <div className="listing-info">
                                            <div className="listing-title">{l.title || 'Untitled'}</div>
                                            <div className="listing-meta">{l.location?.city || ''}{l.location?.state ? `, ${l.location?.state}` : ''}</div>
                                            <div className="listing-price">${typeof l.price === 'number' ? l.price.toFixed(2) : l.price}</div>
                                        </div>
                                    </div>
                                    {l.description ? <div className="listing-desc">{l.description}</div> : null}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="Header-container">
                    <h1>Your wishlists</h1>
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
                                    <a>{item.name || "Untitled Wishlist"}</a>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;