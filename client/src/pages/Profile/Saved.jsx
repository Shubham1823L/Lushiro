import React from 'react'
import styles from './profile.module.css'
import { RiBookmarkLine } from 'react-icons/ri'

const Saved = () => {
  return (
    <div className={styles.emptyPostsPlaceholder}>
      <div className={styles.camIconContainer}>
        <RiBookmarkLine size={36} />
      </div>
      <h3>Posts you saved</h3>
      <p>When you save posts, they'll appear here.</p>
    </div>
  )
}

export default Saved
