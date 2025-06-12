export const successRes = (res, resData, code = 200) => {
    return res.status(code).json({
        statuscode: code,
        data: resData
    });
}