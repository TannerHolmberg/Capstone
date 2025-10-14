import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import ChalkTray from './Components/ChalkTray';


// This location is taken from the leaflet docs - subject to change
function MapPage() {
    return(
        <div>
            <div style={{ height: '90vh', width: '100%', position: 'relative', zIndex: 0 }}>
                <MapContainer 
                    key="unique-map" 
                    center={[51.505, -0.09]} 
                    zoom={13} 
                    scrollWheelZoom={false}
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
            </div>
            <ChalkTray />
        </div>
    );
}

export default MapPage;