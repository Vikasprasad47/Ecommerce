import mongoose from 'mongoose';
import Stripe from '../config/stripe.js';
import CartproductModel from '../models/cartproduct.model.js';
import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import AddressModel from '../models/address.model.js';
import sendEmailByNodeMailer from '../config/sendEmailByNodeMailer.js'
import orderEmailTemplate from '../utils/orderEmailTemplate.js'


// ✅ Discount utility
export const priceWithDiscount = (price, dis) => {
  const priceValue = Number(price);
  const discountValue = Number(dis);

  if (isNaN(priceValue) || priceValue <= 0) return null;
  if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) return null;

  const discountAmount = Math.ceil((priceValue * discountValue) / 100);
  return priceValue - discountAmount;
};

// ✅ Cash On Delivery Order
// export async function CashOnDeliveryOrderController(request, response) {
//   try {
//     const userId = request.userId;
//     const { list_items, addressId } = request.body;
//     const orderId = `Order-${new mongoose.Types.ObjectId()}`;

//     const items = list_items.map(el => {
//       const pricePerUnit = priceWithDiscount(el.productId.price, el.productId.discount);
//       const subtotalAmt = pricePerUnit * el.quantity;
//       const totalAmt = subtotalAmt + (el.productId.tax || 0);

//       return {
//         product: el.productId._id,
//         product_details: {
//           name: el.productId.name,
//           image: el.productId.image,
//         },
//         quantity: el.quantity,
//         pricePerUnit,
//         tax: el.productId.tax || 0,
//         subtotalAmt,
//         totalAmt,
//         status: 'confirmed'
//       };
//     });

//     const payload = {
//       userId,
//       orderId,
//       delivery_address: addressId,
//       payment_status: "CASH ON DELIVERY",
//       items,
//     };

//     const newOrder = await OrderModel.create(payload);

//     try {
//       const user = await UserModel.findById(userId);
//       if (user && user.email) {
//         // Don't await - let it run in background
//         await sendEmailByNodeMailer({
//           sendTo: user.email,
//           subject: `Order Confirmed - ${orderId}`,
//           html: orderEmailTemplate(user.name, {
//             orderId,
//             items,
//             totalAmt: totalAmount,
//             payment_status: "CASH ON DELIVERY",
//             delivery_address: deliveryAddress,
//             estimated_delivery_date: estimatedDelivery
//           })
//         }).catch(error => {
//           console.error("Failed to send order confirmation email:", error);
//           // Don't throw error - just log it
//         });
//       }
//     } catch (error) {
//       console.error("Error preparing email:", error);
//       // Don't fail the order if email preparation fails
//     }

//     await CartproductModel.deleteMany({ userId });
//     await UserModel.updateOne(
//       { _id: userId },
//       {
//         $push: { orderHistory: newOrder._id },
//         $set: { shopping_cart: [] }
//       }
//     );

//     return response.status(200).json({ success: true, message: 'Order placed successfully' });
//   } catch (error) {
//     return response.status(500).json({ success: false, message: error.message });
//   }
// }
export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId;
    const { list_items, addressId } = request.body;
    const orderId = `Order-${new mongoose.Types.ObjectId()}`;

    // Get delivery address details
    const deliveryAddressDoc = await AddressModel.findById(addressId);
    const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

    const items = list_items.map(el => {
      const pricePerUnit = priceWithDiscount(el.productId.price, el.productId.discount);
      const subtotalAmt = pricePerUnit * el.quantity;
      const totalAmt = subtotalAmt + (el.productId.tax || 0);

      return {
        product: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        quantity: el.quantity,
        pricePerUnit,
        tax: el.productId.tax || 0,
        subtotalAmt,
        totalAmt,
        status: 'confirmed'
      };
    });

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.totalAmt, 0);

    const payload = {
      userId,
      orderId,
      delivery_address: addressId,
      payment_status: "CASH ON DELIVERY",
      items,
      totalAmt: totalAmount,
      estimated_delivery_date: estimatedDelivery
    };

    const newOrder = await OrderModel.create(payload);

    // Send order confirmation email (non-blocking)
    try {
      const user = await UserModel.findById(userId);
      if (user && user.email) {
        console.log("📧 Preparing to send order confirmation to:", user.email);
        
        // Convert Mongoose document to plain object for email template
        const deliveryAddressForEmail = deliveryAddressDoc ? {
          address_line: deliveryAddressDoc.address_line || "",
          landMark: deliveryAddressDoc.landMark || "",
          city: deliveryAddressDoc.city || "",
          state: deliveryAddressDoc.state || "",
          pincode: deliveryAddressDoc.pincode || "",
          country: deliveryAddressDoc.country || "",
          mobile: deliveryAddressDoc.mobile || "",
          address_type: deliveryAddressDoc.address_type || "Home"
        } : null;

        // Don't await - let it run in background
        sendEmailByNodeMailer({
          sendTo: user.email,
          subject: `Order Confirmed - ${orderId}`,
          html: orderEmailTemplate(user.name, {
            orderId,
            items,
            totalAmt: totalAmount,
            payment_status: "CASH ON DELIVERY",
            delivery_address: deliveryAddressForEmail,
            estimated_delivery_date: estimatedDelivery
          })
        }).then(() => {
          console.log("✅ Order confirmation email sent successfully to:", user.email);
        }).catch(error => {
          console.error("❌ Failed to send order confirmation email:", error);
          console.error("📧 Email error details:", error.message);
        });
      } else {
        console.log("❌ User not found or no email for userId:", userId);
      }
    } catch (error) {
      console.error("❌ Error preparing email:", error);
      // Don't fail the order if email preparation fails
    }

    await CartproductModel.deleteMany({ userId });
    await UserModel.updateOne(
      { _id: userId },
      {
        $push: { orderHistory: newOrder._id },
        $set: { shopping_cart: [] }
      }
    );

    return response.status(200).json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    console.error("❌ CashOnDeliveryOrderController error:", error);
    return response.status(500).json({ success: false, message: error.message });
  }
}

// ✅ Stripe Checkout
export async function paymentController(request, response) {
  try {
    const userId = request.userId;
    const { list_items, totalAmt, addressId, subtotalAmt } = request.body;
    const user = await UserModel.findById(userId);
    const line_items = [];

    let totalPayableAmount = 0;
    const deliveryCharge = totalAmt - subtotalAmt;

    if (deliveryCharge > 0) {
      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: { name: 'Delivery Charge' },
          unit_amount: Math.round(deliveryCharge * 100),
        },
        quantity: 1
      });
      totalPayableAmount += Math.round(deliveryCharge * 100);
    }

    for (let item of list_items) {
      const unitPrice = priceWithDiscount(item.productId.price, item.productId.discount);
      const priceInPaise = Math.round(unitPrice * 100);

      if (priceInPaise < 50) {
        return response.status(400).json({
          success: false,
          error: true,
          message: `Product "${item.productId.name}" has a discounted price too low for online payment.`,
        });
      }

      totalPayableAmount += priceInPaise * item.quantity;

      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: { productId: String(item.productId._id) },
          },
          unit_amount: priceInPaise,
        },
        adjustable_quantity: { enabled: true, minimum: 1 },
        quantity: item.quantity,
      });
    }

    if (totalPayableAmount < 50) {
      return response.status(400).json({
        success: false,
        error: true,
        message: 'Total amount must be at least ₹50.',
      });
    }

    const session = await Stripe.checkout.sessions.create({
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      metadata: {
        userId: String(userId),
        addressId: String(addressId),
      },
      line_items,
      success_url: `${process.env.FRONTED_URL}/order-success`,
      cancel_url: `${process.env.FRONTED_URL}/cancel`,
    });

    return response.status(200).json(session);
  } catch (error) {
    return response.status(500).json({ message: error.message || error, success: false, error: true });
  }
}

// ✅ Convert Stripe items → Order Items
export const getOrderProductItems = async ({ lineItems, userId, addressId, paymentId, payment_status }) => {
  const orderId = `ORD-${new mongoose.Types.ObjectId()}`;
  const items = [];
  let deliveryCharge = 0;

  for (const item of lineItems.data) {
    const product = await Stripe.products.retrieve(item?.price?.product);
    if (!product?.metadata?.productId) {
      if (product.name.toLowerCase().includes("delivery")) {
        deliveryCharge += item.amount_total / 100;
      }
      continue;
    }

    const pricePerUnit = item.price.unit_amount / 100;
    const subtotalAmt = pricePerUnit * item.quantity;
    const totalAmt = subtotalAmt;

    items.push({
      product: product.metadata.productId,
      product_details: {
        name: product.name,
        image: product.images?.[0] ? [product.images[0]] : [],
      },
      quantity: item.quantity,
      pricePerUnit,
      tax: 0,
      subtotalAmt,
      totalAmt,
      status: 'confirmed'
    });
  }

  if (items.length && deliveryCharge > 0) {
    items[0].totalAmt += deliveryCharge;
  }

  return [{
    userId,
    orderId,
    paymentId,
    payment_status,
    delivery_address: addressId,
    items
  }];
};

// ✅ Stripe Webhook Handler
export async function webhookStripe(request, response) {
  try {
    const event = request.body;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);

      const orderProduct = await getOrderProductItems({
        lineItems,
        userId: session.metadata.userId,
        addressId: session.metadata.addressId,
        paymentId: session.payment_intent,
        payment_status: session.payment_status,
      });

      const created = await OrderModel.create(orderProduct[0]);
      if (created) {
        await CartproductModel.deleteMany({ userId: session.metadata.userId });

        await UserModel.updateOne(
          { _id: session.metadata.userId },
          {
            $push: { orderHistory: created._id },
            $set: { shopping_cart: [] }
          }
        );
      }
    }

    response.json({ received: true });
  } catch (err) {
    response.status(500).json({ error: true, message: err.message });
  }
}

// ✅ Get Orders for User
export async function getOrderDetailsController(req, res) {
  try {
    const userId = req.userId;

    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.product")
      .populate("delivery_address")
      .populate("userId", "name email");

    return res.json({
      message: "Order list",
      data: orders,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, success: false, error: true });
  }
}

// ✅ Update Order Status
export async function updateOrderStatusController(req, res) {
  try {
    const { orderId, itemId, status } = req.body;

    const validStatuses = ['confirmed', 'packed', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: true, 
        message: 'Invalid status value.' 
      });
    }

    // Use findByIdAndUpdate with optimistic concurrency control
    const updateOperation = itemId 
      ? {
          $set: {
            'items.$[elem].status': status
          }
        }
      : {
          $set: {
            'items.$[].status': status
          }
        };

    const options = {
      new: true,
      runValidators: true,
      arrayFilters: itemId ? [{ 'elem._id': itemId }] : undefined
    };

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      updateOperation,
      options
    );

    if (!updatedOrder) {
      return res.status(404).json({ 
        success: false, 
        error: true, 
        message: 'Order not found' 
      });
    }

    return res.json({
      success: true,
      message: itemId ? 'Item status updated' : 'All items status updated',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Order status update error:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    
    return res.status(500).json({ 
      success: false, 
      error: true, 
      message: 'Failed to update order status',
      systemMessage: error.message
    });
  }
}

// ✅ Admin Get All Orders
export async function getAllOrdersController(req, res) {
  try {
    const orders = await OrderModel.find({ visibleToAdmin: true })
      .populate("items.product")
      .populate("delivery_address")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, error: true, message: err.message });
  }
}

export const hideOrderFromAdmin = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Order ID is required in the request body." });
    }

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { visibleToAdmin: false },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order hidden from admin view (still visible to user)",
      order,
    });
  } catch (error) {
    console.error("Error hiding order:", error);
    res.status(500).json({ 
      message: "Server error" 
    });
  }
};
