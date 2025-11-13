import express from 'express'
import { verifyAccessToken } from '../middlewares/authMiddleware.js'
import User from '../models/User.js'
import { deleteProfile, getProfileData, updateProfileData } from '../controllers/profileController.js'
import asyncHandler from '../utils/asyncHandler.js'


const router = express.Router()

router.get('/:username', asyncHandler(getProfileData))

router.patch('/update', verifyAccessToken, asyncHandler(updateProfileData))

router.delete('/', verifyAccessToken, asyncHandler(deleteProfile))

router.param('username', async (req, res, next, username) => {
    try {
        const user = await User.findOne({ username })
        if (!user) return res.fail(404, "USER_NOT_FOUND", "Requested user could not be found")
        req.user = user
        next()
    } catch (error) {
        next(error)
    }

})


export default router
