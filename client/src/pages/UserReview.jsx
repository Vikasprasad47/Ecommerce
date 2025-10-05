import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdErrorOutline, MdReviews, MdOutlinePhotoLibrary } from "react-icons/md";
import { FiRefreshCcw, FiSearch } from "react-icons/fi";
import { TbPhotoOff, TbMoodEmpty } from "react-icons/tb";

const UserReview = () => {
  const user = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);

  // Filtered & sorted reviews
  const processedReviews = useMemo(() => {
    let filtered = reviews.filter((review) => {
      const name = review?.product?.name?.toLowerCase() || "";
      const matchesSearch = name.includes(searchTerm.toLowerCase());
      const matchesRating = filterRating === "all" || review.rating === +filterRating;
      return matchesSearch && matchesRating;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest": return new Date(a.createdAt) - new Date(b.createdAt);
        case "highest": return b.rating - a.rating;
        case "lowest": return a.rating - b.rating;
        default: return 0;
      }
    });
  }, [reviews, searchTerm, sortBy, filterRating]);

  const fetchUserReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await Axios(SummaryApi.getUserReviews);
      if (res.data?.success) setReviews(res.data.data || []);
      else throw new Error(res.data?.message || "Failed to fetch reviews");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?._id) fetchUserReviews();
  }, [user?._id, fetchUserReviews]);

  const StarRating = ({ rating, interactive = false, onRate }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => {
          const value = i + 1;
          const filled = value <= (hoverRating || rating);
          return (
            <button
              key={i}
              type={interactive ? "button" : "div"}
              onMouseEnter={() => interactive && setHoverRating(value)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              onClick={() => interactive && onRate(value)}
              className={`transition ${interactive ? "hover:scale-110" : ""}`}
            >
              {filled ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-300" />}
            </button>
          );
        })}
      </div>
    );
  };

  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-100 rounded-lg p-4">
      <div className="h-40 bg-gray-200 mb-3 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  const ReviewModal = ({ review, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {review?.product?.images?.[0] && (
          <div className="h-40 flex items-center justify-center bg-gray-50">
            <img src={review.product.images[0]} alt={review.product.name} className="h-32 object-contain" />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-bold text-lg">{review?.product?.name || "Unnamed Product"}</h3>
          <div className="flex items-center gap-2 my-2">
            <StarRating rating={review.rating} />
            <span className="text-sm text-gray-500">{review.rating}/5</span>
          </div>
          <p className="text-gray-700 mb-4">{review.comment || "No comment provided."}</p>
          <div className="flex justify-end gap-2 text-sm text-gray-500">
            <span>Reviewed on {new Date(review.createdAt).toLocaleDateString()}</span>
            <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Close</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <MdReviews className="text-3xl text-blue-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">My Reviews</h2>
            <p className="text-gray-600 text-sm">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <div className="relative">
            <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reviews..."
              className="pl-8 pr-3 py-2 border rounded-md w-full md:w-64"
            />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="py-2 border rounded-md w-full md:w-40">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
          <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="py-2 border rounded-md w-full md:w-40">
            <option value="all">All Ratings</option>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
          </select>
        </div>
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-20">
          <MdErrorOutline className="text-6xl text-red-500 mb-4" />
          <p className="text-gray-700 mb-4">{error}</p>
          <button onClick={fetchUserReviews} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 mx-auto">
            <FiRefreshCcw /> Retry
          </button>
        </div>
      )}

      {!loading && !error && processedReviews.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <TbMoodEmpty className="text-6xl mb-4 mx-auto" />
          <p>No reviews found.</p>
        </div>
      )}

      {!loading && !error && processedReviews.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          <AnimatePresence>
            {processedReviews.map((review) => {
              const product = review.product || {};
              const image = product.images?.[0] || null;
              return (
                <motion.div
                  key={review._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  className="border rounded-lg bg-white cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition"
                  onClick={() => setSelectedReview(review)}
                >
                  {image ? (
                    <img src={image} alt={product.name} className="w-full h-40 object-contain bg-gray-100" />
                  ) : (
                    <div className="flex items-center justify-center h-40 bg-gray-100 text-gray-400">
                      <TbPhotoOff className="text-3xl" />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm line-clamp-2">{product.name || "Unnamed Product"}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-gray-500">{review.rating}/5</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-2">{review.comment || "No comment"}</p>
                    <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {selectedReview && <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default UserReview;
