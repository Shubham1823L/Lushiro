import express from 'express'
import { createPost, deletePost, getFeedPosts, getMyPosts } from '../controllers/postController.js'
import { verifyAccessToken } from '../middlewares/authMiddleware.js'
import asyncHandler from '../utils/asyncHandler.js'

const router = express.Router()

router.post('/', verifyAccessToken, asyncHandler(createPost))

router.get('/feed', verifyAccessToken, asyncHandler(getFeedPosts))

router.get('/:username', verifyAccessToken, asyncHandler(getMyPosts))

router.delete('/:postId', verifyAccessToken, asyncHandler(deletePost))


export default router