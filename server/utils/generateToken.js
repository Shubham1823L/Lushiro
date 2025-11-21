import jwt from 'jsonwebtoken'
import env from '../config/env.js'

export const generateAccessToken = (payload) => {
    try {
        return jwt.sign({ email: payload }, env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
    } catch (error) {
        throw error
    }
}

export const generateRefreshToken = (payload) => {
    try {
        return jwt.sign({ email: payload }, env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
    } catch (error) {
        throw error
    }
}





