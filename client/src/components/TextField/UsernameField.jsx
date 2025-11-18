import React, { useEffect, useRef, useState } from 'react'
import TextField from './TextField'
import { validateUsername } from '../../api/dbValidation'

const UsernameField = ({ toggleValid, ref }) => {

    const [error, setError] = useState("")

    useEffect(() => {
        if (error) toggleValid(e => ({ ...e, username: false }))
        else if (error == null) toggleValid(e => ({ ...e, username: true }))
    }, [error, toggleValid])

    const handleBlur = async () => {
        const value = ref.current.value
        if (!value) return setError("This is a required field")

        const regex = /^[A-Za-z][A-Za-z0-9._]+$/
        if (!regex.test(value)) return setError("Invalid username")

        const status = await validateUsername(value)
        setError(null)
        if (status == 409) return setError("Username already taken")
        if (status == 500) return setError("Internal Server Error") //### HANDLE THIS LATER
    }

    return (
        <TextField type={"text"} placeholder={"Username"} ref={ref} error={error} handleBlur={handleBlur} />
    )
}

export default UsernameField
