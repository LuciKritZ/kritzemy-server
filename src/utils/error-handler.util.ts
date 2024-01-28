/**
 * ErrorHandler for handling errors through out the application using OOP.
 */
class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    // super() method is used to call the constructor of the parent class.
    // It will pass the message argument to the error class constructor, which sets the error message for the instance
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
