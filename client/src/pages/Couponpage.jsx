// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import Axios from "../utils/network/axios";
// import toast from "react-hot-toast";
// import { 
//   FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaInfoCircle, 
//   FaCalendarAlt, FaUsers, FaTags, FaPercentage, FaRupeeSign, 
//   FaShoppingCart, FaChevronDown, FaSave, FaPlus,
//   FaSearch, FaFilter, FaClock, FaUserCheck, FaBox,
//   FaFire, FaRocket, FaGem, FaCrown, FaCopy,
//   FaTimes, FaExclamationTriangle, FaCheckCircle,
//   FaPowerOff, FaEye, FaEyeSlash
// } from "react-icons/fa";
// import { VscGraph } from "react-icons/vsc";


// const initialFormState = {
//   code: "",
//   discountType: "percent",
//   discountValue: "",
//   minAmount: "",
//   maxDiscount: "",
//   startDate: "",
//   endDate: "",
//   isActive: true,
//   usageLimit: "",
//   userUsageLimit: "",
//   minProducts: "",
//   maxProducts: "",
//   stackable: false,
//   autoApply: false,
//   firstOrderOnly: false,
//   customerEligibility: "all",
//   eligibleCustomers: [],
//   description: "",
//   termsAndConditions: "",
//   priority: "",
//   applicableCategories: [],
//   excludedCategories: [],
//   applicableProducts: [],
//   excludedProducts: [],
//   applicableBrands: [],
// };

// // Custom Confirmation Modal Component
// const ConfirmationModal = React.memo(({ 
//   isOpen, 
//   onClose, 
//   onConfirm, 
//   title, 
//   message, 
//   confirmText = "Confirm", 
//   cancelText = "Cancel",
//   type = "warning" 
// }) => {
//   if (!isOpen) return null;

//   const typeConfig = {
//     warning: { icon: FaExclamationTriangle, color: "text-yellow-500", bgColor: "bg-yellow-200" },
//     danger: { icon: FaExclamationTriangle, color: "text-red-500", bgColor: "bg-red-200" },
//     success: { icon: FaCheckCircle, color: "text-green-500", bgColor: "bg-green-50" },
//     info: { icon: FaInfoCircle, color: "text-blue-500", bgColor: "bg-blue-50" }
//   };

//   const config = typeConfig[type];
//   const Icon = config.icon;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
//       <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
//         <div className={`px-6 py-3 ${config.bgColor} rounded-t-2xl`}>
//           <div className="flex items-center gap-3">
//             <Icon className={`text-2xl ${config.color}`} />
//             <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//           </div>
//         </div>
        
//         <div className="p-6">
//           <p className="text-gray-600 mb-6">{message}</p>
          
//           <div className="flex gap-3 justify-end">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
//             >
//               {cancelText}
//             </button>
//             <button
//               onClick={onConfirm}
//               className={`px-4 py-2 text-white font-medium rounded-lg transition-colors ${
//                 type === "danger" 
//                   ? "bg-red-500 hover:bg-red-600" 
//                   : type === "success"
//                   ? "bg-green-500 hover:bg-green-600"
//                   : "bg-amber-500 hover:bg-amber-600"
//               }`}
//             >
//               {confirmText}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// // Custom Success Modal
// const SuccessModal = React.memo(({ isOpen, onClose, title, message }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//       <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full transform transition-all text-center p-6">
//         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//           <FaCheckCircle className="text-3xl text-green-500" />
//         </div>
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
//         <p className="text-gray-600 mb-6">{message}</p>
//         <button
//           onClick={onClose}
//           className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-lg transition-colors"
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// });

// // Enhanced Custom Dropdown Component
// const Dropdown = React.memo(({ 
//   value, 
//   options, 
//   onChange, 
//   placeholder, 
//   className = "",
//   icon: Icon 
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
  
//   const selectedOption = options.find(opt => opt.value === value);

//   return (
//     <div className={`relative ${className}`}>
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-400 transition-all text-left shadow-sm"
//       >
//         <div className="flex items-center gap-3">
//           {Icon && <Icon className="text-amber-500 text-sm" />}
//           <span className="text-gray-700 font-medium">
//             {selectedOption ? selectedOption.label : placeholder}
//           </span>
//         </div>
//         <FaChevronDown className={`transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
//       </button>

//       {isOpen && (
//         <>
//           <div 
//             className="fixed inset-0 z-40" 
//             onClick={() => setIsOpen(false)}
//           />
//           <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
//             {options.map(option => (
//               <button
//                 key={option.value}
//                 type="button"
//                 onClick={() => {
//                   onChange(option.value);
//                   setIsOpen(false);
//                 }}
//                 className={`w-full text-left px-4 py-3 hover:bg-amber-50 transition-all flex items-center gap-3 text-sm font-medium border-b border-gray-100 last:border-b-0 ${
//                   value === option.value ? 'bg-amber-50 text-amber-700' : 'text-gray-700'
//                 }`}
//               >
//                 {option.icon && <span className="text-amber-500">{option.icon}</span>}
//                 {option.label}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// });

// // Enhanced Toggle Component
// const Toggle = React.memo(({ enabled, onChange, label, description }) => (
//   <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group">
//     <div className="flex-shrink-0 mt-1">
//       <label className="relative inline-flex items-center cursor-pointer">
//         <input
//           type="checkbox"
//           checked={enabled}
//           onChange={onChange}
//           className="sr-only"
//         />
//         <div className={`w-11 h-6 rounded-full transition-all duration-300 ${
//           enabled ? 'bg-amber-500' : 'bg-gray-300'
//         }`}>
//           <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-transform duration-300 ${
//             enabled ? 'transform translate-x-5' : 'transform translate-x-0.5'
//           }`} />
//         </div>
//       </label>
//     </div>
//     <div className="flex-1">
//       <div className="text-sm font-semibold text-gray-800">{label}</div>
//       {description && (
//         <div className="text-xs text-gray-600 mt-1">{description}</div>
//       )}
//     </div>
//   </div>
// ));

// // Modern Stats Card Component
// const StatCard = React.memo(({ title, value, icon, description, trend }) => (
//   <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
//     <div className="flex items-center justify-between">
//       <div className="flex-1">
//         <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
//         <div className="flex items-baseline gap-2">
//           <p className="text-2xl font-bold text-gray-900">{value}</p>
//           {trend && (
//             <span className={`text-xs font-medium px-2 py-1 rounded-full ${
//               trend > 0 
//                 ? 'bg-green-100 text-green-800' 
//                 : 'bg-red-100 text-red-800'
//             }`}>
//               {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
//             </span>
//           )}
//         </div>
//         {description && (
//           <p className="text-xs text-gray-500 mt-2">{description}</p>
//         )}
//       </div>
//       <div className="text-2xl text-amber-500 p-3 bg-amber-50 rounded-lg group-hover:scale-110 transition-transform">
//         {icon}
//       </div>
//     </div>
//   </div>
// ));

// // Enhanced Form Field Component
// const FormField = React.memo(({ 
//   label, 
//   name, 
//   value, 
//   onChange, 
//   type = "text", 
//   required = false, 
//   placeholder, 
//   icon: Icon,
//   className = "",
//   helperText,
//   min,
//   max,
//   step
// }) => (
//   <div className={className}>
//     <label className="block text-sm font-semibold text-gray-700 mb-2">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <div className="relative">
//       {Icon && (
//         <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//           <Icon />
//         </div>
//       )}
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={required}
//         placeholder={placeholder}
//         min={min}
//         max={max}
//         step={step}
//         className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-700 placeholder-gray-500 font-normal ${
//           Icon ? 'pl-10' : ''
//         } ${helperText ? 'border-amber-300' : ''}`}
//       />
//     </div>
//     {helperText && (
//       <p className="text-xs text-amber-600 mt-1">{helperText}</p>
//     )}
//   </div>
// ));

// // Quick Action Button Component
// const QuickAction = React.memo(({ icon, label, onClick, variant = "primary", size = "md" }) => {
//   const sizes = {
//     sm: "px-3 py-2 text-sm",
//     md: "px-4 py-3",
//     lg: "px-6 py-4 text-lg"
//   };

//   const variants = {
//     primary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg",
//     secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
//     success: "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg",
//     danger: "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
//   };

//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${sizes[size]} ${variants[variant]}`}
//     >
//       {icon}
//       <span>{label}</span>
//     </button>
//   );
// });

// // Enhanced Coupon Card Component with the requested structure
// const CouponCard = React.memo(({ coupon, onEdit, onToggle, onDelete, onDuplicate, isCouponActive, formatDate }) => {
//   const [showDetails, setShowDetails] = useState(false);

//   const statusConfig = {
//     active: { 
//       color: 'bg-green-100 text-green-800 border-green-200', 
//       label: 'Active',
//       icon: <FaCheckCircle className="text-green-500" size={14}/>
//     },
//     inactive: { 
//       color: 'bg-gray-100 text-gray-800 border-gray-200', 
//       label: 'Inactive',
//       icon: <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
//     },
//     expired: { 
//       color: 'bg-red-100 text-red-800 border-red-200', 
//       label: 'Expired',
//       icon: <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//     }
//   };

//   const status = isCouponActive(coupon) ? 'active' : coupon.isExpired ? 'expired' : 'inactive';
//   const config = statusConfig[status];

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group">
//       {/* First Main Div - Header Section */}
//       <div className="flex flex-col items-start justify-between gap-4 mb-4">
//         {/* First Sub Div - Code and Status */}
//         <div className="flex items-center justify-between w-full gap-4 flex-col lg:flex-row">
//           <div className="flex items-center gap-3">
//             <div className="relative flex w-[300px] bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl overflow-hidden">
//               {/* Left side content */}
//               <div className="flex flex-col justify-center items-start p-5 w-[70%]">
//                 <h3 className="text-lg font-semibold tracking-wide uppercase">Special Coupon</h3>
//                 <p className="text-2xl font-extrabold tracking-widest mt-1">{coupon.code}</p>
//                 <p className="text-sm mt-2 opacity-80">
//                   Valid until {new Date(coupon.endDate).toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric',
//                   })}
//                 </p>
//               </div>

//               {/* Dotted separator */}
//               <div className="relative w-[2px] bg-dotted bg-white/60">
//                 <div className="absolute -left-[6px] -top-1 w-3 h-3 bg-white rounded-full"></div>
//                 <div className="absolute -left-[6px] -bottom-1 w-3 h-3 bg-white rounded-full"></div>
//               </div>

//               {/* Right side for action */}
//               <div className="flex flex-col justify-center items-center w-[30%] bg-gray-200 text-amber-600 font-semibold tracking-wide">
//                 <span className="rotate-90 text-sm">REDEEM</span>
//               </div>

//               {/* SVG edge notches */}
//               <svg
//                 className="absolute left-0 top-0 h-full w-4 text-white"
//                 viewBox="0 0 10 100"
//                 preserveAspectRatio="none"
//               >
//                 <path
//                   d="M10,0 V10 A5,5 0 0,1 10,20 V30 A5,5 0 0,1 10,40 V50 A5,5 0 0,1 10,60 V70 A5,5 0 0,1 10,80 V90 A5,5 0 0,1 10,100"
//                   fill="currentColor"
//                 />
//               </svg>

//               <svg
//                 className="absolute right-0 top-0 h-full w-4 text-white rotate-180"
//                 viewBox="0 0 10 100"
//                 preserveAspectRatio="none"
//               >
//                 <path
//                   d="M10,0 V10 A5,5 0 0,1 10,20 V30 A5,5 0 0,1 10,40 V50 A5,5 0 0,1 10,60 V70 A5,5 0 0,1 10,80 V90 A5,5 0 0,1 10,100"
//                   fill="currentColor"
//                 />
//               </svg>
//             </div>
//           </div>
//           {/* Action Buttons */}
//           <div className="flex items-center gap-2 w-full justify-between lg:justify-end">
//             <button
//               onClick={() => onEdit(coupon)}
//               className="p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all border border-blue-200 hover:border-blue-300 shadow-sm"
//               title="Edit coupon"
//             >
//               <FaEdit size={16} />
//             </button>
//             <button
//               onClick={() => onDuplicate(coupon)}
//               className="p-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all border border-purple-200 hover:border-purple-300 shadow-sm"
//               title="Duplicate coupon"
//             >
//               <FaCopy size={16} />
//             </button>
//             <button
//               onClick={() => onToggle(coupon._id, coupon.isActive)}
//               className={`p-3 rounded-xl transition-all border shadow-sm hover:scale-105 ${
//                 coupon.isActive 
//                   ? 'text-green-600 hover:text-red-600 hover:bg-red-50 border-green-200 hover:border-red-300' 
//                   : 'text-gray-600 hover:text-green-600 hover:bg-green-50 border-gray-200 hover:border-green-300'
//               }`}
//               title={coupon.isActive ? "Deactivate coupon" : "Activate coupon"}
//             >
//               <FaPowerOff size={16} />
//             </button>
//             <button
//               onClick={() => onDelete(coupon._id)}
//               className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all border border-red-200 hover:border-red-300 shadow-sm"
//               title="Delete coupon"
//             >
//               <FaTrash size={16} />
//             </button>
//             <button
//               onClick={() => setShowDetails(!showDetails)}
//               className="p-3 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all border border-gray-200 hover:border-gray-300 shadow-sm"
//               title={showDetails ? "Hide details" : "Show details"}
//             >
//               {showDetails ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
//             </button>
//           </div>
//         </div>

//         {/* Second Sub Div - Discount and Actions */}
//         <div className="flex items-center gap-6">
//           <div className="text-left">
//             <div className="flex items-center text-2xl font-bold text-amber-600 gap-2">
//               {coupon.discountType === "percent" 
//                 ? `${coupon.discountValue}% OFF` 
//                 : `₹${coupon.discountValue} OFF`}
//               <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium border ${config.color}`}>
//                 {config.icon}
//                 <span>{config.label}</span>
//               </div>
//             </div>
//             {coupon.description && (
//               <div className="text-sm text-gray-600 mt-1 max-w-xs line-clamp-1">{coupon.description}</div>
//             )}
//           </div>
          
//         </div>
//       </div>

//       {/* Second Main Div - Coupon Details */}
//       {showDetails && (
//         <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
//             <div className="flex items-center gap-3">
//               <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
//                 <FaCalendarAlt className="text-amber-500 text-xs" />
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">VALIDITY</div>
//                 <div className="text-gray-700 font-medium">
//                   {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
//                 <FaRupeeSign className="text-amber-500 text-xs" />
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">MIN. AMOUNT</div>
//                 <div className="text-gray-700 font-medium">₹{coupon.minAmount}</div>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
//                 <FaUsers className="text-amber-500 text-xs" />
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">TOTAL USES</div>
//                 <div className="text-gray-700 font-medium">
//                   {coupon.usedCount} / {coupon.usageLimit || '∞'}
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
//                 <FaUserCheck className="text-amber-500 text-xs" />
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">PER USER</div>
//                 <div className="text-gray-700 font-medium">{coupon.userUsageLimit}</div>
//               </div>
//             </div>
//           </div>

//           {/* Additional Details */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
//             <div className="text-center">
//               <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">PRIORITY</div>
//               <div className="text-lg font-bold text-amber-600">{coupon.priority || 1}</div>
//             </div>
//             <div className="text-center">
//               <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">STACKABLE</div>
//               <div className={`text-lg font-bold ${coupon.stackable ? 'text-green-600' : 'text-gray-400'}`}>
//                 {coupon.stackable ? 'Yes' : 'No'}
//               </div>
//             </div>
//             <div className="text-center">
//               <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">AUTO APPLY</div>
//               <div className={`text-lg font-bold ${coupon.autoApply ? 'text-green-600' : 'text-gray-400'}`}>
//                 {coupon.autoApply ? 'Yes' : 'No'}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// });

// const CouponPage = () => {
//   const [formData, setFormData] = useState(initialFormState);
//   const [coupons, setCoupons] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("list");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [tableLoading, setTableLoading] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     expired: 0,
//     usageRate: 0,
//     totalUsage: 0
//   });

//   // Modal States
//   const [deleteModal, setDeleteModal] = useState({ isOpen: false, couponId: null, couponCode: "" });
//   const [successModal, setSuccessModal] = useState({ isOpen: false, title: "", message: "" });
//   const [toggleModal, setToggleModal] = useState({ isOpen: false, couponId: null, currentStatus: false, couponCode: "" });

//   // Enhanced stats calculation
//   const calculateStats = useCallback((couponsData) => {
//     const total = couponsData.length;
//     const active = couponsData.filter(c => c.isCurrentlyActive).length;
//     const expired = couponsData.filter(c => c.isExpired).length;
//     const totalUsage = couponsData.reduce((sum, c) => sum + c.usedCount, 0);
//     const usageRate = total > 0 ? (totalUsage / total).toFixed(1) : 0;
    
//     return { total, active, expired, usageRate, totalUsage };
//   }, []);

//   // Fetch coupons with error handling and loading states
//   const fetchCoupons = useCallback(async () => {
//     try {
//       setTableLoading(true);
//       const { data } = await Axios.get("/api/coupon/list");
//       if (data.success) {
//         setCoupons(data.data);
//         setStats(calculateStats(data.data));
//       }
//     } catch (err) {
//       console.error("Failed to fetch coupons:", err);
//       toast.dismiss()
//       toast.error("Failed to load coupons. Please try again.");
//     } finally {
//       setTableLoading(false);
//     }
//   }, [calculateStats]);

//   useEffect(() => {
//     fetchCoupons();
//   }, [fetchCoupons]);

//   // Enhanced validation with specific error messages
//   const validateForm = useCallback(() => {
//     const errors = [];

//     if (!formData.code.trim()) {
//       errors.push("Coupon code is required");
//     } else if (formData.code.length < 3 || formData.code.length > 20) {
//       errors.push("Coupon code must be between 3-20 characters");
//     } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
//       errors.push("Coupon code can only contain uppercase letters, numbers, hyphens, and underscores");
//     }

//     if (!formData.discountValue || formData.discountValue <= 0) {
//       errors.push("Discount value must be greater than 0");
//     } else if (formData.discountType === "percent" && formData.discountValue > 100) {
//       errors.push("Percentage discount cannot exceed 100%");
//     }

//     if (!formData.startDate || !formData.endDate) {
//       errors.push("Start and end dates are required");
//     } else if (new Date(formData.startDate) >= new Date(formData.endDate)) {
//       errors.push("End date must be after start date");
//     }

//     if (formData.minProducts && formData.maxProducts && formData.minProducts > formData.maxProducts && formData.maxProducts > 0) {
//       errors.push("Maximum products cannot be less than minimum products");
//     }

//     if (errors.length > 0) {
//       errors.forEach(error => toast.error(error));
//       return false;
//     }

//     return true;
//   }, [formData]);

//   // Optimized input handler
//   const handleChange = useCallback((e) => {
//     const { name, type, value, checked } = e.target;
    
//     let processedValue = type === "checkbox" ? checked : value;
    
//     // Convert number fields only if value is not empty
//     const numberFields = ["discountValue", "minAmount", "maxDiscount", "usageLimit", "userUsageLimit", "minProducts", "maxProducts", "priority"];
//     if (numberFields.includes(name) && processedValue !== "") {
//       processedValue = Number(processedValue);
//     }

//     setFormData(prev => ({
//       ...prev,
//       [name]: processedValue,
//     }));

//     // Reset maxDiscount if discountType changes to fixed
//     if (name === "discountType" && value === "fixed") {
//       setFormData(prev => ({ ...prev, maxDiscount: "" }));
//     }
//   }, []);

//   // Enhanced form submission with better error handling
//   const handleSubmit = useCallback(async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       setLoading(true);

//       const payload = {
//         ...formData,
//         code: formData.code.toUpperCase().trim(),
//         discountValue: formData.discountValue || 0,
//         minAmount: formData.minAmount || 0,
//         maxDiscount: formData.maxDiscount || 0,
//         usageLimit: formData.usageLimit || 0,
//         userUsageLimit: formData.userUsageLimit || 1,
//         minProducts: formData.minProducts || 1,
//         maxProducts: formData.maxProducts || 0,
//         priority: formData.priority || 1,
//       };

//       const endpoint = editId ? `/api/coupon/update/${editId}` : "/api/coupon/create";
//       const method = editId ? 'put' : 'post';

//       const response = await Axios[method](endpoint, payload);

//       if (response.data.success) {
//         setSuccessModal({
//           isOpen: true,
//           title: editId ? "Coupon Updated!" : "Coupon Created!",
//           message: editId 
//             ? "Your coupon has been successfully updated."
//             : "Your new coupon has been created successfully."
//         });
//         resetForm();
//         fetchCoupons();
//       }
//     } catch (err) {
//       const errorMsg = err?.response?.data?.message || err.message;
//       if (errorMsg.includes("unique") || errorMsg.includes("already exists")) {
//         toast.error("❌ This coupon code already exists");
//       } else {
//         toast.error(`❌ ${errorMsg}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, editId, validateForm, fetchCoupons]);

//   // Reset form
//   const resetForm = useCallback(() => {
//     setFormData(initialFormState);
//     setEditId(null);
//   }, []);


//   // Enhanced edit handler
//   const handleEdit = useCallback((coupon) => {
//     setEditId(coupon._id);
//     setFormData({
//       code: coupon.code || "",
//       discountType: coupon.discountType || "percent",
//       discountValue: coupon.discountValue || "",
//       minAmount: coupon.minAmount || "",
//       maxDiscount: coupon.maxDiscount || "",
//       startDate: coupon.startDate?.slice(0, 10) || "",
//       endDate: coupon.endDate?.slice(0, 10) || "",
//       isActive: coupon.isActive ?? true,
//       usageLimit: coupon.usageLimit || "",
//       userUsageLimit: coupon.userUsageLimit || "",
//       minProducts: coupon.minProducts || "",
//       maxProducts: coupon.maxProducts || "",
//       stackable: coupon.stackable || false,
//       autoApply: coupon.autoApply || false,
//       firstOrderOnly: coupon.firstOrderOnly || false,
//       customerEligibility: coupon.customerEligibility || "all",
//       eligibleCustomers: coupon.eligibleCustomers || [],
//       description: coupon.description || "",
//       termsAndConditions: coupon.termsAndConditions || "",
//       priority: coupon.priority || "",
//       applicableCategories: coupon.applicableCategories || [],
//       excludedCategories: coupon.excludedCategories || [],
//       applicableProducts: coupon.applicableProducts || [],
//       excludedProducts: coupon.excludedProducts || [],
//       applicableBrands: coupon.applicableBrands || [],
//     });
//     setActiveTab("create");
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   // Duplicate coupon functionality
//   const handleDuplicate = useCallback((coupon) => {
//     const duplicatedCoupon = {
//       ...coupon,
//       code: `${coupon.code}_COPY`,
//       _id: null,
//       usedCount: 0
//     };
//     handleEdit(duplicatedCoupon);
//     toast.success("Coupon Copied!");
//   }, [handleEdit]);



//   // Enhanced delete with custom modal
//   const handleDelete = useCallback((id, code) => {
//     setDeleteModal({
//       isOpen: true,
//       couponId: id,
//       couponCode: code
//     });
//   }, []);

//   const confirmDelete = useCallback(async () => {
//     try {
//       const { data } = await Axios.delete(`/api/coupon/delete/${deleteModal.couponId}`);
//       if (data.success) {
//         toast.success("🗑️ Coupon deleted successfully");
//         fetchCoupons();
//         setDeleteModal({ isOpen: false, couponId: null, couponCode: "" });
//       }
//     } catch (err) {
//       toast.error("❌ Failed to delete coupon");
//     }
//   }, [deleteModal, fetchCoupons]);

//   // Toggle coupon status with confirmation modal
//   const handleToggle = useCallback((id, currentStatus, code) => {
//     setToggleModal({
//       isOpen: true,
//       couponId: id,
//       currentStatus,
//       couponCode: code
//     });
//   }, []);

//   const confirmToggle = useCallback(async () => {
//     try {
//       const { data } = await Axios.patch(`/api/coupon/toggle/${toggleModal.couponId}`);
//       if (data.success) {
//         toast.success(`Coupon ${!toggleModal.currentStatus ? "activated" : "deactivated"}`);
//         fetchCoupons();
//         setToggleModal({ isOpen: false, couponId: null, currentStatus: false, couponCode: "" });
//       }
//     } catch (err) {
//       toast.error("❌ Failed to update coupon status");
//     }
//   }, [toggleModal, fetchCoupons]);

//   // Utility functions
//   const formatDate = useCallback((dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   }, []);

//   const isCouponActive = useCallback((coupon) => {
//     const now = new Date();
//     const start = new Date(coupon.startDate);
//     const end = new Date(coupon.endDate);
//     return coupon.isActive && now >= start && now <= end && 
//            (coupon.usageLimit === 0 || coupon.usedCount < coupon.usageLimit);
//   }, []);

//   // Memoized filtered coupons
//   const filteredCoupons = useMemo(() => {
//     return coupons.filter(coupon => {
//       const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            coupon.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
//       const matchesStatus = statusFilter === "all" || 
//                            (statusFilter === "active" && isCouponActive(coupon)) ||
//                            (statusFilter === "inactive" && !isCouponActive(coupon) && !coupon.isExpired) ||
//                            (statusFilter === "expired" && coupon.isExpired);
      
//       return matchesSearch && matchesStatus;
//     });
//   }, [coupons, searchTerm, statusFilter, isCouponActive]);

//   // Memoized stats data
//   const statsData = useMemo(() => [
//     { 
//       title: "Total Coupons", 
//       value: stats.total, 
//       icon: <FaTags />, 
//       description: "All created coupons",
//       trend: 12 // Example trend data
//     },
//     { 
//       title: "Active Now", 
//       value: stats.active, 
//       icon: <FaRocket />, 
//       description: "Currently running",
//       trend: 5
//     },
//     { 
//       title: "Expired", 
//       value: stats.expired, 
//       icon: <FaClock />, 
//       description: "Past coupons",
//       trend: -2
//     },
//     { 
//       title: "Total Usage", 
//       value: stats.totalUsage, 
//       icon: <FaUsers />, 
//       description: "Total times used",
//       trend: 8
//     },
//   ], [stats]);

//   return (
//     <div className="min-h-screen bg-gray-50/30">
//       <div className="max-w-full mx-auto p-4">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-6 mb-4 shadow-sm">
//           <div>
//             <h2 className="font-bold text-2xl text-gray-900">Coupon Management</h2>
//             <p className="text-gray-600 mt-2 text-sm">Create and manage discount campaigns for your store</p>
//           </div>
//           <div className="flex gap-3 mt-4 sm:mt-0">
//             <QuickAction
//               icon={<FaPlus />}
//               label="New Coupon"
//               onClick={() => {
//                 resetForm();
//                 setActiveTab("create");
//               }}
//               variant="primary"
//             />
//           </div>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//           {statsData.map((stat, index) => (
//             <StatCard key={index} {...stat} />
//           ))}
//         </div>

//         {/* Tabs */}
//         <div className="flex overflow-x-auto gap-2 bg-white border border-gray-200 rounded-2xl p-2 mb-4 shadow-sm">
//           <button
//             onClick={() => setActiveTab("list")}
//             className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 min-w-[160px] ${
//               activeTab === "list"
//                 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
//                 : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
//             }`}
//           >
//             <FaTags className="text-sm" />
//             All Coupons
//           </button>
//           <button
//             onClick={() => setActiveTab("create")}
//             className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 min-w-[160px] ${
//               activeTab === "create"
//                 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
//                 : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
//             }`}
//           >
//             <FaPlus className="text-sm" />
//             {editId ? "Edit Coupon" : "New Coupon"}
//           </button>
//         </div>

//         {/* Create/Edit Form */}
//         {activeTab === "create" && (
//           <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-8">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Basic Information */}
//               <div className="space-y-6">
//                 <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
//                   <FaInfoCircle className="text-amber-500 text-xl" />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
//                     <p className="text-sm text-gray-600">Core details about your coupon</p>
//                   </div>
//                 </div>
                
//                 <FormField
//                   label="Coupon Code"
//                   name="code"
//                   value={formData.code}
//                   onChange={handleChange}
//                   required
//                   placeholder="SUMMER25"
//                   icon={FaTags}
//                   helperText="3-20 characters, uppercase letters, numbers, hyphens, and underscores only"
//                 />

//                 <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Discount Type *
//                     </label>
//                     <Dropdown
//                       value={formData.discountType}
//                       options={[
//                         { value: "percent", label: "Percentage %" },
//                         { value: "fixed", label: "Fixed Amount ₹" }
//                       ]}
//                       onChange={(value) => setFormData(prev => ({ ...prev, discountType: value }))}
//                       placeholder="Select type"
//                       icon={FaPercentage}
//                     />
//                   </div>

//                   <FormField
//                     label="Discount Value"
//                     name="discountValue"
//                     value={formData.discountValue}
//                     onChange={handleChange}
//                     type="number"
//                     required
//                     placeholder={formData.discountType === "percent" ? "10" : "100"}
//                     icon={formData.discountType === "percent" ? FaPercentage : FaRupeeSign}
//                     min="0"
//                     max={formData.discountType === "percent" ? "100" : undefined}
//                     step={formData.discountType === "percent" ? "0.1" : "1"}
//                   />
//                 </div>

//                 {formData.discountType === "percent" && (
//                   <FormField
//                     label="Maximum Discount (₹)"
//                     name="maxDiscount"
//                     value={formData.maxDiscount}
//                     onChange={handleChange}
//                     type="number"
//                     placeholder="0 for no limit"
//                     icon={FaCrown}
//                     min="0"
//                   />
//                 )}

//                 <FormField
//                   label="Minimum Order Amount (₹)"
//                   name="minAmount"
//                   value={formData.minAmount}
//                   onChange={handleChange}
//                   type="number"
//                   placeholder="0 for no minimum"
//                   icon={FaGem}
//                   min="0"
//                 />
//               </div>

//               {/* Validity & Limits */}
//               <div className="space-y-6">
//                 <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
//                   <FaCalendarAlt className="text-amber-500 text-xl" />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">Validity & Limits</h3>
//                     <p className="text-sm text-gray-600">When and how the coupon can be used</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField
//                     label="Start Date"
//                     name="startDate"
//                     value={formData.startDate}
//                     onChange={handleChange}
//                     type="date"
//                     required
//                   />
//                   <FormField
//                     label="End Date"
//                     name="endDate"
//                     value={formData.endDate}
//                     onChange={handleChange}
//                     type="date"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField
//                     label="Total Usage Limit"
//                     name="usageLimit"
//                     value={formData.usageLimit}
//                     onChange={handleChange}
//                     type="number"
//                     placeholder="0 for unlimited"
//                     icon={FaUsers}
//                     min="0"
//                   />
//                   <FormField
//                     label="Uses Per Customer"
//                     name="userUsageLimit"
//                     value={formData.userUsageLimit}
//                     onChange={handleChange}
//                     type="number"
//                     placeholder="1"
//                     icon={FaUserCheck}
//                     min="1"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField
//                     label="Minimum Products"
//                     name="minProducts"
//                     value={formData.minProducts}
//                     onChange={handleChange}
//                     type="number"
//                     placeholder="1"
//                     icon={FaBox}
//                     min="1"
//                   />
//                   <FormField
//                     label="Maximum Products"
//                     name="maxProducts"
//                     value={formData.maxProducts}
//                     onChange={handleChange}
//                     type="number"
//                     placeholder="0 for unlimited"
//                     icon={FaShoppingCart}
//                     min="0"
//                   />
//                 </div>

//                 <FormField
//                   label="Priority Level (1-10)"
//                   name="priority"
//                   value={formData.priority}
//                   onChange={handleChange}
//                   type="number"
//                   placeholder="1 (Highest) to 10 (Lowest)"
//                   icon={FaFire}
//                   min="1"
//                   max="10"
//                 />
//               </div>

//               {/* Advanced Settings */}
//               <div className="lg:col-span-2 space-y-6">
//                 <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
//                   <FaShoppingCart className="text-amber-500 text-xl" />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">Advanced Settings</h3>
//                     <p className="text-sm text-gray-600">Additional rules and restrictions</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Toggle
//                     enabled={formData.stackable}
//                     onChange={(e) => setFormData(prev => ({ ...prev, stackable: e.target.checked }))}
//                     label="Stackable Coupon"
//                     description="Can be combined with other coupons"
//                   />
//                   <Toggle
//                     enabled={formData.autoApply}
//                     onChange={(e) => setFormData(prev => ({ ...prev, autoApply: e.target.checked }))}
//                     label="Auto Apply"
//                     description="Automatically applied for eligible customers"
//                   />
//                   <Toggle
//                     enabled={formData.firstOrderOnly}
//                     onChange={(e) => setFormData(prev => ({ ...prev, firstOrderOnly: e.target.checked }))}
//                     label="First Order Only"
//                     description="Exclusive for new customers"
//                   />
//                   <Toggle
//                     enabled={formData.isActive}
//                     onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
//                     label="Active Status"
//                     description="Enable or disable this coupon"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Customer Eligibility
//                   </label>
//                   <Dropdown
//                     value={formData.customerEligibility}
//                     options={[
//                       { value: "all", label: "All Customers" },
//                       { value: "new_customers", label: "New Customers Only" },
//                       { value: "existing_customers", label: "Existing Customers Only" },
//                       { value: "specific_customers", label: "Specific Customers" }
//                     ]}
//                     onChange={(value) => setFormData(prev => ({ ...prev, customerEligibility: value }))}
//                     placeholder="Select eligibility"
//                     icon={FaUserCheck}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Coupon Description
//                   </label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     rows="3"
//                     className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-700 font-normal"
//                     placeholder="Describe the purpose and benefits of this coupon..."
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Terms & Conditions
//                   </label>
//                   <textarea
//                     name="termsAndConditions"
//                     value={formData.termsAndConditions}
//                     onChange={handleChange}
//                     rows="3"
//                     className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-700 font-normal"
//                     placeholder="Any specific terms, conditions, or restrictions..."
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Form Actions */}
//             <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-gray-200">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`flex-1 px-8 py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-3 ${
//                   loading
//                     ? 'bg-gray-400 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
//                 }`}
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     {editId ? "Updating Coupon..." : "Creating Coupon..."}
//                   </>
//                 ) : (
//                   <>
//                     <FaSave className="text-lg" />
//                     {editId ? "Update Coupon" : "Create Coupon"}
//                   </>
//                 )}
//               </button>
              
//               {editId && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     resetForm();
//                     setActiveTab("list");
//                   }}
//                   className="flex-1 px-8 py-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-3"
//                 >
//                   <FaTimes />
//                   Cancel Edit
//                 </button>
//               )}
//             </div>
//           </form>
//         )}

//         {/* Coupons List */}
//         {activeTab === "list" && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
//             {/* Search and Filter */}
//             <div className="flex flex-col sm:flex-row gap-4 mb-6">
//               <div className="relative flex-1">
//                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search coupons by code or description..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-700 font-normal"
//                 />
//               </div>
//               <div className="sm:w-48">
//                 <Dropdown
//                   value={statusFilter}
//                   options={[
//                     { value: "all", label: "All Status" },
//                     { value: "active", label: "Active" },
//                     { value: "inactive", label: "Inactive" },
//                     { value: "expired", label: "Expired" }
//                   ]}
//                   onChange={setStatusFilter}
//                   placeholder="Filter by status"
//                   icon={FaFilter}
//                 />
//               </div>
//             </div>

//             {/* Results Count */}
//             <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 font-medium bg-amber-50 p-3 rounded-lg border border-amber-200">
//               <VscGraph />
//               Showing <span className="font-bold text-amber-700">{filteredCoupons.length}</span> of <span className="font-bold text-amber-700">{coupons.length}</span> coupons
//             </div>

//             {tableLoading ? (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//                 <p className="text-gray-600 font-medium">Loading coupons...</p>
//               </div>
//             ) : filteredCoupons.length === 0 ? (
//               <div className="text-center py-12">
//                 <div className="text-6xl mb-4">🎁</div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No coupons found</h3>
//                 <p className="text-gray-600 mb-6">
//                   {searchTerm || statusFilter !== "all" 
//                     ? "Try adjusting your search or filter criteria" 
//                     : "Get started by creating your first coupon"}
//                 </p>
//                 {!searchTerm && statusFilter === "all" && (
//                   <QuickAction
//                     icon={<FaPlus />}
//                     label="Create First Coupon"
//                     onClick={() => setActiveTab("create")}
//                     variant="primary"
//                   />
//                 )}
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredCoupons.map((coupon) => (
//                   <CouponCard
//                     key={coupon._id}
//                     coupon={{
//                       ...coupon,
//                       discountText: coupon.discountType === "percent" 
//                         ? `${coupon.discountValue}% OFF` 
//                         : `₹${coupon.discountValue} OFF`,
//                       isCurrentlyActive: isCouponActive(coupon)
//                     }}
//                     onEdit={handleEdit}
//                     onToggle={(id, status) => handleToggle(id, status, coupon.code)}
//                     onDelete={(id) => handleDelete(id, coupon.code)}
//                     onDuplicate={handleDuplicate}
//                     isCouponActive={isCouponActive}
//                     formatDate={formatDate}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Custom Modals */}
//       <ConfirmationModal
//         isOpen={deleteModal.isOpen}
//         onClose={() => setDeleteModal({ isOpen: false, couponId: null, couponCode: "" })}
//         onConfirm={confirmDelete}
//         title="Delete Coupon"
//         message={`Are you sure you want to delete coupon "${deleteModal.couponCode}"? This action cannot be undone.`}
//         confirmText="Delete Coupon"
//         type="danger"
//       />

//       <ConfirmationModal
//         isOpen={toggleModal.isOpen}
//         onClose={() => setToggleModal({ isOpen: false, couponId: null, currentStatus: false, couponCode: "" })}
//         onConfirm={confirmToggle}
//         title={toggleModal.currentStatus ? "Deactivate Coupon" : "Activate Coupon"}
//         message={`Are you sure you want to ${toggleModal.currentStatus ? 'deactivate' : 'activate'} coupon "${toggleModal.couponCode}"?`}
//         confirmText={toggleModal.currentStatus ? "Deactivate" : "Activate"}
//         type="warning"
//       />

//       <SuccessModal
//         isOpen={successModal.isOpen}
//         onClose={() => {
//           setSuccessModal({ isOpen: false, title: "", message: "" });
//           setActiveTab("list");
//         }}
//         title={successModal.title}
//         message={successModal.message}
//       />
//     </div>
//   );
// };

// export default React.memo(CouponPage);

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Axios from "../utils/network/axios";
import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaCalendarAlt,
  FaUsers,
  FaTags,
  FaPercentage,
  FaRupeeSign,
  FaShoppingCart,
  FaChevronDown,
  FaSave,
  FaPlus,
  FaSearch,
  FaFilter,
  FaClock,
  FaUserCheck,
  FaBox,
  FaFire,
  FaRocket,
  FaGem,
  FaCrown,
  FaCopy,
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaPowerOff,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";

const initialFormState = {
  code: "",
  discountType: "percent",
  discountValue: "",
  minAmount: "",
  maxDiscount: "",
  startDate: "",
  endDate: "",
  isActive: true,
  usageLimit: "",
  userUsageLimit: "",
  minProducts: "",
  maxProducts: "",
  stackable: false,
  autoApply: false,
  firstOrderOnly: false,
  customerEligibility: "all",
  eligibleCustomers: [],
  description: "",
  termsAndConditions: "",
  priority: "",
  applicableCategories: [],
  excludedCategories: [],
  applicableProducts: [],
  excludedProducts: [],
  applicableBrands: [],
};

/* ===========================
   Generic UI Components
=========================== */

// Confirmation Modal
const ConfirmationModal = React.memo(
  ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning",
  }) => {
    if (!isOpen) return null;

    const typeConfig = {
      warning: {
        icon: FaExclamationTriangle,
        color: "text-amber-500",
        bgColor: "bg-amber-50",
      },
      danger: {
        icon: FaExclamationTriangle,
        color: "text-red-500",
        bgColor: "bg-red-50",
      },
      success: {
        icon: FaCheckCircle,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
      },
      info: {
        icon: FaInfoCircle,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
      },
    };

    const config = typeConfig[type] || typeConfig.warning;
    const Icon = config.icon;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
          <div className={`px-5 py-3 flex items-center gap-3 ${config.bgColor}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${config.color} bg-white`}>
              <Icon className="text-base" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              {title}
            </h3>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {message}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-xs sm:text-sm rounded-lg text-white font-medium ${
                  type === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : type === "success"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-amber-600 hover:bg-amber-700"
                } transition-colors`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// Success Modal
const SuccessModal = React.memo(({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full border border-slate-200 p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-emerald-600 text-2xl" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-6">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors"
        >
          <FaCheckCircle className="text-xs" />
          Continue
        </button>
      </div>
    </div>
  );
});

// Dropdown
const Dropdown = React.memo(
  ({ value, options, onChange, placeholder, className = "", icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-400 text-left text-sm shadow-sm"
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="text-amber-500 text-sm" />}
            <span className="text-slate-800 font-medium">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <FaChevronDown
            className={`text-slate-400 text-xs transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3.5 py-2.5 text-sm border-b border-slate-100 last:border-b-0 ${
                    value === option.value
                      ? "bg-amber-50 text-amber-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {option.icon && (
                    <span className="text-amber-500">{option.icon}</span>
                  )}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
);

// Toggle
const Toggle = React.memo(
  ({ enabled, onChange, label, description }) => (
    <div className="flex items-start gap-3 p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
      <label className="relative inline-flex items-center cursor-pointer mt-1">
        <input
          type="checkbox"
          checked={enabled}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-slate-300 peer-checked:bg-amber-500 rounded-full transition-colors relative">
          <div className="absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
        </div>
      </label>
      <div className="flex-1">
        <p className="text-xs sm:text-sm font-semibold text-slate-800">
          {label}
        </p>
        {description && (
          <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  )
);

// Stat Card
const StatCard = React.memo(({ title, value, icon, description, trend }) => (
  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-xl font-semibold text-slate-900">{value}</p>
          {typeof trend === "number" && (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                trend > 0
                  ? "bg-emerald-50 text-emerald-700"
                  : trend < 0
                  ? "bg-rose-50 text-rose-600"
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              {trend > 0 ? "↗" : trend < 0 ? "↘" : "•"} {Math.abs(trend)}%
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-[11px] text-slate-500">{description}</p>
        )}
      </div>
      <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
        {icon}
      </div>
    </div>
  </div>
));

// Form Field
const FormField = React.memo(
  ({
    label,
    name,
    value,
    onChange,
    type = "text",
    required = false,
    placeholder,
    icon: Icon,
    className = "",
    helperText,
    min,
    max,
    step,
  }) => (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}{" "}
        {required && <span className="text-rose-500 align-middle">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
            <Icon />
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
            Icon ? "pl-9" : ""
          }`}
        />
      </div>
      {helperText && (
        <p className="mt-1 text-[11px] text-amber-700">{helperText}</p>
      )}
    </div>
  )
);

// Quick Action Button
const QuickAction = React.memo(
  ({ icon, label, onClick, variant = "primary" }) => {
    const base =
      "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer";
    const variants = {
      primary:
        "bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow-md",
      secondary:
        "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md",
      ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    };

    return (
      <button onClick={onClick} className={`${base} ${variants[variant]}`}>
        {icon}
        <span>{label}</span>
      </button>
    );
  }
);

// Coupon Card
const CouponCard = React.memo(
  ({
    coupon,
    onEdit,
    onToggle,
    onDelete,
    onDuplicate,
    isCouponActive,
    formatDate,
  }) => {
    const [showDetails, setShowDetails] = useState(false);

    const statusConfig = {
      active: {
        label: "Active",
        badge:
          "bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px]",
        icon: <FaCheckCircle className="text-emerald-600 text-[11px]" />,
      },
      expired: {
        label: "Expired",
        badge:
          "bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px]",
        icon: <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />,
      },
      inactive: {
        label: "Inactive",
        badge:
          "bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px]",
        icon: <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />,
      },
    };

    const statusKey = isCouponActive(coupon)
      ? "active"
      : coupon.isExpired
      ? "expired"
      : "inactive";

    const status = statusConfig[statusKey];

    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row gap-3 lg:items-start lg:justify-between mb-3">
          {/* Ticket-style coupon visual */}
          <div className="flex items-center gap-3">
            <div className="relative flex bg-amber-600 text-white rounded-2xl overflow-hidden min-w-[260px] max-w-full">
              {/* Left section */}
              <div className="flex flex-col justify-center px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide opacity-80">
                  Coupon code
                </p>
                <p className="text-lg font-semibold tracking-[0.18em]">
                  {coupon.code}
                </p>
                {coupon.endDate && (
                  <p className="mt-1.5 text-[11px] opacity-80 flex items-center gap-1.5">
                    <FaCalendarAlt className="text-[10px]" />
                    Valid till {formatDate(coupon.endDate)}
                  </p>
                )}
              </div>
              {/* Divider */}
              <div className="w-[1px] bg-white/40 my-2" />
              {/* Right pill */}
              <div className="flex flex-col justify-center items-center px-3 py-2 bg-slate-50 text-amber-700">
                <span className="text-[10px] tracking-wide uppercase">
                  Use
                </span>
                <span className="text-xs font-semibold">Now</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className={status.badge}>
              {status.icon}
              <span>{status.label}</span>
            </span>

            <button
              onClick={() => onEdit(coupon)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              title="Edit"
            >
              <FaEdit className="text-xs" />
            </button>
            <button
              onClick={() => onDuplicate(coupon)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              title="Duplicate"
            >
              <FaCopy className="text-xs" />
            </button>
            <button
              onClick={() => onToggle(coupon._id, coupon.isActive)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              title={coupon.isActive ? "Deactivate" : "Activate"}
            >
              <FaPowerOff className="text-xs" />
            </button>
            <button
              onClick={() => onDelete(coupon._id)}
              className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors"
              title="Delete"
            >
              <FaTrash className="text-xs" />
            </button>
            <button
              onClick={() => setShowDetails((prev) => !prev)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              title={showDetails ? "Hide details" : "Show details"}
            >
              {showDetails ? (
                <FaEyeSlash className="text-xs" />
              ) : (
                <FaEye className="text-xs" />
              )}
            </button>
          </div>
        </div>

        {/* Main discount info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <p className="text-xl font-semibold text-amber-700">
              {coupon.discountType === "percent"
                ? `${coupon.discountValue}% OFF`
                : `₹${coupon.discountValue} OFF`}
            </p>
            {coupon.minAmount > 0 && (
              <p className="text-[11px] text-slate-500">
                On orders above{" "}
                <span className="font-semibold text-slate-700">
                  ₹{coupon.minAmount}
                </span>
              </p>
            )}
          </div>
          {coupon.description && (
            <p className="text-xs text-slate-600 max-w-md">
              {coupon.description}
            </p>
          )}
        </div>

        {/* Expanded details */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px] sm:text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  <FaCalendarAlt className="text-amber-500 text-xs" />
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Validity</p>
                  <p className="font-medium">
                    {formatDate(coupon.startDate)} –{" "}
                    {formatDate(coupon.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  <FaUsers className="text-amber-500 text-xs" />
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Total Uses</p>
                  <p className="font-medium">
                    {coupon.usedCount || 0} /{" "}
                    {coupon.usageLimit && coupon.usageLimit !== 0
                      ? coupon.usageLimit
                      : "∞"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  <FaUserCheck className="text-amber-500 text-xs" />
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Per Customer</p>
                  <p className="font-medium">
                    {coupon.userUsageLimit || 1} use(s)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  <FaFire className="text-amber-500 text-xs" />
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Priority</p>
                  <p className="font-medium">{coupon.priority || 1}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3 text-[11px] sm:text-xs text-center">
              <div>
                <p className="text-slate-500">Stackable</p>
                <p
                  className={`font-semibold ${
                    coupon.stackable ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {coupon.stackable ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Auto Apply</p>
                <p
                  className={`font-semibold ${
                    coupon.autoApply ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {coupon.autoApply ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">First Order</p>
                <p
                  className={`font-semibold ${
                    coupon.firstOrderOnly
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  {coupon.firstOrderOnly ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

/* ===========================
   Multi-step Wizard Modal
=========================== */

const CouponWizardModal = ({
  isOpen,
  onClose,
  step,
  setStep,
  formData,
  handleChange,
  setFormData,
  onPrimaryAction,
  loading,
  isEditing,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      key: 1,
      label: "Basics",
      icon: FaTags,
    },
    {
      key: 2,
      label: "Validity & Limits",
      icon: FaCalendarAlt,
    },
    {
      key: 3,
      label: "Advanced Rules",
      icon: FaRocket,
    },
  ];

  const StepIcon = ({ s }) => {
    const Icon = s.icon;
    const isCompleted = step > s.key;
    const isCurrent = step === s.key;
    return (
      <div className="flex flex-col items-center gap-1 min-w-[72px]">
        <div
          className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs ${
            isCompleted
              ? "bg-emerald-500 border-emerald-500 text-white"
              : isCurrent
              ? "bg-amber-100 border-amber-500 text-amber-700"
              : "bg-slate-50 border-slate-300 text-slate-400"
          }`}
        >
          {isCompleted ? <FaCheckCircle /> : <Icon />}
        </div>
        <p
          className={`text-[11px] font-medium ${
            isCurrent ? "text-amber-700" : "text-slate-500"
          }`}
        >
          {s.label}
        </p>
      </div>
    );
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
            <FaInfoCircle className="text-amber-600 mt-[2px]" />
            <p className="text-[11px] sm:text-xs text-amber-900">
              Start by defining the coupon code and discount details. Keep codes
              short, memorable and unique.
            </p>
          </div>

          <FormField
            label="Coupon Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            placeholder="SUMMER25"
            icon={FaTags}
            helperText="3–20 chars, only A–Z, 0–9, -, _"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Discount Type <span className="text-rose-500">*</span>
              </label>
              <Dropdown
                value={formData.discountType}
                options={[
                  { value: "percent", label: "Percentage (%)" },
                  { value: "fixed", label: "Fixed Amount (₹)" },
                ]}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, discountType: value }))
                }
                placeholder="Select type"
                icon={FaPercentage}
              />
            </div>
            <FormField
              label="Discount Value"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              type="number"
              required
              placeholder={formData.discountType === "percent" ? "10" : "100"}
              icon={
                formData.discountType === "percent" ? FaPercentage : FaRupeeSign
              }
              min="0"
              max={formData.discountType === "percent" ? "100" : undefined}
              step={formData.discountType === "percent" ? "0.1" : "1"}
            />
          </div>

          {formData.discountType === "percent" && (
            <FormField
              label="Maximum Discount (₹)"
              name="maxDiscount"
              value={formData.maxDiscount}
              onChange={handleChange}
              type="number"
              placeholder="0 for no cap"
              icon={FaCrown}
              min="0"
            />
          )}

          <FormField
            label="Minimum Order Amount (₹)"
            name="minAmount"
            value={formData.minAmount}
            onChange={handleChange}
            type="number"
            placeholder="0 for no minimum"
            icon={FaGem}
            min="0"
          />
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <FaCalendarAlt className="text-amber-600 mt-[2px]" />
            <p className="text-[11px] sm:text-xs text-slate-700">
              Set the active period and usage limits. Keep end dates realistic
              and avoid overlapping too many campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              type="date"
              required
            />
            <FormField
              label="End Date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              type="date"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Total Usage Limit"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              type="number"
              placeholder="0 for unlimited"
              icon={FaUsers}
              min="0"
            />
            <FormField
              label="Uses Per Customer"
              name="userUsageLimit"
              value={formData.userUsageLimit}
              onChange={handleChange}
              type="number"
              placeholder="1"
              icon={FaUserCheck}
              min="1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Minimum Products"
              name="minProducts"
              value={formData.minProducts}
              onChange={handleChange}
              type="number"
              placeholder="1"
              icon={FaBox}
              min="1"
            />
            <FormField
              label="Maximum Products"
              name="maxProducts"
              value={formData.maxProducts}
              onChange={handleChange}
              type="number"
              placeholder="0 for unlimited"
              icon={FaShoppingCart}
              min="0"
            />
          </div>

          <FormField
            label="Priority Level (1-10)"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            type="number"
            placeholder="1 (highest) – 10 (lowest)"
            icon={FaFire}
            min="1"
            max="10"
          />
        </div>
      );
    }

    // Step 3
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <FaInfoCircle className="text-amber-600 mt-[2px]" />
          <p className="text-[11px] sm:text-xs text-slate-700">
            Configure stackability, eligibility and messaging. These rules
            control who sees the coupon and how it behaves.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Toggle
            enabled={formData.stackable}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                stackable: e.target.checked,
              }))
            }
            label="Stackable coupon"
            description="Allow combining with other coupons at checkout."
          />
          <Toggle
            enabled={formData.autoApply}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                autoApply: e.target.checked,
              }))
            }
            label="Auto apply"
            description="Automatically apply when cart is eligible."
          />
          <Toggle
            enabled={formData.firstOrderOnly}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                firstOrderOnly: e.target.checked,
              }))
            }
            label="First order only"
            description="Limit to new customers only."
          />
          <Toggle
            enabled={formData.isActive}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isActive: e.target.checked,
              }))
            }
            label="Active status"
            description="Temporarily pause or enable this coupon."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Customer Eligibility
          </label>
          <Dropdown
            value={formData.customerEligibility}
            options={[
              { value: "all", label: "All customers" },
              { value: "new_customers", label: "New customers only" },
              { value: "existing_customers", label: "Existing customers" },
              { value: "specific_customers", label: "Specific customers" },
            ]}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                customerEligibility: value,
              }))
            }
            placeholder="Select eligibility"
            icon={FaUserCheck}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Coupon Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Short description shown to customers..."
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Terms & Conditions
          </label>
          <textarea
            name="termsAndConditions"
            rows="3"
            value={formData.termsAndConditions}
            onChange={handleChange}
            placeholder="Any specific conditions or restrictions..."
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-3 sm:px-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium text-amber-700 uppercase tracking-wide flex items-center gap-1">
              <FaTags className="text-xs" />
              Coupon wizard
            </p>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 mt-0.5">
              {isEditing ? "Edit coupon" : "Create new coupon"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100"
          >
            <FaTimes className="text-slate-500 text-sm" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-5 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between gap-2">
            {steps.map((s, index) => (
              <React.Fragment key={s.key}>
                <StepIcon s={s} />
                {index !== steps.length - 1 && (
                  <div className="flex-1 h-px bg-slate-200" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex-1 overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 text-[11px] sm:text-xs font-medium text-slate-700 hover:bg-white"
          >
            <FaTimes className="text-xs" />
            Close
          </button>
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 text-[11px] sm:text-xs font-medium text-slate-700 hover:bg-white"
              >
                <FaArrowLeft className="text-xs" />
                Back
              </button>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={onPrimaryAction}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] sm:text-xs font-semibold text-white ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {step === 3
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : "Checking..."}
                </>
              ) : step === 3 ? (
                <>
                  <FaSave className="text-xs" />
                  {isEditing ? "Update coupon" : "Create coupon"}
                </>
              ) : (
                <>
                  <span>Next</span>
                  <FaArrowRight className="text-xs" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===========================
   Main Coupon Page
=========================== */

const CouponPage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [coupons, setCoupons] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tableLoading, setTableLoading] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    usageRate: 0,
    totalUsage: 0,
  });

  // Wizard modal
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Modals
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    couponId: null,
    couponCode: "",
  });
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [toggleModal, setToggleModal] = useState({
    isOpen: false,
    couponId: null,
    currentStatus: false,
    couponCode: "",
  });

  // Stats calculation
  const calculateStats = useCallback((couponsData) => {
    const total = couponsData.length;
    const active = couponsData.filter((c) => c.isCurrentlyActive).length;
    const expired = couponsData.filter((c) => c.isExpired).length;
    const totalUsage = couponsData.reduce(
      (sum, c) => sum + (c.usedCount || 0),
      0
    );
    const usageRate = total > 0 ? (totalUsage / total).toFixed(1) : 0;
    return { total, active, expired, usageRate, totalUsage };
  }, []);

  // Fetch coupons
  const fetchCoupons = useCallback(async () => {
    try {
      setTableLoading(true);
      const { data } = await Axios.get("/api/coupon/list");
      if (data.success) {
        setCoupons(data.data);
        setStats(calculateStats(data.data));
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      toast.error("Failed to load coupons");
    } finally {
      setTableLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Validation
  const validateForm = useCallback(() => {
    const errors = [];

    if (!formData.code.trim()) {
      errors.push("Coupon code is required");
    } else if (formData.code.length < 3 || formData.code.length > 20) {
      errors.push("Coupon code must be between 3–20 characters");
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
      errors.push(
        "Coupon code can only contain uppercase letters, numbers, hyphens, and underscores"
      );
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      errors.push("Discount value must be greater than 0");
    } else if (
      formData.discountType === "percent" &&
      formData.discountValue > 100
    ) {
      errors.push("Percentage discount cannot exceed 100%");
    }

    if (!formData.startDate || !formData.endDate) {
      errors.push("Start and end dates are required");
    } else if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.push("End date must be after start date");
    }

    if (
      formData.minProducts &&
      formData.maxProducts &&
      formData.minProducts > formData.maxProducts &&
      formData.maxProducts > 0
    ) {
      errors.push("Maximum products cannot be less than minimum products");
    }

    if (errors.length) {
      errors.forEach((msg) => toast.error(msg));
      return false;
    }
    return true;
  }, [formData]);

  const validateStep1 = useCallback(() => {
    const errors = [];
    if (!formData.code.trim()) {
      errors.push("Coupon code is required");
    }
    if (!formData.discountValue || formData.discountValue <= 0) {
      errors.push("Discount value must be greater than 0");
    }
    if (errors.length) {
      errors.forEach((msg) => toast.error(msg));
      return false;
    }
    return true;
  }, [formData]);

  const validateStep2 = useCallback(() => {
    const errors = [];
    if (!formData.startDate || !formData.endDate) {
      errors.push("Start and end dates are required");
    } else if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.push("End date must be after start date");
    }
    if (errors.length) {
      errors.forEach((msg) => toast.error(msg));
      return false;
    }
    return true;
  }, [formData]);

  // Input handler
  const handleChange = useCallback((e) => {
    const { name, type, value, checked } = e.target;
    let processedValue = type === "checkbox" ? checked : value;

    const numberFields = [
      "discountValue",
      "minAmount",
      "maxDiscount",
      "usageLimit",
      "userUsageLimit",
      "minProducts",
      "maxProducts",
      "priority",
    ];

    if (numberFields.includes(name) && processedValue !== "") {
      processedValue = Number(processedValue);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    if (name === "discountType" && value === "fixed") {
      setFormData((prev) => ({ ...prev, maxDiscount: "" }));
    }
  }, []);

  // Submit (used by wizard final step)
  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!validateForm()) return;

      try {
        setLoading(true);

        const payload = {
          ...formData,
          code: formData.code.toUpperCase().trim(),
          discountValue: formData.discountValue || 0,
          minAmount: formData.minAmount || 0,
          maxDiscount: formData.maxDiscount || 0,
          usageLimit: formData.usageLimit || 0,
          userUsageLimit: formData.userUsageLimit || 1,
          minProducts: formData.minProducts || 1,
          maxProducts: formData.maxProducts || 0,
          priority: formData.priority || 1,
        };

        const endpoint = editId
          ? `/api/coupon/update/${editId}`
          : "/api/coupon/create";
        const method = editId ? "put" : "post";

        const response = await Axios[method](endpoint, payload);

        if (response.data.success) {
          setSuccessModal({
            isOpen: true,
            title: editId ? "Coupon updated" : "Coupon created",
            message: editId
              ? "Your coupon has been successfully updated."
              : "Your new coupon has been created successfully.",
          });
          resetForm();
          setWizardOpen(false);
          setWizardStep(1);
          fetchCoupons();
        }
      } catch (err) {
        const errorMsg = err?.response?.data?.message || err.message;
        if (
          errorMsg.toLowerCase().includes("unique") ||
          errorMsg.toLowerCase().includes("exists")
        ) {
          toast.error("This coupon code already exists");
        } else {
          toast.error(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    },
    [formData, editId, fetchCoupons, validateForm]
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setEditId(null);
  }, []);

  const openNewCouponWizard = useCallback(() => {
    resetForm();
    setEditId(null);
    setWizardStep(1);
    setWizardOpen(true);
  }, [resetForm]);

  // Edit
  const handleEdit = useCallback((coupon) => {
    setEditId(coupon._id || null);
    setFormData({
      code: coupon.code || "",
      discountType: coupon.discountType || "percent",
      discountValue: coupon.discountValue || "",
      minAmount: coupon.minAmount || "",
      maxDiscount: coupon.maxDiscount || "",
      startDate: coupon.startDate?.slice(0, 10) || "",
      endDate: coupon.endDate?.slice(0, 10) || "",
      isActive: coupon.isActive ?? true,
      usageLimit: coupon.usageLimit || "",
      userUsageLimit: coupon.userUsageLimit || "",
      minProducts: coupon.minProducts || "",
      maxProducts: coupon.maxProducts || "",
      stackable: coupon.stackable || false,
      autoApply: coupon.autoApply || false,
      firstOrderOnly: coupon.firstOrderOnly || false,
      customerEligibility: coupon.customerEligibility || "all",
      eligibleCustomers: coupon.eligibleCustomers || [],
      description: coupon.description || "",
      termsAndConditions: coupon.termsAndConditions || "",
      priority: coupon.priority || "",
      applicableCategories: coupon.applicableCategories || [],
      excludedCategories: coupon.excludedCategories || [],
      applicableProducts: coupon.applicableProducts || [],
      excludedProducts: coupon.excludedProducts || [],
      applicableBrands: coupon.applicableBrands || [],
    });
    setWizardStep(1);
    setWizardOpen(true);
  }, []);

  // Duplicate
  const handleDuplicate = useCallback(
    (coupon) => {
      const duplicatedCoupon = {
        ...coupon,
        code: `${coupon.code}_COPY`,
        _id: null,
        usedCount: 0,
      };
      handleEdit(duplicatedCoupon);
      toast.success("Coupon duplicated. Edit and save to create.");
    },
    [handleEdit]
  );

  // Delete
  const handleDelete = useCallback((id, code) => {
    setDeleteModal({
      isOpen: true,
      couponId: id,
      couponCode: code,
    });
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      const { data } = await Axios.delete(
        `/api/coupon/delete/${deleteModal.couponId}`
      );
      if (data.success) {
        toast.success("Coupon deleted");
        fetchCoupons();
        setDeleteModal({ isOpen: false, couponId: null, couponCode: "" });
      }
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  }, [deleteModal, fetchCoupons]);

  // Toggle
  const handleToggle = useCallback((id, currentStatus, code) => {
    setToggleModal({
      isOpen: true,
      couponId: id,
      currentStatus,
      couponCode: code,
    });
  }, []);

  const confirmToggle = useCallback(async () => {
    try {
      const { data } = await Axios.patch(
        `/api/coupon/toggle/${toggleModal.couponId}`
      );
      if (data.success) {
        toast.success(
          `Coupon ${
            !toggleModal.currentStatus ? "activated" : "deactivated"
          }`
        );
        fetchCoupons();
        setToggleModal({
          isOpen: false,
          couponId: null,
          currentStatus: false,
          couponCode: "",
        });
      }
    } catch (err) {
      toast.error("Failed to update coupon status");
    }
  }, [toggleModal, fetchCoupons]);

  // Utils
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const isCouponActive = useCallback((coupon) => {
    const now = new Date();
    const start = new Date(coupon.startDate);
    const end = new Date(coupon.endDate);
    return (
      coupon.isActive &&
      now >= start &&
      now <= end &&
      (coupon.usageLimit === 0 ||
        !coupon.usageLimit ||
        (coupon.usedCount || 0) < coupon.usageLimit)
    );
  }, []);

  // Filtered coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch =
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const status =
        isCouponActive(coupon) && !coupon.isExpired
          ? "active"
          : coupon.isExpired
          ? "expired"
          : "inactive";

      const matchesStatus =
        statusFilter === "all" ||
        statusFilter === status;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchTerm, statusFilter, isCouponActive]);

  const statsData = useMemo(
    () => [
      {
        title: "Total coupons",
        value: stats.total,
        icon: <FaTags className="text-sm" />,
        description: "All created coupons",
        trend: 12,
      },
      {
        title: "Active now",
        value: stats.active,
        icon: <FaRocket className="text-sm" />,
        description: "Currently running campaigns",
        trend: 5,
      },
      {
        title: "Expired",
        value: stats.expired,
        icon: <FaClock className="text-sm" />,
        description: "Past campaigns",
        trend: -2,
      },
      {
        title: "Total usage",
        value: stats.totalUsage,
        icon: <FaUsers className="text-sm" />,
        description: "Total times applied",
        trend: 8,
      },
    ],
    [stats]
  );

  // Wizard primary button handler (Next / Submit)
  const handleWizardPrimaryAction = useCallback(() => {
    if (wizardStep === 1) {
      if (!validateStep1()) return;
      setWizardStep(2);
      return;
    }
    if (wizardStep === 2) {
      if (!validateStep2()) return;
      setWizardStep(3);
      return;
    }
    // Last step → submit
    handleSubmit();
  }, [wizardStep, validateStep1, validateStep2, handleSubmit]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-5 space-y-5">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                <FaTags className="text-amber-700 text-xs" />
              </span>
              <span className="text-[11px] font-medium text-amber-800">
                Marketing · Coupons
              </span>
            </div>
            <h1 className="mt-2 text-lg sm:text-xl font-semibold text-slate-900">
              Coupon management
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Create and manage discount campaigns for your store without
              losing control on margins.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <QuickAction
              icon={<FaPlus className="text-xs" />}
              label="New coupon"
              onClick={openNewCouponWizard}
              variant="primary"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statsData.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        {/* Filters + search */}
        <div className="bg-white border border-slate-200 rounded-2xl px-4 sm:px-5 py-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by code or description..."
                  className="w-full pl-8 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div className="w-full sm:w-52">
                <Dropdown
                  value={statusFilter}
                  options={[
                    { value: "all", label: "All statuses" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "expired", label: "Expired" },
                  ]}
                  onChange={setStatusFilter}
                  placeholder="Filter by status"
                  icon={FaFilter}
                />
              </div>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 font-medium">
              <VscGraph className="text-amber-600 text-sm" />
              Showing{" "}
              <span className="text-amber-700">{filteredCoupons.length}</span>{" "}
              of <span className="text-amber-700">{coupons.length}</span>{" "}
              coupons
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white border border-slate-200 rounded-2xl px-4 sm:px-5 py-4 shadow-sm">
          {tableLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <span className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-slate-600 font-medium">
                Loading coupons…
              </p>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="py-10 text-center">
              <div className="text-5xl mb-3">🎁</div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1">
                No coupons found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or status filters."
                  : "Create your first coupon to start running promotions."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <QuickAction
                  icon={<FaPlus className="text-xs" />}
                  label="Create first coupon"
                  onClick={openNewCouponWizard}
                  variant="primary"
                />
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCoupons.map((coupon) => (
                <CouponCard
                  key={coupon._id}
                  coupon={{
                    ...coupon,
                    isCurrentlyActive: isCouponActive(coupon),
                  }}
                  onEdit={handleEdit}
                  onToggle={(id, status) => handleToggle(id, status, coupon.code)}
                  onDelete={(id) => handleDelete(id, coupon.code)}
                  onDuplicate={handleDuplicate}
                  isCouponActive={isCouponActive}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Wizard Modal */}
      <CouponWizardModal
        isOpen={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          setWizardStep(1);
        }}
        step={wizardStep}
        setStep={setWizardStep}
        formData={formData}
        handleChange={handleChange}
        setFormData={setFormData}
        onPrimaryAction={handleWizardPrimaryAction}
        loading={loading}
        isEditing={!!editId}
      />

      {/* Confirm delete */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, couponId: null, couponCode: "" })
        }
        onConfirm={confirmDelete}
        title="Delete coupon"
        message={`Are you sure you want to delete coupon "${deleteModal.couponCode}"? This cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Confirm toggle */}
      <ConfirmationModal
        isOpen={toggleModal.isOpen}
        onClose={() =>
          setToggleModal({
            isOpen: false,
            couponId: null,
            currentStatus: false,
            couponCode: "",
          })
        }
        onConfirm={confirmToggle}
        title={toggleModal.currentStatus ? "Deactivate coupon" : "Activate coupon"}
        message={`Are you sure you want to ${
          toggleModal.currentStatus ? "deactivate" : "activate"
        } coupon "${toggleModal.couponCode}"?`}
        confirmText={toggleModal.currentStatus ? "Deactivate" : "Activate"}
        type="warning"
      />

      {/* Success */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() =>
          setSuccessModal({ isOpen: false, title: "", message: "" })
        }
        title={successModal.title}
        message={successModal.message}
      />
    </div>
  );
};

export default React.memo(CouponPage);
