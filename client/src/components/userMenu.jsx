import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/axios'
import SummaryApi from '../comman/summaryApi'
import {logout} from '../Store/userSlice'
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


const userMenu = ({close, rightContainerRef}) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const naviagte = useNavigate()
  const [isSticky, setIsSticky] = useState(true);

  const handelLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })
      if(response.data.success){
        dispatch(logout())
        localStorage.clear()
        naviagte('/')
        toast.dismiss();
        toast.success(response.data.message)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handelClose = () => {
    if(close){
      close()
    }
  }

  useEffect(() => {
    const handleRightScroll = () => {
      if (!rightContainerRef?.current) return;
      const { scrollTop, scrollHeight, clientHeight } = rightContainerRef.current;
      setIsSticky(scrollTop + clientHeight < scrollHeight);
    };

    if (rightContainerRef?.current) {
      rightContainerRef.current.addEventListener('scroll', handleRightScroll);
    }

    return () => {
      if (rightContainerRef?.current) {
        rightContainerRef.current.removeEventListener('scroll', handleRightScroll);
      }
    };
  }, [rightContainerRef]);
  return (
  <div className={` ${isSticky ? 'sticky top-0' : ''}`}>
    <div className='font-semibold flex justify-between'>
      My Account
      <button onClick={() => window.history.back()} className='text-neutral-800 w-fit ml-auto block sm:hidden'>
        <IoCloseSharp size={25} />
      </button>
    </div>

    <div className='flex items-center gap-2'>
      <span className='max-w-52 text-ellipsis line-clamp-1'>
        {user.name || user.mobile}
        {user.role === "ADMIN" && (
          <span className='text-red-600 text-sm'> (Admin)</span>
        )}
        {user.role === "DELIVERY-AGENT" && (
          <span className='text-red-600 text-sm'> (Delivery Agent)</span>
        )}
      </span>
      <Link onClick={handelClose} className='hover:text-amber-300' to={'/dashboard/profile'}>
        <FaExternalLinkAlt size={14} />
      </Link>
    </div>

    <Divider />

    <div className='text-sm grid'>
      {isAdmin(user.role) && (
        <>
          <Link onClick={handelClose} className='p-2 hover:bg-gray-200 rounded flex items-center justify-between' to="/dashboard/category">Category <TbCategoryPlus size={20} /></Link>
          <Link onClick={handelClose} className='p-2 hover:bg-gray-200 rounded flex items-center justify-between' to="/dashboard/subcategory">Sub Category<MdOutlineCategory size={20} /></Link>
          <Link onClick={handelClose} className='p-2 hover:bg-gray-200 rounded flex items-center justify-between' to="/dashboard/upload-product">Upload Product<MdOutlineCloudUpload size={20} /></Link>
          <Link onClick={handelClose} className='p-2 hover:bg-gray-200 rounded flex items-center justify-between' to="/dashboard/product">Products<TbBrandProducthunt size={20} /></Link>
          <Link onClick={handelClose} className='p-2 hover:bg-gray-200 rounded flex items-center justify-between' to="/dashboard/alluser">All User<LuUsers size={20} /></Link>
          <Link onClick={handelClose} className='p-2 hover:bg-gray-200 rounded flex items-center justify-between' to="/dashboard/myorder">My Orders<LuPackageCheck size={20} /></Link>
          <Link onClick={handelClose} className='p-2 hover:bg-gray-200 rounded flex items-center justify-between' to="/dashboard/wishlist">My Wishlist<FaRegHeart size={20} /></Link>
          <Link onClick={handelClose} className='p-2 hover:bg-gray-200 rounded flex items-center justify-between' to="/dashboard/address">My Address<GrMapLocation size={20} /></Link>
          <Link onClick={handelClose} className='p-2 hover:bg-gray-200 rounded flex items-center justify-between' to="/dashboard/manage-order">Manage Order<LuUsers size={20} /></Link>
          <Link onClick={handelClose} className='p-2 hover:bg-gray-200 rounded flex items-center justify-between' to="/dashboard/analytics">Analytics<IoMdAnalytics size={20} /></Link>

        </>
      )}

      {user.role === "DELIVERY-AGENT" && (
        <>
          <Link onClick={handelClose} className='p-2 hover:bg-gray-200 rounded flex items-center justify-between' to="/dashboard/manage-order">Manage Order<LuUsers size={20} /></Link>
        </>
      )}

      {!isAdmin(user.role) && user.role !== "DELIVERY-AGENT" && (
        <>
          <Link onClick={handelClose} className='p-2 hover:bg-gray-200 rounded flex items-center justify-between' to="/dashboard/myorder">My Orders<LuPackageCheck size={20} /></Link>
          <Link onClick={handelClose} className='p-2 hover:bg-gray-200 rounded flex items-center justify-between' to="/dashboard/address">My Address<GrMapLocation size={20} /></Link>
        </>
      )}

      <button onClick={handelLogout} className='bg-amber-300 hover:bg-amber-200 p-2 rounded mt-2 flex items-center justify-center gap-1'>
        Logout<TbLogout size={20} />
      </button>
    </div>
  </div>
)

}

export default userMenu
