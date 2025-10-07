// import React, { useState, useEffect } from 'react';
// import { IoMdEyeOff, IoMdLock } from "react-icons/io";
// import { IoEye, IoClose, IoMailOutline } from "react-icons/io5";
// import { FcGoogle } from "react-icons/fc";
// import toast, { Toaster } from 'react-hot-toast';
// import Axios from '../utils/axios';
// import SummaryApi from '../comman/summaryApi';
// import fetchUserDetails from '../utils/featchUserDetails';
// import { useNavigate, Link } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { setUserDetails } from '../Store/userSlice';
// import welcomeimg from '../assets/wecomeback.jpg';
// import { motion, AnimatePresence } from 'framer-motion';
// import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

// // Google Login Component
// const GoogleLoginButton = ({ onSuccess, onError, isLoading }) => {
//   const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   // Debug client ID on component mount
//   useEffect(() => {
//     // console.log('🔑 Google Client ID loaded:', GOOGLE_CLIENT_ID ? 'Yes' : 'No');
//     if (!GOOGLE_CLIENT_ID) {
//       console.error('❌ Missing VITE_GOOGLE_CLIENT_ID in environment variables');
//       toast.error('Google login not configured', {
//         duration: 5000,
//         icon: '⚙️'
//       });
//     }
//   }, [GOOGLE_CLIENT_ID]);

//   const login = useGoogleLogin({
//     onSuccess: (response) => {
//       // console.log('✅ Google OAuth success:', response);
      
//       // Send access_token to backend (Method 1 in your controller)
//       if (response.access_token) {
//         onSuccess(response.access_token);
//       } else {
//         onError(new Error('No access token received from Google'));
//       }
//     },
//     onError: (error) => {
//       console.error('❌ Google OAuth error:', error);
      
//       let errorMessage = "Google authentication failed";
//       if (error?.error === 'popup_closed') {
//         errorMessage = "Google login was cancelled";
//       } else if (error?.error === 'access_denied') {
//         errorMessage = "Google login was denied";
//       } else if (error?.error === 'idpiframe_initialization_failed') {
//         errorMessage = "Google login not configured properly. Check your Client ID.";
//       }
      
//       onError(new Error(errorMessage));
//     },
//     // Using implicit flow for access tokens (simpler)
//     flow: 'implicit',
//     scope: 'email profile openid',
//   });

//   if (!GOOGLE_CLIENT_ID) {
//     return (
//       <div className="w-full py-3 px-4 rounded-xl bg-yellow-50 border border-yellow-200 text-center">
//         <span className="text-sm font-medium text-yellow-700">
//           ⚠️ Google login not configured
//         </span>
//       </div>
//     );
//   }

//   return (
//     <motion.button
//       whileHover={{ 
//         scale: 1.05, 
//         y: -2,
//         boxShadow: "0 5px 15px -3px rgba(0, 0, 0, 0.1)"
//       }}
//       whileTap={{ scale: 0.95 }}
//       disabled={isLoading}
//       className={`flex items-center justify-center w-full py-3 rounded-xl border transition-all duration-200 ${
//         isLoading 
//           ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-70' 
//           : 'bg-white border-gray-300 hover:border-amber-300 hover:bg-amber-50 cursor-pointer'
//       }`}
//       onClick={() => {
//         // console.log('🔄 Starting Google OAuth flow...');
//         login();
//       }}
//       type="button"
//     >
//       {isLoading ? (
//         <div className="flex items-center">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full mr-2"
//           />
//           <span className="text-sm font-medium text-gray-500">Connecting to Google...</span>
//         </div>
//       ) : (
//         <>
//           <FcGoogle size={20} />
//           <span className="ml-3 text-sm font-medium text-gray-700">Continue with Google</span>
//         </>
//       )}
//     </motion.button>
//   );
// };

// const Login = () => {
//   const [data, setData] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Google Client ID
//   const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   // Load saved credentials
//   useEffect(() => {
//     const savedEmail = localStorage.getItem('rememberedEmail');
//     const savedPassword = localStorage.getItem('rememberedPassword');

//     if (savedEmail && savedPassword) {
//       setData({ email: savedEmail, password: savedPassword });
//       setRememberMe(true);
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setData(prev => ({ ...prev, [name]: value }));
//   };

//   const validateForm = Object.values(data).every(el => el);

//   // Handle Google Login Success
//   const handleGoogleLoginSuccess = async (googleAccessToken) => {
//     setIsGoogleLoading(true);
//     const loadingToast = toast.loading("Authenticating with Google...");

//     try {
//       // console.log('📤 Sending Google access token to backend...', {
//       //   tokenLength: googleAccessToken?.length,
//       //   first10: googleAccessToken?.substring(0, 10) + '...'
//       // });

//       const response = await Axios({ 
//         ...SummaryApi.google_login, 
//         data: { accessToken: googleAccessToken } // Send as accessToken
//       });

//       // console.log("✅ Backend response:", response);

//       if (!response.data) {
//         throw new Error("No response data received from server");
//       }

//       if (response.data.error) {
//         throw new Error(response.data.message || "Google authentication failed");
//       }

//       if (response.data.success) {
//         const { accessToken, refreshToken, user } = response.data.data;
        
//         if (!accessToken || !refreshToken) {
//           throw new Error("Authentication tokens missing from response");
//         }

//         // Store tokens in localStorage
//         localStorage.setItem("accessToken", accessToken);
//         localStorage.setItem("refreshToken", refreshToken);

//         // Update toast to success
//         toast.dismiss(loadingToast);
//         toast.success("login successful!", { 
//           duration: 2000,
//         });

//         // Dispatch user info to Redux store
//         if (user) {
//           dispatch(setUserDetails(user));
//         }

//         // Navigate to home page after success message
//         setTimeout(() => {
//           navigate("/");
//         }, 1500);

//         // Fetch additional user details in background
//         try {
//           const userDetails = await fetchUserDetails();
//           if (userDetails?.data) {
//             dispatch(setUserDetails(userDetails.data));
//           }
//         } catch (err) {
//           console.warn("Note: Could not fetch additional user details:", err);
//         }
//       }
//     } catch (error) {
//       console.error("❌ Google login error:", error);
      
//       let errorMessage = "Google login failed";
      
//       if (error.response) {
//         // Server responded with error status
//         errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
//         console.error('Server error details:', error.response.data);
//       } else if (error.request) {
//         // Request was made but no response received
//         errorMessage = "No response from server. Please check your connection.";
//       } else {
//         // Something else happened
//         errorMessage = error.message || "Google authentication failed";
//       }

//       toast.dismiss(loadingToast);
//       toast.error(`❌ ${errorMessage}`, { 
//         duration: 5000,
//       });
//     } finally {
//       setIsGoogleLoading(false);
//     }
//   };

//   // Handle Google Login Error
//   const handleGoogleLoginError = (error) => {
//     console.error('❌ Google OAuth component error:', error);
//     setIsGoogleLoading(false);
    
//     toast.error(`❌ ${error.message}`, {
//       duration: 5000,
//     });
//   };

//   // Regular email/password login handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm) {
//       toast.error("Please fill all fields", { 
//         duration: 3000,
//         icon: '📝'
//       });
//       return;
//     }

//     setIsLoading(true);
//     const loadingToast = toast.loading("Signing in...");

//     try {
//       const response = await Axios({ ...SummaryApi.login, data });

//       if (!response.data) throw new Error("No response data received");

//       if (response.data.error) {
//         throw new Error(response.data.message || "Login failed");
//       }

//       if (response.data.success) {
//         const { accessToken, refreshToken, user } = response.data.data;
        
//         if (!accessToken || !refreshToken) throw new Error("Missing tokens");

//         // Store tokens
//         localStorage.setItem("accessToken", accessToken);
//         localStorage.setItem("refreshToken", refreshToken);

//         // Remember credentials if checked
//         if (rememberMe) {
//           localStorage.setItem('rememberedEmail', data.email);
//           localStorage.setItem('rememberedPassword', data.password);
//         } else {
//           localStorage.removeItem('rememberedEmail');
//           localStorage.removeItem('rememberedPassword');
//         }

//         toast.dismiss(loadingToast);
//         toast.success("Login successful!", { 
//           duration: 2000,
//         });

//         // Dispatch user info
//         if (user) dispatch(setUserDetails(user));

//         // Navigate to home
//         setTimeout(() => {
//           setData({ email: "", password: "" });
//           navigate("/");
//         }, 1500);

//         // Fetch additional user details in background
//         fetchUserDetails()
//           .then((userDetails) => {
//             if (userDetails?.data) dispatch(setUserDetails(userDetails.data));
//           })
//           .catch((err) => console.warn("Note: Error fetching user details:", err));
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.dismiss(loadingToast);
//       toast.error(error?.response?.data?.message || error.message || "Login failed", { 
//         duration: 4000,
//         icon: '❌'
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//       <div className="min-h-screen p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 lg:flex lg:items-center lg:justify-center">
//         <Toaster 
//           position="top-center"
//           toastOptions={{
//             duration: 4000,
//             style: {
//               background: '#fff',
//               color: '#374151',
//               boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//               borderRadius: '12px',
//               fontSize: '14px',
//               fontWeight: '500',
//             },
//           }}
//         />

//         <motion.div
//           initial={{ opacity: 0, y: 20, scale: 0.95 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//           className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2 bg-white border border-amber-100"
//         >
//           {/* Close Button */}
//           <motion.button
//             whileHover={{ scale: 1.1, rotate: 90 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => navigate("/")}
//             className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-gray-700 transition-colors shadow-lg hover:shadow-xl"
//             aria-label="Close login"
//           >
//             <IoClose className="w-5 h-5" />
//           </motion.button>

//           {/* Left Column - Form */}
//           <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//               className="text-center mb-8"
//             >
//               <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
//                 Welcome Back
//               </h1>
//               <p className="text-gray-600 text-sm sm:text-base">Sign in to your account to continue</p>
//             </motion.div>

//             {/* Google Login Button */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="mb-1"
//             >
//               <GoogleLoginButton 
//                 onSuccess={handleGoogleLoginSuccess}
//                 onError={handleGoogleLoginError}
//                 isLoading={isGoogleLoading}
//               />
//             </motion.div>

//             {/* Divider */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               className="relative my-3"
//             >
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center">
//                 <span className="px-3 text-sm bg-white text-gray-500 font-medium">OR SIGN IN WITH EMAIL</span>
//               </div>
//             </motion.div>

//             {/* Email/Password Form */}
//             <motion.form 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.5 }}
//               className="space-y-6" 
//               onSubmit={handleSubmit}
//             >
//               {/* Email Field */}
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//               >
//                 <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
//                   Email Address
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-600 transition-colors">
//                     <IoMailOutline className="h-5 w-5" />
//                   </div>
//                   <input
//                     id="email"
//                     type="email"
//                     name="email"
//                     value={data.email}
//                     onChange={handleChange}
//                     placeholder="you@example.com"
//                     className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm focus:outline-none transition-all duration-200 group-hover:border-amber-300 sm:text-sm"
//                     autoComplete="email"
//                     required
//                   />
//                 </div>
//               </motion.div>

//               {/* Password Field */}
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.7 }}
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
//                     Password
//                   </label>
//                   <Link 
//                     to="/forgot-password" 
//                     className="text-xs font-medium text-amber-600 hover:text-amber-500 transition-colors hover:underline"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-600 transition-colors">
//                     <IoMdLock className="h-5 w-5" />
//                   </div>
//                   <input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={data.password}
//                     onChange={handleChange}
//                     placeholder="••••••••"
//                     className="block w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm focus:outline-none transition-all duration-200 group-hover:border-amber-300 sm:text-sm"
//                     autoComplete="current-password"
//                     required
//                   />
//                   <motion.button
//                     type="button"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowPassword(prev => !prev)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-amber-600 transition-colors"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     <AnimatePresence mode="wait">
//                       <motion.div
//                         key={showPassword ? 'show' : 'hide'}
//                         initial={{ scale: 0.8, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         exit={{ scale: 0.8, opacity: 0 }}
//                         transition={{ duration: 0.2 }}
//                       >
//                         {showPassword ? <IoEye className="h-5 w-5" /> : <IoMdEyeOff className="h-5 w-5" />}
//                       </motion.div>
//                     </AnimatePresence>
//                   </motion.button>
//                 </div>
//               </motion.div>

//               {/* Remember Me & Submit Button */}
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.8 }}
//                 className="flex flex-col items-start justify-between flex-wrap gap-4 pt-2 w-full"
//               >
//                 <div className="flex items-center group cursor-pointer">
//                   <div className="relative">
//                     <input
//                       id="remember-me"
//                       type="checkbox"
//                       checked={rememberMe}
//                       onChange={() => setRememberMe(!rememberMe)}
//                       className="sr-only"
//                     />
//                     <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
//                       rememberMe 
//                         ? 'bg-amber-500 border-amber-500' 
//                         : 'bg-white border-gray-300 group-hover:border-amber-400'
//                     }`}>
//                       {rememberMe && (
//                         <motion.svg
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           className="w-3 h-3 text-white"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                         </motion.svg>
//                       )}
//                     </div>
//                   </div>
//                   <label 
//                     htmlFor="remember-me" 
//                     className="ml-3 block text-sm text-gray-700 cursor-pointer select-none group-hover:text-gray-900 transition-colors"
//                   >
//                     Remember me
//                   </label>
//                 </div>

//                 <motion.button
//                   type="submit"
//                   disabled={!validateForm || isLoading}
//                   whileHover={validateForm && !isLoading ? { 
//                     scale: 1.02,
//                     boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)"
//                   } : {}}
//                   whileTap={validateForm && !isLoading ? { scale: 0.98 } : {}}
//                   className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 min-w-full h-12 flex items-center justify-center ${
//                     !validateForm || isLoading
//                       ? 'bg-gray-300 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
//                   } relative overflow-hidden`}
//                 >
//                   <AnimatePresence mode="wait">
//                     {isLoading ? (
//                       <motion.div
//                         key="loading"
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.8 }}
//                         className="flex items-center justify-center"
//                       >
//                         <motion.div
//                           animate={{ rotate: 360 }}
//                           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                           className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
//                         />
//                         <span>Signing In...</span>
//                       </motion.div>
//                     ) : (
//                       <motion.span
//                         key="signin"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                       >
//                         Sign In
//                       </motion.span>
//                     )}
//                   </AnimatePresence>
//                 </motion.button>
//               </motion.div>
//             </motion.form>

//             {/* Sign Up Link */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.9 }}
//               className="mt-6 text-center text-sm text-gray-600"
//             >
//               Don't have an account?{' '}
//               <Link 
//                 to="/register" 
//                 className="font-semibold text-amber-600 hover:text-amber-500 transition-colors hover:underline"
//               >
//                 Create one
//               </Link>
//             </motion.div>
//           </div>

//           {/* Right Column - Image */}
//           <motion.div 
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3 }}
//             className="hidden lg:block relative overflow-hidden"
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-orange-900/20 to-amber-800/30 z-10"></div>
//             <motion.img 
//               initial={{ scale: 1.1 }}
//               animate={{ scale: 1 }}
//               transition={{ duration: 0.8 }}
//               src={welcomeimg} 
//               alt="Welcome illustration" 
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute bottom-8 left-8 right-8 z-20 text-white">
//               <motion.h2
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//                 className="text-2xl font-bold mb-2 drop-shadow-lg"
//               >
//                 Join Our Community
//               </motion.h2>
//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.8 }}
//                 className="text-amber-100 drop-shadow"
//               >
//                 Access exclusive features and connect with others
//               </motion.p>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// };

// export default Login;


import React, { useState, useEffect } from 'react';
import { IoMdEyeOff, IoMdLock } from "react-icons/io";
import { IoEye, IoClose, IoMailOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import fetchUserDetails from '../utils/featchUserDetails';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../Store/userSlice';
import welcomeimg from '../assets/wecomeback.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

// Google Login Component
const GoogleLoginButton = ({ onSuccess, onError, isLoading }) => {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Debug client ID on component mount
  useEffect(() => {
    // console.log('🔑 Google Client ID loaded:', GOOGLE_CLIENT_ID ? 'Yes' : 'No');
    if (!GOOGLE_CLIENT_ID) {
      console.error('❌ Missing VITE_GOOGLE_CLIENT_ID in environment variables');
      toast.error('Google login not configured', {
        duration: 5000,
        icon: '⚙️'
      });
    }
  }, [GOOGLE_CLIENT_ID]);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      // console.log('✅ Google OAuth success:', response);
      
      // Send access_token to backend (Method 1 in your controller)
      if (response.access_token) {
        onSuccess(response.access_token);
      } else {
        onError(new Error('No access token received from Google'));
      }
    },
    onError: (error) => {
      console.error('❌ Google OAuth error:', error);
      
      let errorMessage = "Google authentication failed";
      if (error?.error === 'popup_closed') {
        errorMessage = "Google login was cancelled";
      } else if (error?.error === 'access_denied') {
        errorMessage = "Google login was denied";
      } else if (error?.error === 'idpiframe_initialization_failed') {
        errorMessage = "Google login not configured properly. Check your Client ID.";
      }
      
      onError(new Error(errorMessage));
    },
    // Using implicit flow for access tokens (simpler)
    flow: 'implicit',
    scope: 'email profile openid',
  });

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="w-full py-3 px-4 rounded-xl bg-yellow-50 border border-yellow-200 text-center">
        <span className="text-sm font-medium text-yellow-700">
          ⚠️ Google login not configured
        </span>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05, 
        y: -2,
        boxShadow: "0 5px 15px -3px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.95 }}
      disabled={isLoading}
      className={`flex items-center justify-center w-full py-3 rounded-xl border transition-all duration-200 ${
        isLoading 
          ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-70' 
          : 'bg-white border-gray-300 hover:border-amber-300 hover:bg-amber-50 cursor-pointer'
      }`}
      onClick={() => {
        // console.log('🔄 Starting Google OAuth flow...');
        login();
      }}
      type="button"
    >
      {isLoading ? (
        <div className="flex items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full mr-2"
          />
          <span className="text-sm font-medium text-gray-500">Connecting to Google...</span>
        </div>
      ) : (
        <>
          <FcGoogle size={20} />
          <span className="ml-3 text-sm font-medium text-gray-700">Continue with Google</span>
        </>
      )}
    </motion.button>
  );
};

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Google Client ID
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Load saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');

    if (savedEmail && savedPassword) {
      setData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = Object.values(data).every(el => el);

  // Handle Google Login Success
  const handleGoogleLoginSuccess = async (googleAccessToken) => {
    setIsGoogleLoading(true);
    const loadingToast = toast.loading("Authenticating with Google...");

    try {
      // console.log('📤 Sending Google access token to backend...', {
      //   tokenLength: googleAccessToken?.length,
      //   first10: googleAccessToken?.substring(0, 10) + '...'
      // });

      const response = await Axios({ 
        ...SummaryApi.google_login, 
        data: { accessToken: googleAccessToken } // Send as accessToken
      });

      // console.log("✅ Backend response:", response);

      if (!response.data) {
        throw new Error("No response data received from server");
      }

      if (response.data.error) {
        throw new Error(response.data.message || "Google authentication failed");
      }

      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data;
        
        if (!accessToken || !refreshToken) {
          throw new Error("Authentication tokens missing from response");
        }

        // Store tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Update toast to success
        toast.dismiss(loadingToast);
        toast.success("login successful!");

        // Dispatch user info to Redux store
        if (user) {
          dispatch(setUserDetails(user));
        }

        // Navigate to home page after success message
        setTimeout(() => {
          navigate("/");
        }, 1500);

        // Fetch additional user details in background
        try {
          const userDetails = await fetchUserDetails();
          if (userDetails?.data) {
            dispatch(setUserDetails(userDetails.data));
          }
        } catch (err) {
          console.warn("Note: Could not fetch additional user details:", err);
        }
      }
    } catch (error) {
      console.error("❌ Google login error:", error);
      
      let errorMessage = "Google login failed";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.error('Server error details:', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = error.message || "Google authentication failed";
      }

      toast.dismiss(loadingToast);
      toast.error(`❌ ${errorMessage}`, { 
        duration: 5000,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle Google Login Error
  const handleGoogleLoginError = (error) => {
    console.error('❌ Google OAuth component error:', error);
    setIsGoogleLoading(false);
    
    toast.error(`❌ ${error.message}`, {
      duration: 5000,
    });
  };

  // Regular email/password login handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm) {
      toast.error("Please fill all fields", { 
        duration: 3000,
        icon: '📝'
      });
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Signing in...");

    try {
      const response = await Axios({ ...SummaryApi.login, data });

      if (!response.data) throw new Error("No response data received");

      if (response.data.error) {
        throw new Error(response.data.message || "Login failed");
      }

      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data;
        
        if (!accessToken || !refreshToken) throw new Error("Missing tokens");

        // Store tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Remember credentials if checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', data.email);
          localStorage.setItem('rememberedPassword', data.password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }

        toast.dismiss(loadingToast);
        toast.success("Login successful!", { 
          duration: 2000,
        });

        // Dispatch user info
        if (user) dispatch(setUserDetails(user));

        // Navigate to home
        setTimeout(() => {
          setData({ email: "", password: "" });
          navigate("/");
        }, 1500);

        // Fetch additional user details in background
        fetchUserDetails()
          .then((userDetails) => {
            if (userDetails?.data) dispatch(setUserDetails(userDetails.data));
          })
          .catch((err) => console.warn("Note: Error fetching user details:", err));
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.dismiss(loadingToast);
      toast.error(error?.response?.data?.message || error.message || "Login failed", { 
        duration: 4000,
        icon: '❌'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 lg:flex lg:items-center lg:justify-center">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2 bg-white border border-amber-100"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-gray-700 transition-colors shadow-lg hover:shadow-xl"
            aria-label="Close login"
          >
            <IoClose className="w-5 h-5" />
          </motion.button>

          {/* Left Column - Form */}
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">Sign in to your account to continue</p>
            </motion.div>

            {/* Email/Password Form */}
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-6" 
              onSubmit={handleSubmit}
            >
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-600 transition-colors">
                    <IoMailOutline className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm focus:outline-none transition-all duration-200 group-hover:border-amber-300 sm:text-sm"
                    autoComplete="email"
                    required
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs font-medium text-amber-600 hover:text-amber-500 transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-600 transition-colors">
                    <IoMdLock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm focus:outline-none transition-all duration-200 group-hover:border-amber-300 sm:text-sm"
                    autoComplete="current-password"
                    required
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-amber-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={showPassword ? 'show' : 'hide'}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {showPassword ? <IoEye className="h-5 w-5" /> : <IoMdEyeOff className="h-5 w-5" />}
                      </motion.div>
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>

              {/* Remember Me & Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-start justify-between flex-wrap gap-4 pt-2 w-full"
              >
                <div className="flex items-center group cursor-pointer">
                  <div className="relative">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                      rememberMe 
                        ? 'bg-amber-500 border-amber-500' 
                        : 'bg-white border-gray-300 group-hover:border-amber-400'
                    }`}>
                      {rememberMe && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                  </div>
                  <label 
                    htmlFor="remember-me" 
                    className="ml-3 block text-sm text-gray-700 cursor-pointer select-none group-hover:text-gray-900 transition-colors"
                  >
                    Remember me
                  </label>
                </div>

                <motion.button
                  type="submit"
                  disabled={!validateForm || isLoading}
                  whileHover={validateForm && !isLoading ? { 
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)"
                  } : {}}
                  whileTap={validateForm && !isLoading ? { scale: 0.98 } : {}}
                  className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 min-w-full h-12 flex items-center justify-center ${
                    !validateForm || isLoading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                  } relative overflow-hidden`}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center justify-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        <span>Signing In...</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="signin"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Sign In
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </motion.form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="relative my-6"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-sm bg-white text-gray-500 font-medium">OR CONTINUE WITH</span>
              </div>
            </motion.div>

            {/* Google Login Button - MOVED TO BOTTOM */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mb-4"
            >
              <GoogleLoginButton 
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                isLoading={isGoogleLoading}
              />
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-4 text-center text-sm text-gray-600"
            >
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-semibold text-amber-600 hover:text-amber-500 transition-colors hover:underline"
              >
                Create one
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Image */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-orange-900/20 to-amber-800/30 z-10"></div>
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              src={welcomeimg} 
              alt="Welcome illustration" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-8 right-8 z-20 text-white">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-2xl font-bold mb-2 drop-shadow-lg"
              >
                Join Our Community
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-amber-100 drop-shadow"
              >
                Access exclusive features and connect with others
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;