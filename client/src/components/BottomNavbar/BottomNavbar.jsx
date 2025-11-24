import React, { useRef, useState } from 'react'
import styles from './bottomNavbar.module.css'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { GoHomeFill } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { BsPersonCircle } from "react-icons/bs";
import MobileSearchMenu from './MobileSearchMenu';
import clsx from 'clsx'


const BottomNavbar = () => {
    const { user } = useAuth()
    const searchMenuRef = useRef()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className={styles.wrapper}>
            <ul className={styles.list}>
                <li className={styles.listItem}>
                    <Link to={"/"}>
                        <GoHomeFill size={32} />
                    </Link>
                </li>
                <li className={clsx(styles.listItem, isOpen && styles.searchItem)}>
                    <button onClick={() => setIsOpen(!isOpen)} >
                        <CiSearch strokeWidth={.6} size={32} />
                    </button>
                    <MobileSearchMenu ref={searchMenuRef} setIsOpen={setIsOpen} />

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
//cookies on phone, small icon size of nav items on phone