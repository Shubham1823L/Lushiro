import express from 'express'
import { getMessages, getRecentChats } from "../controllers/messageController.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAccessToken } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.get('/getRoomMessages/:roomId', verifyAccessToken, asyncHandler(getMessages))

router.get('/getRecentChats/:userId',verifyAccessToken,asyncHandler(getRecentChats))

export default router