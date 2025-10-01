import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserCircle, FaCamera, FaLock, FaChevronDown, FaSave, FaStar, FaQuestionCircle } from 'react-icons/fa'
import { MdEmail, MdPhone, MdCalendarToday, MdTransgender, MdNotifications, MdCreditCard, MdPrivacyTip, MdReviews, MdOutlineCloudUpload } from 'react-icons/md'
import { TbLogout, TbCategoryPlus, TbBrandProducthunt, TbDiscount, TbHelp } from 'react-icons/tb'
import { LuUsers, LuPackageCheck } from 'react-icons/lu'
import { GrMapLocation } from 'react-icons/gr'
import { RiCoinsLine } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import UserFileUploadAvatar from '../components/UserFileUploadAvatar'
import Axios from '../utils/axios'
import SummaryApi from '../comman/summaryApi'
import toast from 'react-hot-toast'
import { setUserDetails, logout } from '../Store/userSlice'
import fetchUserDetails from '../utils/featchUserDetails'
import isAdmin from '../utils/IsAdmin'

const Profile = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
  })
  const [loading, setLoading] = useState(false)
  const [openAvatarEdit, setOpenAvatarEdit] = useState(false)
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // 'profile', 'settings', 'activity'

  useEffect(() => {
    setUserData({
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      dob: user.dob ? user.dob.split('T')[0] : '',
      gender: user.gender || '',
    })
  }, [user])

  const handleChange = e => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleGenderSelect = (gender) => {
    setUserData(prev => ({ ...prev, gender }))
    setGenderDropdownOpen(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await Axios({ ...SummaryApi.updateUserDetails, data: userData })
      if (res.data.success) {
        toast.dismiss()
        toast.success(res.data.message)
        const userdata = await fetchUserDetails()
        dispatch(setUserDetails(userdata.data))
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      setLoading(true)
      const res = await Axios(SummaryApi.removeUserAvatar)
      if (res.data.success) {
        toast.dismiss();
        toast.success('Avatar removed successfully.')
        const userdata = await fetchUserDetails()
        dispatch(setUserDetails(userdata.data))
      } else {
        toast.dismiss();
        toast.error(res.data.message || 'Failed to remove avatar.')
      }
    } catch {
      toast.dismiss();
      toast.error('Error removing avatar.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout })
      if (response.data.success) {
        dispatch(logout())
        localStorage.clear()
        navigate('/')
        toast.dismiss()
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  const genderOptions = [
    { value: "Male", label: "Male", icon: "♂", color: "text-blue-500" },
    { value: "Female", label: "Female", icon: "♀", color: "text-pink-500" },
    { value: "Other", label: "Other", icon: "⚧", color: "text-purple-500" },
    { value: "Prefer not to say", label: "Prefer not to say", icon: "?", color: "text-gray-500" },
  ]

  // Navigation Item Component
  const NavItem = ({ to, label, Icon, onClick }) => (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex justify-between items-center py-3 px-4 hover:bg-amber-50 text-gray-700 font-medium rounded-xl transition-colors group"
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-amber-600" />
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50/70">
      <div className="max-w-6xl mx-auto">

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-amber-400 to-amber-400 p-6 md:p-8 text-white relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.4)_1px,_transparent_0)] bg-[size:20px_20px]"></div>
                </div>
                
                <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-8 relative z-10">
                  <div className="relative group">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/80 shadow-2xl cursor-pointer ring-4 ring-amber-200/50 transition-all duration-300 group-hover:ring-amber-300/70">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onClick={() => setOpenAvatarEdit(true)}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-400 text-white text-6xl"
                          onClick={() => setOpenAvatarEdit(true)}
                        >
                          <FaUserCircle />
                        </div>
                      )}
                    </div>
                    <div
                      onClick={() => setOpenAvatarEdit(true)}
                      className="absolute bottom-2 right-2 bg-amber-600 text-white p-3 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:bg-amber-700 hover:scale-110 group-hover:animate-pulse"
                      title="Change avatar"
                    >
                      <FaCamera size={16} />
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{user.name}</h2>
                    <p className="text-amber-100 mt-2 flex items-center justify-center md:justify-start">
                      <MdEmail className="mr-2 text-amber-200" />
                      {user.email}
                    </p>
                    <p className="text-amber-100 mt-1 flex items-center justify-center md:justify-start">
                      <MdPhone className="mr-2 text-amber-200" />
                      {user.mobile}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                      {user.avatar && (
                        <button
                          onClick={handleRemoveAvatar}
                          disabled={loading}
                          className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all duration-300 flex items-center shadow-sm border border-white/20"
                        >
                          Remove Avatar
                        </button>
                      )}
                      <Link to={"/forgot-password"} className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all duration-300 flex items-center shadow-sm border border-white/20">
                        <FaLock className="mr-2 text-sm" /> Change Password
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-6 md:p-8">
                {openAvatarEdit && <UserFileUploadAvatar close={() => setOpenAvatarEdit(false)} />}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUserCircle className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={userData.name}
                          onChange={handleChange}
                          required
                          className="pl-10 w-full rounded-xl border-gray-200 border-2 py-3.5 px-4 focus:border-amber-500 focus:ring-amber-500 shadow-sm transition-all duration-300"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    {/* Email - Read Only */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdEmail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={userData.email}
                          onChange={handleChange}
                          readOnly
                          className="pl-10 w-full rounded-xl border-gray-200 border-2 py-3.5 px-4 bg-gray-50/50 cursor-not-allowed shadow-sm"
                          placeholder="Your email address"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500 ml-1">Email cannot be changed</p>
                    </div>

                    {/* Mobile */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Mobile Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="mobile"
                          value={userData.mobile}
                          onChange={handleChange}
                          required
                          className="pl-10 w-full rounded-xl border-gray-200 border-2 py-3.5 px-4 focus:border-amber-500 focus:ring-amber-500 shadow-sm transition-all duration-300"
                          placeholder="Your mobile number"
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Date of Birth</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdCalendarToday className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="dob"
                          value={userData.dob}
                          onChange={handleChange}
                          required
                          className="pl-10 w-full rounded-xl border-gray-200 border-2 py-3.5 px-4 focus:border-amber-500 focus:ring-amber-500 shadow-sm transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Enhanced Gender Selection */}
                    <div className="relative md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Gender</label>
                      <div className="relative">
                        <div 
                          className="pl-10 pr-10 w-full rounded-xl border-2 border-gray-200 py-3.5 px-4 focus:border-amber-500 shadow-sm bg-white cursor-pointer flex items-center justify-between transition-all duration-300 hover:border-gray-300"
                          onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
                        >
                          <div className="flex items-center">
                            <MdTransgender className="h-5 w-5 text-gray-400 absolute left-3" />
                            <span className={userData.gender ? "text-gray-800 font-medium" : "text-gray-500"}>
                              {userData.gender || "Select your gender"}
                            </span>
                          </div>
                          <FaChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${genderDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                        
                        {/* Enhanced Dropdown */}
                        {genderDropdownOpen && (
                          <div className="absolute z-[999] -mt-50 w-full rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
                            <div className="py-2">
                              {genderOptions.map((option) => (
                                <div
                                  key={option.value}
                                  className={`px-4 py-3 cursor-pointer flex items-center transition-all duration-200 hover:bg-amber-50 group ${
                                    userData.gender === option.value ? 'bg-amber-100 text-amber-700' : 'text-gray-700'
                                  }`}
                                  onClick={() => handleGenderSelect(option.value)}
                                >
                                  <span className={`text-lg mr-3 ${option.color} group-hover:scale-110 transition-transform`}>{option.icon}</span>
                                  <span className="font-medium">{option.label}</span>
                                  {userData.gender === option.value && (
                                    <span className="ml-auto text-amber-600">
                                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200/70 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-8 py-3.5 rounded-xl font-medium text-white transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 ${
                        loading ? 'bg-amber-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl transform hover:-translate-y-0.5'
                      }`}
                    >
                      {loading ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <FaSave className="text-lg" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <h2 className="text-2xl font-bold text-orange-800 mb-6">Account Settings</h2>
              
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <MdNotifications className="text-amber-600" />
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">Manage how you receive notifications</p>
                  <button className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition">
                    Configure Notifications
                  </button>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <MdPrivacyTip className="text-amber-600" />
                    Privacy & Security
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">Manage your privacy settings and security options</p>
                  <button className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition">
                    Privacy Settings
                  </button>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <MdCreditCard className="text-amber-600" />
                    Payment Methods
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">Manage your saved payment methods</p>
                  <button className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition">
                    Manage Payments
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <h2 className="text-2xl font-bold text-orange-800 mb-6">My Activity</h2>
              
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <MdReviews className="text-amber-600" />
                    My Reviews
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">View and manage your product reviews</p>
                  <button className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition">
                    View All Reviews
                  </button>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <FaQuestionCircle className="text-amber-600" />
                    Questions & Answers
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">See your questions and answers on products</p>
                  <button className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition">
                    View Q&A
                  </button>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <TbDiscount className="text-amber-600" />
                    My Coupons
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">View and manage your available coupons</p>
                  <button className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition">
                    View Coupons
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default Profile