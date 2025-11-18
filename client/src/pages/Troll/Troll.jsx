import React from 'react'
import styles from './troll.module.css'

const Troll = () => {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.heading} >Told ya!, why visit dumb links. Nothing here! LOL!!!</h1>
            <img className={styles.img} src="troll.jpg" alt="aur kitna hagna hona hai?" />
        </div>
    )
}

export default Troll
