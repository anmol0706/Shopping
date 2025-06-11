import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Hook for detecting mobile devices and screen sizes
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width <= 768);
      
      if (width <= 480) {
        setScreenSize('mobile');
      } else if (width <= 768) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
      
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  return { isMobile, screenSize, orientation };
};

// Mobile-optimized container component
export const MobileContainer = ({ children, className = '', padding = true }) => {
  const { isMobile } = useMobileDetection();
  
  const containerClass = `
    ${className}
    ${isMobile ? 'mobile-content-padding' : ''}
    ${padding ? 'px-3 sm:px-4 md:px-6 lg:px-8' : ''}
  `.trim();

  return (
    <div className={containerClass}>
      {children}
    </div>
  );
};

// Mobile-optimized button component
export const MobileButton = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'medium',
  ...props 
}) => {
  const { isMobile } = useMobileDetection();
  
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 mobile-touch-friendly nav-touch-target mobile-focus-visible';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  };
  
  const sizeClasses = {
    small: isMobile ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-2 text-sm',
    medium: isMobile ? 'px-4 py-2.5 text-base min-h-[48px]' : 'px-4 py-2 text-sm',
    large: isMobile ? 'px-6 py-3 text-lg min-h-[52px]' : 'px-6 py-3 text-base'
  };

  const buttonClass = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={buttonClass}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Mobile-optimized input component
export const MobileInput = ({ 
  className = '', 
  type = 'text',
  ...props 
}) => {
  const { isMobile } = useMobileDetection();
  
  const inputClass = `
    w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors mobile-focus-visible
    ${isMobile ? 'mobile-form-input text-base' : 'px-3 py-2 text-sm'}
    ${className}
  `.trim();

  return (
    <input
      type={type}
      className={inputClass}
      {...props}
    />
  );
};

// Mobile-optimized card component
export const MobileCard = ({ 
  children, 
  className = '', 
  padding = true,
  hover = true,
  ...props 
}) => {
  const { isMobile } = useMobileDetection();
  
  const cardClass = `
    bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-200
    ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''}
    ${padding ? (isMobile ? 'p-4' : 'p-6') : ''}
    ${className}
  `.trim();

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      className={cardClass}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Mobile-optimized grid component
export const MobileGrid = ({ 
  children, 
  className = '', 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  ...props 
}) => {
  const gridClass = `
    grid gap-${gap}
    grid-cols-${cols.mobile}
    sm:grid-cols-${cols.tablet}
    lg:grid-cols-${cols.desktop}
    ${className}
  `.trim();

  return (
    <div className={gridClass} {...props}>
      {children}
    </div>
  );
};

// Mobile-optimized horizontal scroll container
export const MobileScrollContainer = ({ 
  children, 
  className = '', 
  showScrollbar = false,
  ...props 
}) => {
  const scrollClass = `
    flex overflow-x-auto gap-4 pb-4
    ${showScrollbar ? '' : 'mobile-scroll-container'}
    ${className}
  `.trim();

  return (
    <div className={scrollClass} {...props}>
      {children}
    </div>
  );
};

// Mobile-optimized modal component
export const MobileModal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  className = '' 
}) => {
  const { isMobile } = useMobileDetection();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`
          bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto
          ${isMobile ? 'mobile-modal mobile-modal-content' : 'p-6'}
          ${className}
        `.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg nav-touch-target"
            >
              ×
            </button>
          </div>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
};

// Mobile-optimized form field component
export const MobileFormField = ({ 
  label, 
  error, 
  children, 
  required = false,
  className = '' 
}) => {
  return (
    <div className={`mobile-form-field ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default {
  useMobileDetection,
  MobileContainer,
  MobileButton,
  MobileInput,
  MobileCard,
  MobileGrid,
  MobileScrollContainer,
  MobileModal,
  MobileFormField
};
