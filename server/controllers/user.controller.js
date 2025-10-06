import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js"
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadUserImageDatatocloudinary from "../utils/uploadUserImageDatatocloudinary.js"; // ✅ this should point to the right file
import generateOtp from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordtemplets.js";
import jwt from "jsonwebtoken";
import sendEmailByNodeMailer from "../config/sendEmailByNodeMailer.js";
import dotenv from 'dotenv';
dotenv.config();


export async function registerUserController(req, res) {
    try {
        const { name, email, password, mobile  } = req.body;

        // Step 1: Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email, and password.",
                error: true,
                success: false,
            });
        }

        // Step 1.1: Validate mobile number format (Indian 10-digit starting with 6-9)
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            return res.status(400).json({
                message: "Invalid phone number. Please enter a 10-digit Indian number starting with 6-9.",
                error: true,
                success: false,
            });
        }

        // Step 2: Check if user already exists 
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists.",
                error: true,
                success: false,
            });
        }

        // Step 3: Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Step 4: Create and save user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            mobile
        });

        const savedUser = await newUser.save();

        // Step 5: Success response
        return res.status(201).json({
            message: "User registered successfully!",
            error: false,
            success: true,
            data: {
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
            },
        });

    } catch (error) {
        console.error("❌ Register Error:", error);
        return res.status(500).json({
            message: error?.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}

export async function verifyEmailController(req, res) {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                message: "Verification code is required.",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findById(code);

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification code.",
                error: true,
                success: false
            });
        }

        if (user.verify_email) {
            return res.status(200).json({
                message: "Email is already verified.",
                error: false,
                success: true
            });
        }

        user.verify_email = true;
        await user.save();

        return res.status(200).json({
            message: "Email verification successful!",
            success: true,
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password.",
        error: true,
        success: false
      });
    }

    // 2️⃣ Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please register first.",
        error: true,
        success: false
      });
    }

    // 3️⃣ Check account status
    if (user.status !== "Active") {
      return res.status(403).json({
        message: "Account is not active. Please contact support.",
        error: true,
        success: false
      });
    }

    // 4️⃣ Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password.",
        error: true,
        success: false
      });
    }

    // 5️⃣ Generate tokens
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    await UserModel.findByIdAndUpdate(
        user._id,
        {
            refresh_token: refreshToken,
            last_login_date: new Date()
        },
        { new: true }
    );

    // 6️⃣ (Optional) Set cookies (can remove if only using localStorage)
    const cookieOptions = {
      httpOnly: true,
      secure: true,     // true if HTTPS
      sameSite: "None", // Needed for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // 7️⃣ Update last login
    user.last_login_date = new Date();
    await user.save();

    // 8️⃣ Return response
    return res.status(200).json({
      message: "Logged in successfully!",
      error: false,
      success: true,
      data: {
        accessToken,        // for localStorage
        refreshToken,       // for localStorage
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false
    });
  } 
}

export async function googleLoginController(req, res) {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Missing Google authorization code.",
        error: true,
        success: false,
      });
    }

    // 1️⃣ Exchange code for tokens
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("client_id", process.env.GOOGLE_CLIENT_ID);
    params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
    params.append("redirect_uri", "postmessage"); // SPA redirect
    params.append("grant_type", "authorization_code");

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return res.status(400).json({
        message: tokenData.error_description || "Failed to exchange code for token",
        error: true,
        success: false,
      });
    }

    const { id_token } = tokenData;
    if (!id_token) {
      return res.status(400).json({
        message: "ID token not found from Google.",
        error: true,
        success: false,
      });
    }

    // 2️⃣ Verify ID token and get user info
    const userInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
    const userInfo = await userInfoRes.json();

    const { email, name, picture, email_verified } = userInfo;

    if (!email_verified) {
      return res.status(403).json({
        message: "Google account not verified.",
        error: true,
        success: false,
      });
    }

    // 3️⃣ Check if user exists
    let user = await UserModel.findOne({ email });

    if (!user) {
      // 3.1 Create new user without password
      user = new UserModel({
        name,
        email,
        password: "google-auth-user", // placeholder
        avatar: picture || "",
        verify_email: true,
        status: "Active",
      });
      await user.save();
    }

    // 4️⃣ Check account status
    if (user.status !== "Active") {
      return res.status(403).json({
        message: "Account is not active. Please contact support.",
        error: true,
        success: false
      });
    }

    // 5️⃣ Generate tokens
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    await UserModel.findByIdAndUpdate(
      user._id,
      { refresh_token: refreshToken, last_login_date: new Date() },
      { new: true }
    );

    // 6️⃣ Optional cookies
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000
    };
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // 7️⃣ Return response (same as loginController)
    return res.status(200).json({
      message: "Google login successful!",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      }
    });

  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false
    });
  }
}

export async function logoutController(req, res) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized request. No user ID found.",
                error: true,
                success: false
            });
        }

        // Clear refresh token from database
        await UserModel.findByIdAndUpdate(userId, {
            refresh_token: ""
        });

        // Clear cookies
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        };

        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        return res.status(200).json({
            message: "Logged out successfully!",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong during logout.",
            error: true,
            success: false
        });
    }
}

export async function uploadAvatar(req, res) {
    try {
        const userId = req.userId; // comes from auth middleware
        const image = req.file;    // comes from multer middleware

        if (!image) {
            return res.status(400).json({
                message: "No image provided",
                error: true,
                success: false
            });
        }

        // Upload image to Cloudinary
        const uploaded = await uploadUserImageDatatocloudinary(image);

        if (!uploaded?.url) {
            return res.status(500).json({
                message: "Image upload failed",
                error: true,
                success: false
            });
        }

        // Update user avatar
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { avatar: uploaded.url },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Profile image uploaded successfully",
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: uploaded.url
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong while uploading avatar.",
            error: true,
            success: false
        });
    }
}

export async function removeAvatar(req, res) {
    try {
        const userId = req.userId; // from auth middleware

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { avatar: "" },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Avatar removed successfully",
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: ""
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to remove avatar",
            error: true,
            success: false
        });
    }
}

export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId; // From auth middleware
        const { name, email, mobile, password, dob, gender } = req.body;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        if (email && email !== user.email) {
            const emailExists = await UserModel.findOne({ email });
            if (emailExists) {
                return res.status(409).json({
                    message: "Email already in use",
                    error: true,
                    success: false
                });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (mobile) updateData.mobile = mobile;
        if (dob) updateData.dob = dob;
        if (gender) updateData.gender = gender;

        if (password) {
            const salt = await bcryptjs.genSalt(10);
            updateData.password = await bcryptjs.hash(password, salt);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );

        return res.status(200).json({
            message: "User updated successfully",
            error: false,
            success: true,
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                mobile: updatedUser.mobile,
                dob: updatedUser.dob,
                gender: updatedUser.gender,
                avatar: updatedUser.avatar
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Error updating user",
            error: true,
            success: false
        });
    }
}

export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Email not registered",
                error: true,
                success: false
            });
        }

        // Generate OTP and expiry
        const otp = generateOtp(); // e.g., a 6-digit code
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save OTP and expiry to DB
        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: expiry.toISOString()
        });

        // Send OTP via email
        await sendEmailByNodeMailer({
            sendTo: email,
            subject: "Quickoo Forgot Password - OTP Code",
            html: forgotPasswordTemplate(user.name, otp)
        });

        return res.status(200).json({
            message: "OTP sent to your registered email.",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong while processing forgot password.",
            error: true,
            success: false
        });
    }
}

export async function verifyForgotPasswordOtp(req, res) {
    try {
        const { email, otp } = req.body;

        // Check if both fields are present
        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
                error: true,
                success: false
            });
        }

        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Email not registered",
                error: true,
                success: false
            });
        }

        // Check OTP expiry
        const currentTime = new Date();
        const otpExpiry = new Date(user.forgot_password_expiry);

        if (!user.forgot_password_expiry || otpExpiry < currentTime) {
            return res.status(400).json({
                message: "OTP has expired",
                error: true,
                success: false
            });
        }

        // Check OTP match
        if (otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            });
        }

        // Clear OTP fields
        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: "",
            forgot_password_expiry: ""
        });

        return res.status(200).json({
            message: "OTP verified successfully",
            success: true,
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong during OTP verification.",
            error: true,
            success: false
        });
    }
}

export async function resetPasswordController(req, res) {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        // Validate inputs
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "Email, New Password and Confirm Password are required",
                error: true,
                success: false
            });
        }

        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Email not registered",
                error: true,
                success: false
            });
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                error: true,
                success: false
            });
        }

        // Hash new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        // Update password and clear OTP data (if you want to be safe)
        await UserModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            forgot_password_otp: "",
            forgot_password_expiry: ""
        });

        return res.status(200).json({
            message: "Password reset successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong during password reset.",
            error: true,
            success: false
        });
    }
}

// export async function refreshToken(req, res) {
//   try {
//     const refreshToken =
//       req.cookies?.refreshToken ||
//       req.body?.refreshToken ||
//       (req.headers?.authorization?.startsWith("Bearer ")
//         ? req.headers.authorization.split(" ")[1]
//         : null);

//     if (!refreshToken) {
//       return res.status(401).json({ message: "Refresh token not provided.", error: true, success: false });
//     }

//     const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
//     const userId = decoded?.id;

//     const user = await UserModel.findById(userId);

//     if (!user || user.refresh_token !== refreshToken) {
//       return res.status(403).json({ message: "Invalid refresh token.", error: true, success: false });
//     }

//     const newAccessToken = await generateAccessToken(userId);

//     return res.status(200).json({
//       message: "New access token generated.",
//       error: false,
//       success: true,
//       data: { accessToken: newAccessToken }
//     });
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid or expired refresh token.", error: true, success: false });
//   }
// }
export async function refreshToken(req, res) {
  try {
    const refreshToken =
      req.cookies?.refreshToken ||
      req.body?.refreshToken ||
      (req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!refreshToken) {
      return res.status(401).json({ 
        message: "Refresh token not provided.", 
        error: true, 
        success: false 
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    const userId = decoded?.id;

    const user = await UserModel.findById(userId);

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(403).json({ 
        message: "Invalid refresh token.", 
        error: true, 
        success: false 
      });
    }

    const newAccessToken = await generateAccessToken(userId);

    // ✅ ADD THIS: Update access token in cookies too
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      message: "New access token generated.",
      error: false,
      success: true,
      data: { accessToken: newAccessToken }
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({ 
      message: "Invalid or expired refresh token.", 
      error: true, 
      success: false 
    });
  }
}

export async function userDetails(req, res) {
    try {
        const userId = req.userId; // comes from auth middleware

        const user = await UserModel.findById(userId).select('-password -refresh_token');

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "User details fetched successfully",
            data: user,
            error: false,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong while fetching user details",
            error: true,
            success: false
        });
    }
}

export const getAllUsersController = async (req, res) => {
    try {
        const users = await UserModel.find().select("-password -otp -__v -refresh_token -forgot_password_otp -forgot_password_expiry");

        res.status(200).json({
            success: true,
            message: "All users fetched successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

export const addToWishlistController = async (req, res) => {
  try {
    const userId = req.userId; // ✅ coming from auth middleware
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    await UserModel.findByIdAndUpdate(userId, {
      $addToSet: { wishlist: productId }
    });

    res.status(200).json({
      success: true,
      message: "Product added to wishlist"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
      error: error.message
    });
  }
};

export const removeFromWishlistController = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from auth middleware
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    await UserModel.findByIdAndUpdate(userId, {
      $pull: { wishlist: productId }
    });

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
      error: error.message
    });
  }
};

export const getUserWishlistProducts = async (req, res) => {
  try {
    const userId = req.userId; // ✅ From auth middleware

    const user = await UserModel.findById(userId).populate("wishlist");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist products",
      error: error.message
    });
  }
};


export const getUserReviews = async (req, res) => {
  try {
    const userId = req.userId; // ✅ From auth middleware

    // 🔍 Find user and populate their reviews
    const user = await UserModel.findById(userId)
      .populate({
        path: "reviews",
        populate: {
          path: "product",
          select: "name image price ratings slug"
        }
      })
      .select("name email avatar reviews");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.reviews || user.reviews.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No reviews found for this user",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: user.reviews.length,
      data: user.reviews
    });
  } catch (error) {
    console.error("❌ Error fetching user reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user reviews",
      error: error.message
    });
  }
};