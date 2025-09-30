import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import microwaves from './microwaves.json'   // import JSON data

export default function MapView() {
    return (
        <MapContainer
            center={[49.2781, -122.9197]}  // SFU Burnaby
            zoom={16}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {microwaves.map((m, i) => (
                <Marker key={i} position={[m.lat, m.lng]}>
                    <Popup>
                        <b>{m.building}</b><br />
                        {m.location}<br />
                        {m.hours}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
