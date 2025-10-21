// import React, { useState, useEffect, memo } from 'react';
// import { FaUserCircle, FaStar, FaQuestionCircle } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { TbLogout, TbCategoryPlus, TbBrandProducthunt, TbHelp } from 'react-icons/tb';
// import { MdOutlineCategory, MdOutlineCloudUpload, MdEmail, MdNotifications, MdCreditCard, MdPrivacyTip, MdReviews, MdTransgender, MdCalendarToday, MdPhone } from 'react-icons/md';
// import { LuUsers, LuPackageCheck } from 'react-icons/lu';
// import { GrMapLocation } from 'react-icons/gr';
// import { RiCoinsLine } from 'react-icons/ri';
// import { IoIosArrowForward } from 'react-icons/io';
// import { IoCamera, IoLanguage } from 'react-icons/io5';
// import toast from 'react-hot-toast';
// import { motion } from 'framer-motion';
// import { SiAnalogue } from "react-icons/si";

// import Axios from '../utils/axios';
// import SummaryApi from '../comman/summaryApi';
// import AxiosToastError from '../utils/AxiosToastErroe';
// import { logout, setUserDetails } from '../Store/userSlice';
// import isAdmin from '../utils/IsAdmin';
// import fetchUserDetails from '../utils/featchUserDetails';
// import UserFileUploadAvatar from '../components/UserFileUploadAvatar';

// const UserAccount = () => {
//   const user = useSelector(state => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
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
//         <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-300 rounded-full opacity-20 blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-400 rounded-full opacity-20 blur-3xl" />

//         <div className="relative flex flex-col items-center justify-center backdrop-blur-lg bg-white/40 border border-white/20 rounded-2xl p-8 shadow-2xl">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//             className="relative w-14 h-14 rounded-full border-t-4 border-b-4 border-transparent border-t-amber-500 border-b-orange-400 shadow-[0_0_15px_rgba(255,159,67,0.6)]"
//           ></motion.div>

//           <motion.p
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-gray-700 mt-5 font-medium tracking-wide"
//           >
//             Redirecting to your profile...
//           </motion.p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-8">
//       <div className="max-w-full mx-auto px-4 space-y-4 pt-4">
//         {/* User Profile Card */}
//         <UserProfileCard user={user} openAvatarEdit={openAvatarEdit} setOpenAvatarEdit={setOpenAvatarEdit} handleRemoveAvatar={handleRemoveAvatar} />

//         {/* Quickoo Plus Card */}
//         <QuickooPlusCard balance={user.superCoins?.balance ?? 0} />

//         {/* Quick Actions */}
//         <SectionContainer title="Quick Actions">
//           <AccountItem to="/dashboard/myorder" icon={<LuPackageCheck className="text-blue-500" />} label="My Orders" description="Track your orders & purchases" />
//           <AccountItem to="/dashboard/wishlist" icon={<FaStar className="text-red-500" />} label="Wishlist" description="Your saved items" />
//           <AccountItem to="/dashboard/coupons" icon={<TbBrandProducthunt className="text-green-500" />} label="Coupons & Offers" description="Available discounts & deals" />
//           <AccountItem to="/dashboard/help" icon={<TbHelp className="text-orange-500" />} label="Help Center" description="Get support & answers" />
//         </SectionContainer>

//         {/* Profile Details */}
//         <SectionContainer title="Profile Details">
//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <DetailCard icon={<MdCalendarToday className="text-blue-500" />} label="Date of Birth" value={user.dob ? new Date(user.dob).toLocaleDateString() : 'Not set'} />
//             <DetailCard icon={<MdTransgender className="text-purple-500" />} label="Gender" value={user.gender || 'Not set'} />
//           </div>
//           <div className="flex gap-3">
//             <Link to="/dashboard/profile" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-semibold transition-all shadow-sm active:scale-95">Edit Profile</Link>
//             {user.avatar && (
//               <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRemoveAvatar} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-3 rounded-xl font-semibold transition-all shadow-sm border border-gray-300">
//                 Remove Avatar
//               </motion.button>
//             )}
//           </div>
//         </SectionContainer>

//         {/* Account Settings */}
//         <SectionContainer title="Account Settings">
//           <AccountItem to="/dashboard/plus" icon={<RiCoinsLine className="text-purple-500" />} label="Quickoo Plus" description="Premium features & benefits" />
//           <AccountItem to="/dashboard/profile" icon={<FaUserCircle className="text-blue-500" />} label="Edit Profile" description="Update personal information" />
//           <AccountItem to="/dashboard/cards" icon={<MdCreditCard className="text-green-500" />} label="Saved Cards & Wallet" description="Payment methods & balance" />
//           <AccountItem to="/dashboard/address" icon={<GrMapLocation className="text-red-500" />} label="Saved Addresses" description="Delivery & billing addresses" />
//           <AccountItem to="/dashboard/language" icon={<IoLanguage className="text-indigo-500" />} label="Select Language" description="App language preferences" />
//           <AccountItem to="/dashboard/notifications" icon={<MdNotifications className="text-yellow-500" />} label="Notification Settings" description="Manage alerts & updates" />
//         </SectionContainer>

//         {/* Admin Dashboard */}
//         {isAdmin(user.role) && (
//           <SectionContainer title="Admin Dashboard">
//             <AccountItem to="/dashboard/category" icon={<TbCategoryPlus className="text-blue-500" />} label="Category Management" description="Manage product categories" />
//             <AccountItem to="/dashboard/subcategory" icon={<MdOutlineCategory className="text-green-500" />} label="Sub Categories" description="Organize sub-categories" />
//             <AccountItem to="/dashboard/upload-product" icon={<MdOutlineCloudUpload className="text-orange-500" />} label="Upload Product" description="Add new products" />
//             <AccountItem to="/dashboard/product" icon={<TbBrandProducthunt className="text-purple-500" />} label="Product Management" description="Manage all products" />
//             <AccountItem to="/dashboard/manage-order" icon={<LuPackageCheck  className="text-amber-500" />} label="Order Management" description="Manage all orders" />
//             <AccountItem to="/dashboard/alluser" icon={<LuUsers className="text-red-500" />} label="User Management" description="Administer user accounts" />
//             <AccountItem to="/dashboard/analytics" icon={<SiAnalogue  className="text-gray-500" />} label="Analytics" description="SEO for products" />
//           </SectionContainer>
//         )}

//         {/* My Activity */}
//         <SectionContainer title="My Activity">
//           <AccountItem to="/dashboard/reviews" icon={<MdReviews className="text-green-500" />} label="My Reviews" description="Product reviews & ratings" />
//           <AccountItem to="/questions" icon={<FaQuestionCircle className="text-blue-500" />} label="Q&A" description="Questions & answers" />
//         </SectionContainer>

//         {/* Earn with Quickoo */}
//         <SectionContainer title="Earn with Quickoo">
//           <AccountItem to="/sell" icon={<TbCategoryPlus className="text-green-500" />} label="Sell on Quickoo" description="Start your business" />
//           <AccountItem to="/feedback" icon={<MdPrivacyTip className="text-blue-500" />} label="Feedback" description="Share your suggestions" />
//           <AccountItem to="/terms" icon={<span className="text-gray-500 text-sm">📄</span>} label="Terms & Policies" description="Legal information" />
//           <AccountItem to="/faq" icon={<TbHelp className="text-orange-500" />} label="FAQs" description="Frequently asked questions" />
//         </SectionContainer>

//         {/* Logout */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
//           <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition-all shadow-sm active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed">
//             {isLoggingOut ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <>
//               <TbLogout size={20} />
//               <span className="text-base">Logout</span>
//             </>}
//           </motion.button>
//         </motion.div>
//       </div>

//       {/* Avatar Upload Modal */}
//       {openAvatarEdit && <UserFileUploadAvatar close={() => setOpenAvatarEdit(false)} />}
//     </div>
//   );
// };

// // =========================
// // Memoized Sub-Components
// // =========================

// const UserProfileCard = memo(({ user, openAvatarEdit, setOpenAvatarEdit, handleRemoveAvatar }) => (
//   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
//     <div className="flex items-center gap-4">
//       <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
//         <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
//           {user.avatar ? <img src={user.avatar} alt="User" className="w-full h-full rounded-full object-cover" /> : <FaUserCircle size={48} className="text-gray-400" />}
//         </div>
//         <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setOpenAvatarEdit(true)} className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 p-2 rounded-full shadow-lg transition-all duration-200 border-2 border-white">
//           <IoCamera size={14} className="text-white" />
//         </motion.button>
//       </motion.div>
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 mb-1">
//           <h2 className="text-lg font-bold text-gray-900 truncate">Hi, {user.name}</h2>
//           <span className="text-lg">👋</span>
//           {isAdmin(user.role) && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Admin</span>}
//         </div>
//         <div className="space-y-1">
//           <p className="text-sm text-gray-600 flex items-center gap-2"><MdPhone className="text-blue-500 flex-shrink-0" size={14} /><span className="truncate">{user.mobile || 'Not set'}</span></p>
//           <p className="text-sm text-gray-600 flex items-center gap-2"><MdEmail className="text-blue-500 flex-shrink-0" size={14} /><span className="truncate">{user.email}</span></p>
//           <motion.div whileHover={{ scale: 1.02 }} className="flex items-center w-fit gap-2 text-sm bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-200 mt-2">
//             <RiCoinsLine className="text-yellow-500 flex-shrink-0" size={16} />
//             <span className="text-gray-700 font-medium">Quickoo Coins:</span>
//             <span className="font-bold text-yellow-600">{user.superCoins?.balance ?? 0}</span>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   </motion.div>
// ));

// const QuickooPlusCard = memo(({ balance }) => (
//   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-blue-50 rounded-2xl p-4 shadow-sm border border-blue-200">
//     <div className="flex items-center gap-3">
//       <div className="p-2 bg-blue-100 rounded-lg"><RiCoinsLine className="text-blue-600" size={20} /></div>
//       <div>
//         <h3 className="font-semibold text-gray-900">Quickoo Plus</h3>
//         <p className="text-sm text-gray-600">{balance} coins available</p>
//       </div>
//       <motion.div whileHover={{ scale: 1.05 }} className="ml-auto bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full transition-colors">
//         <span className="text-blue-700 text-sm font-medium">View</span>
//       </motion.div>
//     </div>
//   </motion.div>
// ));

// const DetailCard = memo(({ icon, label, value }) => (
//   <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="bg-gray-50 p-3 rounded-xl border border-gray-300 shadow-sm">
//     <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs font-semibold text-gray-600">{label}</span></div>
//     <p className="text-sm font-bold text-gray-900 truncate">{value}</p>
//   </motion.div>
// ));

// const SectionContainer = ({ title, children, icon = "📁" }) => (
//   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//     <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
//       <div className="flex items-center gap-3">
//         <span className="text-lg">{icon}</span>
//         <h3 className="text-base font-bold text-gray-900">{title}</h3>
//       </div>
//       <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//     </div>
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="p-4 space-y-2">{children}</motion.div>
//   </motion.div>
// );

// const AccountItem = ({ to, icon, label, description }) => {
//   const content = (
//     <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="flex items-center justify-between w-full py-3 px-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200">
//       <div className="flex items-center gap-4 flex-1">
//         <motion.div whileHover={{ scale: 1.1 }} className="p-2 bg-gray-100 rounded-lg shadow-sm">{icon}</motion.div>
//         <div className="flex-1 min-w-0">
//           <span className="text-sm font-semibold text-gray-900 block">{label}</span>
//           {description && <span className="text-xs text-gray-500 block mt-1 truncate">{description}</span>}
//         </div>
//       </div>
//       <IoIosArrowForward className="text-gray-400 flex-shrink-0" size={16} />
//     </motion.div>
//   );

//   return to ? <Link to={to} className="block -mx-2">{content}</Link> : <div className="block -mx-2 cursor-pointer">{content}</div>;
// };

// export default UserAccount;


// import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
// import { FaUserCircle, FaStar, FaQuestionCircle } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { TbLogout, TbCategoryPlus, TbBrandProducthunt, TbHelp } from 'react-icons/tb';
// import { MdOutlineCategory, MdOutlineCloudUpload, MdEmail, MdNotifications, MdCreditCard, MdPrivacyTip, MdReviews, MdTransgender, MdCalendarToday, MdPhone } from 'react-icons/md';
// import { LuUsers, LuPackageCheck } from 'react-icons/lu';
// import { GrMapLocation } from 'react-icons/gr';
// import { RiCoinsLine } from 'react-icons/ri';
// import { IoIosArrowForward } from 'react-icons/io';
// import { IoCamera, IoLanguage } from 'react-icons/io5';
// import toast from 'react-hot-toast';
// import { motion, AnimatePresence } from 'framer-motion';
// import { SiAnalogue } from "react-icons/si";
// import { debounce } from 'lodash';

// import Axios from '../utils/axios';
// import SummaryApi from '../comman/summaryApi';
// import AxiosToastError from '../utils/AxiosToastErroe';
// import { logout, setUserDetails } from '../Store/userSlice';
// import isAdmin from '../utils/IsAdmin';
// import fetchUserDetails from '../utils/featchUserDetails';
// import UserFileUploadAvatar from '../components/UserFileUploadAvatar';

// const UserAccount = () => {
//   const user = useSelector(state => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [openAvatarEdit, setOpenAvatarEdit] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [isMobile, setIsMobile] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);

//   // Session validation and redirection
//   useEffect(() => {
//     const validateSession = async () => {
//       if (!user?._id) {
//         const userData = await fetchUserDetails();
//         if (!userData?.data?._id) {
//           toast.error('Session expired. Please login again.');
//           dispatch(logout());
//           localStorage.clear();
//           navigate('/', { replace: true });
//           return;
//         }
//         dispatch(setUserDetails(userData.data));
//       }
//     };

//     validateSession();
//   }, [user?._id, dispatch, navigate]);

//   // Optimized resize handler with debouncing
//   useEffect(() => {
//     const checkScreenSize = debounce(() => {
//       const mobile = window.innerWidth < 1024;
//       setIsMobile(mobile);
//       if (!mobile) {
//         navigate('/dashboard/profile', { replace: true });
//       }
//     }, 100);

//     window.scrollTo(0, 0);
//     checkScreenSize();
    
//     window.addEventListener('resize', checkScreenSize);
//     return () => {
//       checkScreenSize.cancel();
//       window.removeEventListener('resize', checkScreenSize);
//     };
//   }, [navigate]);

//   const handleLogout = useCallback(async () => {
//     if (isLoggingOut) return;
    
//     setIsLoggingOut(true);
//     try {
//       const response = await Axios({ ...SummaryApi.logout });
//       if (response.data.success) {
//         dispatch(logout());
//         localStorage.clear();
//         navigate('/', { replace: true });
//         toast.dismiss();
//         toast.success(response.data.message);
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     } finally {
//       setIsLoggingOut(false);
//     }
//   }, [dispatch, navigate, isLoggingOut]);

//   const handleRemoveAvatar = useCallback(async () => {
//     if (isLoading) return;
    
//     setIsLoading(true);
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
//     } finally {
//       setIsLoading(false);
//     }
//   }, [dispatch, isLoading]);

//   // Memoized user data for performance
//   const userData = useMemo(() => ({
//     name: user?.name || 'User',
//     email: user?.email || '',
//     mobile: user?.mobile || 'Not set',
//     avatar: user?.avatar,
//     role: user?.role,
//     dob: user?.dob,
//     gender: user?.gender,
//     superCoins: user?.superCoins?.balance ?? 0
//   }), [user]);

//   if (!user?._id) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isMobile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-100 relative overflow-hidden">
//         <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-300 rounded-full opacity-20 blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-400 rounded-full opacity-20 blur-3xl" />

//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="relative flex flex-col items-center justify-center backdrop-blur-lg bg-white/40 border border-white/20 rounded-2xl p-8 shadow-2xl"
//         >
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//             className="relative w-14 h-14 rounded-full border-t-4 border-b-4 border-transparent border-t-amber-500 border-b-orange-400 shadow-[0_0_15px_rgba(255,159,67,0.6)]"
//           />
//           <motion.p
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-gray-700 mt-5 font-medium tracking-wide"
//           >
//             Redirecting to your profile...
//           </motion.p>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-8">
//       <div className="max-w-full mx-auto space-y-4 pt-4 px-3">
//         {/* User Profile Card */}
//         <UserProfileCard 
//           user={userData} 
//           openAvatarEdit={openAvatarEdit} 
//           setOpenAvatarEdit={setOpenAvatarEdit} 
//           handleRemoveAvatar={handleRemoveAvatar}
//           isLoading={isLoading}
//         />

//         {/* Quickoo Plus Card */}
//         <QuickooPlusCard balance={userData.superCoins} />

//         {/* Quick Actions */}
//         <SectionContainer title="Quick Actions" icon="">
//           <AccountItem to="/dashboard/myorder" icon={<LuPackageCheck className="text-blue-500" />} label="My Orders" description="Track your orders & purchases" />
//           <AccountItem to="/dashboard/wishlist" icon={<FaStar className="text-red-500" />} label="Wishlist" description="Your saved items" />
//           <AccountItem to="/dashboard/coupons" icon={<TbBrandProducthunt className="text-green-500" />} label="Coupons & Offers" description="Available discounts & deals" />
//           <AccountItem to="/dashboard/help" icon={<TbHelp className="text-orange-500" />} label="Help Center" description="Get support & answers" />
//         </SectionContainer>

//         {/* Profile Details */}
//         <SectionContainer title="Profile Details" icon="">
//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <DetailCard icon={<MdCalendarToday className="text-blue-500" />} label="Date of Birth" value={userData.dob ? new Date(userData.dob).toLocaleDateString() : 'Not set'} />
//             <DetailCard icon={<MdTransgender className="text-purple-500" />} label="Gender" value={userData.gender || 'Not set'} />
//           </div>
//           <div className="flex gap-3">
//             <Link to="/dashboard/profile" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-3 rounded-xl font-semibold transition-all shadow-lg active:scale-95 transform duration-200">
//               Edit Profile
//             </Link>
//             {userData.avatar && (
//               <motion.button 
//                 whileHover={{ scale: 1.02 }} 
//                 whileTap={{ scale: 0.98 }} 
//                 onClick={handleRemoveAvatar} 
//                 disabled={isLoading}
//                 className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-3 rounded-xl font-semibold transition-all shadow-sm border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? 'Removing...' : 'Remove Avatar'}
//               </motion.button>
//             )}
//           </div>
//         </SectionContainer>

//         {/* Account Settings */}
//         <SectionContainer title="Account Settings" icon="">
//           <AccountItem to="/dashboard/plus" icon={<RiCoinsLine className="text-purple-500" />} label="Quickoo Plus" description="Premium features & benefits" />
//           <AccountItem to="/dashboard/profile" icon={<FaUserCircle className="text-blue-500" />} label="Edit Profile" description="Update personal information" />
//           <AccountItem to="/dashboard/cards" icon={<MdCreditCard className="text-green-500" />} label="Saved Cards & Wallet" description="Payment methods & balance" />
//           <AccountItem to="/dashboard/address" icon={<GrMapLocation className="text-red-500" />} label="Saved Addresses" description="Delivery & billing addresses" />
//           <AccountItem to="/dashboard/language" icon={<IoLanguage className="text-indigo-500" />} label="Select Language" description="App language preferences" />
//           <AccountItem to="/dashboard/notifications" icon={<MdNotifications className="text-yellow-500" />} label="Notification Settings" description="Manage alerts & updates" />
//         </SectionContainer>

//         {/* Admin Dashboard */}
//         {isAdmin(userData.role) && (
//           <SectionContainer title="Admin Dashboard" icon="">
//             <AccountItem to="/dashboard/category" icon={<TbCategoryPlus className="text-blue-500" />} label="Category Management" description="Manage product categories" />
//             <AccountItem to="/dashboard/subcategory" icon={<MdOutlineCategory className="text-green-500" />} label="Sub Categories" description="Organize sub-categories" />
//             <AccountItem to="/dashboard/upload-product" icon={<MdOutlineCloudUpload className="text-orange-500" />} label="Upload Product" description="Add new products" />
//             <AccountItem to="/dashboard/product" icon={<TbBrandProducthunt className="text-purple-500" />} label="Product Management" description="Manage all products" />
//             <AccountItem to="/dashboard/manage-order" icon={<LuPackageCheck className="text-amber-500" />} label="Order Management" description="Manage all orders" />
//             <AccountItem to="/dashboard/alluser" icon={<LuUsers className="text-red-500" />} label="User Management" description="Administer user accounts" />
//             <AccountItem to="/dashboard/analytics" icon={<SiAnalogue className="text-gray-500" />} label="Analytics" description="SEO for products" />
//           </SectionContainer>
//         )}

//         {/* My Activity */}
//         <SectionContainer title="My Activity" icon="">
//           <AccountItem to="/dashboard/reviews" icon={<MdReviews className="text-green-500" />} label="My Reviews" description="Product reviews & ratings" />
//           <AccountItem to="/questions" icon={<FaQuestionCircle className="text-blue-500" />} label="Q&A" description="Questions & answers" />
//         </SectionContainer>

//         {/* Earn with Quickoo */}
//         <SectionContainer title="Earn with Quickoo" icon="">
//           <AccountItem to="/sell" icon={<TbCategoryPlus className="text-green-500" />} label="Sell on Quickoo" description="Start your business" />
//           <AccountItem to="/feedback" icon={<MdPrivacyTip className="text-blue-500" />} label="Feedback" description="Share your suggestions" />
//           <AccountItem to="/terms" icon={<span className="text-gray-500 text-sm">📄</span>} label="Terms & Policies" description="Legal information" />
//           <AccountItem to="/faq" icon={<TbHelp className="text-orange-500" />} label="FAQs" description="Frequently asked questions" />
//         </SectionContainer>

//         {/* Logout */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }} 
//           animate={{ opacity: 1, y: 0 }} 
//           transition={{ delay: 0.3 }} 
//           className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200"
//         >
//           <motion.button 
//             whileHover={{ scale: 1.02 }} 
//             whileTap={{ scale: 0.98 }} 
//             onClick={handleLogout} 
//             disabled={isLoggingOut}
//             className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 rounded-xl transition-all shadow-lg active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed"
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
//       <AnimatePresence>
//         {openAvatarEdit && (
//           <UserFileUploadAvatar close={() => setOpenAvatarEdit(false)} />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // =========================
// // Optimized Memoized Sub-Components
// // =========================

// const UserProfileCard = memo(({ user, setOpenAvatarEdit, handleRemoveAvatar, isLoading }) => {
//   const isUserAdmin = useMemo(() => isAdmin(user.role), [user.role]);

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }} 
//       animate={{ opacity: 1, y: 0 }} 
//       transition={{ duration: 0.3 }}
//       className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
//     >
//       <div className="flex items-center gap-4">
//         <motion.div 
//           whileHover={{ scale: 1.05 }} 
//           whileTap={{ scale: 0.95 }} 
//           className="relative"
//         >
//           <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-xl">
//             {user.avatar ? (
//               <img 
//                 src={user.avatar} 
//                 alt="User" 
//                 className="w-full h-full rounded-full object-cover"
//                 loading="lazy"
//               />
//             ) : (
//               <FaUserCircle size={48} className="text-gray-400" />
//             )}
//           </div>
//           <motion.button 
//             whileHover={{ scale: 1.1 }} 
//             whileTap={{ scale: 0.9 }} 
//             onClick={() => setOpenAvatarEdit(true)}
//             className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-2 rounded-full shadow-lg transition-all duration-200 border-2 border-white"
//           >
//             <IoCamera size={14} className="text-white" />
//           </motion.button>
//         </motion.div>
        
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2 mb-1">
//             <h2 className="text-lg font-bold text-gray-900 truncate">Hi, {user.name}</h2>
//             <span className="text-lg">👋</span>
//             {isUserAdmin && (
//               <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
//                 Admin
//               </span>
//             )}
//           </div>
//           <div className="space-y-1">
//             <p className="text-sm text-gray-600 flex items-center gap-2">
//               <MdPhone className="text-blue-500 flex-shrink-0" size={14} />
//               <span className="truncate">{user.mobile}</span>
//             </p>
//             <p className="text-sm text-gray-600 flex items-center gap-2">
//               <MdEmail className="text-blue-500 flex-shrink-0" size={14} />
//               <span className="truncate">{user.email}</span>
//             </p>
//             <motion.div 
//               whileHover={{ scale: 1.02 }}
//               className="flex items-center w-fit gap-2 text-sm bg-gradient-to-r from-yellow-50 to-amber-50 px-3 py-1 rounded-lg border border-yellow-200 mt-2"
//             >
//               <RiCoinsLine className="text-yellow-500 flex-shrink-0" size={16} />
//               <span className="text-gray-700 font-medium">Quickoo Coins:</span>
//               <span className="font-bold text-yellow-600">{user.superCoins}</span>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// });

// const QuickooPlusCard = memo(({ balance }) => (
//   <motion.div 
//     initial={{ opacity: 0, y: 20 }} 
//     animate={{ opacity: 1, y: 0 }} 
//     transition={{ delay: 0.1 }}
//     className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 shadow-lg border border-blue-200"
//   >
//     <div className="flex items-center gap-3">
//       <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
//         <RiCoinsLine className="text-blue-600" size={20} />
//       </div>
//       <div className="flex-1">
//         <h3 className="font-semibold text-gray-900">Quickoo Plus</h3>
//         <p className="text-sm text-gray-600">{balance} coins available</p>
//       </div>
//       <motion.div 
//         whileHover={{ scale: 1.05 }}
//         className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full transition-colors shadow-sm"
//       >
//         <span className="text-blue-700 text-sm font-medium">View</span>
//       </motion.div>
//     </div>
//   </motion.div>
// ));

// const DetailCard = memo(({ icon, label, value }) => (
//   <motion.div 
//     whileHover={{ scale: 1.03 }} 
//     whileTap={{ scale: 0.97 }}
//     className="bg-gray-50 p-3 rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
//   >
//     <div className="flex items-center gap-2 mb-2">
//       {icon}
//       <span className="text-xs font-semibold text-gray-600">{label}</span>
//     </div>
//     <p className="text-sm font-bold text-gray-900 truncate">{value}</p>
//   </motion.div>
// ));

// const SectionContainer = memo(({ title, children, icon = "📁" }) => (
//   <motion.div 
//     initial={{ opacity: 0, y: 20 }} 
//     animate={{ opacity: 1, y: 0 }}
//     className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
//   >
//     <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
//       <div className="flex items-center gap-3">
//         <span className="text-lg">{icon}</span>
//         <h3 className="text-base font-bold text-gray-900">{title}</h3>
//       </div>
//     </div>
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ delay: 0.1 }}
//       className="p-4 space-y-2"
//     >
//       {children}
//     </motion.div>
//   </motion.div>
// ));

// const AccountItem = memo(({ to, icon, label, description }) => {
//   const content = (
//     <motion.div 
//       whileHover={{ scale: 1.01, x: 4 }} 
//       whileTap={{ scale: 0.99 }}
//       className="flex items-center justify-between w-full py-3 px-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200 group"
//     >
//       <div className="flex items-center gap-4 flex-1">
//         <motion.div 
//           whileHover={{ scale: 1.1 }}
//           className="p-2 bg-gray-100 rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
//         >
//           {icon}
//         </motion.div>
//         <div className="flex-1 min-w-0">
//           <span className="text-sm font-semibold text-gray-900 block">{label}</span>
//           {description && (
//             <span className="text-xs text-gray-500 block mt-1 truncate">
//               {description}
//             </span>
//           )}
//         </div>
//       </div>
//       <IoIosArrowForward className="text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors" size={16} />
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
// });

// export default memo(UserAccount);

import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { SiAnalogue } from "react-icons/si";
import { debounce } from 'lodash';

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
  const [isLoading, setIsLoading] = useState(false);

  // Session validation and redirection
  useEffect(() => {
    const validateSession = async () => {
      if (!user?._id) {
        const userData = await fetchUserDetails();
        if (!userData?.data?._id) {
          toast.dismiss()
          toast.error('Session expired. Please login again.');
          dispatch(logout());
          localStorage.clear();
          navigate('/', { replace: true });
          return;
        }
        dispatch(setUserDetails(userData.data));
      }
    };

    validateSession();
  }, [user?._id, dispatch, navigate]);

  // Optimized resize handler with debouncing
  useEffect(() => {
    const checkScreenSize = debounce(() => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        navigate('/dashboard/profile', { replace: true });
      }
    }, 100);

    window.scrollTo(0, 0);
    checkScreenSize();
    
    window.addEventListener('resize', checkScreenSize);
    return () => {
      checkScreenSize.cancel();
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      const response = await Axios({ ...SummaryApi.logout });
      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        navigate('/', { replace: true });
        toast.dismiss();
        toast.success(response.data.message);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, navigate, isLoggingOut]);

  const handleRemoveAvatar = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, isLoading]);

  // Memoized user data for performance
  const userData = useMemo(() => ({
    name: user?.name || 'User',
    email: user?.email || '',
    mobile: user?.mobile || 'Not set',
    avatar: user?.avatar,
    role: user?.role,
    dob: user?.dob,
    gender: user?.gender,
    superCoins: user?.superCoins?.balance ?? 0
  }), [user]);

  if (!user?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-400 rounded-full opacity-20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex flex-col items-center justify-center backdrop-blur-lg bg-white/40 border border-white/20 rounded-2xl p-8 shadow-2xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="relative w-14 h-14 rounded-full border-t-4 border-b-4 border-transparent border-t-blue-500 border-b-indigo-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-700 mt-5 font-medium tracking-wide"
          >
            Redirecting to your profile...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-8">
      <div className="max-w-full mx-auto space-y-4 pt-4 px-3">
        {/* User Profile Card */}
        <UserProfileCard 
          user={userData} 
          openAvatarEdit={openAvatarEdit} 
          setOpenAvatarEdit={setOpenAvatarEdit} 
          handleRemoveAvatar={handleRemoveAvatar}
          isLoading={isLoading}
        />

        {/* Quickoo Plus Card */}
        <QuickooPlusCard balance={userData.superCoins} />

        {/* Quick Actions */}
        <SectionContainer title="Quick Actions" icon="🚀">
          <AccountItem to="/dashboard/myorder" icon={<LuPackageCheck className="text-blue-600" />} label="My Orders" description="Track your orders & purchases" />
          <AccountItem to="/dashboard/wishlist" icon={<FaStar className="text-amber-500" />} label="Wishlist" description="Your saved items" />
          <AccountItem to="/dashboard/coupons" icon={<TbBrandProducthunt className="text-emerald-500" />} label="Coupons & Offers" description="Available discounts & deals" />
          <AccountItem to="/dashboard/help" icon={<TbHelp className="text-orange-500" />} label="Help Center" description="Get support & answers" />
        </SectionContainer>

        {/* Profile Details */}
        <SectionContainer title="Profile Details" icon="👤">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <DetailCard icon={<MdCalendarToday className="text-blue-500" />} label="Date of Birth" value={userData.dob ? new Date(userData.dob).toLocaleDateString() : 'Not set'} />
            <DetailCard icon={<MdTransgender className="text-purple-500" />} label="Gender" value={userData.gender || 'Not set'} />
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard/profile" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center py-3 rounded-xl font-semibold transition-all shadow-lg active:scale-95 transform duration-200">
              Edit Profile
            </Link>
            {userData.avatar && (
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={handleRemoveAvatar} 
                disabled={isLoading}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-center py-3 rounded-xl font-semibold transition-all shadow-sm border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Removing...' : 'Remove Avatar'}
              </motion.button>
            )}
          </div>
        </SectionContainer>

        {/* Account Settings */}
        <SectionContainer title="Account Settings" icon="⚙️">
          <AccountItem to="/dashboard/plus" icon={<RiCoinsLine className="text-purple-500" />} label="Quickoo Plus" description="Premium features & benefits" />
          <AccountItem to="/dashboard/profile" icon={<FaUserCircle className="text-blue-500" />} label="Edit Profile" description="Update personal information" />
          <AccountItem to="/dashboard/cards" icon={<MdCreditCard className="text-emerald-500" />} label="Saved Cards & Wallet" description="Payment methods & balance" />
          <AccountItem to="/dashboard/address" icon={<GrMapLocation className="text-rose-500" />} label="Saved Addresses" description="Delivery & billing addresses" />
          <AccountItem to="/dashboard/language" icon={<IoLanguage className="text-indigo-500" />} label="Select Language" description="App language preferences" />
          <AccountItem to="/dashboard/notifications" icon={<MdNotifications className="text-amber-500" />} label="Notification Settings" description="Manage alerts & updates" />
        </SectionContainer>

        {/* Admin Dashboard */}
        {isAdmin(userData.role) && (
          <SectionContainer title="Admin Dashboard" icon="🛠️">
            <AccountItem to="/dashboard/category" icon={<TbCategoryPlus className="text-blue-500" />} label="Category Management" description="Manage product categories" />
            <AccountItem to="/dashboard/subcategory" icon={<MdOutlineCategory className="text-emerald-500" />} label="Sub Categories" description="Organize sub-categories" />
            <AccountItem to="/dashboard/upload-product" icon={<MdOutlineCloudUpload className="text-orange-500" />} label="Upload Product" description="Add new products" />
            <AccountItem to="/dashboard/product" icon={<TbBrandProducthunt className="text-purple-500" />} label="Product Management" description="Manage all products" />
            <AccountItem to="/dashboard/manage-order" icon={<LuPackageCheck className="text-amber-500" />} label="Order Management" description="Manage all orders" />
            <AccountItem to="/dashboard/alluser" icon={<LuUsers className="text-rose-500" />} label="User Management" description="Administer user accounts" />
            <AccountItem to="/dashboard/analytics" icon={<SiAnalogue className="text-slate-500" />} label="Analytics" description="SEO for products" />
          </SectionContainer>
        )}

        {/* My Activity */}
        <SectionContainer title="My Activity" icon="📊">
          <AccountItem to="/dashboard/reviews" icon={<MdReviews className="text-emerald-500" />} label="My Reviews" description="Product reviews & ratings" />
          <AccountItem to="/questions" icon={<FaQuestionCircle className="text-blue-500" />} label="Q&A" description="Questions & answers" />
        </SectionContainer>

        {/* Earn with Quickoo */}
        <SectionContainer title="Earn with Quickoo" icon="💼">
          <AccountItem to="/sell" icon={<TbCategoryPlus className="text-emerald-500" />} label="Sell on Quickoo" description="Start your business" />
          <AccountItem to="/feedback" icon={<MdPrivacyTip className="text-blue-500" />} label="Feedback" description="Share your suggestions" />
          <AccountItem to="/terms" icon={<span className="text-slate-500 text-sm">📄</span>} label="Terms & Policies" description="Legal information" />
          <AccountItem to="/faq" icon={<TbHelp className="text-orange-500" />} label="FAQs" description="Frequently asked questions" />
        </SectionContainer>

        {/* Logout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }} 
          className="bg-white rounded-2xl shadow-lg p-4 border border-slate-200"
        >
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <TbLogout size={20} />
                <span className="text-base">Logout</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Avatar Upload Modal */}
      <AnimatePresence>
        {openAvatarEdit && (
          <UserFileUploadAvatar close={() => setOpenAvatarEdit(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// =========================
// Optimized Memoized Sub-Components
// =========================

const UserProfileCard = memo(({ user, setOpenAvatarEdit, handleRemoveAvatar, isLoading }) => {
  const isUserAdmin = useMemo(() => isAdmin(user.role), [user.role]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-6 border border-blue-100"
    >
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          className="relative"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-4 border-white shadow-xl">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="User" 
                className="w-full h-full rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <FaUserCircle size={48} className="text-blue-400" />
            )}
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }} 
            onClick={() => setOpenAvatarEdit(true)}
            className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 p-2 rounded-full shadow-lg transition-all duration-200 border-2 border-white"
          >
            <IoCamera size={14} className="text-white" />
          </motion.button>
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-slate-900 truncate">Hi, {user.name}</h2>
            <span className="text-lg">👋</span>
            {isUserAdmin && (
              <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium border border-blue-200">
                Admin
              </span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <MdPhone className="text-blue-500 flex-shrink-0" size={14} />
              <span className="truncate">{user.mobile}</span>
            </p>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <MdEmail className="text-blue-500 flex-shrink-0" size={14} />
              <span className="truncate">{user.email}</span>
            </p>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center w-fit gap-2 text-sm bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1 rounded-lg border border-amber-200 mt-2"
            >
              <RiCoinsLine className="text-amber-500 flex-shrink-0" size={16} />
              <span className="text-slate-700 font-medium">Quickoo Coins:</span>
              <span className="font-bold text-amber-600">{user.superCoins}</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const QuickooPlusCard = memo(({ balance }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: 0.1 }}
    className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 shadow-lg border border-indigo-200"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-indigo-100 rounded-lg shadow-sm">
        <RiCoinsLine className="text-indigo-600" size={20} />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900">Quickoo Plus</h3>
        <p className="text-sm text-slate-600">{balance} coins available</p>
      </div>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-full transition-colors shadow-sm"
      >
        <span className="text-indigo-700 text-sm font-medium">View</span>
      </motion.div>
    </div>
  </motion.div>
));

const DetailCard = memo(({ icon, label, value }) => (
  <motion.div 
    whileHover={{ scale: 1.03 }} 
    whileTap={{ scale: 0.97 }}
    className="bg-gradient-to-br from-slate-50 to-blue-50 p-3 rounded-xl border border-slate-300 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-xs font-semibold text-slate-600">{label}</span>
    </div>
    <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
  </motion.div>
));

const SectionContainer = memo(({ title, children, icon = "📁" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
  >
    <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
      </div>
    </div>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="p-4 space-y-2"
    >
      {children}
    </motion.div>
  </motion.div>
));

const AccountItem = memo(({ to, icon, label, description }) => {
  const content = (
    <motion.div 
      whileHover={{ scale: 1.01, x: 4 }} 
      whileTap={{ scale: 0.99 }}
      className="flex items-center justify-between w-full py-3 px-2 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 border border-transparent hover:border-blue-200 group"
    >
      <div className="flex items-center gap-4 flex-1">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow border border-slate-200"
        >
          {icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-slate-900 block">{label}</span>
          {description && (
            <span className="text-xs text-slate-500 block mt-1 truncate">
              {description}
            </span>
          )}
        </div>
      </div>
      <IoIosArrowForward className="text-slate-400 flex-shrink-0 group-hover:text-slate-600 transition-colors" size={16} />
    </motion.div>
  );

  return to ? (
    <Link to={to} className="block -mx-2">
      {content}
    </Link>
  ) : (
    <div className="block -mx-2 cursor-pointer">
      {content}
    </div>
  );
});

export default memo(UserAccount);