// import React, { useState, useEffect, useCallback } from "react";
// import Axios from "../utils/axios";
// import toast from "react-hot-toast";
// import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaInfoCircle, FaCalendarAlt, FaUsers, FaTags, FaPercentage, FaRupeeSign, FaBox, FaShoppingCart } from "react-icons/fa";

// const initialFormState = {
//   code: "",
//   discountType: "percent",
//   discountValue: 0,
//   minAmount: 0,
//   maxDiscount: 0,
//   startDate: "",
//   endDate: "",
//   isActive: true,
//   usageLimit: 0,
//   userUsageLimit: 1,
//   minProducts: 1,
//   maxProducts: 0,
//   stackable: false,
//   autoApply: false,
//   firstOrderOnly: false,
//   customerEligibility: "all",
//   eligibleCustomers: [],
//   description: "",
//   termsAndConditions: "",
//   priority: 1,
//   applicableCategories: [],
//   excludedCategories: [],
//   applicableProducts: [],
//   excludedProducts: [],
//   applicableBrands: [],
// };

// const CouponPage = () => {
//   const [formData, setFormData] = useState(initialFormState);
//   const [coupons, setCoupons] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("create");
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     expired: 0,
//     usageRate: 0,
//   });

//   // Fetch all coupons with stats
//   const fetchCoupons = async () => {
//     try {
//       const { data } = await Axios.get("/api/coupon/list");
//       if (data.success) {
//         setCoupons(data.data);
        
//         // Calculate stats
//         const total = data.data.length;
//         const active = data.data.filter(c => c.isCurrentlyActive).length;
//         const expired = data.data.filter(c => c.isExpired).length;
//         const usageRate = total > 0 ? (data.data.reduce((sum, c) => sum + c.usedCount, 0) / total).toFixed(1) : 0;
        
//         setStats({ total, active, expired, usageRate });
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || err.message);
//     }
//   };

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   // Enhanced validation
//   const validateForm = () => {
//     if (!formData.code.trim()) {
//       toast.error("Coupon code is required");
//       return false;
//     }

//     if (formData.code.length < 3 || formData.code.length > 20) {
//       toast.error("Coupon code must be between 3-20 characters");
//       return false;
//     }

//     if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
//       toast.error("Coupon code can only contain uppercase letters, numbers, hyphens, and underscores");
//       return false;
//     }

//     if (formData.discountValue <= 0) {
//       toast.error("Discount value must be greater than 0");
//       return false;
//     }

//     if (formData.discountType === "percent" && formData.discountValue > 100) {
//       toast.error("Percentage discount cannot exceed 100%");
//       return false;
//     }

//     if (!formData.startDate || !formData.endDate) {
//       toast.error("Start and end dates are required");
//       return false;
//     }

//     if (new Date(formData.startDate) >= new Date(formData.endDate)) {
//       toast.error("End date must be after start date");
//       return false;
//     }

//     if (formData.minProducts > formData.maxProducts && formData.maxProducts > 0) {
//       toast.error("Max products cannot be less than min products");
//       return false;
//     }

//     return true;
//   };

//   // Handle input changes with proper type conversion
//   const handleChange = (e) => {
//     const { name, type, value, checked } = e.target;
    
//     let processedValue = type === "checkbox" ? checked : value;
    
//     // Convert number fields
//     if (["discountValue", "minAmount", "maxDiscount", "usageLimit", "userUsageLimit", "minProducts", "maxProducts", "priority"].includes(name)) {
//       processedValue = processedValue === "" ? 0 : Number(processedValue);
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: processedValue,
//     }));

//     // Reset maxDiscount if discountType changes to fixed
//     if (name === "discountType" && value === "fixed") {
//       setFormData((prev) => ({ ...prev, maxDiscount: 0 }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       setLoading(true);

//       const payload = {
//         ...formData,
//         code: formData.code.toUpperCase().trim(),
//       };

//       let response;
//       if (editId) {
//         response = await Axios.put(`/api/coupon/update/${editId}`, payload);
//       } else {
//         response = await Axios.post("/api/coupon/create", payload);
//       }

//       if (response.data.success) {
//         toast.success(editId ? "Coupon updated successfully!" : "Coupon created successfully!");
//         resetForm();
//         fetchCoupons();
//         setActiveTab("list");
//       }
//     } catch (err) {
//       const errorMsg = err?.response?.data?.message || err.message;
//       if (errorMsg.includes("unique")) {
//         toast.error("Coupon code already exists");
//       } else {
//         toast.error(errorMsg);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData(initialFormState);
//     setEditId(null);
//   };

//   // Handle edit
//   const handleEdit = (coupon) => {
//     setEditId(coupon._id);
//     setFormData({
//       ...coupon,
//       startDate: coupon.startDate?.slice(0, 10) || "",
//       endDate: coupon.endDate?.slice(0, 10) || "",
//       eligibleCustomers: coupon.eligibleCustomers || [],
//       applicableCategories: coupon.applicableCategories || [],
//       excludedCategories: coupon.excludedCategories || [],
//       applicableProducts: coupon.applicableProducts || [],
//       excludedProducts: coupon.excludedProducts || [],
//       applicableBrands: coupon.applicableBrands || [],
//     });
//     setActiveTab("create");
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Handle delete
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) return;
    
//     try {
//       const { data } = await Axios.delete(`/api/coupon/delete/${id}`);
//       if (data.success) {
//         toast.success("Coupon deleted successfully");
//         fetchCoupons();
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || err.message);
//     }
//   };

//   // Handle toggle status
//   const handleToggle = async (id, currentStatus) => {
//     try {
//       const { data } = await Axios.patch(`/api/coupon/toggle/${id}`);
//       if (data.success) {
//         toast.success(`Coupon ${!currentStatus ? "activated" : "deactivated"}`);
//         fetchCoupons();
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || err.message);
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Check if coupon is currently active
//   const isCouponActive = (coupon) => {
//     const now = new Date();
//     const start = new Date(coupon.startDate);
//     const end = new Date(coupon.endDate);
//     return coupon.isActive && now >= start && now <= end && 
//            (coupon.usageLimit === 0 || coupon.usedCount < coupon.usageLimit);
//   };

//   // Stats cards
//   const StatCard = ({ title, value, icon, color }) => (
//     <div className={`bg-white rounded-xl p-6 border-l-4 ${color} shadow-sm`}>
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
//         </div>
//         <div className="text-2xl opacity-80">{icon}</div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50/30 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
//           <p className="text-gray-600 mt-2">Create and manage discount coupons for your store</p>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard 
//             title="Total Coupons" 
//             value={stats.total} 
//             icon={<FaTags />} 
//             color="border-blue-500" 
//           />
//           <StatCard 
//             title="Active Coupons" 
//             value={stats.active} 
//             icon={<FaToggleOn />} 
//             color="border-green-500" 
//           />
//           <StatCard 
//             title="Expired Coupons" 
//             value={stats.expired} 
//             icon={<FaCalendarAlt />} 
//             color="border-red-500" 
//           />
//           <StatCard 
//             title="Avg Usage Rate" 
//             value={`${stats.usageRate}`} 
//             icon={<FaUsers />} 
//             color="border-purple-500" 
//           />
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab("create")}
//               className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
//                 activeTab === "create"
//                   ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50/50"
//                   : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//               }`}
//             >
//               {editId ? "Edit Coupon" : "Create Coupon"}
//             </button>
//             <button
//               onClick={() => setActiveTab("list")}
//               className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
//                 activeTab === "list"
//                   ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50/50"
//                   : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//               }`}
//             >
//               All Coupons
//             </button>
//           </div>

//           {/* Create/Edit Form */}
//           {activeTab === "create" && (
//             <form onSubmit={handleSubmit} className="p-8">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Basic Information */}
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                     <FaInfoCircle className="text-amber-600" />
//                     Basic Information
//                   </h3>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Coupon Code *
//                     </label>
//                     <input
//                       type="text"
//                       name="code"
//                       value={formData.code}
//                       onChange={handleChange}
//                       placeholder="SUMMER25"
//                       className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                       required
//                     />
//                     <p className="text-xs text-gray-500 mt-1">
//                       3-20 characters, uppercase letters, numbers, hyphens, and underscores only
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Discount Type *
//                       </label>
//                       <select
//                         name="discountType"
//                         value={formData.discountType}
//                         onChange={handleChange}
//                         className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                       >
//                         <option value="percent">Percentage (%)</option>
//                         <option value="fixed">Fixed Amount (₹)</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Discount Value *
//                       </label>
//                       <div className="relative">
//                         <input
//                           type="number"
//                           name="discountValue"
//                           value={formData.discountValue}
//                           onChange={handleChange}
//                           min="0"
//                           max={formData.discountType === "percent" ? "100" : undefined}
//                           step={formData.discountType === "percent" ? "0.1" : "1"}
//                           className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition pr-12"
//                           required
//                         />
//                         <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
//                           {formData.discountType === "percent" ? <FaPercentage /> : <FaRupeeSign />}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {formData.discountType === "percent" && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Maximum Discount (₹)
//                       </label>
//                       <input
//                         type="number"
//                         name="maxDiscount"
//                         value={formData.maxDiscount}
//                         onChange={handleChange}
//                         min="0"
//                         className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                       />
//                       <p className="text-xs text-gray-500 mt-1">
//                         Maximum discount amount for percentage discounts (0 = no limit)
//                       </p>
//                     </div>
//                   )}

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Minimum Order Amount (₹)
//                     </label>
//                     <input
//                       type="number"
//                       name="minAmount"
//                       value={formData.minAmount}
//                       onChange={handleChange}
//                       min="0"
//                       className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                     />
//                   </div>
//                 </div>

//                 {/* Validity & Limits */}
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                     <FaCalendarAlt className="text-amber-600" />
//                     Validity & Limits
//                   </h3>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Start Date *
//                       </label>
//                       <input
//                         type="date"
//                         name="startDate"
//                         value={formData.startDate}
//                         onChange={handleChange}
//                         className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         End Date *
//                       </label>
//                       <input
//                         type="date"
//                         name="endDate"
//                         value={formData.endDate}
//                         onChange={handleChange}
//                         className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Total Usage Limit
//                       </label>
//                       <input
//                         type="number"
//                         name="usageLimit"
//                         value={formData.usageLimit}
//                         onChange={handleChange}
//                         min="0"
//                         className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                       />
//                       <p className="text-xs text-gray-500 mt-1">0 = Unlimited</p>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Per User Limit
//                       </label>
//                       <input
//                         type="number"
//                         name="userUsageLimit"
//                         value={formData.userUsageLimit}
//                         onChange={handleChange}
//                         min="1"
//                         className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Min Products
//                       </label>
//                       <input
//                         type="number"
//                         name="minProducts"
//                         value={formData.minProducts}
//                         onChange={handleChange}
//                         min="1"
//                         className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Max Products
//                       </label>
//                       <input
//                         type="number"
//                         name="maxProducts"
//                         value={formData.maxProducts}
//                         onChange={handleChange}
//                         min="0"
//                         className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                       />
//                       <p className="text-xs text-gray-500 mt-1">0 = Unlimited</p>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Priority
//                     </label>
//                     <input
//                       type="number"
//                       name="priority"
//                       value={formData.priority}
//                       onChange={handleChange}
//                       min="1"
//                       max="10"
//                       className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">1 = Highest, 10 = Lowest</p>
//                   </div>
//                 </div>

//                 {/* Advanced Settings */}
//                 <div className="lg:col-span-2 space-y-6">
//                   <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                     <FaShoppingCart className="text-amber-600" />
//                     Advanced Settings
//                   </h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition">
//                       <input
//                         type="checkbox"
//                         name="stackable"
//                         checked={formData.stackable}
//                         onChange={handleChange}
//                         className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
//                       />
//                       <span className="text-sm font-medium text-gray-700">Stackable</span>
//                     </label>

//                     <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition">
//                       <input
//                         type="checkbox"
//                         name="autoApply"
//                         checked={formData.autoApply}
//                         onChange={handleChange}
//                         className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
//                       />
//                       <span className="text-sm font-medium text-gray-700">Auto Apply</span>
//                     </label>

//                     <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition">
//                       <input
//                         type="checkbox"
//                         name="firstOrderOnly"
//                         checked={formData.firstOrderOnly}
//                         onChange={handleChange}
//                         className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
//                       />
//                       <span className="text-sm font-medium text-gray-700">First Order Only</span>
//                     </label>

//                     <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition">
//                       <input
//                         type="checkbox"
//                         name="isActive"
//                         checked={formData.isActive}
//                         onChange={handleChange}
//                         className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
//                       />
//                       <span className="text-sm font-medium text-gray-700">Active</span>
//                     </label>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Customer Eligibility
//                     </label>
//                     <select
//                       name="customerEligibility"
//                       value={formData.customerEligibility}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                     >
//                       <option value="all">All Customers</option>
//                       <option value="new_customers">New Customers Only</option>
//                       <option value="existing_customers">Existing Customers Only</option>
//                       <option value="specific_customers">Specific Customers</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Description
//                     </label>
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleChange}
//                       rows="2"
//                       className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                       placeholder="Describe the purpose of this coupon..."
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Terms & Conditions
//                     </label>
//                     <textarea
//                       name="termsAndConditions"
//                       value={formData.termsAndConditions}
//                       onChange={handleChange}
//                       rows="3"
//                       className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
//                       placeholder="Any specific terms and conditions for this coupon..."
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Form Actions */}
//               <div className="flex gap-4 pt-8 mt-8 border-t border-gray-200">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       {editId ? "Updating..." : "Creating..."}
//                     </div>
//                   ) : (
//                     editId ? "Update Coupon" : "Create Coupon"
//                   )}
//                 </button>
                
//                 {editId && (
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     disabled={loading}
//                     className="px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
//                   >
//                     Cancel Edit
//                   </button>
//                 )}
//               </div>
//             </form>
//           )}

//           {/* Coupons List */}
//           {activeTab === "list" && (
//             <div className="p-6">
//               {coupons.length === 0 ? (
//                 <div className="text-center py-12">
//                   <FaTags className="mx-auto text-4xl text-gray-300 mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
//                   <p className="text-gray-500 mb-6">Get started by creating your first coupon</p>
//                   <button
//                     onClick={() => setActiveTab("create")}
//                     className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-xl"
//                   >
//                     Create Coupon
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {coupons.map((coupon) => (
//                     <div
//                       key={coupon._id}
//                       className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-4 mb-3">
//                             <div className="flex items-center gap-2">
//                               <span className="text-lg font-bold text-gray-900 bg-amber-100 px-3 py-1 rounded-lg">
//                                 {coupon.code}
//                               </span>
//                               <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                                 isCouponActive(coupon) 
//                                   ? 'bg-green-100 text-green-800' 
//                                   : 'bg-red-100 text-red-800'
//                               }`}>
//                                 {isCouponActive(coupon) ? 'Active' : 'Inactive'}
//                               </span>
//                             </div>
//                             <div className="text-lg font-bold text-amber-600">
//                               {coupon.discountText}
//                             </div>
//                           </div>

//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
//                             <div>
//                               <span className="font-medium">Validity:</span>
//                               <div>{formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}</div>
//                             </div>
//                             <div>
//                               <span className="font-medium">Min Amount:</span>
//                               <div>₹{coupon.minAmount}</div>
//                             </div>
//                             <div>
//                               <span className="font-medium">Usage:</span>
//                               <div>{coupon.usedCount}/{coupon.usageLimit || '∞'}</div>
//                             </div>
//                             <div>
//                               <span className="font-medium">User Limit:</span>
//                               <div>{coupon.userUsageLimit}</div>
//                             </div>
//                           </div>

//                           {coupon.description && (
//                             <p className="text-gray-600 mt-3 text-sm">{coupon.description}</p>
//                           )}
//                         </div>

//                         <div className="flex gap-2 ml-4">
//                           <button
//                             onClick={() => handleEdit(coupon)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                             title="Edit"
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             onClick={() => handleToggle(coupon._id, coupon.isActive)}
//                             className={`p-2 rounded-lg transition ${
//                               coupon.isActive 
//                                 ? 'text-green-600 hover:bg-green-50' 
//                                 : 'text-gray-600 hover:bg-gray-50'
//                             }`}
//                             title={coupon.isActive ? "Deactivate" : "Activate"}
//                           >
//                             {coupon.isActive ? <FaToggleOn /> : <FaToggleOff />}
//                           </button>
//                           <button
//                             onClick={() => handleDelete(coupon._id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
//                             title="Delete"
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CouponPage;
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Axios from "../utils/axios";
import toast from "react-hot-toast";
import { 
  FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaInfoCircle, 
  FaCalendarAlt, FaUsers, FaTags, FaPercentage, FaRupeeSign, 
  FaShoppingCart, FaChevronDown, FaSave, FaPlus,
  FaSearch, FaFilter, FaClock, FaUserCheck, FaBox,
  FaFire, FaRocket, FaGem, FaCrown, FaCopy,
  FaTimes, FaExclamationTriangle, FaCheckCircle,
  FaPowerOff, FaEye, FaEyeSlash
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

// Custom Confirmation Modal Component
const ConfirmationModal = React.memo(({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "warning" 
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    warning: { icon: FaExclamationTriangle, color: "text-yellow-500", bgColor: "bg-yellow-50" },
    danger: { icon: FaExclamationTriangle, color: "text-red-500", bgColor: "bg-red-50" },
    success: { icon: FaCheckCircle, color: "text-green-500", bgColor: "bg-green-50" },
    info: { icon: FaInfoCircle, color: "text-blue-500", bgColor: "bg-blue-50" }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
        <div className={`p-6 ${config.bgColor} rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            <Icon className={`text-2xl ${config.color}`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white font-medium rounded-lg transition-colors ${
                type === "danger" 
                  ? "bg-red-500 hover:bg-red-600" 
                  : type === "success"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Custom Success Modal
const SuccessModal = React.memo(({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full transform transition-all text-center p-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-3xl text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
});

// Enhanced Custom Dropdown Component
const Dropdown = React.memo(({ 
  value, 
  options, 
  onChange, 
  placeholder, 
  className = "",
  icon: Icon 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-400 transition-all text-left shadow-sm"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="text-amber-500 text-sm" />}
          <span className="text-gray-700 font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <FaChevronDown className={`transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-amber-50 transition-all flex items-center gap-3 text-sm font-medium border-b border-gray-100 last:border-b-0 ${
                  value === option.value ? 'bg-amber-50 text-amber-700' : 'text-gray-700'
                }`}
              >
                {option.icon && <span className="text-amber-500">{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

// Enhanced Toggle Component
const Toggle = React.memo(({ enabled, onChange, label, description }) => (
  <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group">
    <div className="flex-shrink-0 mt-1">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-11 h-6 rounded-full transition-all duration-300 ${
          enabled ? 'bg-amber-500' : 'bg-gray-300'
        }`}>
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-transform duration-300 ${
            enabled ? 'transform translate-x-5' : 'transform translate-x-0.5'
          }`} />
        </div>
      </label>
    </div>
    <div className="flex-1">
      <div className="text-sm font-semibold text-gray-800">{label}</div>
      {description && (
        <div className="text-xs text-gray-600 mt-1">{description}</div>
      )}
    </div>
  </div>
));

// Modern Stats Card Component
const StatCard = React.memo(({ title, value, icon, description, trend }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        )}
      </div>
      <div className="text-2xl text-amber-500 p-3 bg-amber-50 rounded-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
  </div>
));

// Enhanced Form Field Component
const FormField = React.memo(({ 
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
  step
}) => (
  <div className={className}>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon />
        </div>
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
        className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-700 placeholder-gray-500 font-normal ${
          Icon ? 'pl-10' : ''
        } ${helperText ? 'border-amber-300' : ''}`}
      />
    </div>
    {helperText && (
      <p className="text-xs text-amber-600 mt-1">{helperText}</p>
    )}
  </div>
));

// Quick Action Button Component
const QuickAction = React.memo(({ icon, label, onClick, variant = "primary", size = "md" }) => {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3",
    lg: "px-6 py-4 text-lg"
  };

  const variants = {
    primary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
    success: "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${sizes[size]} ${variants[variant]}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
});

// Enhanced Coupon Card Component with the requested structure
const CouponCard = React.memo(({ coupon, onEdit, onToggle, onDelete, onDuplicate, isCouponActive, formatDate }) => {
  const [showDetails, setShowDetails] = useState(false);

  const statusConfig = {
    active: { 
      color: 'bg-green-100 text-green-800 border-green-200', 
      label: 'Active',
      icon: <FaCheckCircle className="text-green-500" size={14}/>
    },
    inactive: { 
      color: 'bg-gray-100 text-gray-800 border-gray-200', 
      label: 'Inactive',
      icon: <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
    },
    expired: { 
      color: 'bg-red-100 text-red-800 border-red-200', 
      label: 'Expired',
      icon: <div className="w-2 h-2 bg-red-500 rounded-full"></div>
    }
  };

  const status = isCouponActive(coupon) ? 'active' : coupon.isExpired ? 'expired' : 'inactive';
  const config = statusConfig[status];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
      {/* First Main Div - Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        {/* First Sub Div - Code and Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-3 rounded-lg font-bold text-lg shadow-md">
              {coupon.code}
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${config.color}`}>
              {config.icon}
              <span>{config.label}</span>
            </div>
          </div>
        </div>

        {/* Second Sub Div - Discount and Actions */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-600">
              {coupon.discountType === "percent" 
                ? `${coupon.discountValue}% OFF` 
                : `₹${coupon.discountValue} OFF`}
            </div>
            {coupon.description && (
              <div className="text-sm text-gray-600 mt-1 max-w-xs line-clamp-1">{coupon.description}</div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(coupon)}
              className="p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all border border-blue-200 hover:border-blue-300 shadow-sm"
              title="Edit coupon"
            >
              <FaEdit size={16} />
            </button>
            <button
              onClick={() => onDuplicate(coupon)}
              className="p-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all border border-purple-200 hover:border-purple-300 shadow-sm"
              title="Duplicate coupon"
            >
              <FaCopy size={16} />
            </button>
            <button
              onClick={() => onToggle(coupon._id, coupon.isActive)}
              className={`p-3 rounded-xl transition-all border shadow-sm hover:scale-105 ${
                coupon.isActive 
                  ? 'text-green-600 hover:text-red-600 hover:bg-red-50 border-green-200 hover:border-red-300' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50 border-gray-200 hover:border-green-300'
              }`}
              title={coupon.isActive ? "Deactivate coupon" : "Activate coupon"}
            >
              <FaPowerOff size={16} />
            </button>
            <button
              onClick={() => onDelete(coupon._id)}
              className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all border border-red-200 hover:border-red-300 shadow-sm"
              title="Delete coupon"
            >
              <FaTrash size={16} />
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-3 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all border border-gray-200 hover:border-gray-300 shadow-sm"
              title={showDetails ? "Hide details" : "Show details"}
            >
              {showDetails ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Second Main Div - Coupon Details */}
      {showDetails && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                <FaCalendarAlt className="text-amber-500 text-xs" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">VALIDITY</div>
                <div className="text-gray-700 font-medium">
                  {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                <FaRupeeSign className="text-amber-500 text-xs" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">MIN. AMOUNT</div>
                <div className="text-gray-700 font-medium">₹{coupon.minAmount}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                <FaUsers className="text-amber-500 text-xs" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">TOTAL USES</div>
                <div className="text-gray-700 font-medium">
                  {coupon.usedCount} / {coupon.usageLimit || '∞'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                <FaUserCheck className="text-amber-500 text-xs" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">PER USER</div>
                <div className="text-gray-700 font-medium">{coupon.userUsageLimit}</div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">PRIORITY</div>
              <div className="text-lg font-bold text-amber-600">{coupon.priority || 1}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">STACKABLE</div>
              <div className={`text-lg font-bold ${coupon.stackable ? 'text-green-600' : 'text-gray-400'}`}>
                {coupon.stackable ? 'Yes' : 'No'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">AUTO APPLY</div>
              <div className={`text-lg font-bold ${coupon.autoApply ? 'text-green-600' : 'text-gray-400'}`}>
                {coupon.autoApply ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

const CouponPage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [coupons, setCoupons] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tableLoading, setTableLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    usageRate: 0,
    totalUsage: 0
  });

  // Modal States
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, couponId: null, couponCode: "" });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "", message: "" });
  const [toggleModal, setToggleModal] = useState({ isOpen: false, couponId: null, currentStatus: false, couponCode: "" });

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
      setTableLoading(true);
      const { data } = await Axios.get("/api/coupon/list");
      if (data.success) {
        setCoupons(data.data);
        setStats(calculateStats(data.data));
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      toast.error("Failed to load coupons. Please try again.");
    } finally {
      setTableLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Enhanced validation with specific error messages
  const validateForm = useCallback(() => {
    const errors = [];

    if (!formData.code.trim()) {
      errors.push("Coupon code is required");
    } else if (formData.code.length < 3 || formData.code.length > 20) {
      errors.push("Coupon code must be between 3-20 characters");
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
      errors.push("Coupon code can only contain uppercase letters, numbers, hyphens, and underscores");
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      errors.push("Discount value must be greater than 0");
    } else if (formData.discountType === "percent" && formData.discountValue > 100) {
      errors.push("Percentage discount cannot exceed 100%");
    }

    if (!formData.startDate || !formData.endDate) {
      errors.push("Start and end dates are required");
    } else if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.push("End date must be after start date");
    }

    if (formData.minProducts && formData.maxProducts && formData.minProducts > formData.maxProducts && formData.maxProducts > 0) {
      errors.push("Maximum products cannot be less than minimum products");
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }

    return true;
  }, [formData]);

  // Optimized input handler
  const handleChange = useCallback((e) => {
    const { name, type, value, checked } = e.target;
    
    let processedValue = type === "checkbox" ? checked : value;
    
    // Convert number fields only if value is not empty
    const numberFields = ["discountValue", "minAmount", "maxDiscount", "usageLimit", "userUsageLimit", "minProducts", "maxProducts", "priority"];
    if (numberFields.includes(name) && processedValue !== "") {
      processedValue = Number(processedValue);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));

    // Reset maxDiscount if discountType changes to fixed
    if (name === "discountType" && value === "fixed") {
      setFormData(prev => ({ ...prev, maxDiscount: "" }));
    }
  }, []);

  // Enhanced form submission with better error handling
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
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

      const endpoint = editId ? `/api/coupon/update/${editId}` : "/api/coupon/create";
      const method = editId ? 'put' : 'post';

      const response = await Axios[method](endpoint, payload);

      if (response.data.success) {
        setSuccessModal({
          isOpen: true,
          title: editId ? "Coupon Updated!" : "Coupon Created!",
          message: editId 
            ? "Your coupon has been successfully updated."
            : "Your new coupon has been created successfully."
        });
        resetForm();
        fetchCoupons();
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err.message;
      if (errorMsg.includes("unique") || errorMsg.includes("already exists")) {
        toast.error("❌ This coupon code already exists");
      } else {
        toast.error(`❌ ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  }, [formData, editId, validateForm, fetchCoupons]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setEditId(null);
  }, []);

  // Enhanced edit handler
  const handleEdit = useCallback((coupon) => {
    setEditId(coupon._id);
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
    setActiveTab("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Duplicate coupon functionality
  const handleDuplicate = useCallback((coupon) => {
    const duplicatedCoupon = {
      ...coupon,
      code: `${coupon.code}_COPY`,
      _id: null,
      usedCount: 0
    };
    handleEdit(duplicatedCoupon);
    toast.success("Coupon Copied!");
  }, [handleEdit]);

  // Enhanced delete with custom modal
  const handleDelete = useCallback((id, code) => {
    setDeleteModal({
      isOpen: true,
      couponId: id,
      couponCode: code
    });
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      const { data } = await Axios.delete(`/api/coupon/delete/${deleteModal.couponId}`);
      if (data.success) {
        toast.success("🗑️ Coupon deleted successfully");
        fetchCoupons();
        setDeleteModal({ isOpen: false, couponId: null, couponCode: "" });
      }
    } catch (err) {
      toast.error("❌ Failed to delete coupon");
    }
  }, [deleteModal, fetchCoupons]);

  // Toggle coupon status with confirmation modal
  const handleToggle = useCallback((id, currentStatus, code) => {
    setToggleModal({
      isOpen: true,
      couponId: id,
      currentStatus,
      couponCode: code
    });
  }, []);

  const confirmToggle = useCallback(async () => {
    try {
      const { data } = await Axios.patch(`/api/coupon/toggle/${toggleModal.couponId}`);
      if (data.success) {
        toast.success(`Coupon ${!toggleModal.currentStatus ? "activated" : "deactivated"}`);
        fetchCoupons();
        setToggleModal({ isOpen: false, couponId: null, currentStatus: false, couponCode: "" });
      }
    } catch (err) {
      toast.error("❌ Failed to update coupon status");
    }
  }, [toggleModal, fetchCoupons]);

  // Utility functions
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  const isCouponActive = useCallback((coupon) => {
    const now = new Date();
    const start = new Date(coupon.startDate);
    const end = new Date(coupon.endDate);
    return coupon.isActive && now >= start && now <= end && 
           (coupon.usageLimit === 0 || coupon.usedCount < coupon.usageLimit);
  }, []);

  // Memoized filtered coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter(coupon => {
      const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           coupon.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "active" && isCouponActive(coupon)) ||
                           (statusFilter === "inactive" && !isCouponActive(coupon) && !coupon.isExpired) ||
                           (statusFilter === "expired" && coupon.isExpired);
      
      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchTerm, statusFilter, isCouponActive]);

  // Memoized stats data
  const statsData = useMemo(() => [
    { 
      title: "Total Coupons", 
      value: stats.total, 
      icon: <FaTags />, 
      description: "All created coupons",
      trend: 12 // Example trend data
    },
    { 
      title: "Active Now", 
      value: stats.active, 
      icon: <FaRocket />, 
      description: "Currently running",
      trend: 5
    },
    { 
      title: "Expired", 
      value: stats.expired, 
      icon: <FaClock />, 
      description: "Past coupons",
      trend: -2
    },
    { 
      title: "Total Usage", 
      value: stats.totalUsage, 
      icon: <FaUsers />, 
      description: "Total times used",
      trend: 8
    },
  ], [stats]);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-full mx-auto px-4 pb-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div>
            <h2 className="font-bold text-2xl text-gray-900">Coupon Management</h2>
            <p className="text-gray-600 mt-2 text-sm">Create and manage discount campaigns for your store</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <QuickAction
              icon={<FaPlus />}
              label="New Coupon"
              onClick={() => {
                resetForm();
                setActiveTab("create");
              }}
              variant="primary"
            />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 bg-white border border-gray-200 rounded-2xl p-2 mb-6 shadow-sm">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 min-w-[160px] ${
              activeTab === "list"
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
            }`}
          >
            <FaTags className="text-sm" />
            All Coupons
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 min-w-[160px] ${
              activeTab === "create"
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
            }`}
          >
            <FaPlus className="text-sm" />
            {editId ? "Edit Coupon" : "New Coupon"}
          </button>
        </div>

        {/* Create/Edit Form */}
        {activeTab === "create" && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                  <FaInfoCircle className="text-amber-500 text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                    <p className="text-sm text-gray-600">Core details about your coupon</p>
                  </div>
                </div>
                
                <FormField
                  label="Coupon Code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="SUMMER25"
                  icon={FaTags}
                  helperText="3-20 characters, uppercase letters, numbers, hyphens, and underscores only"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Discount Type *
                    </label>
                    <Dropdown
                      value={formData.discountType}
                      options={[
                        { value: "percent", label: "Percentage %" },
                        { value: "fixed", label: "Fixed Amount ₹" }
                      ]}
                      onChange={(value) => setFormData(prev => ({ ...prev, discountType: value }))}
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
                    icon={formData.discountType === "percent" ? FaPercentage : FaRupeeSign}
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
                    placeholder="0 for no limit"
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

              {/* Validity & Limits */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                  <FaCalendarAlt className="text-amber-500 text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Validity & Limits</h3>
                    <p className="text-sm text-gray-600">When and how the coupon can be used</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                <div className="grid grid-cols-2 gap-4">
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

                <div className="grid grid-cols-2 gap-4">
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
                  placeholder="1 (Highest) to 10 (Lowest)"
                  icon={FaFire}
                  min="1"
                  max="10"
                />
              </div>

              {/* Advanced Settings */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                  <FaShoppingCart className="text-amber-500 text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Advanced Settings</h3>
                    <p className="text-sm text-gray-600">Additional rules and restrictions</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Toggle
                    enabled={formData.stackable}
                    onChange={(e) => setFormData(prev => ({ ...prev, stackable: e.target.checked }))}
                    label="Stackable Coupon"
                    description="Can be combined with other coupons"
                  />
                  <Toggle
                    enabled={formData.autoApply}
                    onChange={(e) => setFormData(prev => ({ ...prev, autoApply: e.target.checked }))}
                    label="Auto Apply"
                    description="Automatically applied for eligible customers"
                  />
                  <Toggle
                    enabled={formData.firstOrderOnly}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstOrderOnly: e.target.checked }))}
                    label="First Order Only"
                    description="Exclusive for new customers"
                  />
                  <Toggle
                    enabled={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    label="Active Status"
                    description="Enable or disable this coupon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Eligibility
                  </label>
                  <Dropdown
                    value={formData.customerEligibility}
                    options={[
                      { value: "all", label: "All Customers" },
                      { value: "new_customers", label: "New Customers Only" },
                      { value: "existing_customers", label: "Existing Customers Only" },
                      { value: "specific_customers", label: "Specific Customers" }
                    ]}
                    onChange={(value) => setFormData(prev => ({ ...prev, customerEligibility: value }))}
                    placeholder="Select eligibility"
                    icon={FaUserCheck}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Coupon Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-700 font-normal"
                    placeholder="Describe the purpose and benefits of this coupon..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Terms & Conditions
                  </label>
                  <textarea
                    name="termsAndConditions"
                    value={formData.termsAndConditions}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-700 font-normal"
                    placeholder="Any specific terms, conditions, or restrictions..."
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-8 py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-3 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editId ? "Updating Coupon..." : "Creating Coupon..."}
                  </>
                ) : (
                  <>
                    <FaSave className="text-lg" />
                    {editId ? "Update Coupon" : "Create Coupon"}
                  </>
                )}
              </button>
              
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab("list");
                  }}
                  className="flex-1 px-8 py-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-3"
                >
                  <FaTimes />
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        )}

        {/* Coupons List */}
        {activeTab === "list" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search coupons by code or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-700 font-normal"
                />
              </div>
              <div className="sm:w-48">
                <Dropdown
                  value={statusFilter}
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "expired", label: "Expired" }
                  ]}
                  onChange={setStatusFilter}
                  placeholder="Filter by status"
                  icon={FaFilter}
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 font-medium bg-amber-50 p-3 rounded-lg border border-amber-200">
              <VscGraph />
              Showing <span className="font-bold text-amber-700">{filteredCoupons.length}</span> of <span className="font-bold text-amber-700">{coupons.length}</span> coupons
            </div>

            {tableLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-medium">Loading coupons...</p>
              </div>
            ) : filteredCoupons.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No coupons found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Get started by creating your first coupon"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <QuickAction
                    icon={<FaPlus />}
                    label="Create First Coupon"
                    onClick={() => setActiveTab("create")}
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
                      discountText: coupon.discountType === "percent" 
                        ? `${coupon.discountValue}% OFF` 
                        : `₹${coupon.discountValue} OFF`,
                      isCurrentlyActive: isCouponActive(coupon)
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
        )}
      </div>

      {/* Custom Modals */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, couponId: null, couponCode: "" })}
        onConfirm={confirmDelete}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon "${deleteModal.couponCode}"? This action cannot be undone.`}
        confirmText="Delete Coupon"
        type="danger"
      />

      <ConfirmationModal
        isOpen={toggleModal.isOpen}
        onClose={() => setToggleModal({ isOpen: false, couponId: null, currentStatus: false, couponCode: "" })}
        onConfirm={confirmToggle}
        title={toggleModal.currentStatus ? "Deactivate Coupon" : "Activate Coupon"}
        message={`Are you sure you want to ${toggleModal.currentStatus ? 'deactivate' : 'activate'} coupon "${toggleModal.couponCode}"?`}
        confirmText={toggleModal.currentStatus ? "Deactivate" : "Activate"}
        type="warning"
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => {
          setSuccessModal({ isOpen: false, title: "", message: "" });
          setActiveTab("list");
        }}
        title={successModal.title}
        message={successModal.message}
      />
    </div>
  );
};

export default React.memo(CouponPage);