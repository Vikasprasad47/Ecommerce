import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  product_details: {
    name: { type: String, required: true },
    image: {
      type: [String],
      validate: {
        validator: arr => arr.every(url => typeof url === "string"),
        message: "All images must be string URLs",
      },
      default: [],
    },
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: [0, "Price per unit must be positive"],
  },
  subtotalAmt: {
    type: Number,
    default: 0,
  },
  totalAmt: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["confirmed", "packed", "shipped", "delivered"],
    default: "confirmed",
  }
}, { _id: false }); // prevents auto _id generation per item

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    visibleToAdmin: {
      type: Boolean,
      default: true,
    },
    orderId: {
      type: String,
      required: [true, "Provide orderId"],
      unique: true,
      trim: true,
    },
    items: {
      type: [itemSchema],
      required: true,
    },
    delivery_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },
    paymentId: {
      type: String,
      default: "",
    },
    payment_status: {
      type: String,
      enum: ["", "pending", "completed", "failed", "CASH ON DELIVERY"],
      default: "",
    },
    subtotalAmt: {
      type: Number,
      default: 0,
    },
    totalAmt: {
      type: Number,
      default: 0,
    },
    invoice_receipt: {
      type: String,
      default: "",
    },
    shipping_method: {
      type: String,
      enum: ["standard", "express", "overnight"],
      default: "standard",
    },
    tracking_number: {
      type: String,
      default: "",
    },
    estimated_delivery_date: Date,
    actual_delivery_date: Date,
    notes: {
      type: String,
      default: "",
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🔢 Auto-calculate amounts before save
orderSchema.pre("save", async function (next) {
  this.subtotalAmt = this.items.reduce(
    (sum, item) => sum + item.pricePerUnit * item.quantity,
    0
  );
  this.totalAmt = this.subtotalAmt; // Add tax/discount logic if needed

  this.items = this.items.map(item => ({
    ...item,
    subtotalAmt: item.pricePerUnit * item.quantity,
    totalAmt: item.pricePerUnit * item.quantity, // Extend for tax per item if needed
  }));

  next();
});

// 📊 Virtual summary
orderSchema.virtual("order_summary").get(function () {
  return `Order ${this.orderId} - ₹${this.totalAmt} (${this.items.length} items)`;
});


const OrderModel = mongoose.model("order", orderSchema);

export default OrderModel;
