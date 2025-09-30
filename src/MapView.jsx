import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Circle } from 'react-leaflet'
import { useState, useEffect } from 'react'
import microwaves from './microwaves.json'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default Leaflet icons (for microwave markers)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapView() {
    const [position, setPosition] = useState(null)
    const [accuracy, setAccuracy] = useState(null)

    // Track location continuously
    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude])
                    setAccuracy(pos.coords.accuracy) // meters
                },
                (err) => {
                    console.error(err)
                },
                { enableHighAccuracy: true }
            )

            return () => navigator.geolocation.clearWatch(watchId)
        }
    }, [])

    return (
        <MapContainer
            center={[49.2781, -122.9197]}  // fallback center: SFU Burnaby
            zoom={16}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* Microwave markers from JSON */}
            {microwaves.map((m, i) => (
                <Marker key={i} position={[m.lat, m.lng]}>
                    <Popup>
                        <b>{m.building}</b><br />
                        {m.location}<br />
                        {m.hours}
                    </Popup>
                </Marker>
            ))}

            {/* Current location as blue dot + accuracy circle */}
            {position && (
                <>
                    <CircleMarker
                        center={position}
                        radius={8}           // size of blue dot
                        color="blue"
                        fillColor="blue"
                        fillOpacity={0.9}
                    >
                        <Popup>📍 You are here</Popup>
                    </CircleMarker>

                    {accuracy && (
                        <Circle
                            center={position}
                            radius={accuracy}   // meters
                            color="blue"
                            fillColor="blue"
                            fillOpacity={0.15}
                        />
                    )}
                </>
            )}
        </MapContainer>
    )
}
