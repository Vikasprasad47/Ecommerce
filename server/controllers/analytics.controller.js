import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import AnalyticsSnapshot from "../models/Analytics.model.js";

// Utility: date range parser
const parseDateRange = (startDate, endDate) => {
  const start = startDate ? new Date(startDate) : new Date("2020-01-01");
  const end = endDate ? new Date(endDate) : new Date();
  return { start, end };
}; 

/**
 * 1. Overview KPIs
 * GET /api/analytics/overview?startDate=...&endDate=...&compare=true
 */
export const getOverview = async (req, res) => {
  try {
    const { startDate, endDate, compare } = req.query;
    const { start, end } = parseDateRange(startDate, endDate);

    const pipeline = [
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmt" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalAmt" },
        },
      },
    ];

    const [ordersAgg, usersCount] = await Promise.all([
      OrderModel.aggregate(pipeline),
      UserModel.countDocuments({ createdAt: { $lte: end } }),
    ]);

    const kpis = {
      totalRevenue: ordersAgg[0]?.totalRevenue || 0,
      totalOrders: ordersAgg[0]?.totalOrders || 0,
      avgOrderValue: ordersAgg[0]?.avgOrderValue || 0,
      totalUsers: usersCount,
    };

    // Optional comparison with previous period
    let growth = {};
    if (compare) {
      const diff = end.getTime() - start.getTime();
      const prevStart = new Date(start.getTime() - diff);
      const prevEnd = new Date(end.getTime() - diff);

      const prev = await OrderModel.aggregate([
        { $match: { createdAt: { $gte: prevStart, $lte: prevEnd } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmt" },
            totalOrders: { $sum: 1 },
          },
        },
      ]);

      const prevData = prev[0] || {};
      growth = {
        revenueGrowth: prevData.totalRevenue
          ? (kpis.totalRevenue - prevData.totalRevenue) / prevData.totalRevenue
          : null,
        ordersGrowth: prevData.totalOrders
          ? (kpis.totalOrders - prevData.totalOrders) / prevData.totalOrders
          : null,
      };
    }

    res.json({ success: true, data: { kpis, growth } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 2. Sales Trend
 * GET /api/analytics/sales-trend?startDate=...&endDate=...&groupBy=day|month
 */
export const getSalesTrend = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.query;
    const { start, end } = parseDateRange(startDate, endDate);

    const format = groupBy === "month" ? "%Y-%m" : "%Y-%m-%d";

    const trend = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format, date: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmt" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data: trend });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 3. Top Products
 * GET /api/analytics/top-products?startDate=...&endDate=...&limit=10&by=revenue|quantity
 */
export const getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10, by = "revenue" } = req.query;
    const { start, end } = parseDateRange(startDate, endDate);

    const pipeline = [
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          quantitySold: { $sum: "$items.quantity" },
          revenue: {
            $sum: { $multiply: ["$items.quantity", "$items.pricePerUnit"] },
          },
        },
      },
      { $sort: by === "quantity" ? { quantitySold: -1 } : { revenue: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productId: "$_id",
          name: "$product.name",
          sku: "$product.sku",
          quantitySold: 1,
          revenue: 1,
        },
      },
    ];

    const products = await OrderModel.aggregate(pipeline);
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 4. Category Performance
 * GET /api/analytics/category-performance?startDate=...&endDate=...
 */
export const getCategoryPerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = parseDateRange(startDate, endDate);

    const performance = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category._id",
          name: { $first: "$category.name" },
          revenue: {
            $sum: { $multiply: ["$items.pricePerUnit", "$items.quantity"] },
          },
          orders: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json({ success: true, data: performance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 5. User Growth
 * GET /api/analytics/user-growth?groupBy=month
 */
export const getUserGrowth = async (req, res) => {
  try {
    const { groupBy = "month" } = req.query;
    const format = groupBy === "day" ? "%Y-%m-%d" : "%Y-%m";

    const growth = await UserModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format, date: "$createdAt" } },
          newUsers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data: growth });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 6. Order Status Breakdown
 * GET /api/analytics/order-status
 */
export const getOrderStatusBreakdown = async (req, res) => {
  try {
    const breakdown = await OrderModel.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({ success: true, data: breakdown });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 7. Payment Method Split
 * GET /api/analytics/payment-method
 */
export const getPaymentSplit = async (req, res) => {
  try {
    const split = await OrderModel.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmt" },
        },
      },
    ]);

    res.json({ success: true, data: split });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 8. Geo Performance
 * GET /api/analytics/geo
 */
export const getGeoPerformance = async (req, res) => {
  try {
    const geo = await OrderModel.aggregate([
      {
        $group: {
          _id: "$delivery_address.city",
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmt" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json({ success: true, data: geo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 9. Realtime Today Snapshot
 * GET /api/analytics/today
 */
export const getTodaySnapshot = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();

    const [orders] = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalAmt" },
          orders: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        date: start,
        totalRevenue: orders?.revenue || 0,
        totalOrders: orders?.orders || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
