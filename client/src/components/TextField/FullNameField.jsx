import React, { useEffect, useRef, useState } from 'react'
import TextField from './TextField'

const FullNameField = ({ toggleValid, ref }) => {

    const [error, setError] = useState("")

    useEffect(() => {
        if (error) toggleValid(e => ({ ...e, fullName: false }))
        else if (error == null) toggleValid(e => ({ ...e, fullName: true }))
    }, [error, toggleValid])

    const handleBlur = async () => {
        const value = ref.current.value
        if (!value) return setError("This is a required field")

        const regex = /^[A-Za-z]+(?: [A-Za-z]+)*$/
        if (!regex.test(value)) return setError("Enter a valid Full Name")
        setError(null)
    }

    return (
        <TextField type={"text"} placeholder={"Full Name"} ref={ref} error={error} handleBlur={handleBlur} />
    )
}

export default FullNameField
