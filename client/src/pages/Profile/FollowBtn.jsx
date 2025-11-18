import React from 'react'
import styles from './profile.module.css'
import clsx from 'clsx'
import { apiToggleFollowUser } from '../../api/follow.api'
import { useAuth } from '../../hooks/useAuth'

const FollowBtn = ({ username, isFollowing, setIsFollowing, setFollowersCount }) => {
    const { updateUser } = useAuth()
    const toggleFollow = async () => {
        //Call ToggleFollowRoute
        const { status, data:{data} } = await apiToggleFollowUser(username, isFollowing)

        if (status == 200) {
            const increment = isFollowing ? -1 : 1
            setFollowersCount(count => count + increment)
            setIsFollowing(bool => !bool)
            //Syncing user for frontend to avoid bugs
            updateUser(data.user)
            return
        }

        //Error must have occured
        console.error(`Some error occured ${isFollowing ? "unfollowing" : "following"} the user`)
    }

    return (
        <button onClick={toggleFollow} className={clsx(!isFollowing ? styles.followBtn : "", styles.darkBtnBase)}>
            {isFollowing ? "Following" : "Follow"}
        </button>
    )
}

export default FollowBtn
