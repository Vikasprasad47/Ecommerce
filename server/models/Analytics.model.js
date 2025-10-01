import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['sales', 'inventory', 'customer', 'revenue', 'performance', 'predictive']
  },
  period: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // 30 days in seconds
  }
}, {
  timestamps: true
});

// Index for faster queries
analyticsSchema.index({ type: 1, period: 1, date: 1 });

const AnalyticsModel = mongoose.model('analytics', analyticsSchema);
export default AnalyticsModel;