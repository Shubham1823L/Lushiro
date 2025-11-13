import React, { useEffect, useRef, useState } from 'react'
import TextField from './TextField'

const PasswordField = ({ toggleValid,ref }) => {

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/
    const [error, setError] = useState("")

    useEffect(() => {
        if (error) toggleValid(e => ({ ...e, password: false }))
        else toggleValid(e => ({ ...e, password: true }))
    }, [error,toggleValid])

    const handleBlur = async () => {
        const value = ref.current.value
        if (!value) return setError("This is a required field")
        setError(null)
        if (!regex.test(value)) return setError("Min. 8 characters with atleast one special , uppercase ,lowercase letter and a number")
    }

    return (
        <TextField type={"password"} placeholder={"Password"} ref={ref} error={error} handleBlur={handleBlur} />
    )
}

export default PasswordField
