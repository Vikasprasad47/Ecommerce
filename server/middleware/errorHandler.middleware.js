/**
 * @fileoverview Global Error Handler Middleware
 * Catches and handles all application errors
 */

import logger from '../utils/logger.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * Global error handling middleware
 * Must be placed AFTER all other middleware and routes
 */
export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'INTERNAL_ERROR';
  const isProduction = process.env.NODE_ENV === 'production';

  // Log error with full context
  logger.error('Unhandled error', {
    errorCode,
    message: err.message,
    statusCode,
    method: req.method,
    url: req.url,
    userId: req.userId,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    stack: err.stack,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');

    return res.status(400).json({
      success: false,
      error: true,
      errorCode: 'VALIDATION_ERROR',
      message: `Validation failed: ${messages}`,
      timestamp: new Date().toISOString(),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      error: true,
      errorCode: 'DUPLICATE_ENTRY',
      message: `${field} already exists`,
      timestamp: new Date().toISOString(),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: true,
      errorCode: 'INVALID_TOKEN',
      message: 'Invalid token',
      timestamp: new Date().toISOString(),
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: true,
      errorCode: 'TOKEN_EXPIRED',
      message: 'Token expired',
      timestamp: new Date().toISOString(),
    });
  }

  // Generic error response
  return res.status(statusCode).json({
    success: false,
    error: true,
    errorCode,
    message: isProduction && statusCode === 500 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { 
      details: err.message,
      stack: err.stack 
    }),
    timestamp: new Date().toISOString(),
  });
};

/**
 * 404 Not Found handler
 * Place this AFTER all other middleware and routes
 */
export const notFoundHandler = (req, res) => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.url,
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    error: true,
    errorCode: 'NOT_FOUND',
    message: 'The requested resource was not found',
    path: req.path,
    timestamp: new Date().toISOString(),
  });
};

export default { globalErrorHandler, notFoundHandler };