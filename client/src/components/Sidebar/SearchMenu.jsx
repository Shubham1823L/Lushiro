import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from './sidebar.module.css'
import { callApiSearch } from '../../api/userQuery';
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';


const SearchMenu = ({ setIsOpen, searchInputRef }) => {
    const searchMenuRef = useRef()

    const [searchQuery, setSearchQuery] = useState("")
    const [clicked, setClicked] = useState(false)




    useEffect(() => {
        setIsOpen(false)

        //call db to refresh recent users' data

    }, [clicked])


    return (
        <div ref={searchMenuRef} tabIndex="-1" className={styles.searchMenu} onBlur={(e) => {
            if (e.currentTarget.contains(e.relatedTarget)) return
            setIsOpen(false)
        }}>
            <div className={styles.searchHeader}>
                <h2>Search</h2>
                <SearchBar setSearchQuery={setSearchQuery} searchInputRef={searchInputRef} searchQuery={searchQuery} />
            </div>


            <SearchResults searchQuery={searchQuery} setClicked={setClicked} />


        </div>
    )
}

export default SearchMenu
