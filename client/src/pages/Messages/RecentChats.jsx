import React, { useEffect, useState } from 'react'
import styles from './messages.module.css'
import clsx from 'clsx'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import { fetchRecentChatsfromAPI } from '../../api/userQuery'
import cld from '../../libs/cloudinary'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { format, quality } from '@cloudinary/url-gen/actions/delivery'
import { auto as fAuto } from '@cloudinary/url-gen/qualifiers/format'
import { auto as qAuto } from '@cloudinary/url-gen/qualifiers/quality'

const RecentChats = () => {
    const { user } = useAuth()
    const [recentChats, setRecentChats] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        (async () => {
            const { status, data } = await fetchRecentChatsfromAPI(user._id)
            if (status == 500) return console.error("Internal Error")
            if (status == 200) {
                setRecentChats(data.data.chats)
            }
        })().then(() => {
            setLoading(false)
        })
    }, [])
    return (
        <div className={clsx(styles.recentChats, styles.searchResults)}>
            {!loading &&
                recentChats.map(chat => {
                    const friendId = chat.roomId.split("|").filter(id => id != user._id)[0]
                    const publicId = friendId == chat.senderId ? chat.sender.avatar.publicId : chat.receiver.avatar.publicId
                    const username = friendId == chat.senderId ? chat.sender.username : chat.receiver.username
                    const myAvatar = publicId ? cld.image(publicId).resize(fill().width(300)).delivery(format(fAuto())).delivery(quality(qAuto())).toURL() : "defaultAvatar.jpeg"
                    return (
                        <Link key={user._id} to={`${username}`} className={styles.searchResult} >
                            <div>
                                <img src={myAvatar} alt="useravatar" />
                            </div>

                            <div className={styles.searchedUserData}>
                                <p className={styles.oneLineText}>{chat.sender.fullName}</p>
                                <div className={clsx(styles.extraUserDetails, styles.oneLineText)}>
                                    <p className={styles.oneLineText}>{chat.text}</p>
                                </div>
                            </div>
                        </Link>
                    )
                })
            }
        </div >
    )
}

export default RecentChats
