import { api } from "./axios"


export const callApiSearch = async (query, page, limit) => {
    try {
        const response = await api.get(`/users/${query}?page=${page}&limit=${limit}`)
        return response
    } catch (error) {
        console.error("shit happened trying to fetch users")
        return error.response
    }

}

export const fetchUserfromAPI = async (username) => {
    try {
        const response = await api.get(`/profile/${username}`)
        return response
    } catch (error) {
        return error.response
    }
}


export const fetchRecentChatsfromAPI = async (userId) => {
    try {
        const response = await api.get(`/messages/getRecentChats/${userId}`)
        return response
    } catch (error) {
        console.error("Error occured while fetching recent chats",error)
        return error.response
    }
}
