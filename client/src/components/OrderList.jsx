import React, { useState, useCallback } from 'react';
import { LuDownload, LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';
import { AiTwotoneDelete } from "react-icons/ai";
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import OrderInvoicePDF from './OrderInvoicePDF';
import { RiCoupon2Fill } from "react-icons/ri";


const STATUS_OPTIONS = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  // { value: 'delivered', label: 'Delivered' }
];

const OrderList = ({ orders, onDelete, onRefresh }) => {
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  const handleUpdateAllStatus = useCallback(async (orderId, newStatus) => {
    if (!orderId || !newStatus) return;
    
    try {
      setLoadingOrderId(orderId);
      
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: { 
          orderId, 
          status: newStatus,
          version: orders.find(o => o._id === orderId)?._v 
        }
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to update status');
      }
      
      await onRefresh();
    } catch (error) {
      console.error('Status update error:', error);
    } finally {
      setLoadingOrderId(null);
    }
  }, [orders, onRefresh]);

  const renderFullAddress = useCallback((address) => {
    if (!address) return "No address available";
    
    const { address_line, landMark, city, state, pincode, country, mobile } = address;
    const parts = [
      address_line,
      landMark,
      city,
      state,
      country && `${country} - ${pincode}`,
      mobile && `Phone: ${mobile}`
    ].filter(Boolean);
    
    return parts.join(', ');
  }, []);

  const getStatusIcon = useCallback((status) => {
    const baseClasses = "mr-1.5 text-lg";
    
    switch (status) {
      case 'confirmed': 
        return <FiClock className={`${baseClasses} text-amber-500`} />;
      case 'packed': 
        return <FiPackage className={`${baseClasses} text-blue-500`} />;
      case 'shipped': 
        return <FiTruck className={`${baseClasses} text-indigo-500`} />;
      case 'delivered': 
        return <FiCheckCircle className={`${baseClasses} text-green-500`} />;
      default: 
        return <FiClock className={`${baseClasses} text-gray-400`} />;
    }
  }, []);

  const toggleExpand = useCallback((orderId) => {
    setExpandedOrderIds(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  }, []);

  const formatDateDisplay = (dateString) => {
    const today = new Date();
    const orderDate = new Date(dateString);
    const diffTime = Math.abs(today - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return orderDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const groupedOrders = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {});

  console.log("groupedOrders",groupedOrders)

  return (
    <div className="space-y-6">
      {Object.entries(groupedOrders).map(([date, dateOrders]) => (
        <div key={date} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">
              {formatDateDisplay(date)}
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {dateOrders.length} orders
            </span>
          </div>

          <div className="grid gap-4">
            {dateOrders.map(order => {
              const isExpanded = expandedOrderIds.includes(order.orderId);
              const isDelivered = order.items?.every(item => item.status === 'delivered');
              const previewItem = order.items?.[0];
              const totalPayable = order.totalAmt || 0;

              return (
                <div 
                  key={order.orderId} 
                  className={`relative bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all ${
                    isDelivered ? 'border-green-200 bg-green-50/30' : 'hover:shadow-md'
                  }`}
                > 
                  {/* Delivered Ribbon */}
                  {isDelivered && (
                    <div className="absolute top-2 right-0 -rotate-12 bg-amber-500 text-white px-4 py-1 text-lg font-bold shadow-lg z-10">
                      DELIVERED
                    </div>
                  )}
  
                  {/* Order Header */}
                  <div 
                    onClick={() => !isDelivered && toggleExpand(order.orderId)}
                    className={`p-4 sm:p-6 flex flex-col md:flex-row justify-between gap-4 relative ${
                      isDelivered ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div>
                            {order.couponDiscount > 0 && (
                              <div className="text-black text-xs font-semibold bg-green-200 px-2 py-1 w-fit rounded-lg mb-2">
                                <div className='flex items-center gap-1'>
                                  <RiCoupon2Fill />
                                  <p>Coupon: {DisplayPriceInRupees(order.couponDiscount)}</p>
                                </div>
                              </div>
                            )}
                            <h2 className={`text-lg font-semibold ${
                            isDelivered ? 'text-gray-600' : 'text-gray-800'
                            }`}>
                              Order: #{order.orderId}
                            </h2>
                          </div>
                          
                          <p className={`text-sm ${
                            isDelivered ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              OrderInvoicePDF.generate(order, renderFullAddress);
                            }}
                            className={`p-2 rounded-xl transition-colors ${
                              isDelivered 
                                ? 'text-gray-400 hover:bg-gray-100 hover:text-indigo-500' 
                                : 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600'
                            }`}
                          >
                            <LuDownload size={18} />
                          </button>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(order._id);
                            }}
                            className={`p-2 rounded-xl transition-colors ${
                              isDelivered 
                                ? 'text-gray-400 hover:bg-gray-100 hover:text-red-500' 
                                : 'text-gray-500 hover:bg-gray-100 hover:text-red-600'
                            }`}
                          >
                            <AiTwotoneDelete size={18} />
                          </button>

                          {!isDelivered && (
                            isExpanded ? (
                              <LuChevronUp size={20} className="text-gray-500" />
                            ) : (
                              <LuChevronDown size={20} className="text-gray-500" />
                            )
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className={`${isDelivered ? 'text-gray-400' : 'text-gray-500'}`}>Customer</p>
                          <p className={`font-medium ${isDelivered ? 'text-gray-500' : 'text-gray-700'}`}>
                            {order.userId?.name || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className={`${isDelivered ? 'text-gray-400' : 'text-gray-500'}`}>Mobile</p>
                          <p className={`font-medium ${isDelivered ? 'text-gray-500' : 'text-gray-700'}`}>
                            +91 {order.delivery_address?.mobile || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className={`${isDelivered ? 'text-gray-400' : 'text-gray-500'}`}>Payment</p>
                          <p className={`font-medium ${
                            order.payment_status === 'paid' 
                              ? isDelivered ? 'text-green-400' : 'text-green-600'
                              : order.payment_status === 'CASH ON DELIVERY'
                                ? isDelivered ? 'text-blue-400' : 'text-blue-600'
                                : isDelivered ? 'text-red-400' : 'text-red-600'
                          }`}>
                            {order.payment_status === 'CASH ON DELIVERY' 
                              ? 'Cash on Delivery' 
                              : order.payment_status === 'paid' 
                                ? 'Paid' 
                                : 'Pending'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className={`text-xs ${isDelivered ? 'text-gray-400' : 'text-gray-500'}`}>
                          {renderFullAddress(order.delivery_address)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="relative w-20 h-20 shrink-0">
                        <img
                          src={previewItem?.product_details?.image?.[0] || '/no-image.png'}
                          alt={previewItem?.product_details?.name || 'Product'}
                          className={`w-full h-full object-cover rounded-lg border ${
                            isDelivered ? 'opacity-80' : ''
                          }`}
                        />
                        {order.items?.length > 1 && (
                          <div className={`absolute -top-2 -right-2 text-white text-xs rounded-full px-2 py-1 ${
                            isDelivered ? 'bg-green-400' : 'bg-amber-500'
                          }`}>
                            +{order.items.length - 1}
                          </div>
                        )}


                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${isDelivered ? 'text-gray-400' : 'text-gray-500'}`}>Total Amount</p>
                        <p className={`font-semibold text-lg ${
                          isDelivered ? 'text-gray-500' : 'text-gray-800'
                        }`}>
                          {DisplayPriceInRupees(totalPayable.toFixed(2))}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && !isDelivered && (
                    <div className="border-t px-4 sm:px-6 pb-6 pt-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Order Items ({order.items?.length || 0})
                        </h3>
                        <select 
                          defaultValue="" 
                          onChange={(e) => handleUpdateAllStatus(order._id, e.target.value)}
                          className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                          disabled={loadingOrderId === order._id}
                        >
                          <option value="" disabled>Update All Status</option>
                          {STATUS_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {order.items?.map(item => (
                          <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                            <div className="flex gap-3">
                              <img
                                src={item.product_details?.image?.[0] || '/no-image.png'}
                                alt={item.product_details?.name}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {item.product_details?.name}
                                </p>
                                <div className="text-xs text-gray-500 mt-1 space-y-1">
                                  <div className='flex items-center justify-between'>
                                    <p><strong>Price:</strong> {DisplayPriceInRupees(item.product.price?.toFixed(2))}</p>
                                    <p><strong>Qty:</strong> {item.quantity}</p>
                                  </div>
                                  <p><strong>Discount:</strong> {DisplayPriceInRupees(Math.ceil(item.product.price*(item.product.discount/100)))}</p>
                                  <p><strong>discountedPrice: </strong>{DisplayPriceInRupees(item.product.discountedPrice)}</p>
                                  <p><strong>Total:</strong> {DisplayPriceInRupees((item.product.discountedPrice)*item.quantity)}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  {getStatusIcon(item.status)}
                                  <span className="text-xs font-medium capitalize">{item.status}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;