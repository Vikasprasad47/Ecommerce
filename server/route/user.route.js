import { Router } from "express";
import { registerUserController, verifyEmailController, loginController, logoutController, uploadAvatar, removeAvatar, updateUserDetails, forgotPasswordController, verifyForgotPasswordOtp, resetPasswordController, refreshToken ,userDetails, getAllUsersController, addToWishlistController, removeFromWishlistController, getUserWishlistProducts, getUserReviews, googleLoginController, updateUserRoleController, updateUserStatusController, sendEmailToUserController, getEmailsByRole, sendBulkEmailController, loginOrCreateUserControllerbyPhoneNumber, addSeenProductController, getRecentSeenProductsController, deleteUserController } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js"
import upload from "../middleware/multer.js"
import {authLimiter, otpLimiter} from '../middleware/rateLimiters.js'
const userRouter = Router(); 

userRouter.post("/register", authLimiter, registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", authLimiter,  loginController)
userRouter.post("/google-login", googleLoginController) // Google Login
userRouter.get('/logout', auth , logoutController)
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar)
userRouter.delete('/remove-avatar', auth, removeAvatar)
userRouter.put("/update-user", auth, updateUserDetails)
userRouter.put("/forgot-password", forgotPasswordController)
userRouter.put("/verify-forgot-password-otp", otpLimiter , verifyForgotPasswordOtp)
userRouter.put("/reset-password", resetPasswordController)
userRouter.post("/refresh-token", refreshToken) 
userRouter.get("/user-Details",auth, userDetails )
userRouter.get("/user-reviews", auth, getUserReviews);
userRouter.get('/get-all-users', auth, getAllUsersController);
userRouter.post("/wishlist/add", auth, addToWishlistController);
userRouter.delete("/wishlist/remove/:productId", auth, removeFromWishlistController);
userRouter.get("/wishlist/get-all-wishlist-product", auth, getUserWishlistProducts);
userRouter.patch("/update-role", auth, updateUserRoleController)
userRouter.patch("/update-status", auth, updateUserStatusController)
userRouter.post("/send-email", auth, sendEmailToUserController);
userRouter.get("/get-emails", auth, getEmailsByRole);
userRouter.post("/send-bulk-email", auth, sendBulkEmailController);
userRouter.post("/login-mobile", loginOrCreateUserControllerbyPhoneNumber);
userRouter.post("/seen-product/:productId", auth, addSeenProductController);
userRouter.get("/recent-products", auth, getRecentSeenProductsController);
userRouter.delete("/delete/:userId", auth,deleteUserController);


export default userRouter;