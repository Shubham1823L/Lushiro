import React from 'react'
import styles from './loading.module.css'

const LoadingPage = () => {
    return (
        <>
            <div className={styles.loadingPageWrapper}>
                <main className={styles.main}>
                    <img src="/01 Static Glyph/01 Gradient Glyph/Instagram_Glyph_Gradient.svg" alt="instaLogo" className={styles.instaLogo} />
                </main>
                <footer className={styles.footer}>
                    <p>from</p>
                    <img src="/Meta.png" alt="metaLogo" className={styles.metaLogo} />
                </footer>
            </div>
        </>

    )
}

export default LoadingPage
