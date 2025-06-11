import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const SimpleDropdown = ({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder = "Select option",
  icon: Icon 
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Dropdown toggle clicked:', label);
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue) => {
    console.log('Option selected:', optionValue);
    onChange(optionValue);
    setIsOpen(false);
  };

  const displayValue = value || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
          <span className="text-gray-900 dark:text-white font-medium">
            {displayValue}
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
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
          >
            <div className="p-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    value === option.value 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {value === option.value && <Check className="w-4 h-4" />}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SimpleDropdown;
