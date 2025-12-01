import { ArcticFetchError, decodeIdToken, generateCodeVerifier, generateState, OAuth2RequestError } from 'arctic'
import * as jose from 'jose'
import env from '../config/env.js'
import { google } from '../libs/oauth/google.js'
import { generateRefreshToken } from '../utils/generateToken.js'
import User from '../models/User.js'
import { generateFromEmail } from 'unique-username-generator'

export const redirectToGoogleOAuth = (req, res) => {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    const scopes = ["email", "openid", "profile"]

    //url to which frontend will be redirected for google auth
    const url = google.createAuthorizationURL(state, codeVerifier, scopes)

    res.cookie('googleState', state, env.OAUTH_COOKIE_OPTIONS)
    res.cookie('googleCodeVerifier', codeVerifier, env.OAUTH_COOKIE_OPTIONS)

    res.redirect(url)
}

export const googleOAuthCallback = async (req, res) => {
    const { code, state } = req.query
    const { googleCodeVerifier, googleState } = req.cookies

    const clearCookies = () => {
        res.clearCookie('googleState', env.OAUTH_COOKIE_OPTIONS)
        res.clearCookie('googleCodeVerifier', env.OAUTH_COOKIE_OPTIONS)
    }

    if (!code || !state || !googleCodeVerifier || !googleState) return res.fail(400, "BAD_REQUEST", "Invalid Request, some info was wrong")
    if (state !== googleState) {
        clearCookies()
        return res.fail(400, "OAUTH_INVALID_STATE", "The google oauth state was invalid")
    }

    var tokens
    try {
        tokens = await google.validateAuthorizationCode(code, googleCodeVerifier)
    } catch (err) {
        if (err instanceof OAuth2RequestError) {
            //Incorrect Authorization Code, credentials or redirect uri
            clearCookies()
            console.error("Google OAuth incorrect creds, code or redirect uri error", err.code)
            return res.fail(400, "OAUTH_ERROR", "The google oauth code received was wrong")
        }
        if (err instanceof ArcticFetchError) {
            console.error("Arctic fetch failed", err.cause)
            return res.fail(500, "OAUTH_FETCH_ERROR", "Arctic google oatuh fetch failed")
        }
        console.error("Parsing error in google oauth", err)
        return res.fail(500, "OAUTH_PARSE_ERROR", "Parsing error in google oauth")
    }

    clearCookies()
    const idToken = tokens.idToken()

    const rsaPublicKey = await jose.importJWK({
        kty: "RSA",
        e: "AQAB",
        n: "lS1jk0KK-dNV-znvOtWcgkiY52Wdfs7RN3117id4c1cmJ3gR0bgRbKo_G6MeY6pAdgWjoGl114tkEAbhKv-4uONGXizTMtqEj10vXzDaZhFeAYX-7VthR-kyuCKFDwU6KHYunV7G-kcKIlCM9p6nnpky7JxBYh9eDzshRbrF6qhxemidcsoL0OGclfslbzgkcUbG2uP21X-fGpX2NmoT5CWcSBoFoo3oesggZuU7goQ_mXdsndPtOEwspmwRpwC_sssdMhDhkG8ehuSSYrbGMCUF3yAOkZfmFRKf6cjtOBeBifmzarhk5XCD5-NIMUBBoD5pdQrsrZuQrImIIPoqwQ",
    }, "RS256")

    var decoded
    try {
        decoded = await jose.jwtVerify(idToken, rsaPublicKey, {
            issuer: "https://accounts.google.com",
            audience: env.GOOGLE_CLIENT_ID,
        })
    } catch (error) {
        console.error("Error in verifying idToken for google oauth", error)
        return res.fail(500, "OAUTH_IDTOKEN_INVALID", "Error in verifying idToken for google oauth")
    }
    const { email, name } = decoded.payload

    const refreshToken = generateRefreshToken(email)
    res.cookie('refreshToken', refreshToken, env.COOKIE_OPTIONS)

    if (await User.exists({ email })) {
        await User.updateOne({ email }, { $addToSet: { providers: "google" } })
        return res.redirect("/")
    }

    const randomUsername = generateFromEmail(email, { randomDigits: 3, leadingFallback: "lushiro_user" })
    //User does not exist
    await User.create({ email, fullName: name, providers: ["google"], username: randomUsername })
    return res.redirect("/")
}
