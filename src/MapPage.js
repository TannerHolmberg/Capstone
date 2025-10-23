import "leaflet/dist/leaflet.css";
import "./MapPage.css";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import MobileNavbar from "./Components/MobileNavbar.js";
import NavLeft from "./Components/NavLeft.js";
import TopBar from "./Components/TopBar.js";
import MobileFilters from "./Components/Filters.js";

function MapPage() {
  const { BaseLayer, Overlay } = LayersControl;

  return (
    <div>
      <MobileNavbar />
      <NavLeft />
      <TopBar />
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
              {/* --- Base Layers --- */}
              <BaseLayer checked name="Stamen Watercolor">
                <TileLayer
                  url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}"
                  minZoom={0}
                  maxZoom={18}
                  ext="png"
                  attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </BaseLayer>
            </LayersControl>

            <Marker position={[32.7767, -96.7970]}>
              <Popup>
                <b>Dallas, TX</b> <br /> Customizable popup.
              </Popup>
            </Marker>
          </MapContainer>
          
        </div>
      </div>
    </div>
  );
}

export default MapPage;

