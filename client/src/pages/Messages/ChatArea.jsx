import React, { useEffect, useRef, useState } from 'react'
import styles from './messages.module.css'
import { useParams } from 'react-router-dom'
import { fetchUserfromAPI } from '../../api/userQuery'
import { ChevronDown, Info, SendHorizontal, Smile } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../hooks/useAuth'
import { fetchMessagesfromAPI } from '../../api/messageQuery'
import genImage from '../../utils/cldImage'
import { socket } from '../../utils/socket'


const ChatArea = () => {

    const { username } = useParams()
    const { user } = useAuth()
    const [receiver, setReceiver] = useState(null)
    const [loading, setLoading] = useState(true)
    const [roomId, setRoomId] = useState("")

    const [scrollHeight, setScrollHeight] = useState(null)
    const [lastMessage, setLastMessage] = useState("")
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const messagesRef = useRef()
    const [unReadCounter, setUnReadCounter] = useState(0)
    const lastMessageRef = useRef()
    const [isIntersecting, setIsIntersecting] = useState(true)

    const observer = new IntersectionObserver((e) => {
        if (e[0].isIntersecting) {
            setIsIntersecting(true)
            setUnReadCounter(0)
        }
        else setIsIntersecting(false)
    })


    useEffect(() => {

        const container = messagesRef.current
        if (!container) return

        setScrollHeight(container.scrollHeight)
        const range = Math.abs(Math.round(container.scrollTop) - (scrollHeight - container.clientHeight))
        if (lastMessage.senderId != user._id && range > 2) return setUnReadCounter(count => count + 1)

        scrollToBottom()


    }, [lastMessage])


    useEffect(() => {
        if (!roomId) return
        (async () => {
            const { status, data } = await fetchMessagesfromAPI(roomId)
            if (status == 500) return console.error("internal error trying to fetch initial messages")
            if (status == 200) {
                setMessages(data.data.messages)
            }

        })().then(() => setLoading(false))


    }, [roomId])

    useEffect(() => {
        if (!scrollHeight && messagesRef.current) {
            setScrollHeight(messagesRef.current.scrollHeight)
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
        if (lastMessageRef.current) {
            observer.observe(lastMessageRef.current)
        }

    }, [messages])

    const scrollToBottom = () => {
        setUnReadCounter(0)
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }

    useEffect(() => {
        if (!username) return
        (async () => {
            const { status, data } = await fetchUserfromAPI(username)

            if (status == 500) return console.error("Error fetching user data")
            if (status == 200) {
                setReceiver(data.data.user)
                const sortedIds = [user._id, data.data.user._id].sort()
                const roomId = sortedIds.join("|")
                setRoomId(roomId)
                joinRoom(roomId)
            }
        })()


    }, [username])

    const sendMessage = async () => {
        if (!message) return
        socket.emit("SEND_MESSAGE", {
            message, roomId, userId: user._id
        }, (res) => {
            if (!res.success) return console.log("Error trying to send message")
            setMessages(prev => [...prev, res.message])
            setLastMessage(res.message)
        })

        setMessage("")
    }

    useEffect(() => {
        socket.on("RECEIVE_MESSAGE", (data) => {
            setMessages(prev => [...prev, data.message])
            setLastMessage(data.message)
        })

    }, [socket])



    const joinRoom = (roomId) => {
        if (!roomId) return console.log("Empty/Invalid RoomId")
        socket.emit("JOIN_ROOM", {
            roomId, userId: user._id
        })
    }


    return (
        <div className={styles.chatArea}>
            {!loading && <>
                <div className={styles.chatHeader}>
                    <div>
                        <img src={receiver.avatar.publicId ? genImage(receiver.avatar.publicId, 200).toURL() : "defaultAvatar.jpeg"} alt="avatar" />
                        {receiver.fullName}
                    </div>
                    <Info size={"2rem"} />

                </div>
                <div className={styles.hero}>

                    <div ref={messagesRef} className={styles.messages}>

                        {
                            messages.map((msg, i, arr) => {
                                return (
                                    <div ref={arr.length - 1 == i ? lastMessageRef : null} key={msg._id} className={clsx(styles.message, msg.senderId == user._id ? styles.sentMessage : styles.receivedMessage)}>{msg.text}</div>
                                )
                            })
                        }

                    </div>

                    <div className={styles.messageInputWrapper}>
                        <input onKeyDown={(e) => e.key == "Enter" && sendMessage()} value={message} onChange={(e) => setMessage(e.target.value)} name='messageInput' placeholder='Type your message' type="text" className={styles.messageInput} />
                        <button>
                            <Smile size={28} />
                        </button>
                        <button onClick={sendMessage}>
                            <SendHorizontal size={28} />
                        </button>
                        <button className={clsx(styles.scrollToBottomBtn, isIntersecting && styles.hideBtn)} onClick={scrollToBottom}>
                            {unReadCounter > 0 && <div className={styles.unReadCounter}>{unReadCounter}</div>}
                            <ChevronDown size={28} color='white' />
                        </button>

                    </div>


                </div>

            </>}
        </div >
    )
}

export default ChatArea
