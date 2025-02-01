import express from "express";
import {fetchAllUsers, getUserDetails, handleRemoveFriend, handleUserSignin , handleUserSignup} from '../controllers/user.js';
import { deleteUserRequest, fetchRequests, handleAcceptRequest, handleRemoveRequest, handleSendRequest } from "../controllers/requests.js";
import { authenticateToken } from "../middleware/auth.js";
import { fetchFriends } from "../controllers/friends.js";

const router = express.Router();

router.post('/signup',handleUserSignup)

router.post('/signin',handleUserSignin)

router.get('/all', authenticateToken , fetchAllUsers);

router.post('/sendrequest', handleSendRequest);

router.post('/remove-request', handleRemoveRequest);

router.post('/remove-friend',handleRemoveFriend);

router.post('/accept-request',handleAcceptRequest);

router.get('/requests', authenticateToken , fetchRequests);

router.get('/user-details',authenticateToken , getUserDetails);

router.post('/friends',fetchFriends);

router.post('/delete-request',deleteUserRequest);

export default router;