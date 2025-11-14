import { unAuthApi } from "./axios"

export const validateEmail = async (value) => {
    try {
        const response = await unAuthApi.post(`/validate/email`, { email: value })
        return 200
    } catch (error) {
        return error.response.status
    }
}

export const validateUsername = async (value) => {
     try {
        const response = await unAuthApi.post(`/validate/username`, { username: value })
        return 200
    } catch (error) {
        return error.response.status
    }
}

