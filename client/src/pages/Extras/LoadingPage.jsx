import React from 'react'
import styles from './loading.module.css'

const LoadingPage = () => {
    return (
        <>
            <div className={styles.loadingPageWrapper}>
                <main className={styles.main}>
                    <img src="/eat.png" alt="lushrioLogo" className={styles.lushiroLogo} />
                </main>
                <footer className={styles.footer}>
                    <p>by</p>
                   <p className={styles.shubham}>Shubham</p>
                </footer>
            </div>
        </>

    )
}

export default LoadingPage
