const errorHandler = (err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || "Something went wrong, please try again"
    const code = err.code || "INTERNAL_ERROR"

    console.error(err.stack)
    res.status(status).json({ success: false, message, code })
}

export default errorHandler