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








//production ready code
import React from "react";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, devUnlocked: false, clickCount: 0 };
  }

  static getDerivedStateFromError(error) {
    console.error("Caught error in ErrorBoundary:", error);
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
        if (this.state.clickCount >= 5) {
          this.setState({ devUnlocked: true });
        }

        // reset click counter after 2 seconds if not reached
        clearTimeout(this.resetTimer);
        this.resetTimer = setTimeout(() => {
          this.setState({ clickCount: 0 });
        }, 2000);
      }
    );
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-amber-50 to-white px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="bg-white shadow-xl rounded-3xl p-10 max-w-lg w-full border border-amber-100 relative"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            <div
              className="flex justify-center mb-6 cursor-pointer select-none"
              onClick={this.handleSecretClick}
              title="Click 5 times to unlock developer info"
            >
              <div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-amber-100 p-5 rounded-full shadow-inner"
              >
                <AlertTriangle className="w-12 h-12 text-amber-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-600 leading-relaxed mb-8">
              We’re sorry, but it looks like something went off track.
              Please try refreshing the page or return to the homepage.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                whileTap={{ scale: 0.95 }}
                onClick={this.handleReset}
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
              >
                Refresh Page
              </button>

              <button
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/")}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
              >
                Go to Home
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-8 flex flex-col gap-2">
              <span>We’re working on fixing this issue. Thanks for your patience 💛</span>
              OR
              <a href="/contact" className="cusror-pointer underline text-blue-500">Contact us</a>
            </p>

            {this.state.devUnlocked && (
              <details
                className="mt-8 bg-gray-100 p-4 rounded-xl text-left text-xs text-red-700 overflow-x-auto border border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <summary className="cursor-pointer font-semibold mb-0">
                  Developer Debug Info
                </summary>
                <pre>{this.state.error?.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
