import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';
import { useParams } from "react-router-dom";
import { db, auth } from "./firebase";
import { NavLink } from "react-router-dom";
import { collection, getDocs, doc, getDoc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ChalkTray from "./Components/ChalkTray"; 
import MobileNavbar from "./Components/MobileNavbar";
import React, { useState, useEffect } from "react";

function ProfilePage() {
    const { userID } = useParams();

    const [listings, setListings] = useState([]);
        const [loading, setLoading] = useState(true);
        // true when the user's `users/{uid}/listings` collection is empty or doesn't exist
        const [noListings, setNoListings] = useState(false);
    
        useEffect(() => {
            // subscribe to auth state so we can fetch when user is available
            const auth = getAuth();
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                setLoading(true);
                try {
                    if (!user) {
                        setListings([]);
                        setNoListings(false);
                        setLoading(false);
                        return;
                    }
    
                    // get references to user's listings (stored under users/{uid}/listings)
                    const userListingsCol = collection(db, "users", user.uid, "listings");
                    const userListingsSnap = await getDocs(userListingsCol);
                    // mark whether the user's listings collection is empty (or doesn't exist)
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
                } 
                catch (err) {
                    console.error("Error loading listings:", err);
                    setListings([]);
                    setNoListings(false);
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
                
                <div className="Header-container">
                    <h1>Listings</h1>
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
            </div>
        </div>
    );
}

export default ProfilePage;