import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"
import Navbar from "../Navbar/Navbar";
import UsersLists from "./UsersList";


const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const[name,setName]=useState("");
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const[friends,setFriends]=useState([]);

    const [searchQuery, setSearchQuery] = useState("");
        const filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getLoggedInUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userEmail = decodedToken.user.email;
        const userName = decodedToken.user.name;  
        return {userEmail , userName};
      }
    
      return null;
    };

    useEffect(() => {
      const loggedInEmail = getLoggedInUser().userEmail;
      const currentUsername = getLoggedInUser().userName;
      setCurrentUser(loggedInEmail);
      setName(currentUsername);

      // Fetch all users excluding the logged-in user
      axios
        .get("http://localhost:8000/api/users/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setUsers(response.data.users);
        })
        .catch((error) => console.error("Error fetching users:", error));
        
        // Fetch friend requests
        axios.get(`http://localhost:8000/api/users/requests`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          // console.log(response.data.userDetails.friends); // Check the response in the console
          setFriends(response.data.userDetails.friends);
          setFriendRequests(response.data.friendRequests);
          setSentRequests(response.data.sentRequests);
        })
        .catch((error) => console.error("Error fetching requests:", error));

      }, []);
      
  return (
    <div>
        <Navbar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          name={name} 
          friends={friends}
          friendRequests={friendRequests}
          setFriends={setFriends}
          setFriendRequests={setFriendRequests}
          currentUser={currentUser} 
          />
         {/* Users List */}
        <UsersLists 
          filteredUsers={filteredUsers} 
          currentUser={currentUser} 
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
          sentRequests={sentRequests}
          setSentRequests={setSentRequests}
          friends={friends}
          setFriends={setFriends}
        />
    </div>
  );
};

export default UsersList;