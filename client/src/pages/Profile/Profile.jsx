import React, { useEffect, useState } from 'react'
import styles from './profile.module.css'
import { NavLink, Outlet, useOutletContext, useParams } from 'react-router-dom'
import { FiPlus } from "react-icons/fi";
import { GrGrid } from "react-icons/gr";
import { RiBookmarkLine } from "react-icons/ri";
import { TbUserSquare } from "react-icons/tb";
import clsx from 'clsx';
import Avatar from './Avatar';
import { fetchUserfromAPI } from '../../api/userQuery';
import { useAuth } from '../../hooks/useAuth';
import LoadingPage from '../Extras/LoadingPage';
import FollowBtn from './FollowBtn';
import { Cog } from 'lucide-react'

const Profile = () => {
    const params = useParams()
    const { myPosts, showCreateNewPostDialog } = useOutletContext()
    const [loading, setLoading] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)

    const [followersCount, setFollowersCount] = useState(500)

    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const currentUser = useAuth().user


    useEffect(() => {
        setLoading(true);

        (async () => {
            const { status, data } = await fetchUserfromAPI(params.username)
            if (status != 200) return console.error("error")

            const { user } = data.data
            // ###FIX DOUBT, redirection for unknown user not working
            setUser(user)

            //Sync initial followersCount value
            setFollowersCount(user.followersCount)

            //Sync initial isFollowing value
            if (currentUser.username == user.username) return //no need to check if user is following himself
            if (currentUser.following.some(id => id == user._id)) return setIsFollowing(true)

            //###DOUBT currentUser causes refetching 
        })().then(() => setLoading(false))
    }, [params.username, myPosts, currentUser.username])

    useEffect(() => {
        if (currentUser.username == params.username) setIsAdmin(true)
        else setIsAdmin(false)
    }, [params, currentUser.username])


    return (
        <>
            {!loading && <div className={styles.wrapper}>

                <div className={styles.hero}>
                    <div className={styles.profile}>
                        <Avatar isAdmin={isAdmin} avatar={user.avatar} />
                        <div className={styles.profileData}>
                            <div className={styles.profileDataHeader}>
                                <span>{user.username}</span>
                                <div className={styles.profileRelatedBtns}>
                                    {isAdmin ? <button className={styles.darkBtnBase}>
                                        Edit Profile
                                    </button> :
                                        <FollowBtn setFollowersCount={setFollowersCount} username={user.username} isFollowing={isFollowing} setIsFollowing={setIsFollowing} />
                                    }
                                    <button className={styles.darkBtnBase}>
                                        Coming Soon!
                                    </button>
                                    <button className={styles.settings}>
                                        <Cog size={24} />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.metricsCount}>
                                <span>
                                    <span>{user.posts.length}</span>
                                    <span>{user.posts.length > 1 ? "posts" : "post"}</span>
                                </span>
                                <span>
                                    <span>{followersCount}</span>
                                    <span>{followersCount > 1 ? "followers" : "follower"}</span>
                                </span>
                                <span>
                                    <span>{user.followingCount}</span>
                                    <span>following</span>
                                </span>
                            </div>
                            <div className={styles.fullName}>
                                {user.fullName}
                            </div>
                        </div>

                    </div>
                    <div className={styles.heroBottom}>
                        <div>
                            <div className={styles.createNewStoryWrapper}>
                                <button className={styles.createNewStory}>
                                    <FiPlus size={56} strokeWidth={1.5} color='grey' />
                                </button>
                            </div>
                            New
                        </div>
                        <div className={styles.metricsCountMobile}>
                            <span>
                                <span>{user.posts.length}</span>
                                <span>{user.posts.length > 1 ? "posts" : "post"}</span>
                            </span>
                            <span>
                                <span>{followersCount}</span>
                                <span>{followersCount > 1 ? "followers" : "follower"}</span>
                            </span>
                            <span>
                                <span>{user.followingCount}</span>
                                <span>following</span>
                            </span>
                        </div>

                    </div>
                </div>


                <div className={styles.mainContentWrapper}>
                    <div className={styles.mainContentNav}>
                        <div className={!isAdmin ? styles.notAdmin : ""}>
                            <NavLink to={""} end className={({ isActive }) => clsx(isActive && styles.selected, styles.navLink)} >
                                <GrGrid size={20} />
                            </NavLink>
                            {isAdmin && <NavLink to={"saved"} className={({ isActive }) => clsx(isActive && styles.selected, styles.navLink)}>
                                <RiBookmarkLine size={24} />
                            </NavLink>}
                            <NavLink to={"tagged"} className={({ isActive }) => clsx(isActive && styles.selected, styles.navLink)}>
                                <TbUserSquare size={24} />
                            </NavLink>
                        </div>

                    </div>
                    <div className={styles.mainContent}>
                        <Outlet context={{ showCreateNewPostDialog, username: params.username, isAdmin }} />
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Profile
