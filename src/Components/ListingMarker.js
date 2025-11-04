import React from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import "./ListingMarker.css";

function renderToHTML(listing) {
  return `
    <div class="listing-marker">
      <div class="price-tag">$${listing.price}</div>
    </div>
  `;
}

const ListingMarker = ({ listing }) => {
  const icon = new L.DivIcon({
    html: renderToHTML(listing),
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15], 
  });

  return (
    <Marker
      position={[listing.lat, listing.lng]}
      icon={icon}
    >
      <Popup className="popup">
        <div className="popup-content">
            <div className="popup-title">
                <strong>{listing.title}</strong><br />
            </div>
            <div>
                <p>{listing.price}<br /></p>
            </div>
            <div>
                {listing.description}<br />
            </div>
            <div>
                <em>{listing.location?.city}, {listing.location?.state}</em>
            </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default ListingMarker;
