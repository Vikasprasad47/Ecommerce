import express from "express";
import {
  getOverview,
  getSalesTrend,
  getTopProducts,
  getCategoryPerformance,
  getUserGrowth,
  getOrderStatusBreakdown,
  getPaymentSplit,
  getGeoPerformance,
  getTodaySnapshot
} from "../controllers/analytics.controller.js";
import auth from "../middleware/auth.js"
import {admin} from "../middleware/Amin.js"

const analyticsRouter = express.Router();

// All routes protected by auth + admin middleware
// Apply in your main index.js or here if needed
// router.use(authMiddleware);
// router.use(adminMiddleware);

/**
 * Overview KPIs
 * GET /api/analytics/overview?startDate=...&endDate=...&compare=true
 */
analyticsRouter.get("/overview", auth, admin, getOverview);

/**
 * Sales Trend
 * GET /api/analytics/sales-trend?startDate=...&endDate=...&groupBy=day|month
 */
analyticsRouter.get("/sales-trend", auth, admin, getSalesTrend);

/**
 * Top Products
 * GET /api/analytics/top-products?startDate=...&endDate=...&limit=10&by=revenue|quantity
 */
analyticsRouter.get("/top-products", auth, admin, getTopProducts);

/**
 * Category Performance
 * GET /api/analytics/category-performance?startDate=...&endDate=...
 */
analyticsRouter.get("/category-performance", auth, admin, getCategoryPerformance);

/**
 * User Growth
 * GET /api/analytics/user-growth?groupBy=day|month
 */
analyticsRouter.get("/user-growth", auth, admin, getUserGrowth);

/**
 * Order Status Breakdown
 * GET /api/analytics/order-status
 */
analyticsRouter.get("/order-status", auth, admin, getOrderStatusBreakdown);

/**
 * Payment Method Split
 * GET /api/analytics/payment-method
 */
analyticsRouter.get("/payment-method", auth, admin, getPaymentSplit);

/**
 * Geo Performance
 * GET /api/analytics/geo
 */
analyticsRouter.get("/geo", auth, admin, getGeoPerformance);

/**
 * Realtime Today Snapshot
 * GET /api/analytics/today
 */
analyticsRouter.get("/today", auth, admin, getTodaySnapshot);

export default analyticsRouter;
