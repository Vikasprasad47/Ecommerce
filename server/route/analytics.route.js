// server/routes/analytics.route.js
import { Router } from "express";
import { 
  getSalesAnalyticsController, 
  getInventoryAnalyticsController,
  getCustomerAnalyticsController,
  getRevenueAnalyticsController,
  getPerformanceAnalyticsController,
  getDashboardStatsController,
  getProductsByFilterController,
  getPredictiveAnalyticsController
} from "../controllers/analytics.controller.js";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Amin.js";

const analyticsRouter = Router();

analyticsRouter.get("/sales", auth, admin, getSalesAnalyticsController);
analyticsRouter.get("/inventory", auth, admin, getInventoryAnalyticsController);
analyticsRouter.get("/customers", auth, admin, getCustomerAnalyticsController);
analyticsRouter.get("/revenue", auth, admin, getRevenueAnalyticsController);
analyticsRouter.get("/performance", auth, admin, getPerformanceAnalyticsController);
analyticsRouter.get("/dashboard-stats", auth, admin, getDashboardStatsController);
analyticsRouter.get("/products", auth, admin, getProductsByFilterController);
analyticsRouter.get("/predictive", auth, admin, getPredictiveAnalyticsController);

export default analyticsRouter;