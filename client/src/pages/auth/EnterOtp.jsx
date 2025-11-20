import React, { useRef, useState } from 'react'
import styles from './signup.module.css'
import loginStyles from './login.module.css'
import clsx from 'clsx'
import TextField from '../../components/TextField/TextField'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'
import { verifyOtp } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'

const EnterOtp = () => {
    const navigate = useNavigate()
    const { updateUser, updateToken } = useAuth()
    const [clickable, setClickable] = useState(false)
    const [error, setError] = useState("")
    const ref = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const value = ref.current.value
        const { status, data } = await verifyOtp(value)

        if (status == 500) return setError("Internal Error")
        if (status == 400) return setError("Incorrect OTP")
        if (status == 410) return setError(data.message)

        const { user, accessToken } = data.data
        updateToken(accessToken)
        updateUser(user)
        navigate(`/${user.username}`, { replace: true })
        //Call otpHandler here
    }


    const handleBlur = () => {
        const value = ref.current.value
        if (value.length === 6 && parseInt(value)) {
            setClickable(true)
            setError("")
        }
        else {
            setClickable(false)
            setError("Invalid format")
        }
    }



    return (
        <>
            <main className={loginStyles.hero}>
                <div className={clsx(styles.formWrapper, loginStyles.formWrapper)}>
                    <form className={styles.form}>
                        <h1 className={styles.wordmark}>Lushiro</h1>


                        <div className={clsx(styles.formFields, loginStyles.formFields)}>
                            <TextField error={error} type={"text"} placeholder={"Enter your OTP"} ref={ref} handleBlur={handleBlur} />
                        </div>

                        <button onClick={handleSubmit} type='submit' className={clsx(!clickable && styles.disabled, styles.btnBase)}>Next</button>
                        <Link to={'#'} disabled className={loginStyles.forgotPassword}>Resend OTP</Link>

                        {/* <div className={styles.lineBreakWrapper}>
                            <div ></div>
                            <p>OR</p>
                            <div ></div>
                        </div>


                        <a href="#" disabled className={loginStyles.loginWithFacebook}>
                            <RiFacebookCircleFill size={24} /> Log in with Facebook
                        </a> */}

                    </form>
                </div>
                {/* formSibling is to change to login Page */}
                <div className={clsx(styles.formSibling)}>
                    <p>Have an account?</p>
                    <Link to={"/login"} >Login</Link>
                </div>

            </main>
            <Footer className={loginStyles.footer} />
        </>

    )
}

export default EnterOtp
