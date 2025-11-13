import env from "../config/env.js"
import User from "../models/User.js"
import userCleanupService from '../services/userCleanupService.js'


export const getProfileData = (req, res) => {
    const user = req.user
    res.success(200, { user })
}

export const updateProfileData = async (req, res) => {
    const user = req.user
    const _id = user._id

    const allowedUpdates = ['bio', 'avatar', 'username']
    const updates = {}
    for (const element of allowedUpdates) {
        if (req.body[element] != undefined) {
            // updates = { ...updates, [element]: req.body[element] }
            updates[element] = req.body[element]
        }
    }
    const updated = { $set: {} }
    for (const key in updates) {
        updated.$set[key] = updates[key]
    }
    const updatedUser = await User.updateOne({ _id }, updated)
    res.success(200, { user: updatedUser }, "Your profile was updated successfully")
}

export const deleteProfile = async (req, res) => {
    const user = req.user
    await userCleanupService(user)
    res.clearCookie('refreshToken', env.COOKIE_OPTIONS)
    return res.sendStatus(204)
}
