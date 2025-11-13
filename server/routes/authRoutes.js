import express from 'express'
import { signup, login, logout, refreshAccessToken } from '../controllers/authController.js'
import { verifyAccessToken } from '../middlewares/authMiddleware.js'
import { validateEmail, validatePassword } from '../middlewares/validateMiddleware.js'
import { verifyOtp } from '../controllers/otpController.js'
import asyncHandler from '../utils/asyncHandler.js'

const router = express.Router()

router.post('/signup', validateEmail, asyncHandler(signup))

router.post('/signup/verify', asyncHandler(verifyOtp))

router.post('/login', validateEmail, validatePassword, asyncHandler(login))

router.post('/logout', verifyAccessToken, asyncHandler(logout))

router.post('/refresh', asyncHandler(refreshAccessToken))


export default router