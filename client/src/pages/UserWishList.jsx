import React, { useEffect, useState } from "react";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useGlobalContext } from "../provider/globalProvider";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar, FaShoppingBag } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import AddToCartButton from "../components/AddToCartButton";

const renderRatingStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} className="w-3 h-3 text-amber-500" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="w-3 h-3 text-amber-500" />);
    } else {
      stars.push(<FaRegStar key={i} className="w-3 h-3 text-gray-300" />);
    }
  }
  return stars;
};

const SkeletonLoader = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {Array(8).fill(0).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 animate-pulse">
        <div className="bg-gray-200 h-40 rounded-lg mb-3"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 h-4 rounded"></div>
          <div className="bg-gray-200 h-3 rounded w-3/4"></div>
          <div className="bg-gray-200 h-4 rounded w-1/2"></div>
          <div className="bg-gray-200 h-8 rounded mt-2"></div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyWishlist = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
      <FaRegHeart className="text-4xl text-amber-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      Save your favorite items here to keep track of them and buy them later.
    </p>
    <Link
      to="/products"
      className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
    >
      <FaShoppingBag size={16} />
      Start Shopping
    </Link>
  </motion.div>
);

const UserWishList = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState(new Set());
  const user = useSelector((state) => state.user);
  const { fetchUserDetails } = useGlobalContext();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.GetAllWishlistProduct,
        withCredentials: true,
      });
      if (res.data.success) {
        setWishlistProducts(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    setRemovingItems(prev => new Set(prev).add(productId));
    
    try {
      await Axios({
        ...SummaryApi.DeleteFromWishList,
        data: { productId },
        withCredentials: true,
      });
      toast.success("Removed from wishlist");
      await fetchUserDetails();
      setWishlistProducts((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-amber-600">Home</Link>
            <IoIosArrowForward size={12} />
            <span className="text-gray-700 font-medium">Wishlist</span>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-amber-900 mb-2">My Wishlist</h1>
              <p className="text-amber-700">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && <SkeletonLoader />}

        {/* Empty State */}
        {!loading && wishlistProducts.length === 0 && <EmptyWishlist />}

        {/* Wishlist Items */}
        <AnimatePresence>
          {!loading && wishlistProducts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {wishlistProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group"
                >
                  <Link to={`/product/${product.name.replace(/\s+/g, "-")}-${product._id}`}>
                    {/* Image Section */}
                    <div className="relative h-40 bg-white overflow-hidden">
                      <img
                        src={product.image?.[0]}
                        alt={product.name}
                        className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 ${
                          product.stock <= 0 ? "opacity-60 grayscale" : ""
                        }`}
                        loading="lazy"
                      />
                      
                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                          {product.discount}% OFF
                        </span>
                      )}
                      
                      {/* Out of Stock Overlay */}
                      {product.stock <= 0 && (
                        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white bg-black/50 rounded-t-lg">
                        SOLD OUT
                      </span>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-3 bg-slate-300/20 border-t-1 border-gray-300 h-fit">
                    <Link to={`/product/${product.name.replace(/\s+/g, "-")}-${product._id}`}>
                      <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors mb-1 text-sm">
                        {product.name}
                      </h3>
                    </Link>
                                        
                    {/* Rating */}
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center gap-0.5">
                          {renderRatingStars(product.rating)}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.rating.toFixed(1)})
                        </span>
                      </div>
                    )}

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-amber-600">
                          {DisplayPriceInRupees(priceWithDiscount(product.price, product.discount))}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            {DisplayPriceInRupees(product.price)}
                          </span>
                        )}
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        disabled={removingItems.has(product._id)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                      >
                        {removingItems.has(product._id) ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FaHeart className="text-red-500" size={14} />
                        )}
                      </button>
                    </div>

                    {/* Add to Cart / Notify Button */}
                    <div className="mt-2">
                      {product.stock > 0 ? (
                        <AddToCartButton 
                          data={product} 
                          className="w-full"
                        />
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toast.success("We'll notify you when this item is back in stock!");
                          }}
                          className="w-full px-3 h-10 text-xs rounded-md bg-amber-500 hover:bg-amber-600 text-white font-medium transition cursor-pointer"
                        >
                          Notify Me
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserWishList;