import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import Panel from './Panel';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const ProfilePage = () => {
    const[name,setName]=useState("");
    const [email, setEmail] = useState('');
    const [sentRequests, setSentRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);

    const getLoggedInUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const email = decodedToken.user.email;
        return email;
      }
      return null;
    };

    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const currentUser = getLoggedInUser();
          if (!currentUser) {
            console.error("No logged-in user found.");
            return;
          }
  
          const response = await axios.get(
            `http://localhost:8000/api/users/user-details`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setFriendRequests(response.data.user.friendRequests);
          setFriends(response.data.user.friends);
          setSentRequests(response.data.user.sentRequests);
          setEmail(response.data.user.email);
          setName(response.data.user.name);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserDetails(); 
  
    }, []); 

    useEffect(() => {
      console.log("Updated friendRequests:", sentRequests);
    }, [friendRequests,friends,sentRequests,email,name]);

    const navigate = useNavigate();
    const handleLogout = () => {
        // Remove the token from localStorage
        localStorage.removeItem('token');
    
        // Redirect to the sign-in page
        navigate('/signin');
    };

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex flex-row justify-between items-center bg-white p-6 rounded-lg w-auto mx-[10%]">
        <div className='flex flex-row'>
          <p className="bg-blue-300 font-bold rounded-full text-3xl w-16 h-16 flex items-center justify-center text-blue-800 cursor-pointer mr-6">
            {name.charAt(0)}
          </p>
          <div className="flex flex-col items-start">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{name}</h2>
            <p className="text-gray-600">{email}</p>
          </div>
        </div>
        <Button variant='contained' onClick={handleLogout}>Logout &nbsp; &nbsp;<LogoutIcon/></Button>
      </div>
      <Panel sentRequests={sentRequests} friendRequests={friendRequests} friends={friends} />
    </div>
  );
};

export default ProfilePage;