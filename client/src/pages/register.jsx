import React, { useState, useEffect } from 'react';
import { IoMdEyeOff, IoMdLock, IoMdPerson } from "react-icons/io";
import { IoEye, IoClose, IoMailOutline } from "react-icons/io5";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import toast from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import AxiosToastError from '../utils/AxiosToastErroe';
import { useNavigate, Link } from 'react-router-dom';
import sideimg from '../assets/sideimg.png';
import { motion } from 'framer-motion';
import { MdLocalPhone } from "react-icons/md";


const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const navigate = useNavigate();

    const passwordCriteria = {
        length: data.password.length >= 8,
        uppercase: /[A-Z]/.test(data.password),
        lowercase: /[a-z]/.test(data.password),
        number: /[0-9]/.test(data.password),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(data.password)
    };
    const isPhoneValid = /^[6-9]\d{9}$/.test(data.mobile);

    const showValidation = data.password.length > 0;
    const isPasswordStrong = Object.values(passwordCriteria).every(Boolean);
    const isFormValid = Object.values(data).every(Boolean) &&
                    isPasswordStrong &&
                    data.password === data.confirmPassword &&
                    acceptedTerms &&
                    isPhoneValid;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    // Social login handlers
    const handleSocialLogin = (provider) => {
        toast.dismiss();
        toast(`Coming Soon...`, { icon: '❗❗' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (data.password !== data.confirmPassword) {
            toast.dismiss();
            toast.error("Password & Confirm Password do not match!");
            return;
        }

        setIsLoading(true);

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data
            });

            if (response.data.error) {
                toast.dismiss();
                toast.error(response.data.message);
            }

            if (response.data.success) {
                toast.dismiss();
                toast.success(response.data.message);
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
                navigate("/login");
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 bg-gradient-to-br from-amber-50 to-amber-100 lg:items-center lg:justify-center xl:flex xl:items-center xl:justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2 bg-white mt-17"
            >
                {/* Close Button */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700"
                >
                    <IoClose className="w-6 h-6" />
                </button>

                {/* Left Column - Form */}
                <div className="p-8 sm:p-12 flex flex-col">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="lg:text-3xl text-2xl font-bold mb-2 text-amber-800">Create Your Account</h1>
                        <p className="text-gray-600 text-sm">
                            Join our community and start your Shopping
                        </p>
                    </div>

                    {/* Registration Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <IoMdPerson className="h-5 w-5" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm focus:outline-none sm:text-sm"
                                    value={data.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <IoMailOutline className="h-5 w-5" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm focus:outline-none sm:text-sm"
                                    value={data.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Mobile Field */}
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium mb-1 text-gray-700">
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <MdLocalPhone className="h-5 w-5"/>
                                </div>
                                <input
                                    id="mobile"
                                    type="tel"
                                    name="mobile"
                                    className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm focus:outline-none sm:text-sm"
                                    value={data.mobile}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your phone number"
                                />
                                {data.mobile && !isPhoneValid && (
                                    <p className="mt-1 text-xs text-red-600">Please enter a valid 10-digit Indian phone number.</p>
                                )}
                            </div>
                        </div>


                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <IoMdLock className="h-5 w-5" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="block w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm focus:outline-none sm:text-sm"
                                    value={data.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <IoEye className="h-5 w-5" /> : <IoMdEyeOff className="h-5 w-5" />}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {showValidation && (
                                <div className="mt-3">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-medium text-gray-600">Password strength</span>
                                        <span className={`text-xs font-medium ${
                                            isPasswordStrong ? 'text-green-600' : 'text-amber-600'
                                        }`}>
                                            {isPasswordStrong ? 'Strong' : 'Weak'}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div 
                                            className={`h-1.5 rounded-full ${
                                                isPasswordStrong ? 'bg-green-600' : 'bg-amber-500'
                                            }`} 
                                            style={{ 
                                                width: `${(Object.values(passwordCriteria).filter(Boolean).length / 5) * 100}%` 
                                            }}
                                        ></div>
                                    </div>
                                    
                                    {/* Password Criteria */}
                                    <ul className="mt-3 space-y-1 text-xs text-gray-600">
                                        <li className={`flex items-center gap-2 ${passwordCriteria.length ? 'text-green-600' : 'text-gray-500'}`}>
                                            <GiConfirmed className="inline" /> At least 8 characters
                                        </li>
                                        <li className={`flex items-center gap-2 ${passwordCriteria.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                            <GiConfirmed className="inline" /> One uppercase letter
                                        </li>
                                        <li className={`flex items-center gap-2 ${passwordCriteria.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                            <GiConfirmed className="inline" /> One lowercase letter
                                        </li>
                                        <li className={`flex items-center gap-2 ${passwordCriteria.number ? 'text-green-600' : 'text-gray-500'}`}>
                                            <GiConfirmed className="inline" /> One number
                                        </li>
                                        <li className={`flex items-center gap-2 ${passwordCriteria.specialChar ? 'text-green-600' : 'text-gray-500'}`}>
                                            <GiConfirmed className="inline" /> One special character
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <IoMdLock className="h-5 w-5" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    className={`block w-full pl-10 pr-10 py-3 rounded-lg border ${
                                        data.confirmPassword && data.password !== data.confirmPassword 
                                            ? 'border-red-300' 
                                            : 'border-gray-300'
                                    } placeholder-gray-500 text-gray-900 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm focus:outline-none sm:text-sm`}
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <IoEye className="h-5 w-5" /> : <IoMdEyeOff className="h-5 w-5" />}
                                </button>
                            </div>
                            {data.confirmPassword && data.password !== data.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600">Passwords don't match</p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={() => setAcceptedTerms(!acceptedTerms)}
                                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                    required
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="font-medium text-gray-700">
                                    I agree to the{' '}
                                    <a href="#" className="text-amber-600 hover:text-amber-500">
                                        Terms and Conditions
                                    </a>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            whileHover={isFormValid ? { scale: 1.02 } : {}}
                            whileTap={isFormValid ? { scale: 0.98 } : {}}
                            className={`w-full px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all duration-300 ${!isFormValid || isLoading ? 
                                'bg-gray-300 cursor-not-allowed' : 
                                'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </div>
                            ) : 'Sign Up'}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-2 text-sm bg-white text-gray-500">
                                OR SIGN UP WITH
                            </span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                            onClick={() => handleSocialLogin('Google')}
                        >
                            <FaGoogle className="text-red-500 mr-2" />
                            <span className="text-xs sm:text-sm">Google</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                            onClick={() => handleSocialLogin('Facebook')}
                        >
                            <FaFacebook className="text-blue-600 mr-2" />
                            <span className="text-xs sm:text-sm">Facebook</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                            onClick={() => handleSocialLogin('GitHub')}
                        >
                            <FaGithub className="text-gray-800 mr-2" />
                            <span className="text-xs sm:text-sm">GitHub</span>
                        </motion.button>
                    </div>

                    {/* Login Link */}
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            className="font-medium text-amber-600 hover:text-amber-500"
                        >
                            Log in
                        </Link>
                    </div>
                </div>

                {/* Right Column - Image */}
                <div className="hidden lg:block relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-amber-800/40"></div>
                    <img 
                        src={sideimg}
                        alt="Welcome illustration" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Register;