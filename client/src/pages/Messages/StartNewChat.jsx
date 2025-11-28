import React from 'react'
import styles from './messages.module.css'
import { MessageCircle } from 'lucide-react'

const StartNewChat = () => {
    return (
        <div className={styles.startNewChatArea}>
            <MessageCircle size={"4rem"} />
            <p>Start a new Chat now!</p>
            <button>Chat now</button>
        </div>
    )
}

export default StartNewChat
