import { ResponseError } from "../entities/response-error.js";

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof ResponseError) {
        statusCode = err.status;
        message = err.message;
    } else if (err.isJoi) { 
        statusCode = 400;
        message
    } else {
        message = err.message;
    }

    res.status(statusCode).json({
        code: statusCode,
        status: "fail",
        message: message
    }).end();
}

export {
    errorMiddleware
}
