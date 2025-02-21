import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const [ride, setRide] = useState(null);

    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);

    const { socket } = useContext(SocketContext) 
    const { captain } = useContext(CaptainDataContext) 

    useEffect(() => {
        if (!socket || !captain) return;
    
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        });
    
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
    
                        if (lat == null || lng == null) {
                            console.warn("Invalid coordinates received:", { lat, lng });
                            return;
                        }
    
                        console.log({
                            userId: captain._id,
                            location: { lat, lng }
                        });
    
                        socket.emit("update-location-captain", {
                            userId: captain._id,
                            location: { lat, lng }
                        });
                    },
                    (error) => console.warn("Geolocation Error:", error.message)
                );
            }
        };
    
        const locationInterval = setInterval(updateLocation, 10000);
        updateLocation();
    
        // return () => clearInterval(locationInterval); 
    }, [socket, captain]);
    

    socket.on('new-ride',(data)=>{
        setRide(data)
        setRidePopupPanel(true)
    })

    async function confirmRide() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
                rideId: ride?._id,
                captainId: captain?._id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setRidePopupPanel(false);
            setConfirmRidePopupPanel(true);
        } catch (error) {
            console.error("Error confirming ride:", error);
        }
    }

    useGSAP(() => {
        gsap.to(ridePopupPanelRef.current, {
            yPercent: ridePopupPanel ? 0 : 100,
            opacity: ridePopupPanel ? 1 : 0,
            duration: 0.3, 
            ease: "power2.inOut",
            display: ridePopupPanel ? 'block' : 'none' 
        });
    }, [ridePopupPanel]);
    
    useGSAP(() => {
        gsap.to(confirmRidePopupPanelRef.current, {
            yPercent: confirmRidePopupPanel ? 0 : 100,
            opacity: confirmRidePopupPanel ? 1 : 0,
            duration: 0.3,
            ease: "power2.inOut",
            display: confirmRidePopupPanel ? 'block' : 'none'
        });
    }, [confirmRidePopupPanel]);
    
    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
            </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails />
            </div>
            <div 
    ref={ridePopupPanelRef} 
    className={`fixed w-full z-10 bottom-0 bg-white px-3 py-10 pt-12 ${ridePopupPanel ? 'block' : 'hidden'}`}
>
    <RidePopUp
        ride={ride}
        setRidePopupPanel={setRidePopupPanel}
        setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        confirmRide={confirmRide}
    />
</div>

<div 
    ref={confirmRidePopupPanelRef} 
    className={`fixed w-full h-screen z-10 bottom-0 bg-white px-3 py-10 pt-12 ${confirmRidePopupPanel ? 'block' : 'hidden'}`}
>
    <ConfirmRidePopUp
        ride={ride}
        setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        setRidePopupPanel={setRidePopupPanel}
    />
</div>

        </div>
    );
};

export default CaptainHome;
