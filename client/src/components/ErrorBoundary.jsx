import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';  // <-- Correct icon import

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    console.error('Caught error in ErrorBoundary:', error);
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <motion.div
          className="min-h-screen flex flex-col justify-center items-center bg-white text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Something went wrong.</h1>
          <p className="text-gray-500 mb-6">
            An unexpected error occurred. Please try refreshing the page.
          </p>

          <button
            onClick={this.handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Refresh Page
          </button>

          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <pre className="mt-6 bg-gray-100 p-4 rounded text-left text-xs max-w-xl overflow-x-auto text-red-600">
              {this.state.error?.toString()}
            </pre>
          )}
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
