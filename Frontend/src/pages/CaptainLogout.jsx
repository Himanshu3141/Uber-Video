import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const CaptainLogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('captain-token');
        if (!token) {
            navigate('/captain-login');
            return;
        }

        axios.get(`${import.meta.env.VITE_API_URL}/captains/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            if (response.status === 200) {
                localStorage.removeItem('captain-token');
                navigate('/captain-login');
            }
        })
        .catch((error) => {
            console.error('Logout failed:', error);
            navigate('/captain-login');
        });
    }, [navigate]);

    return null;
};

export default CaptainLogout;
