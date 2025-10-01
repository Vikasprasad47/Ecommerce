import ReviewModel from "../models/ProductReview.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";
import uploadUserReviewedImage from "../utils/uploadUserImageDatatocloudinary.js"

// Helper: Update product averageRating & reviewCount
export const updateProductStats = async (productId) => {
  // const reviews = await ReviewModel.find({ product: productId, status: "approved" });
  const reviews = await ReviewModel.find({ product: productId }); // remove status filter
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
    : 0;

  await ProductModel.findByIdAndUpdate(productId, {
    "ratings.average": Number(averageRating.toFixed(1)),
    "ratings.count": totalReviews,
  });
};

// Create a new review
export const createReview = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.userId;
    const { rating, title, comment, pros, cons, verifiedPurchase } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existing = await ReviewModel.findOne({ product: productId, user: userId });
    if (existing) return res.status(400).json({ message: "You have already reviewed this product" });

    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const uploaded = await uploadUserReviewedImage({
          buffer: file.buffer,
          originalname: file.originalname
        });

        return {
          url: uploaded.secure_url,
          caption: file.originalname
        };
      });

      uploadedImages = await Promise.all(uploadPromises);
    }

    const newReview = await ReviewModel.create({
      product: productId,
      user: userId,
      rating,
      title: title || "",
      comment,
      images: uploadedImages,
      pros: pros || [],
      cons: cons || [],
      verifiedPurchase: verifiedPurchase || false,
    });

    await UserModel.findByIdAndUpdate(userId, { $push: { reviews: newReview._id } });
    await updateProductStats(productId);

    return res.status(201).json({ message: "Review submitted", review: newReview });
  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(500).json({ 
      message: error.message || error,
      error: true,
      success: false, 
    });
  }
};

// Get reviews for a product with pagination
export const getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { page = 1, limit = 10 } = req.query;

    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const reviews = await ReviewModel.find({ product: productId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await ReviewModel.countDocuments({ product: productId });

    return res.json({
      reviews,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({ 
      message: error.message || error,
      error: true,
      success: false, 
    });
  }
};

// Update a review by id (only by owner)
export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.userId;
    const updateData = req.body;

    const review = await ReviewModel.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    // Prevent changing product/user fields
    delete updateData.product;
    delete updateData.user;

    const updatedReview = await ReviewModel.findByIdAndUpdate(reviewId, updateData, { new: true });

    await updateProductStats(updatedReview.product);

    res.json({ message: "Review updated", review: updatedReview });
  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({ 
      message: error.message || error,
      error: true,
      success: false, 
    });
  }
};

// Delete a review by id (only by owner)
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.userId;

    const review = await ReviewModel.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await ReviewModel.findByIdAndDelete(reviewId);

    await UserModel.findByIdAndUpdate(userId, { $pull: { reviews: review._id } });

  await updateProductStats(review.product);

    res.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ 
      message: error.message || error,
      error: true,
      success: false, 
    });
  }
};

export const markReviewHelpful = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.userId;
    const review = await ReviewModel.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Prevent same user from increasing helpful count multiple times
    if (review.helpfulBy?.includes(userId)) {
      return res.status(400).json({ message: "You already marked as helpful" });
    }

    review.helpfulCount = (review.helpfulCount || 0) + 1;
    review.helpfulBy = [...(review.helpfulBy || []), userId];

    await review.save();

    res.json({ message: "Marked as helpful", helpfulCount: review.helpfulCount });
  } catch (error) {
    console.error("Helpful Review Error:", error);
    res.status(500).json({ 
      message: error.message || error,
      error: true,
      success: false, 
    });
  }
};