// import jwt from 'jsonwebtoken';
// import UserModel from '../models/user.model.js';

// const auth = async (req, res, next) => {
//     try {
//         // 1. Get token from MULTIPLE sources
//         const token =
//             req.cookies?.accessToken ||
//             req.body?.accessToken ||
//             (req.headers.authorization?.startsWith("Bearer ") 
//                 ? req.headers.authorization.split(" ")[1] 
//                 : null);

//         if (!token) {
//             return res.status(401).json({
//                 message: "Please login.",
//                 error: true,
//                 success: false
//             });
//         }

//         // 2. Verify token
//         const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

//         if (!decoded?.id) {
//             return res.status(401).json({
//                 message: "Session expired. Please log in again.",
//                 error: true,
//                 success: false
//             });
//         }

//         // 3. Check if user exists and is active
//         const user = await UserModel.findById(decoded.id);
//         if (!user || user.status !== "Active") {
//             return res.status(403).json({
//                 message: "Access denied. Account InActive.",
//                 error: true,
//                 success: false
//             });
//         }

//         // 4. Attach userId to request
//         req.userId = user._id;
//         next();
//     } catch (error) {
//         console.log("Auth Error:", error.message);
        
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({
//                 message: "Session expired. Please log in again.",
//                 error: true,
//                 success: false
//             });
//         }
        
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({
//                 message: "Invalid token. Please login again.",
//                 error: true,
//                 success: false
//             });
//         }

//         return res.status(401).json({
//             message: "Please login again.",
//             error: true,
//             success: false
//         });
//     }
// };

// export default auth;

/**
 * @fileoverview Authentication Middleware
 * Validates JWT tokens and sets user context
 */

import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import logger from '../utils/logger.js';
import { AuthenticationError } from '../utils/errorHandler.js';

/**
 * Authentication middleware
 * Validates JWT token from cookies or Authorization header
 * NEVER accept tokens from request body (security risk)
 */
const auth = async (req, res, next) => {
  try {
    // Get token from SECURE sources only
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith('Bearer ') 
        ? req.headers.authorization.split(' ')[1] 
        : null);

    if (!token) {
      logger.warn('No authentication token provided', { 
        ip: req.ip,
        method: req.method,
        path: req.path,
      });

      return res.status(401).json({
        message: 'Please login to continue',
        error: true,
        success: false,
        errorCode: 'NO_TOKEN',
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    } catch (jwtError) {
      logger.warn('Invalid token', {
        errorName: jwtError.name,
        ip: req.ip,
        path: req.path,
      });

      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Session expired. Please log in again',
          error: true,
          success: false,
          errorCode: 'TOKEN_EXPIRED',
        });
      }

      throw jwtError;
    }

    if (!decoded?.id) {
      logger.warn('Token missing user ID', { token: token.substring(0, 20) });

      return res.status(401).json({
        message: 'Invalid token format',
        error: true,
        success: false,
        errorCode: 'INVALID_TOKEN',
      });
    }

    // Check user exists and is active
    const user = await UserModel.findById(decoded.id);
    
    if (!user) {
      logger.warn('User not found for token', { userId: decoded.id });

      return res.status(401).json({
        message: 'User account not found',
        error: true,
        success: false,
        errorCode: 'USER_NOT_FOUND',
      });
    }

    if (user.status === 'Inactive' || user.status === 'Blocked') {
      logger.warn('User account inactive', { userId: decoded.id, status: user.status });

      return res.status(403).json({
        message: `Account ${user.status.toLowerCase()}. Contact support.`,
        error: true,
        success: false,
        errorCode: 'ACCOUNT_INACTIVE',
      });
    }

    // Attach user info to request
    req.userId = user._id;
    req.user = user;

    logger.debug('User authenticated', { 
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    next();
  } catch (error) {
    logger.error('Authentication error', {
      message: error.message,
      stack: error.stack,
      ip: req.ip,
    });

    return res.status(401).json({
      message: 'Authentication failed',
      error: true,
      success: false,
      errorCode: 'AUTH_ERROR',
    });
  }
};

export default auth;