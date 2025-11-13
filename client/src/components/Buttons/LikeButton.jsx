import React, { useEffect, useState } from 'react'
import styles from './buttons.module.css'
import { Heart } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import { apiToggleLike } from '../../api/api.postInteractions'

// ###DOUBT will come back and improve and learn more about this shit later
const LikeButton = ({ isLiked, setisLiked, setLikesCount, postId }) => {
    // const [isMounted, setIsMounted] = useState(false) // redundant
    const [wasToggled, setWasToggled] = useState(false) //defines if user has toggled like button from initial state
    const controls = useAnimation()


    const handleLike = async () => {
        controls.stop()
        setisLiked(prevIsLiked => {
            setLikesCount(count => prevIsLiked ? count - 1 : count + 1)
            return !prevIsLiked
        })
        setWasToggled(prevWasToggled => !prevWasToggled)


        await controls.start({
            scale: [.85, 1.2, .95, 1],
            transition: { duration: .3, ease: "easeInOut" }
        })

    }

    const rollback = () => {
        console.log("rolling back likesCount and state")
        setisLiked(prevIsLiked => {
            setLikesCount(count => prevIsLiked ? count - 1 : count + 1)
            return !prevIsLiked
        })
    }

    useEffect(() => {
        // if (!isMounted) return setIsMounted(true)

        //###DOUBT PROBLEM WITH INITIAL OR FINAL LIKED STATE LOGIC, for temp fix , i am using wasToggled to check if the isLiked state has changed from initial state, get this checked for scalability and everything
        // so if wasToggled is false , it means that isLiked was not toggled in net action 
        // this also removes the need for isMounted , as the first time , request will not go through since wasToggled is initially false

        if (!wasToggled) return // return for false
        // start timer for true
        const timer = setTimeout(async () => {
            setWasToggled(false) // since this request will now surely be completed , lets change wasToggled to false so that new Liked state is the new Default state , THIS IS VERY IMPORTANT OR LOGIC WILL BE BUGGED
            // console.debug("request sent")
            //sending latest value of isLiked infact we should say isCurrently liked
            const { status } = await apiToggleLike(postId)
            if (status == 200) return
            rollback()
        }, 500);

        return () => {
            clearTimeout(timer)
        }
    }, [isLiked])



    return (
        <motion.button animate={controls} onClick={handleLike}>
            <Heart size={28} className={isLiked ? styles.liked : ""} />
        </motion.button>
    )
}

export default LikeButton
