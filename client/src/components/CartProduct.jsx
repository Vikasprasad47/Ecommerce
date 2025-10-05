import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import SummaryApi from "../comman/summaryApi";
import Axios from "../utils/axios";
import { Link } from "react-router-dom";
import { validURLConvert } from "../utils/validURLConvert";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";
import { useSelector } from "react-redux";
import { useGlobalContext } from "../provider/globalProvider";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import OutOfStockOverlay from "./OutOfStockOverlay";


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

const highlightMatch = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-black rounded">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

const CartProduct = ({ data, searchText }) => {
  const url = `/product/${validURLConvert(data.name)}-${data._id}`;
  const user = useSelector((state) => state.user);
  const { fetchUserDetails } = useGlobalContext();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(user?.wishlist?.includes(data._id));
  }, [user?.wishlist, data._id]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      toast.dismiss();
      toast.error("Please login to use wishlist.");
      return;
    }

    const newStatus = !isWishlisted;
    setIsWishlisted(newStatus);

    try {
      const apiCall = newStatus
        ? SummaryApi.AddToWishList
        : SummaryApi.DeleteFromWishList;

      await Axios({
        ...apiCall,
        data: { productId: data._id },
        withCredentials: true,
      });

      toast.dismiss();
      toast.success(newStatus ? "Added to wishlist" : "Removed from wishlist");
      await fetchUserDetails();
    } catch (err) {
      setIsWishlisted(!newStatus);
      toast.dismiss();
      toast.error("Something went wrong. Try again.");
      console.error(err);
    }
  };

  return (
    <Link
      to={url}
      key={data._id}
      className="flex-shrink-0 w-[11.5rem] lg:w-[14rem] h-[18rem] flex flex-col bg-white rounded-xl border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative"
    >
      {/* Discount Badge */}
      {data.discount !== 0 && (
        <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-medium px-2 py-[2px] rounded">
          {data.discount}% OFF
        </span>
      )}

      {/* Image Section */}
      <div className="relative h-36 bg-white flex items-center justify-center p-3 rounded-t-xl border-b-2 border-slate-300">
        <img
          src={data.image[0]}
          alt={data.name}
          className={`h-full object-contain transition-transform duration-300 group-hover:scale-105 ${
            data.stock <= 0 ? "opacity-60 grayscale" : ""
          }`}
          loading="lazy"
        />

        {/* SOLD Overlay */}
        {data.stock <= 0 && (
          <OutOfStockOverlay variant="xl" showSoldOut={true} />
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute bottom-2 right-2 z-20 flex items-center justify-center w-8 h-8 hover:text-red-500 transition"
        >
          {isWishlisted ? (
            <FaHeart size={16} className="text-red-500" />
          ) : (
            <FaRegHeart size={16} />
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 px-3 py-3 bg-gray-50 rounded-b-xl">
        {/* Product Name */}
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
          {highlightMatch(data.name, searchText)}
        </h3>

        {/* Ratings */}
        <div className="flex items-center gap-[2px] text-amber-500 text-xs mt-1">
          {renderRatingStars(data.ratings?.average || 0)}
          {data.ratings?.average > 0 ? (
            <span className="ml-1 text-gray-500 text-[11px]">
              {data.ratings.average.toFixed(1)}
            </span>
          ) : (
            <span className="ml-1 text-gray-400 text-[11px]">No rating</span>
          )}
        </div>

        {/* Unit */}
        {/* <p className="text-xs text-gray-500 mt-1">{data.unit}</p> */}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price / Cart / Notify */}
        <div className="flex items-center justify-between mt-1">
          {data.stock > 0 ? (
            <>
              {/* Price */}
              <div className="flex flex-col">
                <span className="text-base font-semibold text-amber-600">
                  {DisplayPriceInRupees(
                    priceWithDiscount(data.price, data.discount)
                  )}
                </span>
                {data.discount !== 0 && (
                  <span className="text-xs text-gray-400 line-through">
                    {DisplayPriceInRupees(data.price)}
                  </span>
                )}
              </div>

              {/* Add to Cart */}
              <div className="w-[50%]">
                <AddToCartButton data={data} />
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
  );
};

export default CartProduct;
