import React, { useEffect, useRef, useState } from 'react'
import styles from './mainLayout.module.css'
import Sidebar from '../components/Sidebar/Sidebar'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import Footer from "../components/Footer/Footer"
import { Toaster } from 'react-hot-toast'
import BottomNavbar from '../components/BottomNavbar/BottomNavbar'
import TopNavbar from '../components/TopNavbar/TopNavbar'

const MainLayout = () => {
    const [myPosts, setMyPosts] = useState([])
    const createNewPostRef = useRef()
    const showCreateNewPostDialog = () => {
        createNewPostRef.current.style.display = "flex"
    }
    const location = useLocation()
    const [showFooter, setShowFooter] = useState(true)
    useEffect(() => {
        if (location.pathname.startsWith("/messages")) {
            setShowFooter(false)
        }
    }, [location.pathname])




    return (

        <>
            <TopNavbar />
            <div className={styles.mainLayoutWrapper}>
                <Sidebar setMyPosts={setMyPosts} createNewPostRef={createNewPostRef} showCreateNewPostDialog={showCreateNewPostDialog} />
                <main className={styles.main}>
                    <Outlet context={{ myPosts, showCreateNewPostDialog }} />
                    {showFooter && <Footer />}
                </main>
            </div>
            <BottomNavbar />
            <Toaster position='top-right' />
        </>
    )
}

export default MainLayout
