const { CustomError } = require("../../error/customError")

exports.errorHandling = (err,req,res,next) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    } 
    res.status(500).json({
        message: err.message
    })
}