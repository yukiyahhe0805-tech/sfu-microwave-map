import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { useState, useEffect } from 'react'
import microwaves from './microwaves.json'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'   // ✅ styles live in App.css

// Custom microwave icon (make sure microwave.png is in /public)
const microwaveIcon = new L.Icon({
    iconUrl: '/microwave.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
})

// Pulsing dot icon for user location
const userIcon = L.divIcon({
    className: "leaflet-pulsing-dot",
    iconSize: [18, 18]
})

export default function MapView() {
    const [position, setPosition] = useState(null)
    const [accuracy, setAccuracy] = useState(null)

    // Track user location
    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude])
                    setAccuracy(pos.coords.accuracy)
                },
                (err) => console.error(err),
                { enableHighAccuracy: true }
            )
            return () => navigator.geolocation.clearWatch(watchId)
        }
    }, [])

    return (
        <div style={{ position: "relative", height: "100vh", width: "100%" }}>

            {/* App Header */}
            <div className="map-header">
                SFU Microwave Map
            </div>

            <MapContainer
                center={[49.2781, -122.9197]} // fallback center: SFU Burnaby
                zoom={16}
                style={{ height: "100%", width: "100%" }}
            >
                {/* Clean Carto light basemap */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                    subdomains="abcd"
                    maxZoom={20}
                />


                {/* Microwave markers */}
                {microwaves.map((m, i) => (
                    <Marker key={i} position={[m.lat, m.lng]} icon={microwaveIcon}>
                        <Popup>
                            <div style={{ fontSize: "14px", lineHeight: "1.4" }}>
                                <b style={{ color: "#d22630" }}>{m.building}</b><br />
                                📍 {m.location}<br />
                                ⏰ {m.hours || "Hours not listed"}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* User location (pulsing dot + accuracy circle) */}
                {position && (
                    <>
                        <Marker position={position} icon={userIcon}>
                            <Popup>📍 You are here</Popup>
                        </Marker>

                        {accuracy && (
                            <Circle
                                center={position}
                                radius={accuracy}
                                color="blue"
                                fillColor="blue"
                                fillOpacity={0.15}
                            />
                        )}
                    </>
                )}
            </MapContainer>
        </div>
    )
}
