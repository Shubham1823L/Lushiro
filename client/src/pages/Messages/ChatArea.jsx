import React, { useEffect, useState } from 'react'
import styles from './messages.module.css'
import { Link, useParams } from 'react-router-dom'
import { fetchUserfromAPI } from '../../api/userQuery'
import { Info, SendHorizontal, Smile } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import clsx from 'clsx'

const ChatArea = () => {
    const { username } = useParams()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            const { status, data } = await fetchUserfromAPI(username)

            if (status == 500) return console.error("Error fetching user data")
            if (status == 200) {
                setUser(data.data.user)
                console.log(data.data.user)
            }
        })().then(() => setLoading(false))



    }, [username])


    return (
        <div className={styles.chatArea}>
            {!loading && <>
                <div className={styles.chatHeader}>
                    <div>
                        <img src={user.avatar?.secureUrl || "defaultAvatar.jpeg"} alt="" />
                        {user.fullName}
                    </div>
                    <Info size={"2rem"} />

                </div>
                <div className={styles.hero}>

                    <div className={styles.messages}>
                        
                        <div className={clsx(styles.message,styles.receivedMessage)}>
                            lorem19
                        </div>
                        <div className={clsx(styles.message,styles.sentMessage)}>
                            Yo!
                        </div>
                    </div>

                    <div className={styles.messageInputWrapper}>
                        <input name='messageInput' placeholder='Type your message' type="text" className={styles.messageInput} />
                        <Smile size={28} />
                        <SendHorizontal size={28} />
                    </div>

                </div>
            </>}
        </div>
    )
}

export default ChatArea
