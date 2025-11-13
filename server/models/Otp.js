import mongoose from "mongoose"

const otpSchema = new mongoose.Schema({
    otp: Number,
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 5 * 60 * 1000 }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})

export default mongoose.model('Otp', otpSchema)