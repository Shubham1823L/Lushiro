import React from 'react'
import styles from './footer.module.css'
import clsx from 'clsx'
const Footer = ({ className }) => {
    const footerLinks = ["About", "Blog", "Jobs", "Help", "API", "Privacy?", "Terms?", "What?", "I won't give my Location", "Contact me for idk what"]

    return (
        <footer className={clsx(className, styles.footer)}>
            <ul className={styles.footerLinks}>
                {footerLinks.map(e => <li key={footerLinks.indexOf(e)}><a href="#">{e}</a></li>)}

                <li><a href="#">Inspired by Instagram</a></li>
                <li><a href="https://www.flaticon.com/free-stickers/nature" title="nature stickers">Nature stickers created by SoulGIE - Flaticon</a></li>

            </ul>

            <div className={styles.footerBottomWrapper}>
                <select name="language" className={styles.langSelect}>
                    <option value="0">Aur kuch aata hai?</option>
                    <option value="1">English (UK)</option>
                </select>
                <p>&copy; For being better?</p>
            </div>
        </footer>
    )
}

export default Footer
