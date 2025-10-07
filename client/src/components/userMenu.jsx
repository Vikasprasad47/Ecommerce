import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/axios'
import SummaryApi from '../comman/summaryApi'
import { logout } from '../Store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastErroe'
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import isAdmin from '../utils/IsAdmin'
import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlineCategory } from "react-icons/md";
import { MdOutlineCloudUpload } from "react-icons/md";
import { TbBrandProducthunt } from "react-icons/tb";
import { LuUsers } from "react-icons/lu";
import { LuPackageCheck } from "react-icons/lu";
import { GrMapLocation } from "react-icons/gr";
import { TbLogout } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";
import { MdOpenInNew } from "react-icons/md";

const UserMenu = ({ close, rightContainerRef }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSticky, setIsSticky] = useState(true)
  const [activeLink, setActiveLink] = useState('')

  const handelLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })
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

  const handelClose = () => {
    if (close) {
      close()
    }
  }

  // Set active link based on current path
  useEffect(() => {
    setActiveLink(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    const handleRightScroll = () => {
      if (!rightContainerRef?.current) return
      const { scrollTop, scrollHeight, clientHeight } = rightContainerRef.current
      setIsSticky(scrollTop + clientHeight < scrollHeight)
    }

    if (rightContainerRef?.current) {
      rightContainerRef.current.addEventListener('scroll', handleRightScroll)
    }

    return () => {
      if (rightContainerRef?.current) {
        rightContainerRef.current.removeEventListener('scroll', handleRightScroll)
      }
    }
  }, [rightContainerRef])

  const MenuItem = ({ to, children, icon: Icon, adminOnly = false, agentOnly = false }) => {
    if (adminOnly && !isAdmin(user.role)) return null
    if (agentOnly && user.role !== "DELIVERY-AGENT") return null
    
    const isActive = activeLink === to
    const baseClasses = 'p-3 rounded-md flex items-center justify-between transition-all duration-300 group hover:shadow-md'
    const activeClasses = isActive 
      ? 'bg-slate-100' 
      : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'

    return (
      <Link 
        onClick={handelClose} 
        className={`${baseClasses} ${activeClasses}`}
        to={to}
      >
        <span className="font-medium">{children}</span>
        <Icon 
          size={20} 
          className={`transition-transform duration-300 group-hover:scale-110 ${
            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
          }`} 
        />
      </Link>
    )
  }

  return (
    <div className={`transition-all duration-300 ${isSticky ? 'sticky top-0' : ''}`}>
      {/* Header Section */}
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold text-slate-800'>My Account</h2>
        <button 
          onClick={() => window.history.back()} 
          className='text-slate-500 hover:text-slate-700 w-fit p-1 rounded-lg transition-colors duration-200 sm:hidden'
        >
          <IoCloseSharp size={24} />
        </button>
      </div>

      {/* User Info Section */}
      <div className='flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-4 border border-slate-200/50'>
        <div className='flex items-center gap-3 min-w-0'>
          <div className='w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md'>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className='min-w-0 flex-1'>
            <p className='text-sm font-semibold text-slate-800 truncate'>
              {user.name || user.mobile}
            </p>
            <div className='flex items-center gap-2'>
              {user.role === "ADMIN" && (
                <span className='text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium'>Admin</span>
              )}
              {user.role === "DELIVERY-AGENT" && (
                <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium'>Delivery Agent</span>
              )}
            </div>
          </div>
        </div>
        <Link 
          onClick={handelClose} 
          className='text-slate-400 hover:text-blue-500 p-2 rounded-lg transition-all duration-200 hover:bg-white hover:shadow-sm'
          to={'/dashboard/profile'}
        >
          <MdOpenInNew  size={20} />
        </Link>
      </div>

      <Divider />

      {/* Navigation Menu */}
      <div className='space-y-2'>
        {isAdmin(user.role) && (
          <>
            <MenuItem to="/dashboard/category" icon={TbCategoryPlus}>Category</MenuItem>
            <MenuItem to="/dashboard/subcategory" icon={MdOutlineCategory}>Sub Category</MenuItem>
            <MenuItem to="/dashboard/upload-product" icon={MdOutlineCloudUpload}>Upload Product</MenuItem>
            <MenuItem to="/dashboard/product" icon={TbBrandProducthunt}>Products</MenuItem>
            <MenuItem to="/dashboard/alluser" icon={LuUsers}>All Users</MenuItem>
            <MenuItem to="/dashboard/myorder" icon={LuPackageCheck}>My Orders</MenuItem>
            <MenuItem to="/dashboard/wishlist" icon={FaRegHeart}>My Wishlist</MenuItem>
            <MenuItem to="/dashboard/address" icon={GrMapLocation}>My Address</MenuItem>
            <MenuItem to="/dashboard/manage-order" icon={LuUsers}>Manage Orders</MenuItem>
            <MenuItem to="/dashboard/analytics" icon={IoMdAnalytics}>Analytics</MenuItem>
          </>
        )}

        {user.role === "DELIVERY-AGENT" && (
          <MenuItem to="/dashboard/manage-order" icon={LuUsers} agentOnly>Manage Orders</MenuItem>
        )}

        {!isAdmin(user.role) && user.role !== "DELIVERY-AGENT" && (
          <>
            <MenuItem to="/dashboard/myorder" icon={LuPackageCheck}>My Orders</MenuItem>
            <MenuItem to="/dashboard/wishlist" icon={FaRegHeart}>My Wishlist</MenuItem>
            <MenuItem to="/dashboard/address" icon={GrMapLocation}>My Address</MenuItem>
          </>
        )}
      </div>

      {/* Logout Button */}
      <button 
        onClick={handelLogout} 
        className='w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white p-3 rounded-xl mt-6 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-[1.02]'
      >
        <span>Logout</span>
        <TbLogout size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  )
}

export default UserMenu