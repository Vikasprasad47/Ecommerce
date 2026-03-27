/**
 * @fileoverview Centralized error handling utility
 * Provides consistent error responses and logging across the application
 */

import logger from './logger.js';

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date();
  }
}

/**
 * Handles different error types and returns standardized response
 */
export const handleError = (error, request, response) => {
  const statusCode = error.statusCode || 500;
  const errorCode = error.errorCode || 'INTERNAL_ERROR';
  const message = error.message || 'An unexpected error occurred';

  // Log error with context
  logger.error({
    errorCode,
    message,
    statusCode,
    method: request.method,
    url: request.url,
    userId: request.userId,
    stack: error.stack,
    timestamp: new Date(),
  });

  // Prevent sensitive info leak in production
  const isProduction = process.env.NODE_ENV === 'production';
  const responseMessage = isProduction && statusCode === 500 
    ? 'Internal server error' 
    : message;

  return response.status(statusCode).json({
    success: false,
    error: true,
    errorCode,
    message: responseMessage,
    ...(process.env.NODE_ENV !== 'production' && { details: error.message }),
    timestamp: new Date().toISOString(),
  });
};

/**
 * Async wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // Convert custom errors or create standard error
      const appError = error instanceof AppError 
        ? error 
        : new AppError(error.message, 500, 'HANDLER_ERROR');
      
      handleError(appError, req, res);
    });
  };
};

/**
 * Validation error handler
 */
export const ValidationError = (message, field = null) => {
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

/**
 * Authentication error handler
 */
export const AuthenticationError = (message = 'Authentication failed') => {
  return new AppError(message, 401, 'AUTHENTICATION_ERROR');
};

/**
 * Authorization error handler
 */
export const AuthorizationError = (message = 'Access denied') => {
  return new AppError(message, 403, 'AUTHORIZATION_ERROR');
};

/**
 * Not found error handler
 */
export const NotFoundError = (resource = 'Resource') => {
  return new AppError(`${resource} not found`, 404, 'NOT_FOUND');
};

/**
 * Conflict error handler (e.g., duplicate entry)
 */
export const ConflictError = (message) => {
  return new AppError(message, 409, 'CONFLICT');
};

export default { handleError, asyncHandler, AppError };