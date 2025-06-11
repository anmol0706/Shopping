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
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center justify-center mb-2">
              <WifiOff className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Server Starting Up
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              The server is starting up. This can take 30-60 seconds on first load. Please wait...
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400 mb-3">
              ⏱️ This is normal for cloud-hosted applications
            </div>
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Check Again
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
