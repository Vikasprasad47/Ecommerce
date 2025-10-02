import mongoose from "mongoose";

const topProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  name: String,
  sku: String,
  quantitySold: Number,
  revenue: Number,
  avgPrice: Number
}, { _id: false });

const categoryPerfSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  name: String,
  revenue: Number,
  orders: Number
}, { _id: false });

const segmentSchema = new mongoose.Schema({
  name: String, // e.g., "High value", "Dormant"
  users: Number,
  revenue: Number
}, { _id: false });

const analyticsSnapshotSchema = new mongoose.Schema({
  date: { type: Date, index: true }, // snapshot date (midnight UTC)
  range: { type: String, enum: ["daily", "weekly", "monthly"], default: "daily" },

  // core KPIs
  totalRevenue: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  avgOrderValue: { type: Number, default: 0 },
  refundsAmount: { type: Number, default: 0 },
  returnsCount: { type: Number, default: 0 },

  // users
  totalUsers: { type: Number, default: 0 },
  newUsers: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  churnedUsers: { type: Number, default: 0 },

  // breakdowns
  ordersByStatus: {
    confirmed: Number,
    packed: Number,
    shipped: Number,
    delivered: Number,
    cancelled: Number
  },
  paymentMethodSplit: mongoose.Schema.Types.Mixed, // { "COD": 1234, "UPI": 567 }
  geo: mongoose.Schema.Types.Mixed, // { "Delhi": { orders: 10, revenue: 1000 }, ... }

  // product/category
  topProducts: [topProductSchema],
  categoryPerformance: [categoryPerfSchema],

  // customer segments
  segments: [segmentSchema],

  // optional: derived ML fields
  salesForecastNext30Days: mongoose.Schema.Types.Mixed,

  createdAt: { type: Date, default: Date.now }
}, { collection: "analytics_snapshots" });

export default mongoose.model("AnalyticsSnapshot", analyticsSnapshotSchema);
