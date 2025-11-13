import React from 'react'
import styles from './profile.module.css'
import { TbUserSquare } from "react-icons/tb";
import { useOutletContext } from 'react-router-dom'

const Tagged = () => {
  const { isAdmin } = useOutletContext()
  return (
    <div className={styles.emptyPostsPlaceholder}>
      <div className={styles.camIconContainer}>
        <TbUserSquare size={40} strokeWidth={.8} />
      </div>
      {isAdmin ?
        <>
          <h3>Photos of you</h3>
          <p>When people tag you in photos, they'll appear here.</p>

        </> :
        <h3>No photos</h3>
      }
    </div>
  )
}

export default Tagged
