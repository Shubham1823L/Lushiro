import { api } from "./axios";


export const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append("newPost", file)

    try {
        const response = await api.post('/upload/newPost', formData)
        return response
    } catch (error) {
        console.error("An error occured while uploading the file")
        return error.response
    }

}

export const publishNewPost = async (data) => {
    try {
        console.log()
        const response = await api.post('/posts', data)
        return response
    } catch (error) {
        console.error("An error occured publishing the post")
        return error.response
    }
}


export const fetchMyPosts = async (username,page, limit) => {
    try {
        const response = await api.get(`/posts/${username}?page=${page}&limit=${limit}`)
        return response
    } catch (error) {
        console.error("An error occurred while retreiving user's posts")
        return error.response
    }
}

export const apiFetchFeed = async (page,limit) => {
    try {
        const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`)
        return response
    } catch (error) {
        console.error("An error occured while trying to fetch user's feed")
        return error.response
    }
}

