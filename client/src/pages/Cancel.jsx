import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TbAlertTriangleFilled } from "react-icons/tb";

const Cancel = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div
        className={`flex flex-col items-center text-center transition-all duration-700 ease-out
          ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        {/* Icon */}
        <div className="mb-6 text-red-500 animate-pulse">
          <TbAlertTriangleFilled size={60} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Payment Cancelled
        </h1>

        {/* Message */}
        <p className="text-base text-gray-600 max-w-md mb-6 leading-relaxed">
          Payment failed and your order was cancelled. Please revisit your cart to complete the purchase or reach out to support for help.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition hover:bg-gray-800"
          >
            Go to Home
          </Link>

        </div>

        {/* Optional Contact */}
        <div className="text-xs text-gray-500 mt-6">
          Need help? <span className="text-blue-600 underline cursor-pointer">Contact Support</span>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
