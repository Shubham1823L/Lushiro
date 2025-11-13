const asyncHandler = (controller) => {
    return (req, res, next) => {
        return Promise.resolve(controller(req,res,next)).catch(next)
        // call controller , if it returns a value i.e. sync fn , then create a promise and resolve it , if it is async and returns a pending promise, wait for it to complete
        //in either cases, if it throws i.e. fails, call catch which has next so it calls next but auto feeds err as the arg , err is the error thrown by fn
    }
}

export default asyncHandler