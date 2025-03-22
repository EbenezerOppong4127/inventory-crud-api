const errorMiddleware = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);

    // Default to status 500 (Internal Server Error)
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Custom error handling for specific error types
    if (err.name === "ValidationError") {
        statusCode = 400; // Bad Request
    } else if (err.name === "CastError") {
        statusCode = 400; // Invalid Object ID
        err.message = "Invalid ID format";
    } else if (err.code === 11000) {
        statusCode = 400; // Duplicate Key Error (e.g., unique email)
        err.message = "Duplicate field value entered";
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack trace in production
    });
};

module.exports = errorMiddleware;