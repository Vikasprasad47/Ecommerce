import React, { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

const messages = [
  "Fetching your products...",
  "Almost there...",
  "Preparing your cart...",
  "Loading the best deals for you..."
];

const PageLoader = () => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = messages.indexOf(prev);
        return messages[(currentIndex + 1) % messages.length];
      });
    }, 2500); // rotate messages every 2.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4">
      
      {/* Spinner with cart icon */}
      <div className="relative mb-6">
        <div className="animate-spin-slow rounded-full h-16 w-16 border-4 border-amber-100 border-t-amber-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FiShoppingCart className="text-amber-600 h-7 w-7 md:h-8 md:w-8" />
        </div>
      </div>

      {/* Loading text */}
      <h3 className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
        Loading <span className="text-amber-600">Store</span>
      </h3>

      {/* Waiting message */}
      <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-3 text-center animate-fade">
        {currentMessage}
      </p>

      {/* Bouncing dots */}
      <div className="flex justify-center space-x-1 mt-2">
        <div className="h-2 w-2 md:h-2.5 md:w-2.5 bg-amber-400 rounded-full animate-bounce"></div>
        <div className="h-2 w-2 md:h-2.5 md:w-2.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="h-2 w-2 md:h-2.5 md:w-2.5 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>

      {/* Custom animations */}
      <style>
        {`
          @keyframes spin-slow { 
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow { 
            animation: spin-slow 1.8s linear infinite;
          }

          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          .animate-bounce { 
            animation: bounce 1.4s infinite ease-in-out;
          }

          @keyframes fade {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          .animate-fade {
            animation: fade 2.5s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default PageLoader;
