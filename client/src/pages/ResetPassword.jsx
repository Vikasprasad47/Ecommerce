import React, { useEffect, useState } from 'react'
import { IoMdEyeOff } from 'react-icons/io'
import { IoEye } from 'react-icons/io5'
import SummaryApi from '../comman/summaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastErroe'
import Axios from '../utils/axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import zxcvbn from 'zxcvbn'

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

    const validateValue = Object.values(data).every(el => el)

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
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const passwordStrength = zxcvbn(data.newPassword)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.newPassword !== data.confirmPassword) {
            toast.dismiss();
            toast.error("Passwords must match")
            return
        }

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
                toast.success(response.data.message)
                navigate("/login")
                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="w-full container mx-auto px-4 flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
            <div className="bg-white shadow-xl w-full max-w-md mx-auto rounded-2xl p-8">
                <p className="font-bold text-2xl text-gray-800 text-center mb-2">Set New Password</p>
                <p className="text-sm text-gray-500 text-center mb-6">Make sure it's strong and secure.</p>

                <form className="grid gap-6" onSubmit={handleSubmit}>
                    {/* New Password */}
                    <div className="grid gap-2">
                        <label htmlFor="newPassword" className="font-medium text-gray-700">New Password</label>
                        <div className="bg-amber-50 p-3 border border-amber-400 rounded-lg flex items-center focus-within:ring-2 focus-within:ring-amber-500">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="newPassword"
                                name="newPassword"
                                value={data.newPassword}
                                onChange={handleChange}
                                placeholder="Enter your new password"
                                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
                            />
                            <div onClick={() => setShowPassword(prev => !prev)} className="cursor-pointer text-amber-500">
                                {showPassword ? <IoEye size={20} /> : <IoMdEyeOff size={20} />}
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">
                            Must be at least 8 characters, include a number, symbol & uppercase letter.
                        </p>
                        {data.newPassword && (
                            <div className="text-xs font-medium mt-1 text-gray-500">
                                Strength:{" "}
                                <span className={
                                    passwordStrength.score < 2
                                        ? "text-red-500"
                                        : passwordStrength.score < 4
                                            ? "text-yellow-500"
                                            : "text-green-600"
                                }>
                                    {["Very Weak", "Weak", "Fair", "Good", "Strong"][passwordStrength.score]}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="grid gap-2">
                        <label htmlFor="confirmPassword" className="font-medium text-gray-700">Confirm Password</label>
                        <div className="bg-amber-50 p-3 border border-amber-400 rounded-lg flex items-center focus-within:ring-2 focus-within:ring-amber-500">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
                            />
                            <div onClick={() => setShowConfirmPassword(prev => !prev)} className="cursor-pointer text-amber-500">
                                {showConfirmPassword ? <IoEye size={20} /> : <IoMdEyeOff size={20} />}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={!validateValue}
                        className={`w-full text-white py-3 rounded-lg font-semibold tracking-wide transition-all duration-200 
                        ${validateValue ? "bg-amber-500 hover:bg-amber-600" : "bg-gray-400 cursor-not-allowed"}`}>
                        Change Password
                    </button>
                </form>

                <p className="text-center text-gray-700 mt-6 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-700">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    )
}

export default ResetPassword
