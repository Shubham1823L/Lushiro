import Message from "../models/Message.js"

export const getMessages = async (req, res) => {
    const { roomId } = req.params

    const messages = await Message.aggregate([
        {
            $match: { roomId: roomId }
        },
        {
            $sort: { createdAt: 1 }
        },
        {
            $project: {
                senderId: 1,
                text: 1,
                _id: 1
            }
        }
    ])

    return res.success(200, { messages })
}

export const getRecentChats = async (req, res) => {
    const { userId } = req.params

    const chats = await Message.aggregate([
        {
            $match: { roomId: { $regex: userId, $options: "i" } }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $limit: 1
        },
        {
            $lookup: {
                from: "users",
                localField: "senderId",
                foreignField: "_id",
                as: "sender"
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"receiverId",
                foreignField:"_id",
                as:"receiver"
            }
        },
        {
            $unwind: "$sender"
        },
        {
            $unwind:"$receiver"
        },
        {
            $project: {
                roomId:1,
                senderId:1,
                text:1,
                sender:{
                    fullName:1,
                    avatar:1,
                    username:1,
                },
                receiver:{
                    avatar:1,
                    username:1,
                }
            }
        }
    ])

    res.success(200,{chats})
}

