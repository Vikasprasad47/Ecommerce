// controllers/seller.controller.js
import SellerModel from "../models/seller.model.js";
import UserModel from "../models/user.model.js";
import SellerSubscriptionModel from "../models/sellerSubscription.model.js";
import SellerApplicationModel from "../models/SellerApplication.model.js";
import uploadSellerDocCloudinary from "../utils/uploadSellerDocCloudinary.js";

/* -------------------------------------------------------------------------- */
/*                             USER: REGISTER SELLER                          */
/* -------------------------------------------------------------------------- */
// Save / update business info for seller application
export const registerSeller = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      businessName,
      businessType,
      gstNumber,
      panNumber,
      turnover,
      description,
    } = req.body;

    if (!businessName || !businessName.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Business name is required" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // If user is already an active seller, block
    if (user.role === "SELLER" && user.sellerId) {
      return res.status(400).json({
        success: false,
        message: "You already have an active seller account",
      });
    }

    // Find existing application
    let application = await SellerApplicationModel.findOne({ user: userId });

    if (!application) {
      // Create new application
      application = new SellerApplicationModel({
        user: userId,
        businessName: businessName.trim(),
        businessType: businessType || "",
        gstNumber: gstNumber || "",
        panNumber: panNumber || "",
        turnover: turnover || "",
        description: description || "",
        status: "DRAFT",
      });
    } else {
      // If already APPROVED, don't allow editing application anymore
      if (application.status === "APPROVED") {
        return res.status(400).json({
          success: false,
          message: "Your seller application is already approved",
        });
      }

      // Update fields
      application.businessName = businessName.trim();
      application.businessType = businessType || "";
      application.gstNumber = gstNumber || "";
      application.panNumber = panNumber || "";
      application.turnover = turnover || "";
      application.description = description || "";

      // If previously REJECTED, move back to DRAFT when business info is updated
      if (application.status === "REJECTED") {
        application.status = "DRAFT";
        application.adminRemark = "";
      }
    }

    await application.save();

    return res.json({
      success: true,
      message: "Business info saved to seller application",
      application,
    });
  } catch (err) {
    console.error("registerSeller error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                         USER: UPLOAD KYC DOCUMENTS                         */
/* -------------------------------------------------------------------------- */
// Upload seller KYC documents (Cloudinary URLs) & update status
export const uploadSellerDocument = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No document uploaded",
      });
    }

    const application = await SellerApplicationModel.findOne({ user: userId });
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Seller application not found",
      });
    }

    // Do not allow document upload if already approved
    if (application.status === "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Application already approved. Cannot upload more documents.",
      });
    }

    const uploaded = {};

    if (req.files.gstFile) {
      uploaded.gstFile = await uploadSellerDocCloudinary(
        req.files.gstFile[0],
        "seller/kyc/gst"
      );
    }
    if (req.files.panFile) {
      uploaded.panFile = await uploadSellerDocCloudinary(
        req.files.panFile[0],
        "seller/kyc/pan"
      );
    }
    if (req.files.addressProof) {
      uploaded.addressProof = await uploadSellerDocCloudinary(
        req.files.addressProof[0],
        "seller/kyc/address"
      );
    }

    application.documents = {
      ...application.documents,
      ...uploaded,
    };

    const { gstFile, panFile, addressProof } = application.documents;

    // Only move to PENDING_REVIEW if all docs are present
    const hasAllDocs = !!(gstFile && panFile && addressProof);

    if (hasAllDocs) {
      application.status = "PENDING_REVIEW";
    } else {
      // Keep in DRAFT until all docs are submitted
      if (application.status === "DRAFT" || application.status === "REJECTED") {
        application.status = "DRAFT";
      }
    }

    await application.save();

    res.json({
      success: true,
      message: hasAllDocs
        ? "Documents uploaded successfully. Application is pending review."
        : "Documents uploaded successfully. Please upload all required documents to submit for review.",
      documents: application.documents,
      status: application.status,
    });
  } catch (err) {
    console.error("uploadSellerDocument error:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Error uploading" });
  }
};

/* -------------------------------------------------------------------------- */
/*                   USER: GET MY OWN SELLER APPLICATION                      */
/* -------------------------------------------------------------------------- */
export const getMySellerApplication = async (req, res) => {
  try {
    const userId = req.userId;
    const application = await SellerApplicationModel.findOne({ user: userId });

    if (!application) {
      return res.json({
        success: true,
        application: null,
        message: "No seller application found",
      });
    }

    res.json({ success: true, application });
  } catch (err) {
    console.error("getMySellerApplication error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                  ADMIN: LIST & VIEW SELLER APPLICATIONS                    */
/* -------------------------------------------------------------------------- */
// Admin: List seller applications (optional ?status=PENDING_REVIEW etc.)
export const adminListSellerApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const applications = await SellerApplicationModel.find(query)
      .populate("user", "name email mobile role")
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (err) {
    console.error("adminListSellerApplications error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get single seller application details
export const adminGetSellerApplication = async (req, res) => {
  try {
    const { id } = req.params; // /admin/application/:id

    const application = await SellerApplicationModel.findById(id).populate(
      "user",
      "name email mobile role"
    );

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, application });
  } catch (err) {
    console.error("adminGetSellerApplication error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                 ADMIN: APPROVE / REJECT SELLER APPLICATION                 */
/* -------------------------------------------------------------------------- */
// Admin: Approve seller application
export const adminApproveSellerApplication = async (req, res) => {
  try {
    const { applicationId, remark } = req.body;

    if (!applicationId) {
      return res
        .status(400)
        .json({ success: false, message: "applicationId is required" });
    }

    const application = await SellerApplicationModel.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    if (application.status === "APPROVED") {
      return res
        .status(400)
        .json({ success: false, message: "Application already approved" });
    }

    // All KYC docs must exist before approval
    const { gstFile, panFile, addressProof } = application.documents || {};
    if (!gstFile || !panFile || !addressProof) {
      return res.status(400).json({
        success: false,
        message: "Cannot approve. All KYC documents are required.",
      });
    }

    const user = await UserModel.findById(application.user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // If already seller with sellerId, don't duplicate
    if (user.role === "SELLER" && user.sellerId) {
      return res.status(400).json({
        success: false,
        message: "User already has a seller account",
      });
    }

    // Create Seller entry
    const seller = await SellerModel.create({
      user: application.user,
      businessName: application.businessName,
      gstNumber: application.gstNumber || "",
      panNumber: application.panNumber || "",
      kycStatus: "VERIFIED",
      documents: application.documents,
      pickupAddress: null,
      bank: {}, // can be updated later by seller
    });

    // Update user role & link
    user.role = "SELLER";
    user.sellerId = seller._id;
    await user.save();

    // Update application status & remark
    application.status = "APPROVED";
    application.adminRemark = remark || "";
    await application.save();

    res.json({
      success: true,
      message: "Seller application approved and seller account created",
      seller,
    });
  } catch (err) {
    console.error("adminApproveSellerApplication error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Reject seller application
export const adminRejectSellerApplication = async (req, res) => {
  try {
    const { applicationId, remark } = req.body;

    if (!applicationId) {
      return res
        .status(400)
        .json({ success: false, message: "applicationId is required" });
    }

    const application = await SellerApplicationModel.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // If already approved, do not allow reject
    if (application.status === "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Cannot reject an already approved application",
      });
    }

    application.status = "REJECTED";
    application.adminRemark = remark || "Application rejected by admin";
    await application.save();

    res.json({
      success: true,
      message: "Seller application rejected",
      application,
    });
  } catch (err) {
    console.error("adminRejectSellerApplication error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                   SELLER: SUBSCRIBE TO A PLAN (AFTER APPROVAL)             */
/* -------------------------------------------------------------------------- */
export const subscribeToPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const { planId, duration } = req.body; // duration like "month_1", "month_3"

    if (!planId || !duration) {
      return res.status(400).json({
        success: false,
        message: "planId and duration are required",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user || user.role !== "SELLER" || !user.sellerId) {
      return res.status(403).json({
        success: false,
        message: "Only approved sellers can subscribe",
      });
    }

    const seller = await SellerModel.findById(user.sellerId);
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    if (seller.kycStatus !== "VERIFIED") {
      return res.status(400).json({
        success: false,
        message: "KYC must be verified before subscribing to a plan",
      });
    }

    const plan = await SellerSubscriptionModel.findById(planId);
    if (!plan || plan.status !== "ACTIVE") {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or inactive plan" });
    }

    if (!plan.pricing[duration]) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration key",
      });
    }

    // duration like "month_1" -> extract 1
    const months = Number(duration.replace("month_", ""));
    if (!months || isNaN(months)) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration format",
      });
    }

    const now = new Date();
    // If existing subscription is still active, extend from old expiry
    const baseDate =
      seller.subscription &&
      seller.subscription_expiry &&
      seller.subscription_expiry > now
        ? seller.subscription_expiry
        : now;

    const expiryDate = new Date(baseDate);
    expiryDate.setMonth(expiryDate.getMonth() + months);

    seller.subscription = planId;
    seller.subscription_expiry = expiryDate;
    await seller.save();

    res.json({
      success: true,
      message: "Subscription activated",
      expiryDate,
    });
  } catch (err) {
    console.error("subscribeToPlan error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                  SUBSCRIPTION PLAN CRUD (ADMIN, BUT REUSED)                */
/* -------------------------------------------------------------------------- */

// CREATE
export const createSubscription = async (req, res) => {
  try {
    const { name, features, pricing } = req.body;

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Plan name is required" });
    }

    if (!Array.isArray(features) || features.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one feature is required",
      });
    }

    if (
      !pricing ||
      typeof pricing !== "object" ||
      pricing.month_1 == null ||
      pricing.month_3 == null ||
      pricing.month_6 == null ||
      pricing.month_12 == null
    ) {
      return res.status(400).json({
        success: false,
        message: "All pricing durations (month_1, month_3, month_6, month_12) are required",
      });
    }

    const plan = await SellerSubscriptionModel.create(req.body);
    res.status(201).json({ success: true, plan });
  } catch (err) {
    console.error("createSubscription error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL
export const getSubscriptions = async (req, res) => {
  try {
    // Keep behavior same as your existing frontend – returns all plans
    const plans = await SellerSubscriptionModel.find().sort({
      priorityLevel: -1,
    });
    res.json({ success: true, plans });
  } catch (err) {
    console.error("getSubscriptions error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ONE (ID from body)
export const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });

    const plan = await SellerSubscriptionModel.findById(id);
    if (!plan)
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });

    res.json({ success: true, plan });
  } catch (err) {
    console.error("getSubscriptionById error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE (ID from body)
export const updateSubscription = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });

    const plan = await SellerSubscriptionModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!plan)
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });

    res.json({ success: true, plan });
  } catch (err) {
    console.error("updateSubscription error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE (ID from body)
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });

    const plan = await SellerSubscriptionModel.findByIdAndDelete(id);
    if (!plan)
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });

    res.json({ success: true, message: "Plan deleted successfully" });
  } catch (err) {
    console.error("deleteSubscription error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                          SELLER PROFILE (OPTIONAL)                         */
/* -------------------------------------------------------------------------- */

export const getSellerProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId).populate({
      path: "sellerId",
      populate: {
        path: "subscription",
        model: "sellerSubscription",
      },
    });

    if (!user || !user.sellerId) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    res.json({
      success: true,
      seller: user.sellerId,
    });
  } catch (err) {
    console.error("getSellerProfile error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
