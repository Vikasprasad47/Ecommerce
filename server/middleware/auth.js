// import jwt from 'jsonwebtoken';
// import UserModel from '../models/user.model.js';

// const auth = async (req, res, next) => {
//     try {
//         // 1. Get token from cookies or headers
//         const token =
//             req.cookies?.accessToken ||
//             (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

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
//                 message: "Access denied. Account Deactivated.",
//                 error: true,
//                 success: false
//             });
//         }

//         // 4. Attach userId to request
//         req.userId = user._id;
//         next();
//     } catch (error) {
//         console.log(error);
        
//         return res.status(401).json({
//             message: "Please login again.",
//             error: true,
//             success: false
//         });
//     }
// };

// export default auth;

import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';

const auth = async (req, res, next) => {
    try {
        // 1. Get token from MULTIPLE sources
        const token =
            req.cookies?.accessToken ||
            req.body?.accessToken ||
            (req.headers.authorization?.startsWith("Bearer ") 
                ? req.headers.authorization.split(" ")[1] 
                : null);

        if (!token) {
            return res.status(401).json({
                message: "Please login.",
                error: true,
                success: false
            });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        if (!decoded?.id) {
            return res.status(401).json({
                message: "Session expired. Please log in again.",
                error: true,
                success: false
            });
        }

        // 3. Check if user exists and is active
        const user = await UserModel.findById(decoded.id);
        if (!user || user.status !== "Active") {
            return res.status(403).json({
                message: "Access denied. Account Deactivated.",
                error: true,
                success: false
            });
        }

        // 4. Attach userId to request
        req.userId = user._id;
        next();
    } catch (error) {
        console.log("Auth Error:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token expired. Please refresh.",
                error: true,
                success: false
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid token. Please login again.",
                error: true,
                success: false
            });
        }

        return res.status(401).json({
            message: "Please login again.",
            error: true,
            success: false
        });
    }
};

export default auth;