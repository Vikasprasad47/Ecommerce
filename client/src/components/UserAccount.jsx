// import React, { useState, useEffect } from 'react';
// import { FaUserCircle, FaStar, FaQuestionCircle, FaCamera } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { TbLogout, TbCategoryPlus, TbBrandProducthunt, TbHelp } from 'react-icons/tb';
// import {
//   MdOutlineCategory,
//   MdOutlineCloudUpload,
//   MdEmail,
//   MdNotifications,
//   MdCreditCard,
//   MdPrivacyTip,
//   MdReviews,
//   MdTransgender,
//   MdCalendarToday,
//   MdPhone
// } from 'react-icons/md';
// import { LuUsers, LuPackageCheck } from 'react-icons/lu';
// import { GrMapLocation } from 'react-icons/gr';
// import { RiCoinsLine } from 'react-icons/ri';
// import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io';
// import toast from 'react-hot-toast';
// import Axios from '../utils/axios';
// import SummaryApi from '../comman/summaryApi';
// import AxiosToastError from '../utils/AxiosToastErroe';
// import { logout, setUserDetails } from '../Store/userSlice';
// import isAdmin from '../utils/IsAdmin';
// import UserFileUploadAvatar from '../components/UserFileUploadAvatar';
// import fetchUserDetails from '../utils/featchUserDetails';
// import { motion, AnimatePresence } from 'framer-motion';
// import { IoCamera } from "react-icons/io5";
// import { IoLanguage } from "react-icons/io5";



// const UserAccount = () => {
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [openAvatarEdit, setOpenAvatarEdit] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [isMobile, setIsMobile] = useState(true);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     const checkScreenSize = () => {
//       const mobile = window.innerWidth < 1024;
//       setIsMobile(mobile);
//       if (!mobile) navigate('/dashboard/profile');
//     };
//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, [navigate]);

//   const handleLogout = async () => {
//     if (!window.confirm("Are you sure you want to logout?")) return;
//     setIsLoggingOut(true);
//     try {
//       const response = await Axios({ ...SummaryApi.logout });
//       if (response.data.success) {
//         dispatch(logout());
//         localStorage.clear();
//         navigate('/');
//         toast.dismiss();
//         toast.success(response.data.message);
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const handleRemoveAvatar = async () => {
//     if (!window.confirm("Remove your avatar?")) return;
//     try {
//       const res = await Axios(SummaryApi.removeUserAvatar);
//       if (res.data.success) {
//         toast.dismiss();
//         toast.success('Avatar removed successfully.');
//         const userdata = await fetchUserDetails();
//         dispatch(setUserDetails(userdata.data));
//       } else {
//         toast.dismiss();
//         toast.error(res.data.message || 'Failed to remove avatar.');
//       }
//     } catch {
//       toast.dismiss();
//       toast.error('Error removing avatar.');
//     }
//   };

//   if (!isMobile) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Redirecting to profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-md mx-auto space-y-4">

//         {/* User Overview */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
//           <div className="flex items-center justify-between gap-4">
//             <div className="flex-1">
//               <h1 className="text-xl font-semibold text-gray-900 mb-1">Hi, {user.name} 👋</h1>
//               <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
//                 <MdPhone className="text-blue-500" size={14} /> {user.mobile || 'Not set'}
//               </p>
//               <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
//                 <MdEmail className="text-blue-500" size={14} /> {user.email}
//               </p>
//               {user.role === "ADMIN" && (
//                 <p className="text-sm text-gray-600 mb-1">Role: <span className="font-semibold text-blue-600">{user.role}</span></p>
//               )}
//               <p className="text-sm text-gray-600 flex items-center gap-1">
//                 <RiCoinsLine className="text-yellow-500" size={16} /> Quickoo Coins: 
//                 <span className="text-yellow-600 font-semibold ml-1">{user.superCoins?.balance ?? 0}</span>
//               </p>
//             </div>
//             <div className="relative w-24 h-24 mx-auto">
//               {/* Avatar */}
//               <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-300 shadow-sm">
//                 {user.avatar ? (
//                   <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
//                 ) : (
//                   <FaUserCircle size={85} className="text-gray-400" />
//                 )}
//               </div>

//               {/* Camera Button */}
//               <button
//                 onClick={() => setOpenAvatarEdit(true)}
//                 className="absolute left-1/2 bottom-0 transform -translate-x-1/2 bg-gray-700/50 p-2 rounded-full shadow hover:bg-gray-600 transition"
//               >
//                 <IoCamera size={20} className="text-white" />
//               </button>
//             </div>


//           </div>
//         </motion.div>

//         {/* Quickoo Plus */}
//         <SectionCard title="Quickoo Plus" subtitle={`You have ${user.superCoins?.balance ?? 0} Quickoo Coins`} />

//         {/* Quick Actions */}
//         <SectionCard>
//           <AccountItem to="/dashboard/myorder" icon={<LuPackageCheck className="text-blue-600" />} label="Orders" />
//           <AccountItem to="/wishlist" icon={<FaStar className="text-blue-600" />} label="Wishlist" />
//           <AccountItem to="/coupons" icon={<TbBrandProducthunt className="text-blue-600" />} label="Coupons" />
//           <AccountItem to="/help" icon={<TbHelp className="text-blue-600" />} label="Help Center" />
//         </SectionCard>

//         {/* Profile Details */}
//         <SectionContainer title="Profile Details" open={true}>
//           <div className="grid grid-cols-2 gap-3">
//             <DetailCard icon={<MdCalendarToday className="text-blue-500" />} label="Date of Birth" value={user.dob ? new Date(user.dob).toLocaleDateString() : 'Not set'} />
//             <DetailCard icon={<MdTransgender className="text-blue-500" />} label="Gender" value={user.gender || 'Not set'} />
//           </div>
//           <div className="flex gap-2 mt-3">
//             <Link to="/dashboard/profile" className="flex-1 text-center bg-blue-50 text-blue-700 py-2 rounded text-sm font-medium hover:bg-blue-100 transition">Edit Profile</Link>
//             {user.avatar && <button onClick={handleRemoveAvatar} className="flex-1 text-center bg-red-50 text-red-700 py-2 rounded text-sm font-medium hover:bg-red-100 transition">Remove Avatar</button>}
//           </div>
//         </SectionContainer>

//         {/* Account Settings */}
//         <SectionContainer title="Account Settings" open={true}>
//           <AccountItem to="/plus" icon={<RiCoinsLine className="text-blue-600" />} label="Quickoo Plus" />
//           <AccountItem to="/dashboard/profile" icon={<FaUserCircle className="text-blue-600" />} label="Edit Profile" />
//           <AccountItem to="/cards" icon={<MdCreditCard className="text-blue-600" />} label="Saved Cards & Wallet" />
//           <AccountItem to="/dashboard/address" icon={<GrMapLocation className="text-blue-600" />} label="Saved Addresses" />
//           <AccountItem to="/language" icon={<IoLanguage className="text-blue-600 "/>} label="Select Language" />
//           <AccountItem to="/notifications" icon={<MdNotifications className="text-blue-600" />} label="Notification Settings" />
//         </SectionContainer>

//         {/* Admin Dashboard */}
//         {isAdmin(user.role) && (
//           <SectionContainer title="Dashboard" open={true}>
//             <AccountItem to="/dashboard/category" icon={<TbCategoryPlus className="text-blue-600" />} label="Category" />
//             <AccountItem to="/dashboard/subcategory" icon={<MdOutlineCategory className="text-blue-600" />} label="Sub Category" />
//             <AccountItem to="/dashboard/upload-product" icon={<MdOutlineCloudUpload className="text-blue-600" />} label="Upload Product" />
//             <AccountItem to="/dashboard/product" icon={<TbBrandProducthunt className="text-blue-600" />} label="Products" />
//             <AccountItem to="/dashboard/alluser" icon={<LuUsers className="text-blue-600" />} label="All Users" />
//           </SectionContainer>
//         )}

//         {/* My Activity */}
//         <SectionContainer title="My Activity" open={true}>
//           <AccountItem to="/reviews" icon={<MdReviews className="text-blue-600" />} label="Reviews" />
//           <AccountItem to="/questions" icon={<FaQuestionCircle className="text-blue-600" />} label="Questions & Answers" />
//         </SectionContainer>

//         {/* Earn with Quickoo */}
//         <SectionContainer title="Earn with Quickoo" open={true}>
//           <AccountItem to="/sell" icon={<TbCategoryPlus className="text-blue-600" />} label="Sell on Quickoo" />
//           <AccountItem to="/feedback" icon={<MdPrivacyTip className="text-blue-600" />} label="Feedback & Information" />
//           <AccountItem to="/terms" icon={<span className="text-blue-600 text-sm">📄</span>} label="Terms, Policies and Licenses" />
//           <AccountItem to="/faq" icon={<TbHelp className="text-blue-600" />} label="Browse FAQs" />
//         </SectionContainer>

//         {/* Logout */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm px-4 border border-gray-200 hover:shadow-md transition">
//           <button onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center justify-center gap-2 text-red-600 font-medium py-3 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
//             {isLoggingOut ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div> : <><TbLogout size={18} /> Logout</>}
//           </button>
//         </motion.div>

//         {openAvatarEdit && <UserFileUploadAvatar close={() => setOpenAvatarEdit(false)} />}
//       </div>
//     </div>
//   );
// };

// // Reusable Account Item
// const AccountItem = ({ to, icon, label }) => {
//   const content = (
//     <div className="flex items-center justify-between w-full py-2">
//       <div className="flex items-center gap-3">{icon}<span className="text-sm text-gray-900">{label}</span></div>
//       <IoIosArrowForward className="text-gray-400" size={16} />
//     </div>
//   );
//   return to ? <Link to={to} className="block hover:bg-gray-50 rounded-lg -mx-2 px-2 transition-colors">{content}</Link> : <div className="block hover:bg-gray-50 rounded-lg -mx-2 px-2 transition-colors cursor-pointer">{content}</div>;
// };

// // Collapsible Section Container
// const SectionContainer = ({ title, children, open }) => {
//   const [isOpen, setIsOpen] = useState(open || false);
//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition">
//       <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
//         <h3 className="text-sm font-medium text-gray-900">{title}</h3>
//         {isOpen ? <IoIosArrowDown className="text-blue-600" size={16} /> : <IoIosArrowForward className="text-blue-600" size={16} />}
//       </div>
//       <AnimatePresence>
//         {isOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3">{children}</motion.div>}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// // Simple Card with optional subtitle
// const SectionCard = ({ title, subtitle, children }) => (
//   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition">
//     {title && <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>}
//     {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
//     {children}
//   </motion.div>
// );

// // Detail Card
// const DetailCard = ({ icon, label, value }) => (
//   <div className="bg-gray-50 p-3 rounded border border-gray-200">
//     <p className="text-xs text-gray-500">{label}</p>
//     <p className="text-sm font-medium text-gray-800 flex items-center gap-1">{icon}{value}</p>
//   </div>
// );

// export default UserAccount;

// import React, { useState, useEffect } from 'react';
// import { FaUserCircle, FaStar, FaQuestionCircle, FaCamera } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { TbLogout, TbCategoryPlus, TbBrandProducthunt, TbHelp } from 'react-icons/tb';
// import {
//   MdOutlineCategory,
//   MdOutlineCloudUpload,
//   MdEmail,
//   MdNotifications,
//   MdCreditCard,
//   MdPrivacyTip,
//   MdReviews,
//   MdTransgender,
//   MdCalendarToday,
//   MdPhone
// } from 'react-icons/md';
// import { LuUsers, LuPackageCheck } from 'react-icons/lu';
// import { GrMapLocation } from 'react-icons/gr';
// import { RiCoinsLine } from 'react-icons/ri';
// import { IoIosArrowForward } from 'react-icons/io';
// import toast from 'react-hot-toast';
// import Axios from '../utils/axios';
// import SummaryApi from '../comman/summaryApi';
// import AxiosToastError from '../utils/AxiosToastErroe';
// import { logout, setUserDetails } from '../Store/userSlice';
// import isAdmin from '../utils/IsAdmin';
// import UserFileUploadAvatar from '../components/UserFileUploadAvatar';
// import fetchUserDetails from '../utils/featchUserDetails';
// import { motion } from 'framer-motion';
// import { IoCamera } from "react-icons/io5";
// import { IoLanguage } from "react-icons/io5";

// const UserAccount = () => {
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [openAvatarEdit, setOpenAvatarEdit] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [isMobile, setIsMobile] = useState(true);

//   useEffect(() => {
//     // Scroll to top when component mounts
//     window.scrollTo(0, 0);
    
//     const checkScreenSize = () => {
//       const mobile = window.innerWidth < 1024;
//       setIsMobile(mobile);
//       if (!mobile) navigate('/dashboard/profile');
//     };
    
//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, [navigate]);

//   const handleLogout = async () => {
//     setIsLoggingOut(true);
//     try {
//       const response = await Axios({ ...SummaryApi.logout });
//       if (response.data.success) {
//         dispatch(logout());
//         localStorage.clear();
//         navigate('/');
//         toast.dismiss();
//         toast.success(response.data.message);
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const handleRemoveAvatar = async () => {
//     try {
//       const res = await Axios(SummaryApi.removeUserAvatar);
//       if (res.data.success) {
//         toast.dismiss();
//         toast.success('Avatar removed successfully.');
//         const userdata = await fetchUserDetails();
//         dispatch(setUserDetails(userdata.data));
//       } else {
//         toast.dismiss();
//         toast.error(res.data.message || 'Failed to remove avatar.');
//       }
//     } catch {
//       toast.dismiss();
//       toast.error('Error removing avatar.');
//     }
//   };

//   if (!isMobile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-100 relative overflow-hidden">
//       {/* Decorative blurred background circles */}
//       <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-300 rounded-full opacity-20 blur-3xl" />
//       <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-400 rounded-full opacity-20 blur-3xl" />

//       {/* Loader content */}
//       <div className="relative flex flex-col items-center justify-center backdrop-blur-lg bg-white/40 border border-white/20 rounded-2xl p-8 shadow-2xl">
//         {/* Glowing spinner */}
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//           className="relative w-14 h-14 rounded-full border-t-4 border-b-4 border-transparent border-t-amber-500 border-b-orange-400 shadow-[0_0_15px_rgba(255,159,67,0.6)]"
//         ></motion.div>

//         {/* Text */}
//         <motion.p
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="text-gray-700 mt-5 font-medium tracking-wide"
//         >
//           Redirecting to your profile...
//         </motion.p>
//       </div>
//     </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-8">
//       <div className="max-w-full mx-auto px-4 space-y-4 pt-4">
//         {/* Enhanced User Profile Card */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//           className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
//         >
//           <div className="flex items-center gap-4">
//             {/* Enhanced Avatar Section */}
//             <motion.div 
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="relative"
//             >
//               <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
//                 {user.avatar ? (
//                   <img 
//                     src={user.avatar} 
//                     alt="User" 
//                     className="w-full h-full rounded-full object-cover"
//                   />
//                 ) : (
//                   <FaUserCircle size={48} className="text-gray-400" />
//                 )}
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setOpenAvatarEdit(true)}
//                 className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 p-2 rounded-full shadow-lg transition-all duration-200 border-2 border-white"
//               >
//                 <IoCamera size={14} className="text-white" />
//               </motion.button>
//             </motion.div>

//             {/* Enhanced User Info */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 <h2 className="text-lg font-bold text-gray-900 truncate">
//                   Hi, {user.name}
//                 </h2>
//                 <span className="text-lg">👋</span>
//                 {isAdmin(user.role) && (
//                   <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
//                     Admin
//                   </span>
//                 )}
//               </div>
              
//               <div className="space-y-1">
//                 <p className="text-sm text-gray-600 flex items-center gap-2">
//                   <MdPhone className="text-blue-500 flex-shrink-0" size={14} />
//                   <span className="truncate">{user.mobile || 'Not set'}</span>
//                 </p>
//                 <p className="text-sm text-gray-600 flex items-center gap-2">
//                   <MdEmail className="text-blue-500 flex-shrink-0" size={14} />
//                   <span className="truncate">{user.email}</span>
//                 </p>
//                 <motion.div 
//                   whileHover={{ scale: 1.02 }}
//                   className="flex items-center w-fit gap-2 text-sm bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-200 mt-2"
//                 >
//                   <RiCoinsLine className="text-yellow-500 flex-shrink-0" size={16} />
//                   <span className="text-gray-700 font-medium">Quickoo Coins:</span>
//                   <span className="font-bold text-yellow-600">{user.superCoins?.balance ?? 0}</span>
//                 </motion.div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Quickoo Plus Card */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-blue-50 rounded-2xl p-4 shadow-sm border border-blue-200"
//         >
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <RiCoinsLine className="text-blue-600" size={20} />
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900">Quickoo Plus</h3>
//               <p className="text-sm text-gray-600">{user.superCoins?.balance ?? 0} coins available</p>
//             </div>
//             <motion.div 
//               whileHover={{ scale: 1.05 }}
//               className="ml-auto bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full transition-colors"
//             >
//               <span className="text-blue-700 text-sm font-medium">View</span>
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Quick Actions - Always Open */}
//         <SectionContainer title="Quick Actions" icon="">
//           <AccountItem 
//             to="/dashboard/myorder" 
//             icon={<LuPackageCheck className="text-blue-500" />}
//             label="My Orders"
//             description="Track your orders & purchases"
//           />
//           <AccountItem 
//             to="/dashboard/wishlist" 
//             icon={<FaStar className="text-red-500" />}
//             label="Wishlist"
//             description="Your saved items"
//           />
//           <AccountItem 
//             to="/dashboard/coupons" 
//             icon={<TbBrandProducthunt className="text-green-500" />}
//             label="Coupons & Offers"
//             description="Available discounts & deals"
//           />
//           <AccountItem 
//             to="/dashboard/help" 
//             icon={<TbHelp className="text-orange-500" />}
//             label="Help Center"
//             description="Get support & answers"
//           />
//         </SectionContainer>

//         {/* Profile Details - Always Open */}
//         <SectionContainer title="Profile Details" icon="">
//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <DetailCard 
//               icon={<MdCalendarToday className="text-blue-500" />}
//               label="Date of Birth"
//               value={user.dob ? new Date(user.dob).toLocaleDateString() : 'Not set'}
//             />
//             <DetailCard 
//               icon={<MdTransgender className="text-purple-500" />}
//               label="Gender"
//               value={user.gender || 'Not set'}
//             />
//           </div>
//           <div className="flex gap-3">
//             <Link 
//               to="/dashboard/profile" 
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-semibold transition-all shadow-sm active:scale-95"
//             >
//               Edit Profile
//             </Link>
//             {user.avatar && (
//               <motion.button 
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleRemoveAvatar}
//                 className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-3 rounded-xl font-semibold transition-all shadow-sm border border-gray-300"
//               >
//                 Remove Avatar
//               </motion.button>
//             )}
//           </div>
//         </SectionContainer>

//         {/* Account Settings - Always Open */}
//         <SectionContainer title="Account Settings" icon="">
//           <AccountItem 
//             to="/dashboard/plus" 
//             icon={<RiCoinsLine className="text-purple-500" />}
//             label="Quickoo Plus"
//             description="Premium features & benefits"
//           />
//           <AccountItem 
//             to="/dashboard/profile" 
//             icon={<FaUserCircle className="text-blue-500" />}
//             label="Edit Profile"
//             description="Update personal information"
//           />
//           <AccountItem 
//             to="/dashboard/cards" 
//             icon={<MdCreditCard className="text-green-500" />}
//             label="Saved Cards & Wallet"
//             description="Payment methods & balance"
//           />
//           <AccountItem 
//             to="/dashboard/address" 
//             icon={<GrMapLocation className="text-red-500" />}
//             label="Saved Addresses"
//             description="Delivery & billing addresses"
//           />
//           <AccountItem 
//             to="/dashboard/language" 
//             icon={<IoLanguage className="text-indigo-500" />}
//             label="Select Language"
//             description="App language preferences"
//           />
//           <AccountItem 
//             to="/dashboard/notifications" 
//             icon={<MdNotifications className="text-yellow-500" />}
//             label="Notification Settings"
//             description="Manage alerts & updates"
//           />
//         </SectionContainer>

//         {/* Admin Dashboard - Always Open */}
//         {isAdmin(user.role) && (
//           <SectionContainer title="Admin Dashboard" icon="">
//             <AccountItem 
//               to="/dashboard/category" 
//               icon={<TbCategoryPlus className="text-blue-500" />}
//               label="Category Management"
//               description="Manage product categories"
//             />
//             <AccountItem 
//               to="/dashboard/subcategory" 
//               icon={<MdOutlineCategory className="text-green-500" />}
//               label="Sub Categories"
//               description="Organize sub-categories"
//             />
//             <AccountItem 
//               to="/dashboard/upload-product" 
//               icon={<MdOutlineCloudUpload className="text-orange-500" />}
//               label="Upload Product"
//               description="Add new products"
//             />
//             <AccountItem 
//               to="/dashboard/product" 
//               icon={<TbBrandProducthunt className="text-purple-500" />}
//               label="Product Management"
//               description="Manage all products"
//             />
//             <AccountItem 
//               to="/dashboard/alluser" 
//               icon={<LuUsers className="text-red-500" />}
//               label="User Management"
//               description="Administer user accounts"
//             />
//           </SectionContainer>
//         )}

//         {/* My Activity - Always Open */}
//         <SectionContainer title="My Activity" icon="">
//           <AccountItem 
//             to="/dashboard/reviews" 
//             icon={<MdReviews className="text-green-500" />}
//             label="My Reviews"
//             description="Product reviews & ratings"
//           />
//           <AccountItem 
//             to="/questions" 
//             icon={<FaQuestionCircle className="text-blue-500" />}
//             label="Q&A"
//             description="Questions & answers"
//           />
//         </SectionContainer>

//         {/* Earn with Quickoo - Always Open */}
//         <SectionContainer title="Earn with Quickoo" icon="">
//           <AccountItem 
//             to="/sell" 
//             icon={<TbCategoryPlus className="text-green-500" />}
//             label="Sell on Quickoo"
//             description="Start your business"
//           />
//           <AccountItem 
//             to="/feedback" 
//             icon={<MdPrivacyTip className="text-blue-500" />}
//             label="Feedback"
//             description="Share your suggestions"
//           />
//           <AccountItem 
//             to="/terms" 
//             icon={<span className="text-gray-500 text-sm">📄</span>}
//             label="Terms & Policies"
//             description="Legal information"
//           />
//           <AccountItem 
//             to="/faq" 
//             icon={<TbHelp className="text-orange-500" />}
//             label="FAQs"
//             description="Frequently asked questions"
//           />
//         </SectionContainer>

//         {/* Enhanced Logout Button */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-white rounded-2xl shadow-sm p-4 border border-gray-200"
//         >
//           <motion.button 
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={handleLogout}
//             disabled={isLoggingOut}
//             className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition-all shadow-sm active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed"
//           >
//             {isLoggingOut ? (
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//             ) : (
//               <>
//                 <TbLogout size={20} />
//                 <span className="text-base">Logout</span>
//               </>
//             )}
//           </motion.button>
//         </motion.div>
//       </div>

//       {/* Avatar Upload Modal */}
//       {openAvatarEdit && <UserFileUploadAvatar close={() => setOpenAvatarEdit(false)} />}
//     </div>
//   );
// };

// // Enhanced Account Item Component
// const AccountItem = ({ to, icon, label, description }) => {
//   const content = (
//     <motion.div 
//       whileHover={{ scale: 1.01 }}
//       whileTap={{ scale: 0.99 }}
//       className="flex items-center justify-between w-full py-3 px-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
//     >
//       <div className="flex items-center gap-4 flex-1">
//         <motion.div 
//           whileHover={{ scale: 1.1 }}
//           className="p-2 bg-gray-100 rounded-lg shadow-sm"
//         >
//           {icon}
//         </motion.div>
//         <div className="flex-1 min-w-0">
//           <span className="text-sm font-semibold text-gray-900 block">{label}</span>
//           {description && (
//             <span className="text-xs text-gray-500 block mt-1 truncate">{description}</span>
//           )}
//         </div>
//       </div>
//       <IoIosArrowForward className="text-gray-400 flex-shrink-0" size={16} />
//     </motion.div>
//   );

//   return to ? (
//     <Link to={to} className="block -mx-2">
//       {content}
//     </Link>
//   ) : (
//     <div className="block -mx-2 cursor-pointer">
//       {content}
//     </div>
//   );
// };

// // Enhanced Section Container (Always Open)
// const SectionContainer = ({ title, children, icon = "📁" }) => {
//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
//     >
//       <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
//         <div className="flex items-center gap-3">
//           <span className="text-lg">{icon}</span>
//           <h3 className="text-base font-bold text-gray-900">{title}</h3>
//         </div>
//         <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//       </div>
      
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.1 }}
//         className="p-4 space-y-2"
//       >
//         {children}
//       </motion.div>
//     </motion.div>
//   );
// };

// // Enhanced Detail Card Component
// const DetailCard = ({ icon, label, value }) => (
//   <motion.div 
//     whileHover={{ scale: 1.03 }}
//     whileTap={{ scale: 0.97 }}
//     className="bg-gray-50 p-3 rounded-xl border border-gray-300 shadow-sm"
//   >
//     <div className="flex items-center gap-2 mb-2">
//       {icon}
//       <span className="text-xs font-semibold text-gray-600">{label}</span>
//     </div>
//     <p className="text-sm font-bold text-gray-900 truncate">{value}</p>
//   </motion.div>
// );

// export default UserAccount;

import React, { useState, useEffect, memo } from 'react';
import { FaUserCircle, FaStar, FaQuestionCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { TbLogout, TbCategoryPlus, TbBrandProducthunt, TbHelp } from 'react-icons/tb';
import { MdOutlineCategory, MdOutlineCloudUpload, MdEmail, MdNotifications, MdCreditCard, MdPrivacyTip, MdReviews, MdTransgender, MdCalendarToday, MdPhone } from 'react-icons/md';
import { LuUsers, LuPackageCheck } from 'react-icons/lu';
import { GrMapLocation } from 'react-icons/gr';
import { RiCoinsLine } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import { IoCamera, IoLanguage } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { SiAnalogue } from "react-icons/si";

import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import AxiosToastError from '../utils/AxiosToastErroe';
import { logout, setUserDetails } from '../Store/userSlice';
import isAdmin from '../utils/IsAdmin';
import fetchUserDetails from '../utils/featchUserDetails';
import UserFileUploadAvatar from '../components/UserFileUploadAvatar';

const UserAccount = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openAvatarEdit, setOpenAvatarEdit] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) navigate('/dashboard/profile');
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await Axios({ ...SummaryApi.logout });
      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        navigate('/');
        toast.dismiss();
        toast.success(response.data.message);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const res = await Axios(SummaryApi.removeUserAvatar);
      if (res.data.success) {
        toast.dismiss();
        toast.success('Avatar removed successfully.');
        const userdata = await fetchUserDetails();
        dispatch(setUserDetails(userdata.data));
      } else {
        toast.dismiss();
        toast.error(res.data.message || 'Failed to remove avatar.');
      }
    } catch {
      toast.dismiss();
      toast.error('Error removing avatar.');
    }
  };

  if (!isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-100 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-300 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-400 rounded-full opacity-20 blur-3xl" />

        <div className="relative flex flex-col items-center justify-center backdrop-blur-lg bg-white/40 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="relative w-14 h-14 rounded-full border-t-4 border-b-4 border-transparent border-t-amber-500 border-b-orange-400 shadow-[0_0_15px_rgba(255,159,67,0.6)]"
          ></motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-700 mt-5 font-medium tracking-wide"
          >
            Redirecting to your profile...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-full mx-auto px-4 space-y-4 pt-4">
        {/* User Profile Card */}
        <UserProfileCard user={user} openAvatarEdit={openAvatarEdit} setOpenAvatarEdit={setOpenAvatarEdit} handleRemoveAvatar={handleRemoveAvatar} />

        {/* Quickoo Plus Card */}
        <QuickooPlusCard balance={user.superCoins?.balance ?? 0} />

        {/* Quick Actions */}
        <SectionContainer title="Quick Actions">
          <AccountItem to="/dashboard/myorder" icon={<LuPackageCheck className="text-blue-500" />} label="My Orders" description="Track your orders & purchases" />
          <AccountItem to="/dashboard/wishlist" icon={<FaStar className="text-red-500" />} label="Wishlist" description="Your saved items" />
          <AccountItem to="/dashboard/coupons" icon={<TbBrandProducthunt className="text-green-500" />} label="Coupons & Offers" description="Available discounts & deals" />
          <AccountItem to="/dashboard/help" icon={<TbHelp className="text-orange-500" />} label="Help Center" description="Get support & answers" />
        </SectionContainer>

        {/* Profile Details */}
        <SectionContainer title="Profile Details">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <DetailCard icon={<MdCalendarToday className="text-blue-500" />} label="Date of Birth" value={user.dob ? new Date(user.dob).toLocaleDateString() : 'Not set'} />
            <DetailCard icon={<MdTransgender className="text-purple-500" />} label="Gender" value={user.gender || 'Not set'} />
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard/profile" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-semibold transition-all shadow-sm active:scale-95">Edit Profile</Link>
            {user.avatar && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRemoveAvatar} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-3 rounded-xl font-semibold transition-all shadow-sm border border-gray-300">
                Remove Avatar
              </motion.button>
            )}
          </div>
        </SectionContainer>

        {/* Account Settings */}
        <SectionContainer title="Account Settings">
          <AccountItem to="/dashboard/plus" icon={<RiCoinsLine className="text-purple-500" />} label="Quickoo Plus" description="Premium features & benefits" />
          <AccountItem to="/dashboard/profile" icon={<FaUserCircle className="text-blue-500" />} label="Edit Profile" description="Update personal information" />
          <AccountItem to="/dashboard/cards" icon={<MdCreditCard className="text-green-500" />} label="Saved Cards & Wallet" description="Payment methods & balance" />
          <AccountItem to="/dashboard/address" icon={<GrMapLocation className="text-red-500" />} label="Saved Addresses" description="Delivery & billing addresses" />
          <AccountItem to="/dashboard/language" icon={<IoLanguage className="text-indigo-500" />} label="Select Language" description="App language preferences" />
          <AccountItem to="/dashboard/notifications" icon={<MdNotifications className="text-yellow-500" />} label="Notification Settings" description="Manage alerts & updates" />
        </SectionContainer>

        {/* Admin Dashboard */}
        {isAdmin(user.role) && (
          <SectionContainer title="Admin Dashboard">
            <AccountItem to="/dashboard/category" icon={<TbCategoryPlus className="text-blue-500" />} label="Category Management" description="Manage product categories" />
            <AccountItem to="/dashboard/subcategory" icon={<MdOutlineCategory className="text-green-500" />} label="Sub Categories" description="Organize sub-categories" />
            <AccountItem to="/dashboard/upload-product" icon={<MdOutlineCloudUpload className="text-orange-500" />} label="Upload Product" description="Add new products" />
            <AccountItem to="/dashboard/product" icon={<TbBrandProducthunt className="text-purple-500" />} label="Product Management" description="Manage all products" />
            <AccountItem to="/dashboard/manage-order" icon={<LuPackageCheck  className="text-amber-500" />} label="Order Management" description="Manage all orders" />
            <AccountItem to="/dashboard/alluser" icon={<LuUsers className="text-red-500" />} label="User Management" description="Administer user accounts" />
            <AccountItem to="/dashboard/analytics" icon={<SiAnalogue  className="text-gray-500" />} label="Analytics" description="SEO for products" />
          </SectionContainer>
        )}

        {/* My Activity */}
        <SectionContainer title="My Activity">
          <AccountItem to="/dashboard/reviews" icon={<MdReviews className="text-green-500" />} label="My Reviews" description="Product reviews & ratings" />
          <AccountItem to="/questions" icon={<FaQuestionCircle className="text-blue-500" />} label="Q&A" description="Questions & answers" />
        </SectionContainer>

        {/* Earn with Quickoo */}
        <SectionContainer title="Earn with Quickoo">
          <AccountItem to="/sell" icon={<TbCategoryPlus className="text-green-500" />} label="Sell on Quickoo" description="Start your business" />
          <AccountItem to="/feedback" icon={<MdPrivacyTip className="text-blue-500" />} label="Feedback" description="Share your suggestions" />
          <AccountItem to="/terms" icon={<span className="text-gray-500 text-sm">📄</span>} label="Terms & Policies" description="Legal information" />
          <AccountItem to="/faq" icon={<TbHelp className="text-orange-500" />} label="FAQs" description="Frequently asked questions" />
        </SectionContainer>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition-all shadow-sm active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoggingOut ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <>
              <TbLogout size={20} />
              <span className="text-base">Logout</span>
            </>}
          </motion.button>
        </motion.div>
      </div>

      {/* Avatar Upload Modal */}
      {openAvatarEdit && <UserFileUploadAvatar close={() => setOpenAvatarEdit(false)} />}
    </div>
  );
};

// =========================
// Memoized Sub-Components
// =========================

const UserProfileCard = memo(({ user, openAvatarEdit, setOpenAvatarEdit, handleRemoveAvatar }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
    <div className="flex items-center gap-4">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
          {user.avatar ? <img src={user.avatar} alt="User" className="w-full h-full rounded-full object-cover" /> : <FaUserCircle size={48} className="text-gray-400" />}
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setOpenAvatarEdit(true)} className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 p-2 rounded-full shadow-lg transition-all duration-200 border-2 border-white">
          <IoCamera size={14} className="text-white" />
        </motion.button>
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-gray-900 truncate">Hi, {user.name}</h2>
          <span className="text-lg">👋</span>
          {isAdmin(user.role) && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Admin</span>}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600 flex items-center gap-2"><MdPhone className="text-blue-500 flex-shrink-0" size={14} /><span className="truncate">{user.mobile || 'Not set'}</span></p>
          <p className="text-sm text-gray-600 flex items-center gap-2"><MdEmail className="text-blue-500 flex-shrink-0" size={14} /><span className="truncate">{user.email}</span></p>
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center w-fit gap-2 text-sm bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-200 mt-2">
            <RiCoinsLine className="text-yellow-500 flex-shrink-0" size={16} />
            <span className="text-gray-700 font-medium">Quickoo Coins:</span>
            <span className="font-bold text-yellow-600">{user.superCoins?.balance ?? 0}</span>
          </motion.div>
        </div>
      </div>
    </div>
  </motion.div>
));

const QuickooPlusCard = memo(({ balance }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-blue-50 rounded-2xl p-4 shadow-sm border border-blue-200">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-100 rounded-lg"><RiCoinsLine className="text-blue-600" size={20} /></div>
      <div>
        <h3 className="font-semibold text-gray-900">Quickoo Plus</h3>
        <p className="text-sm text-gray-600">{balance} coins available</p>
      </div>
      <motion.div whileHover={{ scale: 1.05 }} className="ml-auto bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full transition-colors">
        <span className="text-blue-700 text-sm font-medium">View</span>
      </motion.div>
    </div>
  </motion.div>
));

const DetailCard = memo(({ icon, label, value }) => (
  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="bg-gray-50 p-3 rounded-xl border border-gray-300 shadow-sm">
    <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs font-semibold text-gray-600">{label}</span></div>
    <p className="text-sm font-bold text-gray-900 truncate">{value}</p>
  </motion.div>
));

const SectionContainer = ({ title, children, icon = "📁" }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
    </div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="p-4 space-y-2">{children}</motion.div>
  </motion.div>
);

const AccountItem = ({ to, icon, label, description }) => {
  const content = (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="flex items-center justify-between w-full py-3 px-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200">
      <div className="flex items-center gap-4 flex-1">
        <motion.div whileHover={{ scale: 1.1 }} className="p-2 bg-gray-100 rounded-lg shadow-sm">{icon}</motion.div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-900 block">{label}</span>
          {description && <span className="text-xs text-gray-500 block mt-1 truncate">{description}</span>}
        </div>
      </div>
      <IoIosArrowForward className="text-gray-400 flex-shrink-0" size={16} />
    </motion.div>
  );

  return to ? <Link to={to} className="block -mx-2">{content}</Link> : <div className="block -mx-2 cursor-pointer">{content}</div>;
};

export default UserAccount;
