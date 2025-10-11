import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../Store/userSlice";
import toast from "react-hot-toast";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";
import AxiosToastError from "../utils/AxiosToastErroe";
import isAdmin from "../utils/IsAdmin";

import {
  IoPersonOutline,
  IoLogOutOutline,
  IoHeartOutline,
  IoLocationOutline,
  IoBagHandleOutline,
  IoAnalyticsOutline,
  IoPeopleOutline,
  IoCloudUploadOutline,
  IoCubeOutline,
  IoStorefrontOutline,
  IoChevronForward,
  IoNotificationsOutline,
  IoStarOutline,
  IoGridOutline,
} from "react-icons/io5";

const UserDropDownMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios(SummaryApi.logout);
      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        navigate("/");
        toast.dismiss();
        toast.success(response.data.message);
        close?.();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const getRoleBadge = () => {
    switch (user.role) {
      case "ADMIN":
        return { label: "Admin", color: "bg-orange-500" };
      case "DELIVERY-AGENT":
        return { label: "Delivery", color: "bg-orange-400" };
      default:
        return { label: "User", color: "bg-orange-300" };
    }
  };

  const roleBadge = getRoleBadge();

  // Dynamic counts from schema
  const wishlistCount = user?.wishlist?.length || 0;
  const orderCount = user?.orderHistory?.length || 0;
  const notificationCount = user?.notifications ? 
    [user.notifications.email, user.notifications.sms, user.notifications.push].filter(Boolean).length : 0;

  // Base menu - removed cart and super coins
  const baseMenu = [
    { to: "/dashboard/profile", label: "Profile", icon: IoPersonOutline },
    { to: "/dashboard/myorder", label: "My Orders", icon: IoBagHandleOutline },
    { to: "/dashboard/wishlist", label: "Wishlist", icon: IoHeartOutline, badge: wishlistCount },
    { to: "/dashboard/address", label: "Address", icon: IoLocationOutline },
    { to: "/dashboard/notifications", label: "Notifications", icon: IoNotificationsOutline, badge: notificationCount },
  ];

  // Admin Panel menu - consolidated into one item
  const adminMenu = [
    { to: "dashboard/upload-product", label: "Admin Panel", icon: IoGridOutline },
  ];

  const agentMenu = [
    { to: "/dashboard/manage-order", label: "Manage Orders", icon: IoStorefrontOutline },
  ];

  const showAdminMenu = isAdmin(user.role);
  const showAgentMenu = user.role === "DELIVERY-AGENT";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-80 bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden flex flex-col"
      >
        {/* USER HEADER */}
        <div className="p-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-lg font-bold shadow-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{user.name || user.mobile}</p>
            <p className="text-xs text-gray-500 truncate">{user.email || "No email linked"}</p>
          </div> 
          {
            roleBadge === "ADMIN" && (
                <span className={`text-xs px-2 py-1 rounded-full text-white font-medium ${roleBadge.color} shadow-sm`}>
                    {roleBadge.label}
                </span>
            )
          }
          
        </div>

        {/* BASE MENU */}
        <div className="flex flex-col divide-y divide-orange-50 py-1">
          {baseMenu.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={i}
                to={item.to}
                onClick={close}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-200 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-orange-500 group-hover:text-orange-600 transition-colors" size={18} />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge > 0 && (
                    <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                  <IoChevronForward size={16} className="text-orange-300 group-hover:text-orange-400 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* ADMIN PANEL */}
        {showAdminMenu && (
          <div className="border-t border-orange-100 bg-orange-50 py-1">
            {adminMenu.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  to={item.to}
                  onClick={close}
                  className="flex items-center justify-between px-4 py-3 hover:bg-blue-100 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-orange-600 group-hover:text-orange-700 transition-colors" size={18} />
                    <span className="text-sm font-medium text-orange-700 group-hover:text-orange-800">
                      {item.label}
                    </span>
                  </div>
                  <IoChevronForward size={16} className="text-orange-400 group-hover:text-orange-500 transition-colors" />
                </Link>
              );
            })}
          </div>
        )}

        {/* DELIVERY AGENT MENU */}
        {showAgentMenu && (
          <div className="border-t border-orange-100 bg-orange-50 py-1">
            {agentMenu.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  to={item.to}
                  onClick={close}
                  className="flex items-center justify-between px-4 py-3 hover:bg-orange-100 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-orange-600 group-hover:text-orange-700 transition-colors" size={18} />
                    <span className="text-sm font-medium text-orange-700 group-hover:text-orange-800">
                      {item.label}
                    </span>
                  </div>
                  <IoChevronForward size={16} className="text-orange-400 group-hover:text-orange-500 transition-colors" />
                </Link>
              );
            })}
          </div>
        )}

        {/* LOGOUT */}
        <div className="border-t border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 
                       bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 
                       text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            <IoLogOutOutline size={16} />
            Logout
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserDropDownMenu;