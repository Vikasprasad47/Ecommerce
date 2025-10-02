import React, { memo, useEffect, useState } from "react";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";

// ✅ Skeleton Loader (shimmer effect)
const SkeletonItem = () => (
  <div className="flex flex-col items-center w-24 animate-pulse">
    <div className="h-20 w-20 rounded-md bg-gray-200" />
    <div className="h-3 w-16 mt-2 bg-gray-200 rounded" />
  </div>
);

// ✅ Memoized SubCategory Card
const SubCategoryItem = memo(({ sub }) => (
  <div
    className="flex flex-col items-center w-24 hover:scale-105 transition-transform cursor-pointer hover:text-blue-600 snap-start"
    title={sub.name}
  >
    <div className="h-20 w-20 rounded-md overflow-hidden bg-white shadow-sm flex items-center justify-center">
      <img
        src={sub.image}
        alt={sub.name}
        className="h-full w-full object-contain transition-transform duration-300 hover:scale-110"
        loading="lazy"
      />
    </div>
    <h1 className="text-[13px] font-medium text-center mt-2 truncate max-w-[90px]">
      {sub.name}
    </h1>
  </div>
));

const HeaderSubCategory = () => {
  const [subCategories, setSubCategories] = useState(() => {
    // ✅ Load cache from localStorage if available
    const cached = localStorage.getItem("subCategories");
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(subCategories.length === 0);

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const res = await Axios({
        url: SummaryApi.getSubCategory.url,
        method: SummaryApi.getSubCategory.method,
        withCredentials: true,
      });

      if (res.data.success) {
        setSubCategories(res.data.data);
        // ✅ Save to cache
        localStorage.setItem("subCategories", JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.error("Failed to fetch subcategories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subCategories.length === 0) {
      fetchSubCategories();
    }
  }, []);

  return (
    <div className="relative mt-3 px-2 rounded-md bg-white shadow-sm">

      {/* Horizontal Scroll */}
      <div className="flex items-center gap-6 overflow-x-auto px-2 py-4 scrollbar-hide snap-x snap-mandatory">
        {loading
          ? [...Array(8)].map((_, i) => <SkeletonItem key={i} />)
          : subCategories.map((sub) => (
              <SubCategoryItem key={sub._id} sub={sub} />
            ))}
      </div>
    </div>
  );
};

export default HeaderSubCategory;
