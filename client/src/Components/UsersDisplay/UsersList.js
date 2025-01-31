import axios from "axios";
import React, { useEffect, useState } from "react";

const UsersLists = ({filteredUsers , currentUser , friendRequests , setFriendRequests , sentRequests , friends, setFriends})=>{
    const [sentRequestsState, setSentRequestsState] = useState([]);

    useEffect(() => {
        if (sentRequests && sentRequests.length > 0) {
            const sentEmails = sentRequests.map(request => request); // Extract emails
            setSentRequestsState(sentEmails);
        }
    }, [sentRequests]);
    
    const sendFriendRequest = async (receiverEmail) => {
        try {
            await axios.post("http://localhost:8000/api/users/sendrequest", {
                senderEmail: currentUser,
                receiverEmail: receiverEmail,
            }).then((res) => {
                console.log("send friend request route works: ", res);
                // Update the state to include the new sent request
                setSentRequestsState([...sentRequestsState, receiverEmail]);
            }).catch(e => {
                console.log("axios error send friend request: ", e);
            });
        } catch (e) {
            console.log("send friend request error: ", e);
        }
    };

    const removeFriendRequest = async (receiverEmail) => {
        try {
            await axios.post("http://localhost:8000/api/users/remove-request", {
                senderEmail: currentUser,
                receiverEmail: receiverEmail,
            }).then((res) => {
                console.log("remove friend request route works: ", res);
                // Update the state to remove the request
                setSentRequestsState(sentRequestsState.filter(email => email !== receiverEmail));
            }).catch(e => {
                console.log("axios error remove friend request: ", e);
            });
        } catch (e) {
            console.log("remove friend request error: ", e);
        }
    };
    
    const acceptFriendRequest = async (requestSenderEmail, requestSenderName) => {
        try {
          // Make an API call to accept the friend request
          const response = await axios.post("http://localhost:8000/api/users/accept-request", {
            currentUserEmail: currentUser,
            requestSenderEmail, //current user ki friends me or request sender ki b friends me
          });
        setFriends([...friends, {name: response.data.sender.name , email: response.data.sender.email}])
        } catch (error) {
          console.error("Error accepting request:", error);
        }
      };

      console.log("friends:", friends);

    return(
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold text-center mb-8">Users List</h1>
            {filteredUsers
                .filter((user) => user.email !== currentUser) // Exclude the current user
                .map((user) => (
                <div
                key={user._id}
                className="bg-white rounded-lg shadow-lg p-6 mb-6 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:bg-blue-50"
                >
                <div className="flex items-center space-x-6 cursor-pointer">
                    <p className="bg-blue-300 font-bold rounded-full text-2xl px-4 py-2 text-blue-800 cursor-pointer">
                    {user.name.charAt(0)}
                    </p>
                    <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    </div>
                </div>

                <button
                    key={user.email}
                    onClick={() => {
                        if (friendRequests.some((request) => request.email === user.email)) {
                        acceptFriendRequest(user.email, user.name); // Pass email and name
                        } else if (sentRequestsState.some((request) => request.email === user.email)) {
                        removeFriendRequest(user.email);
                        } else {
                        sendFriendRequest(user.email);
                        }
                    }}
                    className={`px-4 py-2 text-white rounded-lg transition-all duration-300 ${
                        friendRequests.some((request) => request.email === user.email)
                        ? "bg-green-500 hover:bg-green-600"
                        : sentRequestsState.some((request) => request.email === user.email)
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    >
                    {
                        friendRequests.some((request) => request.email === user.email)
                            ? "Accept Friend Request"
                            : sentRequestsState.some((request) => request.email === user.email)
                            ? "Requested"
                            : "Add Friend"
                    }
                </button>

                </div>
            ))}
        </div>
    )
}

export default UsersLists;