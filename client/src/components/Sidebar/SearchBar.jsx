import React, { useRef } from 'react'
import styles from './sidebar.module.css'
import { IoIosCloseCircle } from "react-icons/io";
import { CiSearch } from "react-icons/ci";


const SearchBar = ({ searchInputRef, searchQuery, setSearchQuery }) => {

    return (
        <div className={styles.searchBarWrapper}>
            <CiSearch size={20} color='#bbb9b9ff' className={styles.svg} />

            <input ref={searchInputRef} onChange={e => setSearchQuery(e.target.value)} value={searchQuery} placeholder='Search' type="text" className={styles.searchBar} />

            <button onClick={() => setSearchQuery("")} className={styles.svg}>
                <IoIosCloseCircle size={20} color='#bbb9b9ff' aria-label='clear-search' />
            </button>
        </div>
    )
}

export default SearchBar
