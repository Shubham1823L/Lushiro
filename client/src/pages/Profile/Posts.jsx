import React, { useEffect, useState } from 'react'
import styles from './profile.module.css'
import { useOutletContext } from 'react-router-dom'
import { fetchMyPosts } from '../../api/posts'
import { FiCamera } from "react-icons/fi";
import { MessageCircle } from 'lucide-react'
import { format, quality } from '@cloudinary/url-gen/actions/delivery'
import { auto as fAuto } from '@cloudinary/url-gen/qualifiers/format'
import { auto as qAuto } from '@cloudinary/url-gen/qualifiers/quality'
import cld from '../../libs/cloudinary';
import { fill } from '@cloudinary/url-gen/actions/resize';


const Posts = () => {
    const { showCreateNewPostDialog, username, isAdmin } = useOutletContext()
    const [allPosts, setAllPosts] = useState([])
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        (async () => {
            const { status, data: { data } } = await fetchMyPosts(username, 1, 20)
            if (status == 500) return console.log("Something went wrong on our side getting your posts")
            if (status == 200) {
                setAllPosts(prevPosts => [...prevPosts, ...data.posts])
            }
            setLoading(false)
        })()

    }, [username])






    return (
        <>
            {/* ###FIX loading also shows emptyPostsPlaceholder which causes flicker type bug */}
            {loading || allPosts.length == 0 ?
                <div className={styles.emptyPostsPlaceholder}>
                    <div className={styles.camIconContainer}>
                        <FiCamera size={36} strokeWidth={.8} />
                    </div>
                    {isAdmin ?
                        <>
                            <h3>Share photos</h3>
                            <p>When you share photos, they will appear on your profile.</p>
                            <button onClick={showCreateNewPostDialog}>Share your first photo</button>
                        </> :
                        <h3>No posts yet</h3>
                    }
                </div>
                :
                <div className={styles.posts} >
                    {allPosts.map(post => {
                        const desktopUrl = cld.image(post.content.publicId).resize(fill().width(1200)).delivery(format(fAuto())).delivery(quality(qAuto())).toURL()
                        const mobileUrl = cld.image(post.content.publicId).resize(fill().width(600)).delivery(format(fAuto())).delivery(quality(qAuto())).toURL()
                        const tabletUrl = cld.image(post.content.publicId).resize(fill().width(800)).delivery(format(fAuto())).delivery(quality(qAuto())).toURL()
                        return (
                            <div className={styles.post} key={post._id}>
                                <div className={styles.postCommentsPreview}>
                                    <MessageCircle />
                                    {post.commentsCount}
                                </div>
                                {console.log(post.content.publicId)}
                                <picture>
                                    <source media="(max-width:480px)" srcSet={mobileUrl} />
                                    <source media="(max-width:768px)" srcSet={tabletUrl} />
                                    <img src={desktopUrl} />
                                </picture>
                            </div>
                        )
                    })}
                </div>}
        </>
    )
}

export default Posts
