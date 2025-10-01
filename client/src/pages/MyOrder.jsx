import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import NoData from '../components/Nodata';
import {
  LuPackageOpen,
  LuChevronDown,
  LuChevronUp,
  LuPackageCheck,
  LuTruck,
  LuInfo,
  LuFileText,
  LuMessageSquare,
  LuStar,
  LuShield,
  LuCalendar,
  LuUndo2
} from "react-icons/lu";
import { FiClock, FiCheckCircle, FiFilter } from "react-icons/fi";
import {DisplayPriceInRupees} from '../utils/DisplayPriceInRupees'


const MyOrder = () => {
  const orders = useSelector((state) => state.orders.order);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders
    .map(order => ({
      ...order,
      items: order.items.filter(item => 
        (activeFilter === 'all' || item.status === activeFilter) &&
        (item.product_details.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         order.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }))
    .filter(order => order.items.length > 0);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusIcon = (status, size = 14) => {
    switch (status) {
      case 'confirmed': return <FiClock className="text-amber-500" size={size} />;
      case 'packed': return <LuPackageCheck className="text-blue-500" size={size} />;
      case 'shipped': return <LuTruck className="text-indigo-500" size={size} />;
      case 'delivered': return <FiCheckCircle className="text-green-500" size={size} />;
      default: return <FiClock className="text-gray-500" size={size} />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getOrderStatus = (items) => {
    if (items.every(item => item.status === 'delivered')) return 'delivered';
    if (items.some(item => item.status === 'shipped')) return 'shipped';
    if (items.some(item => item.status === 'packed')) return 'packed';
    return 'confirmed';
  };

  const StatusTimeline = ({ status }) => {
    const steps = [
      { id: 'confirmed', label: 'Confirmed', icon: <FiClock className="w-3 h-3" /> },
      { id: 'packed', label: 'Packed', icon: <LuPackageCheck className="w-3 h-3" /> },
      { id: 'shipped', label: 'Shipped', icon: <LuTruck className="w-3 h-3" /> },
      { id: 'delivered', label: 'Delivered', icon: <FiCheckCircle className="w-3 h-3" /> }
    ];
    const activeIndex = steps.findIndex(step => step.id === status);
    return (
      <div className="mt-8 px-4">
        <div className="relative">
          {/* Background track line */}
          <div className="absolute left-0 right-0 top-[18px] h-[2px] bg-amber-100 rounded-full"></div>
          
          {/* Progress line - full width when delivered */}
          <div
            className="absolute left-0 top-[18px] h-[2px] bg-amber-500 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${activeIndex === steps.length - 1 ? '100%' : (activeIndex / (steps.length - 1)) * 100}%`
            }}
          ></div>
          
          {/* Steps container */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = index <= activeIndex;
              const isCurrent = index === activeIndex;
              const isDelivered = activeIndex === steps.length - 1 && index === steps.length - 1;
              const isPending = index > activeIndex;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  {/* Step indicator */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted ? 'bg-amber-500 border-amber-500 text-white' : ''}
                    ${isCurrent && !isDelivered ? 'border-amber-500 bg-white text-amber-600 animate-[pulse_1.5s_ease-in-out_infinite]' : ''}
                    ${isDelivered ? 'bg-amber-500 border-amber-500 text-white' : ''}
                    ${isPending ? 'border-amber-100 bg-white text-amber-300' : ''}
                    ${isCurrent && !isDelivered ? 'ring-4 ring-amber-100' : ''}
                  `}>
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-medium">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  
                  {/* Step label */}
                  <span className={`
                    mt-2 text-xs font-medium transition-all duration-200
                    ${isCompleted ? 'text-amber-600' : ''}
                    ${isCurrent && !isDelivered ? 'text-amber-600 font-semibold' : ''}
                    ${isDelivered ? 'text-amber-600' : ''}
                    ${isPending ? 'text-amber-300' : ''}
                  `}>
                    {step.label}
                  </span>
                  
                  {/* Active indicator (only show if not delivered) */}
                  {isCurrent && !isDelivered && (
                    <div className="mt-1 h-1 w-1 rounded-full bg-amber-500 animate-[bounce_1s_infinite]"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Embedded animations */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
        `}</style>
      </div>
    );
  };

  return (
    <section className="px-1 py-1 min-h-screen rounded-3xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-5 text-center rounded p-4 bg-white border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full shadow-xs">
                <LuPackageOpen size={24} className="text-amber-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Order History</h1>
            </div>

            <div className="w-full">
              <div className="flex flex-row sm:flex-row justify-between gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <FiFilter size={16} />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                  {['all', 'confirmed', 'packed', 'shipped', 'delivered'].map(status => (
                    <button
                      key={status}
                      onClick={() => setActiveFilter(status)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        activeFilter === status
                          ? 'bg-gray-800 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order List */}
        {!filteredOrders?.length ? (
          <NoData message={`No ${activeFilter === 'all' ? '' : activeFilter + ' '}orders found`} />
        ) : (
          <div className="space-y-0 rounded-xl">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order._id;
              const orderStatus = getOrderStatus(order.items);
              const isOngoing = orderStatus !== 'delivered';

              return (
                <div
                  key={order._id}
                  className="bg-white border-b-2 border-slate-400 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <div className='p-5 cursor-pointer rounded-xl' onClick={() => toggleOrderExpand(order._id)}>
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        {order.items.length > 1 && (
                          <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {order.items.length}
                          </div>
                        )}
                        <img
                          src={order.items[0].product_details.image[0]}
                          alt={order.items[0].product_details.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-100 shadow-xs"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
                              {order.items[0].product_details.name}
                              {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                            </h2>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                              <p className="text-xs text-gray-500">
                                <span className="font-medium">#{order.orderId.slice(-8)}</span>
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <LuCalendar size={12} />
                                {formatDate(order.createdAt)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                              isOngoing ? 'bg-amber-50 text-amber-800 border border-amber-100' : 'bg-green-50 text-green-800 border border-green-100'
                            }`}>
                              {getStatusIcon(orderStatus, 14)}
                              <span className="capitalize">{orderStatus}</span>
                            </div>
                            <div className="mt-2 text-base font-bold text-gray-900">
                              {DisplayPriceInRupees(order.totalAmt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <StatusTimeline status={orderStatus} />
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-xs">
                          <h4 className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
                            <LuTruck className="text-indigo-500" size={14} />
                            Delivery Information
                          </h4>
                          <div className="space-y-2 text-sm text-gray-800">
                            <p>{order.delivery_address.address_line}</p>
                            <p>{order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}</p>
                            <p>{order.delivery_address.country}</p>
                            <p className="mt-3"><strong>Contact:</strong> +91 {order.delivery_address.mobile}</p>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-xs">
                          <h4 className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
                            <LuFileText className="text-blue-500" size={14} />
                            Order Summary
                          </h4>
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                <div className="flex gap-3">
                                  <img 
                                    src={item.product_details.image[0]} 
                                    alt={item.product_details.name}
                                    className="w-12 h-12 object-cover rounded border border-gray-100"
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{item.product_details.name}</p>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                      <span>{DisplayPriceInRupees(item.pricePerUnit)} × {item.quantity}</span>
                                      <span className="font-medium">{DisplayPriceInRupees(item.totalAmt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs">
                                      {getStatusIcon(item.status, 12)}
                                      <span className="capitalize">{item.status}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-sm text-gray-700">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>{DisplayPriceInRupees(order.subtotalAmt)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping:</span>
                              <span>{DisplayPriceInRupees(order.totalAmt - order.subtotalAmt)}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                              <span>Total:</span>
                              <span>{DisplayPriceInRupees(order.totalAmt)}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              Payment Method: {order.payment_status}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyOrder;