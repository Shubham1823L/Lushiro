import React, { useState } from 'react'
import styles from './sidebar.module.css'
import { publishNewPost, uploadFile } from '../../api/posts';
import { IoClose } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { ImagePlus } from 'lucide-react'

const CreateNewPost = ({ createNewPostRef, setMyPosts }) => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [file, setFile] = useState(null)
    const [tempURL, setTempURL] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(false)

    const handleClose = () => {
        createNewPostRef.current.style.display = "none"
        setTempURL(null)
        setUploading(false)
        setUploaded(false)
        uploaded && navigate(`/${user.username}`)
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        const url = URL.createObjectURL(file)
        setFile(file)
        setTempURL(url)
    }

    const handleFileUpload = async (e) => {
        e.preventDefault() //consistency reasons, and readability as well
        setUploading(true)
        setTempURL(null)
        const { status, data: { data } } = await uploadFile(file)
        if (status >= 300) {
            createNewPostRef.current.style.display = "none"
            setUploading(false)
        }
        if (status == 400) return toast.error("File was empty/invalid, Bad request")
        if (status == 500) return toast.error("Something went wrong on our end")
        if (status == 200) {
            const response = await publishNewPost(data)
            if (response.status >= 300) {
                createNewPostRef.current.style.display = "none"
                setUploading(false)
            }
            if (response.status == 500) return toast.error("Something went wrong on our end")
            if (response.status == 200) {
                setMyPosts(prev => [...prev, response.data.data.post])
                setUploading(false)
                setUploaded(true)
                return
            }
        }
        console.error("SHIT HAPPENED , TOO MUCH ERROR HANDLING, NGL")
    }
    return (
        <div ref={createNewPostRef} className={styles.createNewPost}>
            <IoClose onClick={handleClose} className={clsx(styles.closeIcon, uploading && styles.disabled)} size={32} />
            <div className={styles.dialogBoxWrapper}>
                <form className={styles.dialogBox}>
                    <div>
                        {tempURL && <button onClick={(e) => {
                            e.preventDefault()
                            setTempURL(null)
                        }} className={styles.backBtn}><FaArrowLeftLong /></button>}
                        <p>{uploaded ? "Post shared" : "Create New Post"}</p>
                        {tempURL && <button onClick={handleFileUpload} className={styles.uploadFile}>Share</button>}
                    </div>

                    {tempURL ?
                        //we have tempURL so show the preview
                        <img className={styles.previewContent} src={tempURL} alt="userSelectedContentPreview" /> :
                        //no tempURL , 2 cases, either uploading (selected image) or not (user hasn't selected the image yet)
                        uploading || uploaded ?
                            //Show Loading page
                            <>
                                <section className={styles.uploadingStateSection}>
                                    <div className={clsx(styles.uploadingLoaderCircle, uploading && styles.loading)}>
                                        <div className={clsx(styles.tickMarkWrapper, uploading && styles.reverseLoading)}>
                                            {uploaded && <div className={clsx(styles.tickMark, uploaded && styles.tickMarkLeftAnimation, uploaded && styles.tickMarkRightAnimation)}></div>}
                                        </div>
                                    </div>
                                    <p style={{
                                        opacity: uploaded && 1,
                                        translate: uploaded && "none"
                                    }}>Your post has been shared.</p>
                                </section>
                            </> :
                            <>
                                <section className={styles.postUploadPlaceholder}>
                                    <ImagePlus size={64} />
                                    <p>Upload photos and videos here</p>
                                    <div className={styles.selectFile}>
                                        <label htmlFor="fileUpload">Select from Computer</label>
                                        <input onChange={handleFileSelect} id='fileUpload' type="file" accept='image/*, video/*' />
                                    </div>
                                </section>
                            </>
                    }

                </form>
            </div>
        </div>
    )
}

export default CreateNewPost
