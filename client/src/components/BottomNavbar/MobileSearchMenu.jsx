import React, { useEffect, useRef, useState } from 'react'
import styles from './bottomNavbar.module.css'
import SearchBar from '../Sidebar/SearchBar'
import SearchResults from '../Sidebar/SearchResults'

const MobileSearchMenu = ({ searchMenuRef, setIsOpen }) => {
    const searchInputRef = useRef()
    // const [recentUsers, setRecentUsers] = useState(JSON.parse(localStorage.getItem('recentUsers')) || [])
    // const [searchedUsers, setSearchedUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [clicked, setClicked] = useState(false)
    useEffect(() => {
        setIsOpen(false)

    }, [clicked])


    return (
        <div ref={searchMenuRef} tabIndex={0} className={styles.searchMenuWrapper}>
            <SearchBar searchInputRef={searchInputRef} setSearchQuery={setSearchQuery} searchQuery={searchQuery} />

            <SearchResults searchQuery={searchQuery} setClicked={setClicked} />
        </div>
    )
}

export default MobileSearchMenu
