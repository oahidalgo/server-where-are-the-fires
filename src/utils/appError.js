class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = "error";
    //Marked as handled
    this.isOperational = true;
    //useful for debugging and see the complete callstack from here
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
