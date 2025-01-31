import axios from "axios";
import React, { useEffect, useState } from "react";

const UsersLists = ({ filteredUsers, currentUser, friendRequests, setFriendRequests, sentRequests, setSentRequests, friends, setFriends }) => {
    const [sentRequestsState, setSentRequestsState] = useState([]);
    const [userFriends, setUserFriends] = useState({});

    useEffect(() => {
        if (sentRequests && sentRequests.length > 0) {
            setSentRequestsState(sentRequests.map(request => request.email)); // Ensure emails are stored correctly
        }
    }, [sentRequests]);

    //for getting users friends
    useEffect(() => {
        const fetchFriends = async () => {
            const friendsData = {};
            for (const user of filteredUsers) {
                try {
                    // console.log("email: ",user.email);
                    const response = await axios.post("http://localhost:8000/api/users/friends", {
                        email: user.email, // Send email in the request body
                    });
                    friendsData[user.email] = response.data.friends;
                } catch (error) {
                    console.error("Error fetching friends list:", error.message);
                }
            }
            setUserFriends(friendsData);
        };
    
        fetchFriends();
    }, [filteredUsers]);

    const sendFriendRequest = async (receiverEmail) => {
        try {
            await axios.post("http://localhost:8000/api/users/sendrequest", {
                senderEmail: currentUser,
                receiverEmail: receiverEmail,
            });
            // Update sent requests for sender
            setSentRequests([...sentRequests, { email: receiverEmail }]);
            setSentRequestsState([...sentRequestsState, receiverEmail]);
        } catch (e) {
            console.error("send friend request error: ", e);
        }
    };

    const removeFriendRequest = async (receiverEmail) => {
        try {
            await axios.post("http://localhost:8000/api/users/remove-request", {
                senderEmail: currentUser,
                receiverEmail: receiverEmail,
            });
            // Remove from sent requests for sender
            setSentRequests(sentRequests.filter(user => user.email !== receiverEmail));
            setSentRequestsState(sentRequestsState.filter(email => email !== receiverEmail));

            // Remove from friend requests for receiver
            setFriendRequests(friendRequests.filter(user => user.email !== currentUser));
        } catch (e) {
            console.error("remove friend request error: ", e);
        }
    };

    const acceptFriendRequest = async (requestSenderEmail) => {
        try {
            const response = await axios.post("http://localhost:8000/api/users/accept-request", {
                currentUserEmail: currentUser,
                requestSenderEmail,
            });

            // Add to friends list
            setFriends([...(friends || []), { name: response.data.sender.name, email: response.data.sender.email }]);

            // Remove from friend requests
            setFriendRequests(friendRequests.filter(user => user.email !== requestSenderEmail));
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    const removeFriend = async (friendEmail) => {
        try {
            await axios.post("http://localhost:8000/api/users/remove-friend", {
                currentUserEmail: currentUser,
                friendEmail: friendEmail,
            });

            // Remove from friends list
            setFriends(friends.filter(user => user.email !== friendEmail));
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };

    const hasCommonFriends = (userEmail) => {
        const currentUserFriends = (friends || []).map(user=> user.email); // Fallback to empty array
        const otherUserFriends = (userFriends[userEmail] || []).map(user=> user.email);
        return currentUserFriends.some(email => otherUserFriends.includes(email));
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold text-center mb-8">Users List</h1>
            {filteredUsers
                .filter((user) => user.email !== currentUser)
                .map((user) => {
                const isFriendRequestPending = friendRequests?.some((request) => request.email === user.email) || false;
                const isSentRequest = sentRequestsState?.includes(user.email) || false;
                const isFriend = (friends || []).some((friend) => friend.email === user.email);
                const isRecommended = hasCommonFriends(user.email);

            return (
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
                    
                    {isRecommended && <span className="text-sm text-green-600 italic font-semibold">Recommended</span>}

                    <button
                        key={user.email}
                        onClick={() => {
                            if (isFriend) {
                                removeFriend(user.email);
                            } else if (isFriendRequestPending) {
                                acceptFriendRequest(user.email);
                            } else if (isSentRequest) {
                                removeFriendRequest(user.email);
                            } else {
                                sendFriendRequest(user.email);
                            }
                        }}
                        className={`px-4 py-2 text-white rounded-lg transition-all duration-300 ${
                            isFriend
                                ? "bg-gray-500 hover:bg-gray-600"
                                : isFriendRequestPending
                                ? "bg-green-500 hover:bg-green-600"
                                : isSentRequest
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {isFriend
                            ? "Remove Friend"
                            : isFriendRequestPending
                            ? "Accept Friend Request"
                            : isSentRequest
                            ? "Requested"
                            : "Add Friend"}
                    </button>
                </div>
            );
        })}
        </div>
    );
};

export default UsersLists;
