import React, { memo, useEffect, useState, useCallback } from "react";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";

// ✅ Skeleton Loader (shimmer effect)
const SkeletonItem = () => (
  <div className="flex flex-col items-center min-w-[90px] animate-pulse">
    <div className="h-20 w-20 rounded-md bg-gray-200" />
    <div className="h-3 w-16 mt-2 bg-gray-200 rounded" />
  </div>
);

// ✅ Memoized SubCategory Card
const SubCategoryItem = memo(({ id, name, image }) => (
  <div
    className="flex flex-col items-center min-w-[90px] hover:scale-105 transition-transform cursor-pointer hover:text-blue-600 snap-start"
    title={name}
  >
    <div className="h-20 w-20 rounded-md overflow-hidden bg-white shadow-sm flex items-center justify-center">
      <img
        src={image || "/placeholder.png"}
        alt={name}
        className="h-full w-full object-contain transition-transform duration-300 hover:scale-110"
        loading="lazy"
        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
      />
    </div>
    <h1 className="text-[13px] font-medium text-center mt-2 truncate max-w-[90px]">
      {name}
    </h1>
  </div>
));

const CACHE_KEY = "subCategories";
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

const HeaderSubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load cache with expiry
  const loadCache = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setSubCategories(data);
          setLoading(false);
          return true;
        }
      }
    } catch (err) {
      console.error("Failed to load cache", err);
    }
    return false;
  };

  const fetchSubCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Axios({
        url: SummaryApi.getSubCategory.url,
        method: SummaryApi.getSubCategory.method,
        withCredentials: true,
      });

      if (res.data.success) {
        setSubCategories(res.data.data);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: res.data.data, timestamp: Date.now() })
        );
      }
    } catch (err) {
      console.error("Failed to fetch subcategories", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loadCache()) {
      fetchSubCategories();
    }
  }, [fetchSubCategories]);

  return (
    <div className="relative mt-3 px-2 rounded-md bg-white shadow-sm">
      {/* Horizontal Scroll */}
      <div className="flex items-center gap-6 overflow-x-auto px-2 py-4 scrollbar-hide snap-x snap-mandatory">
        {loading
          ? [...Array(16)].map((_, i) => <SkeletonItem key={i} />)
          : subCategories.map((sub) => (
              <SubCategoryItem
                key={sub._id}
                id={sub._id}
                name={sub.name}
                image={sub.image}
              />
            ))}
      </div>
    </div>
  );
};

export default HeaderSubCategory;
