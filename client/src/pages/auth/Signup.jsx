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
import GoogleButton from '../../components/Buttons/GoogleButton'
import GithubButton from '../../components/Buttons/GithubButton'

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
                        <GoogleButton />
                        <GithubButton />
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
