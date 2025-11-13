import React, { useEffect, useState } from 'react'
import styles from './profile.module.css'
import { useOutletContext } from 'react-router-dom'
import { fetchMyPosts } from '../../api/posts'
import { FiCamera } from "react-icons/fi";
import { MessageCircle } from 'lucide-react'


const Posts = () => {
    const { showCreateNewPostDialog, username, isAdmin } = useOutletContext()
    const [allPosts, setAllPosts] = useState([])
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        (async () => {
            const { status, data:{data} } = await fetchMyPosts(username, 1, 20)
            if (status == 500) return console.log("Something went wrong on our side getting your posts")
            if (status == 200) {
                setAllPosts(prevPosts => [...prevPosts, ...data.posts])
            }
            setLoading(false)
        })()

    }, [username])



    return (
        <>
            {loading || allPosts.length == 0 ? <div className={styles.emptyPostsPlaceholder}>
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
                        return (
                            <div className={styles.post} key={post._id}>
                                <div className={styles.postCommentsPreview}>
                                    <MessageCircle />
                                    {post.commentsCount}
                                </div>
                                <img src={post.content.secureUrl} alt={post._id} />
                            </div>
                        )
                    })}
                </div>}
        </>
    )
}

export default Posts
