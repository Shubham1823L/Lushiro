import Comment from "../models/Comment.js"
import Post from "../models/Post.js"
import commentCleanupService from '../services/commentCleanupService.js'

export const toggleLike = async (req, res) => {
    const user = req.user
    const post = req.post
    const likes = post.likes
    if (likes.find(e => e.equals(user._id))) {
        //Already Liked , unlike post now
        likes.pull(user._id)
        post.likesCount--
        await post.save()
        return res.status(200).json({ message: "Post like removed" })
    }
    else {
        //Not liked yet, like post now
        likes.push(user._id)
        post.likesCount++
        await post.save()
        return res.status(200).json({ message: "Post liked" })
    }
}

export const createComment = async (req, res) => {
    const post = req.post
    const user = req.user
    const { text } = req.body

    const comment = await Comment.create({ text, author: user._id, post: post._id })
    post.comments.push(comment._id)
    post.commentsCount++
    await post.save()
    return res.success(201, { comment: { text, _id: comment._id } }, "Comment was posted successfully")

}

export const getComments = async (req, res) => {
    const post = req.post
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const comments = await Comment.aggregate([
        {
            $match: { _id: { $in: post.comments } }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author'
            }
        },
        {
            $unwind: '$author'
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip: (page - 1) * limit,

        },
        {
            $limit: limit
        },
        {
            $project: {
                text: 1,
                author: {
                    username: 1,
                    followersCount: 1,
                    _id: 1
                }
            }
        }
    ])
    return res.success(200, { comments })
}

export const deleteComment = async (req, res) => {
    const user = req.user
    const comment = await Comment.findOne({ _id: req.params.commentId })

    if (!comment) return res.fail(404, "COMMENT_NOT_FOUND", "The comment you are trying to delete was not found")

    const post = await Post.findOne({ _id: comment.post })
    //Comment can be deleted either by the author of the comment or the author of the post
    if (user._id != comment.author && user._id != post.author) return res.fail(403,"FORBIDDEN_DELTE","You can only delete your own comments or comments on your own post")
        
    await commentCleanupService(comment)
    res.sendStatus(204)
}



