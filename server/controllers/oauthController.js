import { ArcticFetchError, generateCodeVerifier, generateState, OAuth2RequestError } from 'arctic'
import * as jose from 'jose'
import env from '../config/env.js'
import { github, google } from '../libs/oauth.js'
import { generateRefreshToken } from '../utils/generateToken.js'
import User from '../models/User.js'
import { generateFromEmail } from 'unique-username-generator'
import axios from 'axios'
import e from 'express'


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


export const redirectToGithubOAuth = (req, res) => {
    const state = generateState()
    const scopes = ["user:email", "read:user"]

    const url = github.createAuthorizationURL(state, scopes)

    res.cookie('githubState', state, env.OAUTH_COOKIE_OPTIONS)

    res.redirect(url)
}

export const githubOAuthCallback = async (req, res) => {
    const { state, code } = req.query
    const { githubState } = req.cookies

    const clearCookies = () => {
        res.clearCookie('githubState', env.OAUTH_COOKIE_OPTIONS)
    }

    if (!state || !githubState) return res.fail(400, "BAD_REQUEST", "Invalid Request, some info was wrong")
    if (state !== githubState) {
        clearCookies()
        return res.fail(400, "OAUTH_INVALID_STATE", "The github oauth state was invalid")
    }

    var tokens
    try {
        tokens = await github.validateAuthorizationCode(code)
    } catch (err) {
        if (err instanceof OAuth2RequestError) {
            //Incorrect Authorization Code, credentials or redirect uri
            clearCookies()
            console.error("Github OAuth incorrect creds, code or redirect uri error", err.code)
            return res.fail(400, "OAUTH_ERROR", "The github oauth code received was wrong")
        }
        if (err instanceof ArcticFetchError) {
            console.error("Arctic fetch failed", err.cause)
            return res.fail(500, "OAUTH_FETCH_ERROR", "Arctic github oatuh fetch failed")
        }
        console.error("Parsing error in github oauth", err)
        return res.fail(500, "OAUTH_PARSE_ERROR", "Parsing error in github oauth")
    }

    clearCookies()

    const githubAccessToken = tokens.accessToken()

    const { data: githubUser } = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${githubAccessToken}` }
    })
    const { data: githubEmails } = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${githubAccessToken}` }
    })

    const { login: githubUsername, name } = githubUser

    const { email } = githubEmails.find(obj => obj.primary === true)



    const refreshToken = generateRefreshToken(email)
    res.cookie('refreshToken', refreshToken, env.COOKIE_OPTIONS)

    if (await User.exists({ email })) {
        await User.updateOne({ email }, { $addToSet: { providers: "github" } })
        return res.redirect("/")
    }

    //User does not exist
    var username
    if (await User.exists({ username: githubUsername })) {
        username = generateFromEmail(email, { randomDigits: 3, leadingFallback: "lushiro_user" })
    }
    else {
        username = githubUsername
    }

    await User.create({ email, fullName: name, providers: ["github"], username: username })
    return res.redirect("/")

}
