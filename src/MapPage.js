import "leaflet/dist/leaflet.css";
import "./MapPage.css";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import MobileNavbar from "./Components/MobileNavbar.js";
import NavLeft from "./Components/NavLeft.js";
import TopBar from "./Components/TopBar.js";
import MobileFilters from "./Components/Filters.js";
import { useState, useEffect } from "react";
import { db, auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc, getDocs, updateDoc, increment } from "firebase/firestore";
import ListingMarker from "./Components/ListingMarker";
import MarkerIcon from "./images/MarkerIcon.png";
import Swal from "sweetalert2";


function MapPage() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [messageForSeller, setMessageForSeller] = useState("");
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState("");


  const handleMessageSeller = (uid) => {
    console.log("Preparing to message seller with UID:", uid);
    setSelectedSeller(uid);      // save the seller’s UID
    setShowMessagePopup(true);   // show the popup
  };

  const handleMessageSellerChange = (e) => {
    setMessageForSeller(e.target.value);
  }

  const handleMessageSellerSend = async () => {
  if (!messageForSeller.trim()) {
    alert("Message cannot be empty.");
    return;
  }

  const senderUID = user;
  const receiverUID = selectedSeller;

  let chatID1 = `${senderUID}_${receiverUID}`;
  let chatID2 = `${receiverUID}_${senderUID}`;

  let docRef1 = doc(db, "messages", chatID1);
  let docRef2 = doc(db, "messages", chatID2);

  const docSnap1 = await getDoc(docRef1);
  const docSnap2 = await getDoc(docRef2);

  // If chat exists in either direction use that chatID
  let chatID = chatID1;
  if (docSnap1.exists()) chatID = chatID1;
  else if (docSnap2.exists()) chatID = chatID2;

  console.log("Determined chatID:", chatID);

  // Prevent duplicate chat creation
  if (docSnap1.exists() || docSnap2.exists()) {
    alert("You have already messaged this seller.");
    return;
  }

  console.log("Sending message from", senderUID, "to", receiverUID, ":", messageForSeller);

  // --- Create main messages document ---
  const chatRef = doc(db, "messages", chatID);
  await setDoc(chatRef, {
    users: [senderUID, receiverUID],
    createdAt: new Date()
  });

  // --- Add first message ---
  await addDoc(collection(chatRef, "messages"), {
    text: messageForSeller,
    sender: senderUID,
    timestamp: new Date(),
  });

  // --- CREATE USER CHAT REFERENCES ---
  await setDoc(doc(db, "users", senderUID, "chats", chatID), {
    otherUser: receiverUID,
    chatID: chatID,
    lastMessage: messageForSeller,
    timestamp: new Date()
  });

  await setDoc(doc(db, "users", receiverUID, "chats", chatID), {
    otherUser: senderUID,
    chatID: chatID,
    lastMessage: messageForSeller,
    timestamp: new Date()
  });

  // --- UI cleanup ---
  Swal.fire({
    title: "Message Sent!",
    text: "Your message has been delivered.",
    icon: "success",
    showConfirmButton: false,
    timer: 1500,
  }).then(() => {
    setMessageForSeller("");
    setShowMessagePopup(false);
  });
};

  const handleMessageSellerClose = () => {
    setShowMessagePopup(false);  // hide it
    setSelectedSeller(null);     // optional: clear the selected seller
  };

  useEffect(() => {
    console.log(messageForSeller)
  }, [messageForSeller]);

  useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user.uid);
          console.log("Logged in user:", user.uid);
        } else {
          setUser(null);
          console.log("No user logged in");
        }
        });

      return () => unsubscribe(); // cleanup listener
      }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "listings"));
        const listingsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListings(listingsData);
        console.log("Listings:", listingsData);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();


  }, [user]);

  const incrementListingViews = async (listingId) => {
    console.log("Incrementing views for listing:", listingId);
    try {
      const listingRef = doc(db, "listings", listingId);
      await updateDoc(listingRef, {
        views: increment(1)
      });
    } catch (error) {
      console.error("Failed to increment views:", error);
    }
  };

  const { BaseLayer, Overlay } = LayersControl;
  const title ="Map View";
  return (
    <div>
      <MobileNavbar />
      <NavLeft />
      <TopBar message={title}/>
      <MobileFilters />
      <div className="mainContent">
        <div className="map-wrapper">
          <MapContainer
            key="unique-map"
            center={[32.7767, -96.7970]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <LayersControl position="topright">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
                  attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Source: National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
                />
            </LayersControl>
             {listings.map((listing) => (
  listing.lat && listing.lng && (
    <Marker
      key={listing.id}
      position={[listing.lat, listing.lng]}   
      icon={ListingMarker({ listing }).props.icon}
    >
      <Popup className="popup"  eventHandlers={{
    add: () => {
      incrementListingViews(listing.id);
    }
    }}  >

        <div className = "popup-title">
        <strong>{listing.title}</strong><br />
        </div>

        <div className="main-content-popup">
          <div>
            <p className="listing-price-popup">${listing.price}<br /></p>
            
          </div>
          {listing.images && listing.images.length > 0 && (
            <img
              src={listing.images[0]}
              alt={listing.title}
              style={{ width: "200px", borderRadius: "5px", marginTop: "5px", border: "2px solid black" }}
            />
          )}
        </div>
        <p className="listing-description-popup">{listing.description}<br /></p>
        <button className="message-seller-button" onClick={() => handleMessageSeller(listing.posterUID)}>Message Seller</button>
      </Popup>
    </Marker>
  )
))}

  </MapContainer>
          
        </div>
      </div>
      {showMessagePopup && (
        <div id="messageSellerPopup" className="message-popup-overlay">
          <div className="message-popup-content">
            <div className="EraserTail"></div>
            <div className="message-popup-header">
              <p>Message Seller</p>
              <button className="close-btn" onClick={handleMessageSellerClose}>X</button>
            </div>
            <div className="message-popup-body">
            <textarea onChange={handleMessageSellerChange} placeholder="Type your message..." />
            <button onClick={handleMessageSellerSend}>Send</button>
            </div>
          </div>
          
        </div>
        )}
    </div>
  );
}

export default MapPage;

