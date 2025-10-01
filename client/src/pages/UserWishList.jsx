import React, { useEffect, useState } from "react";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useGlobalContext } from "../provider/globalProvider";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import AddToCartButton from "../components/AddToCartButton";

const renderRatingStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} className="w-3 h-3" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="w-3 h-3" />);
    } else {
      stars.push(<FaRegStar key={i} className="w-3 h-3" />);
    }
  }
  return stars;
};

const UserWishList = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const { fetchUserDetails } = useGlobalContext();

  const fetchWishlist = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.GetAllWishlistProduct,
        withCredentials: true,
      });
      if (res.data.success) {
        setWishlistProducts(res.data.data);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await Axios({
        ...SummaryApi.DeleteFromWishList,
        data: { productId },
        withCredentials: true,
      });
      toast.dismiss();
      toast.success("Removed from wishlist");
      await fetchUserDetails();
      setWishlistProducts((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to remove from wishlist");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="px-3 py-3 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-5 text-center rounded-xl p-6 bg-white shadow-sm border border-amber-200">
        <h1 className="text-2xl font-bold text-amber-900">My Wishlist</h1>
        <p className="mt-1 text-sm text-amber-700">
          Your favorite picks are saved here. Keep an eye on them!
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} height={220} />
          ))}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-0 lg:gap-4 border-t border-l md:border-none">
          {wishlistProducts.map((product, index) => (
            <Link
              key={product._id}
              to={`/product/${product.name.replace(/\s+/g, "-")}-${product._id}`}
              className={`group relative flex flex-col bg-white hover:shadow-sm transition 
                border-b md:border-none 
                ${index % 2 === 0 ? "md:border-r md:border-gray-200" : ""}`}
            >
              {/* Discount Badge */}
              {product.discount > 0 && (
                <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] px-2 py-[2px] rounded">
                  {product.discount}% OFF
                </span>
              )}

              {/* Image */}
              <div className="relative w-full h-40 flex items-center justify-center p-2 border-b md:border-0">
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  className={`h-full object-contain transition-transform duration-300 group-hover:scale-105 ${
                    product.stock <= 0 ? "opacity-60 grayscale" : ""
                  }`}
                  loading="lazy"
                />
                {product.stock <= 0 && (
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white bg-black/50">
                    SOLD OUT
                  </span>
                )}

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(product._id);
                  }}
                  className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-white shadow hover:text-red-500"
                >
                  <FaHeart size={14} className="text-red-500" />
                </button>
              </div>

              {/* Info */}
              <div className="flex flex-col p-2 space-y-1">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-amber-600 transition">
                  {product.name}
                </h3>

                <p className="text-xs text-gray-500">{product.unit}</p>

                {/* Price / Cart / Notify */}
                <div className="flex items-center justify-between mt-2">
                  {product.stock > 0 ? (
                    <>
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-amber-600">
                          {DisplayPriceInRupees(priceWithDiscount(product.price, product.discount))}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            {DisplayPriceInRupees(product.price)}
                          </span>
                        )}
                      </div>
                      <div className="w-[50%]">
                        <AddToCartButton data={product} />
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toast.dismiss();
                        toast.success("We’ll alert you when it’s back");
                      }}
                      className="w-full px-3 py-2 text-xs rounded-md bg-amber-500 hover:bg-amber-600 text-white font-medium transition cursor-pointer"
                    >
                      Notify Me
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserWishList;
