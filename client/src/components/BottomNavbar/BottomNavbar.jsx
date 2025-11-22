import React from 'react'
import styles from './bottomNavbar.module.css'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { GoHomeFill } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { BsPersonCircle } from "react-icons/bs";


const BottomNavbar = () => {
    const { user } = useAuth()
    return (
        <nav className={styles.wrapper}>
            <ul className={styles.list}>
                <li className={styles.listItem}>
                    <Link to={"/"}>
                        <GoHomeFill size={32} />
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <button>
                        <CiSearch strokeWidth={.6} size={32} />
                    </button>

                </li>
                <li className={styles.listItem}>
                    <Link to={`/${user.username}`}>
                        {user.avatar.secureUrl ? <img src={user.avatar.secureUrl} className={styles.avatar} alt="avatar" /> : <BsPersonCircle size={32} />}
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default BottomNavbar
