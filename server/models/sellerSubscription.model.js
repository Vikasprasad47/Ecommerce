import mongoose from "mongoose";

const sellerSubscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // Basic, Standard, Premium etc
    },
    description: {
        type: String,
        default: ""
    },
    features: {
        type: [String],  // list of features shown in UI
        required: true
    },
    pricing: {
        month_1: { type: Number, required: true },
        month_3: { type: Number, required: true },
        month_6: { type: Number, required: true },
        month_12: { type: Number, required: true }
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    badgeText: {
        type: String,
        default: ""  // "Best Seller", "Save 20%", etc.
    },
    storageLimitGB: {
        type: Number,
        default: 2
    },
    productLimit: {
        type: Number,
        default: 100
    },
    priorityLevel: {
        type: Number,
        default: 1 // 1 = low, 2 = medium, 3 = high ranking priority
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, {
    timestamps: true
});

const SellerSubscriptionModel = mongoose.model("sellerSubscription", sellerSubscriptionSchema);
export default SellerSubscriptionModel;
