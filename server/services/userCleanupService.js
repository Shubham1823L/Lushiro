import User from "../models/User.js"
import Post from "../models/Post.js"
import Comment from '../models/Comment.js'

const userCleanupService = async (user) => {
    try {
        const _id = user._id
        //Followers and Following logic
        /*
        1.Decrement followersCount of foreign user from my following Array and followingCount of foreign user from my followers Array
        2.Delete the references of my _id in foreign user following and followers arrays
         */
        async function updateField(schema, fieldname) {
            const count = `${fieldname}Count`
            await schema.updateMany({ [fieldname]: _id },
                {
                    $pull: { [fieldname]: _id },
                    $inc: { [count]: -1 },
                }
            )
        }
        await updateField(User, 'followers')
        await updateField(User, 'following')


        //Self comments, likes deletion logic 
        /*
        1.Delete all comments made by the user to other posts
        2.Delete all the likes , likesCount by the user to other posts
         */
        const comments = await Comment.find({ author: _id }).select('_id')
        for (const e of comments) {
            const _id = e._id
            await Post.updateOne({ comments: _id },
                {
                    $pull: { comments: _id },
                    $inc: { commentsCount: -1 }
                })
        }

        await updateField(Post, 'likes')
        await Comment.deleteMany({ author: _id })

        //Deletion of self Posts and Deletion of comments,likes of others
        //i am the author of the post , foreign user is the author of the comment , comment has Post _id and comment's author _id but not my _id
        //i have to delete all comments whose post _id is in my posts
        await Comment.deleteMany({ post: { $in: user.posts } })
        //Similar logic can be applied for Likes if it was there 
        await Post.deleteMany({ author: _id })

        await User.deleteOne({ _id })
    } catch (error) {
        return next(error)
    }
}

export default userCleanupService