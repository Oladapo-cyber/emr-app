// Import the Winston logger for error logging
import winston from "../utils/logger.js";

//Global error handling middleware
//Catches all errors that occur in the application and sends a consistent error response to the client

export const errorHandler = (err, req, res, next) => {
  // Log the error with additional context for debugging
  // Includes error details, request info, and user IP
  winston.error(`Error ${err.status || 500}: ${err.message}`, {
    stack: err.stack, // Full error stack trace
    url: req.originalUrl, // The URL that caused the error
    method: req.method, // HTTP method (GET, POST, etc.)
    ip: req.ip, // Client IP address
  });

  // Set default values for status code and message
  // Use error's status/statusCode or default to 500 (Internal Server Error)
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  // Handle specific error types with custom responses

  // Mongoose validation error (e.g., required fields missing, invalid data types)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Validation Error",
      // Extract all validation error messages into an array
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose cast error (e.g., invalid MongoDB ObjectId format)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Invalid ID format",
    });
  }

  // MongoDB duplicate key error (e.g., trying to create user with existing email)
  if (err.code === 11000) {
    // Extract the field name that caused the duplicate error
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      status: 400,
      message: `${field} already exists`,
    });
  }

  // JWT (JSON Web Token) malformed or invalid error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Invalid token",
    });
  }

  // JWT expired error (token is valid but has expired)
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Token expired",
    });
  }

  // Default error response for all other error types
  // Include stack trace only in development environment for security
  return res.status(status).json({
    success: false,
    status,
    message,
    // Conditionally include stack trace only in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

//404 handler for unmatched routes, this middleware runs when no other route handlers match the request
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `Route ${req.originalUrl} not found`,
  });
};
