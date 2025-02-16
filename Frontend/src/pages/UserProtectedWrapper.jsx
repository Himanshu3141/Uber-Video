import React, { useContext,useEffect } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const UserProtectedWrapper = ({
    children
}) => {
   
   const token=localStorage.getItem('token') 
   const {user}=useContext(UserDataContext)
   const navigate=useNavigate() 

  useEffect(() => {
    if(!token){
        navigate('/login')
    }  axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
      headers: {
          authorization: `Bearer ${token}`
      }
  }).then(response => {
          if (response.status === 200) {
              setCaptain(response.data.user);
              setIsLoading(false);
          }
      })
      .catch(error => {
          console.error('Error fetching profile:', error);
          localStorage.removeItem('token');
          navigate('/login');
      });
  },[token])

  return (
    <>
       {children}
    </>
  )
}

export default UserProtectedWrapper