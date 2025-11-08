import {Router} from 'express';
import auth from '../middleware/auth.js';
import { CashOnDeliveryOrderController, getAllOrdersController, getOrderDetailsController, paymentController, updateOrderStatusController, webhookStripe, hideOrderFromAdmin, StorePickupOrderController  } from '../controllers/orders.controller.js';
import verifyOrderAccess from '../middleware/verifyOrderAccess.js';

const OrderRouter = Router();

OrderRouter.post('/cash-on-delivery', auth, CashOnDeliveryOrderController)
OrderRouter.post('/store-pickup', auth, StorePickupOrderController);
OrderRouter.post('/checkout', auth, paymentController)
OrderRouter.post('/webhook', webhookStripe)
OrderRouter.get('/get-order-list', auth, getOrderDetailsController)
OrderRouter.patch('/status', auth, updateOrderStatusController);
OrderRouter.get('/get-all-order-for-admin', auth, getAllOrdersController)
OrderRouter.patch('/hide-order-from-admin', auth, hideOrderFromAdmin)
OrderRouter.get("/verify-order-access/:orderId/:key", auth, verifyOrderAccess, (req, res) => {
  res.json({ success: true });
});



export default OrderRouter;