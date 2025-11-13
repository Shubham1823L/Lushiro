import { api } from "./axios"



export const apiToggleFollowUser = async (username, isFollowing) => {
    //username= usernameToBeFollowed

    try {
        const response = isFollowing ? await api.delete(`/unfollow/${username}`) : await api.post(`/follow/${username}`)
        return response
    } catch (error) {
        return error.response
    }
}
