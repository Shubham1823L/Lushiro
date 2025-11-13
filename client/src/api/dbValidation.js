import axios from "axios"

const baseUrl = import.meta.env.VITE_API_BASE_URL
export const validateEmail = async (value) => {
    try {
        const response = await axios.post(`${baseUrl}/validate/email`, { email: value })
        return 200
    } catch (error) {
        return error.response.status
    }
}

export const validateUsername = async (value) => {
     try {
        const response = await axios.post(`${baseUrl}/validate/username`, { username: value })
        return 200
    } catch (error) {
        return error.response.status
    }
}

