// used only for developent debugging

// import React from 'react';
// import { motion } from 'framer-motion';
// import { AlertTriangle } from 'lucide-react';  // <-- Correct icon import

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     console.error('Caught error in ErrorBoundary:', error);
//     return { hasError: true, error };
//   }

//   handleReset = () => {
//     this.setState({ hasError: false, error: null });
//     window.location.reload();
//   };

//   render() {
//     if (this.state.hasError) {
//       return this.props.fallback || (
//         <motion.div
//           className="min-h-screen flex flex-col justify-center items-center bg-white text-center px-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Something went wrong.</h1>
//           <p className="text-gray-500 mb-6">
//             An unexpected error occurred. Please try refreshing the page.
//           </p>

//           <button
//             onClick={this.handleReset}
//             className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
//           >
//             Refresh Page
//           </button>

//           {process.env.NODE_ENV !== 'production' && this.state.error && (
//             <pre className="mt-6 bg-gray-100 p-4 rounded text-left text-xs max-w-xl overflow-x-auto text-red-600">
//               {this.state.error?.toString()}
//             </pre>
//           )}
//         </motion.div>
//       );
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;








// //production ready code
// import React from "react";
// import { AlertTriangle } from "lucide-react";

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null, devUnlocked: false, clickCount: 0 };
//   }

//   static getDerivedStateFromError(error) {
//     console.error("Caught error in ErrorBoundary:", error);
//     return { hasError: true, error };
//   }

//   handleReset = () => {
//     this.setState({ hasError: false, error: null, devUnlocked: false });
//     window.location.reload();
//   };

//   handleSecretClick = () => {
//     this.setState(
//       (prev) => ({ clickCount: prev.clickCount + 1 }),
//       () => {
//         if (this.state.clickCount >= 5) {
//           this.setState({ devUnlocked: true });
//         }
//         clearTimeout(this.resetTimer);
//         this.resetTimer = setTimeout(() => {
//           this.setState({ clickCount: 0 });
//         }, 2000);
//       }
//     );
//   };

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-amber-50 to-white px-6 py-10 text-center">
//           <div className="bg-white shadow-2xl rounded-2xl p-5 max-w-xl w-full border border-amber-100">
            
//             {/* Error Icon */}
//             <div
//               onClick={this.handleSecretClick}
//               title="Click 5 times to unlock developer info"
//               className="flex flex-col items-center mb-6 cursor-pointer select-none group"
//             >
//               <div className="flex items-center justify-center">
//                 <h3 className="text-4xl ">4</h3>
//                 <div className="bg-amber-100 p-4 rounded-full shadow-inner">
//                   <AlertTriangle className="w-9 h-9 text-amber-600" />
//                 </div>
//                 <h3 className="text-4xl ">4</h3>
//               </div>
//               <p className="text-sm text-amber-600 mt-2 font-medium tracking-wide">
//                 Oops!
//               </p>
//             </div>

//             {/* Headings */}
//             <h1 className="text-3xl font-bold text-gray-800 mb-3">
//               Something went wrong
//             </h1>
//             <p className="text-gray-600 leading-relaxed mb-8 max-w-sm mx-auto">
//               We’re sorry, but it looks like something went off track.  
//               Please try refreshing the page or go back to the homepage.
//             </p>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button
//                 onClick={this.handleReset}
//                 className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl shadow-md transition-transform hover:scale-[1.02]"
//               >
//                 Refresh Page
//               </button>
//               <button
//                 onClick={() => (window.location.href = "/")}
//                 className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl shadow-md transition-transform hover:scale-[1.02]"
//               >
//                 Go to Home
//               </button>
//             </div>

//             {/* Footer */}
//             <div className="mt-8 text-xs text-gray-500">
//               <p>We’re working on fixing this issue. Thanks for your patience ❤️</p>
//               <p className="mt-2">
//                 Need help?{" "}
//                 <a href="/contact" className="underline text-blue-500 hover:text-blue-600">
//                   Contact us
//                 </a>
//               </p>
//             </div>

//             {/* Developer Info */}
//             {this.state.devUnlocked && (
//               <details className="mt-8 bg-gray-100 p-4 rounded-xl text-left text-xs text-red-700 overflow-x-auto border border-gray-200">
//                 <summary className="cursor-pointer font-semibold mb-1">
//                   Developer Debug Info
//                 </summary>
//                 <pre className="whitespace-pre-wrap break-words">{this.state.error?.toString()}</pre>
//               </details>
//             )}
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;


import React from "react";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, devUnlocked: false, clickCount: 0 };
  }

  static getDerivedStateFromError(error) {
    console.error("Caught in ErrorBoundary:", error);
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, devUnlocked: false });
    window.location.reload();
  };

  handleSecretClick = () => {
    this.setState(
      (prev) => ({ clickCount: prev.clickCount + 1 }),
      () => {
        if (this.state.clickCount >= 5) this.setState({ devUnlocked: true });

        clearTimeout(this.resetTimer);
        this.resetTimer = setTimeout(() => this.setState({ clickCount: 0 }), 2000);
      }
    );
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50/60 px-6 py-10 text-center">

        {/* Glass Container */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            backdrop-blur-xl bg-white/70 
            border border-neutral-200/50 shadow-[0_8px_35px_rgba(0,0,0,0.08)]
            rounded-3xl p-10 max-w-lg w-full relative"
        >

          {/* Glow behind card */}
          <div className="absolute inset-0 -z-10 blur-2xl bg-amber-200/20 rounded-3xl"></div>

          {/* Broken Icon */}
          <motion.div
            onClick={this.handleSecretClick}
            whileTap={{ scale: 0.92 }}
            className="mb-6 cursor-pointer select-none"
            title="Click 5 times to unlock developer info"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-bold text-neutral-700">4</span>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="p-4 rounded-2xl shadow-inner bg-amber-100"
              >
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </motion.div>
              <span className="text-4xl font-bold text-neutral-700">4</span>
            </div>
            <p className="text-xs text-amber-600 mt-2 font-medium">Oops, something broke</p>
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2 tracking-tight">
            Something went wrong
          </h1>

          {/* Description */}
          <p className="text-neutral-600 text-[15px] mb-8 leading-relaxed">
            The page encountered an unexpected error.  
            You may try refreshing or return to the homepage.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={this.handleReset}
              className="
                px-6 py-3 rounded-xl text-white font-medium
                bg-amber-500 hover:bg-amber-600 
                shadow-md shadow-amber-200/40 transition"
            >
              Refresh Page
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => (window.location.href = "/")}
              className="
                px-6 py-3 rounded-xl font-medium
                bg-white border border-neutral-300 
                shadow-md hover:bg-neutral-50
              "
            >
              Go Home
            </motion.button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-[11px] text-neutral-500 leading-relaxed">
            We’re already working to fix this.  
            <div className="mt-2">
              Need help?{" "}
              <a href="/contact" className="underline text-amber-600 font-medium">
                Contact Support
              </a>
            </div>
          </div>

          {/* Developer Info */}
          {this.state.devUnlocked && (
            <details className="mt-8 bg-neutral-100 p-4 rounded-xl text-left text-xs text-red-700 border border-neutral-300/60 overflow-x-auto">
              <summary className="cursor-pointer font-semibold mb-1">Developer Debug Info</summary>
              <pre className="whitespace-pre-wrap break-words">{this.state.error?.toString()}</pre>
            </details>
          )}
        </motion.div>
      </div>
    );
  }
}

export default ErrorBoundary;
