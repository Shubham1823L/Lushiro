import mongoose from 'mongoose'
import env from './env.js'

async function connectDB() {
    try {
        await mongoose.connect(env.MONGO_URI)
        console.log("Connected to DB")
    } catch (error) {
        console.error(500, "DB_ERROR", "Connection to the Database could not be established", error)
    }
}

export default connectDB