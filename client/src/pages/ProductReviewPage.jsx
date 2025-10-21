import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaSpinner, FaRegThumbsUp, FaThumbsUp, FaTimes, FaChevronLeft, FaChevronRight, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { HiOutlineUserCircle, HiOutlinePhotograph } from "react-icons/hi";
import { FiEdit2, FiTrash2, FiSend } from "react-icons/fi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";
import toast from "react-hot-toast";
import { LuInfo } from "react-icons/lu";
import ImageGalleryModal from "../components/ImageGalleryModal";

// Constants
const ICON_SIZES = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6"
};

// Star Rating Component
const StarRating = React.memo(({ rating, setRating, readOnly = false, size = "md" }) => {
  const renderStar = (star) => {
    if (star <= rating) {
      return <FaStar className={`${ICON_SIZES[size]} text-amber-500 cursor-pointer ${readOnly ? "pointer-events-none" : ""}`} />;
    }
    if (star - 0.5 <= rating) {
      return <FaStarHalfAlt className={`${ICON_SIZES[size]} text-amber-500 cursor-pointer ${readOnly ? "pointer-events-none" : ""}`} />;
    }
    return <FaRegStar className={`${ICON_SIZES[size]} text-gray-300 cursor-pointer ${readOnly ? "pointer-events-none" : ""}`} />;
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div
          key={star}
          whileHover={!readOnly ? { scale: 1.2 } : {}}
          whileTap={!readOnly ? { scale: 0.9 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={() => !readOnly && setRating(star)}
        >
          {renderStar(star)}
        </motion.div>
      ))}
    </div>
  );
});


const ProductReviewPage = ({ productId, productData, onReviewSubmitted }) => {
  const fileInputRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [editReviewId, setEditReviewId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [imagePreviewIndex, setImagePreviewIndex] = useState(null);
  const [imagePreviewList, setImagePreviewList] = useState([]);
  const [helpfulClicked, setHelpfulClicked] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [sortOption, setSortOption] = useState("recent");
  const [showInfo, setShowInfo] = useState(false);
  const [filterRating, setFilterRating] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const allReviewImages = reviews.flatMap((review) => review.images || []).filter(Boolean);
  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = (images, index) => {
    setGalleryImages(images);
    setActiveIndex(index);
  };

  const closeModal = () => setActiveIndex(null);

  const goToNext = () =>
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);

    const goToPrev = () =>
    setActiveIndex((prev) =>
    prev === 0 ? galleryImages.length - 1 : prev - 1
  );

  // Product data
  const averageRating = productData?.ratings?.average || 0;
  const reviewCount = productData?.ratings?.count || 0;

  // Fetch reviews with sorting
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await Axios(SummaryApi.getReviewsByProduct(productId));
      const sortedReviews = sortReviews(res.data.reviews, sortOption);
      setReviews(sortedReviews);
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [productId, sortOption]);

  const sortOptionLabels = {
    recent: "Most Recent",
    highest: "Highest Rated",
    lowest: "Lowest Rated",
    helpful: "Most Helpful"
  };


  const sortReviews = (reviews, option) => {
    const sorted = [...reviews];
    switch (option) {
      case "recent":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      case "helpful":
        return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
      default:
        return sorted;
    }
  };

  // Review submission
  const handleSubmit = async () => {
    if (!rating) {
      toast.dismiss()
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.dismiss()
      toast.error("Please write your review");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("title", title.trim());
      formData.append("comment", comment.trim());
      
      if (!editReviewId) {
        images.forEach((file) => formData.append("images", file));
      }

      if (editReviewId) {
        await Axios({
          ...SummaryApi.updateReview(editReviewId),
          data: { rating, title: title.trim(), comment: comment.trim() },
        });
        toast.dismiss()
        toast.success("Review updated successfully");
      } else {
        await Axios.post(`/api/review/product/${productId}`, formData);
        toast.dismiss()
        toast.success("Thank you for your review!");
      }

      resetForm();
      fetchReviews();
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setRating(0);
    setTitle("");
    setComment("");
    setEditReviewId(null);
    setImages([]);
    setShowForm(false);
  };

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(review => Math.round(review.rating) === star).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(review => Math.round(review.rating) === star).length / reviews.length) * 100
      : 0
  }));

  // Effects
  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId, sortOption, fetchReviews]);

  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (typeof image !== 'string') {
          URL.revokeObjectURL(URL.createObjectURL(image));
        }
      });
    };
  }, [images]);

  const markHelpful = async (reviewId) => {
  try {
    const res = await Axios.patch(`/api/review/helpful/${reviewId}`);
    const { message, helpfulCount, marked } = res.data;

    // ✅ Update helpfulClicked state to reflect toggle
    setHelpfulClicked((prev) => ({
      ...prev,
      [reviewId]: marked,
    }));

    // ✅ Update review helpful count
    setReviews((prevReviews) =>
      prevReviews.map((r) =>
        r._id === reviewId ? { ...r, helpfulCount } : r
      )
    );
    toast.dismiss();
    toast.success(message);
  } catch (err) {
    toast.dismiss();
    toast.error(err?.response?.data?.message || "Failed to update helpful status.");
  }
};

  //commented
  const handleEdit = (review) => {
    setEditReviewId(review._id);
    setTitle(review.title || "");
    setComment(review.comment || "");
    setRating(review.rating || 0);
    setShowForm(true);
  };

  //commnented
  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await Axios.delete(`/api/review/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.dismiss();
      toast.success("Review deleted successfully.");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to delete review.");
    }
  };

  const closeImageViewer = () => {
    setImagePreviewIndex(null);
    setImagePreviewList([]);
  };

  const prevImage = () => {
    setImagePreviewIndex((prev) =>
      prev > 0 ? prev - 1 : imagePreviewList.length - 1
    );
  };

  const nextImage = () => {
    setImagePreviewIndex((prev) =>
      prev < imagePreviewList.length - 1 ? prev + 1 : 0
    );
  };

  const handleFileSelection = (selectedFiles) => {
    const validFiles = selectedFiles
      .filter(file => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024)
      .slice(0, 5 - images.length);

    if (validFiles.length + images.length > 5) {
      toast.dismiss();
      toast.error("You can upload up to 5 images.");
      return;
    }

    setImages((prev) => [...prev, ...validFiles]);
  };


  return (
    <div className="max-w-full mx-auto px-4 pt-0 sm:px-6 py-3">

      <div>
        {/* Rating Summary */}
        {productData?.ratings?.average > 0 && productData?.ratings?.count > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-gray-100 transition-all duration-300 hover:shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h5 className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                  <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                    Ratings & Reviews
                  </span>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                    {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                  </span>
                </h5>
              </div>
              <button 
                className="text-gray-500 hover:text-amber-500 transition-colors"
                aria-label="Ratings information"
                onClick={() => setShowInfo(!showInfo)}
              >
                <LuInfo className="w-5 h-5" />
              </button>
            </div>

            {/* Info Tooltip (conditionally rendered) */}
            {showInfo && (
              <div className="mb-6 p-4 bg-amber-50 text-amber-800 rounded-lg text-sm animate-fadeIn">
                Ratings are calculated from verified purchases and community contributions.
              </div>
            )}

            <div className="flex flex-col md:flex-row lg:flex-row gap-8 items-center justify-between">
              {/* Overall Rating - Animated Card */}
              <div className="w-full lg:w-auto flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 to-amber-100  rounded-xl border border-amber-100 shadow-inner">
                <div className="relative">
                  <div className="text-5xl lg:text-6xl font-bold text-gray-900 mb-2 text-center">
                    {averageRating.toFixed(1)}
                    <span className="text-2xl text-gray-500">/5</span>
                  </div>
                  
                </div>
                
                <StarRating 
                  rating={averageRating} 
                  readOnly 
                  size="lg"
                  className="my-3"
                />
                
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div 
                      key={star} 
                      className="text-xs font-medium px-2 py-1 rounded-full bg-white shadow-sm"
                      onClick={() => setFilterRating(star)}
                    >
                      {star}★
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Rating Distribution - Interactive */}
              <div className="flex-1 w-full space-y-4">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div 
                    key={star} 
                    className="flex items-center gap-3 group cursor-pointer"
                    onClick={() => setFilterRating(star)}
                  >
                    <div className="flex items-center w-8">
                      <span className="text-sm font-medium text-gray-700 w-6">{star}</span>
                      <svg className="w-4 h-4 text-amber-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    
                    {/* Animated progress bar */}
                    <div className="flex-1 relative h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20" />
                    </div>
                    
                    <div 
                      className={`text-sm font-medium w-12 text-right transition-all ${filterRating === star ? 'text-amber-600 scale-110' : 'text-gray-500'}`}
                    >
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive controls */}
              <div className="lg:flex lg:justify-end md:flex md:justify-end xl:flex xl:justify-end flex items-center justify-between">
              <div className="flex justify-end mt-3 md:w-fit lg:w-fit xl:w-fit w-full flex-row-reverse gap-4">
                {/* Enhanced select with floating label effect */}
                {/* <div className="relative flex-1 min-w-[180px]">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm transition-all cursor-pointer"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div> */}
                <div className="relative flex-1 min-w-[180px]">
  {/* Hidden select for form submission */}
  <select
    value={sortOption}
    onChange={(e) => setSortOption(e.target.value)}
    className="hidden"
  >
    <option value="recent">Most Recent</option>
    <option value="highest">Highest Rated</option>
    <option value="lowest">Lowest Rated</option>
    <option value="helpful">Most Helpful</option>
  </select>
  
  {/* Custom select UI */}
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-7 py-3  text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm transition-all cursor-pointer hover:bg-gray-50"
  >
    <span>
      {sortOption === 'recent' && 'Most Recent'}
      {sortOption === 'highest' && 'Highest Rated'}
      {sortOption === 'lowest' && 'Lowest Rated'}
      {sortOption === 'helpful' && 'Most Helpful'}
    </span>
    <svg
      className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </button>

  {/* Dropdown options */}
  {isOpen && (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl py-1 shadow-lg">
      {[
        { value: 'recent', label: 'Most Recent' },
        { value: 'highest', label: 'Highest Rated' },
        { value: 'lowest', label: 'Lowest Rated' },
        { value: 'helpful', label: 'Most Helpful' },
      ].map((option) => (
        <div
          key={option.value}
          onClick={() => {
            setSortOption(option.value);
            setIsOpen(false);
          }}
          className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
            sortOption === option.value
              ? 'bg-amber-50 text-amber-700'
              : 'hover:bg-gray-50'
          }`}
        >
          {option.label}
        </div>
      ))}
    </div>
  )}
</div>

                {/* Animated review button with icon */}
                <button
                  onClick={() => setShowForm(!showForm)}
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                    showForm
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-amber-500/30'
                  }`}
                >
                  {showForm ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </>
                  ) : (
                    <>
                      Add Rating
                    </>
                  )}
                </button>
              </div>
              </div>

              {/* Filter indicator */}
              {filterRating && (
                <div className="mt-6 flex justify-between items-center p-3 bg-amber-50  rounded-lg">
                  <span className="text-sm text-amber-800 ">
                    Showing reviews filtered by {filterRating} star rating
                  </span>
                  <button 
                    onClick={() => setFilterRating(null)}
                    className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-colors"
                  >
                    Clear filter
                  </button>
                </div>
              )}
          </div>
        )}
      

        {/* Review Form (Inline) */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editReviewId ? "Edit Your Review" : "Share Your Experience"}
            </h3>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-5">
              <div className="flex flex-col items-start">
                <label className="text-sm font-medium text-gray-700 mb-2">Your Rating*</label>
                <StarRating rating={rating} setRating={setRating} size="md" />
              </div>

              <div>
                <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Review Title
                </label>
                <input
                  id="review-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
                  maxLength="100"
                />
              </div>

              <div>
                <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Review*
                </label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
                  required
                  maxLength="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Photos (Optional)
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files.length) {
                      handleFileSelection(Array.from(e.dataTransfer.files));
                    }
                  }}
                  onClick={() => fileInputRef.current.click()}
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                    isDragging ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-amber-400 bg-gray-50"
                  }`}
                >
                  <HiOutlinePhotograph className="w-8 h-8 mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500 text-center">
                    <span className="font-medium">Drag & drop photos</span> or click to browse
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileSelection(Array.from(e.target.files))}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">JPEG, PNG up to 5MB (max 5 images)</p>
              </div>

              {images.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview ({images.length}/5)</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => {
                      const url = typeof img === 'string' ? img : URL.createObjectURL(img);
                      return (
                        <div key={idx} className="relative group flex-shrink-0">
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                            onLoad={() => typeof img !== 'string' && URL.revokeObjectURL(url)}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImages(images.filter((_, i) => i !== idx));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm transition-all text-sm font-medium flex items-center gap-2"
                >
                  {loading && <FaSpinner className="animate-spin" />}
                  {editReviewId ? "Update Review" : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="bg-white p-6  rounded-2xl shadow-lg border border-gray-100  transition-all duration-300 hover:shadow-xl">
      {loading && reviews.length === 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="">
          <HiOutlineUserCircle className="mx-auto w-12 h-12 text-gray-300" />
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-gray-700 mt-3">No reviews yet</h3>
            <p className="text-gray-500 mt-1">Be the first to share your thoughts!</p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm transition-all text-sm font-medium"
            >
              Write a Review
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10 divide-y divide-gray-200">
          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className=""
            >
              {/* Header: Avatar, Name+Stars, Date+Helpful */}
              <div className="flex flex-row lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left: Avatar + Name + Stars */}
                <div className="flex items-center gap-4 w-full">
                  <div className="relative">
                    {review.user?.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
                        <HiOutlineUserCircle className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    {review.verifiedPurchase && (
                      <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                        <RiVerifiedBadgeFill className="text-blue-600 w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-base line-clamp-1">
                      {review.user?.name || "Anonymous"}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <StarRating rating={review.rating} readOnly size="sm" />
                    </div>
                  </div>
                </div>

                {/* Right: Date + Helpful */}
                <div className="flex flex-col items-end gap-2 text-sm text-gray-500 w-full">
                  <span>
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => markHelpful(review._id)}
                    className={`w-fit flex items-center gap-1 px-0 py-1.5 rounded-full font-medium transition-colors ${
                      helpfulClicked[review._id]
                        ? ""
                        : ""
                    }`}
                    disabled={helpfulClicked[review._id]}
                  >
                    {helpfulClicked[review._id] ? (
                      <FaThumbsUp className="text-amber-500" />
                    ) : (
                      <FaRegThumbsUp />
                    )}
                    Helpful ({review.helpfulCount})
                  </button>
                </div>
              </div>

              {/* Title & Comment */}
              <div className="mt-4 pl-2 lg:pl-0">
                {review.title && (
                  <h5 className="font-semibold text-gray-800 text-base mb-1">{review.title}</h5>
                )}
                <p className="text-gray-700 text-sm whitespace-pre-line">{review.comment}</p>
              </div>

              {/* Review Images */}
              <div className="mt-4 pl-2 pb-3 lg:pl-0 mb-2 flex gap-2 overflow-x-auto snap-x scroll-smooth scrollbar-hide">
                {review.images.map((img, idx) => {
                  const imageUrl = typeof img === 'string' ? img : img.url;
                  return (
                    <div
                      key={`${imageUrl}-${idx}`}
                      className="w-24 aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer snap-start flex-shrink-0 transition-transform hover:scale-105"
                      onClick={() => handleImageClick(review.images, idx)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Open image ${idx + 1}`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Review image ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  );
                })}
              </div>


              {/* Actions */}
              {/* <div className="mt-6 flex flex-row items-center mb-2 justify-between gap-4 text-sm pl-0 lg:pl-0">
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(review)}
                    className="text-gray-500 hover:text-amber-600 flex items-center gap-1 font-medium transition"
                  >
                    <FiEdit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-gray-500 hover:text-red-600 flex items-center gap-1 font-medium transition"
                  >
                    <FiTrash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div> */}
            </motion.div>
          ))}
        </div>

      )}
      </div>
      {/* Image Preview Modal */}
      {/* <AnimatePresence>
        {activeIndex !== null && (
          <ImageGalleryModal
            reviews={reviews}
            images={galleryImages}
            activeIndex={activeIndex}
            onClose={closeModal}
          />
        )}
      </AnimatePresence> */}

    </div>
  );
};

export default ProductReviewPage;