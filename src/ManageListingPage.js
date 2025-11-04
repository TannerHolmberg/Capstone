import "./ManageListingPage.css";
import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';
import books from "./images/books.png";
import MobileNavbar from "./Components/MobileNavbar.js";
import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase.js";
import { collection, getDocs, doc, getDoc, deleteDoc, query, where } from "firebase/firestore";

function ManageListingPage() {
    const greeting = "Manage your listings here!";
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

    const [deletingIds, setDeletingIds] = useState([]);

    const handleDelete = async (listingId) => {
        if (!listingId) return;
        const confirm = window.confirm("Are you sure you want to delete this listing? This action cannot be undone.");
        if (!confirm) return;

        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            alert("You must be signed in to delete a listing.");
            return;
        }

        setListings((prev) => prev.filter((l) => l.id !== listingId));
        setDeletingIds((prev) => [...prev, listingId]);

        try {
            // delete the listing document from 'listings' collection
            await deleteDoc(doc(db, "listings", listingId));

            // delete any user references to this listing in users/{uid}/listings
            const userListingsCol = collection(db, "users", user.uid, "listings");
            const q = query(userListingsCol, where("listingId", "==", listingId));
            const snap = await getDocs(q);
            const deletePromises = snap.docs.map((d) => deleteDoc(doc(db, "users", user.uid, "listings", d.id)));
            await Promise.all(deletePromises);

        } catch (err) {
            console.error("Error deleting listing:", err);
            alert("Failed to delete listing. Please try again.");
            // revert optimistic removal on failure by refetching listings
            try {
                // reload user's listings
                setLoading(true);
                const userListingsCol = collection(db, "users", user.uid, "listings");
                const userListingsSnap = await getDocs(userListingsCol);
                    setNoListings(userListingsSnap.empty);
                const listingIds = userListingsSnap.docs
                    .map((d) => d.data().listingId)
                    .filter(Boolean);

                const listingPromises = listingIds.map(async (id) => {
                    const listingDoc = await getDoc(doc(db, "listings", id));
                    if (listingDoc.exists()) return { id: listingDoc.id, ...listingDoc.data() };
                    return null;
                });

                const results = await Promise.all(listingPromises);
                setListings(results.filter(Boolean));
            } catch (reloadErr) {
                console.error("Error reloading listings after delete failure:", reloadErr);
                setListings([]);
                    setNoListings(false);
            } finally {
                setLoading(false);
            }
        } finally {
            setDeletingIds((prev) => prev.filter((id) => id !== listingId));
        }
    };

    return (
        <div className="ManageListingPage">
            <NavLeft />
            <TopBar message={greeting}/>
            <MobileNavbar />
            <div className="Main-container">
                <div className="Header-container">
                    <h1>Your Listings</h1>
                    <img className="listing-pic" src={books} alt="Classroom Connect Logo" />
                </div>
                <div className="list-container">
                    <div className="List-box">
                        {loading ? (
                            <div className="listing-item">Loading your listings...</div>
                        ) : noListings ? (
                            <div className="listing-item">No listings</div>
                        ) : listings.length === 0 ? (
                            <div className="listing-item">You have no listings yet.</div>
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
                                        <div className="listing-actions">
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(l.id)}
                                                disabled={deletingIds.includes(l.id)}
                                                title="Delete listing"
                                            >
                                                {deletingIds.includes(l.id) ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                    {l.description ? <div className="listing-desc">{l.description}</div> : null}
                                </div>
                            ))
                        )}
                    </div>
                    <NavLink to='/createlisting' className="add-listing-button">Add</NavLink>
                </div>
            </div>
        </div>
    );
}

export default ManageListingPage;