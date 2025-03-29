/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         status:
 *           type: string
 *           example: "error"
 *         statusCode:
 *           type: number
 *           example: 500
 *         message:
 *           type: string
 *           example: "Internal Server Error"
 *         stack:
 *           type: string
 *           description: Only shown in development
 *           example: "Error: Something went wrong\n    at ..."
 */

class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode || 500;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    // Default values
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        err.statusCode = 400;
        err.message = 'Validation Error: ' + err.message;
    } else if (err.name === 'CastError') {
        err.statusCode = 400;
        err.message = 'Invalid ID format';
    } else if (err.code === 11000) {
        err.statusCode = 400;
        err.message = 'Duplicate field value entered';
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('[Error]', {
            status: err.status,
            statusCode: err.statusCode,
            message: err.message,
            stack: err.stack
        });
    }

    // Send error response
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        statusCode: err.statusCode,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            error: err
        })
    });
};

module.exports = {
    AppError,
    errorHandler
};