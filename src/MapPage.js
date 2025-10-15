import 'leaflet/dist/leaflet.css';
import './MapPage.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ChalkTray from './Components/ChalkTray';
import NavLeft from './Components/NavLeft.js';
import TopBar from './Components/TopBar.js';
import MainContent from './Components/MainContent.js';

function MapPage() {
  return (
    <div>
      <NavLeft />
      <TopBar />
      <div className="mainContent">
        <div className="map-wrapper">
            <MapContainer 
            key="unique-map" 
            center={[51.505, -0.09]} 
            zoom={13} 
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />                    
            <Marker position={[51.505, -0.09]}>
                <Popup>
                A test popup. <br /> Customizable.
                </Popup>
            </Marker>
            </MapContainer>
            <div className="map-filter-bar">
            <h3>Filters</h3>
            </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
