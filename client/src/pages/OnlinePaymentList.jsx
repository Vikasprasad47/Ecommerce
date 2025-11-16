// import React, { useMemo, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { format, parseISO } from 'date-fns'
// import { 
//   FaCheckCircle, 
//   FaSearch, 
//   FaFilter, 
//   FaDownload, 
//   FaRupeeSign,
//   FaUser,
//   FaCalendarAlt,
//   FaReceipt,
//   FaEye,
//   FaFileExport,
//   FaSortAmountDown,
//   FaTimes
// } from 'react-icons/fa'
// import { FiPackage, FiMail, FiDollarSign } from 'react-icons/fi'
// import { PiPackageFill } from "react-icons/pi";
// import { MdPayment } from "react-icons/md";
// import { MdAssignment } from "react-icons/md";
// import { LuLayoutGrid } from "react-icons/lu";
// import { IoList } from "react-icons/io5";


// const OnlinePaymentList = () => {
//   const orders = useSelector(state => state.orders.order) || []
//   const [search, setSearch] = useState('')
//   const [statusFilter, setStatusFilter] = useState('all')
//   const [dateRange, setDateRange] = useState({ start: '', end: '' })
//   const [sortBy, setSortBy] = useState('date')
//   const [sortOrder, setSortOrder] = useState('desc')
//   const [selectedOrder, setSelectedOrder] = useState(null)
//   const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

//   // Enhanced filtering and sorting
//   const onlinePaidOrders = useMemo(() => {
//     let filtered = orders.filter(order => order.payment_status === 'paid')

//     // Search filter
//     if (search) {
//       filtered = filtered.filter(order =>
//         order.orderId.toLowerCase().includes(search.toLowerCase()) ||
//         (order.userId?.name || '').toLowerCase().includes(search.toLowerCase()) ||
//         (order.userId?.email || '').toLowerCase().includes(search.toLowerCase()) ||
//         order.paymentId?.toLowerCase().includes(search.toLowerCase())
//       )
//     }

//     // Date range filter
//     if (dateRange.start && dateRange.end) {
//       filtered = filtered.filter(order => {
//         const orderDate = new Date(order.createdAt)
//         const startDate = new Date(dateRange.start)
//         const endDate = new Date(dateRange.end)
//         endDate.setHours(23, 59, 59, 999)
//         return orderDate >= startDate && orderDate <= endDate
//       })
//     }

//     // Sorting
//     filtered.sort((a, b) => {
//       let aValue, bValue
      
//       switch (sortBy) {
//         case 'amount':
//           aValue = a.totalAmt
//           bValue = b.totalAmt
//           break
//         case 'user':
//           aValue = a.userId?.name || ''
//           bValue = b.userId?.name || ''
//           break
//         case 'items':
//           aValue = a.items.length
//           bValue = b.items.length
//           break
//         default: // date
//           aValue = new Date(a.createdAt)
//           bValue = new Date(b.createdAt)
//       }

//       if (sortOrder === 'asc') {
//         return aValue > bValue ? 1 : -1
//       } else {
//         return aValue < bValue ? 1 : -1
//       }
//     })

//     return filtered
//   }, [orders, search, dateRange, sortBy, sortOrder])

//   // Statistics
//   const stats = useMemo(() => {
//     const totalAmount = onlinePaidOrders.reduce((sum, order) => sum + order.totalAmt, 0)
//     const averageOrderValue = onlinePaidOrders.length > 0 ? totalAmount / onlinePaidOrders.length : 0
//     const totalItems = onlinePaidOrders.reduce((sum, order) => sum + order.items.length, 0)

//     return {
//       totalOrders: onlinePaidOrders.length,
//       totalAmount,
//       averageOrderValue,
//       totalItems
//     }
//   }, [onlinePaidOrders])

//   const exportToCSV = () => {
//     const headers = ['Order ID', 'User', 'Email', 'Amount', 'Payment ID', 'Date', 'Items Count']
//     const csvData = onlinePaidOrders.map(order => [
//       order.orderId,
//       order.userId?.name || 'N/A',
//       order.userId?.email || 'N/A',
//       order.totalAmt,
//       order.paymentId,
//       format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm'),
//       order.items.length
//     ])

//     const csvContent = [headers, ...csvData]
//       .map(row => row.map(field => `"${field}"`).join(','))
//       .join('\n')

//     const blob = new Blob([csvContent], { type: 'text/csv' })
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = `online-payments-${format(new Date(), 'yyyy-MM-dd')}.csv`
//     a.click()
//     window.URL.revokeObjectURL(url)
//   }

//   const OrderDetailModal = ({ order, onClose }) => (
//     <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-green-300/30 border-b border-gray-200 p-5 rounded-t-2xl">
//           <div className="flex justify-between items-center">
//             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <MdAssignment size={25}/>
//                 Order Details
//             </h3>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer hover:text-red-600"
//             >
//               <FaTimes className="text-gray-500" />
//             </button>
//           </div>
//         </div>

//         <div className="p-6 space-y-3">
//           {/* Order Header */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Order ID</p>
//               <p className="font-semibold text-gray-900">{order.orderId}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Date</p>
//               <p className="font-semibold text-gray-900">
//                 {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}
//               </p>
//             </div>
//           </div>

//           {/* User Info */}
//           <div className="bg-gray-100 rounded-xl p-4">
//             <h4 className="font-semibold text-gray-900 mb-1">Customer Information</h4>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">Name</p>
//                 <p className="font-medium text-gray-900">{order.userId?.name || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Email</p>
//                 <p className="font-medium text-gray-900">{order.userId?.email || 'N/A'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Payment Info */}
//           <div className="bg-green-50 rounded-xl p-4 border border-green-200">
//             <h4 className="font-semibold text-gray-900 mb-2">Payment Information</h4>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Payment ID</p>
//                 <p className="font-medium text-gray-900 break-all"><a href="#" className="hover:text-blue-600 hover:underline">{order.paymentId}</a></p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm text-gray-500">Amount Paid</p>
//                 <p className="text-2xl font-bold text-green-600">₹{order.totalAmt}</p>
//               </div>
//             </div>
//           </div>

//           {/* Items List */}
//           <div>
//             <h4 className="font-semibold text-gray-900 mb-2">Order Items ({order.items.length})</h4>
//             <div className="space-y-3">
//               {order.items.map((item, idx) => (
//                 <div key={idx} className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-xl">
//                   <img
//                     src={item.product_details?.image?.[0] || '/no-image.png'}
//                     alt={item.product_details?.name}
//                     className="w-16 h-16 rounded-lg object-cover"
//                   />
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-900">{item.product_details?.name}</p>
//                     <div className="flex gap-4 text-sm text-gray-600">
//                       <span>Qty: {item.quantity}</span>
//                       <span>Price: ₹{item.pricePerUnit}</span>
//                       <span>Total: ₹{item.totalAmt}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto p-4">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-6 mb-4 shadow-sm">
//           <div>
//             <h1 className="text-xl font-bold text-gray-900 mb-1">Online Payments Management</h1>
//             <p className="text-gray-600 mt-2 text-sm">Manage and track all online payment transactions</p>
//           </div>
//           <button
//             onClick={exportToCSV}
//             className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
//           >
//             <FaFileExport />
//             Export CSV
//           </button>
//         </div>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
//           <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-xl">
//                 <FiPackage className="text-blue-600 text-xl" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//                 <p className="text-2xl font-bold text-gray-900">₹{stats.totalAmount.toFixed(2)}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-xl">
//                 <FiDollarSign className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Average Order</p>
//                 <p className="text-2xl font-bold text-gray-900">₹{stats.averageOrderValue.toFixed(2)}</p>
//               </div>
//               <div className="p-3 bg-amber-100 rounded-xl">
//                 <FaRupeeSign className="text-amber-600 text-xl" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Items</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
//               </div>
//               <div className="p-3 bg-purple-100 rounded-xl">
//                 <PiPackageFill  className="text-purple-600 text-xl" />
//               </div>
//             </div>
//           </div>
//         </div>

        
//         {/* Filters and Controls */}
// <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-4">
//   <div className="flex flex-col gap-3 mb-4">
//     {/* Left Section - Search and Date Range */}
//     <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
//       {/* Search */}
//       <div className="relative">
//         <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search orders..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="cursor-pointer w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
//         />
//       </div>

//       {/* Date Range */}
//       <div className="grid grid-cols-2 gap-3">
//         <div className="relative">
//           <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
//           <input
//             type="date"
//             value={dateRange.start}
//             onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
//             className="cursor-pointer w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
//           />
//         </div>
//         <div className="relative">
//           <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
//           <input
//             type="date"
//             value={dateRange.end}
//             onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
//             className="cursor-pointer w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
//           />
//         </div>
//       </div>
//     </div>

//     {/* Right Section - Sort Controls */}
//     <div className="flex flex-col sm:flex-row gap-4">
//       {/* Sort By */}
//       <div className="relative flex-1">
//         <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//         <select
//           value={sortBy}
//           onChange={e => setSortBy(e.target.value)}
//           className="cursor-pointer w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none bg-white"
//         >
//           <option value="date">Sort by Date</option>
//           <option value="amount">Sort by Amount</option>
//           <option value="user">Sort by User</option>
//           <option value="items">Sort by Items</option>
//         </select>
//       </div>

//       {/* Sort Order */}
//       <div className="relative flex-1">
//         <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//         <select
//           value={sortOrder}
//           onChange={e => setSortOrder(e.target.value)}
//           className="cursor-pointer w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none bg-white"
//         >
//           <option value="desc">Newest First</option>
//           <option value="asc">Oldest First</option>
//         </select>
//       </div>
//     </div>
//   </div>

//   {/* Bottom Section - Results and View Toggle */}
//   <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
//     {/* Results Count */}
//     <div className="flex items-center gap-2 text-gray-600">
//       <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
//       <p className="text-sm">
//         Showing <span className="font-semibold text-amber-600">{onlinePaidOrders.length}</span> orders
//         {search && (
//           <span className="ml-2">
//             for "<span className="font-medium text-gray-900">{search}</span>"
//           </span>
//         )}
//       </p>
//     </div>

//     {/* View Toggle */}
//     <div className="flex items-center gap-3">
//         <span className="text-sm text-gray-500 font-medium">View:</span>
//         <div className="flex bg-gray-200 rounded-xl p-1">
//             <button
//             onClick={() => setViewMode('grid')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
//                 viewMode === 'grid' 
//                 ? 'bg-white text-amber-600 shadow-sm border border-amber-200' 
//                 : 'text-gray-700 hover:text-gray-900'
//             }`}
//             >
//                 {
//                     viewMode === 'grid' ? <LuLayoutGrid className="text-md"/> : <LuLayoutGrid className="text-md"/>
//                 }
//                 Grid
//             </button>
//             <button
//             onClick={() => setViewMode('list')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
//                 viewMode === 'list' 
//                 ? 'bg-white text-amber-600 shadow-sm border border-amber-200' 
//                 : 'text-gray-700 hover:text-gray-900'
//             }`}
//             >
//                 {
//                     viewMode === 'list' ? <IoList className="text-md"/> : <IoList className="text-md"/>
//                 }
//                 List
//             </button>
//         </div>
//     </div>
//   </div>

//   {/* Active Filters Display */}
//   {(search || dateRange.start || dateRange.end) && (
//     <div className="mt-4 pt-4 border-t border-gray-100">
//       <div className="flex items-center gap-2 flex-wrap">
//         <span className="text-sm text-gray-500 font-medium">Active filters:</span>
        
//         {search && (
//           <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
//             Search: "{search}"
//             <button 
//               onClick={() => setSearch('')}
//               className="hover:text-amber-900 transition-colors"
//             >
//               <FaTimes size={12} />
//             </button>
//           </span>
//         )}
        
//         {dateRange.start && (
//           <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//             From: {dateRange.start}
//             <button 
//               onClick={() => setDateRange(prev => ({ ...prev, start: '' }))}
//               className="hover:text-blue-900 transition-colors"
//             >
//               <FaTimes size={12} />
//             </button>
//           </span>
//         )}
        
//         {dateRange.end && (
//           <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//             To: {dateRange.end}
//             <button 
//               onClick={() => setDateRange(prev => ({ ...prev, end: '' }))}
//               className="hover:text-blue-900 transition-colors"
//             >
//               <FaTimes size={12} />
//             </button>
//           </span>
//         )}
        
//         {(search || dateRange.start || dateRange.end) && (
//           <button 
//             onClick={() => {
//               setSearch('')
//               setDateRange({ start: '', end: '' })
//             }}
//             className="text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
//           >
//             Clear all
//           </button>
//         )}
//       </div>
//     </div>
//   )}
// </div>

//         {/* Orders Grid/List */}
//         {onlinePaidOrders.length === 0 ? (
//           <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
//             <div className="mb-4 flex items-center justify-center"><MdPayment size={100}/></div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No online payments found</h3>
//             <p className="text-gray-600">Try adjusting your search or filter criteria</p>
//           </div>
//         ) : viewMode === 'grid' ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3">
//             {onlinePaidOrders.map(order => (
//               <div
//                 key={order._id}
//                 className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
//               >
//                 {/* Header */}
//                 <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white relative">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="font-bold text-lg">{order.orderId}</h3>
//                       <p className="text-green-100 text-sm">
//                         {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}
//                       </p>
//                     </div>
//                     <span className="flex absolute top-3 right-0 items-center gap-1 bg-white text-green-600 px-2 py-1 rounded-tl-full rounded-bl-full text-sm font-semibold">
//                       <FaCheckCircle /> Paid
//                     </span>
//                   </div>
//                 </div>

//                 {/* Content */}
//                 <div className="p-4">
//                   {/* Customer Info */}
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
//                       <FaUser className="text-amber-600" />
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900">{order.userId?.name || 'N/A'}</p>
//                       <p className="text-sm text-gray-600">{order.userId?.email || 'N/A'}</p>
//                     </div>
//                   </div>

//                   {/* Payment Details */}
//                   <div className="space-y-2 mb-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Amount:</span>
//                       <span className="text-xl font-bold text-green-600">₹{order.totalAmt}</span>
//                     </div>
//                     <div className="text-sm">
//                       <p className="text-gray-600 truncate">
//                         <span className="font-medium">Payment ID:</span> {order.paymentId}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Items Preview */}
//                   <div className="border-t pt-3">
//                     <p className="text-sm text-gray-600 mb-2">
//                       {order.items.length} item{order.items.length !== 1 ? 's' : ''}
//                     </p>
//                     <div className="flex gap-2">
//                       {order.items.slice(0, 3).map((item, idx) => (
//                         <img
//                           key={idx}
//                           src={item.product_details?.image?.[0] || '/no-image.png'}
//                           alt={item.product_details?.name}
//                           className="w-8 h-8 rounded-lg object-cover border"
//                         />
//                       ))}
//                       {order.items.length > 3 && (
//                         <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-600 border">
//                           +{order.items.length - 3}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Action Button */}
//                   <button
//                     onClick={() => setSelectedOrder(order)}
//                     className="cursor-pointer w-full mt-4 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
//                   >
//                     <FaEye />
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           /* List View */
//           <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//             {onlinePaidOrders.map((order, index) => (
//               <div
//                 key={order._id}
//                 className={`p-6 hover:bg-gray-50 transition-colors ${
//                   index !== onlinePaidOrders.length - 1 ? 'border-b border-gray-200' : ''
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4 flex-1">
//                     <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                       <FaReceipt className="text-green-600 text-xl" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-1">
//                         <h3 className="font-bold text-gray-900">{order.orderId}</h3>
//                         <span className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
//                           <FaCheckCircle /> Paid
//                         </span>
//                       </div>
//                       <p className="text-gray-600 text-sm">
//                         {order.userId?.name} • {order.userId?.email} • {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-xl font-bold text-green-600 mb-1">₹{order.totalAmt}</p>
//                     <p className="text-sm text-gray-600">{order.items.length} items</p>
//                   </div>
//                   <button
//                     onClick={() => setSelectedOrder(order)}
//                     className="ml-4 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium cursor-pointer"
//                   >
//                     View
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Order Detail Modal */}
//       {selectedOrder && (
//         <OrderDetailModal 
//           order={selectedOrder} 
//           onClose={() => setSelectedOrder(null)} 
//         />
//       )}
//     </div>
//   )
// }

// export default OnlinePaymentList

// pages/OnlinePaymentList.jsx
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import {
  FiSearch,
  FiRefreshCw,
  FiFilter,
  FiCalendar,
  FiDownload,
  FiEye,
  FiGrid,
  FiList,
  FiAlertCircle,
  FiTrendingUp,
  FiDollarSign,
  FiPackage,
  FiX,
  FiInfo,
  FiUser,
  FiMail,
} from "react-icons/fi";
import { PiPackageFill } from "react-icons/pi";
import { MdPayment } from "react-icons/md";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

/* ---------------------- Payment Status Badge ---------------------- */
const PaymentStatusBadge = () => (
  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium bg-emerald-50 text-emerald-800 border-emerald-200">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
    <span>Paid · Online</span>
  </div>
);

/* ---------------------- Info / Guide Modal ---------------------- */
const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/55 z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-xl w-full shadow-xl border border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-start gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <MdPayment className="text-base" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">
              How online payment tracking works
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Use this screen to monitor completed online payments, export
              reports and drill into order-level payment details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FiX className="text-slate-500 text-sm" />
          </button>
        </div>

        <div className="px-5 pt-3 pb-4 space-y-3 text-xs sm:text-sm text-slate-600">
          <ul className="list-disc list-inside space-y-1.5">
            <li>
              Only orders with{" "}
              <span className="font-medium">payment_status = paid</span> are
              listed here.
            </li>
            <li>
              Use the search box to find orders by{" "}
              <span className="font-medium">order ID, customer name, email</span>{" "}
              or <span className="font-medium">payment ID</span>.
            </li>
            <li>
              Date range filters help you analyse{" "}
              <span className="font-medium">daily, weekly or monthly</span>{" "}
              collections.
            </li>
            <li>
              Export to CSV for sharing with{" "}
              <span className="font-medium">finance or accounts</span> teams.
            </li>
            <li>
              Open an order to see the{" "}
              <span className="font-medium">breakdown of items</span>, quantity,
              and per-item pricing.
            </li>
          </ul>
        </div>

        <div className="flex gap-3 px-5 py-3 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-white transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- Order Detail Modal ---------------------- */
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/55 z-[120] flex items-center justify-center px-3 sm:px-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <MdPayment className="text-emerald-700 text-base" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h2 className="text-sm sm:text-[15px] font-semibold text-slate-900 truncate">
                Order {order.orderId}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-600 flex items-center gap-1.5">
                <FiCalendar className="text-[11px]" />
                <span>
                  {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PaymentStatusBadge />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
            >
              <FiX className="text-slate-600 text-sm" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs sm:text-sm">
          {/* Customer Info */}
          <section className="border border-slate-100 rounded-lg p-3.5 sm:p-4 bg-slate-50/70">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5 text-xs sm:text-sm">
              <FiUser className="text-amber-600 text-sm" />
              Customer information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <p className="text-[11px] text-slate-500">Name</p>
                <p className="font-medium text-slate-900 mt-0.5">
                  {order.userId?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Email</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <FiMail className="text-[11px] text-slate-400" />
                  <p className="font-medium text-slate-900 truncate">
                    {order.userId?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Info */}
          <section className="border border-emerald-100 rounded-lg p-3.5 sm:p-4 bg-emerald-50/70">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5 text-xs sm:text-sm">
              <FiDollarSign className="text-emerald-600 text-sm" />
              Payment information
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-[11px] text-slate-500 mb-0.5">
                  Payment ID
                </p>
                <p className="font-medium text-slate-900 text-xs sm:text-sm break-all">
                  {order.paymentId || "-"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-500 mb-0.5">
                  Amount paid
                </p>
                <p className="text-xl sm:text-2xl font-semibold text-emerald-700">
                  ₹{order.totalAmt}
                </p>
              </div>
            </div>
          </section>

          {/* Items */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">
                Order items ({order.items?.length || 0})
              </h3>
            </div>
            <div className="space-y-2.5">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 border border-slate-100 rounded-lg p-2.5 bg-white"
                >
                  <img
                    src={item.product_details?.image?.[0] || "/no-image.png"}
                    alt={item.product_details?.name || "Item"}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-xs sm:text-sm truncate">
                      {item.product_details?.name || "Product"}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] sm:text-xs text-slate-600">
                      <span>Qty: {item.quantity}</span>
                      <span>Price: ₹{item.pricePerUnit}</span>
                      <span className="font-medium text-slate-800">
                        Total: ₹{item.totalAmt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {!order.items?.length && (
                <p className="text-[11px] sm:text-xs text-slate-500">
                  No items available for this order.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[11px] sm:text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- Main Component ---------------------- */
const OnlinePaymentList = () => {
  const orders = useSelector((state) => state.orders.order) || [];

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  /* ------------ Filtered + Sorted Orders (only paid) ------------ */
  const onlinePaidOrders = useMemo(() => {
    let filtered = orders.filter((order) => order.payment_status === "paid");

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((order) => {
        const name = (order.userId?.name || "").toLowerCase();
        const email = (order.userId?.email || "").toLowerCase();
        const orderId = (order.orderId || "").toLowerCase();
        const paymentId = (order.paymentId || "").toLowerCase();

        return (
          orderId.includes(q) ||
          name.includes(q) ||
          email.includes(q) ||
          paymentId.includes(q)
        );
      });
    }

    // Date range filter (only if both are set)
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue;
      let bValue;

      switch (sortBy) {
        case "amount":
          aValue = a.totalAmt;
          bValue = b.totalAmt;
          break;
        case "user":
          aValue = a.userId?.name || "";
          bValue = b.userId?.name || "";
          break;
        case "items":
          aValue = a.items?.length || 0;
          bValue = b.items?.length || 0;
          break;
        default: // date
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [orders, search, dateRange, sortBy, sortOrder]);

  /* ------------ Stats ------------ */
  const stats = useMemo(() => {
    const totalAmount = onlinePaidOrders.reduce(
      (sum, order) => sum + (order.totalAmt || 0),
      0
    );
    const averageOrderValue =
      onlinePaidOrders.length > 0
        ? totalAmount / onlinePaidOrders.length
        : 0;
    const totalItems = onlinePaidOrders.reduce(
      (sum, order) => sum + (order.items?.length || 0),
      0
    );

    return {
      totalOrders: onlinePaidOrders.length,
      totalAmount,
      averageOrderValue,
      totalItems,
    };
  }, [onlinePaidOrders]);

  /* ------------ CSV Export ------------ */
  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "User",
      "Email",
      "Amount",
      "Payment ID",
      "Date",
      "Items Count",
    ];
    const csvData = onlinePaidOrders.map((order) => [
      order.orderId,
      order.userId?.name || "N/A",
      order.userId?.email || "N/A",
      order.totalAmt,
      order.paymentId,
      format(new Date(order.createdAt), "yyyy-MM-dd HH:mm"),
      order.items?.length || 0,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `online-payments-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDateRange({ start: "", end: "" });
  };

  /* ------------ JSX ------------ */
  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 py-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 border border-amber-100">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                <MdPayment className="text-amber-700 text-xs" />
              </span>
              <p className="text-[11px] sm:text-xs font-medium text-amber-800">
                Admin · Online payments
              </p>
            </div>
            <div>
              <h1 className="text-[18px] sm:text-[20px] font-semibold text-slate-900 tracking-tight mt-1">
                Online payment transactions
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Track completed online payments, analyse revenue and export
                reports for your finance workflows.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-100 text-[11px] sm:text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 transition-all"
            >
              <FiInfo className="text-xs" />
              Guide
            </button>

            <button
              onClick={exportToCSV}
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-amber-600 text-white text-[11px] sm:text-xs font-semibold shadow-sm hover:bg-amber-700"
            >
              <FiDownload className="text-xs" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase text-slate-500 tracking-wide">
                Total orders
              </p>
              <p className="text-lg sm:text-xl font-semibold text-slate-900 mt-1">
                {stats.totalOrders}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <FiPackage className="text-slate-700 text-base" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase text-slate-500 tracking-wide">
                Total revenue
              </p>
              <p className="text-lg sm:text-xl font-semibold text-slate-900 mt-1">
                ₹{stats.totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <FiDollarSign className="text-emerald-700 text-base" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase text-slate-500 tracking-wide">
                Avg order value
              </p>
              <p className="text-lg sm:text-xl font-semibold text-slate-900 mt-1">
                ₹{stats.averageOrderValue.toFixed(2)}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <FiTrendingUp className="text-amber-700 text-base" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase text-slate-500 tracking-wide">
                Total items
              </p>
              <p className="text-lg sm:text-xl font-semibold text-slate-900 mt-1">
                {stats.totalItems}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-violet-50 border border-violet-200">
              <PiPackageFill className="text-violet-700 text-base" />
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-3">
            <p className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <FiFilter className="text-xs text-amber-700" />
              Filters
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400">
              {onlinePaidOrders.length} result
              {onlinePaidOrders.length !== 1 && "s"}
            </p>
          </div>

          {/* Search + Dates + Sort */}
          <div className="flex flex-col gap-3">
            {/* Top row: search + dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer or payment ID…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        end: e.target.value,
                      }))
                    }
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Sort + View Toggle */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-1">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                {/* Sort by */}
                <div className="relative flex-1">
                  <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  >
                    <option value="date">Sort by date</option>
                    <option value="amount">Sort by amount</option>
                    <option value="user">Sort by customer</option>
                    <option value="items">Sort by items</option>
                  </select>
                </div>

                {/* Sort order */}
                <div className="relative flex-1">
                  <FiRefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  >
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </div>
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[11px] sm:text-xs text-slate-500">
                  View:
                </span>
                <div className="flex bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs cursor-pointer transition-all ${
                      viewMode === "grid"
                        ? "bg-white text-amber-700 shadow-sm border border-amber-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FiGrid className="text-xs" />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs cursor-pointer transition-all ${
                      viewMode === "list"
                        ? "bg-white text-amber-700 shadow-sm border border-amber-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FiList className="text-xs" />
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(search || dateRange.start || dateRange.end) && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Active filters:
                </span>

                {search && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-[11px] sm:text-xs text-amber-800">
                    Search: “{search}”
                    <button
                      onClick={() => setSearch("")}
                      className="hover:text-amber-900"
                    >
                      <FaTimes className="text-[10px]" />
                    </button>
                  </span>
                )}

                {dateRange.start && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] sm:text-xs text-slate-700">
                    From: {dateRange.start}
                    <button
                      onClick={() =>
                        setDateRange((prev) => ({ ...prev, start: "" }))
                      }
                      className="hover:text-slate-900"
                    >
                      <FaTimes className="text-[10px]" />
                    </button>
                  </span>
                )}

                {dateRange.end && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] sm:text-xs text-slate-700">
                    To: {dateRange.end}
                    <button
                      onClick={() =>
                        setDateRange((prev) => ({ ...prev, end: "" }))
                      }
                      className="hover:text-slate-900"
                    >
                      <FaTimes className="text-[10px]" />
                    </button>
                  </span>
                )}

                <button
                  onClick={handleClearFilters}
                  className="text-[11px] sm:text-xs text-slate-500 hover:text-slate-900 underline"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Orders - Empty / Grid / List */}
        {onlinePaidOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 sm:p-12 text-center border border-slate-200">
            <div className="mb-4 flex items-center justify-center">
              <MdPayment className="text-4xl text-slate-300" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1">
              No online payments found
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Try adjusting your search, filters or date range.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {onlinePaidOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 flex flex-col gap-3"
              >
                {/* Top: ID + date + status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-slate-500">Order ID</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900">
                      {order.orderId}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <FiCalendar className="text-[11px]" />
                      <span>
                        {format(
                          new Date(order.createdAt),
                          "dd MMM yyyy, HH:mm"
                        )}
                      </span>
                    </p>
                  </div>
                  <PaymentStatusBadge />
                </div>

                {/* Customer */}
                <div className="flex items-center gap-3 border border-slate-100 rounded-lg px-3 py-2 bg-slate-50/70">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <FiUser className="text-amber-700 text-xs" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                      {order.userId?.name || "N/A"}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {order.userId?.email || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Amount + items */}
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-slate-500">Amount</p>
                    <p className="text-lg sm:text-xl font-semibold text-emerald-700 mt-0.5">
                      ₹{order.totalAmt}
                    </p>
                  </div>
                  <div className="text-right text-[11px] sm:text-xs text-slate-500">
                    <p>
                      Items:{" "}
                      <span className="font-medium text-slate-800">
                        {order.items?.length || 0}
                      </span>
                    </p>
                    <p className="mt-0.5">
                      Payment ID:{" "}
                      <span className="font-medium text-slate-800 truncate block max-w-[160px]">
                        {order.paymentId || "-"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Item thumbnails */}
                <div className="border-t border-slate-100 pt-2">
                  <div className="flex gap-1.5">
                    {order.items?.slice(0, 4).map((item, idx) => (
                      <img
                        key={idx}
                        src={
                          item.product_details?.image?.[0] ||
                          "/no-image.png"
                        }
                        alt={item.product_details?.name || "Item"}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                    ))}
                    {order.items?.length > 4 && (
                      <div className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-[11px] text-slate-600">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-[11px] sm:text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FiEye className="text-xs" />
                  View details
                </button>
              </div>
            ))}
          </div>
        ) : (
          // List view
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {onlinePaidOrders.map((order, index) => (
              <div
                key={order._id}
                className={`px-4 sm:px-6 py-4 sm:py-5 ${
                  index !== onlinePaidOrders.length - 1
                    ? "border-b border-slate-100"
                    : ""
                } hover:bg-slate-50 transition-colors`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  {/* Left: icon + info */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <MdPayment className="text-emerald-700 text-base" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900">
                          {order.orderId}
                        </p>
                        <PaymentStatusBadge />
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                        <span>{order.userId?.name || "N/A"}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate max-w-[160px] sm:max-w-[220px]">
                          {order.userId?.email || "N/A"}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          {format(
                            new Date(order.createdAt),
                            "dd MMM yyyy, HH:mm"
                          )}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right: amount + items + button */}
                  <div className="flex items-end gap-3 justify-between md:justify-end min-w-[180px]">
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-semibold text-emerald-700">
                        ₹{order.totalAmt}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500">
                        {order.items?.length || 0} item
                        {(order.items?.length || 0) !== 1 && "s"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 sm:px-4 py-2 rounded-xl bg-amber-600 text-white text-[11px] sm:text-xs font-semibold hover:bg-amber-700 transition-colors flex items-center gap-1.5"
                    >
                      <FiEye className="text-xs" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info modal */}
        <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} />

        {/* Order details modal */}
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </div>
  );
};

export default OnlinePaymentList;
