import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState({ lat: 12.9716, lng: 77.5946 });

    useEffect(() => {
        const updatePosition = (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(updatePosition);
            const watchId = navigator.geolocation.watchPosition(updatePosition, 
                (error) => console.error("Error getting position:", error),
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    return (
        <div className="w-full h-full rounded-lg shadow-lg overflow-hidden">
            <MapContainer center={currentPosition} zoom={15} className="w-full h-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Recenter position={currentPosition} />
                <Marker position={currentPosition} />
            </MapContainer>
        </div>
    );
};

const Recenter = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position, map.getZoom());
    }, [position, map]);

    return null;
};

export default LiveTracking;
