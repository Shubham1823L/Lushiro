import React, { useEffect, useState } from 'react'
import styles from './messages.module.css'
import SearchBar from '../../components/Sidebar/SearchBar'
import SearchResults from './SearchResults.jsx'
import { Outlet } from 'react-router-dom'
import RecentChats from './RecentChats.jsx'



const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchArea}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {searchQuery ?
          <SearchResults searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> :
          <RecentChats />
        }
      </div>

      <Outlet />


    </div>
  )
}

export default Messages
