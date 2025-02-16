import React, { useContext,useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'

const CaptainProtectedWrapper = ({
    children
}) => {
 
   const token=localStorage.getItem('token')
   const {captain,setCaptain}=useContext(CaptainDataContext)
   const [isLoading,setIsLoading]=useState(true)
   const navigate=useNavigate()

useEffect(() => {
    if (!token) {
        navigate('/captain-login');
        return;
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.status === 200) {
                setCaptain(response.data.captain);
                setIsLoading(false);
            }
        })
        .catch(error => {
            console.error('Error fetching captain profile:', error);
            localStorage.removeItem('token');
            navigate('/captain-login');
        });
}, [token]);

    if(isLoading){
        return (
            <div>Loading...</div>
        )
      }

  return (
    <>
       {children}
    </>
  )
}

export default CaptainProtectedWrapper