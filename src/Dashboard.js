import NavLeft from "./Components/NavLeft";
import TopBar from "./Components/TopBar";
import MobileNavbar from "./Components/MobileNavbar";
import LoadingPage from "./Components/LoadingPage";
import { use, useEffect } from "react";
import { doc, getDoc, getDocs, collection, count, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import List from "./images/list.png"
import Wishlist from "./images/wishlist.png"
import { useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import "./Dashboard.css";
const Dashboard = () => {
    const Navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [unReadMessagesCount, setUnReadMessagesCount] = useState(0);
    const [listingsCount, setListingsCount] = useState(0);
    const [wishlistsCount, setWishlistsCount] = useState(0);
    const [totalListingViews, setTotalListingViews] = useState(0);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                console.log("Dashboard visible again — refreshing");
                refreshDashboard();
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);

        return () =>
            document.removeEventListener("visibilitychange", handleVisibility);
    }, [user]);

    useEffect(() => {
        console.log(conversations);
        
    }, [conversations]);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log("Auth state changed:", firebaseUser);
            setUser(firebaseUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchAllData = async () => {
            setLoading(true); // start loading

            await refreshDashboard();
            await countListings();
            await countWishlists();
            await countTotalListingViews();

            setLoading(false); // stop loading
        };

        fetchAllData();

        const interval = setInterval(refreshDashboard, 30000);
        return () => clearInterval(interval);
    }, [user]);

        const countUnreadMessages = async (chat) => {
            const lastSeenField = `${user.uid}_lastSeenAt`;
            const messagesRef = doc(db, "messages", chat);
            const chatSnap = await getDoc(messagesRef);
            const chatData = chatSnap.data();
            let lastSeenAt = chatData?.[lastSeenField];
            lastSeenAt = lastSeenAt ? lastSeenAt.toMillis() : 0; // default to epoch if never seen
            console.log("Last seen at:", lastSeenAt);
            
            const messagesCollection = collection(db, "messages", chat, "messages");
            const messagesSnapshot = await getDocs(messagesCollection);
            let count = 0;
            messagesSnapshot.forEach((messageDoc) => {
                const messageData = messageDoc.data();
                const messageTimestamp = messageData.timestamp?.toMillis() || 0;
                if (messageTimestamp > lastSeenAt || messageTimestamp === 0) {
                    count++;
                }
            });
            return count;
        };

        const countListings = async () => {
            if (!user) return;
            const listingsRef = collection(db, "users", user.uid, "listings");
            const snapshot = await getDocs(listingsRef);
            setListingsCount(snapshot.size);
        }

        const countWishlists = async () => {
            if (!user) return;
            const wishlistsRef = collection(db, "wishlists");
            const q = query(wishlistsRef, where("userId", "==", user.uid));
            const snapshot = await getDocs(q);
            setWishlistsCount(snapshot.size);
        }

        const countTotalListingViews = async () => {
            if (!user) return;
            console.log("Counting total listing views for user:", user.uid);
            const listingsRef = collection(db, "listings");
            const q = query(listingsRef, where("posterUID", "==", user.uid));
            const snapshot = await getDocs(q);
            let totalViews = 0;
            snapshot.forEach((doc) => {
                console.log("Listing doc:", doc.id, doc.data());
                const listingData = doc.data();
                totalViews += listingData.views || 0;
            });
            setTotalListingViews(totalViews);
        }

      const refreshDashboard = async () => {
    if (!user) return;

    const conversationsRef = collection(db, "users", user.uid, "chats");
    const snapshot = await getDocs(conversationsRef);

    const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    setConversations(chats);

    let sum = 0;

    for (let i = 0; i < chats.length; i++) {
        const currentCount = await countUnreadMessages(chats[i].id);
        sum += currentCount;
    }

    setUnReadMessagesCount(sum);
    };

    if (loading) {
        return <LoadingPage />;
    }

    return ( <div>
        <NavLeft />
        <MobileNavbar />
        <TopBar message="Dashboard"/>
        <div className="dashboard-content">
            <div className="dashboard-postit-section">
                <div id="postit1" className="postit-dashboard">
                    <div className="tape"></div>
                    <p className="postitNumber">{unReadMessagesCount}</p>
                    <h3 className="postitDesc">Unread Messages</h3>
                </div>
                <div id="postit2" className="postit-dashboard">
                    <div className="tape"></div>
                    <p className="postitNumber">{listingsCount}</p>
                    <h3 className="postitDesc">{listingsCount === 1 ? "Listing" : "Listings"}</h3>
                </div>
                <div id="postit3" className="postit-dashboard">
                    <div className="tape"></div>
                    <p className="postitNumber">{wishlistsCount}</p>
                    <h3 className="postitDesc">{wishlistsCount === 1 ? "Wishlist" : "Wishlists"}</h3>
                </div>
                <div id="postit4" className="postit-dashboard">
                    <div className="tape"></div>
                    <p className="postitNumber">{totalListingViews}</p>
                    <h3 className="postitDesc">Total Listing Views</h3>
                </div>
            </div>
            <div className="dashboard-recent-listings-section">
                <div className="section-describer">
                    <img src={List} alt="Recent Listings"/>
                    <h2>Recent Listings</h2>
                </div>
                <div className="recentListingsBox"></div>
            </div>
            <div className="dashboard-recent-wishlists-section">
                <div className="recentListingsBox"></div>
                <div className="section-describer">
                    <img src={Wishlist} alt="Recent Wishlists"/>
                    <h2>Recent Wishlists</h2>
                </div>
            </div>
        </div>
    </div> );
}
 
export default Dashboard;