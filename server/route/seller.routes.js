// import express from "express";
// import { 
//     createSubscription,
//     getSubscriptions,
//     getSubscriptionById,
//     updateSubscription,
//     deleteSubscription,
//     registerSeller,
//     uploadSellerDocuments,
// } from "../controllers/seller.controller.js";

// import {admin} from "../middleware/admin.js"
// import auth from "../middleware/auth.js";
// const seller = express.Router();

// // Admin CRUD (NO PARAMS)
// seller.post("/subscription/create-subscription-plan", auth, admin, createSubscription);             // req.body
// seller.post("/subscription/get-one-subscription-plan", auth , getSubscriptionById);                 // req.body.id
// seller.post("/subscription/update-subscription-plan", auth , admin, updateSubscription);            // req.body.id + fields
// seller.post("/subscription/delete-subscription-plan", auth , admin, deleteSubscription);            // req.body.id

// // Public
// seller.get("/subscription/get-subscription-plan", getSubscriptions);

// seller.post("/register", auth, registerSeller);
// seller.post("/upload-documents", auth, uploadSellerDocuments);





// export default seller;




// routes/seller.routes.js
import express from "express";
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  registerSeller,
  uploadSellerDocument,
  getMySellerApplication,
  adminListSellerApplications,
  adminGetSellerApplication,
  adminApproveSellerApplication,
  adminRejectSellerApplication,
  subscribeToPlan,
  getSellerProfile,
} from "../controllers/seller.controller.js";
import upload from "../middleware/multer.js";
import { admin } from "../middleware/admin.js";
import auth from "../middleware/auth.js";

const sellerRouter = express.Router();

/** ----------------- SUBSCRIPTION PLAN CRUD (ADMIN) ----------------- */

sellerRouter.post(
  "/subscription/create-subscription-plan",
  auth,
  admin,
  createSubscription
);
sellerRouter.post(
  "/subscription/get-one-subscription-plan",
  auth,
  getSubscriptionById
);
sellerRouter.post(
  "/subscription/update-subscription-plan",
  auth,
  admin,
  updateSubscription
);
sellerRouter.post(
  "/subscription/delete-subscription-plan",
  auth,
  admin,
  deleteSubscription
);

// Public / authenticated: list plans (you already use this on frontend)
sellerRouter.get("/subscription/get-subscription-plan", getSubscriptions);

// SELLER: subscribe to a plan (after approval)
sellerRouter.post("/subscription/subscribe", auth, subscribeToPlan);

/** ----------------- SELLER APPLICATION (USER) ----------------- */

// Save business info (DRAFT application or update)
sellerRouter.post("/register", auth, registerSeller);

// Upload KYC docs & move to PENDING_REVIEW when all docs exist
sellerRouter.post(
  "/upload-documents",
  auth,
  upload.fields([
    { name: "gstFile", maxCount: 1 },
    { name: "panFile", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
  ]),
  uploadSellerDocument
);

// Get my current application status
sellerRouter.get("/application/me", auth, getMySellerApplication);

/** ----------------- SELLER APPLICATION (ADMIN) ----------------- */

// Admin list applications: ?status=PENDING_REVIEW / APPROVED / REJECTED
sellerRouter.get("/admin/applications", auth, admin, adminListSellerApplications);

// Admin get single application
sellerRouter.get("/admin/application/:id", auth, admin, adminGetSellerApplication);

// Admin approve
sellerRouter.post(
  "/admin/application/approve",
  auth,
  admin,
  adminApproveSellerApplication
);

// Admin reject
sellerRouter.post(
  "/admin/application/reject",
  auth,
  admin,
  adminRejectSellerApplication
);

/** ----------------- SELLER PROFILE (FOR SELLER DASHBOARD) ----------------- */

sellerRouter.get("/profile", auth, getSellerProfile);

export default sellerRouter;
