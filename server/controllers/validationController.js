import Joi from "joi"
import User from "../models/User.js"

export const validateEmail = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required()
    })

    const { value, error } = schema.validate({ email: req.body.email })
    if (error) return res.fail(400, "EMAIL_INVALID", "The email you entered had an invalid format")

    const exists = await User.exists({ email: value.email })
    if (exists) return res.fail(409, "EMAIL_IS_TAKEN", "Email is already registered, please login")

    return res.sendStatus(200)
}


export const validateUsername = async (req, res) => {
    const exists = await User.exists({ username: req.body.username })
    if (exists) return res.fail(409, "USERNAME_IS_TAKEN", "Username is already taken")

    return res.sendStatus(200)
}
