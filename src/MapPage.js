import "leaflet/dist/leaflet.css";
import "./MapPage.css";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, Circle, useMap } from "react-leaflet";

import MobileNavbar from "./Components/MobileNavbar.js";
import NavLeft from "./Components/NavLeft.js";
import TopBar from "./Components/TopBar.js";
import MobileFilters from "./Components/Filters.js";

import { db, auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";

import ListingMarker from "./Components/ListingMarker";
import Swal from "sweetalert2";



function RecenterMap({ userLoc }) {
  const map = useMap();

  useEffect(() => {
    if (!userLoc) return;
    map.setView([userLoc.lat, userLoc.lng], map.getZoom(), { animate: true });
  }, [userLoc, map]);

  return null;
}

function MapPage() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [messageForSeller, setMessageForSeller] = useState("");
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState("");

  const [filters, setFilters] = useState({
    distanceMiles: 10,
    priceMin: 0,
    priceMax: 500,
    category: "All",
  });

  

  const [userLoc, setUserLoc] = useState(null); // { lat, lng }
  const [locError, setLocError] = useState("");
  // miles between two lat/lng points
function haversineMiles(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

const filteredListings =
  userLoc
    ? listings.filter((listing) => {
        if (!listing.lat || !listing.lng) return false;

        // distance filter
        const dist = haversineMiles(
          userLoc.lat,
          userLoc.lng,
          Number(listing.lat),
          Number(listing.lng)
        );
        if (dist > filters.distanceMiles) return false;

        // price filter
        const price = Number(listing.price);
        if (Number.isNaN(price)) return false; // or true, depending on what you want
        if (price < filters.priceMin) return false;
        if (price > filters.priceMax) return false;

        return true;
      })
    : [];
  const DIST_MIN = 1;
  const DIST_MAX = 100;

  const PRICE_MIN_LIMIT = 0;
  const PRICE_MAX_LIMIT = 5000;

  const handleGetLocation = () => {
    setLocError("");

    if (!("geolocation" in navigator)) {
      setLocError("Geolocation not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLoc({ lat: latitude, lng: longitude });
      },
      (err) => {
        setLocError(err.message || "Could not get location.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleMessageSeller = (uid) => {
    console.log("Preparing to message seller with UID:", uid);
    setSelectedSeller(uid);
    setShowMessagePopup(true);
  };

  const handleMessageSellerChange = (e) => {
    setMessageForSeller(e.target.value);
  };

  const handleMessageSellerClose = () => {
    setShowMessagePopup(false);
    setSelectedSeller(null);
  };

  const handleMessageSellerSend = async () => {
    if (!messageForSeller.trim()) {
      alert("Message cannot be empty.");
      return;
    }

    const senderUID = user;
    const receiverUID = selectedSeller;

    if (!senderUID || !receiverUID) {
      alert("Missing sender or receiver.");
      return;
    }

    const chatID1 = `${senderUID}_${receiverUID}`;
    const chatID2 = `${receiverUID}_${senderUID}`;

    const docRef1 = doc(db, "messages", chatID1);
    const docRef2 = doc(db, "messages", chatID2);

    const docSnap1 = await getDoc(docRef1);
    const docSnap2 = await getDoc(docRef2);

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

    const chatRef = doc(db, "messages", chatID);

    // main messages doc
    await setDoc(chatRef, {
      users: [senderUID, receiverUID],
      createdAt: new Date(),
    });

    // first message
    await addDoc(collection(chatRef, "messages"), {
      text: messageForSeller,
      sender: senderUID,
      timestamp: new Date(),
    });

    // user chat references
    await setDoc(doc(db, "users", senderUID, "chats", chatID), {
      otherUser: receiverUID,
      chatID,
      lastMessage: messageForSeller,
      timestamp: new Date(),
    });

    await setDoc(doc(db, "users", receiverUID, "chats", chatID), {
      otherUser: senderUID,
      chatID,
      lastMessage: messageForSeller,
      timestamp: new Date(),
    });

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

  // auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u.uid);
        console.log("Logged in user:", u.uid);
      } else {
        setUser(null);
        console.log("No user logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  // fetch listings ONLY after location is granted (gated behavior)
  const fetchListings = async () => {
    if (!userLoc) return;

    try {
      const querySnapshot = await getDocs(collection(db, "listings"));
      const listingsData = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setListings(listingsData);
      console.log("Listings:", listingsData);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  useEffect(() => {
    if (!userLoc) {
      setListings([]);
      return;
    }
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoc]);

  const incrementListingViews = async (listingId) => {
    console.log("Incrementing views for listing:", listingId);
    try {
      const listingRef = doc(db, "listings", listingId);
      await updateDoc(listingRef, { views: increment(1) });
    } catch (error) {
      console.error("Failed to increment views:", error);
    }
  };

  const { BaseLayer, Overlay } = LayersControl; // kept in case you use later
  const title = "Browse Listings on the Map";

  return (
    <div>
      <MobileNavbar />
      <NavLeft />
      <TopBar message={title} />
      <MobileFilters />

      <div className="mainContent">
        <div className="map-wrapper">
          <div className="map-filters">
            
            {!userLoc && (
              <div className="location-gate">
                <div className="location-gate__card">
                  <h3>Location required</h3>
                  <p>Enable location to view listings and use the map.</p>
                  <button className="map-filters__btn" onClick={handleGetLocation}>
                    Get location
                  </button>
                  {locError && <div className="map-filters__error">{locError}</div>}
                </div>
              </div>
            )}

            {!locError && userLoc && (
              <>
                <div className="map-filters__title">Filters</div>
                <label className="map-filters__row">
                  Distance: <strong>{filters.distanceMiles} mi</strong>
                </label>

                <input
                  type="range"
                  min={DIST_MIN}
                  max={DIST_MAX}
                  step={1}
                  value={filters.distanceMiles}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      distanceMiles: Number(e.target.value),
                    }))
                  }
                />

                <div>
                  Price: <strong>${filters.priceMin}</strong> –{" "}
                  <strong>${filters.priceMax}</strong>
                </div>

                <label>Min</label>
                <input
                  type="range"
                  min={PRICE_MIN_LIMIT}
                  max={PRICE_MAX_LIMIT}
                  step={10}
                  value={filters.priceMin}
                  onChange={(e) => {
                    const newMin = Number(e.target.value);
                    setFilters((f) => ({
                      ...f,
                      priceMin: Math.min(newMin, f.priceMax),
                    }));
                  }}
                />

                <label>Max</label>
                <input
                  type="range"
                  min={PRICE_MIN_LIMIT}
                  max={PRICE_MAX_LIMIT}
                  step={10}
                  value={filters.priceMax}
                  onChange={(e) => {
                    const newMax = Number(e.target.value);
                    setFilters((f) => ({
                      ...f,
                      priceMax: Math.max(newMax, f.priceMin),
                    }));
                  }}
                />
              </>
            )}
          </div>

          <MapContainer
            key="unique-map"
            center={userLoc ? [userLoc.lat, userLoc.lng] : [33.2056143, -97.1527325]}
            zoom={12}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            {userLoc && <RecenterMap userLoc={userLoc} />}

            <LayersControl position="topright">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Source: National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
              />
            </LayersControl>

            {userLoc &&
              filteredListings.map(
                (listing) =>
                  listing.lat &&
                  listing.lng && (
                    <Marker
                      key={listing.id}
                      position={[listing.lat, listing.lng]}
                      icon={ListingMarker({ listing }).props.icon}
                    >
                      <Popup
                        className="popup"
                        eventHandlers={{
                          add: () => incrementListingViews(listing.id),
                        }}
                      >
                        <div className="popup-title">
                          <strong>{listing.title}</strong>
                          <br />
                        </div>

                        <div className="main-content-popup">
                          <div>
                            <p className="listing-price-popup">${listing.price}</p>
                          </div>

                          {listing.images && listing.images.length > 0 && (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              style={{
                                width: "200px",
                                borderRadius: "5px",
                                marginTop: "5px",
                                border: "2px solid black",
                              }}
                            />
                          )}
                        </div>

                        <p className="listing-description-popup">{listing.description}</p>

                        <button
                          className="message-seller-button"
                          onClick={() => handleMessageSeller(listing.posterUID)}
                        >
                          Message Seller
                        </button>
                      </Popup>
                    </Marker>
                  )
              )}

            {userLoc && (
              <Circle
                center={[userLoc.lat, userLoc.lng]}
                radius={filters.distanceMiles * 1609.34}
                pathOptions={{
                  color: "#08530c",
                  weight: 2,
                  fillColor: "#137E49",
                  fillOpacity: 0.15,
                }}
              />
            )}
          </MapContainer>
        </div>
      </div>

      {showMessagePopup && (
        <div id="messageSellerPopup" className="message-popup-overlay">
          <div className="message-popup-content">
            <div className="EraserTail"></div>

            <div className="message-popup-header">
              <p>Message Seller</p>
              <button className="close-btn" onClick={handleMessageSellerClose}>
                X
              </button>
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