import React from 'react'
import styles from './textField.module.css'
import { IoIosCloseCircleOutline } from "react-icons/io";
import clsx from 'clsx';


const TextField = ({ type, placeholder, handleBlur, ref, error }) => {

    return (
        <>
            <div className={styles.inputWrapper}>
                <div className={clsx(styles.textFieldWrapper, error && styles.errorBorder)}>
                    <input onBlur={handleBlur} ref={ref} placeholder={placeholder} type={type} className={styles.textField} />
                    <label className={styles.placeholder}>{placeholder}</label>
                    {error && <IoIosCloseCircleOutline color='#FF3040' size={32} />}
                </div>

                {error && <div className={styles.error}>
                    {error}
                </div>}
            </div>
        </>
    )
}

export default TextField
