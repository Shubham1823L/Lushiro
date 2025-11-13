import { api } from "./axios"

export const uploadAvatar = async (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    try {
        const response = await api.post('/upload/avatar', formData)
        return response
    } catch (error) {
        console.error('error uploading avatar')
        return error.response
    }
}
