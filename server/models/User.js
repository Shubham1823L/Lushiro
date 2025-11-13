import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: String,
    __v: {
        type: Number,
        select: false
    },
    avatar: {
        type: {
            secureUrl: String,
            publicId: String
        },
        default: { secureUrl: "", publicId: "" }
    },
    password: {
        type: String,
        select: false
    },
    bio: String,
    username: {
        type: String,
        unique: true
    },
    followersCount: {
        type: Number,
        default: 0
    }, //No. of ppl who follow this user
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    followingCount: {
        type: Number,
        default: 0
    },//No. of ppl whom this user follows
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
})

export default mongoose.model('User', userSchema)