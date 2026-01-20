// import React, { useState } from 'react';
// import { IoMdEyeOff, IoMdLock, IoMdPerson } from "react-icons/io";
// import { IoEye, IoClose, IoMailOutline } from "react-icons/io5";
// import { FaGoogle, FaFacebook } from "react-icons/fa";
// import toast from 'react-hot-toast';
// import Axios from '../utils/network/axios';
// import SummaryApi from '../comman/summaryApi';
// import AxiosToastError from '../utils/network/AxiosToastError';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { MdLocalPhone } from "react-icons/md";
// import { FcGoogle } from "react-icons/fc";
// import { FaSquareFacebook } from "react-icons/fa6";
// import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
// import { MdPhone } from "react-icons/md";

// const Register = () => {
//   const [data, setData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     mobile: ""
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [acceptedTerms, setAcceptedTerms] = useState(false);
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
//   const [isPhoneLoading, setIsPhoneLoading] = useState(false);
//   const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
//   const navigate = useNavigate();

//   // Password strength logic
//   const passwordStrength = (() => {
//     const { password } = data;
//     const criteria = [
//       password.length >= 8,
//       /[A-Z]/.test(password),
//       /[a-z]/.test(password),
//       /[0-9]/.test(password),
//       /[!@#$%^&*(),.?":{}|<>]/.test(password)
//     ];
//     const score = criteria.filter(Boolean).length;
//     const levels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
//     const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-600"];
//     return {
//       score,
//       text: levels[score - 1] || "Too Short",
//       color: colors[score - 1] || "bg-gray-300",
//       width: `${(score / 5) * 100}%`
//     };
//   })();

//   const isPhoneValid = /^[6-9]\d{9}$/.test(data.mobile);
//   const isFormValid = Object.values(data).every(Boolean) && acceptedTerms && isPhoneValid;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSocialLogin = (provider) => {
//     toast.dismiss();
//     toast(`Coming Soon...`, { icon: '❗❗' });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setIsLoading(true);
//     try {
//       const response = await Axios({
//         ...SummaryApi.register,
//         data
//       });

//       if (response.data.error) {
//         toast.dismiss();
//         toast.error(response.data.message);
//       }

//       if (response.data.success) {
//         toast.dismiss();
//         toast.success(response.data.message);
//         setData({
//           name: "",
//           email: "",
//           password: "",
//           mobile: ""
//         });
//         navigate("/login");
//       }
//     } catch (error) {
//         toast.dismiss()
//         AxiosToastError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Google handler
//   const handleGoogleSuccess = async (token) => {
//     setIsGoogleLoading(true);
//     const toastId = toast.loading("Signing up with Google...");
//     try {
//       const response = await Axios({
//         ...SummaryApi.google_login,
//         data: { accessToken: token },
//       });

//       if (response.data.error) throw new Error(response.data.message);

//       toast.dismiss(toastId);
//       toast.success("Account created!");
//       navigate("/"); // or navigate('/onboarding')
//     } catch (err) {
//       toast.dismiss(toastId);
//       AxiosToastError(err);
//     } finally {
//       setIsGoogleLoading(false);
//     }
//   };

//   const handleGoogleError = () => {
//     toast.error("Google signup failed");
//     setIsGoogleLoading(false);
//   };

//   // Google Button Component
//   const GoogleSignupBtn = () => {
//     const login = useGoogleLogin({
//       onSuccess: (res) => handleGoogleSuccess(res.access_token),
//       onError: handleGoogleError,
//       flow: "implicit",
//     });

//     return (
//       <button
//         disabled={isGoogleLoading}
//         onClick={login}
//         className="flex items-center justify-center w-full py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
//       >
//         {isGoogleLoading ? (
//           <div className="flex items-center text-sm">
//             <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full mr-2 animate-spin"></div>
//             Connecting...
//           </div>
//         ) : (
//           <>
//             <FcGoogle className="mr-2" /> <span className="text-sm">Google</span>
//           </>
//         )}
//       </button>
//     );
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-white to-amber-200 p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="relative w-full max-w-3xl flex flex-col lg:flex-row overflow-hidden rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-amber-100"
//       >
//         {/* Left Panel */}
//         <div className="w-full p-4 flex flex-col justify-center bg-gradient-to-b from-amber-50 to-white">
//           <h2 className="text-3xl font-bold text-amber-700 mb-2 text-center lg:text-left mt-3">Create Account</h2>
//           <p className="text-gray-600 mb-4 text-center lg:text-left text-sm">
//             Join our marketplace and enjoy exclusive shopping offers.
//           </p>

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Name */}
//                 <div>
//                 <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
//                 <div className="relative">
//                     <IoMdPerson className="absolute left-3 top-3.5 text-gray-400" />
//                     <input
//                     type="text"
//                     name="name"
//                     value={data.name}
//                     onChange={handleChange}
//                     required
//                     placeholder="John Doe"
//                     className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
//                     />
//                 </div>
//                 </div>

//                 {/* Mobile */}
//                 <div>
//                 <label className="block text-sm font-medium mb-1 text-gray-700">Phone Number</label>
//                 <div className="relative">
//                     <MdLocalPhone className="absolute left-3 top-3.5 text-gray-400" />
//                     <input
//                     type="tel"
//                     name="mobile"
//                     value={data.mobile}
//                     onChange={handleChange}
//                     required
//                     placeholder="Enter your phone number"
//                     className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
//                     />
//                 </div>
//                 {data.mobile && !isPhoneValid && (
//                     <p className="text-xs text-red-600 mt-1">Enter a valid 10-digit Indian number</p>
//                 )}
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Email */}
//                 <div>
//                 <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
//                 <div className="relative">
//                     <IoMailOutline className="absolute left-3 top-3.5 text-gray-400" />
//                     <input
//                     type="email"
//                     name="email"
//                     value={data.email}
//                     onChange={handleChange}
//                     required
//                     placeholder="you@example.com"
//                     className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
//                     />
//                 </div>
//                 </div>


//                 {/* Password */}
//                 <div>
//                 <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
//                 <div className="relative">
//                     <IoMdLock className="absolute left-3 top-3.5 text-gray-400" />
//                     <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={data.password}
//                     onChange={handleChange}
//                     required
//                     placeholder="••••••••"
//                     className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
//                     />
//                     <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
//                     >
//                     {showPassword ? <IoEye className="h-5 w-5" /> : <IoMdEyeOff className="h-5 w-5" />}
//                     </button>
//                 </div>

//                 {/* Strength Bar */}
//                 {data.password && (
//                     <div className="mt-3">
//                     <div className="flex justify-between text-xs mb-1">
//                         <span className="text-gray-500">Strength:</span>
//                         <span className={`font-medium ${passwordStrength.color.replace("bg-", "text-")}`}>
//                         {passwordStrength.text}
//                         </span>
//                     </div>
//                     <motion.div
//                         className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
//                         initial={{ width: 0 }}
//                         animate={{ width: '100%' }}
//                     >
//                         <motion.div
//                         className={`h-2 rounded-full ${passwordStrength.color}`}
//                         animate={{ width: passwordStrength.width }}
//                         transition={{ duration: 0.4 }}
//                         />
//                     </motion.div>
//                     </div>
//                 )}
//                 </div>
//             </div>

//             {/* Terms */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={acceptedTerms}
//                 onChange={() => setAcceptedTerms(!acceptedTerms)}
//                 required
//                 className="mt-0 h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
//               />
//               <label className="ml-2 text-sm text-gray-600">
//                 I agree to the{' '}
//                 <a href="/terms" className="text-amber-600 hover:text-amber-500 font-medium">
//                   Terms and Conditions
//                 </a>
//               </label>
//             </div>

//             {/* Button */}
//             <motion.button
//               type="submit"
//               disabled={!isFormValid || isLoading}
//               whileHover={isFormValid ? { scale: 1.02 } : {}}
//               whileTap={isFormValid ? { scale: 0.98 } : {}}
//               className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
//                 isFormValid && !isLoading
//                   ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg"
//                   : "bg-gray-300 cursor-not-allowed"
//               }`}
//             >
//               {isLoading ? "Creating Account..." : "Sign Up"}
//             </motion.button>
//           </form>

//           {/* Divider */}
//           <div className="relative my-4">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center">
//               <span className="px-3 bg-white text-sm text-gray-500">OR SIGN UP WITH</span>
//             </div>
//           </div>

//           {/* Social Buttons */}
//           <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

//     {/* Google Signup */}
//     <GoogleSignupBtn />

//     {/* Phone Signup */}
//     <button
//       disabled={isPhoneLoading}
//       onClick={() => {
//         setIsPhoneLoading(true);
//         setTimeout(() => navigate("/register/phone"), 400);
//       }}
//       className="flex items-center justify-center w-full py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
//     >
//       {isPhoneLoading ? (
//         <div className="flex items-center text-sm">
//           <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full mr-2 animate-spin"></div>
//           Redirecting...
//         </div>
//       ) : (
//         <>
//           <MdPhone className="text-gray-700 mr-2" size={18} />
//           <span className="text-sm">Phone</span>
//         </>
//       )}
//     </button>

//   </div>
//           </GoogleOAuthProvider>


//           {/* Login Link */}
//           <p className="mt-6 text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="text-amber-600 hover:text-amber-500 font-medium">
//               Log in
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Register;

import React, { useState, useMemo } from "react";
import { IoMdEyeOff, IoMdLock, IoMdPerson } from "react-icons/io";
import { IoEye, IoMailOutline } from "react-icons/io5";
import { MdLocalPhone, MdPhone } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";
import Axios from "../utils/network/axios";
import SummaryApi from "../comman/summaryApi";
import AxiosToastError from "../utils/network/AxiosToastError";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../Store/userSlice";
import fetchUserDetails from "../utils/auth/fetchUserDetails";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);

  const navigate = useNavigate();
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const passwordStrength = useMemo(() => {
    const { password } = data;
    const criteria = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ];
    const score = criteria.filter(Boolean).length;
    const levels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-emerald-600",
    ];
    return {
      score,
      text: levels[score - 1] || "Too Short",
      color: colors[score - 1] || "bg-gray-300",
      width: `${(score / 5) * 100}%`,
    };
  }, [data.password]);

  const isPhoneValid = /^[6-9]\d{9}$/.test(data.mobile);
  const isFormValid =
    Object.values(data).every(Boolean) && acceptedTerms && isPhoneValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     const response = await Axios({ ...SummaryApi.register, data });
  //     if (response.data.error) {
  //       toast.error(response.data.message);
  //       return;
  //     }
  //     toast.success(response.data.message);
  //     navigate("/login");
  //   } catch (error) {
  //     AxiosToastError(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await Axios({ ...SummaryApi.register, data });

    if (response.data.error) {
      toast.error(response.data.message);
      return;
    }

    const { accessToken, refreshToken, user } = response.data.data;

    // ✅ Save tokens
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // ✅ Set redux user immediately
    if (user) dispatch(setUserDetails(user));

    // ✅ Optional: fetch full user profile
    const userDetails = await fetchUserDetails();
    if (userDetails?.data) {
      dispatch(setUserDetails(userDetails.data));
    }

    toast.success("Welcome! Your account is ready 🚀");

    // 🔥 AUTO LOGIN REDIRECT
    navigate("/", { replace: true });

  } catch (error) {
    AxiosToastError(error);
  } finally {
    setIsLoading(false);
  }
};

  const handleGoogleSuccess = async (token) => {
    setIsGoogleLoading(true);
    const toastId = toast.loading("Signing up with Google...");
    try {
      const response = await Axios({
        ...SummaryApi.google_login,
        data: { accessToken: token },
      });
      if (response.data.error) throw new Error(response.data.message);
      toast.dismiss(toastId);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.dismiss(toastId);
      AxiosToastError(err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google signup failed");
    setIsGoogleLoading(false);
  };

  const GoogleSignupBtn = () => {
    const login = useGoogleLogin({
      onSuccess: (res) => handleGoogleSuccess(res.access_token),
      onError: handleGoogleError,
      flow: "implicit",
    });

    return (
      <button
        disabled={isGoogleLoading}
        onClick={login}
        className="flex items-center justify-center w-full py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition font-medium shadow-sm cursor-pointer"
      >
        {isGoogleLoading ? (
          <div className="flex items-center text-sm">
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full mr-2 animate-spin"></div>
            Connecting...
          </div>
        ) : (
          <>
            <FcGoogle size={20} className="mr-2" /> Google
          </>
        )}
      </button>
    );
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-white p-4">
        <Toaster position="top-center" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full lg:max-w-xl bg-white rounded-3xl shadow-2xl p-5 space-y-6 relative"
        >
          <h2 className="text-2xl font-bold text-amber-700 text-center mt-3 mb-3">
            Create Account
          </h2>

          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <IoMdPerson className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <MdLocalPhone className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  name="mobile"
                  value={data.mobile}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                />
                {data.mobile && !isPhoneValid && (
                  <p className="text-xs text-red-600 mt-1">
                    Enter a valid 10-digit Indian number
                  </p>
                )}
              </div>
            </div>

            <div className="relative">
              <IoMailOutline className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <IoMdLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <IoEye /> : <IoMdEyeOff />}
              </button>

              {data.password && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Strength:</span>
                    <span
                      className={`font-medium ${passwordStrength.color.replace(
                        "bg-",
                        "text-"
                      )}`}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-2 rounded-full ${passwordStrength.color}`}
                      animate={{ width: passwordStrength.width }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>

            <label
              htmlFor="accept-terms"
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <input
                id="accept-terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={() => setAcceptedTerms((prev) => !prev)}
                required
                className="sr-only"
              />

              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                  acceptedTerms
                    ? "bg-amber-500 border-amber-500"
                    : "bg-white border-gray-300"
                }`}
              >
                {acceptedTerms && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-amber-600 hover:text-amber-500 font-medium"
                >
                  Terms and Conditions
                </a>
              </span>
            </label>


            <motion.button
              type="submit"
              disabled={!isFormValid || isLoading}
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all cursor-pointer ${
                isFormValid && !isLoading
                  ? "bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </motion.button>
          </form>

          <div className="my-4 text-center text-gray-500">OR SIGN UP WITH</div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            <GoogleSignupBtn/>
            <button
              disabled={isPhoneLoading}
              onClick={() => {
                setIsPhoneLoading(true);
                setTimeout(() => navigate("/register/phone"), 400);
              }}
              className="flex items-center justify-center w-full py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition font-medium shadow-sm cursor-pointer"
            >
              {isPhoneLoading ? (
                <div className="flex items-center text-sm">
                  <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full mr-2 animate-spin"></div>
                  Redirecting...
                </div>
              ) : (
                <>
                  <MdPhone size={20} className="mr-2" /> Phone
                </>
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-600 hover:text-amber-500 font-medium"
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
