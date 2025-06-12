export const handleError = (res, error, code = 500) => {
    const errorMessage = error.message ? error.message : error
    return res.status(code).json({
        statuscode: code,
        message: error || 'Internal Server Error',
    })
}