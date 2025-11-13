import logger from "../../../server/services/logger";
import { api } from "./axios";

export const apiToggleLike = async (postId) => {
    try {
        const response = await api.post(`/postInteractions/${postId}/like`)
        return response
    } catch (error) {
        logger(error, "Error toggling like")
        return error.response
    }
}

export const apiCreateComment = async (postId, comment) => {
    try {
        const response = await api.post(`/postInteractions/${postId}/comment`, { text: comment })
        return response
    } catch (error) {
        logger(error, "Error commenting, comment was:", comment, postId)
        return error.response
    }
}
