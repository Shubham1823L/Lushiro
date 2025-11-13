import cloudinary from '../config/cloudinary.js'
import fs from 'fs'
import User from '../models/User.js'

export const checkUploadsExists = async (req, res, next) => {
    if (fs.existsSync('uploads')) return next()
    fs.mkdirSync('uploads')
    console.log("uploads folder was created")
    next()
}



export const uploadFileToCloudinary = async (req, res) => {
    const file = req.file
    if (!file) return res.fail(400, "FILE_NOT_FOUND", "The file you sent was either empty or could not be found")

    const result = await cloudinary.uploader.upload(file.path, {
        folder: "instaProject_uploads",
        use_filename: true,
        unique_filename: true,
        resource_type: "auto"
    })
    fs.unlink(file.path, (err) => {
        if (err) console.warn("File wasn't unlinked")
    })

    const { secure_url, public_id } = result

    //If the upload is for avatar update
    file.fieldname == "avatar" && await User.updateOne({ _id: req.user._id }, { $set: { avatar: { secureUrl: secure_url, publicId: public_id } } })

    return res.success(200, {
        secureUrl: secure_url,
        publicId: public_id
    })


}
