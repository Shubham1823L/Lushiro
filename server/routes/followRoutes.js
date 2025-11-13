import express from 'express'
import { verifyAccessToken } from '../middlewares/authMiddleware.js'
import User from '../models/User.js'
import { toggleFollow } from '../controllers/followController.js'
import asyncHandler from '../utils/asyncHandler.js'

const router = express.Router()

router.post('/follow/:username', verifyAccessToken, asyncHandler(toggleFollow))

router.delete('/unfollow/:username', verifyAccessToken, asyncHandler(toggleFollow))

router.param('username', async (req, res, next, username) => {
    const user = await User.findOne({ username })
    if (!user) return res._final(404,"USER_NOT_FOUND","Requested user could not be found")
    req.toBeFollowed = user
    next()
})


export default router