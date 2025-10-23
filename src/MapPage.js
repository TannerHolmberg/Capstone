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
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
                  attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Source: National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
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

