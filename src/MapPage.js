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
import { collection, addDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import ListingMarker from "./Components/ListingMarker";
import MarkerIcon from "./images/MarkerIcon.png";

function MapPage() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);

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
      position={[listing.lat, listing.lng]}   // 👈 use your custom PNG here
      icon={ListingMarker({ listing }).props.icon}
    >
      <Popup className="popup">
        <div className = "popup-title">
        <strong>{listing.title}</strong><br />
        </div>
        <p>${listing.price}<br /></p>
        {listing.description}<br />
        <em>{listing.location?.city}, {listing.location?.state}</em><br />
        {listing.images && listing.images.length > 0 && (
          <img
            src={listing.images[0]}
            alt={listing.title}
            style={{ width: "100px", borderRadius: "5px", marginTop: "5px" }}
          />
        )}
      </Popup>
    </Marker>
  )
))}

  </MapContainer>
          
        </div>
      </div>
    </div>
  );
}

export default MapPage;

