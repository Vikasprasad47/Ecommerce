// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import Axios from '../utils/axios';
// import SummaryApi, { baseUrl } from '../comman/summaryApi';
// import toast from 'react-hot-toast';
// import QRCode from 'qrcode';
// import { LuDownload, LuChevronDown, LuChevronUp, LuScan, LuRefreshCw } from 'react-icons/lu';
// import { FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';
// import QrScanner from 'qr-scanner';
// import { useDispatch } from 'react-redux';
// import {DisplayPriceInRupees} from '../utils/DisplayPriceInRupees';
// import { AiTwotoneDelete } from "react-icons/ai";
// import Confirmbox from "../components/Confirmbox";

// const STATUS_OPTIONS = [
//   { value: 'confirmed', label: 'Confirmed' },
//   { value: 'packed', label: 'Packed' },
//   { value: 'shipped', label: 'Shipped' },
//   { value: 'delivered', label: 'Delivered' }
// ];

// const ManageOrder = () => {
//   // State management
//   const [orders, setOrders] = useState([]);
//   const [expandedOrderIds, setExpandedOrderIds] = useState([]);
//   const [loadingOrderId, setLoadingOrderId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showQRScanner, setShowQRScanner] = useState(false);
//   const [scannedData, setScannedData] = useState(null);
//   const [cameraError, setCameraError] = useState(null);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const [isProcessingScan, setIsProcessingScan] = useState(false);
//   const [isScanLoading, setIsScanLoading] = useState(false);

//   // Refs
//   const videoRef = useRef(null);
//   const qrScannerRef = useRef(null);
//   const dispatch = useDispatch();

//   const isValidOrderQR = (data) => {
//     try {
//       const parsed = JSON.parse(data);
//       return parsed && typeof parsed === 'object' && 
//             parsed.orderId && parsed._id;
//     } catch (e) {
//       return false;
//     }
//   };

//   const handleDelete = async (orderId) => {
//     try {
//       const res = await Axios({
//         ...SummaryApi.HideOrderFromAdmin,
//         data: {
//           id: orderId,
//         },
//       });

//       if (res.status === 200) {
//         toast.dismiss();
//         toast.success("Order hidden from admin panel");
//         fetchOrders();
//       } else {
//         alert(res.data?.message || "Failed to hide order");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert("An error occurred while hiding the order");
//     }
//   };

//   const toggleQRScanner = useCallback(() => {
//     setShowQRScanner(prev => !prev);
//     setScannedData(null);
//     setCameraError(null);
//   }, []);

//   const handleApiError = (error, defaultMessage = 'An error occurred') => {
//     console.error('API Error:', {
//       message: error.message,
//       response: error.response?.data,
//       config: error.config
//     });
    
//     toast.dismiss()
//     toast.error(
//       error.response?.data?.message || 
//       error.message || 
//       defaultMessage
//     );
//   };

//   const fetchOrders = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await Axios({ ...SummaryApi.getAllOrderForAdmin });
      
//       if (response.data?.success) {
//         setOrders(response.data.data || []);
//       } else {
//         throw new Error(response.data?.message || 'Failed to fetch orders');
//       }
//     } catch (error) {
//       handleApiError(error, 'Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const handleRefreshOrders = useCallback(async () => {
//     await fetchOrders();
//     toast.dismiss()
//     toast.success('Orders refreshed');
//   }, [fetchOrders]);

//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   const handleUpdateAllStatus = useCallback(async (orderId, newStatus) => {
//     if (!orderId || !newStatus) return;
    
//     try {
//       setLoadingOrderId(orderId);
      
//       setOrders(prev =>
//         prev.map(order => 
//           order._id === orderId ? {
//             ...order,
//             items: order.items.map(item => ({
//               ...item,
//               status: newStatus
//             }))
//           } : order
//         )
//       );

//       const response = await Axios({
//         ...SummaryApi.updateOrderStatus,
//         data: { 
//           orderId, 
//           status: newStatus,
//           version: orders.find(o => o._id === orderId)?._v 
//         }
//       });

//       if (!response.data?.success) {
//         fetchOrders();
//         throw new Error(response.data?.message || 'Failed to update status');
//       }
//       toast.dismiss()
//       toast.success('Order status updated');
//     } catch (error) {
//       handleApiError(error, 'Failed to update order status');
//     } finally {
//       setLoadingOrderId(null);
//     }
//   }, [orders, fetchOrders]);

//   const renderFullAddress = useCallback((address) => {
//     if (!address) return "No address available";
    
//     const { address_line, landMark, city, state, pincode, country, mobile } = address;
//     const parts = [
//       address_line,
//       landMark,
//       city,
//       state,
//       country && `${country} - ${pincode}`,
//       mobile && `Phone: ${mobile}`
//     ].filter(Boolean);
    
//     return parts.join(', ');
//   }, []);

//   const downloadInvoice = useCallback(async (order) => {
//     if (!order) return;

//     const toastId = toast.loading('Generating invoice...');
    
//     try {
//       const invoiceDiv = document.createElement('div');
//       invoiceDiv.style.position = 'absolute';
//       invoiceDiv.style.left = '-9999px';
//       invoiceDiv.style.width = '800px';
//       invoiceDiv.style.padding = '0';
//       invoiceDiv.style.backgroundColor = 'white';
//       invoiceDiv.style.fontFamily = "'Helvetica Neue', Arial, sans-serif";
//       document.body.appendChild(invoiceDiv);

//       const qrData = JSON.stringify({
//         orderId: order.orderId,
//         _id: order._id,
//         verified: true
//       });

//       const subtotal = order.items?.reduce(
//         (sum, item) => sum + ((item.pricePerUnit || 0) * (item.quantity || 1)), 
//         0
//       ) || 0;
//       const shipping = order.totalAmt - subtotal;
//       const total = order.totalAmt;

//       const qrSvg = await QRCode.toString(qrData, {
//         type: 'svg',
//         errorCorrectionLevel: 'H',
//         margin: 1,
//         width: 150,
//         color: {
//           dark: '#000000',
//           light: '#ffffff',
//         },
//       });

//       invoiceDiv.innerHTML = `
//         <div style="max-width: 800px; margin: 0 auto; padding: 30px; box-sizing: border-box;">
//           <!-- Header -->
//           <div style="display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid #eaeaea; padding-bottom: 35px;">
//             <div>
//               <h1 style="font-size: 24px; font-weight: 700; color: #2d3748; margin: 0 0 5px 0;">INVOICE</h1>
//               <p style="color: #718096; font-size: 14px; margin: 0;">Order #${order.orderId}</p>
//               <p style="color: #718096; font-size: 12px; margin: 5px 0 0 0;">
//                 Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
//               </p>
//             </div>
//             <div style="text-align: right;">
//               <div style="width: 150px; height: 150px;">
//                 ${qrSvg}
//                 <p style="font-size: 10px; color: #718096; text-align: center; margin-top: 5px;">SCAN TO VERIFY</p>
//               </div>
//             </div>
//           </div>

//           <!-- Company and Customer Info -->
//           <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
//             <div style="flex: 1;">
//               <h2 style="font-size: 16px; font-weight: 600; margin-bottom: 10px; color: #2d3748;">From</h2>
//               <p style="font-weight: 600; margin: 0 0 5px 0;">Quickoo.co</p>
//               <p style="color: #718096; font-size: 12px; margin: 0 0 3px 0;">Warje, Malwadi Pune-58</p>
//               <p style="color: #718096; font-size: 12px; margin: 0 0 3px 0;">Pune, Maharashtra 411058</p>
//               <p style="color: #718096; font-size: 12px; margin: 0 0 3px 0;">India</p>
//               <p style="color: #718096; font-size: 12px; margin: 0;">GSTIN: 22AAAAA0000A1Z5</p>
//             </div>
//             <div style="flex: 1; text-align: right;">
//               <h2 style="font-size: 16px; font-weight: 600; margin-bottom: 10px; color: #2d3748;">Bill To</h2>
//               <p style="font-weight: 600; margin: 0 0 5px 0;">${order.user?.name || order.userId?.name || 'Customer'}</p>
//               <p style="color: #718096; font-size: 12px; margin: 0 0 3px 0;">${order.user?.email || ''}</p>
//               <p style="color: #718096; font-size: 12px; margin: 0;">${renderFullAddress(order.delivery_address)}</p>
//             </div>
//           </div>

//           <!-- Order Items Table -->
//           <div style="margin-bottom: 30px; overflow: hidden; border-radius: 8px; border: 1px solid #eaeaea;">
//             <table style="width: 100%; border-collapse: collapse;">
//               <thead>
//                 <tr style="background-color: #f7fafc; border-bottom: 2px solid #e2e8f0;">
//                   <th style="padding: 12px 15px; text-align: left; font-size: 14px; color: #718096; font-weight: 600;">Item</th>
//                   <th style="padding: 12px 15px; text-align: right; font-size: 14px; color: #718096; font-weight: 600;">Price</th>
//                   <th style="padding: 12px 15px; text-align: center; font-size: 14px; color: #718096; font-weight: 600;">Qty</th>
//                   <th style="padding: 12px 15px; text-align: right; font-size: 14px; color: #718096; font-weight: 600;">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${order.items?.map(item => `
//                   <tr style="border-bottom: 1px solid #edf2f7;">
//                     <td style="padding: 12px 15px; text-align: left; font-size: 13px;">
//                       <p style="font-weight: 600; margin: 0 0 3px 0;">${item.product_details?.name || 'Product'}</p>
//                       <p style="color: #718096; font-size: 11px; margin: 0;">SKU: ${item.product_details?._id || 'N/A'}</p>
//                     </td>
//                     <td style="padding: 12px 15px; text-align: right; font-size: 13px;">₹${(item.pricePerUnit || 0).toFixed(2)}</td>
//                     <td style="padding: 12px 15px; text-align: center; font-size: 13px;">${item.quantity || 1}</td>
//                     <td style="padding: 12px 15px; text-align: right; font-size: 13px; font-weight: 600;">
//                       ₹${((item.pricePerUnit || 0) * (item.quantity || 1)).toFixed(2)}
//                     </td>
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>
//           </div>

//           <!-- Totals Section -->
//           <div style="display: flex; justify-content: flex-end;">
//             <div style="width: 300px;">
//               <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
//                 <span style="color: #718096; font-size: 13px;">Subtotal</span>
//                 <span style="font-weight: 600; font-size: 13px;">${DisplayPriceInRupees(subtotal.toFixed(2))}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
//                 <span style="color: #718096; font-size: 13px;">Tax</span>
//                 <span style="font-weight: 600; font-size: 13px;">₹0.00</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
//                 <span style="color: #718096; font-size: 13px;">Shipping</span>
//                 <span style="font-weight: 600; font-size: 13px;">${DisplayPriceInRupees(shipping.toFixed(2))}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
//                 <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Total</span>
//                 <span style="font-weight: 700; font-size: 15px; color: #2d3748;">${DisplayPriceInRupees(total.toFixed(2))}</span>
//               </div>
//             </div>
//           </div>

//           <!-- Payment Method -->
//           <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
//             <p style="font-weight: 600; margin-bottom: 5px; font-size: 14px;">Payment Method</p>
//             <p style="color: #718096; font-size: 13px; margin: 0;">
//               ${order.payment_status === 'CASH ON DELIVERY' 
//                 ? 'Cash on Delivery' 
//                 : order.payment_status === 'paid' 
//                   ? 'Paid Online' 
//                   : 'Pending Payment'}
//             </p>
//           </div>

//           <!-- Footer -->
//           <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center;">
//             <p style="color: #718096; font-size: 11px; margin-bottom: 5px;">Thank you for shopping with us!</p>
//             <p style="color: #718096; font-size: 11px; margin: 0;">
//               For any questions regarding this invoice, please contact support@quickoo-co.com
//             </p>
//           </div>
//         </div>
//       `;
      
//       const canvas = await html2canvas(invoiceDiv, {
//         scale: 2,
//         logging: false,
//         useCORS: true,
//         backgroundColor: '#ffffff'
//       });

//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4'
//       });

//       const imgData = canvas.toDataURL('image/jpeg', 1.0);
//       const imgWidth = 210;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
//       pdf.save(`Invoice_${order.orderId}.pdf`);

//       toast.dismiss();
//       toast.success('Invoice downloaded!', { id: toastId });
//     } catch (error) {
//       console.error('Invoice generation error:', error);

//       toast.dismiss();
//       toast.error(error.message || 'Failed to generate invoice', { id: toastId });
//     } finally {
//       const elements = document.querySelectorAll('div[style*="left: -9999px"], canvas');
//       elements.forEach(el => el.parentNode?.removeChild(el));
//     }
//   }, [renderFullAddress]);

//   const groupedOrders = orders.reduce((acc, order) => {
//     const date = new Date(order.createdAt).toDateString();
//     if (!acc[date]) acc[date] = [];
//     acc[date].push(order);
//     return acc;
//   }, {});

//   const formatDateDisplay = (dateString) => {
//     const today = new Date();
//     const orderDate = new Date(dateString);
//     const diffTime = Math.abs(today - orderDate);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return 'Today';
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays <= 7) return `${diffDays} days ago`;
    
//     return orderDate.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   useEffect(() => {
//     if (!showQRScanner) return;

//     const initializeScanner = async () => {
//       try {
//         if (!videoRef.current) {
//           throw new Error('Video element not available');
//         }
        
//         qrScannerRef.current = new QrScanner(
//           videoRef.current,
//           handleScan,
//           {
//             preferredCamera: 'environment',
//             highlightScanRegion: true,
//             highlightCodeOutline: true,
//             maxScansPerSecond: 5,
//           }
//         );

//         await qrScannerRef.current.start();
//         setCameraError(null);
//       } catch (err) {
//         console.error('Scanner initialization error:', err);
//         setCameraError(err.message || 'Failed to access camera. Please check permissions.');
//         setShowQRScanner(false);

//         toast.dismiss();
//         toast.error('Camera access denied');
//       }
//     };

//     initializeScanner();

//     return () => {
//       if (qrScannerRef.current) {
//         qrScannerRef.current.stop();
//         qrScannerRef.current = null;
//       }
//     };
//   }, [showQRScanner]);

//   const handleScan = useCallback(async (result) => {
//     if (isProcessingScan) return;
//     setIsProcessingScan(true);
//     setIsScanLoading(true);

//     try {
//       if (!result?.data) throw new Error('No QR code data detected');
//       if (result.data.startsWith('http')) throw new Error('Website QR detected. Please scan an order QR code.');
//       if (!isValidOrderQR(result.data)) throw new Error('Invalid order QR format');

//       const orderData = JSON.parse(result.data);
//       const matchedOrder = orders.find(o => o.orderId === orderData.orderId);
//       if (!matchedOrder) throw new Error('Order not found. Please refresh orders and try again.');

//       setScannedData(orderData);
//       setCameraError(null);

//       qrScannerRef.current?.stop();

//       await handleUpdateAllStatus(matchedOrder._id, 'delivered');

//       toast.success(`Order ${orderData.orderId} marked as delivered`);

//       setTimeout(() => {
//         setShowQRScanner(false);
//         setScannedData(null);
//       }, 1000);
//     } catch (error) {
//       console.error('QR scan error:', error);
//       toast.error(error.message);
//       setCameraError(error.message);
//     } finally {
//       setIsProcessingScan(false);
//       setIsScanLoading(false);
//     }
//   }, [orders, handleUpdateAllStatus, isProcessingScan]);

//   const getStatusIcon = useCallback((status) => {
//     const baseClasses = "mr-1.5 text-lg";
    
//     switch (status) {
//       case 'confirmed': 
//         return <FiClock className={`${baseClasses} text-amber-500`} />;
//       case 'packed': 
//         return <FiPackage className={`${baseClasses} text-blue-500`} />;
//       case 'shipped': 
//         return <FiTruck className={`${baseClasses} text-indigo-500`} />;
//       case 'delivered': 
//         return <FiCheckCircle className={`${baseClasses} text-green-500`} />;
//       default: 
//         return <FiClock className={`${baseClasses} text-gray-400`} />;
//     }
//   }, []);

//   const toggleExpand = useCallback((orderId) => {
//     setExpandedOrderIds(prev =>
//       prev.includes(orderId)
//         ? prev.filter(id => id !== orderId)
//         : [...prev, orderId]
//     );
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen bg-white">
//         <div className="relative flex items-center justify-center w-24 h-24">
//           <svg
//             className="w-16 h-16 text-amber-500 animate-pulse"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="1.5"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M3.375 6.75L12 12l8.625-5.25M3.375 6.75L12 1.5l8.625 5.25M3.375 6.75v10.5L12 22.5m0-10.5v10.5m0-10.5l8.625-5.25m0 0v10.5M12 22.5l8.625-5.25"
//             />
//           </svg>
//           <div className="absolute w-full h-full border-4 border-amber-300 border-dashed rounded-full animate-spin"></div>
//         </div>
//         <p className="mt-4 text-amber-600 font-semibold text-lg animate-pulse">Processing Orders...</p>
//       </div>
//     );
//   }

//   if (!orders.length) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-center px-4">
//         <div className="bg-gray-100 p-6 rounded-full mb-4">
//           <FiPackage className="text-gray-400 text-4xl" />
//         </div>
//         <h2 className="text-xl font-medium text-gray-700 mb-2">No Orders Found</h2>
//         <p className="text-gray-500 max-w-md">Currently there are no orders to manage.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="px-2 sm:px-4 lg:px-6 py-4 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Orders</h1>
//           <div className="flex items-center gap-3">
//             <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
//               Total Orders: {orders.length}
//             </div>
//             <button 
//               onClick={handleRefreshOrders}
//               className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
//               aria-label="Refresh orders"
//             >
//               <LuRefreshCw size={16} />
//               Refresh
//             </button>
//             <button 
//               onClick={toggleQRScanner}
//               className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition-colors"
//               aria-label={showQRScanner ? 'Stop QR Scanner' : 'Scan QR Code'}
//             >
//               <LuScan size={16} />
//               {showQRScanner ? 'Stop' : 'Scan QR'}
//             </button>
//           </div>
//         </div>

//         {showQRScanner && (
//           <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="text-lg font-semibold">QR Code Scanner</h2>
//               <button 
//                 onClick={toggleQRScanner}
//                 className="text-gray-500 hover:text-gray-700"
//                 aria-label="Close QR Scanner"
//               >
//                 ×
//               </button>
//             </div>

//             {cameraError ? (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//                 <p className="text-red-600 font-medium">{cameraError}</p>
//                 <button 
//                   onClick={toggleQRScanner}
//                   className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
//                 >
//                   Close Scanner
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-2">
//                   {isScanLoading ? (
//                     <div className="w-full h-full flex items-center justify-center text-white text-lg">
//                       <svg className="animate-spin h-8 w-8 mr-2 text-white" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                       </svg>
//                       <span>Processing...</span>
//                     </div>
//                   ) : (
//                     <>
//                       <video 
//                         ref={videoRef} 
//                         className="w-full h-full object-cover"
//                         playsInline
//                         aria-label="QR Scanner Video Feed"
//                       />
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="border-4 border-white border-dashed w-64 h-64 rounded-lg animate-pulse"></div>
//                       </div>
//                     </>
//                   )}
//                 </div>
                
//                 {cameraError && (
//                   <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
//                     <p className="font-medium text-red-800">Scanner Error</p>
//                     <p className="text-sm text-red-600 mt-1">{cameraError}</p>
//                   </div>
//                 )}
                
//                 <p className="text-sm text-gray-500 text-center">
//                   Point your camera at an order QR code to scan
//                 </p>
                
//                 {scannedData && (
//                   <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
//                     <p className="font-medium text-green-800">Scanned Order: #{scannedData.orderId}</p>
//                     <p className="text-sm text-green-600 mt-1">
//                       Status automatically updated to delivered
//                     </p>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )}

//         {Object.entries(groupedOrders).map(([date, dateOrders]) => (
//           <div key={date} className="mb-8">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//               <span className="bg-gray-300 rounded-full w-2 h-2 mr-2"></span>
//               {formatDateDisplay(date)}
//               <span className="ml-2 text-sm font-normal text-gray-500">({dateOrders.length} orders)</span>
//             </h2>

//             <div className="space-y-4">
//               {dateOrders.map(order => {
//                 const isExpanded = expandedOrderIds.includes(order.orderId);
//                 const isDelivered = order.items?.every(item => item.status === 'delivered');
//                 const previewItem = order.items?.[0];
//                 const totalPayable = order.totalAmt || 0;

//                 return (
//                   <div 
//                     key={order.orderId} 
//                     className={`relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md ${
//                       isDelivered ? 'border-green-100' : 'hover:border-gray-300'
//                     }`}
//                   >
//                     {isDelivered && (
//                       <div className="absolute inset-0 bg-amber-500/60 bg-opacity-30 pointer-events-none z-[20]"></div>
//                     )}
                    
//                     {isDelivered && (
//                       <div className="z-[25] flex items-center justify-center h-full absolute top-0 left-0 w-full">
//                         <div className='flex items-center gap-2 bg-white p-3 rounded-lg shadow-md'>
//                           <FiCheckCircle className="text-green-500" size={25} />
//                           <p className='text-2xl font-bold'>Delivered</p>
//                         </div>
//                       </div>
//                     )}

//                     <div 
//                       onClick={() => !isDelivered && toggleExpand(order.orderId)}
//                       className={`relative p-4 sm:p-6 flex flex-col md:flex-row justify-between gap-4 z-10 ${
//                         isDelivered ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'
//                       }`}
//                     >
//                       <div className="flex-1 space-y-3 min-w-0">
//                         <div className="flex justify-between items-start gap-2">
//                           <div>
//                             <h2 className={`text-base md:text-lg font-semibold ${
//                               isDelivered ? 'text-gray-600' : 'text-gray-800'
//                             }`}>
//                               Order: #{order.orderId}
//                             </h2>
//                             <p className={`text-sm ${
//                               isDelivered ? 'text-gray-400' : 'text-gray-500'
//                             }`}>
//                               {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                             </p>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <button 
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 downloadInvoice(order);
//                               }}
//                               className={`p-1.5 rounded-full transition-colors ${
//                                 isDelivered 
//                                   ? 'text-gray-400 hover:bg-gray-100 hover:text-indigo-500' 
//                                   : 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600'
//                               }`}
//                               title="Download Invoice"
//                               aria-label="Download Invoice"
//                             >
//                               <LuDownload size={18} />
//                             </button>

//                             <button 
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setSelectedOrderId(order._id);
//                                 setShowConfirm(true);
//                               }}
//                               className={`p-1.5 rounded-full transition-colors ${
//                                 isDelivered 
//                                   ? 'text-gray-400 hover:bg-gray-100 hover:text-red-500' 
//                                   : 'text-gray-500 hover:bg-gray-100 hover:text-red-600'
//                               }`}
//                               title="Hide Order"
//                               aria-label="Hide Order"
//                             >
//                               <AiTwotoneDelete size={18} />
//                             </button>

//                             {!isDelivered && (
//                               isExpanded ? (
//                                 <LuChevronUp size={20} className="text-gray-500" />
//                               ) : (
//                                 <LuChevronDown size={20} className="text-gray-500" />
//                               )
//                             )}
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
//                           <div>
//                             <p className={`${isDelivered ? 'text-gray-400' : 'text-gray-500'}`}>Customer</p>
//                             <p className={`font-medium truncate ${isDelivered ? 'text-gray-500' : 'text-gray-700'}`}>
//                               {order.userId?.name || 'N/A'}
//                             </p>
//                           </div>
//                           <div>
//                             <p className={`${isDelivered ? 'text-gray-400' : 'text-gray-500'}`}>Mobile</p>
//                             <p className={`font-medium truncate ${isDelivered ? 'text-gray-500' : 'text-gray-700'}`}>
//                               +91 {order.delivery_address?.mobile || 'N/A'}
//                             </p>
//                           </div>
//                           <div>
//                             <p className={`${isDelivered ? 'text-gray-400' : 'text-gray-500'}`}>Payment</p>
//                             <p className={`font-medium ${
//                               order.payment_status === 'paid' 
//                                 ? isDelivered ? 'text-green-400' : 'text-green-600'
//                                 : order.payment_status === 'CASH ON DELIVERY'
//                                   ? isDelivered ? 'text-blue-400' : 'text-blue-600'
//                                   : isDelivered ? 'text-red-400' : 'text-red-600'
//                             }`}>
//                               {order.payment_status === 'CASH ON DELIVERY' 
//                                 ? 'Cash on Delivery' 
//                                 : order.payment_status === 'paid' 
//                                   ? 'Paid' 
//                                   : 'Pending'}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex flex-col">
//                           <div className="flex flex-wrap items-center gap-2 mt-0">
//                             <span className={`text-xs ${isDelivered ? 'text-gray-400' : 'text-gray-500'}`}>
//                               {renderFullAddress(order.delivery_address)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div>
//                         <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 self-start md:self-center">
//                           <div className='w-full'>
//                             <img
//                               src={previewItem?.product_details?.image?.[0] || '/no-image.png'}
//                               alt={previewItem?.product_details?.name || 'Product'}
//                               className={`w-full h-full object-cover rounded-lg border ${
//                                 isDelivered ? 'opacity-80' : ''
//                               }`}
//                               onError={(e) => {
//                                 e.target.src = '/no-image.png';
//                               }}
//                             />
//                           </div>
//                           {order.items?.length > 1 && (
//                             <div className={`absolute -top-2 -right-2 text-white text-xs rounded-full px-2 py-1 ${
//                               isDelivered ? 'bg-green-400' : 'bg-indigo-600'
//                             }`}>
//                               +{order.items.length - 1}
//                             </div>
//                           )}
//                         </div>
//                         <div>
//                           <p className={`${isDelivered ? 'text-gray-400' : 'text-gray-500'}`}>Total Amount</p>
//                           <p className={`font-medium ${isDelivered ? 'text-gray-500' : 'text-gray-700'}`}>
//                             {DisplayPriceInRupees(totalPayable.toFixed(2))}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {isExpanded && !isDelivered && (
//                       <div className="border-t px-4 sm:px-6 pb-6 pt-3">
//                         <div className="flex justify-between items-center mb-3">
//                           <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
//                             Order Items ({order.items?.length || 0})
//                           </h3>
//                           <div className="flex gap-2">
//                             <select 
//                               defaultValue="" 
//                               onChange={(e) => handleUpdateAllStatus(order._id, e.target.value)}
//                               className="border rounded px-2 py-1 text-sm"
//                               disabled={loadingOrderId === order._id}
//                             >
//                               <option value="" disabled>Update All Status</option>
//                               {STATUS_OPTIONS.map(option => (
//                                 <option key={option.value} value={option.value}>
//                                   {option.label}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                         </div>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                           {order.items?.map(item => (
//                             <div key={item._id} className="border rounded-lg p-4 bg-gray-50 hover:bg-white transition-colors">
//                               <div className="flex gap-4">
//                                 <img
//                                   src={item.product_details?.image?.[0] || '/no-image.png'}
//                                   alt={item.product_details?.name}
//                                   className="w-16 h-16 object-cover rounded-md border"
//                                   onError={(e) => {
//                                     e.target.src = '/no-image.png';
//                                   }}
//                                 />
//                                 <div className="flex-1 min-w-0">
//                                   <p className="text-sm font-medium text-gray-800 truncate">
//                                     {item.product_details?.name}
//                                   </p>
//                                   <div className="text-xs text-gray-500 mt-1 space-y-0.5 text-left">
//                                     <p><strong>Unit Price:</strong> {DisplayPriceInRupees(item.pricePerUnit?.toFixed(2))}</p>
//                                     <p><strong>Quantity:</strong> {item.quantity}</p>
//                                     {item.product?.discount > 0 && (
//                                       <p><strong>Discount:</strong> -{item.product.discount}%</p>
//                                     )}
//                                     <p><strong>Subtotal:</strong> {DisplayPriceInRupees(item.subtotalAmt?.toFixed(2))}</p>
//                                     <p><strong>Total:</strong> {DisplayPriceInRupees(item.totalAmt?.toFixed(2))}</p>
//                                   </div>

//                                   <div className="flex items-center gap-2 mt-2">
//                                     {getStatusIcon(item.status)}
//                                     <span className="text-xs capitalize">{item.status}</span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {showConfirm && (
//         <Confirmbox
//           close={() => setShowConfirm(false)}
//           cancel={() => setShowConfirm(false)}
//           confirm={() => {
//             handleDelete(selectedOrderId);
//             setShowConfirm(false);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default ManageOrder;


import React, { useEffect, useState, useRef, useCallback } from 'react';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import toast from 'react-hot-toast';
import { LuRefreshCw } from 'react-icons/lu';
import { FiPackage } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import OrderQRScanner from '../components/OrderQRScanner';
import OrderInvoicePDF from '../components/OrderInvoicePDF';
import OrderList from '../components/OrderList';
import Confirmbox from "../components/Confirmbox";

const ManageOrder = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const dispatch = useDispatch();

  const handleApiError = (error, defaultMessage = 'An error occurred') => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    
    toast.dismiss()
    toast.error(
      error.response?.data?.message || 
      error.message || 
      defaultMessage
    );
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.getAllOrderForAdmin });
      
      if (response.data?.success) {
        setOrders(response.data.data || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch orders');
      }
    } catch (error) {
      handleApiError(error, 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefreshOrders = useCallback(async () => {
    await fetchOrders();
    toast.dismiss()
    toast.success('Orders refreshed');
  }, [fetchOrders]);

  const handleDelete = async (orderId) => {
    try {
      const res = await Axios({
        ...SummaryApi.HideOrderFromAdmin,
        data: {
          id: orderId,
        },
      });

      if (res.status === 200) {
        toast.dismiss();
        toast.success("Order hidden from admin panel");
        fetchOrders();
      } else {
        alert(res.data?.message || "Failed to hide order");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while hiding the order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleQRScanner = useCallback(() => {
    setShowQRScanner(prev => !prev);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br">
        {/* Wave Loader */}
        <div className="flex space-x-1 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-3 h-12 bg-gradient-to-t from-amber-400 to-orange-500 rounded-full animate-wave"
              style={{
                animationDelay: `${i * 0.1}s`
              }}
            ></div>
          ))}
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-amber-800">Processing Orders</h2>
          <p className="text-amber-600 text-sm">Please wait while we process your requests</p>
        </div>

        <style jsx>{`
          @keyframes wave {
            0%, 100% { transform: scaleY(0.5); }
            50% { transform: scaleY(1.5); }
          }
          .animate-wave {
            animation: wave 1.2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <FiPackage className="text-gray-400 text-4xl" />
        </div>
        <h2 className="text-xl font-medium text-gray-700 mb-2">No Orders Found</h2>
        <p className="text-gray-500 max-w-md">Currently there are no orders to manage.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-xl text-gray-800">Manage Orders</h2>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Total Orders: {orders.length}
            </div>
            <button 
              onClick={handleRefreshOrders}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-300 transition-colors"
            >
              <LuRefreshCw size={16} />
              Refresh
            </button>
            <button 
              onClick={toggleQRScanner}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm hover:from-amber-600 hover:to-orange-600 transition-colors"
            >
              Scan QR
            </button>
          </div>
        </div>

        {/* QR Scanner */}
        {showQRScanner && (
          <OrderQRScanner 
            onClose={toggleQRScanner}
            orders={orders}
            onOrderUpdate={fetchOrders}
          />
        )}

        {/* Orders List */}
        <OrderList 
          orders={orders}
          onDelete={(orderId) => {
            setSelectedOrderId(orderId);
            setShowConfirm(true);
          }}
          onRefresh={fetchOrders}
        />

        {/* Confirmation Dialog */}
        {showConfirm && (
          <Confirmbox
            close={() => setShowConfirm(false)}
            cancel={() => setShowConfirm(false)}
            confirm={() => {
              handleDelete(selectedOrderId);
              setShowConfirm(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ManageOrder;