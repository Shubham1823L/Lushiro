import { sendOtp } from "./otpController.js"
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js"
import env from "../config/env.js"
import User from "../models/User.js"
import TempToken from "../models/Temp_verification_token.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import CustomError from '../utils/CustomError.js'


// just for otp sending and tempToken generation
export async function signup(req, res) {
    const { email, username, fullName, password } = req.body

    // Is the email already registered
    let exists = await User.exists({ email })
    if (exists) return res.fail(409, "EMAIL_IS_TAKEN", "Email is already registered")


    // Email not registered,Check if username is available
    exists = await User.exists({ username })
    if (exists) return res.fail(409, "USERNAME_IS_TAKEN", "Username is already taken")


    // Username is available , creating a temporary verification token and sending otp
    // And then Sending cookie to confirm user later
    const otp = Math.floor(Math.random() * (1e6 - 1e5) + 1e5)
    sendOtp(email, otp)
    const otp_uuid = crypto.randomUUID()

    const hashedPassword = await bcrypt.hash(password, 10)
    await TempToken.create({ email, password: hashedPassword, username, fullName, otp, otp_uuid })

    res.cookie("email", email, {
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    })
    res.cookie("otp_uuid", otp_uuid, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    })

    return res.success()
}



// Let user Login even if he is already logged in for multi device support
export const login = async (req, res) => {
    const { email, password } = req.body //--> already non-empty , valid format
    const user = await User.findOne({ email }).select('+password')
    if (!user) return res.fail(404, "USER_NOT_FOUND", "User does not exist, please signup first")

    // Authenticate using password
    const value = await bcrypt.compare(password, user.password)
    if (!value) return res.fail(400, "INCORRECT_PASSWORD", "Incorrect Password")


    // Produce and send tokens
    const refreshToken = generateRefreshToken(email)
    res.cookie('refreshToken', refreshToken, env.COOKIE_OPTIONS)

    const accessToken = generateAccessToken(email)
    return res.success(200, { accessToken, user }, "Logged in Successfully")

}

export const logout = async (req, res) => {
    res.clearCookie('refreshToken', env.COOKIE_OPTIONS)
    return res.sendStatus(204)
}

export const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) throw new CustomError(401, "TOKEN_NOT_FOUND", "Refresh token was missing, please re-login")

    try {
        const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET)
        const email = decoded.email
        const user = await User.findOne({ email })
        if (!user) {
            res.clearCookie('refreshToken', env.COOKIE_OPTIONS)
            throw new CustomError(401, "USER_NOT_FOUND", "User does not exist")
        }

        const accessToken = generateAccessToken(email)
        return res.success(200, { accessToken, user }, "Access token refreshed successfully")

    } catch (err) {
        const error = err.name
        if (error === "TokenExpiredError") throw new CustomError(401, "TOKEN_EXPIRED", "Refresh token has expired, please re-login")
        if (error === "JsonWebTokenError") throw new CustomError(401, "TOKEN_INVALID", "Refresh token is invalid, please re-login")

        //Unexpected error
        throw err
    }
}



