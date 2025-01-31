import express from "express";
import {fetchAllUsers, getUserDetails, handleUserSignin , handleUserSignup} from '../controllers/user.js';
import { fetchRequests, handleAcceptRequest, handleRemoveRequest, handleSendRequest } from "../controllers/requests.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/signup',handleUserSignup)

router.post('/signin',handleUserSignin)

router.get('/all', authenticateToken , fetchAllUsers);

router.post('/sendrequest', handleSendRequest);

router.post('/remove-request', handleRemoveRequest);

router.post('/accept-request',handleAcceptRequest);

router.get('/requests', authenticateToken , fetchRequests);

router.get('/user-details',authenticateToken , getUserDetails);

export default router;