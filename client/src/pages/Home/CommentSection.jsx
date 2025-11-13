import React, { useState } from 'react'
import styles from './home.module.css'
import { apiCreateComment } from '../../api/api.postInteractions'
import { useAuth } from '../../hooks/useAuth'
import Spinner from '../../components/Extras/Spinner'
import { HiOutlineEmojiHappy } from "react-icons/hi";


const CommentSection = ({ postId }) => {
    const { user } = useAuth()
    const [comment, setComment] = useState("")
    const [myRecentComments, setMyRecentComments] = useState([])
    const [commenting, setCommenting] = useState(false)

    const handlePostComment = async () => {
        setCommenting(true)

        const { status, data:{data} } = await apiCreateComment(postId, comment)

        setCommenting(false)
        setComment("")
        if (status == 201) return setMyRecentComments(prev => [...prev, data.comment])
        if (status == 500) return console.warn("Internal Server Error,your comment could not pe published")

        return console.error("An unexpected error occurred")
    }
    return (
        <>
            {
                myRecentComments.length != 0 && < div className={styles.myRecentComments}>
                    {myRecentComments.map(myComment => <div key={myComment._id} className={styles.myRecentComment} >
                        <span>{user.username}</span>
                        <span>{myComment.text}</span>
                    </div>)}
                </div>

            }

            {commenting ? <Spinner /> : <div className={styles.commentInputWrapper}>
                <input onKeyDown={(e) => e.key === "Enter" && handlePostComment()} value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Add a comment...' type="text" className={styles.commentInput} />
                {comment && <button onClick={handlePostComment} className={styles.postBtn}>
                    Post
                </button>}
                <button className={styles.emojiBtn}>
                    <HiOutlineEmojiHappy size={18} color='#A8A8A8' />
                </button>
            </div>}
        </>
    )
}

export default CommentSection
