import { api } from "./axios"

export const fetchMessagesfromAPI = async (roomId) => {
    try {
        const response = await api.get(`/messages/getRoomMessages/${roomId}`)
        return response
    } catch (error) {
        console.error("Error in api call for messages")
        return error.response
    }
}
