// // src/pages/NotFound.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import { FaExclamationTriangle, FaLock, FaTruck, FaHeadset } from "react-icons/fa";

// const NotFound = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-16">
//       <div className="max-w-lg w-full text-center">
//         {/* Main Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-10">
//           {/* 404 Icon */}
//           <div className="flex items-center justify-center mb-4">
//             <span className="text-7xl font-extrabold text-gray-900">4</span>
//             <FaExclamationTriangle className="text-6xl text-red-500 mx-2 animate-pulse" />
//             <span className="text-7xl font-extrabold text-gray-900">4</span>
//           </div>

//           {/* Heading */}
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">
//             Oops! Page Not Found
//           </h1>
//           <p className="text-gray-600 mb-6">
//             The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
//           </p>

//           {/* CTA Buttons */}
//           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
//             <Link
//               to="/"
//               className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
//             >
//               Go to Homepage
//             </Link>
//             <Link
//               to="/contact"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
//             >
//               Contact Support
//             </Link>
//           </div>

//           {/* Suggestion Links */}
//           <div className="text-gray-500 text-sm mb-6">
//             Here are some helpful links instead:
//             <ul className="mt-2 flex items-center justify-center gap-2 underline">
//               <li>
//                 <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/shop" className="text-blue-600 hover:text-blue-700 font-medium">
//                   Shop
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/about" className="text-blue-600 hover:text-blue-700 font-medium">
//                   About Us
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Trust Indicators */}
//         <div className="mt-12 flex justify-center space-x-10 text-gray-500">
//           <div className="flex flex-col items-center">
//             <FaLock className="text-2xl mb-1" />
//             <span className="text-xs">Secure</span>
//           </div>
//           <div className="flex flex-col items-center">
//             <FaTruck className="text-2xl mb-1" />
//             <span className="text-xs">Fast Delivery</span>
//           </div>
//           <div className="flex flex-col items-center">
//             <FaHeadset className="text-2xl mb-1" />
//             <span className="text-xs">24/7 Support</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotFound;
import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaShoppingBag, FaInfoCircle, FaHeadset } from "react-icons/fa";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-md w-full space-y-12">
        
        {/* Main Content */}
        <div className="space-y-8 text-center">
          
          {/* 404 Number */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="relative"
          >
            <div className="flex items-center justify-center">
              <span className="text-7xl sm:text-8xl font-black text-gray-900">4</span>
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, -3, 3, 0],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
                className="mx-2 sm:mx-3"
              >
                <FaExclamationTriangle className="text-6xl sm:text-7xl text-blue-600" />
              </motion.div>
              <span className="text-7xl sm:text-8xl font-black text-gray-900">4</span>
            </div>
            
            {/* Subtle background circle */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
              <div className="w-48 h-48 bg-blue-50 rounded-full opacity-60 blur-xl"></div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mx-auto">
              Sorry, we couldn't find the page you're looking for. The page might have been moved or doesn't exist.
            </p>
          </motion.div>

          {/* Primary Actions */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105 min-w-[140px]"
            >
              <FaHome className="text-lg" />
              Home
            </Link>
            
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition-all duration-200 hover:shadow-lg transform hover:scale-105 min-w-[140px]"
            >
              <FaHeadset className="text-lg" />
              Support
            </Link>
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
              Popular Pages
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { to: "/", icon: FaHome, label: "Home", color: "text-blue-600" },
                { to: "/shop", icon: FaShoppingBag, label: "Shop", color: "text-green-600" },
                { to: "/about", icon: FaInfoCircle, label: "About", color: "text-purple-600" },
                { to: "/contact", icon: FaHeadset, label: "Contact", color: "text-orange-600" }
              ].map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-slate-200 rounded-xl"
                >
                  <Link
                    to={item.to}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white transition-all duration-200 hover:shadow-md group"
                  >
                    <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors ${item.color}`}>
                      <item.icon className="text-xl" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>System Operational</span>
            </div>
          </div>
          
          {/* Help Text */}
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            If you believe this is an error, please contact our support team.
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute inset-0 pointer-events-none overflow-hidden -z-10"
        >
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(#000000 1px, transparent 1px),
                               linear-gradient(90deg, #000000 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* Corner accents */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;