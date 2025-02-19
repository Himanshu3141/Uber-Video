import React, { useContext, useEffect, useState } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainProtectedWrapper = ({ children }) => {
    const navigate = useNavigate();
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/captain-login');
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: { authorization: `Bearer ${token}` }
        })
            .then(response => {
                if (response.status === 200) {
                    setCaptain(response.data.captain);
                }
            })
            .catch(error => {
                console.error('Error fetching captain profile:', error);
                localStorage.removeItem('token');
                navigate('/captain-login');
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, []); 

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default CaptainProtectedWrapper;
