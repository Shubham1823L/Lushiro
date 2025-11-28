import React, { useState } from 'react'
import styles from './messages.module.css'
import clsx from 'clsx'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

const RecentChats = () => {
    const { user } = useAuth()
    return (
        <div className={clsx(styles.recentChats, styles.searchResults)}>
            {/* <Link key={user._id} to={`${user.username}`} className={styles.searchResult} >
                <div>
                    <img src={user.avatar?.secureUrl || "defaultAvatar.jpeg"} alt="useravatar" />
                </div>

                <div className={styles.searchedUserData}>
                    <p className={styles.oneLineText}>{user.fullName}</p>
                    <div className={clsx(styles.extraUserDetails,styles.oneLineText)}>
                        <p className={styles.oneLineText}>You: Good night :)sadjbadashdjdsadadjadjasbndjasnahsdjahsdjashdjasdhhadhasjdhajsdjasdhasasdhasdhasdhasdhasdhasdhasdasdhahsdhjdhd</p>
                    </div>
                </div>
            </Link> */}
        </div>
    )
}

export default RecentChats
