// import React, { useState, useRef } from "react";
// import { FaTimes, FaSpinner } from "react-icons/fa";
// import { HiOutlinePhotograph } from "react-icons/hi";
// import { motion, AnimatePresence } from "framer-motion";
// import { StarRating } from "../pages/ProductReviewPage";
// import Axios from "../utils/network/axios";
// import SummaryApi from "../comman/summaryApi";
// import toast from "react-hot-toast";

// const WriteReview = ({
//   isOpen,
//   productId,
//   existingReview = null, 
//   onSuccess = () => {},    
//   onClose = () => {},      
// }) => {
//   const fileInputRef = useRef(null);

//   const [rating, setRating] = useState(existingReview?.rating || 0);
//   const [title, setTitle] = useState(existingReview?.title || "");
//   const [comment, setComment] = useState(existingReview?.comment || "");
//   const [images, setImages] = useState(existingReview?.images || []);
//   const [loading, setLoading] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);

//   if (!isOpen) return null;

//   // Handle image selection
//   const handleFileSelection = (files) => {
//     const validFiles = files
//       .filter((file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024)
//       .slice(0, 5 - images.length);

//     if (validFiles.length + images.length > 5) {
//       toast.error("Max 5 images allowed");
//       return;
//     }

//     setImages((prev) => [...prev, ...validFiles]);
//   };

//   // Submit handler
//   const handleSubmit = async () => {
//     if (!rating) return toast.error("Please select a rating");
//     if (!comment.trim()) return toast.error("Please write your review");

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("rating", rating);
//       formData.append("title", title);
//       formData.append("comment", comment);

//       images.forEach((file) => {
//         if (typeof file !== "string") formData.append("images", file);
//       });

//       if (existingReview) {
//         await Axios({
//           ...SummaryApi.updateReview(existingReview._id),
//           data: { rating, title, comment },
//         });
//         toast.success("Review updated");
//       } else {
//         await Axios.post(`/api/review/product/${productId}`, formData);
//         toast.success("Review submitted");
//       }

//       onSuccess();
//       onClose();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to submit review");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >

//           {/* MODAL CARD */}
//           <motion.div
//             className="bg-white rounded-xl shadow-xl w-[95%] max-w-lg p-6 relative overflow-y-auto max-h-[90vh]"
//             initial={{ scale: 0.85, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.85, opacity: 0 }}
//             transition={{ type: "spring", stiffness: 200, damping: 20 }}
//           >
//             {/* Close Button */}
//             <button
//               className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full"
//               onClick={onClose}
//             >
//               <FaTimes className="text-gray-600" size={18} />
//             </button>

//             {/* Title */}
//             <h2 className="text-xl font-semibold mb-4">
//               {existingReview ? "Edit Review" : "Write a Review"}
//             </h2>

//             {/* Rating */}
//             <div>
//               <label className="text-sm font-medium text-gray-600">Your Rating*</label>
//               <StarRating rating={rating} setRating={setRating} size="md" />
//             </div>

//             {/* Title */}
//             <div className="mt-4">
//               <label className="text-sm font-medium text-gray-600">Review Title</label>
//               <input
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Short title"
//                 className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
//               />
//             </div>

//             {/* Comment */}
//             <div className="mt-4">
//               <label className="text-sm font-medium text-gray-600">Detailed Review*</label>
//               <textarea
//                 rows={4}
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
//                 placeholder="Describe your experience..."
//               />
//             </div>

//             {/* Images */}
//             <div className="mt-4">
//               <label className="text-sm font-medium text-gray-600">Photos (Optional)</label>

//               <div
//                 onDragOver={(e) => {
//                   e.preventDefault();
//                   setIsDragging(true);
//                 }}
//                 onDragLeave={() => setIsDragging(false)}
//                 onDrop={(e) => {
//                   e.preventDefault();
//                   setIsDragging(false);
//                   handleFileSelection(Array.from(e.dataTransfer.files));
//                 }}
//                 onClick={() => fileInputRef.current.click()}
//                 className={`h-32 border-2 border-dashed flex flex-col items-center justify-center rounded-lg cursor-pointer ${
//                   isDragging ? "border-amber-500 bg-amber-50" : "border-gray-300"
//                 }`}
//               >
//                 <HiOutlinePhotograph className="w-10 h-10 text-gray-300" />
//                 <p className="text-sm text-gray-500">Drag & drop images or click</p>

//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   accept="image/*"
//                   multiple
//                   className="hidden"
//                   onChange={(e) => handleFileSelection(Array.from(e.target.files))}
//                 />
//               </div>

//               {/* Image Preview */}
//               {images.length > 0 && (
//                 <div className="flex gap-2 overflow-x-auto mt-3">
//                   {images.map((img, i) => {
//                     const url = typeof img === "string" ? img : URL.createObjectURL(img);
//                     return (
//                       <div key={i} className="relative">
//                         <img
//                           src={url}
//                           className="h-20 w-20 rounded-lg object-cover border"
//                         />
//                         <button
//                           onClick={() => setImages(images.filter((_, idx) => idx !== i))}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//                         >
//                           <FaTimes size={10} />
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Submit Button */}
//             <div className="mt-6 flex justify-end gap-3">
//               <button onClick={onClose} className="text-sm text-gray-600">
//                 Cancel
//               </button>

//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="px-6 py-2 bg-amber-600 text-white rounded-lg flex items-center gap-2"
//               >
//                 {loading && <FaSpinner className="animate-spin" />}
//                 {existingReview ? "Update Review" : "Submit Review"}
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };
// WriteReview.jsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaSpinner,
  FaCheck,
  FaImage,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { FaChevronDown, FaChevronUp  } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import toast from "react-hot-toast";
import Axios from "../utils/network/axios";
import SummaryApi from "../comman/summaryApi";
import AxiosToastError from "../utils/network/AxiosToastError";

const RATING_LABELS = {
  1: "Very poor",
  2: "Not good",
  3: "Average",
  4: "Very good",
  5: "Excellent",
};

const QUICK_TITLES = {
  1: "Very disappointed",
  2: "Not good enough",
  3: "It's okay",
  4: "Really good product",
  5: "Fantastic quality",
};

const QUICK_SNIPPETS = [
  "Build quality is impressive.",
  "Worth the price.",
  "Delivery experience was good.",
  "Matches the description.",
  "I recommend this product.",
];

const PROS_CONS_OPTIONS = {
  pros: [
    "Excellent quality",
    "Fast delivery",
    "Great value",
    "Well packaged",
    "Easy to use",
    "Durable",
    "Comfortable",
    "Stylish design",
    "Reliable",
    "Good performance",
  ],
  cons: [
    "Poor packaging",
    "Slow delivery",
    "Overpriced",
    "Not as described",
    "Low quality",
    "Size issues",
    "Color mismatch",
    "Uncomfortable",
    "Fragile",
  ],
};

const StarRating = ({ rating, setRating }) => {
  const handleStarSelect = (value) => setRating(value);

  return (
    <div className="flex justify-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleStarSelect(star)}
          className="w-9 h-9 flex items-center justify-center cursor-pointer"
        >
          {star <= rating ? (
            <FaStar className="text-yellow-400 w-full h-full" />
          ) : (
            <FaRegStar className="text-gray-300 w-full h-full" />
          )}
        </button>
      ))}
    </div>
  );
};

const WriteReview = ({
  isOpen,
  productId,
  existingReview,
  onClose,
  onSuccess,
  onAI,
}) => {
  const fileRef = useRef(null);

  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [pros, setPros] = useState(existingReview?.pros || []);
  const [cons, setCons] = useState(existingReview?.cons || []);
  const [photos, setPhotos] = useState(existingReview?.images || []);

  const [showProsCons, setShowProsCons] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /** Handle image uploads */
  const handleFiles = (files) => {
    const arr = Array.from(files);
    const valid = arr.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (photos.length + valid.length > 5) {
      toast.error("Max 5 images allowed");
      return;
    }

    setPhotos([...photos, ...valid]);
    toast.success(`Uploaded ${valid.length} image(s)`);
  };

  /** AI auto-writing */
  const generateAI = async () => {
    if (!rating) return toast.error("Rate the product first");

    setAiLoading(true);
    try {
      const res =
        (await onAI?.({
          rating,
          pros,
          cons,
        })) ||
        "This is a great product with solid performance.";

      setComment((prev) => `${prev ? prev + "\n\n" : ""}${res}`);
    } catch (err) {
      toast.error("AI is not available right now");
    }
    setAiLoading(false);
  };

  /** Quick title auto-fill */
  useEffect(() => {
    if (!existingReview && rating && !title.trim()) {
      setTitle(QUICK_TITLES[rating]);
    }
  }, [rating]);

  /** Submit */
  const submitReview = async () => {
    if (!rating) return toast.error("Please give a rating");
    if (!comment.trim()) return toast.error("Review comment required");

    setSubmitting(true);

    try {
      if (existingReview) {
        const response = await Axios({
          ...SummaryApi.updateReview(existingReview._id),
          data: {
            rating,
            title,
            comment,
            pros,
            cons,
          },
        });

        toast.success("Review updated");
        onSuccess?.(response.data);
      } else {
        const fd = new FormData();
        fd.append("rating", rating);
        fd.append("title", title);
        fd.append("comment", comment);
        fd.append("pros", JSON.stringify(pros));
        fd.append("cons", JSON.stringify(cons));

        photos.forEach((p) => {
          if (typeof p !== "string") fd.append("images", p);
        });

        const res = await Axios.post(`/api/review/product/${productId}`, fd);

        if(res.data.success){
            toast.dismiss()
            toast.success(res.data.message);
        }
        onSuccess?.(res.data);
      }

      onClose();
    } catch (err) {
        toast.dismiss();
        AxiosToastError(err)
    }

    setSubmitting(false);
  };

  /** Toggle pros/cons */
  const toggleItem = (type, item) => {
    if (type === "pros") {
      setPros((prev) =>
        prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
      );
    } else {
      setCons((prev) =>
        prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          key="backdrop"
          className="fixed inset-0 bg-black/50 z-[9990] cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          key="review-modal"
          className="fixed bottom-0 inset-x-0 md:inset-auto md:top-1/2 md:left-1/2 
                     md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-lg 
                     bg-white border border-gray-200 rounded-t-2xl md:rounded-2xl
                     shadow-xl z-[9991] max-h-[92vh] overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {existingReview ? "Edit Review" : "Write a Review"}
              </h1>
              <p className="text-xs text-gray-500">
                Your feedback helps others decide
              </p>
            </div>

            <button
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
              onClick={onClose}
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="px-5 py-4 space-y-5 overflow-y-auto max-h-[60vh]">
            {/* Rating */}
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Product Rating
              </p>
              <StarRating rating={rating} setRating={setRating} />
              {rating > 0 && (
                <p className="mt-2 text-xs text-gray-600">
                  {RATING_LABELS[rating]} ({rating}/5)
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Review Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg 
                           focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                placeholder="Short summary"
              />
            </div>

            {/* Comment */}
            <div>
                <label className="text-sm font-medium text-gray-700">
                    Detailed Review
                </label>
                <div className="relative">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg
                                focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                        rows={5}
                        placeholder="Share your thoughts"
                    />

                    {/* AI button */}
                    <button
                        onClick={generateAI}
                        disabled={aiLoading || !rating}
                        className="
                            absolute bottom-4 right-2
                            rounded-full p-[2px]
                            bg-[linear-gradient(90deg,#ff0000,#ff7a00,#ffd500,#00ff00,#008cff,#7f00ff)]
                            disabled:opacity-40 disabled:cursor-not-allowed
                            transition-all
                            hover:brightness-100
                        "
                        >
                        <div
                            className="
                            rounded-full 
                            bg-white
                            px-4 py-1.5
                            flex items-center gap-1.5
                            text-xs font-medium
                            cursor-pointer
                            "
                        >
                            <span className="text-gray-800">Generate</span>

                            <span
                            className="
                                
                            "
                            >
                            ✨
                            </span>
                        </div>
                    </button>

                </div>
              {/* Snippets */}
              <div className="mt-2 flex flex-wrap gap-2">
                {QUICK_SNIPPETS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setComment((prev) => prev + " " + s)}
                    className="text-xs border border-gray-300 px-2 py-1 rounded-lg
                               hover:bg-gray-100 cursor-pointer"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Pros & Cons */}
            <div>
              <button
                onClick={() => setShowProsCons((p) => !p)}
                className="text-sm font-medium text-gray-800 cursor-pointer"
              >
                <span className="flex items-center gap-3">
                    Pros & Cons (optional)
                    {
                        showProsCons ? <FaChevronUp /> : <FaChevronDown />
                    }
                </span>
              </button>

              <AnimatePresence>
                {showProsCons && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-4"
                  >
                    {/* Pros */}
                    <div>
                      <p className="text-sm text-green-700 font-medium mb-2">
                        Pros
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {PROS_CONS_OPTIONS.pros.map((item) => (
                          <button
                            key={item}
                            onClick={() => toggleItem("pros", item)}
                            className={`text-xs px-3 py-2 rounded-lg border cursor-pointer ${
                              pros.includes(item)
                                ? "bg-green-50 border-green-500 text-green-700"
                                : "border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cons */}
                    <div>
                      <p className="text-sm text-red-700 font-medium mb-2">
                        Cons
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {PROS_CONS_OPTIONS.cons.map((item) => (
                          <button
                            key={item}
                            onClick={() => toggleItem("cons", item)}
                            className={`text-xs px-3 py-2 rounded-lg border cursor-pointer ${
                              cons.includes(item)
                                ? "bg-red-50 border-red-500 text-red-700"
                                : "border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Images */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Add Images
              </label>

              <div
                onClick={() => fileRef.current?.click()}
                className="border border-gray-300 rounded-lg p-5 text-center mt-2 cursor-pointer hover:bg-gray-50"
              >
                <FaImage size={28} className="text-gray-400 mx-auto" />
                <p className="text-xs mt-2 text-gray-600">
                  Click to upload (max 5 images)
                </p>
              </div>

              <input
                type="file"
                ref={fileRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {photos.map((p, i) => {
                    const url =
                      typeof p === "string" ? p : URL.createObjectURL(p);

                    return (
                      <div key={i} className="relative group">
                        <img
                          src={url}
                          alt="review-img"
                          className="w-full h-20 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() =>
                            setPhotos(photos.filter((_, idx) => idx !== i))
                          }
                          className="absolute top-1 right-1 bg-black/60 text-white
                                     w-5 h-5 flex items-center justify-center rounded-full opacity-0
                                     group-hover:opacity-100 cursor-pointer"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-5 py-3 flex gap-3 bg-white">
            <button
              onClick={onClose}
              className="w-1/2 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={submitReview}
              disabled={submitting || !rating || !comment.trim()}
              className="w-1/2 py-2 text-sm bg-amber-600 text-white rounded-lg 
                         hover:bg-amber-700 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin text-xs" />
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheck className="text-xs" />
                  {existingReview ? "Update" : "Submit"}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
};

export default WriteReview;
