// import React, { useEffect, useState } from 'react'
// import { IoMdEyeOff } from 'react-icons/io'
// import { IoEye } from 'react-icons/io5'
// import SummaryApi from '../comman/summaryApi'
// import toast from 'react-hot-toast'
// import AxiosToastError from '../utils/AxiosToastErroe'
// import Axios from '../utils/axios'
// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import zxcvbn from 'zxcvbn'

// const ResetPassword = () => {
//     const location = useLocation()
//     const navigate = useNavigate()

//     const [data, setData] = useState({
//         email: "",
//         newPassword: "",
//         confirmPassword: "",
//     })

//     const [showPassword, setShowPassword] = useState(false)
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false)

//     const validateValue = Object.values(data).every(el => el)

//     useEffect(() => {
//         if (!(location?.state?.data?.success)) {
//             navigate("/")
//         }

//         if (location?.state?.email) {
//             setData((prev) => ({
//                 ...prev,
//                 email: location?.state?.email
//             }))
//         }
//     }, [])

//     const handleChange = (e) => {
//         const { name, value } = e.target
//         setData(prev => ({
//             ...prev,
//             [name]: value
//         }))
//     }

//     const passwordStrength = zxcvbn(data.newPassword)

//     const handleSubmit = async (e) => {
//         e.preventDefault()

//         if (data.newPassword !== data.confirmPassword) {
//             toast.dismiss();
//             toast.error("Passwords must match")
//             return
//         }

//         try {
//             const response = await Axios({
//                 ...SummaryApi.resetPassword,
//                 data: data
//             })

//             if (response.data.error) {
//                 toast.dismiss();
//                 toast.error(response.data.message)
//             }

//             if (response.data.success) {
//                 toast.dismiss()
//                 toast.success(response.data.message)
//                 navigate("/login")
//                 setData({
//                     email: "",
//                     newPassword: "",
//                     confirmPassword: ""
//                 })
//             }
//         } catch (error) {
//             AxiosToastError(error)
//         }
//     }

//     return (
//         <section className="w-full container mx-auto px-4 flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
//             <div className="bg-white shadow-xl w-full max-w-md mx-auto rounded-2xl p-8">
//                 <p className="font-bold text-2xl text-gray-800 text-center mb-2">Set New Password</p>
//                 <p className="text-sm text-gray-500 text-center mb-6">Make sure it's strong and secure.</p>

//                 <form className="grid gap-4" onSubmit={handleSubmit}>
//                     {/* New Password */}
//                     <div className="grid gap-2">
//                         <label htmlFor="newPassword" className="font-medium text-gray-700">New Password</label>
//                         <div className="bg-amber-50 p-3 border border-amber-400 rounded-lg flex items-center focus-within:ring-2 focus-within:ring-amber-500">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 id="newPassword"
//                                 name="newPassword"
//                                 value={data.newPassword}
//                                 onChange={handleChange}
//                                 placeholder="Enter your new password"
//                                 className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
//                             />
//                             <div onClick={() => setShowPassword(prev => !prev)} className="cursor-pointer text-amber-500">
//                                 {showPassword ? <IoEye size={20} /> : <IoMdEyeOff size={20} />}
//                             </div>
//                         </div>
//                         <p className="text-xs text-gray-400">
//                             Must be at least 8 characters, include a number, symbol & uppercase letter.
//                         </p>
//                         {data.newPassword && (
//                             <div className="text-xs font-medium mt-1 text-gray-500">
//                                 Strength:{" "}
//                                 <span className={
//                                     passwordStrength.score < 2
//                                         ? "text-red-500"
//                                         : passwordStrength.score < 4
//                                             ? "text-yellow-500"
//                                             : "text-green-600"
//                                 }>
//                                     {["Very Weak", "Weak", "Fair", "Good", "Strong"][passwordStrength.score]}
//                                 </span>
//                             </div>
//                         )}
//                     </div>

//                     {/* Confirm Password */}
//                     <div className="grid gap-2">
//                         <label htmlFor="confirmPassword" className="font-medium text-gray-700">Confirm Password</label>
//                         <div className="bg-amber-50 p-3 border border-amber-400 rounded-lg flex items-center focus-within:ring-2 focus-within:ring-amber-500">
//                             <input
//                                 type={showConfirmPassword ? "text" : "password"}
//                                 id="confirmPassword"
//                                 name="confirmPassword"
//                                 value={data.confirmPassword}
//                                 onChange={handleChange}
//                                 placeholder="Confirm your password"
//                                 className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
//                             />
//                             <div onClick={() => setShowConfirmPassword(prev => !prev)} className="cursor-pointer text-amber-500">
//                                 {showConfirmPassword ? <IoEye size={20} /> : <IoMdEyeOff size={20} />}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                         disabled={!validateValue}
//                         className={`w-full text-white py-3 rounded-lg font-semibold tracking-wide transition-all duration-200 
//                         ${validateValue ? "bg-amber-500 hover:bg-amber-600" : "bg-gray-400 cursor-not-allowed"}`}>
//                         Change Password
//                     </button>
//                 </form>

//                 <p className="text-center text-gray-700 mt-6 text-sm">
//                     Already have an account?{" "}
//                     <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-700">
//                         Login
//                     </Link>
//                 </p>
//             </div>
//         </section>
//     )
// }

// export default ResetPassword


import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { IoMdEyeOff, IoMdLock } from 'react-icons/io'
import { IoEye, IoShieldCheckmark } from 'react-icons/io5'
import { FiCheckCircle, FiAlertCircle, FiKey, FiMail } from 'react-icons/fi'
import { MdOutlineSecurity } from "react-icons/md";

import SummaryApi from '../comman/summaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastErroe'
import Axios from '../utils/axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import zxcvbn from 'zxcvbn'

const PasswordInput = React.memo(({ 
  label, 
  value, 
  onChange, 
  showPassword, 
  onToggleVisibility,
  placeholder,
  name,
  strengthMeter = false,
  icon: Icon
}) => {
  const passwordStrength = useMemo(() => zxcvbn(value), [value])
  
  const getStrengthColor = (score) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']
    return colors[score] || colors[0]
  }

  const getStrengthText = (score) => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    return texts[score] || 'Very Weak'
  }

  const getStrengthMessage = (score) => {
    const messages = [
      'Too easy to guess',
      'Could be stronger',
      'Getting better',
      'Strong password',
      'Very strong!'
    ]
    return messages[score] || 'Too easy to guess'
  }

  return (
    <div className="grid gap-3">
      <label htmlFor={name} className="font-semibold text-gray-700 text-sm flex items-center gap-2">
        <Icon className="text-amber-600" size={16} />
        {label}
      </label>
      
      <div className="relative group">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-amber-600 transition-colors duration-200">
          <FiKey size={18} />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-gray-50/80 p-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 group-hover:border-gray-300"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors duration-200 p-2 rounded-lg hover:bg-amber-50"
        >
          {showPassword ? <IoEye size={20} /> : <IoMdEyeOff size={20} />}
        </button>
      </div>

      {strengthMeter && value && (
        <div className="space-y-3 bg-white/50 p-3 rounded-lg border border-gray-200/50">
          {/* Strength Indicator */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-600 text-sm">Strength:</span>
            <div className="flex items-center gap-2">
              <span 
                className="font-semibold text-sm transition-all duration-300"
                style={{ color: getStrengthColor(passwordStrength.score) }}
              >
                {getStrengthText(passwordStrength.score)}
              </span>
            </div>
          </div>
          
          {/* Strength Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
            <div 
              className="h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(passwordStrength.score + 1) * 20}%`,
                backgroundColor: getStrengthColor(passwordStrength.score),
                boxShadow: `0 0 8px ${getStrengthColor(passwordStrength.score)}30`
              }}
            />
          </div>

          {/* Dynamic Strength Message */}
          <div className="text-xs text-gray-600 italic transition-all duration-300">
            {getStrengthMessage(passwordStrength.score)}
          </div>
        </div>
      )}
    </div>
  )
})

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [data, setData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateValue = useMemo(() => 
        Object.values(data).every(el => el && el.trim()), 
        [data]
    )

    const passwordsMatch = useMemo(() => 
        data.newPassword === data.confirmPassword, 
        [data.newPassword, data.confirmPassword]
    )

    useEffect(() => {
        if (!(location?.state?.data?.success)) {
            navigate("/")
        }

        if (location?.state?.email) {
            setData((prev) => ({
                ...prev,
                email: location?.state?.email
            }))
        }
    }, [location, navigate])

    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }, [])

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev)
    }, [])

    const toggleConfirmPasswordVisibility = useCallback(() => {
        setShowConfirmPassword(prev => !prev)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!passwordsMatch) {
            toast.dismiss();
            toast.error("Passwords do not match")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await Axios({
                ...SummaryApi.resetPassword,
                data: data
            })

            if (response.data.error) {
                toast.dismiss();
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.dismiss()
                toast.success("Password reset successfully!")
                navigate("/login")
                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-4 sm:py-8 px-3 sm:px-4 flex items-center justify-center">
            <div className="w-full mx-auto max-w-3xl">
                {/* Compact Form Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/40">
                    {/* Form Header Inside Card */}
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <IoShieldCheckmark className="text-amber-600 text-lg" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Secure Password Reset
                            </h2>
                        </div>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Email Display (Read-only) */}
                        {data.email && (
                            <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3">
                                <label className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-2">
                                    <FiMail className="text-blue-600" size={14} />
                                    Reset password for
                                </label>
                                <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-blue-100">
                                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiMail className="text-white text-xs" />
                                    </div>
                                    <span className="text-gray-700 font-medium truncate text-sm">
                                        {data.email}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* New Password */}
                        <PasswordInput
                            label="New Password"
                            name="newPassword"
                            value={data.newPassword}
                            onChange={handleChange}
                            showPassword={showPassword}
                            onToggleVisibility={togglePasswordVisibility}
                            placeholder="Enter your new password"
                            strengthMeter={true}
                            icon={FiKey}
                        />

                        {/* Confirm Password */}
                        <PasswordInput
                            label="Confirm Password"
                            name="confirmPassword"
                            value={data.confirmPassword}
                            onChange={handleChange}
                            showPassword={showConfirmPassword}
                            onToggleVisibility={toggleConfirmPasswordVisibility}
                            placeholder="Confirm your password"
                            icon={IoShieldCheckmark}
                        />

                        {/* Password Match Indicator */}
                        {data.confirmPassword && (
                            <div className={`flex items-center gap-3 text-sm p-3 rounded-lg border transition-all duration-300 ${
                                passwordsMatch 
                                    ? 'bg-green-50/80 text-green-700 border-green-300' 
                                    : 'bg-red-50/80 text-red-700 border-red-300'
                            }`}>
                                {passwordsMatch ? (
                                    <FiCheckCircle className="flex-shrink-0 text-green-600" size={18} />
                                ) : (
                                    <FiAlertCircle className="flex-shrink-0 text-red-600" size={18} />
                                )}
                                <span className="font-medium">
                                    {passwordsMatch ? 'Passwords match!' : 'Passwords do not match'}
                                </span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!validateValue || !passwordsMatch || isSubmitting}
                            className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:transform-none ${
                                validateValue && passwordsMatch && !isSubmitting
                                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25 hover:shadow-amber-500/40"
                                    : "bg-gray-400 cursor-not-allowed shadow-gray-400/20"
                            } flex items-center justify-center gap-2 relative overflow-hidden group`}
                        >
                            {/* Animated background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm">Changing Password...</span>
                                </>
                            ) : (
                                <>
                                    <MdOutlineSecurity size={16} />
                                    <span className="text-sm">Change Password</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-5 pt-4 border-t border-gray-200/60">
                        <p className="text-gray-600 text-xs">
                            Remember your password?{" "}
                            <Link 
                                to="/login" 
                                className="font-semibold text-amber-600 hover:text-amber-700 transition-colors duration-200 underline underline-offset-2"
                            >
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Security Note */}
                <div className="text-center mt-4">
                    <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-white/40 shadow-sm">
                        <IoShieldCheckmark className="text-green-500 text-xs" />
                        <p className="text-xs text-gray-600">
                            Securely encrypted
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default React.memo(ResetPassword)