import React, { useRef, useState } from 'react'
import styles from './sidebar.module.css'
import { Link, NavLink } from 'react-router-dom'
import { GoHomeFill } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { MdOutlineExplore } from "react-icons/md";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { FaRegHeart } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { BsPersonCircle } from "react-icons/bs";
import clsx from 'clsx'
import CreateNewPost from './CreateNewPost';
import SearchMenu from './SearchMenu';
import { useAuth } from '../../hooks/useAuth';
import { Cog, HardHat } from 'lucide-react'

const Sidebar = ({ setMyPosts, createNewPostRef, showCreateNewPostDialog }) => {

    const [isOpen, setIsOpen] = useState(false)
    const searchInputRef = useRef()
    const { user } = useAuth()




    return (
        <div className={clsx(styles.sidebarWrapper, isOpen ? styles.openSearchMenu : "")}>

            <CreateNewPost setMyPosts={setMyPosts} createNewPostRef={createNewPostRef} showCreateNewPostDialog={showCreateNewPostDialog} />

            <div className={styles.sidebar}>

                <NavLink to={"/"} className={styles.logoWrapper}>
                    <p className={styles.wordmark}>Lushiro</p>
                    <img src="/cool.png" alt="lushiroLogo" className={styles.lushiroLogo} />
                </NavLink>

                <ul className={styles.list}>
                    <li className={styles.listItem}>
                        <SidebarNavLink to={"/"}>
                            <div>
                                <GoHomeFill size={28} />
                            </div>
                            <span className={styles.listItemText}>Home</span>
                        </SidebarNavLink>
                    </li>
                    {/* SearchBtn */}

                    <li className={styles.listItem}>
                        <button className={styles.searchBtn} onMouseDown={() => {

                            setIsOpen(true)
                            setTimeout(() => {
                                searchInputRef.current.focus()
                            }, .0001);

                        }}>
                            <div>
                                <CiSearch strokeWidth={.6} size={28} />
                            </div>
                            <span className={styles.listItemText}>Search</span>
                        </button>
                    </li>

                    <li className={styles.listItem}>
                        <SidebarNavLink to={"/explore"}>
                            <div>
                                <MdOutlineExplore size={28} />
                            </div>
                            <span className={styles.listItemText}>Explore</span>
                        </SidebarNavLink>
                    </li>
                    {/* <li className={styles.listItem}>
                        <SidebarNavLink to={"/"}>
                            <div><img src="/www.instagram.com/reels.svg" alt="reelsIcon" /></div>
                            <span className={styles.listItemText}>Reels</span>
                        </SidebarNavLink>
                    </li> */}
                    <li className={styles.listItem}>
                        <SidebarNavLink to={"/pupu"}>
                            <div>
                                {/* <PiPaperPlaneTiltBold size={26} /> */}
                                <HardHat size={28} />
                            </div>
                            <span className={styles.listItemText}>Coming Soon!</span>
                        </SidebarNavLink>
                    </li>
                    <li className={styles.listItem}>
                        <div>
                            <div>
                                {/* <FaRegHeart size={24} /> */}
                                <HardHat size={28} />

                            </div>
                            <span className={styles.listItemText}>Not Coming Soon!</span>
                        </div>
                    </li>
                    <li className={styles.listItem}>
                        <button onClick={showCreateNewPostDialog}>
                            <div>
                                <FiPlus size={28} />
                            </div>
                            <span className={styles.listItemText}>Create</span>
                        </button>
                    </li>
                    <li className={styles.listItem}>
                        <SidebarNavLink to={user.username} >
                            <div>
                                {user.avatar.secureUrl ? <img src={user.avatar.secureUrl} className={styles.avatar} alt="avatar" /> : <BsPersonCircle size={28} />}
                            </div>
                            <span className={styles.listItemText}>Profile</span>
                        </SidebarNavLink>
                    </li>
                </ul>
                <div>
                    <ul className={clsx(styles.list, styles.lowerList)}>
                        <li className={styles.listItem}>
                            <button>
                                <div>
                                    <Cog size={28} />
                                </div>
                                <span className={styles.listItemText}>
                                    Settings
                                </span>
                            </button>
                        </li>
                        <li className={styles.listItem}>
                            <Link to={'/pupu'}>
                                <div>
                                    <HardHat size={28} />
                                </div>
                                <span className={styles.listItemText}>
                                    Coming Soon!
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <SearchMenu searchInputRef={searchInputRef} setIsOpen={setIsOpen} />
        </div >
    )
}

export default Sidebar





const SidebarNavLink = ({ to, children }) => {

    return (
        <NavLink to={to} className={({ isActive }) => isActive ? styles.activeListItem : ""}>
            {children}
        </NavLink>
    )
}
