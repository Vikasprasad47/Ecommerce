import React, { useState, useEffect } from 'react';
import { IoClose, IoMailOutline, IoLockOpenOutline } from "react-icons/io5";
import { FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import toast, { Toaster } from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import AxiosToastError from '../utils/AxiosToastErroe';
import { Link, useNavigate } from 'react-router-dom';
import forgotpasswordimg from '../assets/forgotpassword.jpg';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
    const [data, setData] = useState({ email: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Email validation effect
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(emailRegex.test(data.email));
    }, [data.email]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        
        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: data
            });
            
            if (response.data.error) {
                toast.dismiss();
                toast.error(response.data.message);
            }

            if (response.data.success) {
                toast.dismiss();
                toast.success(response.data.message);
                setSuccess(true);
                setTimeout(() => {
                    navigate("/Otp-Verification", { state: data });
                }, 2000);
            }
        } catch (error) {
            toast.dismiss()
            AxiosToastError(error);
        } finally {
            setIsSubmitting(false);
        }
    };    

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-amber-50 to-blue-50 px-4 py-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
                <div className="flex flex-col md:flex-row h-full">
                    {/* Left Content - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col relative">
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => navigate("/")}
                                className="flex items-center text-gray-600 hover:text-amber-700 transition-colors"
                            >
                                <FiArrowLeft className="w-5 h-5 mr-1" />
                                Back to Home
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="text-gray-500 hover:text-amber-700 transition-colors"
                            >
                                <IoClose className="w-6 h-6" />
                            </button>
                        </div>

                        <AnimatePresence>
                            {success ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center h-full text-center py-10"
                                >
                                    <div className="relative mb-6">
                                        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center">
                                            <FiCheckCircle className="w-12 h-12 text-amber-600" />
                                        </div>
                                        <div className="absolute -top-2 -right-2">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <IoLockOpenOutline className="w-5 h-5 text-blue-600" />
                                            </div>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">OTP Sent Successfully!</h2>
                                    <p className="text-gray-600 mb-6 max-w-md">
                                        We've sent a one-time password to your email address. Please check your inbox and also the spam folder.
                                    </p>
                                    <div className="flex space-x-2 items-center text-sm text-amber-600">
                                        <div className="h-2 w-2 bg-amber-600 rounded-full animate-ping"></div>
                                        <span>Redirecting to OTP verification...</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="mb-8 text-center md:text-left">
                                        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                                            <IoLockOpenOutline className="w-8 h-8 text-amber-600" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                            Forgot Password?
                                        </h2>
                                        <p className="text-gray-600">
                                            Don't worry! Enter your email address and we'll send you a verification code to reset your password.
                                        </p>
                                    </div>

                                    <form className="space-y-6" onSubmit={handleSubmit}>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <IoMailOutline className="h-5 w-5 text-amber-500" />
                                                </div>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    className={`w-full pl-10 pr-10 py-3 border outline-none ${emailValid && data.email ? 'border-green-300 bg-green-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all`}
                                                    value={data.email}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="your@email.com"
                                                />
                                                {emailValid && data.email && (
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                        <FiCheckCircle className="h-5 w-5 text-green-500" />
                                                    </div>
                                                )}
                                            </div>
                                            {emailValid && data.email && (
                                                <p className="mt-1 text-sm text-green-600">Email format is valid</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!emailValid || isSubmitting}
                                            className={`w-full py-3.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
                                                emailValid && !isSubmitting
                                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                                : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending OTP...
                                                </>
                                            ) : 'Send Verification Code'}
                                        </button>
                                    </form>

                                    <div className="mt-8 text-center">
                                        <p className="text-sm text-gray-600">
                                            Remember your password?{' '}
                                            <Link 
                                                to="/login" 
                                                className="text-amber-600 hover:text-amber-800 font-medium transition-colors underline"
                                            >
                                                Sign in to your account
                                            </Link>
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Side - Image and Information */}
                    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-50 to-amber-50 p-10 flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-200 rounded-full opacity-20"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-200 rounded-full opacity-20"></div>
                        
                        <div className="relative z-10 text-center text-gray-800">
                            <img
                                src={forgotpasswordimg}
                                alt="Password recovery"
                                className="w-full h-auto max-h-[280px] object-contain mb-8"
                            />
                            <h3 className="text-2xl font-bold mb-4">Secure Account Recovery</h3>
                            <p className="text-gray-700 max-w-md mx-auto">
                                We use industry-standard security practices to ensure your account remains protected during the password reset process.
                            </p>
                            
                            <div className="mt-8 grid grid-cols-1 gap-4 text-left">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                        <IoMailOutline className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Email Verification</h4>
                                        <p className="text-sm text-gray-600">We'll send a secure code to your email</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-amber-100 p-2 rounded-lg mr-3">
                                        <FiCheckCircle className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Quick Process</h4>
                                        <p className="text-sm text-gray-600">Get back to your account in minutes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    success: {
                        icon: '✅',
                        style: {
                            background: '',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        },
                    },
                    error: {
                        icon: '❌',
                        style: {
                            background: '',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        },
                    },
                }}
            />
        </section>
    );
};

export default ForgotPassword;