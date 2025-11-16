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

// export default NotFound;

// import React from "react";
// import { Link } from "react-router-dom";
// import { FaExclamationTriangle, FaHome, FaShoppingBag, FaInfoCircle, FaHeadset, FaArrowRight, FaSearch } from "react-icons/fa";
// import { motion } from "framer-motion";

// const NotFound = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-4 sm:px-6 lg:px-8 py-8">
//       {/* Subtle Background Elements */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200 rounded-full opacity-20 blur-xl"></div>
//         <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-200 rounded-full opacity-20 blur-xl"></div>
//         <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-200 rounded-full opacity-15 blur-lg"></div>
//       </div>

//       <div className="max-w-lg w-full space-y-12 text-center">
        
//         {/* 404 Number - Optimized Animation */}
//         <motion.div 
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className="relative"
//         >
//           <div className="flex items-center justify-center mb-6">
//             <motion.span 
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
//               className="text-7xl sm:text-8xl font-black text-gray-900"
//             >
//               4
//             </motion.span>
            
//             <motion.div
//               initial={{ scale: 0, rotate: -180 }}
//               animate={{ scale: 1, rotate: 0 }}
//               transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//               className="mx-3 sm:mx-4"
//             >
//               <FaExclamationTriangle className="text-6xl sm:text-7xl text-amber-600" />
//             </motion.div>
            
//             <motion.span 
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
//               className="text-7xl sm:text-8xl font-black text-gray-900"
//             >
//               4
//             </motion.span>
//           </div>
//         </motion.div>

//         {/* Text Content */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="space-y-4"
//         >
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             Page Not Found
//           </h1>
//           <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
//             Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
//           </p>
//         </motion.div>

//         {/* Search Suggestion */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4 }}
//           className="inline-flex items-center gap-2 bg-white rounded-lg px-4 py-3 shadow-sm border border-amber-100"
//         >
//           <FaSearch className="text-amber-500" />
//           <span className="text-sm text-gray-600">Try using search or check the URL</span>
//         </motion.div>

//         {/* Primary Actions */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="flex flex-col sm:flex-row gap-4 justify-center"
//         >
//           <Link
//             to="/"
//             className="group inline-flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg min-w-[140px]"
//           >
//             <FaHome className="text-lg" />
//             <span>Back to Home</span>
//             <FaArrowRight className="text-sm opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
//           </Link>
          
//           <Link
//             to="/contact"
//             className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition-all duration-200 hover:shadow-lg min-w-[140px]"
//           >
//             <FaHeadset className="text-lg" />
//             <span>Support</span>
//           </Link>
//         </motion.div>

//         {/* Quick Links */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="space-y-4"
//         >
//           <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
//             Quick Links
//           </p>
          
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-sm mx-auto">
//             {[
//               { to: "/", icon: FaHome, label: "Home", color: "text-amber-600", bg: "bg-amber-50" },
//               { to: "/shop", icon: FaShoppingBag, label: "Shop", color: "text-green-600", bg: "bg-green-50" },
//               { to: "/about", icon: FaInfoCircle, label: "About", color: "text-orange-600", bg: "bg-orange-50" },
//               { to: "/contact", icon: FaHeadset, label: "Help", color: "text-yellow-600", bg: "bg-yellow-50" }
//             ].map((item, index) => (
//               <motion.div
//                 key={item.to}
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 0.7 + index * 0.1 }}
//               >
//                 <Link
//                   to={item.to}
//                   className={`flex flex-col items-center gap-2 p-3 rounded-lg ${item.bg} hover:bg-white transition-all duration-200 hover:shadow-md group`}
//                 >
//                   <div className={`p-2 rounded-lg ${item.color} bg-white group-hover:scale-110 transition-transform duration-200`}>
//                     <item.icon className="text-lg" />
//                   </div>
//                   <span className="text-sm font-medium text-gray-700">
//                     {item.label}
//                   </span>
//                 </Link>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Status Indicator */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.9 }}
//           className="space-y-3"
//         >
//           <div className="flex items-center justify-center gap-3 text-sm">
//             <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
//               <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//               <span className="text-gray-600">All Systems Operational</span>
//             </div>
//           </div>
          
//           <p className="text-xs text-gray-500 max-w-xs mx-auto">
//             Need help? Our support team is here for you.
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default NotFound;