import OrderModel from '../models/order.model.js';

/**
 * Middleware: verifyOrderAccess
 * Ensures a user can access an order success or store pickup page only once
 */
const verifyOrderAccess = async (req, res, next) => {
  try {
    const { orderId, key } = req.params;

    // Must come after auth middleware, so req.userId is available
    const order = await OrderModel.findOne({
      orderId,
      orderAccessKey: key,
      userId: req.userId,
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired access.",
      });
    }

    // Make this key usable only once
    order.orderAccessKey = null;
    await order.save();

    // Attach order info to request for downstream use (optional)
    req.order = order;

    next(); // Allow access
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default verifyOrderAccess;
