// Mobile utility functions for the ShopEase application

/**
 * Detect if the current device is mobile
 * @returns {boolean} True if mobile device
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Get current screen size category
 * @returns {string} 'mobile', 'tablet', or 'desktop'
 */
export const getScreenSize = () => {
  const width = window.innerWidth;
  if (width <= 480) return 'mobile';
  if (width <= 768) return 'tablet';
  return 'desktop';
};

/**
 * Check if device supports touch
 * @returns {boolean} True if touch is supported
 */
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get device orientation
 * @returns {string} 'portrait' or 'landscape'
 */
export const getOrientation = () => {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

/**
 * Check if device is in safe area (has notch/home indicator)
 * @returns {boolean} True if device has safe areas
 */
export const hasSafeArea = () => {
  return CSS.supports('padding-top: env(safe-area-inset-top)');
};

/**
 * Get viewport dimensions accounting for mobile browsers
 * @returns {object} {width, height, availableHeight}
 */
export const getViewportDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    availableHeight: window.screen.availHeight
  };
};

/**
 * Enhanced optimize touch events for mobile
 * @param {HTMLElement} element - Element to optimize
 * @param {object} options - Optimization options
 */
export const optimizeTouchEvents = (element, options = {}) => {
  if (!element || !isTouchDevice()) return;

  const {
    enableScale = true,
    enableOpacity = false,
    scaleValue = 0.98,
    highlightColor = 'rgba(59, 130, 246, 0.1)'
  } = options;

  // Prevent 300ms click delay and optimize touch
  element.style.touchAction = 'manipulation';
  element.style.webkitTapHighlightColor = highlightColor;
  element.style.userSelect = 'none';
  element.style.webkitUserSelect = 'none';

  // Add hardware acceleration
  element.style.transform = 'translateZ(0)';
  element.style.willChange = 'transform';

  // Enhanced touch feedback
  const handleTouchStart = () => {
    if (enableScale) {
      element.style.transform = `translateZ(0) scale(${scaleValue})`;
      element.style.transition = 'transform 0.1s ease';
    }
    if (enableOpacity) {
      element.style.opacity = '0.8';
    }
  };

  const handleTouchEnd = () => {
    if (enableScale) {
      element.style.transform = 'translateZ(0) scale(1)';
    }
    if (enableOpacity) {
      element.style.opacity = '1';
    }
  };

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });
  element.addEventListener('touchcancel', handleTouchEnd, { passive: true });

  // Return cleanup function
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
    element.removeEventListener('touchcancel', handleTouchEnd);
  };
};

/**
 * Debounce function for resize events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get connection quality
 * @returns {string} Connection type or 'unknown'
 */
export const getConnectionQuality = () => {
  if (navigator.connection) {
    return navigator.connection.effectiveType || 'unknown';
  }
  return 'unknown';
};

/**
 * Check if device is in low power mode
 * @returns {boolean} True if in low power mode
 */
export const isLowPowerMode = () => {
  if (navigator.getBattery) {
    return navigator.getBattery().then(battery => battery.charging === false && battery.level < 0.2);
  }
  return false;
};

/**
 * Optimize images for mobile
 * @param {string} imageUrl - Original image URL
 * @param {object} options - Optimization options
 * @returns {string} Optimized image URL
 */
export const optimizeImageForMobile = (imageUrl, options = {}) => {
  const { width = 400, quality = 80, format = 'webp' } = options;
  
  // If using a service like Cloudinary, you can add transformations
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl.replace('/upload/', `/upload/w_${width},q_${quality},f_${format}/`);
  }
  
  // For other services, return original URL
  return imageUrl;
};

/**
 * Handle mobile keyboard events
 * @param {Function} onShow - Callback when keyboard shows
 * @param {Function} onHide - Callback when keyboard hides
 */
export const handleMobileKeyboard = (onShow, onHide) => {
  if (!isMobileDevice()) return;

  let initialViewportHeight = window.innerHeight;
  
  const handleResize = debounce(() => {
    const currentHeight = window.innerHeight;
    const heightDifference = initialViewportHeight - currentHeight;
    
    if (heightDifference > 150) {
      // Keyboard is likely open
      onShow && onShow(heightDifference);
    } else {
      // Keyboard is likely closed
      onHide && onHide();
    }
  }, 100);

  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
};

/**
 * Smooth scroll to element with mobile optimization
 * @param {HTMLElement|string} element - Element or selector to scroll to
 * @param {object} options - Scroll options
 */
export const smoothScrollToElement = (element, options = {}) => {
  const targetElement = typeof element === 'string' 
    ? document.querySelector(element) 
    : element;
    
  if (!targetElement) return;

  const { offset = 0, behavior = 'smooth' } = options;
  const elementPosition = targetElement.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: behavior
  });
};

/**
 * Create mobile-optimized event listeners
 * @param {HTMLElement} element - Element to add listeners to
 * @param {object} events - Event handlers
 */
export const addMobileEventListeners = (element, events) => {
  if (!element) return;

  const { onTap, onSwipeLeft, onSwipeRight, onLongPress } = events;
  
  let startX, startY, startTime;
  let isLongPress = false;
  let longPressTimer;

  const handleStart = (e) => {
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
    isLongPress = false;

    if (onLongPress) {
      longPressTimer = setTimeout(() => {
        isLongPress = true;
        onLongPress(e);
      }, 500);
    }
  };

  const handleEnd = (e) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }

    if (isLongPress) return;

    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = endTime - startTime;

    // Check for swipe gestures
    if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100 && deltaTime < 300) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight(e);
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft(e);
      }
    } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300 && onTap) {
      // Simple tap
      onTap(e);
    }
  };

  if (isTouchDevice()) {
    element.addEventListener('touchstart', handleStart, { passive: true });
    element.addEventListener('touchend', handleEnd, { passive: true });
  } else {
    element.addEventListener('mousedown', handleStart);
    element.addEventListener('mouseup', handleEnd);
  }
};

/**
 * Mobile performance monitoring
 * @returns {object} Performance metrics
 */
export const getMobilePerformanceMetrics = () => {
  return {
    deviceMemory: navigator.deviceMemory || 'unknown',
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    connection: getConnectionQuality(),
    pixelRatio: window.devicePixelRatio || 1,
    viewport: getViewportDimensions(),
    userAgent: navigator.userAgent,
    touchSupport: isTouchDevice(),
    reducedMotion: prefersReducedMotion()
  };
};

export default {
  isMobileDevice,
  getScreenSize,
  isTouchDevice,
  getOrientation,
  hasSafeArea,
  getViewportDimensions,
  optimizeTouchEvents,
  debounce,
  prefersReducedMotion,
  getConnectionQuality,
  isLowPowerMode,
  optimizeImageForMobile,
  handleMobileKeyboard,
  smoothScrollToElement,
  addMobileEventListeners,
  getMobilePerformanceMetrics
};
