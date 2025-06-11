import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry = null,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;
