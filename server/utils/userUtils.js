import User from '../models/User.js'


export const findUserByEmail = async (email) => await User.findOne({ email })

export const findUserByUsername = async (username) => await User.findOne({ username })

