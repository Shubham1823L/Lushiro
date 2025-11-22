import React from 'react'
import styles from './topNavbar.module.css'
import { Heart, Cog ,Plus} from 'lucide-react'

const TopNavbar = () => {
    return (
        <nav className={styles.nav}>
            <h1 className={styles.wordmark}>Lushiro</h1>
            <Plus size={28} />
            <Heart size={28} />
            <Cog size={28} />
        </nav>
    )
}

export default TopNavbar
