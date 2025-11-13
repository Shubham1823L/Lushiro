import React, { useEffect, useMemo, useState } from 'react'
import styles from './home.module.css'
import { MessageCircle, Send, Bookmark, Ellipsis } from 'lucide-react'
import LikeButton from '../../components/Buttons/LikeButton';
import { useAuth } from '../../hooks/useAuth';
import CommentSection from './CommentSection';


const Post = ({ post }) => {
    const { user } = useAuth()
    const [isLiked, setIsLiked] = useState(post.likes.some(id => id == user._id))
    const [likesCount, setLikesCount] = useState(post.likesCount)

    const postAge = useMemo(() => {
        const change = new Date(Date.now()).getDate() - new Date(post.createdAt).getDate()
        if (change <= 30) return change + " d"
        if (change / 30 <= 12) return change / 30 + " w"
        else return change / 365 + " y"
    }, [])

    return (
        <article className={styles.post}>

            <div className={styles.postHeader}>
                <img src={post.author?.avatar?.secureUrl || "defaultAvatar.jpeg"} alt="avatar" />
                <h2>{post.author?.username}</h2>
                <span>{postAge}</span>
                <button className={styles.moreOptions}><Ellipsis size={20} /></button>
            </div>

            <div className={styles.postContentWrapper}>
                <img className={styles.postContent} src={post.content?.secureUrl || "defaultPost.jpg"} alt="postContent" />
            </div>

            <div className={styles.postBottom}>

                <div className={styles.postInteractions}>
                    <LikeButton postId={post._id} isLiked={isLiked} setisLiked={setIsLiked} setLikesCount={setLikesCount} />
                    <button className={styles.commentBtn}>
                        <MessageCircle />
                    </button>
                    <button>
                        <Send />
                    </button>
                    <button>
                        <Bookmark />
                    </button>
                </div>

                <span className={styles.likesCount}>{likesCount} {likesCount > 1 ? "likes" : "like"}</span>

                {/* ###COMEBACK LATER Tricky description , deal later */}
                <p className={styles.postDescription}>
                    urbanaura.live
                    Day 1 – Navjot Ahuja and pure madness Lightning up Thomso’25✨
                    .
                    .
                    .
                    .
                    📸 - @vishwasrathod.jpg @aryankhalmania_
                    .
                    .
                    .
                    #fyp #ᴇxᴘʟᴏʀᴇᴘᴀɢᴇ #explorepage #navjotahuja #navjotahujalive #iitroorkee #thomso #thomso2025 #liveshow #collegeshow #urbanaura
                </p>
                <button className={styles.viewComments}>
                    View all {post.commentsCount} comments
                </button>

                <CommentSection postId={post._id} />

            </div>

        </article >
    )
}

export default Post
