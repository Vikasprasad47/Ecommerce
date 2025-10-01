import React from "react";

const HeaderSkeleton = () => {
  return (
    <header className="w-full sticky top-0 z-50 shadow-lg bg-white">
      <div className="bg-gradient-to-b from-amber-300 via-amber-200 to-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo skeleton */}
          <div className="w-[120px] h-8 bg-gray-300 rounded animate-pulse"></div>

          {/* Search bar skeleton */}
          <div className="hidden md:flex flex-1 justify-center mx-6 max-w-2xl">
            <div className="w-full h-10 bg-gray-300 rounded animate-pulse"></div>
          </div>

          {/* Right section skeleton (user + cart) */}
          <div className="flex items-center gap-5">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="hidden lg:flex w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="md:hidden w-full px-3 py-2 flex items-center justify-between gap-2 border-t border-gray-200 shadow-md">
        <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
        <div className="flex-1">
          <div className="w-full h-10 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSkeleton;
