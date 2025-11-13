import axios from "axios"
import { api } from "./axios"

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { email, password },{withCredentials:true})
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
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, data, { withCredentials: true })
        return response
    } catch (error) {
        return error.response
    }

}

export const verifyOtp = async (otp) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup/verify`, { otp }, { withCredentials: true })
        return response
    } catch (error) {
        return error.response
    }
}
