// // pages/AdminSellerApplications.jsx
// import React, {
//   useEffect,
//   useState,
//   useMemo,
//   useCallback,
// } from "react";
// import Axios from "../utils/network/axios";
// import SummaryApi from "../comman/summaryApi";
// import { toast } from "react-hot-toast";
// import {
//   FiSearch,
//   FiFilter,
//   FiLoader,
//   FiUser,
//   FiFileText,
//   FiEye,
//   FiX,
//   FiCheckCircle,
//   FiXCircle,
//   FiChevronDown,
//   FiCalendar,
//   FiMail,
//   FiBriefcase,
//   FiFile,
//   FiChevronRight,
//   FiExternalLink,
//   FiAlertCircle,
//   FiRefreshCw,
// } from "react-icons/fi";

// /* ---------------------- Custom Dropdown Component ---------------------- */
// const CustomDropdown = ({ 
//   options, 
//   value, 
//   onChange, 
//   placeholder = "Select...",
//   className = "",
//   disabled = false
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = React.useRef(null);

//   const selectedOption = options.find(opt => opt.value === value);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div className={`relative ${className}`} ref={dropdownRef}>
//       <button
//         type="button"
//         onClick={() => !disabled && setIsOpen(!isOpen)}
//         disabled={disabled}
//         className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-white flex items-center justify-between text-sm transition-all duration-200 ${
//           disabled 
//             ? "opacity-50 cursor-not-allowed" 
//             : "hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
//         } shadow-sm`}
//       >
//         <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
//           {selectedOption ? selectedOption.label : placeholder}
//         </span>
//         <FiChevronDown 
//           className={`text-gray-400 transition-transform duration-200 ${
//             isOpen ? "rotate-180" : ""
//           }`} 
//         />
//       </button>

//       {isOpen && (
//         <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2 max-h-60 overflow-auto animate-in fade-in-0 zoom-in-95">
//           {options.map((option) => (
//             <button
//               key={option.value}
//               type="button"
//               onClick={() => {
//                 onChange(option.value);
//                 setIsOpen(false);
//               }}
//               className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 ${
//                 value === option.value 
//                   ? "bg-blue-50 text-blue-700 font-medium" 
//                   : "text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               {option.label}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ---------------------- Status Badge ---------------------- */
// const StatusBadge = ({ status }) => {
//   if (!status) return null;

//   const variants = {
//     PENDING_REVIEW: {
//       bg: "bg-orange-50",
//       text: "text-orange-700",
//       border: "border-orange-200",
//       dot: "bg-orange-500"
//     },
//     APPROVED: {
//       bg: "bg-emerald-50",
//       text: "text-emerald-700",
//       border: "border-emerald-200",
//       dot: "bg-emerald-500"
//     },
//     REJECTED: {
//       bg: "bg-rose-50",
//       text: "text-rose-700",
//       border: "border-rose-200",
//       dot: "bg-rose-500"
//     },
//     DRAFT: {
//       bg: "bg-slate-50",
//       text: "text-slate-700",
//       border: "border-slate-200",
//       dot: "bg-slate-500"
//     },
//   };

//   const variant = variants[status] || variants.DRAFT;

//   return (
//     <div
//       className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${variant.bg} ${variant.text} ${variant.border}`}
//     >
//       <div className={`w-1.5 h-1.5 rounded-full ${variant.dot}`} />
//       {status.replace("_", " ")}
//     </div>
//   );
// };

// /* ---------------------- Loading Skeleton ---------------------- */
// const ApplicationSkeleton = () => (
//   <div className="animate-pulse">
//     {[...Array(5)].map((_, i) => (
//       <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-200">
//         <div className="h-10 w-10 bg-gray-200 rounded-xl" />
//         <div className="flex-1 space-y-2">
//           <div className="h-4 bg-gray-200 rounded w-1/4" />
//           <div className="h-3 bg-gray-200 rounded w-1/3" />
//         </div>
//         <div className="h-6 bg-gray-200 rounded w-20" />
//         <div className="h-4 bg-gray-200 rounded w-16" />
//       </div>
//     ))}
//   </div>
// );

// /* ---------------------- Document Preview Modal ---------------------- */
// const AdminDocPreviewModal = ({ url, onClose }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   if (!url) return null;

//   const isPDF = url.toLowerCase().endsWith(".pdf");

//   const handleLoad = () => {
//     setLoading(false);
//     setError(null);
//   };

//   const handleError = () => {
//     setLoading(false);
//     setError("Failed to load document");
//   };

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in-0">
//       <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative animate-in zoom-in-95">
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">Document Preview</h3>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-150"
//           >
//             <FiX className="text-gray-500 text-xl" />
//           </button>
//         </div>
        
//         <div className="p-2 relative">
//           {loading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
//               <FiLoader className="animate-spin text-blue-600 text-2xl" />
//             </div>
//           )}
          
//           {error && (
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
//               <div className="text-center text-gray-500">
//                 <FiAlertCircle className="text-2xl mx-auto mb-2" />
//                 <p>{error}</p>
//               </div>
//             </div>
//           )}

//           {isPDF ? (
//             <iframe
//               src={url}
//               className="w-full h-[75vh] rounded-lg border"
//               title="PDF Preview"
//               onLoad={handleLoad}
//               onError={handleError}
//             />
//           ) : (
//             <img
//               src={url}
//               alt="Document Preview"
//               className="h-100 w-100 mx-auto rounded-lg border object-contain"
//               onLoad={handleLoad}
//               onError={handleError}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ---------------------- Confirmation Modal ---------------------- */
// const ConfirmationModal = ({ 
//   isOpen, 
//   onClose, 
//   onConfirm, 
//   title, 
//   message, 
//   confirmText, 
//   confirmVariant = "danger",
//   loading = false 
// }) => {
//   if (!isOpen) return null;

//   const variantClasses = {
//     danger: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-200",
//     success: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-200",
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in-0">
//       <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95">
//         <div className="p-6 border-b border-gray-200">
//           <h3 className="text-xl font-bold text-gray-900">{title}</h3>
//           <p className="text-gray-600 text-sm mt-1">{message}</p>
//         </div>
        
//         <div className="flex gap-3 p-6">
//           <button
//             onClick={onClose}
//             disabled={loading}
//             className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={loading}
//             className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 ${variantClasses[confirmVariant]}`}
//           >
//             {loading ? (
//               <FiLoader className="animate-spin" />
//             ) : null}
//             {confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ---------------------- Main Admin Page ---------------------- */
// export default function AdminSellerApplicationsPage() {
//   const [applications, setApplications] = useState([]);
//   const [loadingList, setLoadingList] = useState(true);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [selectedApp, setSelectedApp] = useState(null);
//   const [loadingDetail, setLoadingDetail] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [rejectModalOpen, setRejectModalOpen] = useState(false);
//   const [rejectRemark, setRejectRemark] = useState("");
//   const [actionLoading, setActionLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);

//   /* ------------ Status Options for Dropdown ------------ */
//   const statusOptions = useMemo(() => [
//     { value: "ALL", label: "All Status" },
//     { value: "PENDING_REVIEW", label: "Pending Review" },
//     { value: "APPROVED", label: "Approved" },
//     { value: "REJECTED", label: "Rejected" },
//     { value: "DRAFT", label: "Draft" },
//   ], []);

//   /* ------------ Enhanced Fetch with Retry Logic ------------ */
//   const fetchApplications = useCallback(async (isRetry = false) => {
//     if (!isRetry) setLoadingList(true);
//     setError(null);

//     try {
//       const res = await Axios({
//         ...SummaryApi.adminListSellerApplications,
//         params: statusFilter !== "ALL" ? { status: statusFilter } : {},
//         timeout: 10000, // 10 second timeout
//       });

//       if (res.data.success) {
//         setApplications(res.data.applications || []);
//         setRetryCount(0); // Reset retry count on success
//       } else {
//         throw new Error(res.data.message || "Failed to load applications");
//       }
//     } catch (err) {
//       console.error("adminListSellerApplications error:", err);
      
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           "Failed to load applications";
      
//       setError(errorMessage);
      
//       if (!isRetry && retryCount < 3) {
//         setRetryCount(prev => prev + 1);
//         toast.error(`Retrying... (${retryCount + 1}/3)`);
//         setTimeout(() => fetchApplications(true), 2000 * retryCount);
//       } else {
//         toast.error(errorMessage);
//       }
//     } finally {
//       setLoadingList(false);
//     }
//   }, [statusFilter, retryCount]);

//   useEffect(() => {
//     fetchApplications();
//   }, [fetchApplications]);

//   /* ------------ Search Filter with Debouncing ------------ */
//   const filteredApplications = useMemo(() => {
//     const s = search.toLowerCase().trim();
//     if (!s) return applications;

//     return applications.filter((app) => {
//       const businessName = app.businessName?.toLowerCase() || "";
//       const userName = app.user?.name?.toLowerCase() || "";
//       const userEmail = app.user?.email?.toLowerCase() || "";

//       return (
//         businessName.includes(s) ||
//         userName.includes(s) ||
//         userEmail.includes(s)
//       );
//     });
//   }, [applications, search]);

//   /* ------------ Enhanced Application Detail Loading ------------ */
//   const loadApplicationDetail = async (id) => {
//     // Toggle detail panel if same application is clicked
//     if (selectedApp?._id === id) {
//       setSelectedApp(null);
//       return;
//     }

//     setLoadingDetail(true);
//     try {
//       const apiConfig = SummaryApi.adminGetSellerApplication(id);
//       const res = await Axios({
//         url: apiConfig.url,
//         method: apiConfig.method,
//         timeout: 8000,
//       });

//       if (res.data.success) {
//         setSelectedApp(res.data.application);
//       } else {
//         throw new Error(res.data.message || "Failed to load application details");
//       }
//     } catch (err) {
//       console.error("adminGetSellerApplication error:", err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           "Failed to load application details";
//       toast.error(errorMessage);
//       setSelectedApp(null); // Close panel on error
//     } finally {
//       setLoadingDetail(false);
//     }
//   };

//   /* ------------ Enhanced Action Handlers ------------ */
//   const handleApprove = async () => {
//     if (!selectedApp) return;
//     setActionLoading(true);

//     try {
//       const res = await Axios({
//         ...SummaryApi.adminApproveSellerApplication,
//         data: { applicationId: selectedApp._id },
//         timeout: 10000,
//       });

//       if (res.data.success) {
//         toast.success("Application approved successfully!");
//         await fetchApplications();
//         await loadApplicationDetail(selectedApp._id);
//       } else {
//         throw new Error(res.data.message || "Failed to approve application");
//       }
//     } catch (err) {
//       console.error("adminApproveSellerApplication error:", err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           "Failed to approve application";
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleReject = async () => {
//     if (!selectedApp) return;
//     if (!rejectRemark.trim()) {
//       toast.error("Please enter a rejection remark");
//       return;
//     }

//     setActionLoading(true);

//     try {
//       const res = await Axios({
//         ...SummaryApi.adminRejectSellerApplication,
//         data: {
//           applicationId: selectedApp._id,
//           remark: rejectRemark.trim(),
//         },
//         timeout: 10000,
//       });

//       if (res.data.success) {
//         toast.success("Application rejected");
//         setRejectModalOpen(false);
//         setRejectRemark("");
//         await fetchApplications();
//         await loadApplicationDetail(selectedApp._id);
//       } else {
//         throw new Error(res.data.message || "Failed to reject application");
//       }
//     } catch (err) {
//       console.error("adminRejectSellerApplication error:", err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           "Failed to reject application";
//       toast.error(errorMessage);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   /* ------------ Stats Calculation ------------ */
//   const stats = useMemo(() => {
//     const total = applications.length;
//     const pending = applications.filter(app => app.status === 'PENDING_REVIEW').length;
//     const approved = applications.filter(app => app.status === 'APPROVED').length;
//     const rejected = applications.filter(app => app.status === 'REJECTED').length;

//     return { total, pending, approved, rejected };
//   }, [applications]);

//   /* ------------ Retry Handler ------------ */
//   const handleRetry = () => {
//     setRetryCount(0);
//     fetchApplications();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
//       {/* Header Section */}
//       <div className="mb-5 bg-gray-200 p-4 rounded-2xl">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               Seller Applications
//             </h1>
//             <p className="text-gray-600">
//               Review and manage seller onboarding requests
//             </p>
//           </div>
          
//           <div className="flex items-center gap-3 mt-4 sm:mt-0">
//             <button
//               onClick={handleRetry}
//               disabled={loadingList}
//               className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
//             >
//               <FiRefreshCw className={`text-sm ${loadingList ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
//           {[
//             { key: 'total', label: 'Total', value: stats.total, icon: FiBriefcase, color: 'blue' },
//             { key: 'pending', label: 'Pending Review', value: stats.pending, icon: FiLoader, color: 'orange' },
//             { key: 'approved', label: 'Approved', value: stats.approved, icon: FiCheckCircle, color: 'emerald' },
//             { key: 'rejected', label: 'Rejected', value: stats.rejected, icon: FiXCircle, color: 'rose' },
//           ].map(({ key, label, value, icon: Icon, color }) => (
//             <div 
//               key={key}
//               className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">{label}</p>
//                   <p className={`text-2xl font-bold text-${color}-600 mt-1`}>
//                     {value}
//                   </p>
//                 </div>
//                 <div className={`p-3 bg-${color}-100 rounded-xl`}>
//                   <Icon className={`text-${color}-600 text-xl`} />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
//         {/* Applications List */}
//         <div className="xl:col-span-2">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//             {/* Filters */}
//             <div className="p-6 border-b border-gray-200">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Search */}
//                 <div className="relative">
//                   <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
//                     placeholder="Search by name, email or business..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                   />
//                 </div>

//                 {/* Status Filter Dropdown */}
//                 <CustomDropdown
//                   options={statusOptions}
//                   value={statusFilter}
//                   onChange={setStatusFilter}
//                   placeholder="Filter by status"
//                   disabled={loadingList}
//                 />
//               </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr className="text-left text-sm font-semibold text-gray-700">
//                     <th className="p-4 pl-6">Seller</th>
//                     <th className="p-4">Business</th>
//                     <th className="p-4">Status</th>
//                     <th className="p-4 pr-6">Created</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {loadingList && <ApplicationSkeleton />}

//                   {error && !loadingList && (
//                     <tr>
//                       <td colSpan="4" className="p-8 text-center">
//                         <div className="flex flex-col items-center justify-center text-gray-500">
//                           <FiAlertCircle className="text-2xl mb-2 text-rose-500" />
//                           <p className="mb-3">{error}</p>
//                           <button
//                             onClick={handleRetry}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//                           >
//                             <FiRefreshCw className="text-sm" />
//                             Try Again
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   )}

//                   {!loadingList && !error && filteredApplications.length === 0 && (
//                     <tr>
//                       <td colSpan="4" className="p-8 text-center text-gray-500">
//                         <FiFileText className="text-3xl mx-auto mb-2 text-gray-300" />
//                         <p>No applications found</p>
//                         {search && (
//                           <p className="text-sm mt-1">
//                             Try adjusting your search criteria
//                           </p>
//                         )}
//                       </td>
//                     </tr>
//                   )}

//                   {!loadingList && !error && filteredApplications.map((app) => (
//                     <tr
//                       key={app._id}
//                       className={`group hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
//                         selectedApp?._id === app._id 
//                           ? 'bg-blue-50 border-l-4 border-l-blue-500' 
//                           : 'border-l-4 border-l-transparent'
//                       }`}
//                       onClick={() => loadApplicationDetail(app._id)}
//                     >
//                       <td className="p-4 pl-6">
//                         <div className="flex items-center gap-3">
//                           <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm shadow-sm">
//                             {app.user?.name?.[0]?.toUpperCase() || "S"}
//                           </div>
//                           <div>
//                             <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
//                               {app.user?.name || "Unknown"}
//                             </p>
//                             <p className="text-sm text-gray-500 flex items-center gap-1">
//                               <FiMail className="text-xs" />
//                               {app.user?.email}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="p-4">
//                         <p className="font-medium text-gray-900">{app.businessName}</p>
//                         <p className="text-xs text-gray-500 capitalize">
//                           {app.businessType?.toLowerCase() || "N/A"}
//                         </p>
//                       </td>

//                       <td className="p-4">
//                         <StatusBadge status={app.status} />
//                       </td>

//                       <td className="p-4 pr-6">
//                         <div className="flex items-center gap-2 text-sm text-gray-500">
//                           <FiCalendar className="text-xs" />
//                           {app.createdAt
//                             ? new Date(app.createdAt).toLocaleDateString('en-US', {
//                                 year: 'numeric',
//                                 month: 'short',
//                                 day: 'numeric'
//                               })
//                             : "-"}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Application Details Panel */}
//         <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${
//           selectedApp ? 'opacity-100' : 'opacity-0'
//         }`}>
//           <div className={`h-full ${selectedApp ? 'block' : 'hidden'}`}>
//             {loadingDetail && (
//               <div className="flex flex-col items-center justify-center py-12 text-gray-500">
//                 <FiLoader className="animate-spin text-blue-600 text-2xl mb-3" />
//                 <p>Loading application details...</p>
//               </div>
//             )}

//             {!loadingDetail && selectedApp && (
//               <div className="h-full flex flex-col">
//                 {/* Header */}
//                 <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex-1">
//                       <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
//                         {selectedApp.businessName}
//                       </h2>
//                       <p className="text-gray-600 flex items-center gap-2 text-sm">
//                         <FiMail className="text-sm" />
//                         {selectedApp.user?.email}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => setSelectedApp(null)}
//                       className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-150 ml-2"
//                     >
//                       <FiX className="text-gray-500 text-lg" />
//                     </button>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <StatusBadge status={selectedApp.status} />
//                     <span className="text-xs text-gray-500">
//                       Applied {selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleDateString() : "-"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Scrollable Content */}
//                 <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
//                   <div className="p-6 space-y-6">
//                     {/* Seller Info */}
//                     <div className="bg-gray-50 rounded-xl p-4">
//                       <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                         <FiUser className="text-blue-600" />
//                         Seller Information
//                       </h3>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Name:</span>
//                           <span className="font-medium">{selectedApp.user?.name || "-"}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Email:</span>
//                           <span className="font-medium">{selectedApp.user?.email || "-"}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Business Info */}
//                     <div className="bg-gray-50 rounded-xl p-4">
//                       <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                         <FiBriefcase className="text-blue-600" />
//                         Business Information
//                       </h3>
//                       <div className="grid grid-cols-1 gap-3 text-sm">
//                         {[
//                           { label: "Business Type", value: selectedApp.businessType },
//                           { label: "GST Number", value: selectedApp.gstNumber },
//                           { label: "PAN Number", value: selectedApp.panNumber },
//                           { label: "Annual Turnover", value: selectedApp.turnover },
//                         ].map(({ label, value }) => (
//                           <div key={label} className="flex justify-between">
//                             <span className="text-gray-600">{label}:</span>
//                             <span className="font-medium text-right">{value || "-"}</span>
//                           </div>
//                         ))}
//                       </div>
//                       {selectedApp.description && (
//                         <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
//                           <strong className="text-sm text-gray-600">Business Description:</strong>
//                           <p className="text-sm text-gray-700 mt-1 leading-relaxed">
//                             {selectedApp.description}
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     {/* Admin Remark */}
//                     {selectedApp.adminRemark && (
//                       <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
//                         <h3 className="font-semibold text-rose-900 mb-2 flex items-center gap-2">
//                           <FiAlertCircle className="text-rose-600" />
//                           Admin Remark
//                         </h3>
//                         <p className="text-sm text-rose-700 leading-relaxed">
//                           {selectedApp.adminRemark}
//                         </p>
//                       </div>
//                     )}

//                     {/* Documents */}
//                     <div className="bg-gray-50 rounded-xl p-4">
//                       <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                         <FiFile className="text-blue-600" />
//                         KYC Documents
//                       </h3>
//                       <div className="grid grid-cols-1 gap-3">
//                         {[
//                           { key: "gstFile", label: "GST Certificate" },
//                           { key: "panFile", label: "PAN Card" },
//                           { key: "addressProof", label: "Address Proof" }
//                         ].map(({ key, label }) => (
//                           <div key={key} className="bg-white rounded-lg border border-gray-200 p-3">
//                             <div className="flex items-center justify-between">
//                               <div>
//                                 <p className="font-medium text-sm text-gray-900">{label}</p>
//                                 <p className="text-xs text-gray-500">
//                                   {selectedApp.documents?.[key] ? "Document uploaded" : "Not uploaded"}
//                                 </p>
//                               </div>
//                               {selectedApp.documents?.[key] && (
//                                 <button
//                                   onClick={() => setPreviewUrl(selectedApp.documents[key])}
//                                   className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-1 shadow-sm"
//                                 >
//                                   <FiEye className="text-sm" />
//                                   View
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 {selectedApp.status === "PENDING_REVIEW" && (
//                   <div className="p-6 border-t border-gray-200 bg-gray-50">
//                     <div className="flex flex-col sm:flex-row gap-3">
//                       <button
//                         onClick={handleApprove}
//                         disabled={actionLoading}
//                         className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
//                       >
//                         {actionLoading ? (
//                           <FiLoader className="animate-spin" />
//                         ) : (
//                           <FiCheckCircle />
//                         )}
//                         Approve Application
//                       </button>
//                       <button
//                         onClick={() => setRejectModalOpen(true)}
//                         disabled={actionLoading}
//                         className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
//                       >
//                         <FiXCircle />
//                         Reject Application
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {selectedApp.status !== "PENDING_REVIEW" && (
//                   <div className="p-6 border-t border-gray-200 bg-gray-50">
//                     <p className="text-sm text-gray-500 text-center">
//                       This application is <strong className="capitalize">
//                         {selectedApp.status.replace("_", " ").toLowerCase()}
//                       </strong>.
//                       {selectedApp.status === "APPROVED" && " No further actions required."}
//                       {selectedApp.status === "REJECTED" && " This application has been rejected."}
//                       {selectedApp.status === "DRAFT" && " This application is still in draft."}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Reject Modal */}
//       <ConfirmationModal
//         isOpen={rejectModalOpen}
//         onClose={() => {
//           setRejectModalOpen(false);
//           setRejectRemark("");
//         }}
//         onConfirm={handleReject}
//         title="Reject Application"
//         message="Please provide a detailed reason for rejection. This will be visible to the seller."
//         confirmText={actionLoading ? "Rejecting..." : "Confirm Reject"}
//         confirmVariant="danger"
//         loading={actionLoading}
//       >
//         <textarea
//           rows="4"
//           className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all duration-200 resize-none mt-4"
//           placeholder="Enter detailed rejection remarks..."
//           value={rejectRemark}
//           onChange={(e) => setRejectRemark(e.target.value)}
//         />
//       </ConfirmationModal>

//       {/* Document Preview Modal */}
//       <AdminDocPreviewModal
//         url={previewUrl}
//         onClose={() => setPreviewUrl(null)}
//       />
//     </div>
//   );
// }

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import Axios from "../utils/network/axios";
import SummaryApi from "../comman/summaryApi";
import { toast } from "react-hot-toast";
import {
  FiSearch,
  FiFilter,
  FiLoader,
  FiUser,
  FiFileText,
  FiEye,
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiCalendar,
  FiMail,
  FiBriefcase,
  FiFile,
  FiAlertCircle,
  FiRefreshCw,
  FiInfo,
} from "react-icons/fi";

/* ---------------------- Custom Dropdown Component ---------------------- */
const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        className={`w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-white flex items-center justify-between text-xs sm:text-sm transition-all duration-200
          ${
            disabled
              ? "opacity-60 cursor-not-allowed"
              : "hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 cursor-pointer"
          } shadow-sm`}
      >
        <span className={selectedOption ? "text-slate-900" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={`text-slate-400 text-sm transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1.5 max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-xs sm:text-sm transition-colors duration-150
                ${
                  value === option.value
                    ? "bg-amber-50 text-amber-800 font-medium"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------------------- Status Badge ---------------------- */
const StatusBadge = ({ status }) => {
  if (!status) return null;

  const variants = {
    PENDING_REVIEW: {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-500",
      label: "Pending",
    },
    APPROVED: {
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      label: "Approved",
    },
    REJECTED: {
      bg: "bg-rose-50",
      text: "text-rose-800",
      border: "border-rose-200",
      dot: "bg-rose-500",
      label: "Rejected",
    },
    DRAFT: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      dot: "bg-slate-500",
      label: "Draft",
    },
  };

  const variant = variants[status] || variants.DRAFT;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${variant.bg} ${variant.text} ${variant.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${variant.dot}`} />
      <span>{variant.label}</span>
    </div>
  );
};

/* ---------------------- Loading Skeleton ---------------------- */
const ApplicationSkeleton = () => (
  <tbody className="animate-pulse">
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="border-b border-slate-100">
        <td className="p-4 pl-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-slate-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-slate-200 rounded w-24" />
              <div className="h-3 bg-slate-200 rounded w-32" />
            </div>
          </div>
        </td>
        <td className="p-4">
          <div className="h-3.5 bg-slate-200 rounded w-24 mb-1" />
          <div className="h-3 bg-slate-200 rounded w-20" />
        </td>
        <td className="p-4">
          <div className="h-5 bg-slate-200 rounded-full w-20" />
        </td>
        <td className="p-4 pr-6">
          <div className="h-3.5 bg-slate-200 rounded w-24" />
        </td>
      </tr>
    ))}
  </tbody>
);

/* ---------------------- Document Preview Modal ---------------------- */
const AdminDocPreviewModal = ({ url, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!url) return null;

  const isPDF = url.toLowerCase().includes(".pdf");

  const handleLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleError = () => {
    setLoading(false);
    setError("Unable to load this document. Try opening it in a new tab.");
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-110 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <FiFile className="text-amber-700 text-sm" />
            </span>
            <div>
              <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">
                Document preview
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                View GST, PAN and address proof documents uploaded by the seller.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-150"
          >
            <FiX className="text-slate-500 text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 p-3 sm:p-4">
          {loading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-dashed border-amber-200">
              <FiLoader className="animate-spin text-amber-600 text-2xl mb-2" />
              <p className="text-xs text-slate-500">Loading document preview…</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-rose-200 px-4">
              <FiAlertCircle className="text-rose-500 text-2xl mb-2" />
              <p className="text-xs sm:text-sm text-slate-600 text-center max-w-xs">
                {error}
              </p>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600 text-white hover:bg-amber-700 transition-colors"
              >
                Open in new tab
              </a>
            </div>
          )}

          <div className="h-[70vh]">
            {isPDF ? (
              <iframe
                src={url}
                className="w-full h-full rounded-lg border border-slate-200 bg-white"
                title="PDF Preview"
                onLoad={handleLoad}
                onError={handleError}
              />
            ) : (
              <img
                src={url}
                alt="Document Preview"
                className="w-full h-full object-contain rounded-lg border border-slate-200 bg-slate-50"
                onLoad={handleLoad}
                onError={handleError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- Confirmation / Action Modal ---------------------- */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmVariant = "danger",
  loading = false,
  children,
}) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: {
      btn: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-200",
      iconWrap: "bg-rose-100 text-rose-700",
    },
    success: {
      btn: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-200",
      iconWrap: "bg-emerald-100 text-emerald-700",
    },
    neutral: {
      btn: "bg-slate-800 hover:bg-slate-900 focus:ring-slate-200",
      iconWrap: "bg-amber-100 text-amber-700",
    },
  };

  const variant = variantClasses[confirmVariant] || variantClasses.danger;

  return (
    <div className="fixed inset-0 bg-black/55 z-110 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-xl w-full shadow-xl border border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-start gap-3">
          <div
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${variant.iconWrap}`}
          >
            {confirmVariant === "danger" && (
              <FiAlertCircle className="text-base" />
            )}
            {confirmVariant === "success" && (
              <FiCheckCircle className="text-base" />
            )}
            {confirmVariant === "neutral" && <FiInfo className="text-base" />}
          </div>
          <div className="flex-1">
            <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">
              {title}
            </h3>
            {message && (
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {message}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FiX className="text-slate-500 text-sm" />
          </button>
        </div>

        {children && <div className="px-5 pt-3 pb-1">{children}</div>}

        <div className="flex gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50 rounded-lg">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-white disabled:opacity-60 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-white rounded-lg text-xs sm:text-sm font-semibold disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-sm focus:ring-2 focus:outline-none ${variant.btn}`}
          >
            {loading && <FiLoader className="animate-spin text-sm" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- Info / Help Modal ---------------------- */
const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onClose}
      title="How seller application review works"
      message="Use this view to check seller details and documents before approving or rejecting their application."
      confirmText="Got it"
      confirmVariant="neutral"
    >
      <div className="space-y-3 text-xs sm:text-sm text-slate-600">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <StatusBadge status="PENDING_REVIEW" />
            <p className="leading-relaxed text-xs sm:text-[13px]">
              Newly submitted or updated applications. Prioritise these to keep
              onboarding fast.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <StatusBadge status="APPROVED" />
            <p className="leading-relaxed text-xs sm:text-[13px]">
              All business and KYC details look genuine. The seller account is
              ready to be activated.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <StatusBadge status="REJECTED" />
            <p className="leading-relaxed text-xs sm:text-[13px]">
              Serious issues, mismatched details or missing documents. Always
              leave a clear remark for the seller.
            </p>
          </div>
        </div>
        <div className="mt-1 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 flex items-start gap-2">
          <FiAlertCircle className="text-amber-600 mt-0.5 text-sm" />
          <p className="text-[11px] sm:text-xs text-amber-900 leading-relaxed">
            Avoid approving applications without checking GST, PAN and address
            proof. When rejecting, add a specific reason so support can assist
            the seller.
          </p>
        </div>
      </div>
    </ConfirmationModal>
  );
};

/* ---------------------- Seller Detail Modal – Tabbed, Compact ---------------------- */
const SellerDetailModal = ({
  isOpen,
  loading,
  application,
  onClose,
  onApprove,
  onOpenRejectModal,
  actionLoading,
  onOpenDocPreview,
}) => {
  const [activeTab, setActiveTab] = useState("seller");
  const app = application;

  useEffect(() => {
    if (isOpen) {
      setActiveTab("seller");
    }
  }, [isOpen, application?._id]); // reset tab when opening or switching app

  if (!isOpen) return null;

  const tabButtonBase =
    "px-1 pb-2 text-xs sm:text-sm font-medium border-b-2 -mb-px transition-colors";
  const tabInactive = "border-transparent text-slate-500 hover:text-slate-800";
  const tabActive = "border-amber-600 text-amber-700";

  return (
    <div className="fixed inset-0 z-105 bg-black/55 flex items-center justify-center px-3 sm:px-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl border border-slate-200 flex flex-col h-122.5">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <FiBriefcase className="text-amber-700 text-base" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h2 className="text-sm sm:text-[15px] font-semibold text-slate-900 truncate">
                {app?.businessName || "Seller application"}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-600 flex items-center gap-1.5">
                <FiUser className="text-[11px]" />
                <span className="truncate">
                  {app?.user?.name || "Unknown seller"}
                </span>
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5">
                <FiMail className="text-[11px]" />
                <span className="truncate">{app?.user?.email || "-"}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {app && (
              <div className="mt-0.5">
                <StatusBadge status={app.status} />
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300  transition-colors"
              disabled={actionLoading || loading}
            >
              <FiX className="text-slate-500 text-sm" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-2 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("seller")}
              className={`${tabButtonBase} ${
                activeTab === "seller" ? tabActive : tabInactive
              }`}
            >
              Seller
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("business")}
              className={`${tabButtonBase} ${
                activeTab === "business" ? tabActive : tabInactive
              }`}
            >
              Business
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className={`${tabButtonBase} ${
                activeTab === "documents" ? tabActive : tabInactive
              }`}
            >
              Documents
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <FiLoader className="animate-spin text-amber-600 text-2xl mb-2" />
            <p className="text-xs sm:text-sm">Loading application details…</p>
          </div>
        )}

        {/* Tab content */}
        {!loading && app && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 text-xs sm:text-sm space-y-4">
              {/* Seller Tab */}
              {activeTab === "seller" && (
                <div className="space-y-4">
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500">
                      <FiCalendar className="text-[11px]" />
                      <span>
                        Applied{" "}
                        {app.createdAt
                          ? new Date(app.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "-"}
                      </span>
                    </div>
                    {app.updatedAt && (
                      <p className="text-[11px] sm:text-xs text-slate-400">
                        Last updated{" "}
                        {new Date(app.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  {/* Seller Info */}
                  <section className="border border-slate-100 rounded-lg p-3.5 sm:p-4 bg-slate-50/70">
                    <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5 text-xs sm:text-sm">
                      <FiUser className="text-amber-600 text-sm" />
                      Seller information
                    </h3>
                    <div className="grid grid-cols-1 gap-1.5 text-xs sm:text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">Name</span>
                        <span className="font-medium text-slate-900 text-right">
                          {app.user?.name || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">Email</span>
                        <span className="font-medium text-slate-900 text-right truncate max-w-55 sm:max-w-65">
                          {app.user?.email || "-"}
                        </span>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* Business Tab */}
              {activeTab === "business" && (
                <div className="space-y-4">
                  <section className="border border-slate-100 rounded-lg p-3.5 sm:p-4 bg-white">
                    <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5 text-xs sm:text-sm">
                      <FiBriefcase className="text-amber-600 text-sm" />
                      Business information
                    </h3>
                    <div className="grid grid-cols-1 gap-1.5 text-xs sm:text-sm">
                      {[
                        {
                          label: "Business type",
                          value: app.businessType,
                        },
                        {
                          label: "GST number",
                          value: app.gstNumber,
                        },
                        {
                          label: "PAN number",
                          value: app.panNumber,
                        },
                        {
                          label: "Annual turnover",
                          value: app.turnover,
                        },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex justify-between gap-3"
                        >
                          <span className="text-slate-500">{label}</span>
                          <span className="font-medium text-slate-900 text-right">
                            {value || "-"}
                          </span>
                        </div>
                      ))}
                    </div>

                    {app.description && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                          Business description
                        </p>
                        <p className="text-xs sm:text-sm text-slate-800 mt-1 leading-relaxed">
                          {app.description}
                        </p>
                      </div>
                    )}
                  </section>

                  {app.adminRemark && (
                    <section className="border border-rose-100 rounded-lg p-3.5 sm:p-4 bg-rose-50">
                      <h3 className="font-semibold text-rose-900 mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                        <FiAlertCircle className="text-rose-600 text-sm" />
                        Admin remark
                      </h3>
                      <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
                        {app.adminRemark}
                      </p>
                    </section>
                  )}
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <section className="border border-slate-100 rounded-lg p-3.5 sm:p-4 bg-white">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5 text-xs sm:text-sm">
                    <FiFile className="text-amber-600 text-sm" />
                    KYC documents
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { key: "gstFile", label: "GST certificate" },
                      { key: "panFile", label: "PAN card" },
                      { key: "addressProof", label: "Address proof" },
                    ].map(({ key, label }) => {
                      const hasFile = !!app.documents?.[key];
                      return (
                        <div
                          key={key}
                          className="bg-slate-50 rounded-lg border border-slate-100 px-3 py-2.5 flex items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5">
                            <p className="font-medium text-xs sm:text-sm text-slate-900">
                              {label}
                            </p>
                            <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  hasFile ? "bg-emerald-500" : "bg-slate-300"
                                }`}
                              />
                              {hasFile
                                ? "Document uploaded"
                                : "Not uploaded"}
                            </p>
                          </div>
                          {hasFile && (
                            <button
                              type="button"
                              onClick={() =>
                                onOpenDocPreview(app.documents[key])
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white text-[11px] sm:text-xs rounded-lg hover:bg-amber-700 transition-all shadow-sm"
                            >
                              <FiEye className="text-xs" />
                              View
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 rounded-lg">
              <p className="text-[11px] sm:text-xs text-slate-500">
                Status:{" "}
                <span className="font-medium text-slate-700">
                  {app.status
                    ? app.status.replace("_", " ").toLowerCase()
                    : "-"}
                </span>
              </p>

              {app.status === "PENDING_REVIEW" ? (
                <div className="flex gap-2.5">
                  <button
                    onClick={onOpenRejectModal}
                    disabled={actionLoading}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-rose-700 disabled:opacity-60 transition-all shadow-sm"
                  >
                    <FiXCircle className="text-xs" />
                    Reject
                  </button>
                  <button
                    onClick={onApprove}
                    disabled={actionLoading}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-all shadow-sm"
                  >
                    {actionLoading ? (
                      <FiLoader className="animate-spin text-xs" />
                    ) : (
                      <FiCheckCircle className="text-xs" />
                    )}
                    Approve
                  </button>
                </div>
              ) : (
                <p className="text-[11px] sm:text-xs text-slate-500 text-right flex-1">
                  {app.status === "APPROVED" &&
                    "This application is approved. No further action is required."}
                  {app.status === "REJECTED" &&
                    "This application is rejected. The seller has been notified."}
                  {app.status === "DRAFT" &&
                    "The seller is still completing their details."}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ---------------------- Main Admin Page ---------------------- */
export default function AdminSellerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedApp, setSelectedApp] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectRemark, setRejectRemark] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);

  /* ------------ Status Options for Dropdown ------------ */
  const statusOptions = useMemo(
    () => [
      { value: "ALL", label: "All statuses" },
      { value: "PENDING_REVIEW", label: "Pending review" },
      { value: "APPROVED", label: "Approved" },
      { value: "REJECTED", label: "Rejected" },
      { value: "DRAFT", label: "Draft" },
    ],
    []
  );

  /* ------------ Debounced Search ------------ */
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase());
    }, 250);
    return () => clearTimeout(id);
  }, [searchInput]);

  /* ------------ Enhanced Fetch with Retry Logic ------------ */
  const fetchApplications = useCallback(
    async (isRetry = false) => {
      if (!isRetry) setLoadingList(true);
      setError(null);

      try {
        const res = await Axios({
          ...SummaryApi.adminListSellerApplications,
          params: statusFilter !== "ALL" ? { status: statusFilter } : {},
          timeout: 10000,
        });

        if (res.data?.success) {
          setApplications(res.data.applications || []);
          setRetryCount(0);
        } else {
          throw new Error(res.data?.message || "Failed to load applications");
        }
      } catch (err) {
        console.error("adminListSellerApplications error:", err);

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load applications";

        setError(errorMessage);

        if (!isRetry && retryCount < 3) {
          const nextRetry = retryCount + 1;
          setRetryCount(nextRetry);
          toast.error(`Retrying… (${nextRetry}/3)`);
          setTimeout(() => fetchApplications(true), 1500 * nextRetry);
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setLoadingList(false);
      }
    },
    [statusFilter, retryCount]
  );

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  /* ------------ Search Filter ------------ */
  const filteredApplications = useMemo(() => {
    if (!debouncedSearch) return applications;

    return applications.filter((app) => {
      const businessName = app.businessName?.toLowerCase() || "";
      const userName = app.user?.name?.toLowerCase() || "";
      const userEmail = app.user?.email?.toLowerCase() || "";

      return (
        businessName.includes(debouncedSearch) ||
        userName.includes(debouncedSearch) ||
        userEmail.includes(debouncedSearch)
      );
    });
  }, [applications, debouncedSearch]);

  /* ------------ Application Detail Loading (for modal) ------------ */
  const loadApplicationDetail = async (id) => {
    if (!id) return;

    if (selectedApp?._id === id && detailModalOpen && !loadingDetail) {
      setDetailModalOpen(false);
      setSelectedApp(null);
      return;
    }

    setDetailModalOpen(true);
    setLoadingDetail(true);
    try {
      const apiConfig = SummaryApi.adminGetSellerApplication(id);
      const res = await Axios({
        url: apiConfig.url,
        method: apiConfig.method,
        timeout: 10000,
      });

      if (res.data?.success) {
        setSelectedApp(res.data.application);
      } else {
        throw new Error(
          res.data?.message || "Failed to load application details"
        );
      }
    } catch (err) {
      console.error("adminGetSellerApplication error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load application details";
      toast.error(errorMessage);
      setSelectedApp(null);
      setDetailModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  /* ------------ Action Handlers ------------ */
  const handleApprove = async () => {
    if (!selectedApp?._id) return;
    setActionLoading(true);

    try {
      const res = await Axios({
        ...SummaryApi.adminApproveSellerApplication,
        data: { applicationId: selectedApp._id },
        timeout: 10000,
      });

      if (res.data?.success) {
        toast.success("Application approved successfully.");
        await fetchApplications();
        await loadApplicationDetail(selectedApp._id);
      } else {
        throw new Error(res.data?.message || "Failed to approve application");
      }
    } catch (err) {
      console.error("adminApproveSellerApplication error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to approve application";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp?._id) return;
    if (!rejectRemark.trim()) {
      toast.error("Please enter a rejection remark.");
      return;
    }

    setActionLoading(true);

    try {
      const res = await Axios({
        ...SummaryApi.adminRejectSellerApplication,
        data: {
          applicationId: selectedApp._id,
          remark: rejectRemark.trim(),
        },
        timeout: 10000,
      });

      if (res.data?.success) {
        toast.success("Application rejected.");
        setRejectModalOpen(false);
        setRejectRemark("");
        await fetchApplications();
        await loadApplicationDetail(selectedApp._id);
      } else {
        throw new Error(res.data?.message || "Failed to reject application");
      }
    } catch (err) {
      console.error("adminRejectSellerApplication error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to reject application";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  /* ------------ Stats Calculation ------------ */
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(
      (app) => app.status === "PENDING_REVIEW"
    ).length;
    const approved = applications.filter(
      (app) => app.status === "APPROVED"
    ).length;
    const rejected = applications.filter(
      (app) => app.status === "REJECTED"
    ).length;

    return { total, pending, approved, rejected };
  }, [applications]);

  /* ------------ Retry Handler ------------ */
  const handleRetry = () => {
    setRetryCount(0);
    fetchApplications();
  };

  /* ------------ Stat Cards Config ------------ */
  const statCards = [
    {
      key: "total",
      label: "Total",
      value: stats.total,
      icon: FiBriefcase,
      statusValue: "ALL",
      textClass: "text-slate-900",
      bgIcon: "bg-amber-100",
      borderActive: "border-amber-600",
      surface: "bg-white",
    },
    {
      key: "pending",
      label: "Pending",
      value: stats.pending,
      icon: FiLoader,
      statusValue: "PENDING_REVIEW",
      textClass: "text-amber-800",
      bgIcon: "bg-amber-100",
      borderActive: "border-amber-600",
      surface: "bg-amber-50",
    },
    {
      key: "approved",
      label: "Approved",
      value: stats.approved,
      icon: FiCheckCircle,
      statusValue: "APPROVED",
      textClass: "text-emerald-700",
      bgIcon: "bg-emerald-100",
      borderActive: "border-emerald-600",
      surface: "bg-emerald-50",
    },
    {
      key: "rejected",
      label: "Rejected",
      value: stats.rejected,
      icon: FiXCircle,
      statusValue: "REJECTED",
      textClass: "text-rose-700",
      bgIcon: "bg-rose-100",
      borderActive: "border-rose-600",
      surface: "bg-rose-50",
    },
  ];

  return (
    <div className="min-h-screen px-3 sm:px-4 py-4 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">
        {/* Header Section */}
        <div className="bg-white border border-slate-200 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 border border-amber-100">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                  <FiBriefcase className="text-amber-700 text-xs" />
                </span>
                <p className="text-[11px] sm:text-xs font-medium text-amber-800">
                  Admin · Seller onboarding
                </p>
              </div>
              <div>
                <h1 className="text-[18px] sm:text-[20px] font-semibold text-slate-900 tracking-tight mt-1">
                  Seller applications
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Review and act on seller KYC applications with a focused,
                  corporate workflow.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setInfoOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-100 text-[11px] sm:text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 transition-all"
              >
                <FiInfo className="text-xs" />
                Guide
              </button>

              <button
                onClick={handleRetry}
                disabled={loadingList}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 text-[11px] sm:text-xs font-medium text-slate-800 bg-white hover:bg-slate-50 disabled:opacity-60 transition-all"
              >
                <FiRefreshCw
                  className={`text-xs ${
                    loadingList ? "animate-spin" : ""
                  }`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {statCards.map(
              ({
                key,
                label,
                value,
                icon: Icon,
                statusValue,
                textClass,
                bgIcon,
                borderActive,
                surface,
              }) => {
                const isActive = statusFilter === statusValue;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatusFilter(statusValue)}
                    className={`
                      text-left rounded-2xl px-3.5 py-3 sm:px-4 sm:py-3.5
                      border transition-all duration-150 shadow-sm hover:shadow-md
                      flex flex-col gap-2 focus:outline-none focus:ring-2 focus:ring-amber-200
                      ${
                        isActive
                          ? `${borderActive} ring-1 ring-amber-200`
                          : "border-slate-200 hover:border-amber-200"
                      }
                      ${surface}
                    `}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] sm:text-xs font-medium text-slate-600">
                        {label}
                      </p>
                      <div
                        className={`p-2 rounded-lg ${bgIcon} flex items-center justify-center`}
                      >
                        <Icon className={`${textClass} text-xs sm:text-sm`} />
                      </div>
                    </div>
                    <p
                      className={`text-lg sm:text-xl font-semibold leading-tight ${textClass}`}
                    >
                      {value}
                    </p>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Main Content – Applications List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Filters */}
          <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <FiFilter className="text-xs text-amber-700" />
                Filters
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {filteredApplications.length} result
                {filteredApplications.length !== 1 && "s"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  placeholder="Search by seller name, email, or business…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>

              {/* Status Filter Dropdown */}
              <CustomDropdown
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by status"
                disabled={loadingList}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-left text-[11px] sm:text-xs font-semibold text-slate-500">
                  <th className="p-3 sm:p-4 pl-4 sm:pl-6">Seller</th>
                  <th className="p-3 sm:p-4">Business</th>
                  <th className="p-3 sm:p-4">Status</th>
                  <th className="p-3 sm:p-4 pr-4 sm:pr-6">Created</th>
                </tr>
              </thead>

              {loadingList ? (
                <ApplicationSkeleton />
              ) : (
                <tbody className="divide-y divide-slate-100">
                  {error && !loadingList && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                          <FiAlertCircle className="text-xl mb-1 text-rose-500" />
                          <p className="text-xs sm:text-sm">{error}</p>
                          <button
                            onClick={handleRetry}
                            className="mt-2 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                          >
                            <FiRefreshCw className="text-xs" />
                            Try again
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {!error && filteredApplications.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-8 text-center text-slate-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <FiFileText className="text-3xl text-slate-300" />
                          <p className="text-xs sm:text-sm">
                            No applications found
                          </p>
                          {debouncedSearch && (
                            <p className="text-[11px] sm:text-xs text-slate-400">
                              Try adjusting your search or filters.
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}

                  {!error &&
                    filteredApplications.map((app) => (
                      <tr
                        key={app._id}
                        className={`group cursor-pointer transition-colors duration-150 ${
                          selectedApp?._id === app._id && detailModalOpen
                            ? "bg-amber-50"
                            : "hover:bg-slate-50"
                        }`}
                        onClick={() => loadApplicationDetail(app._id)}
                      >
                        {/* Seller */}
                        <td className="p-3 sm:p-4 pl-4 sm:pl-6">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg bg-amber-600 text-white font-semibold text-xs shadow-sm">
                              {app.user?.name?.[0]?.toUpperCase() || "S"}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-medium text-xs sm:text-sm text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                                {app.user?.name || "Unknown"}
                              </p>
                              <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1">
                                <FiMail className="text-[10px]" />
                                <span className="truncate max-w-35 sm:max-w-55">
                                  {app.user?.email}
                                </span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Business */}
                        <td className="p-3 sm:p-4 align-top">
                          <p className="text-xs sm:text-sm font-medium text-slate-900 line-clamp-1">
                            {app.businessName || "-"}
                          </p>
                          <p className="text-[11px] text-slate-500 capitalize mt-0.5">
                            {app.businessType?.toLowerCase() || "N/A"}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="p-3 sm:p-4 align-top">
                          <StatusBadge status={app.status} />
                        </td>

                        {/* Created */}
                        <td className="p-3 sm:p-4 pr-4 sm:pr-6 align-top">
                          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500">
                            <FiCalendar className="text-[11px]" />
                            {app.createdAt
                              ? new Date(app.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "-"}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Seller Detail Modal */}
      <SellerDetailModal
        isOpen={detailModalOpen}
        loading={loadingDetail}
        application={selectedApp}
        onClose={() => {
          if (actionLoading) return;
          setDetailModalOpen(false);
          setSelectedApp(null);
        }}
        onApprove={handleApprove}
        onOpenRejectModal={() => setRejectModalOpen(true)}
        actionLoading={actionLoading}
        onOpenDocPreview={(url) => setPreviewUrl(url)}
      />

      {/* Reject Modal */}
      <ConfirmationModal
        isOpen={rejectModalOpen}
        onClose={() => {
          if (actionLoading) return;
          setRejectModalOpen(false);
          setRejectRemark("");
        }}
        onConfirm={handleReject}
        title="Reject application"
        message="Add a clear reason for rejection. This will be visible to the seller and used by support."
        confirmText={actionLoading ? "Rejecting…" : "Confirm rejection"}
        confirmVariant="danger"
        loading={actionLoading}
      >
        <textarea
          rows="4"
          className="w-full px-3 py-2.5 border border-rose-200 rounded-lg text-xs sm:text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all resize-none bg-rose-50 placeholder:text-rose-300"
          placeholder="Example: PAN details do not match the business name. Please upload a valid, readable PAN card."
          value={rejectRemark}
          onChange={(e) => setRejectRemark(e.target.value)}
        />
      </ConfirmationModal>

      {/* Info Modal */}
      <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} />

      {/* Document Preview Modal */}
      <AdminDocPreviewModal
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </div>
  );
}

