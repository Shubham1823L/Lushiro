import express from 'express'
import { createComment, deleteComment, getComments, toggleLike } from '../controllers/postInteractionController.js'
import { verifyAccessToken } from '../middlewares/authMiddleware.js'
import Post from '../models/Post.js'
import asyncHandler from '../utils/asyncHandler.js'


const router = express.Router({ mergeParams: true })

router.use(asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const post = await Post.findById(id)
    if (!post) return res.fail(404, "POST_NOT_FOUND", "The post you requested could not be found")
    req.post = post
    next()
}))

router.post('/like', verifyAccessToken, asyncHandler(toggleLike))

router.post('/comment', verifyAccessToken, asyncHandler(createComment))

router.get('/comments', asyncHandler(getComments))

router.delete('/comments/:commentId', verifyAccessToken, asyncHandler(deleteComment))

export default router