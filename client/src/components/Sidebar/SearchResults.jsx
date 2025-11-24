import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import styles from './sidebar.module.css'
import { callApiSearch } from '../../api/userQuery'
import { Link } from 'react-router-dom'

const SearchResults = ({ searchQuery, setClicked }) => {
    const [recentUsers, setRecentUsers] = useState(JSON.parse(localStorage.getItem('recentUsers')) || [])
    const [searchedUsers, setSearchedUsers] = useState([])

    useEffect(() => {
        const timer = setTimeout(() => {

            if (searchQuery) {
                (async () => {
                    const response = await callApiSearch(searchQuery, 1, 5)
                    if (response.status == 500) return console.log("Server side bad")
                    if (response.status == 200) {
                        const users = response.data.data.users
                        setSearchedUsers(users)
                    }
                })()
            }


        }, 400);


        return () => {
            clearTimeout(timer)
        }
    }, [searchQuery])

    const updateRecentUsersList = (user) => {

        setClicked(prev => !prev)
        if (recentUsers.some(e => e._id == user._id)) {
            const newUsers = [...recentUsers]
            const finalUsers = newUsers.filter(e => e._id != user._id)

            finalUsers.unshift(user)
            //###DOUBT won't work if i don't copy finalUsers and just setState(finalUsers) DIRECTLY. ISSUE HAPPENS, ONLY FOR RECENT LIST CLICKING not normal search list clicks
            setRecentUsers([...finalUsers])
            localStorage.setItem('recentUsers', JSON.stringify(finalUsers.splice(0, 15)))

        }
        else {
            setRecentUsers(prev => [user, ...prev].splice(0, 15))
            localStorage.setItem('recentUsers', JSON.stringify([user, ...recentUsers].splice(0, 15)))
        }
    }
    return (
        <div className={clsx(styles.searchResultsWrapper, !searchQuery ? styles.emptySearchQuery : "")}>
            {!searchQuery && <div className={styles.searchResultsHeader}>
                <span>Recent</span>
                <button onClick={() => {
                    localStorage.setItem('recentUsers', JSON.stringify([]))
                    setRecentUsers([])
                }}>Clear All</button>
            </div>}

            {searchQuery ?
                //Search query is not empty
                (searchedUsers.length != 0 ?
                    //Search Results have something to show(not empty)
                    //Show results
                    <div className={styles.searchResults}>
                        {
                            searchedUsers.map(user => {
                                return (
                                    <Link key={user._id} onClick={() => updateRecentUsersList(user)} to={`/${user.username}`} className={styles.searchResult} >
                                        <div>
                                            <img src={user.avatar?.secureUrl || "defaultAvatar.jpeg"} alt="useravatar" />
                                        </div>

                                        <div className={styles.searchedUserData}>
                                            <p className={styles.oneLineText}>{user.username}</p>
                                            <div className={styles.extraUserDetails}>
                                                <p>{user.fullName}</p>
                                                <ul>
                                                    <li>
                                                        <span className={styles.oneLineText}>
                                                            {user.followersCount} followers
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        }


                    </div> :
                    //Search Results are empty , show no results
                    <div className={styles.noResults}>No results found.</div>
                ) :
                //Search query is empty
                (recentUsers.length != 0 ?
                    //Recently Searched Users are there , show them
                    <div className={clsx(styles.recentResults, styles.searchResults)}>
                        {recentUsers.map(user => {
                            return (
                                <Link onClick={() => updateRecentUsersList(user)} key={user._id} to={`/${user.username}`} className={styles.searchResult} >
                                    <div>
                                        <img src={user.avatar?.secureUrl || "defaultAvatar.jpeg"} alt="useravatar" />
                                    </div>

                                    <div className={styles.searchedUserData}>
                                        <p className={styles.oneLineText}>{user.username}</p>
                                        <div className={styles.extraUserDetails}>
                                            <p>{user.fullName}</p>
                                            <ul>
                                                <li>
                                                    <span className={styles.oneLineText}>
                                                        {user.followersCount} followers
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}

                    </div> :
                    <div className={styles.noResults}>
                        No recent searches.
                    </div>)
            }
        </div>
    )
}

export default SearchResults
