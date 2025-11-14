import { api, unAuthApi } from "./axios"

export const login = async (email, password) => {
    try {
        const response = await unAuthApi.post(`/auth/login`, { email, password })
        return response
    } catch (error) {
        return error.response
    }

}


export const logout = async () => {
    await api.post('/auth/logout')
}


export const signup = async (data) => {

    try {
        const response = await unAuthApi.post(`/auth/signup`, data)
        return response
    } catch (error) {
        return error.response
    }

}

export const verifyOtp = async (otp) => {
    try {
        const response = await unAuthApi.post(`/auth/signup/verify`, { otp })
        return response
    } catch (error) {
        return error.response
    }
}
