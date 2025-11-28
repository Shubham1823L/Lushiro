import React, { useEffect, useState } from 'react'
import { callApiSearch } from '../../api/userQuery';
import styles from './messages.module.css'
import { Link } from 'react-router-dom';

const SearchResults = ({ searchQuery, setSearchQuery }) => {
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


    return (
        <div className={styles.searchResults}>
            {searchedUsers.map(user => {
                return (
                    <Link onClick={() => setSearchQuery("")} key={user._id} to={`${user.username}`} className={styles.searchResult} >
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
        </div>
    )
}

export default SearchResults
