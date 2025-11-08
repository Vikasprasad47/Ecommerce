import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        default: ""
    },
    comment: {
        type: String,
        required: true
    },
    images: [
        {
            url: { type: String },
            caption: { type: String, default: "" }
        }
    ],
    pros: [{ type: String }],
    cons: [{ type: String }],
    verifiedPurchase: {
        type: Boolean,
        default: true
    },
    helpfulCount: {
        type: Number,
        default: 0
    },
    reported: {
        type: Boolean,
        default: false
    },
    adminResponse: {
        message: { type: String, default: "" },
        respondedAt: { type: Date, default: null }
    },
    status: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "pending"
    },
    helpfulBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
}, {
    timestamps: true
});

// Enforce one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const ReviewModel = mongoose.model("review", reviewSchema);

export default ReviewModel;
