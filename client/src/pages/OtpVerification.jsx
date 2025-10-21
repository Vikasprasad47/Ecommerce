import React, { useEffect, useState, useRef } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { IoCheckmarkCircle } from 'react-icons/io5';
import toast, { Toaster } from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import AxiosToastError from '../utils/AxiosToastErroe';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OtpVerification = () => {
    const [otp, setOtp] = useState(["","","","","",""]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if(!location?.state?.email){
            navigate("/forgot-password");
        }
    }, [location, navigate]);

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto focus to next input
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
            
            // Auto focus to previous input on backspace
            if (!value && index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
        if (pasteData.length === 6) {
            const newOtp = pasteData.split('');
            setOtp(newOtp);
            inputRefs.current[5].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await Axios({
                ...SummaryApi.verify_forgot_password_otp,
                data: {
                    otp: otp.join(""),
                    email: location?.state?.email
                }
            });

            if (response.data.error) {
                toast.dismiss()
                toast.error(response.data.message);
            }

            if (response.data.success) {
                toast.dismiss();
                toast.success(response.data.message);
                setIsVerified(true);
                setTimeout(() => {
                    navigate("/reset-password", {
                        state: {
                            data: response.data,
                            email: location?.state?.email
                        }
                    });
                }, 1500);
            }
        } catch (error) {
            toast.dismiss()
            AxiosToastError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const allFieldsFilled = otp.every(digit => digit !== "");

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
            >
                <div className="p-8">
                    {/* Back button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-amber-600 hover:text-amber-800 mb-6 transition-colors"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back
                    </button>

                    {isVerified ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-8"
                        >
                            <IoCheckmarkCircle className="w-16 h-16 text-green-500 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">OTP Verified!</h2>
                            <p className="text-gray-600 mb-6 text-center">
                                Your OTP has been successfully verified. Redirecting to password reset...
                            </p>
                            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        </motion.div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
                                <p className="text-gray-600">
                                    We've sent a 6-digit code to <span className="font-medium">{location?.state?.email}</span>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-3">
                                        Enter verification code
                                    </label>
                                    <div className="flex justify-between gap-2">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={el => inputRefs.current[index] = el}
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleChange(e, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                onPaste={handlePaste}
                                                className="w-full h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                                autoFocus={index === 0}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!allFieldsFilled || isSubmitting}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
                                        allFieldsFilled && !isSubmitting
                                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </>
                                    ) : 'Verify OTP'}
                                </button>
                            </form>

                            <div className="mt-6 text-center text-sm text-gray-600">
                                <p>Didn't receive code? <button className="text-amber-600 font-medium hover:underline">Resend</button></p>
                                <p className="mt-4">Remember your password? <Link to="/login" className="text-amber-600 font-medium hover:underline">Login</Link></p>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>

            <Toaster 
                position="top-center"
                toastOptions={{
                    success: {
                        style: {
                            background: '#10B981',
                            color: 'white',
                        },
                    },
                    error: {
                        style: {
                            background: '#EF4444',
                            color: 'white',
                        },
                    },
                }}
            />
        </section>
    );
};

export default OtpVerification;