import express from 'express'
import { validateEmail, validateUsername } from '../controllers/validationController.js'
import asyncHandler from '../utils/asyncHandler.js'

const router = express.Router()

router.post('/email', asyncHandler(validateEmail))

router.post('/username', asyncHandler(validateUsername))

export default router