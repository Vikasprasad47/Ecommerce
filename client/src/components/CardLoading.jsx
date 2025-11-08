import React from "react";

const CardLoading = () => {
  return (
    <div className="flex-shrink-0 w-[11.5rem] lg:w-[13rem] h-[18rem] flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      
      {/* Image Section */}
      <div className="relative h-36 bg-gray-100 flex items-center justify-center p-3 border-b-2 border-slate-300">
        <div className="w-full h-full bg-gray-200 rounded-lg" />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 px-3 py-3 bg-gray-50 rounded-b-xl space-y-3">
        {/* Product Name */}
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />


        {/* Spacer */}
        <div className="flex-1" />

        {/* Price and Button */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-col space-y-2">
            <div className="h-5 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-12 bg-gray-200 rounded" />
          </div>
          <div className="w-[50%] h-8 bg-gray-300 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default CardLoading;
