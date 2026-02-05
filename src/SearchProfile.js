import React, { useState, useEffect } from "react"; 
import { useParams } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import NavLeft from "./Components/NavLeft";
import TopBar from "./Components/TopBar";
import MobileNavbar from "./Components/MobileNavbar";
import LoadingPage from "./Components/LoadingPage";
//import "./ISDSearchPage.css";
import { db, auth } from "./firebase";
import { NavLink } from "react-router-dom";
import { collection, getDocs, doc, getDoc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./SearchProfile.css";

const SearchProfile = () => {
    const greeting = "Teacher Profile";

    const { teacherId } = useParams();
    console.log("teacherId from params:", teacherId);

    const [listings, setListings] = useState([]);
    const [wishlists, setWishlists] = useState([]);
    const [loading, setLoading] = useState(true); // true when `teachers/teacherID/listings` collection is empty or doesn't exist
    const [noListings, setNoListings] = useState(false);
    const [noWishlists, setNoWishlists] = useState(false);
    const [teacherName, setTeacherName] = useState("Unknown Teacher");
    const [teacherISD, setTeacherISD] = useState("Unknown ISD");
    const [teacherSchool, setTeacherSchool] = useState("Unknown School");
    
        useEffect(() => {
        // Fetch the teacher's listings and wishlists based on the URL parameter
        const fetchTeacherData = async () => {
            setLoading(true);
            try {
                // Fetch teacher document by ID
                const teacherDocRef = doc(db, "teachers", teacherId);
                const teacherSnap = await getDoc(teacherDocRef);

                if (!teacherSnap.exists()) {
                    setListings([]);
                    setWishlists([]);
                    setNoListings(true);
                    setNoWishlists(true);
                    setLoading(false);
                    return;
                }

                setTeacherName(teacherSnap.data().teacherName || "Unknown Teacher");
                setTeacherISD(teacherSnap.data().isdName || "Unknown ISD");
                setTeacherSchool(teacherSnap.data().schoolName || "Unknown School");

                // get references to teacher's listings
                const userListingsCol = collection(db, "users", teacherId, "listings");
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

                // Get teacher's wishlist references
                const userWishlistsCol = collection(db, "users", teacherId, "wishlists");
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
        };

        if (teacherId) {
            fetchTeacherData();
        }

    }, [teacherId]);

    return (
        <div>
            <NavLeft />
            <MobileNavbar />
            <TopBar message={greeting}/>
            <div className="Main-container">
                
                <div className="description-container">
                    <div className="profile-pic-details-container">
                        <div className="profile-picture-img"> 
                            <p>A picture will go here</p>
                        </div>
                        <div className="Teacher-details-container">
                            <h2>Name: {teacherName}</h2>
                            <h3>ISD: {teacherISD}</h3>
                            <h3>School: {teacherSchool}</h3>
                        </div>
                    </div>
                    
                    <div className="user-description">
                        <p>This is where the user description will go.</p>
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
                <div className="Header-container">
                    <h3>Message this teacher</h3>
                </div>
                <div className="messaging-container">
                    <div className="message-textbox">
                        <textarea placeholder="Type your message here..."></textarea>
                    </div>
                    <div className="send-message-button">Send Message</div>
                </div>
            </div>
        </div>
    );
}
 
export default SearchProfile;