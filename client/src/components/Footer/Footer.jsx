import React from 'react'
import styles from './footer.module.css'
import clsx from 'clsx'
const Footer = ({className}) => {
    const footerLinks = ["Meta", "About", "Blog", "Jobs", "Help", "API", "Privacy", "Terms", "Locations", "Instagram Lite", "Meta AI", "Meta AI articles", "Threads", "Contact uploading and non-users", "Meta verified"]

    return (
        <footer className={clsx(className,styles.footer)}>
            <ul className={styles.footerLinks}>
                {footerLinks.map(e => <li key={footerLinks.indexOf(e)}><a href="#">{e}</a></li>)}

            </ul>

            <div className={styles.footerBottomWrapper}>
                <select name="language" className={styles.langSelect}>
                    <option value="0">English (UK)</option>
                    <option value="1">English</option>
                </select>
                <p>&copy; 2025 Instagram From Meta</p>
            </div>
        </footer>
    )
}

export default Footer
