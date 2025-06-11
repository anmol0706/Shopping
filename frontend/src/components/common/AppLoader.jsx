import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

const AppLoader = ({ isLoading, onRetry }) => {
  const [showConnectionIssue, setShowConnectionIssue] = useState(false);
  const [dots, setDots] = useState('');

  // Show connection issue message after 5 seconds
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowConnectionIssue(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowConnectionIssue(false);
    }
  }, [isLoading]);

  // Animate dots for loading text
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            ShopEase
          </h1>
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          className="w-12 h-12 border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-4"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Loading ShopEase{dots}
          </p>
        </motion.div>

        {/* Connection Issue Message */}
        {showConnectionIssue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center justify-center mb-2">
              <WifiOff className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Connection Issue
              </span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              Taking longer than expected to connect. This might be due to server startup time.
            </p>
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </button>
          </motion.div>
        )}

        {/* Status Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          {!showConnectionIssue ? (
            <div className="flex items-center justify-center">
              <Wifi className="h-4 w-4 mr-2" />
              Connecting to server...
            </div>
          ) : (
            <p>Please wait or try refreshing the page</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AppLoader;
