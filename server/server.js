import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import connectDB from './config/db.js'
import env from './config/env.js'

import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import followRoutes from './routes/followRoutes.js'
import postRoutes from './routes/postRoutes.js'
import postInteractionRoutes from './routes/postInteractionRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import validationRoutes from './routes/validationRoutes.js'
import userRoutes from './routes/userRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import errorHandler from './middlewares/errorHandler.js'
import responseHandler from './utils/responseHandler.js'
import Message from './models/Message.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST"]

    }
})


io.on('connection', (socket) => {
    console.log("Connected to io", socket.id)
    socket.on("JOIN_ROOM", (data) => {
        socket.join(data.roomId)
        console.log(`User ${data.userId} has joined the room ${data.roomId}`)
    })
    socket.on("SEND_MESSAGE", async (data, cb) => {
        const { roomId, userId } = data
        const receiverId = roomId.split("|").filter(id => id != userId)[0]
        const message = await Message.create({ text: data.message, senderId: userId, roomId, receiverId })
        console.log("uh")
        cb({ success: true, message })
        socket.to(roomId).emit("RECEIVE_MESSAGE", { message })
    })
})

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
if (env.MODE === "development") {
    app.use(cors({
        origin: env.CLIENT_URL,
        credentials: true
    }))
}


app.use(responseHandler)

const API_PREFIX = env.MODE == "development" ? "/api" : ""

app.use(`${API_PREFIX}/auth`, authRoutes)
app.use(`${API_PREFIX}/profile`, profileRoutes)
app.use(`${API_PREFIX}`, followRoutes)
app.use(`${API_PREFIX}/posts`, postRoutes)
app.use(`${API_PREFIX}/postInteractions/:id`, postInteractionRoutes)
app.use(`${API_PREFIX}/upload`, uploadRoutes)
app.use(`${API_PREFIX}/validate`, validationRoutes)
app.use(`${API_PREFIX}/users`, userRoutes)
app.use(`${API_PREFIX}/messages`, messageRoutes)

app.use(errorHandler)

connectDB()
// app.listen(env.PORT || 3000, "0.0.0.0")
server.listen(env.PORT || 3000, "0.0.0.0", () => {
    console.log(`Listening on port ${env.PORT || 3000}`)
})