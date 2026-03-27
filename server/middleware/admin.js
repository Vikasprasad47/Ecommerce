// import UserModel from "../models/user.model.js"

// export const admin = async (request, response, next) => {
//     try {
//         const userId = request.userId

//         const user = await UserModel.findById(userId)

//         if(user.role !== "ADMIN"){
//             return response.status(400).json({
//                 message: "Permission Denied",
//                 error: true,
//                 success: false
//             })
//         }

//         next()
//     } catch (error) {
//         return response.status(500).json({
//             message: "Permission Denied",
//             error: true,
//             success: false
//         })
//     }
// }

/**
 * @fileoverview Admin Authorization Middleware
 * Validates that authenticated user has admin/seller role
 */

import logger from '../utils/logger.js';

/**
 * Admin middleware
 * Ensures user has required admin or seller role
 */
export const admin = async (req, res, next) => {
  try {
    if (!req.userId) {
      logger.warn('Admin middleware: No authenticated user', {
        ip: req.ip,
        path: req.path,
      });

      return res.status(401).json({
        message: 'Please log in first',
        error: true,
        success: false,
        errorCode: 'NOT_AUTHENTICATED',
      });
    }

    const user = req.user;
    
    if (!user) {
      logger.warn('Admin middleware: User data missing', {
        userId: req.userId,
        path: req.path,
      });

      return res.status(401).json({
        message: 'User information not found',
        error: true,
        success: false,
        errorCode: 'USER_DATA_MISSING',
      });
    }

    // Check user role
    const allowedRoles = ['ADMIN', 'SELLER'];
    if (!allowedRoles.includes(user.role)) {
      logger.warn('Unauthorized access attempt', {
        userId: user._id,
        email: user.email,
        role: user.role,
        path: req.path,
        ip: req.ip,
      });

      return res.status(403).json({
        message: 'You do not have permission to access this resource',
        error: true,
        success: false,
        errorCode: 'INSUFFICIENT_PERMISSIONS',
      });
    }

    logger.debug('Admin access granted', {
      userId: user._id,
      role: user.role,
      path: req.path,
    });

    next();
  } catch (error) {
    logger.error('Admin middleware error', {
      message: error.message,
      userId: req.userId,
      stack: error.stack,
    });

    return res.status(500).json({
      message: 'Authorization check failed',
      error: true,
      success: false,
      errorCode: 'AUTH_CHECK_ERROR',
    });
  }
};

export default admin;