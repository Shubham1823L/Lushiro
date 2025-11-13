import mongoose from 'mongoose'
import env from './env.js'
import CustomError from '../utils/CustomError.js'

async function connectDB() {
    try {
        await mongoose.connect(env.MONGO_URI)
        console.log("Connected to DB")
    } catch (error) {
        throw new CustomError(500,"DB_ERROR","Connection to the Database could not be established")
    }
}

export default connectDB