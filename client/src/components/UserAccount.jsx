import React, { useState } from 'react'
import { FaUserCircle, FaChevronRight, FaStar, FaQuestionCircle, FaCamera } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  TbLogout,
  TbCategoryPlus,
  TbBrandProducthunt,
  TbDiscount,
  TbHelp
} from 'react-icons/tb'
import {
  MdOutlineCategory, 
  MdOutlineCloudUpload,
  MdEmail,
  MdNotifications,
  MdCreditCard,
  MdPrivacyTip,
  MdReviews,
  MdTransgender,
  MdCalendarToday,
  MdPhone
} from 'react-icons/md'
import { LuUsers, LuPackageCheck } from 'react-icons/lu'
import { GrMapLocation } from 'react-icons/gr'
import { RiCoinsLine } from 'react-icons/ri'
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io'
import toast from 'react-hot-toast'
import Axios from '../utils/axios'
import SummaryApi from '../comman/summaryApi'
import AxiosToastError from '../utils/AxiosToastErroe'
import { logout, setUserDetails } from '../Store/userSlice'
import isAdmin from '../utils/IsAdmin'
import UserFileUploadAvatar from '../components/UserFileUploadAvatar'
import fetchUserDetails from '../utils/featchUserDetails'
import { motion, AnimatePresence } from 'framer-motion'

const UserAccount = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState(null)
  const [openAvatarEdit, setOpenAvatarEdit] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return
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
      AxiosToastError(error)
    }
  }

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const handleRemoveAvatar = async () => {
    if (!window.confirm("Remove your avatar?")) return
    try {
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
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4'>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Account Overview */}
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className='bg-white rounded-2xl shadow-md p-5 border border-gray-100'>
          <section className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">Hi, {user.name} 👋</h1>
              <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                <MdPhone className="text-indigo-500" size={14} />
                {user.mobile}
              </p>
              <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                <MdEmail className="text-indigo-500" size={14} />
                {user.email}
              </p>
              {
                user.role === "ADMIN" && (
                  <p className="text-sm text-gray-600 mb-1">
                    Role: <span className="font-semibold text-indigo-600">{user.role || 'User'}</span>
                  </p>
                )
              }
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <RiCoinsLine className="text-yellow-500" size={16} />
                SuperCoins: 
                <span className="text-yellow-600 font-semibold ml-1">
                  {user.superCoins?.balance ?? 0}
                </span>
              </p>
            </div>
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100 border-2 border-indigo-300 shadow-md ring-4 ring-indigo-100">
                {user.avatar ? (
                  <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <FaUserCircle className="text-6xl text-indigo-300" />
                )}
              </div>
              <button
                onClick={() => setOpenAvatarEdit(true)}
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-md transition-all duration-300 hover:bg-indigo-700"
              >
                <FaCamera size={12} />
              </button>
            </div>
          </section>
        </motion.div>

        {/* Profile Details */}
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <h2 className="text-lg font-semibold text-gray-900">Profile Details</h2>
            {profileDropdownOpen ? (
              <IoIosArrowDown className="text-indigo-600" />
            ) : (
              <IoIosArrowForward className="text-indigo-600" />
            )}
          </div>
          <AnimatePresence>
          {profileDropdownOpen && (
            <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                    <MdCalendarToday className="text-indigo-500" size={14} />
                    {user.dob ? new Date(user.dob).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">Gender</p>
                  <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                    <MdTransgender className="text-indigo-500" size={14} />
                    {user.gender || 'Not set'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link 
                  to="/dashboard/profile" 
                  className="flex-1 text-center bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
                >
                  Edit Profile
                </Link>
                {user.avatar && (
                  <button 
                    onClick={handleRemoveAvatar}
                    className="flex-1 text-center bg-rose-50 text-rose-700 py-2 rounded-lg text-sm font-medium hover:bg-rose-100 transition"
                  >
                    Remove Avatar
                  </button>
                )}
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>

        {openAvatarEdit && <UserFileUploadAvatar close={() => setOpenAvatarEdit(false)} />}

        {/* Quick Actions */}
        <motion.section initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="grid grid-cols-3 gap-3 bg-white rounded-2xl shadow-md p-4 border border-gray-100">
          <QuickAction to="/dashboard/myorder" Icon={LuPackageCheck} label="Orders" />
          <QuickAction to="/wishlist" Icon={FaStar} label="Wishlist" />
          <QuickAction onClick={() => toggleSection('notifications')} Icon={MdNotifications} label="Updates" />
        </motion.section>

        {/* Dashboard */}
        <SectionCard title="Dashboard">
          {isAdmin(user.role) && (
            <>
              <NavItem to="/dashboard/category" label="Category" Icon={TbCategoryPlus} />
              <NavItem to="/dashboard/subcategory" label="Sub Category" Icon={MdOutlineCategory} />
              <NavItem to="/dashboard/upload-product" label="Upload Product" Icon={MdOutlineCloudUpload} />
              <NavItem to="/dashboard/product" label="Products" Icon={TbBrandProducthunt} />
              <NavItem to="/dashboard/alluser" label="All User" Icon={LuUsers} />
              <NavItem to="/dashboard/manage-order" label="Manage Order" Icon={LuPackageCheck} />
              <NavItem to="/dashboard/analytics" label="Analytics" Icon={LuPackageCheck} />
            </>
          )}
          {user.role === 'DELIVERY-AGENT' && (
            <NavItem to="/dashboard/manage-order" label="Manage Order" Icon={LuPackageCheck} />
          )}
          <NavItem to="/dashboard/myorder" label="My Orders" Icon={LuPackageCheck} />
          <NavItem to="/dashboard/address" label="My Address" Icon={GrMapLocation} />
        </SectionCard>

        {/* Settings */}
        <SectionCard title="Settings">
          <NavItem to="/dashboard/profile" label="Edit Profile" Icon={FaUserCircle} />
          <NavItem to="#" label="Saved Cards" Icon={MdCreditCard} />
          <NavItem to="/dashboard/address" label="Saved Address" Icon={GrMapLocation} />
          <NavItem to="#" label="Notification Settings" Icon={MdNotifications} />
          <NavItem to="#" label="Privacy Center" Icon={MdPrivacyTip} />
        </SectionCard>

        {/* My Activity */}
        <SectionCard title="My Activity">
          <NavItem to="#" label="Reviews" Icon={MdReviews} />
          <NavItem to="#" label="Questions & Answers" Icon={FaQuestionCircle} />
        </SectionCard>

        {/* Logout */}
        <div className="text-center py-4">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
          >
            <TbLogout size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  )
}

const SectionCard = ({ title, children }) => (
  <motion.section initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
    <h2 className="text-lg font-semibold mb-3 text-gray-900 pl-2">{title}</h2>
    <nav className="divide-y divide-gray-100">{children}</nav>
  </motion.section>
)

const NavItem = ({ to, label, Icon }) => (
  <Link 
    to={to} 
    className="flex justify-between items-center py-3 px-2 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors group"
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className="text-indigo-600" />
      <span className="text-sm">{label}</span>
    </div>
    <IoIosArrowForward className="text-gray-400 group-hover:text-indigo-600 transition-colors" size={16} />
  </Link>
)

const QuickAction = ({ to, onClick, Icon, label }) => {
  const Wrapper = to ? Link : 'button'
  const props = to ? { to } : { onClick }
  return (
    <Wrapper {...props} className="flex flex-col items-center justify-center py-3 text-indigo-700 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm">
      <Icon size={20} />
      <span className="text-xs mt-1">{label}</span>
    </Wrapper>
  )
}

export default UserAccount