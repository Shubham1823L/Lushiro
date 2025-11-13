import React, { useEffect, useRef, useState } from 'react'
import styles from './signup.module.css'
import loginStyles from './login.module.css'
import clsx from 'clsx'
import TextField from '../../components/TextField/TextField'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'
import { RiFacebookCircleFill } from "react-icons/ri";
import { login } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'

const Login = () => {
    const navigate = useNavigate()
    const { updateToken, updateUser } = useAuth()

    const [valid, setValid] = useState({ email: false, password: false })
    const [clickable, setClickable] = useState(false)
    const [emailError, setEmailError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)

    const emailRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setEmailError(null)
        setPasswordError(null)

        const email = emailRef.current.value
        const password = passwordRef.current.value

        const { status, data } = await login(email, password)
        if (status == 500) return console.error("Something went wrong on our end")
        if (status == 404) return setEmailError("Email not registered, please signup")
        if (status == 400) return setPasswordError("Incorrect Password")

        //status:200 => OK

        const { data: { accessToken, user } } = data
        updateToken(accessToken)
        updateUser(user)
        navigate(`/${user.username}`, { replace: true })

    }
    const handleEmailBlur = () => {
        const email = emailRef.current.value
        if (!email) return setValid(e => ({ ...e, email: false }))
        setValid(e => ({ ...e, email: true }))
    }
    const handlePasswordBlur = () => {
        const password = passwordRef.current.value
        if (!password) return setValid(e => ({ ...e, password: false }))
        setValid(e => ({ ...e, password: true }))
    }

    useEffect(() => {
        if (Object.values(valid).every(e => e)) setClickable(true)
        else setClickable(false)
    }, [valid])



    return (
        <>
            <main className={loginStyles.hero}>
                <div className={clsx(styles.formWrapper, loginStyles.formWrapper)}>
                    <form className={styles.form}>
                        <h1><img src="/instagram-wordmark.svg" alt="nameLogo" /></h1>


                        <div className={clsx(styles.formFields, loginStyles.formFields)}>
                            <TextField error={emailError} type="email" placeholder={"Email address"} ref={emailRef} handleBlur={handleEmailBlur} />
                            <TextField error={passwordError} type={"password"} placeholder={"Password"} ref={passwordRef} handleBlur={handlePasswordBlur} />
                        </div>

                        <button onClick={handleSubmit} type='submit' className={clsx(!clickable && styles.disabled, styles.btnBase)}>Log in</button>
                        <div className={styles.lineBreakWrapper}>
                            <div ></div>
                            <p>OR</p>
                            <div ></div>
                        </div>


                        <a href="#" disabled className={loginStyles.loginWithFacebook}>
                            <RiFacebookCircleFill size={24} /> Log in with Facebook
                        </a>
                        <Link to={'#'} disabled className={loginStyles.forgotPassword}>Forgotten your Password?</Link>

                    </form>
                </div>
                {/* formSibling is to change to login Page */}
                <div className={clsx(styles.formSibling, loginStyles.formSibling)}>
                    <p>Don't have an account?</p>
                    <Link to={"/signup"} >Sign Up</Link>
                </div>

            </main>
            <Footer className={loginStyles.footer} />
        </>

    )
}

export default Login
