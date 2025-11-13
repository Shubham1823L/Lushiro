import mongoose from "mongoose";

const tempTokenSchema = new mongoose.Schema({
    email: String,
    password: String,
    username: String,
    otp_uuid: String,
    otp: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

tempTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 60 })
export default mongoose.model("Temp_verification_token", tempTokenSchema)