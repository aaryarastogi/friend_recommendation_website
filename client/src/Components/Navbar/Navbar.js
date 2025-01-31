import React, { useState } from "react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconButton, Popover, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom'

const Navbar=({searchQuery , setSearchQuery , name , friendRequests})=>{
    const[open,setOpen]=useState(false);
    const navigate = useNavigate();

    // friendRequests.map((req)=>console.log(req));

    const handleProfile=()=>{
        const user = { name: 'Aarya', age: 22 }; // Example props you want to pass

        navigate('/profile', {
            state: { user }
        });
    }

    return(
        <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
            <div className="text-2xl font-semibold">Website Logo</div>
            <div className="flex items-center space-x-6">
            <input
                type="text"
                placeholder="Search users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-white focus:outline-none text-black"
            />
             <div className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center space-x-2 relative"
                >
                    <IconButton>
                    <NotificationsIcon />
                    </IconButton>
                    <span className="absolute top-0 right-0 text-xs text-red-500 bg-white px-1 rounded-full">
                    {friendRequests.length}
                    </span>
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50 border">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Friend Requests</h3>
                    {friendRequests.length > 0 ? (
                        <ul>
                        {friendRequests.map((request) => (
                            <li key={request.id} className="flex justify-between items-center p-2 border-b last:border-0">
                            <span className="text-gray-800 text-sm">{request.name}</span>
                            <div className="flex space-x-2">
                                <button className="text-white bg-blue-500 hover:bg-blue-600 text-sm px-2 py-1 rounded">
                                Confirm
                                </button>
                                <button className="text-white bg-red-500 hover:bg-red-600 text-sm px-2 py-1 rounded">
                                Delete
                                </button>
                            </div>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No new requests</p>
                    )}
                    </div>
                )}
                </div>
            <p className="bg-blue-300 font-bold rounded-full text-2xl px-4 py-2 text-blue-800 cursor-pointer" onClick={handleProfile}>{name.charAt(0)}</p>
            </div>
        </div>
    )
}

export default Navbar;