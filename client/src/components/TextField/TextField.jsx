import React, { useState } from 'react'
import styles from './textField.module.css'
import { IoIosCloseCircleOutline } from "react-icons/io";
import clsx from 'clsx';
import { EyeOff, EyeClosed } from 'lucide-react'


const TextField = ({ type, placeholder, handleBlur, ref, error,autoCorrect }) => {

    const [currentType, setCurrentType] = useState(type)
    const toggleVisibility = (e) => {
        e.preventDefault()
        if (currentType == "password") setCurrentType("text")
        else setCurrentType("password")
    }


    return (
        <>
            <div className={styles.inputWrapper}>
                <div className={clsx(styles.textFieldWrapper, error && styles.errorBorder)}>
                    <input spellCheck="false" autoComplete={autoCorrect} onBlur={handleBlur} ref={ref} placeholder={placeholder} type={currentType} className={styles.textField} />
                    <label className={styles.placeholder}>{placeholder}</label>


                    {error && <IoIosCloseCircleOutline className={styles.errorLogo} color='#FF3040' size={32} />}

                    {
                        type == "password" &&
                        <button onClick={toggleVisibility} className={styles.eye}>
                            {currentType == "password" ?
                                <EyeClosed /> :
                                <EyeOff />}
                        </button>
                    }

                </div>

                {error && <div className={styles.error}>
                    {error}
                </div>}
            </div>
        </>
    )
}

export default TextField
