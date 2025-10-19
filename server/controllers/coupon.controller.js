import CouponModel from "../models/coupon.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";

// ======= Admin Controllers =======

// Create a coupon
export const createCoupon = async (req, res) => {
  try {
    const { 
      code, 
      discountType, 
      discountValue, 
      minAmount = 0, 
      maxDiscount = 0, 
      startDate, 
      endDate, 
      isActive = true,
      usageLimit = 0,
      userUsageLimit = 1,
      firstOrderOnly = false,
      customerEligibility = "all",
      eligibleCustomers = [],
      minProducts = 1,
      maxProducts = 0
    } = req.body;

    if (!code || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    if (await CouponModel.findOne({ code: code.toUpperCase() })) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ success: false, message: "End date must be after start date" });
    }

    const coupon = new CouponModel({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minAmount,
      maxDiscount,
      startDate,
      endDate,
      isActive,
      usageLimit,
      userUsageLimit,
      firstOrderOnly,
      customerEligibility,
      eligibleCustomers,
      minProducts,
      maxProducts,
      createdBy: req.userId,
    });

    await coupon.save();
    return res.status(201).json({ success: true, message: "Coupon created", data: coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await CouponModel.find()
      .populate("createdBy", "name email")
      .populate("eligibleCustomers", "name email")
      .sort({ createdAt: -1 });
    return res.json({ success: true, data: coupons });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single coupon
export const getCoupon = async (req, res) => {
  try {
    const coupon = await CouponModel.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("eligibleCustomers", "name email");
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    return res.json({ success: true, data: coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await CouponModel.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    return res.json({ success: true, message: "Coupon updated", data: coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await CouponModel.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    return res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle coupon active status
export const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await CouponModel.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    return res.json({ success: true, message: `Coupon ${coupon.isActive ? "activated" : "deactivated"}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======= Enhanced Validation & Usage Tracking =======

// Comprehensive coupon validation
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal, userId, itemCount = 1, products = [] } = req.body;

    if (!code || cartTotal === undefined || !userId) {
      return res.status(400).json({ success: false, message: "Code, cart total and user ID required" });
    }

    const coupon = await CouponModel.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(400).json({ success: false, message: "Invalid coupon code" });
    }

    // Comprehensive validation
    const validationResult = await validateCouponEligibility(coupon, userId, cartTotal, itemCount, products);
    
    if (!validationResult.valid) {
      return res.status(400).json({ 
        success: false, 
        message: validationResult.reason 
      });
    }

    // Calculate discount
    const discountResult = coupon.calculateDiscount(cartTotal);
    
    return res.json({ 
      success: true, 
      data: { 
        discount: discountResult.discount, 
        finalPrice: discountResult.finalPrice, 
        couponCode: coupon.code,
        couponId: coupon._id,
        discountText: coupon.discountText
      } 
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Comprehensive coupon eligibility validation
const validateCouponEligibility = async (coupon, userId, cartTotal, itemCount, products = []) => {
  const now = new Date();
  
  // Basic coupon status check
  if (!coupon.isActive) {
    return { valid: false, reason: "Coupon is not active" };
  }

  if (now < coupon.startDate) {
    return { valid: false, reason: "Coupon is not yet active" };
  }

  if (now > coupon.endDate) {
    return { valid: false, reason: "Coupon has expired" };
  }

  // Usage limit check
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, reason: "Coupon usage limit reached" };
  }

  // Minimum amount check
  if (cartTotal < coupon.minAmount) {
    return { valid: false, reason: `Minimum order amount of ₹${coupon.minAmount} required` };
  }

  // Product quantity checks
  if (itemCount < coupon.minProducts) {
    return { valid: false, reason: `Minimum ${coupon.minProducts} products required` };
  }

  if (coupon.maxProducts > 0 && itemCount > coupon.maxProducts) {
    return { valid: false, reason: `Maximum ${coupon.maxProducts} products allowed` };
  }

  // User-specific validations
  const user = await UserModel.findById(userId);
  if (!user) {
    return { valid: false, reason: "User not found" };
  }

  // User usage limit check
  const userUsageCount = await OrderModel.countDocuments({ 
    userId, 
    "couponInfo.couponId": coupon._id 
  });
  
  if (userUsageCount >= coupon.userUsageLimit) {
    return { valid: false, reason: "Coupon Expired!" };
  }

  // Customer eligibility checks
  const eligibilityResult = await validateCustomerEligibility(coupon, user, userUsageCount);
  if (!eligibilityResult.valid) {
    return eligibilityResult;
  }

  // First order only check
  if (coupon.firstOrderOnly) {
    const userOrderCount = await OrderModel.countDocuments({ userId });
    if (userOrderCount > 0) {
      return { valid: false, reason: "This coupon is for first-time customers only" };
    }
  }

  // Product/category specific validations
  if (products.length > 0) {
    const productValidation = validateProductEligibility(coupon, products);
    if (!productValidation.valid) {
      return productValidation;
    }
  }

  return { valid: true };
};

// Customer eligibility validation
const validateCustomerEligibility = async (coupon, user, userUsageCount) => {
  switch (coupon.customerEligibility) {
    case "new_customers":
      const userOrderCount = await OrderModel.countDocuments({ userId: user._id });
      if (userOrderCount > 0) {
        return { valid: false, reason: "This coupon is for new customers only" };
      }
      break;

    case "existing_customers":
      const existingUserOrderCount = await OrderModel.countDocuments({ userId: user._id });
      if (existingUserOrderCount === 0) {
        return { valid: false, reason: "This coupon is for existing customers only" };
      }
      break;

    case "specific_customers":
      if (!coupon.eligibleCustomers.includes(user._id)) {
        return { valid: false, reason: "This coupon is not available for your account" };
      }
      break;

    case "all":
    default:
      // All customers are eligible
      break;
  }

  return { valid: true };
};

// Product eligibility validation
const validateProductEligibility = (coupon, products) => {
  // This would need to be implemented based on your product schema
  // For now, returning valid as products array structure isn't fully defined
  return { valid: true };
};

// Apply coupon to order with proper usage tracking
export const applyCouponToOrder = async (req, res) => {
  try {
    const { orderId, couponCode, userId } = req.body;
    
    if (!orderId || !couponCode || !userId) {
      return res.status(400).json({ success: false, message: "Order ID, coupon code and user ID required" });
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Verify order belongs to user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const coupon = await CouponModel.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    // Validate coupon eligibility before applying
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const validationResult = await validateCouponEligibility(
      coupon, 
      userId, 
      order.subtotalAmt, 
      itemCount
    );

    if (!validationResult.valid) {
      return res.status(400).json({ success: false, message: validationResult.reason });
    }

    // Calculate discount
    const discountResult = coupon.calculateDiscount(order.subtotalAmt);

    // Update order with coupon information
    order.couponInfo = {
      code: coupon.code,
      couponId: coupon._id,
      discount: discountResult.discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount,
      minAmount: coupon.minAmount
    };
    
    order.couponDiscount = discountResult.discount;
    order.finalAmount = discountResult.finalPrice;
    
    await order.save();

    // ✅ CRITICAL: Increment coupon usage count
    await incrementCouponUsage(coupon._id, userId);

    return res.json({ 
      success: true, 
      message: "Coupon applied successfully", 
      data: {
        order: order,
        discount: discountResult.discount,
        finalAmount: discountResult.finalPrice
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Increment coupon usage with transaction safety
const incrementCouponUsage = async (couponId, userId) => {
  try {
    const coupon = await CouponModel.findById(couponId);
    if (!coupon) {
      throw new Error("Coupon not found");
    }

    // Check usage limits again before incrementing
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      throw new Error("Coupon usage limit reached");
    }

    // Increment usedCount and update lastUsedAt
    coupon.usedCount += 1;
    coupon.lastUsedAt = new Date();
    
    await coupon.save();

    // Log the usage for audit purposes
    console.log(`Coupon ${coupon.code} used by user ${userId}. Total uses: ${coupon.usedCount}`);

  } catch (error) {
    console.error("Error incrementing coupon usage:", error);
    throw error;
  }
};

// Get user's coupon usage history
export const getUserCouponUsage = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    const userOrders = await OrderModel.find({ 
      userId, 
      "couponInfo.couponId": { $exists: true } 
    }).select("orderId couponInfo createdAt totalAmt couponDiscount");

    const couponUsage = {};
    
    userOrders.forEach(order => {
      if (order.couponInfo) {
        const couponCode = order.couponInfo.code;
        if (!couponUsage[couponCode]) {
          couponUsage[couponCode] = {
            code: couponCode,
            usageCount: 0,
            totalSavings: 0,
            orders: []
          };
        }
        
        couponUsage[couponCode].usageCount += 1;
        couponUsage[couponCode].totalSavings += order.couponDiscount;
        couponUsage[couponCode].orders.push({
          orderId: order.orderId,
          date: order.createdAt,
          savings: order.couponDiscount,
          totalAmount: order.totalAmt
        });
      }
    });

    return res.json({
      success: true,
      data: Object.values(couponUsage)
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all available coupons for user with proper filtering
export const getAvailableCoupons = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const now = new Date();
    const allCoupons = await CouponModel.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    // Filter coupons based on user eligibility
    const availableCoupons = [];
    
    for (const coupon of allCoupons) {
      // Check user-specific eligibility
      const userUsageCount = await OrderModel.countDocuments({ 
        userId, 
        "couponInfo.couponId": coupon._id 
      });

      if (userUsageCount < coupon.userUsageLimit) {
        // Check other eligibility criteria
        const userOrderCount = await OrderModel.countDocuments({ userId });
        
        let isEligible = true;
        
        // First order only check
        if (coupon.firstOrderOnly && userOrderCount > 0) {
          isEligible = false;
        }
        
        // Customer eligibility check
        if (coupon.customerEligibility === "new_customers" && userOrderCount > 0) {
          isEligible = false;
        }
        
        if (coupon.customerEligibility === "existing_customers" && userOrderCount === 0) {
          isEligible = false;
        }
        
        if (coupon.customerEligibility === "specific_customers" && 
            !coupon.eligibleCustomers.includes(userId)) {
          isEligible = false;
        }

        if (isEligible) {
          availableCoupons.push(coupon);
        }
      }
    }

    return res.json({ success: true, data: availableCoupons });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get coupon details by code
export const getCouponByCode = async (req, res) => {
  try {
    const { code, userId } = req.query;
    
    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const coupon = await CouponModel.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    // Add user-specific usage information if userId provided
    let userUsageInfo = {};
    if (userId) {
      const userUsageCount = await OrderModel.countDocuments({ 
        userId, 
        "couponInfo.couponId": coupon._id 
      });
      
      userUsageInfo = {
        userUsageCount,
        userUsageLimit: coupon.userUsageLimit,
        canUse: userUsageCount < coupon.userUsageLimit
      };
    }

    // Return coupon details
    const couponData = {
      _id: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minAmount: coupon.minAmount,
      maxDiscount: coupon.maxDiscount,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      isActive: coupon.isActive,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
      userUsageLimit: coupon.userUsageLimit,
      firstOrderOnly: coupon.firstOrderOnly,
      customerEligibility: coupon.customerEligibility,
      minProducts: coupon.minProducts,
      maxProducts: coupon.maxProducts,
      description: coupon.description,
      termsAndConditions: coupon.termsAndConditions,
      isCurrentlyActive: coupon.isCurrentlyActive,
      remainingUsage: coupon.remainingUsage,
      discountText: coupon.discountText,
      ...userUsageInfo
    };

    return res.json({ success: true, data: couponData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get coupon analytics
export const getCouponAnalytics = async (req, res) => {
  try {
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    
    const analytics = await Promise.all(
      coupons.map(async (coupon) => {
        const ordersWithCoupon = await OrderModel.find({ 
          "couponInfo.couponId": coupon._id 
        });
        
        const totalRevenue = ordersWithCoupon.reduce((sum, order) => sum + order.totalAmt, 0);
        const totalDiscount = ordersWithCoupon.reduce((sum, order) => sum + (order.couponDiscount || 0), 0);
        const uniqueUsers = [...new Set(ordersWithCoupon.map(order => order.userId.toString()))];
        
        return {
          coupon: {
            _id: coupon._id,
            code: coupon.code,
            discountText: coupon.discountText,
            isActive: coupon.isActive,
            isCurrentlyActive: coupon.isCurrentlyActive
          },
          usage: {
            totalUses: coupon.usedCount,
            usageRate: coupon.usageLimit > 0 ? (coupon.usedCount / coupon.usageLimit * 100).toFixed(1) + '%' : 'Unlimited',
            uniqueUsers: uniqueUsers.length,
            totalRevenue,
            totalDiscount
          },
          effectiveness: {
            averageOrderValue: ordersWithCoupon.length > 0 ? totalRevenue / ordersWithCoupon.length : 0,
            redemptionRate: uniqueUsers.length > 0 ? (coupon.usedCount / uniqueUsers.length).toFixed(2) : 0
          }
        };
      })
    );

    return res.json({ success: true, data: analytics });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};