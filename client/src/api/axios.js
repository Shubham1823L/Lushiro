import axios from 'axios'
import { useAuth } from '../hooks/useAuth'
import mitt from 'mitt'
const baseUrl = import.meta.env.VITE_API_BASE_URL

export const apiEvents = mitt()


export const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true
})


export const unAuthApi = axios.create({
    baseURL:baseUrl,
    withCredentials:true
})





export const useAxiosInterceptors = () => {

    const { token, updateToken } = useAuth()
    if (!token) return //###DOUBT removing this line of if statement will cause chaos again when AUTHENTICATING , not on subsequent refreshes
    api.interceptors.request.use(config => {
        apiEvents.emit('start')
        config.headers['authorization'] = token && `Bearer ${token}`
        return config
    })

    api.interceptors.response.use(res => {
        apiEvents.emit('end')
        return res
    },
        async error => {
            apiEvents.emit('end')
            const originalRequest = error.config
            console.log(error)

            // TokenExpiredError is sufficent to say that error.response?.status == 401
            // So if token is expired then we retry by refreshing token ONCE, therefore we add a new key-value pair to the originalRequest i.e. hasRetried , which if is false(undefined), we try otherwise after retrying once , we set it to true therefore if() goes false and we dont retry
            if (error.response?.data?.name == "TokenExpiredError" && !originalRequest.hasRetried) {
                console.warn("Token Expired , refreshing token now...")

                originalRequest.hasRetried = true
                try {
                    const response = await unAuthApi.post(`/auth/refresh`)
                    const newToken = response.data.data?.accessToken
                    updateToken(newToken)

                    originalRequest.headers['authorization'] = newToken && `Bearer ${newToken}`
                    return api(originalRequest)
                } catch (error) {
                    console.error("Token refresh Failed")
                }

            }
            else if (error.response?.data.name == "JsonWebTokenError") {
                console.warn("Invalid Session, user must re-login")
            }

            return Promise.reject(error, "double wow")

        })
}