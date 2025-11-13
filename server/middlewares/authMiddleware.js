import jwt from 'jsonwebtoken'
import env from '../config/env.js'
import { findUserByEmail } from '../utils/userUtils.js'

export const verifyAccessToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1]
    if (!accessToken) return res.fail(400,"TOKEN_NOT_FOUND","Authorization headers was either empty or had an invalid format")

    // accessToken acquired
    try {
        const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET)
        const user = await findUserByEmail(decoded.email)
        if (!user) {
            res.clearCookie('refreshToken', env.COOKIE_OPTIONS)
            return res.fail(401, "USER_NOT_FOUND", "User associated to the token was not found, please re-login")
        }
        req.user = user
        return next()
    } catch (err) {
        const error = err.name
        switch (error) {
            case "TokenExpiredError": return res.fail(401, "TOKEN_EXPIRED", "Your Session/Token Expired")
            // Frontend will handle calling refresh endpoint and recalling the needed endpoint
            case "JsonWebTokenError": {
                res.clearCookie('refreshToken', env.COOKIE_OPTIONS)
                return res.fail(401, "TOKEN_INVALID", "Your token was invalid, please re-login")
            }
            default: return res.sendStatus(500)
        }
    }
}
