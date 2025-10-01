import { Router } from "express";
import { registerUserController, verifyEmailController, loginController, logoutController, uploadAvatar, removeAvatar, updateUserDetails, forgotPasswordController, verifyForgotPasswordOtp, resetPasswordController, refreshToken ,userDetails, getAllUsersController, addToWishlistController, removeFromWishlistController, getUserWishlistProducts } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js"
import upload from "../middleware/multer.js"
const userRouter = Router(); 

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController)
userRouter.get('/logout', auth , logoutController)
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar)
userRouter.delete('/remove-avatar', auth, removeAvatar)
userRouter.put("/update-user", auth, updateUserDetails)
userRouter.put("/forgot-password", forgotPasswordController)
userRouter.put("/verify-forgot-password-otp", verifyForgotPasswordOtp)
userRouter.put("/reset-password", resetPasswordController)
userRouter.post("/refresh-token", refreshToken)
userRouter.get("/user-Details",auth, userDetails )
userRouter.get('/get-all-users', auth, getAllUsersController);
userRouter.post("/wishlist/add", auth, addToWishlistController);
userRouter.delete("/wishlist/remove/:productId", auth, removeFromWishlistController);
userRouter.get("/wishlist/get-all-wishlist-product", auth, getUserWishlistProducts);

export default userRouter;