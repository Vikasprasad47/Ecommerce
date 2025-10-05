import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import Axios from "../utils/axios";
import SummaryApi, { baseUrl } from "../comman/summaryApi";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import { validURLConvert } from "../utils/validURLConvert";
import OutOfStockOverlay from "./OutOfStockOverlay";

// Cache configuration
const CACHE_KEYS = {
  LATEST_PRODUCTS: 'latest_products_cache',
  CACHE_TIMESTAMP: 'latest_products_timestamp'
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache utilities
const cacheManager = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  },

  set: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  },

  isCacheValid: (timestampKey) => {
    const timestamp = cacheManager.get(timestampKey);
    if (!timestamp) return false;
    return Date.now() - timestamp < CACHE_DURATION;
  }
};

// Render rating stars
const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return [
    ...Array(full).fill().map((_, i) => <FaStar key={`f-${i}`} className="text-amber-500 w-3 h-3" />),
    ...(half ? [<FaStarHalfAlt key="h" className="text-amber-500 w-3 h-3" />] : []),
    ...Array(empty).fill().map((_, i) => <FaRegStar key={`e-${i}`} className="text-gray-300 w-3 h-3" />),
  ];
};

// Skeleton Loader
const ProductCardSkeleton = () => (
  <div className="flex-shrink-0 w-44 sm:w-48 bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-32 bg-gray-200"></div>
    <div className="p-2 space-y-2">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

// Optimized Product Card
const ProductCard = memo(({ item }) => {
  const url = `/product/${validURLConvert(item.name)}-${item._id}`;
  const discountedPrice = priceWithDiscount(item.price, item.discount);

  return (
    <div className="flex-shrink-0 w-44 sm:w-48 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer group relative">
      <Link to={url} className="block">
        {/* Image Container */}
        <div className="relative h-32 bg-white flex items-center justify-center p-2">
          {item.discount > 0 && (
            <span className="absolute top-1 left-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded">
              {item.discount}% off
            </span>
          )}
          <img
            src={item.image[0]}
            alt={item.name}
            className="h-full object-contain transition-transform duration-200"
            loading="lazy"
          />
          
          {/* Out of Stock Overlay */}
          {item.stock <= 0 && (
            <OutOfStockOverlay variant="default" showSoldOut={true}/>
          )}
        </div>

        {/* Product Info */}
        <div className="p-2 space-y-1 bg-slate-300/20">
          <h3 className="text-xs text-gray-800 line-clamp-2 leading-tight min-h-[2rem]">
            {item.name}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1">
            <div className="flex">{renderStars(item.ratings?.average || 0)}</div>
            <span className="text-xs text-gray-500">({item.ratings?.count || 0})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-gray-900">
              {DisplayPriceInRupees(discountedPrice)}
            </span>
            {item.discount > 0 && (
              <span className="text-xs text-gray-500 line-through">
                {DisplayPriceInRupees(item.price)}
              </span>
            )}
          </div>

          {/* Delivery */}
          <div className="text-xs text-green-600 font-medium">
            {item.stock > 0 ? "Free delivery" : "Temporarily unavailable"}
          </div>
        </div>
      </Link>
    </div>
  );
});

const TopDisplayHeaderProduct = () => {
  const scrollRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);

  // Fetch latest products with caching
  const fetchLatestProducts = async () => {
    // Return cached data if valid
    if (cacheManager.isCacheValid(CACHE_KEYS.CACHE_TIMESTAMP)) {
      const cachedData = cacheManager.get(CACHE_KEYS.LATEST_PRODUCTS);
      if (cachedData) {
        setProducts(cachedData);
        setIsLoading(false);
        return;
      }
    }

    try {
      setIsLoading(true);
      const res = await Axios({
        method: SummaryApi.latestProducts.method,
        url: baseUrl + SummaryApi.latestProducts.url,
        params: { limit: 20 },
      });
      
      const productsData = res.data.data || [];
      setProducts(productsData);
      
      // Update cache
      cacheManager.set(CACHE_KEYS.LATEST_PRODUCTS, productsData);
      cacheManager.set(CACHE_KEYS.CACHE_TIMESTAMP, Date.now());
      
    } catch (err) {
      console.error("Failed to fetch latest products:", err);
      
      // Fallback to cache even if expired when API fails
      const cachedData = cacheManager.get(CACHE_KEYS.LATEST_PRODUCTS);
      if (cachedData) {
        setProducts(cachedData);
      } else {
        setProducts([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    setIsScrolled(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    
    // Calculate current scroll position for indicator
    const scrollPosition = scrollLeft / (scrollWidth - clientWidth);
    const indicatorIndex = Math.round(scrollPosition * 2); // 3 positions for 2 rows
    setCurrentScrollIndex(Math.min(Math.max(indicatorIndex, 0), 2));
  }, []);

  const scroll = useCallback((dir) => {
    if (!scrollRef.current) return;
    
    const scrollAmount = dir === "left" ? -400 : 400;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const ref = scrollRef.current;
    checkScroll();
    ref?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    
    return () => {
      ref?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  // Split products into two rows
  const firstRowProducts = products.slice(0, 10);
  const secondRowProducts = products.slice(10, 20);

  return (
    <section className="w-full mt-3 rounded-md bg-white py-6 px-4 sm:px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Latest Products</h2>
            <p className="text-sm text-gray-500 mt-1">Recently added to our collection</p>
          </div>
          {products.length > 0 && (
            <Link 
              to="/products" 
              className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
            >
              View all <FiChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Products Carousel with 2 Rows */}
        <div className="relative">
          {/* Navigation Arrows */}
          {!isLoading && products.length > 0 && (
            <>
              {isScrolled && (
                <button 
                  onClick={() => scroll("left")} 
                  className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all"
                >
                  <FiChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
              )}
              {canScrollRight && (
                <button 
                  onClick={() => scroll("right")} 
                  className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all"
                >
                  <FiChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </>
          )}

          {/* Main Scroll Container */}
          <div 
            ref={scrollRef} 
            className="flex flex-col gap-4 overflow-x-auto scroll-smooth no-scrollbar"
          >
            {/* First Row */}
            <div className="flex gap-3 min-w-max">
              {isLoading ? (
                [...Array(8)].map((_, index) => (
                  <ProductCardSkeleton key={`skeleton-1-${index}`} />
                ))
              ) : (
                firstRowProducts.map(item => (
                  <ProductCard key={`first-${item._id}`} item={item} />
                ))
              )}
            </div>

            {/* Second Row */}
            <div className="flex gap-3 min-w-max">
              {isLoading ? (
                [...Array(8)].map((_, index) => (
                  <ProductCardSkeleton key={`skeleton-2-${index}`} />
                ))
              ) : (
                secondRowProducts.map(item => (
                  <ProductCard key={`second-${item._id}`} item={item} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Functional Scroll Indicator */}
        {!isLoading && products.length > 0 && (
          <div className="flex justify-center mt-4">
            <div className="flex gap-1">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentScrollIndex 
                      ? "bg-amber-500 w-6" 
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopDisplayHeaderProduct;