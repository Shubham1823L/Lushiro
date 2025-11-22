import React, { useEffect, useRef, useState } from 'react'
import styles from './mainLayout.module.css'
import Sidebar from '../components/Sidebar/Sidebar'
import { Outlet, useParams } from 'react-router-dom'
import Footer from "../components/Footer/Footer"
import clsx from 'clsx'
import { Toaster } from 'react-hot-toast'
import BottomNavbar from '../components/BottomNavbar/BottomNavbar'
import TopNavbar from '../components/TopNavbar/TopNavbar'

const MainLayout = () => {
    const params = useParams()
    const [myPosts, setMyPosts] = useState([])
    const createNewPostRef = useRef()

    const showCreateNewPostDialog = () => {
        createNewPostRef.current.style.display = "flex"
    }




    return (

        <>
            <TopNavbar />
            <div className={styles.mainLayoutWrapper}>
                <Sidebar setMyPosts={setMyPosts} createNewPostRef={createNewPostRef} showCreateNewPostDialog={showCreateNewPostDialog} />
                <main className={clsx(styles.main, params.username && styles.smallChildrenWidth)}>
                    <Outlet context={{ myPosts, showCreateNewPostDialog }} />
                    <Footer />
                </main>
            </div>
            <BottomNavbar />
            <Toaster position='top-right' />
        </>
    )
}

export default MainLayout
