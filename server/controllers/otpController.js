import nodemailer from 'nodemailer'
import env from '../config/env.js';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import Temp_verification_token from '../models/Temp_verification_token.js';


export const sendOtp = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: env.EMAIL_ID, pass: env.EMAIL_PASS }
    });
    await transporter.sendMail({
        from: `"Shubham" <${env.EMAIL_ID}>`,
        to: email,
        subject: 'A fun Message from The Great Dev',
        text: `Why don't you do ${otp} pushups today?`,
    })
}



export const verifyOtp = async (req, res) => {
    const { otp_uuid, email } = req.cookies
    if (!otp_uuid || !email) return res.fail(410, "OTP_SESSION_EXPIRED", "Your session has expired, please signup again")


    const otpData = await Temp_verification_token.findOne({ otp_uuid })
    if (!otpData) return res.sendStatus(500)

    // email and otp_uuid.email will always match, no need to check since both are sent in cookies
    if (req.body.otp != otpData.otp) return res.fail(400, "OTP_INCORRECT", "Your otp is incorrect")
    const expiresAt = otpData.createdAt + 5 * 60 * 1000
    // ###DOUBT Date.now().toString() better way?? it shld have worked directly

    if (Date.now().toString() > expiresAt) return res.fail(410, "OTP_EXPIRED", "OTP expired")
    // Otp is correct and not expired 
    // Creating New User in db and cleaning up

    res.clearCookie("otp_uuid", {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    })
    res.clearCookie("email", {
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    })


    // Produce and send tokens
    const refreshToken = generateRefreshToken(email)
    res.cookie('refreshToken', refreshToken, env.COOKIE_OPTIONS)

    const accessToken = generateAccessToken(email)

    const { username, fullName, password } = otpData
    const user = await User.create({ username, fullName, password, email })
    return res.success(201, { accessToken, user }, "Account was created successfully ")

}

