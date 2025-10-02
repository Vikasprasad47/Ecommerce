// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaLock, FaTruck, FaHeadset } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-10">
          {/* 404 Icon */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-7xl font-extrabold text-gray-900">4</span>
            <FaExclamationTriangle className="text-6xl text-red-500 mx-2 animate-pulse" />
            <span className="text-7xl font-extrabold text-gray-900">4</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link
              to="/"
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
              Go to Homepage
            </Link>
            <Link
              to="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
              Contact Support
            </Link>
          </div>

          {/* Suggestion Links */}
          <div className="text-gray-500 text-sm mb-6">
            Here are some helpful links instead:
            <ul className="mt-2 flex items-center justify-center gap-2 underline">
              <li>
                <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-blue-600 hover:text-blue-700 font-medium">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-600 hover:text-blue-700 font-medium">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex justify-center space-x-10 text-gray-500">
          <div className="flex flex-col items-center">
            <FaLock className="text-2xl mb-1" />
            <span className="text-xs">Secure</span>
          </div>
          <div className="flex flex-col items-center">
            <FaTruck className="text-2xl mb-1" />
            <span className="text-xs">Fast Delivery</span>
          </div>
          <div className="flex flex-col items-center">
            <FaHeadset className="text-2xl mb-1" />
            <span className="text-xs">24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
