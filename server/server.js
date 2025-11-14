import express from 'express'
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
import errorHandler from './middlewares/errorHandler.js'
import responseHandler from './utils/responseHandler.js'

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true
}))

app.use(responseHandler)

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api', followRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/postInteractions/:id', postInteractionRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/validate', validationRoutes)
app.use('/api/users', userRoutes)

app.use(errorHandler)

connectDB()
app.listen(env.PORT || 3000)