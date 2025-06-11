import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, DollarSign } from 'lucide-react';

const PriceDropdown = ({ minPrice, maxPrice, onPriceChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice || '');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update local state when props change
  useEffect(() => {
    setLocalMinPrice(minPrice || '');
    setLocalMaxPrice(maxPrice || '');
  }, [minPrice, maxPrice]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Price dropdown toggle clicked');
    setIsOpen(!isOpen);
  };

  const handleApply = () => {
    console.log('Applying price filter:', { min: localMinPrice, max: localMaxPrice });
    onPriceChange(localMinPrice, localMaxPrice);
    setIsOpen(false);
  };

  const handleClear = () => {
    console.log('Clearing price filter');
    setLocalMinPrice('');
    setLocalMaxPrice('');
    onPriceChange('', '');
    setIsOpen(false);
  };

  const displayText = (minPrice || maxPrice) 
    ? `₹${minPrice || '0'} - ₹${maxPrice || '∞'}` 
    : 'Price';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-900 dark:text-white font-medium">
            {displayText}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 p-4"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  placeholder="999999"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={handleClear}
                  className="flex-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PriceDropdown;
