import React, { useCallback, useEffect, useRef, useState } from 'react'
import Footer from '../../components/Footer/Footer'
import TextField from '../../components/TextField/TextField'
import EmailField from '../../components/TextField/EmailField'
import UsernameField from '../../components/TextField/UsernameField'
import PasswordField from '../../components/TextField/PasswordField'
import FullNameField from '../../components/TextField/FullNameField'
import { ImFacebook2 } from "react-icons/im";
import styles from './signup.module.css'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../../api/auth'

const Signup = () => {
    const navigate = useNavigate()

    const [valid, setValid] = useState({ email: false, password: false, username: false, fullName: false })
    const [clickable, setClickable] = useState(false)
    const toggleValid = useCallback((obj) => setValid(obj), [])
    const refs = {
        email: useRef(),
        password: useRef(),
        username: useRef(),
        fullName: useRef(),
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const values = { email: refs.email.current.value, password: refs.password.current.value, username: refs.username.current.value, fullName: refs.fullName.current.value }


        const response = await signup(values)
        const { status, data } = response

        if (status == 500) return console.error("Our bad, sorry for the incovenience")
        if (status == 409 && data.code == "USER_ALREADY_EXISTS") return console.error("User already exists")
        if (status == 409 && data.code == "USERNAME_IS_TAKEN") return console.error("Username is taken")

        //All safe,otp sent 
        navigate('/signup/verify', { replace: true })

    }

    useEffect(() => {
        if (Object.values(valid).every(e => e)) setClickable(true)
        else setClickable(false)
    }, [valid])






    return (
        <>
            <main className={styles.hero}>
                <div className={styles.formWrapper}>
                    <form className={styles.form}>
                        <h1 className={styles.wordmark}>Lushrio</h1>
                        <h2 className={styles.formHeading}>Sign up to capture and share your beautiful moments.</h2>
                        {/* <button className={clsx(styles.btnBase, styles.disabled)}>
                            <ImFacebook2 size={18} /> Log in with Facebook
                        </button> */}
                        <button onClick={(e) => {
                            e.preventDefault()
                            window.location.href = "/api/oauth/google"
                        }} className="gsi-material-button">
                            <div className="gsi-material-button-state"></div>
                            <div className="gsi-material-button-content-wrapper">
                                <div className="gsi-material-button-icon">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: "block" }}>
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                        <path fill="none" d="M0 0h48v48H0z"></path>
                                    </svg>
                                </div>
                                <span className="gsi-material-button-contents">Continue with Google</span>
                                <span style={{ display: "none" }}>Continue with Google</span>
                            </div>
                        </button>
                        <div className={styles.lineBreakWrapper}>
                            <div ></div>
                            <p>OR</p>
                            <div ></div>
                        </div>
                        <div className={styles.formFields}>
                            <EmailField toggleValid={toggleValid} ref={refs.email} autoCorrect={"email"} />
                            <PasswordField toggleValid={toggleValid} ref={refs.password} autoCorrect={"new-password"} />
                            <FullNameField toggleValid={toggleValid} ref={refs.fullName} autoCorrect={"name"} />
                            <UsernameField toggleValid={toggleValid} ref={refs.username} autoCorrect={"username"} />
                        </div>
                        <p>People who use our service may have uploaded your contact information to Lushiro.
                            <Link to={"/pupu"}> Learn more, but why?
                            </Link>
                        </p>
                        <p>
                            By signing up, you agree to our
                            <Link to={"/pupu"}> Terms, Privacy Policy </Link>
                            and <Link to={"/pupu"}>Cookies Policy</Link>
                        </p>
                        <button onClick={handleSubmit} type='submit' className={clsx(!clickable && styles.disabled, styles.btnBase)}>Sign Up</button>
                    </form>
                </div>
                {/* formSibling is to change to login Page */}
                <div className={styles.formSibling}>
                    <p>Have an account?</p>
                    <Link to={"/login"} >Login</Link>
                </div>
            </main>
            <Footer className={styles.footer} />
        </>



    )
}

export default Signup
