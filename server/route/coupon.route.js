import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Amin.js";

import {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  validateCoupon,
  applyCouponToOrder,
  getAvailableCoupons,
  getCouponByCode
} from "../controllers/coupon.controller.js";

const couponRouter = Router();

// ===== Admin Routes =====
couponRouter.post("/create", auth, admin, createCoupon);
couponRouter.get("/list", auth, admin, getCoupons);
couponRouter.put("/update/:id", auth, admin, updateCoupon);
couponRouter.delete("/delete/:id", auth, admin, deleteCoupon);
couponRouter.patch("/toggle/:id", auth, admin, toggleCouponStatus);

// ===== User Routes =====
couponRouter.post("/validate", auth, validateCoupon);
couponRouter.post("/apply", auth, applyCouponToOrder);
couponRouter.get("/available", auth, getAvailableCoupons);
couponRouter.get("/details", auth, getCouponByCode);     // Put this BEFORE the generic :id route

// ===== Keep this LAST =====
couponRouter.get("/:id", auth, admin, getCoupon);        // This should be last

export default couponRouter;