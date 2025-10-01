// server/controllers/analytics.controller.js
import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import CategoryModel from "../models/category.model.js";
import CartproductModel from "../models/cartproduct.model.js";
import AnalyticsModel from "../models/Analytics.model.js";

// Helper function to calculate date ranges
const getDateRange = (period) => {
  const now = new Date();
  let startDate = new Date();
  
  switch(period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(now.getMonth() - 1);
  }
  
  return { startDate, endDate: new Date() };
};

// Helper function to format dates for grouping
const formatDateForGrouping = (date, period) => {
  const d = new Date(date);
  switch(period) {
    case 'today':
      return d.toISOString().slice(0, 13) + ':00:00'; // Hourly
    case 'week':
      return d.toISOString().split('T')[0]; // Daily
    case 'month':
      return `${d.getFullYear()}-${d.getMonth() + 1}`; // Monthly
    case 'year':
      return d.getFullYear().toString(); // Yearly
    default:
      return d.toISOString().split('T')[0]; // Daily
  }
};

// Cache for frequently accessed data
const analyticsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get sales analytics
export async function getSalesAnalyticsController(req, res) {
  try {
    const { period = 'month', startDate: startDateStr, endDate: endDateStr } = req.query;
    
    // Generate cache key
    const cacheKey = `sales_${period}_${startDateStr}_${endDateStr}`;
    
    // Check cache
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      return res.status(200).json(cachedData.data);
    }
    
    let dateRange;
    if (startDateStr && endDateStr) {
      dateRange = {
        startDate: new Date(startDateStr),
        endDate: new Date(endDateStr)
      };
    } else {
      dateRange = getDateRange(period);
    }
    
    // Get orders in the date range
    const orders = await OrderModel.find({
      createdAt: { 
        $gte: dateRange.startDate, 
        $lte: dateRange.endDate 
      },
      payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
    }).populate('items.product').populate('userId', 'name email');

    // Calculate order status counts
    const orderStatusCounts = {
      confirmed: 0,
      packed: 0,
      shipped: 0,
      delivered: 0
    };

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.status) {
          orderStatusCounts[item.status] = (orderStatusCounts[item.status] || 0) + 1;
        }
      });
    });

    // Calculate analytics
    const totalSales = orders.reduce((sum, order) => sum + (order.totalAmt || 0), 0);
    const onlinePayments = orders
      .filter(order => order.payment_status === 'completed')
      .reduce((sum, order) => sum + (order.totalAmt || 0), 0);
    const codPayments = orders
      .filter(order => order.payment_status === 'CASH ON DELIVERY')
      .reduce((sum, order) => sum + (order.totalAmt || 0), 0);
    
    // Get sales by product
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product?._id?.toString() || item.product;
        if (productId) {
          if (!productSales[productId]) {
            productSales[productId] = {
              name: item.product_details?.name || 'Unknown Product',
              quantity: 0,
              revenue: 0,
              productId: productId
            };
          }
          productSales[productId].quantity += item.quantity || 0;
          productSales[productId].revenue += (item.pricePerUnit || 0) * (item.quantity || 0);
        }
      });
    });
    
    // Convert to array and sort by revenue
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    // Get sales over time for chart
    const salesOverTime = {};
    orders.forEach(order => {
      if (order.createdAt) {
        const dateKey = formatDateForGrouping(order.createdAt, period);
        if (!salesOverTime[dateKey]) {
          salesOverTime[dateKey] = 0;
        }
        salesOverTime[dateKey] += order.totalAmt || 0;
      }
    });
    
    // Convert to array and sort by date
    const salesOverTimeArray = Object.entries(salesOverTime)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Get recent orders for quick view
    const recentOrders = await OrderModel.find({
      payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('userId', 'name email')
    .select('orderId totalAmt payment_status createdAt items');

    // Calculate conversion rate (orders vs cart additions)
    const cartAdditions = await CartproductModel.countDocuments({
      createdAt: { 
        $gte: dateRange.startDate, 
        $lte: dateRange.endDate 
      }
    });
    
    const conversionRate = cartAdditions > 0 
      ? (orders.length / cartAdditions) * 100 
      : 0;

    // Get previous period for comparison
    const prevStartDate = new Date(dateRange.startDate);
    const prevEndDate = new Date(dateRange.endDate);
    const timeDiff = prevEndDate - prevStartDate;
    
    prevStartDate.setTime(prevStartDate.getTime() - timeDiff - 1);
    prevEndDate.setTime(prevEndDate.getTime() - timeDiff - 1);
    
    const prevOrders = await OrderModel.countDocuments({
      createdAt: { 
        $gte: prevStartDate, 
        $lte: prevEndDate 
      },
      payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
    });
    
    const prevSales = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: prevStartDate, $lte: prevEndDate },
          payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmt" }
        }
      }
    ]);
    
    const prevTotalSales = prevSales[0]?.total || 0;
    const salesGrowth = prevTotalSales > 0 
      ? ((totalSales - prevTotalSales) / prevTotalSales) * 100 
      : totalSales > 0 ? 100 : 0;
    
    const orderGrowth = prevOrders > 0 
      ? ((orders.length - prevOrders) / prevOrders) * 100 
      : orders.length > 0 ? 100 : 0;

    const responseData = {
      success: true,
      message: "Sales analytics fetched successfully",
      data: {
        totalSales,
        onlinePayments,
        codPayments,
        totalOrders: orders.length,
        topProducts,
        orderStatusCounts,
        salesOverTime: salesOverTimeArray,
        recentOrders,
        pendingOrders: await OrderModel.countDocuments({ 
          payment_status: 'pending',
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
        }),
        conversionRate: conversionRate.toFixed(2),
        salesGrowth: salesGrowth.toFixed(2),
        orderGrowth: orderGrowth.toFixed(2),
        averageOrderValue: orders.length > 0 ? totalSales / orders.length : 0
      }
    };

    // Cache the response
    analyticsCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData
    });

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Sales analytics error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Get inventory analytics
export async function getInventoryAnalyticsController(req, res) {
  try {
    const { lowStock = false, outOfStock = false, search = '' } = req.query;
    
    // Generate cache key
    const cacheKey = `inventory_${lowStock}_${outOfStock}_${search}`;
    
    // Check cache
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      return res.status(200).json(cachedData.data);
    }
    
    let query = {};
    if (lowStock) {
      query.stock = { $gt: 0, $lte: 10 };
    }
    if (outOfStock) {
      query.stock = { $lte: 0 };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await ProductModel.find(query).populate('category', 'name');
    const totalProducts = await ProductModel.countDocuments();
    const outOfStockCount = await ProductModel.countDocuments({ stock: { $lte: 0 } });
    const lowStockCount = await ProductModel.countDocuments({ stock: { $gt: 0, $lte: 10 } });
    
    const categories = await CategoryModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products"
        }
      },
      {
        $project: {
          name: 1,
          productCount: { $size: "$products" },
          totalValue: {
            $sum: {
              $map: {
                input: "$products",
                as: "product",
                in: { $multiply: ["$$product.price", "$$product.stock"] }
              }
            }
          }
        }
      }
    ]);
    
    // Calculate inventory value
    const totalInventoryValue = products.reduce((sum, product) => 
      sum + (product.price || 0) * (product.stock || 0), 0);

    // Get low stock products for quick view
    const lowStockProducts = await ProductModel.find({ stock: { $gt: 0, $lte: 10 } })
      .limit(10)
      .select('name price stock category')
      .populate('category', 'name');
    
    // Calculate inventory turnover (simplified)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const salesLast30Days = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          totalSold: { $sum: "$items.quantity" }
        }
      }
    ]);
    
    const totalSold = salesLast30Days[0]?.totalSold || 0;
    const averageInventory = totalInventoryValue / 2; // Simplified average
    const inventoryTurnover = averageInventory > 0 ? totalSold / averageInventory : 0;

    const responseData = {
      success: true,
      message: "Inventory analytics fetched successfully",
      data: {
        totalProducts,
        outOfStock: outOfStockCount,
        lowStock: lowStockCount,
        categories,
        totalInventoryValue,
        inventoryTurnover: inventoryTurnover.toFixed(2),
        products: products.slice(0, 50), // Limit for performance
        lowStockProducts
      }
    };

    // Cache the response
    analyticsCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData
    });

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Inventory analytics error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Get customer analytics
export async function getCustomerAnalyticsController(req, res) {
  try {
    const { period = 'month', search = '' } = req.query;
    const dateRange = getDateRange(period);
    
    // Generate cache key
    const cacheKey = `customers_${period}_${search}`;
    
    // Check cache
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      return res.status(200).json(cachedData.data);
    }
    
    let userQuery = { role: "USER" };
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get user registrations over time
    const userRegistrations = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
          ...userQuery
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get total user counts
    const totalUsers = await UserModel.countDocuments(userQuery);
    const activeUsers = await UserModel.countDocuments({ 
      ...userQuery, 
      status: "Active",
      last_login_date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Active in last 30 days
    });
    const inactiveUsers = await UserModel.countDocuments({ 
      ...userQuery, 
      status: "Inactive" 
    });
    
    // Get new users in the selected period
    const newUsers = await UserModel.countDocuments({ 
      ...userQuery,
      createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate } 
    });

    // Get top customers by order value
    const topCustomers = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
          payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
        }
      },
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$totalAmt" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          name: "$user.name",
          email: "$user.email",
          totalSpent: 1,
          orderCount: 1,
          lastOrderDate: { $max: "$createdAt" }
        }
      }
    ]);
    
    // Get customer lifetime value (CLV) data
    const clvData = await OrderModel.aggregate([
      {
        $match: {
          payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
        }
      },
      {
        $group: {
          _id: "$userId",
          totalRevenue: { $sum: "$totalAmt" },
          orderCount: { $sum: 1 },
          firstOrder: { $min: "$createdAt" },
          lastOrder: { $max: "$createdAt" }
        }
      },
      {
        $project: {
          userId: "$_id",
          totalRevenue: 1,
          orderCount: 1,
          lifetime: {
            $divide: [
              { $subtract: ["$lastOrder", "$firstOrder"] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          }
        }
      },
      {
        $match: {
          lifetime: { $gt: 0 } // Exclude customers with only one order
        }
      },
      {
        $group: {
          _id: null,
          avgClv: { $avg: "$totalRevenue" },
          avgOrders: { $avg: "$orderCount" },
          avgLifetime: { $avg: "$lifetime" }
        }
      }
    ]);
    
    // Get recent customers
    const recentCustomers = await UserModel.find(userQuery)
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt status last_login_date');
    
    // Calculate retention rate
    const returningCustomers = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
          payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
        }
      },
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 }
        }
      },
      {
        $match: {
          orderCount: { $gt: 1 }
        }
      },
      {
        $count: "returningCustomers"
      }
    ]);
    
    const retentionRate = totalUsers > 0 
      ? ((returningCustomers[0]?.returningCustomers || 0) / totalUsers) * 100 
      : 0;

    const responseData = {
      success: true,
      message: "Customer analytics fetched successfully",
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        newUsers,
        userRegistrations,
        topCustomers,
        recentCustomers,
        retentionRate: retentionRate.toFixed(2),
        avgCustomerValue: clvData[0]?.avgClv || 0,
        avgOrdersPerCustomer: clvData[0]?.avgOrders || 0,
        avgCustomerLifetime: clvData[0]?.avgLifetime || 0
      }
    };

    // Cache the response
    analyticsCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData
    });

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Customer analytics error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Get revenue analytics
export async function getRevenueAnalyticsController(req, res) {
  try {
    const { period = 'month' } = req.query;
    const dateRange = getDateRange(period);
    
    // Generate cache key
    const cacheKey = `revenue_${period}`;
    
    // Check cache
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      return res.status(200).json(cachedData.data);
    }
    
    // Get revenue data
    const revenueData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
          payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmt" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Calculate averages
    const totalRevenue = revenueData.reduce((sum, day) => sum + (day.totalRevenue || 0), 0);
    const totalOrders = revenueData.reduce((sum, day) => sum + (day.orderCount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calculate growth compared to previous period
    const previousStartDate = new Date(dateRange.startDate);
    const periodDiff = period === 'year' ? 365 : period === 'quarter' ? 90 : period === 'month' ? 30 : period === 'week' ? 7 : 1;
    previousStartDate.setDate(previousStartDate.getDate() - periodDiff);
    
    const previousRevenueData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: previousStartDate, $lt: dateRange.startDate },
          payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmt" },
          orderCount: { $sum: 1 }
        }
      }
    ]);
    
    const previousRevenue = previousRevenueData[0]?.totalRevenue || 0;
    const previousOrders = previousRevenueData[0]?.orderCount || 0;
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;
    
    const orderGrowth = previousOrders > 0
      ? ((totalOrders - previousOrders) / previousOrders) * 100
      : 0;

    // Revenue by category
    const revenueByCategory = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
          payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
        }
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category.name",
          totalRevenue: { $sum: { $multiply: ["$items.pricePerUnit", "$items.quantity"] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Revenue by payment method
    const revenueByPaymentMethod = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
          payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
        }
      },
      {
        $group: {
          _id: "$payment_status",
          totalRevenue: { $sum: "$totalAmt" },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    // Calculate profit margin (simplified - assuming 30% cost of goods sold)
    const costOfGoodsSold = totalRevenue * 0.3;
    const grossProfit = totalRevenue - costOfGoodsSold;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const responseData = {
      success: true,
      message: "Revenue analytics fetched successfully",
      data: {
        revenueData,
        averageOrderValue: Math.round(averageOrderValue),
        totalRevenue,
        totalOrders,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        orderGrowth: Math.round(orderGrowth * 100) / 100,
        revenueByCategory,
        revenueByPaymentMethod,
        grossProfit: Math.round(grossProfit),
        profitMargin: Math.round(profitMargin * 100) / 100
      }
    };

    // Cache the response
    analyticsCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData
    });

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Revenue analytics error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Get performance analytics
export async function getPerformanceAnalyticsController(req, res) {
  try {
    const { period = 'month' } = req.query;
    const dateRange = getDateRange(period);
    
    // Generate cache key
    const cacheKey = `performance_${period}`;
    
    // Check cache
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      return res.status(200).json(cachedData.data);
    }
    
    // Get conversion rates (orders vs cart additions)
    const orders = await OrderModel.countDocuments({
      createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
      payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
    });
    
    const cartAdditions = await CartproductModel.countDocuments({
      createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
    });
    
    const conversionRate = cartAdditions > 0 ? (orders / cartAdditions) * 100 : 0;

    // Get average order processing time
    const processingTimes = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
          payment_status: { $in: ['completed', 'CASH ON DELIVERY'] },
          updatedAt: { $exists: true }
        }
      },
      {
        $project: {
          processingTime: {
            $divide: [
              { $subtract: ["$updatedAt", "$createdAt"] },
              1000 * 60 * 60 // Convert to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgProcessingTime: { $avg: "$processingTime" }
        }
      }
    ]);

    // Get customer retention rate
    const returningCustomers = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
          payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
        }
      },
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 }
        }
      },
      {
        $match: {
          orderCount: { $gt: 1 }
        }
      },
      {
        $count: "returningCustomers"
      }
    ]);

    const totalCustomers = await OrderModel.distinct("userId", {
      createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
      payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
    });

    const retentionRate = totalCustomers.length > 0 
      ? ((returningCustomers[0]?.returningCustomers || 0) / totalCustomers.length) * 100 
      : 0;

    // Get popular products (based on cart additions)
    const popularProducts = await CartproductModel.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
        }
      },
      {
        $group: {
          _id: "$productId",
          cartAdds: { $sum: 1 }
        }
      },
      { $sort: { cartAdds: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          cartAdds: 1,
          image: { $arrayElemAt: ["$product.image", 0] }
        }
      }
    ]);

    // Calculate inventory performance
    const inventoryPerformance = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          outOfStock: {
            $sum: {
              $cond: [{ $lte: ["$stock", 0] }, 1, 0]
            }
          },
          lowStock: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", 10] }] },
                1, 0
              ]
            }
          }
        }
      }
    ]);

    const responseData = {
      success: true,
      message: "Performance analytics fetched successfully",
      data: {
        conversionRate: Math.round(conversionRate * 100) / 100,
        avgProcessingTime: Math.round(processingTimes[0]?.avgProcessingTime || 0),
        retentionRate: Math.round(retentionRate * 100) / 100,
        totalOrders: orders,
        returningCustomers: returningCustomers[0]?.returningCustomers || 0,
        popularProducts,
        inventoryPerformance: inventoryPerformance[0] || {
          totalProducts: 0,
          outOfStock: 0,
          lowStock: 0
        }
      }
    };

    // Cache the response
    analyticsCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData
    });

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Performance analytics error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Get dashboard stats
export async function getDashboardStatsController(req, res) {
  try {
    // Generate cache key
    const cacheKey = 'dashboard_stats';
    
    // Check cache
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      return res.status(200).json(cachedData.data);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      todayOrders,
      todayRevenue,
      totalProducts,
      lowStockProducts,
      newUsersToday,
      pendingOrdersCount,
      orderStatusCounts,
      weeklyRevenue,
      totalUsers
    ] = await Promise.all([
      OrderModel.countDocuments({ 
        createdAt: { $gte: today, $lt: tomorrow },
        payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
      }),
      OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: today, $lt: tomorrow },
            payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmt" }
          }
        }
      ]),
      ProductModel.countDocuments(),
      ProductModel.countDocuments({ stock: { $gt: 0, $lte: 10 } }),
      UserModel.countDocuments({ 
        createdAt: { $gte: today, $lt: tomorrow },
        role: "USER"
      }),
      OrderModel.countDocuments({ payment_status: 'pending' }),
      OrderModel.aggregate([
        {
          $match: {
            payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
          }
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.status",
            count: { $sum: 1 }
          }
        }
      ]),
      OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
            payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmt" }
          }
        }
      ]),
      UserModel.countDocuments({ role: "USER" })
    ]);

    const statusCounts = {
      confirmed: 0,
      packed: 0,
      shipped: 0,
      delivered: 0
    };

    orderStatusCounts.forEach(item => {
      if (item._id && statusCounts.hasOwnProperty(item._id)) {
        statusCounts[item._id] = item.count;
      }
    });

    // Calculate week-over-week growth
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const prevWeekRevenue = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: twoWeeksAgo, $lt: sevenDaysAgo },
          payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmt" }
        }
      }
    ]);
    
    const currentWeekRevenue = weeklyRevenue[0]?.total || 0;
    const previousWeekRevenue = prevWeekRevenue[0]?.total || 0;
    const revenueGrowth = previousWeekRevenue > 0 
      ? ((currentWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100 
      : currentWeekRevenue > 0 ? 100 : 0;

    const responseData = {
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        todayOrders,
        todayRevenue: todayRevenue[0]?.total || 0,
        totalProducts,
        lowStockProducts,
        newUsersToday,
        pendingOrdersCount,
        orderStatusCounts: statusCounts,
        weeklyRevenue: currentWeekRevenue,
        totalUsers,
        revenueGrowth: revenueGrowth.toFixed(2)
      }
    };

    // Cache the response
    analyticsCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData
    });

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Get products by filter
export async function getProductsByFilterController(req, res) {
  try {
    const { filter, search = '', limit = 20, page = 1 } = req.query;
    
    // Generate cache key
    const cacheKey = `products_${filter}_${search}_${limit}_${page}`;
    
    // Check cache
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      return res.status(200).json(cachedData.data);
    }
    
    let query = {};
    
    switch(filter) {
      case 'low-stock':
        query.stock = { $gt: 0, $lte: 10 };
        break;
      case 'out-of-stock':
        query.stock = { $lte: 0 };
        break;
      case 'all':
      default:
        break;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const products = await ProductModel.find(query)
      .populate('category', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ stock: 1, name: 1 });

    const total = await ProductModel.countDocuments(query);

    const responseData = {
      success: true,
      message: "Products fetched successfully",
      data: {
        products,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      }
    };

    // Cache the response
    analyticsCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData
    });

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Products filter error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Get predictive analytics
export async function getPredictiveAnalyticsController(req, res) {
  try {
    const { period = 'month' } = req.query;
    const dateRange = getDateRange(period);
    
    // Generate cache key
    const cacheKey = `predictive_${period}`;
    
    // Check cache
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      return res.status(200).json(cachedData.data);
    }
    
    // Get historical sales data for prediction
    const historicalSales = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: new Date(dateRange.startDate.getTime() - (365 * 24 * 60 * 60 * 1000)), // 1 year back
            $lte: dateRange.endDate 
          },
          payment_status: { $in: ['completed', 'CASH ON DELIVERY'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmt" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Simple linear regression for prediction (in real app, use ML library)
    const months = historicalSales.map((sale, index) => index);
    const sales = historicalSales.map(sale => sale.totalSales);
    
    // Calculate linear regression
    const n = months.length;
    const sumX = months.reduce((a, b) => a + b, 0);
    const sumY = sales.reduce((a, b) => a + b, 0);
    const sumXY = months.reduce((sum, x, i) => sum + (x * sales[i]), 0);
    const sumXX = months.reduce((sum, x) => sum + (x * x), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Predict next 3 months
    const predictions = [];
    for (let i = 1; i <= 3; i++) {
      const nextMonth = new Date(dateRange.endDate);
      nextMonth.setMonth(nextMonth.getMonth() + i);
      
      const prediction = slope * (n + i) + intercept;
      predictions.push({
        month: nextMonth.toISOString().slice(0, 7),
        predictedSales: Math.max(0, prediction), // Ensure non-negative
        growth: i === 1 ? ((prediction - sales[sales.length - 1]) / sales[sales.length - 1]) * 100 : 0
      });
    }

    // Inventory predictions
    const lowStockProducts = await ProductModel.find({
      stock: { $gt: 0, $lte: 10 }
    }).countDocuments();

    const inventoryPrediction = {
      status: lowStockProducts > 5 ? 'Critical' : lowStockProducts > 2 ? 'Warning' : 'Good',
      itemsAtRisk: lowStockProducts,
      recommendedAction: lowStockProducts > 5 ? 
        'Urgent restock needed' : lowStockProducts > 2 ? 
        'Consider restocking soon' : 'Inventory levels healthy'
    };

    // Customer growth prediction
    const customerGrowth = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(dateRange.startDate.getTime() - (90 * 24 * 60 * 60 * 1000)) }, // 90 days back
          role: "USER"
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const lastMonthCustomers = customerGrowth[customerGrowth.length - 1]?.newCustomers || 0;
    const avgGrowth = customerGrowth.length > 1 ? 
      (lastMonthCustomers - customerGrowth[0]?.newCustomers) / customerGrowth.length : 0;
    
    const predictedCustomerGrowth = lastMonthCustomers + (avgGrowth * 1.1); // 10% growth assumption

    const responseData = {
      success: true,
      message: "Predictive analytics fetched successfully",
      data: {
        salesPredictions: predictions,
        inventoryPrediction,
        predictedCustomerGrowth: Math.round(predictedCustomerGrowth),
        confidence: 0.85, // Simulated confidence score
        recommendations: [
          "Consider increasing inventory for top-selling products",
          "Run targeted promotions for customer retention",
          "Optimize pricing strategy based on seasonal trends"
        ]
      }
    };

    // Cache the response
    analyticsCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData
    });

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Predictive analytics error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}