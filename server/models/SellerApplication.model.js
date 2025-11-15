import mongoose from "mongoose";

const sellerApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true, // one active application per user
    },

    // Business info (from BusinessInfoPage)
    businessName: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      default: "",
    },
    gstNumber: {
      type: String,
      default: "",
    },
    panNumber: {
      type: String,
      default: "",
    },
    turnover: {
      type: String,
      default: "", // e.g., "10L-50L"
    },
    description: {
      type: String,
      default: "",
    },

    // Address info (if you add this in your flow)
    address: {
      addressLine: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      landmark: { type: String, default: "" },
    },

    documents: {
      gstFile: { type: String, default: "" },
      panFile: { type: String, default: "" },
      addressProof: { type: String, default: "" },
    },

    // Application status
    status: {
      type: String,
      enum: ["DRAFT", "PENDING_REVIEW", "APPROVED", "REJECTED"],
      default: "DRAFT",
    },

    adminRemark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const SellerApplicationModel = mongoose.model(
  "sellerApplication",
  sellerApplicationSchema
);
export default SellerApplicationModel;
