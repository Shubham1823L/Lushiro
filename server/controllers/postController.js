import Post from '../models/Post.js'
import postCleanupService from '../services/postCleanupService.js'
import { findUserByUsername } from '../utils/userUtils.js'

export const createPost = async (req, res) => {
    const postData = req.body
    if (!postData) return res.fail(400, "POST_DATA_EMPTY", "Post data was empty")

    const user = req.user
    const post = await Post.create({
        author: user._id,
        content: {
            secureUrl: postData.secureUrl,
            publicId: postData.publicId
        }
    })

    user.posts.push(post._id)
    await user.save()
    return res.success(200, { post }, "Post was created successfully")
}

export const getFeedPosts = async (req, res) => {
    const user = req.user
    const following = user.following
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const posts = await Post.aggregate([
        {
            $match: { author: { $in: following } }
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author"
            }
        },
        {
            $unwind: "$author"
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        },
        {
            $project: {
                likesCount: 1,
                commentsCount: 1,
                createdAt: 1,
                content: 1,
                commentsCount: 1,
                likes: 1,
                author: {
                    username: 1,
                    followersCount: 1,
                    avatar: 1
                }
            }
        }
    ])
    return res.success(200, { posts })

}

export const getMyPosts = async (req, res) => {
    const user = await findUserByUsername(req.params.username)
    if (!user) return res.fail(404, "USER_NOT_FOUND", "User does not exist, cannot fetch posts")

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const posts = await Post.aggregate([
        {
            $match: { author: user._id }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $limit: limit
        },
        {
            $skip: (page - 1) * limit
        }
    ])

    return res.success(200, { posts })
}




export const deletePost = async (req, res) => {
    const user = req.user
    const post = await Post.findById(req.params.postId)

    if (!post) return res.fail(404, "POST_NOT_FOUND", "Requested post was not found")
    if (post.author.toString() != user._id.toString()) return res.fail(403, "FORBIDDEN_DELETE", "You are not allowed to delete posts of other users")

    await postCleanupService(post, user)
    res.sendStatus(204)
}



