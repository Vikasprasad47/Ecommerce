// import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Link, useNavigate } from 'react-router-dom'
// import { 
//   FaUserCircle, FaCamera, FaLock, FaChevronDown, 
//   FaSave, FaShoppingBag 
// } from 'react-icons/fa'
// import { 
//   MdEmail, MdPhone, MdCalendarToday, MdTransgender, 
//   MdSecurity, MdNotifications, MdLocationOn 
// } from 'react-icons/md'
// import { TbPackage, TbDiscount, TbLogout } from 'react-icons/tb'
// import toast from 'react-hot-toast'
// import Axios from '../utils/axios'
// import SummaryApi from '../comman/summaryApi'
// import fetchUserDetails from '../utils/featchUserDetails'
// import { setUserDetails, logout } from '../Store/userSlice'
// import UserFileUploadAvatar from '../components/UserFileUploadAvatar'
// import { IoIosSettings } from "react-icons/io";
// import { IoIosGift } from "react-icons/io";


// const Profile = () => {
//   const { name, email, mobile, dob, gender, avatar } = useSelector(state => state.user)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const [formData, setFormData] = useState({ name: '', email: '', mobile: '', dob: '', gender: '' })
//   const [loading, setLoading] = useState(false)
//   const [openAvatarEdit, setOpenAvatarEdit] = useState(false)
//   const [genderDropdownOpen, setGenderDropdownOpen] = useState(false)
//   const [activeTab, setActiveTab] = useState('profile')

//   const genderDropdownRef = useRef(null)

//   // Gender options (memoized)
//   const genderOptions = useMemo(() => [
//     { value: "Male", label: "Male", icon: "♂" },
//     { value: "Female", label: "Female", icon: "♀" },
//     { value: "Other", label: "Other", icon: "⚧" },
//     { value: "Prefer not to say", label: "Prefer not to say", icon: "?" },
//   ], [])

//   // Initialize form data
//   useEffect(() => {
//     setFormData({
//       name: name || '',
//       email: email || '',
//       mobile: mobile || '',
//       dob: dob ? dob.split('T')[0] : '',
//       gender: gender || '',
//     })
//   }, [name, email, mobile, dob, gender])

//   // Close gender dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = e => {
//       if (genderDropdownRef.current && !genderDropdownRef.current.contains(e.target)) {
//         setGenderDropdownOpen(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const handleChange = useCallback(e => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }, [])

//   const handleGenderSelect = useCallback(value => {
//     setFormData(prev => ({ ...prev, gender: value }))
//     setGenderDropdownOpen(false)
//   }, [])

//   const handleSubmit = async e => {
//     e.preventDefault()
//     if (loading) return
//     setLoading(true)
//     try {
//       const res = await Axios({ ...SummaryApi.updateUserDetails, data: formData })
//       if (res.data.success) {
//         toast.success('Profile updated successfully')
//         const userRes = await fetchUserDetails()
//         dispatch(setUserDetails(userRes.data))
//       } else toast.error(res.data.message || 'Update failed')
//     } catch {
//       toast.error('Error updating profile')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleRemoveAvatar = async () => {
//     if (loading) return
//     setLoading(true)
//     try {
//       const res = await Axios(SummaryApi.removeUserAvatar)
//       if (res.data.success) {
//         toast.success('Avatar removed successfully')
//         const userRes = await fetchUserDetails()
//         dispatch(setUserDetails(userRes.data))
//       } else toast.error('Failed to remove avatar')
//     } catch {
//       toast.error('Error removing avatar')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleLogout = async () => {
//     try {
//       const res = await Axios({ ...SummaryApi.logout })
//       if (res.data.success) {
//         dispatch(logout())
//         localStorage.clear()
//         navigate('/')
//         toast.success('Logged out successfully')
//       }
//     } catch {
//       toast.error('Logout failed')
//     }
//   }

//   // Tab items (memoized)
//   const tabItems = useMemo(() => [
//     { id: 'profile', label: 'Profile', icon: FaUserCircle },
//     { id: 'rewards', label: 'Rewards', icon: IoIosGift  },
//     { id: 'security', label: 'Security', icon: MdSecurity },
//     { id: 'settings', label: 'Settings', icon: IoIosSettings },
//   ], [])

//   const quickActions = useMemo(() => [
//     { icon: MdSecurity, label: "Privacy & Security", description: "Manage your account security settings" },
//     { icon: MdNotifications, label: "Notifications", description: "Configure your notification preferences" },
//     { icon: MdLocationOn, label: "Addresses", description: "Manage your delivery addresses" },
//     { icon: TbDiscount, label: "Coupons & Offers", description: "View available coupons and offers" },
//   ], [])

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-full mx-auto px-4 pb-4">
//         {openAvatarEdit && <UserFileUploadAvatar close={() => setOpenAvatarEdit(false)} />}

//         {/* Tabs */}
//         <div className="flex overflow-x-auto gap-3 bg-white border border-gray-200 rounded-2xl p-2 mb-3 shadow-sm">
//           {tabItems.map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 min-w-[120px] ${
//                 activeTab === tab.id
//                   ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
//                   : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
//               }`}
//             >
//               <tab.icon className="text-lg" />
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         <div className="transition-all duration-300">
//           {activeTab === 'profile' && (
//             <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Name */}
//                 <FormField
//                   label="Full Name"
//                   icon={<FaUserCircle />}
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//                 {/* Email */}
//                 <FormField
//                   label="Email Address"
//                   icon={<MdEmail />}
//                   name="email"
//                   value={formData.email}
//                   readOnly
//                 />
//                 {/* Mobile */}
//                 <FormField
//                   label="Mobile Number"
//                   icon={<MdPhone />}
//                   name="mobile"
//                   value={formData.mobile}
//                   onChange={handleChange}
//                   required
//                 />
//                 {/* DOB */}
//                 <FormField
//                   label="Date of Birth"
//                   icon={<MdCalendarToday />}
//                   name="dob"
//                   value={formData.dob}
//                   type="date"
//                   onChange={handleChange}
//                   required
//                 />

//                 {/* Gender */}
//                 <div ref={genderDropdownRef} className="md:col-span-2 relative">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
//                   <button
//                     type="button"
//                     onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
//                     className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-500 hover:border-gray-400 transition"
//                   >
//                     <span className="flex items-center gap-2 text-gray-700">
//                       <MdTransgender className="text-gray-400" />
//                       {formData.gender || "Select Gender"}
//                     </span>
//                     <FaChevronDown className={`transition-transform ${genderDropdownOpen ? 'rotate-180' : ''}`} />
//                   </button>

//                   {genderDropdownOpen && (
//                     <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
//                       {genderOptions.map(opt => (
//                         <button
//                           key={opt.value}
//                           type="button"
//                           onClick={() => handleGenderSelect(opt.value)}
//                           className={`w-full text-left px-4 py-3 hover:bg-amber-50 transition flex items-center gap-2 ${
//                             formData.gender === opt.value ? 'bg-amber-50 text-amber-700' : ''
//                           }`}
//                         >
//                           <span>{opt.icon}</span> {opt.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all ${
//                     loading
//                       ? 'bg-gray-400 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
//                   }`}
//                 >
//                   {loading ? 'Updating...' : <><FaSave className="inline mr-2" />Save Changes</>}
//                 </button>

//                 <Link
//                   to="/forgot-password"
//                   className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-center hover:bg-gray-50 transition"
//                 >
//                   <FaLock className="inline mr-2" /> Change Password
//                 </Link>

//                 {avatar && (
//                   <button
//                     type="button"
//                     onClick={handleRemoveAvatar}
//                     disabled={loading}
//                     className="flex-1 px-6 py-3 rounded-xl border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition"
//                   >
//                     Remove Avatar
//                   </button>
//                 )}

//                 {
//                   (!avatar) && (
//                     <button
//                       type="button"
//                       onClick={() => setOpenAvatarEdit(true)}
//                       disabled={loading}
//                       className="flex-1 px-6 py-3 rounded-xl border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition"
//                     >
//                       Upload Avatar
//                     </button>
//                   )
//                 }
                
//               </div>
//             </form>
//           )}

//           {activeTab === 'orders' && (
//             <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
//               <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <TbPackage className="text-3xl text-amber-600" />
//               </div>
//               <h3 className="text-xl font-bold mb-2">No Orders Yet</h3>
//               <p className="text-gray-600 mb-6">Start shopping and your orders will appear here.</p>
//               <Link
//                 to="/products"
//                 className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 shadow-md transition-transform hover:scale-105"
//               >
//                 <FaShoppingBag className="mr-2" /> Start Shopping
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
//           {quickActions.map((action, i) => (
//             <button
//               key={i}
//               className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:border-amber-300 hover:shadow-md transition-all group"
//             >
//               <div className="flex items-start gap-4">
//                 <div className="p-3 rounded-xl bg-amber-50 group-hover:bg-amber-100">
//                   <action.icon className="text-amber-600 text-xl" />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900">{action.label}</h4>
//                   <p className="text-gray-600 text-sm">{action.description}</p>
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>

//       </div>
//     </div>
//   )
// }

// // Reusable Input Component
// const FormField = ({ label, icon, ...props }) => (
//   <div>
//     <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
//     <div className="relative">
//       <div className="absolute left-3 inset-y-0 flex items-center text-gray-400">{icon}</div>
//       <input
//         {...props}
//         className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-500 hover:border-gray-400 transition`}
//       />
//     </div>
//   </div>
// )

// export default React.memo(Profile)


import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaUserCircle, FaCamera, FaLock, FaChevronDown, 
  FaSave, FaShoppingBag, FaEye, FaEyeSlash, FaShieldAlt 
} from 'react-icons/fa'
import { 
  MdEmail, MdPhone, MdCalendarToday, MdTransgender, 
  MdSecurity, MdNotifications, MdLocationOn 
} from 'react-icons/md'
import { TbPackage, TbDiscount, TbLogout } from 'react-icons/tb'
import toast from 'react-hot-toast'
import Axios from '../utils/axios'
import SummaryApi from '../comman/summaryApi'
import fetchUserDetails from '../utils/featchUserDetails'
import { setUserDetails, logout } from '../Store/userSlice'
import UserFileUploadAvatar from '../components/UserFileUploadAvatar'
import { IoIosSettings } from "react-icons/io";
import { IoIosGift } from "react-icons/io";
import { IoMale, IoFemale, IoTransgenderSharp } from "react-icons/io5";
import { FaQuestion } from "react-icons/fa6";


const Profile = () => {
  const { name, email, mobile, dob, gender, avatar, superCoins } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', dob: '', gender: '' })
  const [loading, setLoading] = useState(false)
  const [openAvatarEdit, setOpenAvatarEdit] = useState(false)
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    usageRate: 0,
    totalUsage: 0
  });

  // Enhanced stats calculation
  const calculateStats = useCallback((couponsData) => {
    const total = couponsData.length;
    const active = couponsData.filter(c => c.isCurrentlyActive).length;
    const expired = couponsData.filter(c => c.isExpired).length;
    const totalUsage = couponsData.reduce((sum, c) => sum + c.usedCount, 0);
    const usageRate = total > 0 ? (totalUsage / total).toFixed(1) : 0;
    
    return { total, active, expired, usageRate, totalUsage };
  }, []);

  // Fetch coupons with error handling and loading states
  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await Axios.get("/api/coupon/list");
      if (data.success) {
        setCoupons(data.data);
        setStats(calculateStats(data.data));
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      toast.error("Failed to load coupons. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);
  

  // Security Tab States
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    deviceManagement: false
  })
  const [showPassword, setShowPassword] = useState(false)
  
  // Rewards Tab States
  const [rewardsData, setRewardsData] = useState({
    points: 0,
    level: 'Bronze',
    coupons: []
  })
  
  // Settings Tab States
  const [appSettings, setAppSettings] = useState({
    theme: 'light',
    language: 'en',
    notifications: true,
    emailUpdates: false
  })

  const genderDropdownRef = useRef(null)

  // Gender options (memoized)
  const genderOptions = useMemo(() => [
    { value: "Male", label: "Male", icon: <IoMale />  },
    { value: "Female", label: "Female", icon: <IoFemale /> },
    { value: "Other", label: "Other", icon: <IoTransgenderSharp /> },
    { value: "Prefer not to say", label: "Prefer not to say", icon: <FaQuestion /> },
  ], [])

  // Initialize form data
  useEffect(() => {
    setFormData({
      name: name || '',
      email: email || '',
      mobile: mobile || '',
      dob: dob ? dob.split('T')[0] : '',
      gender: gender || '',
    })
  }, [name, email, mobile, dob, gender])

  // Load demo data for tabs
  useEffect(() => {
    if (activeTab === 'rewards') {
      fetchRewardsData()
    }
  }, [activeTab])

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Close gender dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(e.target)) {
        setGenderDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Demo API calls
  const fetchRewardsData = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setRewardsData({
          points: 1250,
          level: 'Basic',
          coupons: [
            { id: 1, code: 'WELCOME10', discount: '10%', validUntil: '2024-12-31' },
            { id: 2, code: 'SUMMER25', discount: '25%', validUntil: '2024-08-31' }
          ]
        })
      }, 500)
    } catch (error) {
      toast.error('Failed to load rewards data')
    }
  }

  const handleChange = useCallback(e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleGenderSelect = useCallback(value => {
    setFormData(prev => ({ ...prev, gender: value }))
    setGenderDropdownOpen(false)
  }, [])

  const handleSecurityToggle = useCallback((setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
    toast.dismiss()
    toast.success(`${setting.replace(/([A-Z])/g, ' $1')} ${!securitySettings[setting] ? 'enabled' : 'disabled'}`)
  }, [securitySettings])

  const handleSettingChange = useCallback((setting, value) => {
    setAppSettings(prev => ({ ...prev, [setting]: value }))
    toast.dismiss()
    toast.success('Setting updated successfully')
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const res = await Axios({ ...SummaryApi.updateUserDetails, data: formData })
      if (res.data.success) {
        toast.dismiss()
        toast.success('Profile updated successfully')
        const userRes = await fetchUserDetails()
        dispatch(setUserDetails(userRes.data))
      } else toast.error(res.data.message || 'Update failed')
    } catch {
      toast.dismiss()
      toast.error('Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await Axios(SummaryApi.removeUserAvatar)
      if (res.data.success) {
        toast.dismiss()
        toast.success('Avatar removed successfully')
        const userRes = await fetchUserDetails()
        dispatch(setUserDetails(userRes.data))
      } else toast.error('Failed to remove avatar')
    } catch {
      toast.dismiss()
      toast.error('Error removing avatar')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const res = await Axios({ ...SummaryApi.logout })
      if (res.data.success) {
        dispatch(logout())
        localStorage.clear()
        navigate('/')
        toast.dismiss()
        toast.success('Logged out successfully')
      }
    } catch {
      toast.dismiss()
      toast.error('Logout failed')
    }
  }

  // Tab items (memoized)
  const tabItems = useMemo(() => [
    { id: 'profile', label: 'Profile', icon: FaUserCircle },
    { id: 'rewards', label: 'Rewards', icon: IoIosGift },
    { id: 'security', label: 'Security', icon: MdSecurity },
    { id: 'settings', label: 'Settings', icon: IoIosSettings },
  ], [])

  const quickActions = useMemo(() => [
    { icon: MdSecurity, label: "Privacy & Security", description: "Manage your account security settings" },
    { icon: MdNotifications, label: "Notifications", description: "Configure your notification preferences" },
    { icon: MdLocationOn, label: "Addresses", description: "Manage your delivery addresses" },
    { icon: TbDiscount, label: "Coupons & Offers", description: "View available coupons and offers" },
  ], [])

  // Custom Toggle Component
  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{label}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-amber-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  // Custom Popup Component
  const CustomPopup = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 pb-4">
        {openAvatarEdit && <UserFileUploadAvatar close={() => setOpenAvatarEdit(false)} />}

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-3 bg-white border border-gray-200 rounded-2xl p-2 mb-6 shadow-sm sticky top-4 z-10">
          {tabItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              <tab.icon className="text-lg" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content with Switch Case */}
        <div className="transition-all duration-300">
          {(() => {
            switch (activeTab) {
              case 'profile':
                return (
                  <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Full Name"
                        icon={<FaUserCircle />}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <FormField
                        label="Email Address"
                        icon={<MdEmail />}
                        name="email"
                        value={formData.email}
                        readOnly
                      />
                      <FormField
                        label="Mobile Number"
                        icon={<MdPhone />}
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                      />
                      <FormField
                        label="Date of Birth"
                        icon={<MdCalendarToday />}
                        name="dob"
                        value={formData.dob}
                        type="date"
                        onChange={handleChange}
                        required
                      />

                      {/* Gender */}
                      <div ref={genderDropdownRef} className="md:col-span-2 relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                        <button
                          type="button"
                          onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-500 hover:border-gray-400 transition"
                        >
                          <span className="flex items-center gap-2 text-gray-700">
                            <MdTransgender className="text-gray-400" />
                            {formData.gender || "Select Gender"}
                          </span>
                          <FaChevronDown className={`transition-transform ${genderDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {genderDropdownOpen && (
                          <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                            {genderOptions.map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleGenderSelect(opt.value)}
                                className={`w-full text-left px-4 py-3 hover:bg-gray-200 transition flex items-center gap-2 ${
                                  formData.gender === opt.value ? 'bg-amber-50 text-amber-700' : ''
                                }`}
                              >
                                <span>{opt.icon}</span> {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all ${
                          loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                        }`}
                      >
                        {loading ? 'Updating...' : <><FaSave className="inline mr-2" />Save Changes</>}
                      </button>

                      <Link
                        to="/forgot-password"
                        className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-center hover:bg-gray-50 transition"
                      >
                        <FaLock className="inline mr-2" /> Change Password
                      </Link>

                      {avatar ? (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          disabled={loading}
                          className="flex-1 px-6 py-3 rounded-xl border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition"
                        >
                          Remove Avatar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setOpenAvatarEdit(true)}
                          disabled={loading}
                          className="flex-1 px-6 py-3 rounded-xl border border-amber-300 text-amber-600 font-semibold hover:bg-amber-50 transition"
                        >
                          <FaCamera className="inline mr-2" /> Upload Avatar
                        </button>
                      )}
                    </div>
                  </form>
                )

              case 'rewards':
                return (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <IoIosGift className="text-3xl text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Rewards</h2>
                      <p className="text-gray-600">Earn points and unlock exclusive benefits</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center">
                        <div className="text-3xl font-bold text-amber-600 mb-2">{superCoins.balance}</div>
                        <div className="text-gray-700 font-medium">Reward Points</div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center">
                        <div className="text-3xl font-bold text-amber-600 mb-2">{rewardsData.level}</div>
                        <div className="text-gray-700 font-medium">Membership Level</div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center">
                        <div className="text-3xl font-bold text-amber-600 mb-2">{coupons.length}</div>
                        <div className="text-gray-700 font-medium">Active Coupons</div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Coupons</h3>
                      <div className="space-y-4">
                        {coupons.map(coupon => (
                        <div key={coupon.id} className="relative flex items-center justify-between p-4 border border-amber-200 rounded-xl bg-amber-50">
                          {/* Overlay for expired/inactive coupons */}
                          {!coupon.isActive || coupon.isExpired ? (
                            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20 flex items-center justify-center rounded-xl z-10 overflow-hidden">
                              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,red_10px,red_20px)] opacity-10"></div>
                              <span className="text-red-600 text-xl font-black tracking-widest relative z-20 bg-white/90 px-4 py-2 rounded-lg backdrop-blur-sm">
                                EXPIRED
                              </span>
                            </div>
                          ) : null}

                          <div className="flex-1">
                            <div className="flex gap-1.5 font-semibold text-amber-700">
                              Coupon: <p className="" aria-label="Breadcrumb">{coupon.code}</p>
                            </div>
                            <p className="text-sm mt-1 opacity-80 flex items-center gap-1.5">
                              <span>{coupon.discountText}</span>•
                              <span>Valid until</span>
                              <span>
                                {new Date(coupon.endDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(coupon.code);
                              toast.dismiss()
                              toast.success('Coupon code copied!');
                            }}
                            disabled={!coupon.isActive || coupon.isExpired} // disable button if expired
                            className={`px-4 py-2 rounded-lg font-medium transition-colors
                              ${coupon.isActive && !coupon.isExpired
                                ? 'bg-amber-500 text-white hover:bg-amber-600'
                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
                          >
                            Copy Code
                          </button>
                        </div>
                        ))}

                      </div>
                    </div>
                  </div>
                )

              case 'security':
                return (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-amber-100 rounded-xl">
                        <FaShieldAlt className="text-amber-600 text-xl" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                        <p className="text-gray-600">Manage your account security and privacy</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <ToggleSwitch
                        enabled={securitySettings.twoFactorAuth}
                        onChange={() => handleSecurityToggle('twoFactorAuth')}
                        label="Two-Factor Authentication"
                        description="Add an extra layer of security to your account"
                      />
                      <ToggleSwitch
                        enabled={securitySettings.loginAlerts}
                        onChange={() => handleSecurityToggle('loginAlerts')}
                        label="Login Alerts"
                        description="Get notified of new sign-ins from unknown devices"
                      />
                      <ToggleSwitch
                        enabled={securitySettings.deviceManagement}
                        onChange={() => handleSecurityToggle('deviceManagement')}
                        label="Device Management"
                        description="View and manage devices that have accessed your account"
                      />
                    </div>

                    <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Quick Security Check</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Password Strength</span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Strong</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Recent Activity</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">No issues</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )

              case 'settings':
                return (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-amber-100 rounded-xl">
                        <IoIosSettings className="text-amber-600 text-xl" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">App Settings</h2>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Theme</h3>
                        <div className="flex gap-3">
                          {['light', 'dark', 'auto'].map(theme => (
                            <button
                              key={theme}
                              onClick={() => handleSettingChange('theme', theme)}
                              className={`px-4 py-2 rounded-lg border font-medium capitalize ${
                                appSettings.theme === theme
                                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                              }`}
                            >
                              {theme}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Language</h3>
                        <select
                          id="language"
                          name="language"
                          value={appSettings.language}
                          onChange={(e) => handleSettingChange('language', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <ToggleSwitch
                          enabled={appSettings.notifications}
                          onChange={() => handleSettingChange('notifications', !appSettings.notifications)}
                          label="Push Notifications"
                          description="Receive push notifications for important updates"
                        />
                        <ToggleSwitch
                          enabled={appSettings.emailUpdates}
                          onChange={() => handleSettingChange('emailUpdates', !appSettings.emailUpdates)}
                          label="Email Updates"
                          description="Get product updates and promotional emails"
                        />
                      </div>
                    </div>
                  </div>
                )

              default:
                return null
            }
          })()}
        </div>

        {/* Quick Actions - Only show on profile tab */}
        {activeTab === 'profile' && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:border-amber-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-amber-50 group-hover:bg-amber-100 transition-colors">
                      <action.icon className="text-amber-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{action.label}</h4>
                      <p className="text-gray-600 text-sm">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Reusable Input Component
const FormField = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute left-3 inset-y-0 flex items-center text-gray-400">{icon}</div>
      <input
        {...props}
        className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-500 hover:border-gray-400 transition ${
          props.readOnly ? 'bg-gray-50 text-gray-500' : ''
        }`}
      />
    </div>
  </div>
)

export default React.memo(Profile)