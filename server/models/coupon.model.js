import mongoose from "mongoose";

const { Schema } = mongoose;

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    minlength: 3,
    maxlength: 20,
    match: /^[A-Z0-9_-]+$/,
  },
  discountType: {
    type: String,
    enum: ["percent", "fixed"],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(value) {
        return this.discountType !== "percent" || value <= 100;
      },
      message: "Percentage discount cannot exceed 100%",
    },
  },
  minAmount: { type: Number, default: 0, min: 0 },
  maxDiscount: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: function(value) {
        return this.discountType === "percent" || value === 0;
      },
      message: "Max discount applies only to percentage discounts",
    },
  },
  startDate: { 
    type: Date, 
    required: true,
    // Allow today or earlier
    validate: {
      validator: function(d) {
        return d instanceof Date && !isNaN(d.getTime());
      },
      message: "Start date must be a valid date",
    }
  },
  endDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(d) {
        return this.startDate && d > this.startDate;
      },
      message: "End date must be after start date",
    }
  },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, default: 0, min: 0 },
  usedCount: { type: Number, default: 0, min: 0 },
  userUsageLimit: { type: Number, default: 1, min: 1 },
  applicableCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  excludedCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  excludedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  applicableBrands: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
  firstOrderOnly: { type: Boolean, default: false },
  minProducts: { type: Number, default: 1, min: 1 },
  maxProducts: { type: Number, default: 0, min: 0 },
  customerEligibility: { type: String, enum: ["all","new_customers","existing_customers","specific_customers"], default: "all" },
  eligibleCustomers: [{ type: Schema.Types.ObjectId, ref: "user" }],
  description: { type: String, maxlength: 500 },
  termsAndConditions: { type: String, maxlength: 1000 },
  bannerImage: { type: String, default: "" },
  priority: { type: Number, default: 1, min: 1, max: 10 },
  stackable: { type: Boolean, default: false },
  autoApply: { type: Boolean, default: false },
  notificationSent: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
  lastUsedAt: Date
}, { 
  timestamps: true, 
  toJSON: { virtuals: true, transform: (doc, ret) => { delete ret.__v; return ret; } }, 
  toObject: { virtuals: true } 
});

// Virtuals
couponSchema.virtual("isExpired").get(function() { return new Date() > this.endDate; });
couponSchema.virtual("isCurrentlyActive").get(function() {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate && (this.usageLimit === 0 || this.usedCount < this.usageLimit);
});
couponSchema.virtual("remainingUsage").get(function() { return this.usageLimit === 0 ? 'Unlimited' : Math.max(0, this.usageLimit - this.usedCount); });
couponSchema.virtual("discountText").get(function() { return this.discountType === 'percent' ? `${this.discountValue}% OFF` : `₹${this.discountValue} OFF`; });

// Pre-save hooks
couponSchema.pre("save", function(next) {
  if (this.discountType === 'fixed' && this.maxDiscount > 0) return next(new Error('Max discount only for percent'));
  if (this.usageLimit && this.usedCount > this.usageLimit) this.usedCount = this.usageLimit;
  if (this.isModified('usedCount')) this.lastUsedAt = new Date();
  next();
});

// Methods
couponSchema.methods.canApplyToCart = function(cart) {
  const now = new Date();
  if (!this.isCurrentlyActive) return { valid: false, reason: 'Coupon inactive or expired' };
  if (this.usageLimit > 0 && this.usedCount >= this.usageLimit) return { valid: false, reason: 'Usage limit reached' };
  if (cart.cartTotal < this.minAmount) return { valid: false, reason: `Min ₹${this.minAmount} required` };
  if (cart.itemCount < this.minProducts) return { valid: false, reason: `Min ${this.minProducts} products required` };
  if (this.maxProducts > 0 && cart.itemCount > this.maxProducts) return { valid: false, reason: `Max ${this.maxProducts} products allowed` };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function(cartTotal) {
  let discount = this.discountType === 'percent' ? Math.min((cartTotal*this.discountValue)/100, this.maxDiscount || Infinity) : Math.min(this.discountValue, cartTotal);
  return { discount, finalPrice: Math.max(cartTotal - discount, 0) };
};

couponSchema.methods.incrementUsage = function() {
  this.usedCount++;
  this.lastUsedAt = new Date();
  return this.save();
};

// Indexes
couponSchema.index({ code: "text", description: "text", termsAndConditions: "text" });
couponSchema.index({ startDate: 1, endDate: 1 });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
couponSchema.index({ priority: -1 });

export default mongoose.model("Coupon", couponSchema);
