// OutOfStockOverlay.jsx
import React from "react";

const OutOfStockOverlay = ({ 
  variant = "default", 
  className = "",
  showSoldOut = true 
}) => {
  const variants = {
    default: {
      overlay: "absolute inset-0 bg-black/60 flex items-center justify-center rounded-t-md",
      text: "bg-gray-800 text-white text-sm font-bold px-3 py-1 rounded"
    },
    lg: {
        overlay: "absolute inset-0 bg-black/60 flex items-center justify-center rounded-t-lg",
        text: "bg-gray-800 text-white text-sm font-bold px-3 py-1 rounded"
    },
    xl: {
      overlay: "absolute inset-0 bg-black/60 flex items-center justify-center rounded-t-xl",
      text: "bg-gray-800 text-white text-sm font-bold px-3 py-2 rounded"
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={`${currentVariant.overlay} ${className}`}>
      {showSoldOut && (
        <span className={currentVariant.text}>
          {variant === "xl" ? "OUT OF STOCK" : "OUT OF STOCK"}
        </span>
      )}
    </div>
  );
};

export default OutOfStockOverlay;