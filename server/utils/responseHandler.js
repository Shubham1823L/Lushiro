const successHandler = (req, res, next) => {
    res.success = (status = 200, data = "OK", message = "Successful Request") => {
        res.status(status).json({ success: true, data, message })
    }
    res.fail = (status, code, message) => {
        res.status(status).json({ sucess: false, code, message })
    }
    next()
}

export default successHandler