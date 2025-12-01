import { useEffect, useState } from 'react'
import { AuthContext } from './../hooks/useAuth'
import LoadingPage from '../pages/Extras/LoadingPage'
import { unAuthApi } from '../api/axios'
import { socket } from '../utils/socket'


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const refreshSession = async () => {
            try {
                const response = await unAuthApi.post('/auth/refresh')
                const { data: { accessToken, user } } = response.data
                setToken(accessToken)
                setUser(user)
                socket.connect()

            } catch (error) {
                if (error.response.status === 401) console.log("New Session")
                // return toast("Something went wrong, please refresh")
            }


        }
        refreshSession().then(() => {
            setLoading(false)
        })
        return () => {
            socket.disconnect()
        }
    }, [])

    const updateToken = (token) => setToken(token)
    const updateUser = (user) => setUser(user)

    const value = { user, updateUser, token, updateToken }
    return (
        <>
            {
                loading ? <LoadingPage /> :
                    <AuthContext.Provider value={value}>
                        {children}
                    </AuthContext.Provider>
            }
        </>

    )
}


