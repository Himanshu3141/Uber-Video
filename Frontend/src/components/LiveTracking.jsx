import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState({ lat: -3.745, lng: -38.523 });

    useEffect(() => {
        const updatePosition = (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
        };

        navigator.geolocation.getCurrentPosition(updatePosition);
        const watchId = navigator.geolocation.watchPosition(updatePosition, 
            (error) => console.error("Error getting position:", error), 
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <div className="w-full h-full rounded-lg shadow-lg overflow-hidden">
            <MapContainer 
                center={currentPosition} 
                zoom={15} 
                className="w-full h-full"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={currentPosition} />
            </MapContainer>
        </div>
    );
};

export default LiveTracking;
