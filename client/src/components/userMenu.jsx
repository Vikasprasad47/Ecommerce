import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/axios'
import SummaryApi from '../comman/summaryApi'
import { logout } from '../Store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastErroe'
import isAdmin from '../utils/IsAdmin'
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { BsCloudUploadFill } from "react-icons/bs";
import { BsBoxSeamFill } from "react-icons/bs";
import { BsPeopleFill } from "react-icons/bs";
import { FaTruckMoving } from "react-icons/fa";
import { RiCoupon2Fill } from "react-icons/ri";
import { BsBarChartLineFill } from "react-icons/bs";
import { MdShoppingBag } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";
import { MdReviews } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";


// Icons
import {
  TbCategoryPlus, TbBrandProducthunt, TbLogout
} from "react-icons/tb"
import {
  MdOutlineCategory, MdOutlineCloudUpload, MdOpenInNew
} from "react-icons/md"
import {
  LuUsers, LuPackageCheck
} from "react-icons/lu"
import { GrMapLocation } from "react-icons/gr"
import { FaRegHeart } from "react-icons/fa"
import { IoMdAnalytics } from "react-icons/io"
import { IoCloseSharp } from "react-icons/io5"

const UserMenu = ({ close, rightContainerRef }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSticky, setIsSticky] = useState(true)
  const [activeLink, setActiveLink] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Logout
  const handelLogout = async () => {
    setLoggingOut(true)
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
    } finally {
      setLoggingOut(false)
    }
  }

  // Close Menu
  const handelClose = () => {
    if (close) close()
  }

  // Set active link
  useEffect(() => {
    setActiveLink(location.pathname)
  }, [location.pathname])

  // Sticky control with scroll
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

  // MenuItem Component
  const MenuItem = ({ to, children, icon: Icon }) => {
    const isActive = activeLink === to
    return (
      <Link
        to={to}
        onClick={handelClose}
        className={`group relative flex items-center justify-between px-4 py-3 rounded-sm transition-all duration-300
          ${isActive
            ? 'bg-slate-200 text-gray-600 border-l-4 border-blue-700'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-l-4 border-transparent hover:border-orange-400'
          }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className={`${isActive ? 'text-gray-600' : 'text-slate-600 group-hover:text-slate-600'}`} />
          <span className="font-medium text-sm">{children}</span>
        </div>
      </Link>
    )
  }

  // Menu structure based on roles
  const adminMenu = [
    { to: "/dashboard/category", icon: BsFillGrid1X2Fill , label: "Category" },
    { to: "/dashboard/subcategory", icon: BsFillGrid3X3GapFill, label: "Sub Category" },
    { to: "/dashboard/upload-product", icon: BsCloudUploadFill , label: "Upload Product" },
    { to: "/dashboard/product", icon: BsBoxSeamFill, label: "Products" },
    { to: "/dashboard/alluser", icon: BsPeopleFill , label: "All Users" },
    { to: "/dashboard/manage-order", icon: FaTruckMoving  , label: "Manage Orders" },
    { to: "/dashboard/coupons", icon: RiCoupon2Fill  , label: "Coupon Management" },
    { to: "/dashboard/analytics", icon: BsBarChartLineFill , label: "Analytics" },
    { to: "/dashboard/list-online-payments", icon: RiSecurePaymentFill , label: "Manage Online Payments" },
  ]

  const userMenu = [
    { to: "/dashboard/myorder", icon: MdShoppingBag , label: "My Orders" },
    { to: "/dashboard/wishlist", icon: MdFavorite , label: "Wishlist" },
    { to: "/dashboard/address", icon: MdLocationOn , label: "Address" },
    { to: "/dashboard/reviews", icon: MdReviews  , label: "My Reviews" },
  ]

  const agentMenu = [
    { to: "/dashboard/manage-order", icon: FaTruckMoving, label: "Manage Orders" },
    { to: "/dashboard/myorder", icon: MdShoppingBag, label: "My Orders" },
    { to: "/dashboard/wishlist", icon: MdFavorite, label: "Wishlist" },
    { to: "/dashboard/address", icon: MdLocationOn, label: "Address" },
    { to: "/dashboard/reviews", icon: MdReviews , label: "My Reviews" },
  ]

  // Choose menu based on role
  const currentMenu =
    isAdmin(user.role) ? [...adminMenu, ...userMenu] :
    user.role === "DELIVERY-AGENT" ? agentMenu :
    userMenu

  return (
    <div
      className={`transition-all duration-300 ${isSticky ? 'sticky top-0' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={handelClose}
          className="sm:hidden p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
        >
          <IoCloseSharp size={22} />
        </button>
      </div>

      {/* Profile Card */}
      <div className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 px-3 py-3 mb-3 hover:shadow-md transition-all">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar || "https://api.dicebear.com/9.x/initials/svg?seed=" + user.name}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
          />
          <div>
            <p className="font-semibold text-slate-800 truncate">{`${user.name.slice(0, 10)}...`}</p>
            <span className="text-xs text-slate-500">
              {user.role === "ADMIN" ? 'ADMIN' : user.role === "DELIVERY-AGENT" ? 'Delivery Agent' : user.role === "USER" ? `${user?.email || user?.mobile}`: ""}
            </span>
          </div>
        </div>
        <Link
          onClick={handelClose}
          to="/dashboard/profile"
          className="p-2 hover:bg-orange-200 bg-amber-100 rounded-full transition-all"
        >
          <MdOpenInNew size={18} className="text-orange-500" />
        </Link>
      </div>

      <Divider />

      {/* Scrollable Menu Section */}
      <div
        className={`flex flex-col gap-1 pr-2 transition-all duration-500 ${
          isHovered ? 'overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400' : 'overflow-hidden max-h-[60vh]'
        }`}
      >
        {currentMenu.map((item) => (
          <MenuItem key={item.to} to={item.to} icon={item.icon}>
            {item.label}
          </MenuItem>
        ))}
      </div>

      {/* Divider */}
      <Divider />

      {/* Logout Button */}
      <button
        onClick={handelLogout}
        disabled={loggingOut}
        className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
        bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600
        text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 
        ${loggingOut ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
      >
        {loggingOut ? (
          <span>Logging out...</span>
        ) : (
          <>
            <TbLogout size={20} />
            Logout
          </>
        )}
      </button>
    </div>
  )
}

export default UserMenu
