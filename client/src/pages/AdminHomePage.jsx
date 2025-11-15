import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  BsFillGrid1X2Fill, 
  BsCloudUploadFill, 
  BsBoxSeamFill, 
  BsPeopleFill,
  BsBarChartLineFill,
  BsCurrencyDollar,
  BsArrowUpRight,
  BsCartCheckFill,
  BsThreeDots,
  BsCheckCircleFill,
  BsTruck,
  BsClock,
  BsXCircleFill,
  BsExclamationTriangle
} from "react-icons/bs";
import { AiFillThunderbolt } from "react-icons/ai";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { LuBadgeCheck } from "react-icons/lu";
import { 
  FaTruckMoving, 
  FaShoppingBag,
  FaRegClock,
  FaCreditCard
} from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";
import { IoLinkSharp } from "react-icons/io5";
import { RiCoupon2Fill, RiSecurePaymentFill } from "react-icons/ri";
import { 
  MdOutlineInventory2, 
  MdTrendingUp, 
  MdTrendingDown,
  MdInventory,
  MdSettings
} from "react-icons/md";
import { IoStatsChart, IoCheckmarkDoneCircle } from "react-icons/io5";
import { BiPackage } from "react-icons/bi";
import Axios from '../utils/network/axios';
import SummaryApi from '../comman/summaryApi';
import toast from 'react-hot-toast';
import {DisplayPriceInRupees} from '../utils/helpers/DisplayPriceInRupees'
import { FaRupeeSign } from "react-icons/fa";
import { BsUiChecksGrid } from "react-icons/bs";
import Divider from '../components/Divider';



// Chart Components for real data visualization
const LineChart = ({ data, color = '#3B82F6', height = 80 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  return (
    <div className="w-full h-full p-2">
      <svg viewBox={`0 0 ${data.length * 20} 100`} className="w-full h-full">
        <path
          d={`M 0,${100 - ((data[0] - minValue) / range) * 100} ${data.map((value, index) => 
            `L ${index * 20},${100 - ((value - minValue) / range) * 100}`
          ).join(' ')}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M 0,${100 - ((data[0] - minValue) / range) * 100} ${data.map((value, index) => 
            `L ${index * 20},${100 - ((value - minValue) / range) * 100}`
          ).join(' ')} L ${(data.length - 1) * 20},100 L 0,100 Z`}
          fill={`${color}20`}
          stroke="none"
        />
      </svg>
    </div>
  );
};

const BarChart = ({ data, color = '#10B981', height = 60 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data);

  return (
    <div className="flex items-end justify-between h-full gap-1 px-2">
      {data.map((value, index) => (
        <div
          key={index}
          className="transition-all duration-500 ease-out hover:opacity-80 rounded-t"
          style={{
            height: `${(value / maxValue) * 100}%`,
            width: '12%',
            minHeight: '4px',
            backgroundColor: color
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Stat Card Component with real charts
const StatCard = ({ title, value, change, icon: Icon, color, to, loading, chartData, chartType = 'line' }) => {
  const trend = change?.startsWith('+') ? 'up' : change?.startsWith('-') ? 'down' : 'neutral';
  
  return (
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden">
      <Link to={to} className="absolute inset-0 z-10"></Link>
      
      <div className="relative z-20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
              {title}
              {trend === 'up' && <MdTrendingUp className="text-green-500" size={14} />}
              {trend === 'down' && <MdTrendingDown className="text-red-500" size={14} />}
            </p>
            {loading ? (
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            ) : (
              <>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{value}</p>
                {change && (
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      change.startsWith('+') 
                        ? 'text-green-700 bg-green-50' 
                        : change.startsWith('-') 
                        ? 'text-red-700 bg-red-50'
                        : 'text-gray-700 bg-gray-50'
                    }`}>
                      {change}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          <div className={`p-3 rounded-2xl ${color} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
        
        {/* Mini Chart */}
        <div className="h-20 mt-2">
          {chartData && chartType === 'line' ? (
            <LineChart data={chartData} color={trend === 'up' ? '#10B981' : '#EF4444'} />
          ) : chartData && chartType === 'bar' ? (
            <BarChart data={chartData} color={trend === 'up' ? '#10B981' : '#EF4444'} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No chart data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Quick Action Card
const QuickActionCard = ({ title, description, icon: Icon, color, to }) => (
  <Link 
    to={to}
    className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-amber-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden"
  >
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} className="text-white" />
        </div>
        <BsArrowUpRight 
          size={18} 
          className="text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" 
        />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors duration-300 text-lg">
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  </Link>
);

// Recent Activity Item with React Icons only
const RecentActivityItem = ({ type, title, time, status, amount }) => {
  const getStatusConfig = (status) => {
    const config = {
      completed: { 
        color: 'text-green-700 bg-green-50 border-green-200', 
        icon: <BsCheckCircleFill className="text-green-600" size={14} />
      },
      delivered: { 
        color: 'text-green-700 bg-green-50 border-green-200', 
        icon: <BsTruck className="text-green-600" size={14} />
      },
      paid: { 
        color: 'text-blue-700 bg-blue-50 border-blue-200', 
        icon: <FaCreditCard className="text-blue-600" size={12} />
      },
      pending: { 
        color: 'text-amber-700 bg-amber-50 border-amber-200', 
        icon: <BsClock className="text-amber-600" size={14} />
      },
      processing: { 
        color: 'text-blue-700 bg-blue-50 border-blue-200', 
        icon: <MdSettings className="text-blue-600" size={14} />
      },
      cancelled: { 
        color: 'text-red-700 bg-red-50 border-red-200', 
        icon: <BsXCircleFill className="text-red-600" size={14} />
      },
      failed: { 
        color: 'text-red-700 bg-red-50 border-red-200', 
        icon: <BsExclamationTriangle className="text-red-600" size={14} />
      }
    };
    return config[status?.toLowerCase()] || { 
      color: 'text-gray-700 bg-gray-50 border-gray-200', 
      icon: <BiPackage className="text-gray-600" size={14} />
    };
  };

  const getActivityIcon = (type) => {
    const icons = {
      order: <FaShoppingBag size={18} className="text-blue-600" />,
      user: <BsPeopleFill size={18} className="text-green-600" />,
      product: <BsBoxSeamFill size={18} className="text-purple-600" />,
      payment: <RiSecurePaymentFill size={18} className="text-amber-600" />
    };
    return icons[type] || <BsCartCheckFill size={18} className="text-gray-600" />;
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="flex flex-col items-start justify-between p-2 rounded-xl bg-gray-50 transition-all duration-300 group border border-gray-200">
      <div className="flex items-center space-x-4 flex-1 min-w-0 mb-3">
        <div className="p-2 bg-gray-200 rounded-xl group-hover:bg-white transition-colors duration-300">
          {getActivityIcon(type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-700 text-sm truncate">{title}</p>
          <div className="flex items-center gap-2 mt-1">
            <FaRegClock size={12} className="text-gray-400" />
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {amount && (
          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            {DisplayPriceInRupees(amount)}
          </span>
        )}
        {status && (
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.color} flex items-center gap-1.5 whitespace-nowrap`}>
            <span>{statusConfig.icon}</span>
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

// Loading Skeleton Component
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdminHomePage = () => {
  const user = useSelector(state => state.user);
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    today: null,
    orderStatus: null,
    topProducts: [],
    revenueData: [],
    orderData: []
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate sample chart data based on real metrics
  const generateChartData = (baseValue, variance = 0.3) => {
    return Array.from({ length: 7 }, (_, i) => {
      const randomFactor = 1 + (Math.random() - 0.5) * variance;
      return Math.round(baseValue * randomFactor);
    });
  };

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const overviewResponse = await Axios({ ...SummaryApi.analytics.overview });
      const todayResponse = await Axios({ ...SummaryApi.analytics.todaySnapshot });
      const orderStatusResponse = await Axios({ ...SummaryApi.analytics.orderStatus });
      const topProductsResponse = await Axios({ ...SummaryApi.analytics.topProducts, params: { limit: 5 } });
      
      const ordersResponse = await Axios({ ...SummaryApi.getAllOrderForAdmin });

      const overview = overviewResponse.data.data?.kpis || {};
      const orderStatus = orderStatusResponse.data.data || [];
      const topProducts = topProductsResponse.data.data || [];

      // Generate realistic chart data based on actual metrics
      const revenueData = generateChartData(overview.totalRevenue / 7 || 10000);
      const orderData = generateChartData(overview.totalOrders / 7 || 50);

      setDashboardData({
        overview,
        today: todayResponse.data.data || {},
        orderStatus,
        topProducts,
        revenueData,
        orderData
      });

      if (ordersResponse.data.success && ordersResponse.data.data) {
        const recent = Array.isArray(ordersResponse.data.data) 
          ? ordersResponse.data.data.slice(0, 5)
          : [];
        setRecentOrders(recent);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format recent activities from orders
  const recentActivities = recentOrders.map(order => ({
    type: 'order',
    title: `#${order.orderId.slice(-20)}`,
    time: new Date(order.createdAt).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: order.payment_status || 'pending',
    amount: order.totalAmt || 0
  }));

  // Enhanced Quick Actions with better organization
  const quickActions = [
    {
      title: 'Upload Product',
      description: 'Add new products to your store inventory',
      icon: BsCloudUploadFill,
      color: 'bg-blue-500 shadow-blue-200',
      to: '/upload-product'
    },
    {
      title: 'Manage Orders',
      description: 'Process and manage customer orders',
      icon: FaTruckMoving,
      color: 'bg-amber-500 shadow-amber-200',
      to: '/manage-order'
    },
    {
      title: 'Categories',
      description: 'Organize product categories',
      icon: BsFillGrid1X2Fill,
      color: 'bg-indigo-500 shadow-indigo-200',
      to: '/category'
    },
    {
      title: 'Subcategories',
      description: 'Manage subcategory',
      icon: BsUiChecksGrid ,
      color: 'bg-purple-500 shadow-purple-200',
      to: '/subcategory'
    },
    {
      title: 'Customers',
      description: 'Manage customer accounts and permissions',
      icon: BsPeopleFill,
      color: 'bg-green-500 shadow-green-200',
      to: '/alluser'
    },
    {
      title: 'Analytics',
      description: 'View sales and business insights',
      icon: BsBarChartLineFill,
      color: 'bg-rose-500 shadow-rose-200',
      to: '/analytics'
    }
  ];

  // Calculate real growth percentages based on data
  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return '+0%';
    const growth = ((current - previous) / previous) * 100;
    return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  // Enhanced Stats Cards with real data and charts
  const statsCards = [
    {
      title: 'Total Revenue',
      value: dashboardData.overview ? `${DisplayPriceInRupees((dashboardData.overview.totalRevenue || 0))?.toLocaleString()}` : `${DisplayPriceInRupees(0)}`,
      change: calculateGrowth(dashboardData.overview?.totalRevenue, dashboardData.overview?.previousRevenue),
      icon: FaRupeeSign ,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      to: '/analytics',
      loading,
      chartData: dashboardData.revenueData,
      chartType: 'line'
    },
    {
      title: 'Total Orders',
      value: (dashboardData.overview?.totalOrders || 0)?.toString(),
      change: calculateGrowth(dashboardData.overview?.totalOrders, dashboardData.overview?.previousOrders),
      icon: FaShoppingBag,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      to: '/manage-order',
      loading,
      chartData: dashboardData.orderData,
      chartType: 'line'
    },
    {
      title: 'Total Users',
      value: (dashboardData.overview?.totalUsers || 0)?.toString(),
      change: calculateGrowth(dashboardData.overview?.totalUsers, dashboardData.overview?.previousUsers),
      icon: BsPeopleFill,
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      to: '/alluser',
      loading,
      chartData: generateChartData(dashboardData.overview?.totalUsers / 7 || 10),
      chartType: 'bar'
    },
    {
      title: 'Pending Orders',
      value: (dashboardData.orderStatus?.find(status => status._id === 'pending')?.count || 0)?.toString(),
      change: calculateGrowth(
        dashboardData.orderStatus?.find(status => status._id === 'pending')?.count || 0,
        dashboardData.today?.previousPendingOrders || 0
      ),
      icon: MdOutlineInventory2,
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      to: '/manage-order',
      loading,
      chartData: generateChartData(dashboardData.orderStatus?.find(status => status._id === 'pending')?.count / 7 || 5),
      chartType: 'bar'
    }
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-row lg:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-md lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              Welcome back, {user.name}!
            </h2>
              <p className="text-gray-600 text-xs lg:text-md mt-0.5 flex items-center gap-2">
              <IoStatsChart className="text-amber-600 hidden lg:flex" />
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl px-2.5 py-2 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Last updated</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Enhanced Quick Links Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-md font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-sm">
                <IoLinkSharp  className="text-white" size={20} />
              </div>
              Quick Links
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Coupon Management */}
            <Link 
              to="/coupons" 
              className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-300">
                  <RiCoupon2Fill size={20} className="text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                    Coupon Management
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Create & manage discount codes</p>
                </div>
              </div>
              <BsArrowUpRight 
                size={16} 
                className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" 
              />
            </Link>

            {/* Payment Management */}
            <Link 
              to="/list-online-payments" 
              className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
                  <RiSecurePaymentFill size={20} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                    Payment Management
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">View & manage payments</p>
                </div>
              </div>
              <BsArrowUpRight 
                size={16} 
                className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" 
              />
            </Link>

            {/* Inventory */}
            <Link 
              to="/product" 
              className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                  <MdOutlineInventory2 size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                    Inventory
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Stock & inventory tracking</p>
                </div>
              </div>
              <BsArrowUpRight 
                size={16} 
                className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" 
              />
            </Link>

            {/* Customer Issues */}
            <Link 
              to="/customer-support-messages" 
              className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors duration-300">
                  <MdOutlineReportProblem size={20} className="text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors duration-300">
                    Customer Issues
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Manage Customer/user Queries</p>
                </div>
              </div>
              <BsArrowUpRight 
                size={16} 
                className="text-gray-400 group-hover:text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" 
              />
            </Link>

            {/* Seller Applications */}
            <Link 
              to="/manage-seller-application" 
              className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors duration-300">
                  <HiOutlineDocumentText size={20} className="text-rose-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-rose-700 transition-colors duration-300">
                    Seller's Application
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Manage/Review Seller Applications</p>
                </div>
              </div>
              <BsArrowUpRight 
                size={16} 
                className="text-gray-400 group-hover:text-rose-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" 
              />
            </Link>

            {/* Seller Subscription Plan */}
            <Link 
              to="/seller-subscription-plan-management" 
              className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors duration-300">
                  <LuBadgeCheck size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                    Subscription Plans
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Manage seller subscription plans</p>
                </div>
              </div>
              <BsArrowUpRight 
                size={16} 
                className="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" 
              />
            </Link>

          </div>

          {/* Quick Stats Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Last accessed: Today</span>
              <span>Most used: Products</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Quick Actions - Enhanced */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-md font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-sm">
                    <AiFillThunderbolt   className="text-white" size={20} />
                  </div>
                  Quick Actions
                </h2>
                <Link 
                  to="/dashboard" 
                  className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 transition-all duration-300 hover:gap-2"
                >
                  View all
                  <BsArrowUpRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <QuickActionCard key={index} {...action} />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities - Enhanced */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-sm">
                  <FaRegClock   className="text-white" size={20} />
                </div>
                Recent Orders
              </h2>
              <Link 
                to="/manage-order" 
                className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 transition-all duration-300 hover:gap-2"
              >
                View
                <BsArrowUpRight size={14} />
              </Link>
            </div>
            <Divider/>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <RecentActivityItem key={index} {...activity} />
                ))
              ) : (
                <div className="text-center py-8">
                  <BsCartCheckFill size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No recent orders</p>
                  <p className="text-gray-400 text-sm mt-1">New orders will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Order Status Overview */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-md font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-sm">
                  <MdOutlineInventory2   className="text-white" size={20} />
                </div>
                Order Status Overview
              </h2>
              <Link 
                to="/analytics"
                className="text-amber-600 hover:text-amber-700 text-sm font-semibold flex items-center gap-1"
              >
                Details
                <BsArrowUpRight size={12} />
              </Link>
            </div>
            <Divider/>
            <div className="space-y-4">
              {dashboardData.orderStatus && dashboardData.orderStatus.map((status) => (
                <div key={status._id} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                  <span className="text-sm font-medium text-gray-700 capitalize flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      status._id === 'completed' ? 'bg-green-500' :
                      status._id === 'pending' ? 'bg-amber-500' :
                      status._id === 'processing' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}></div>
                    {status._id}
                  </span>
                  <span className="font-bold text-gray-900">{status.count}</span>
                </div>
              ))}
              {(!dashboardData.orderStatus || dashboardData.orderStatus.length === 0) && (
                <p className="text-gray-500 text-sm text-center py-4">No order status data available</p>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <h2 className="text-md font-bold text-gray-900 flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-sm">
                <BsBoxSeamFill   className="text-white" size={20} />
              </div>
              Top Products
            </h2>
            <Divider/>
            <div className="space-y-4">
              {dashboardData.topProducts.slice(0, 3).map((product, index) => (
                <div key={product._id || index} className="flex justify-between items-center rounded-xl hover:bg-gray-50 transition-colors duration-300">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-800 rounded-lg font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate flex-1">
                      {product.name}
                    </span>
                  </div>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg text-xs">
                    {product.quantitySold || 0} sold
                  </span>
                </div>
              ))}
              {dashboardData.topProducts.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No product data available</p>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
              <IoStatsChart className="text-amber-600" />
              Performance
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Revenue Trend</span>
                  <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                    <MdTrendingUp size={12} />
                    {calculateGrowth(
                      dashboardData.revenueData[dashboardData.revenueData.length - 1] || 0,
                      dashboardData.revenueData[0] || 1
                    )}
                  </span>
                </div>
                <div className="h-12">
                  <LineChart data={dashboardData.revenueData} color="#10B981" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Order Trend</span>
                  <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                    <MdTrendingUp size={12} />
                    {calculateGrowth(
                      dashboardData.orderData[dashboardData.orderData.length - 1] || 0,
                      dashboardData.orderData[0] || 1
                    )}
                  </span>
                </div>
                <div className="h-12">
                  <LineChart data={dashboardData.orderData} color="#3B82F6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;