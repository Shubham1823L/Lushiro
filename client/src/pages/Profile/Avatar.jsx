import React, { useEffect, useState } from 'react'
import { uploadAvatar } from '../../api/uploadFile';
import { FaCamera } from "react-icons/fa";
import styles from './profile.module.css'



const Avatar = ({ avatar, isAdmin }) => {
    const [avatarUrl, setavatarUrl] = useState("")
    const handleFileUpload = async (e) => {
        const file = e.target.files[0]

        const { status, data: { data } } = await uploadAvatar(file)
        if (status == 500) return console.error("Server side shit happened")
        if (status == 400) return console.error("File not received")
        if (status == 200) {
            setavatarUrl(data.secureUrl)
        }
    }

    useEffect(() => {
        if (!avatar.secureUrl) return
        setavatarUrl(avatar.secureUrl)
    }, [avatar])

    return (
        <div className={styles.avatarArea}>
            <div className={styles.avatarWrapper}>
                {!avatarUrl ? <><img src="/defaultAvatar.jpeg" alt="defaultAvatar" />
                    <FaCamera size={"2.5rem"} className={styles.profileCamIcon} /></>
                    :
                    <img src={avatarUrl} alt="avatar" className={styles.avatar} />
                }
                {isAdmin && <>
                    <label htmlFor="avatar"></label>
                    <input onChange={handleFileUpload} type='file' accept='image/*' className={styles.avatarInput} id='avatar' style={{ display: "none" }} />
                </>}

            </div>
        </div>
    )
}

export default Avatar
