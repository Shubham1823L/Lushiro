import express from 'express'
import { verifyAccessToken } from '../middlewares/authMiddleware.js'
import { getUsers } from '../controllers/userController.js'
import asyncHandler from '../utils/asyncHandler.js'

const router = express.Router()

router.get('/:username', verifyAccessToken, asyncHandler(getUsers))

export default router