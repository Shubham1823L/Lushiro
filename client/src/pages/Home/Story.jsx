import React from 'react'
import styles from './home.module.css'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

const Story = () => {
    return (
        <Link className={styles.storyWrapper}>
            <div className={clsx(styles.story)}>
                <img src='defaultAvatar.jpeg' className={styles.storyAvatar} />
            </div>
            <span>username</span>
        </Link>
    )
}

export default Story
