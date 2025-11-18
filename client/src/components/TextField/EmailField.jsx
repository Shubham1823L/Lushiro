import React, { useEffect, useRef, useState } from 'react'
import TextField from './TextField'
import { validateEmail } from '../../api/dbValidation'

const EmailField = ({ toggleValid, ref }) => {
    const [error, setError] = useState("")

    useEffect(() => {
        if (error) toggleValid(e => ({ ...e, email: false }))
        else if (error == null) toggleValid(e => ({ ...e, email: true }))
    }, [error, toggleValid])

    const handleBlur = async () => {
        const value = ref.current.value
        if (!value) return setError("This is a required field")

        const status = await validateEmail(value)
        setError(null)

        if (status == 400) return setError("Invalid email address")
        if (status == 409) return setError("Email already registered")
        if (status == 500) return setError("Internal Server Error") //### HANDLE THIS LATER
    }

    return (
        <TextField type={"email"} placeholder={"Email address"} ref={ref} error={error} handleBlur={handleBlur} />
    )
}

export default EmailField
