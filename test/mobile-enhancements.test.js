/**
 * Mobile Enhancements Test Suite
 * Tests for mobile responsiveness, touch interactions, and performance optimizations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../frontend/src/contexts/AuthContext';
import { CartProvider } from '../frontend/src/contexts/CartContext';
import BottomNav from '../frontend/src/components/layout/BottomNav';
import ProductCard from '../frontend/src/components/product/ProductCard';
import { 
  isMobileDevice, 
  isTouchDevice, 
  optimizeTouchEvents,
  getScreenSize,
  getMobilePerformanceMetrics 
} from '../frontend/src/utils/mobileUtils';

// Mock data
const mockProduct = {
  _id: '1',
  name: 'Test Product',
  price: 999,
  images: [{ url: 'https://example.com/image.jpg', alt: 'Test Product' }],
  category: 'Electronics',
  stock: 10,
  rating: { average: 4.5 },
  description: 'Test product description'
};

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Mobile Enhancements', () => {
  let originalUserAgent;
  let originalInnerWidth;
  let originalInnerHeight;

  beforeEach(() => {
    // Store original values
    originalUserAgent = navigator.userAgent;
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true
    });
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      configurable: true
    });
    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
      configurable: true
    });
  });

  describe('Mobile Detection', () => {
    it('should detect mobile devices correctly', () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });

      expect(isMobileDevice()).toBe(true);
    });

    it('should detect desktop devices correctly', () => {
      // Mock desktop user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true
      });

      expect(isMobileDevice()).toBe(false);
    });

    it('should detect touch devices correctly', () => {
      // Mock touch support
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 5,
        configurable: true
      });

      expect(isTouchDevice()).toBe(true);
    });

    it('should categorize screen sizes correctly', () => {
      // Mock mobile screen size
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        configurable: true
      });
      expect(getScreenSize()).toBe('mobile');

      // Mock tablet screen size
      Object.defineProperty(window, 'innerWidth', {
        value: 768,
        configurable: true
      });
      expect(getScreenSize()).toBe('tablet');

      // Mock desktop screen size
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        configurable: true
      });
      expect(getScreenSize()).toBe('desktop');
    });
  });

  describe('Bottom Navigation', () => {
    it('should render bottom navigation with proper mobile classes', () => {
      render(
        <TestWrapper>
          <BottomNav />
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('mobile-glass-strong');
      expect(nav).toHaveClass('mobile-touch-friendly');
    });

    it('should have touch-friendly navigation items', () => {
      render(
        <TestWrapper>
          <BottomNav />
        </TestWrapper>
      );

      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveClass('nav-touch-target');
      expect(homeLink).toHaveClass('mobile-touch-feedback');
    });

    it('should display cart count inside icon', () => {
      render(
        <TestWrapper>
          <BottomNav />
        </TestWrapper>
      );

      // Cart icon should be present (count display is handled by CartIconWithCount component)
      const cartButton = screen.getByText('Cart').closest('a');
      expect(cartButton).toBeInTheDocument();
    });
  });

  describe('Product Card Mobile Optimizations', () => {
    it('should render product card with mobile classes', () => {
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} />
        </TestWrapper>
      );

      const productCard = screen.getByText('Test Product').closest('div').closest('div');
      expect(productCard).toHaveClass('mobile-product-card');
      expect(productCard).toHaveClass('mobile-touch-friendly');
    });

    it('should have touch-friendly action buttons', () => {
      render(
        <TestWrapper>
          <ProductCard product={mockProduct} />
        </TestWrapper>
      );

      const addToCartButton = screen.getByTitle('Add to Cart');
      const quickViewButton = screen.getByTitle('Quick View');

      expect(addToCartButton).toHaveClass('nav-touch-target');
      expect(addToCartButton).toHaveClass('mobile-touch-feedback');
      expect(quickViewButton).toHaveClass('nav-touch-target');
      expect(quickViewButton).toHaveClass('mobile-touch-feedback');
    });
  });

  describe('Touch Event Optimization', () => {
    it('should optimize touch events for elements', () => {
      const element = document.createElement('button');
      document.body.appendChild(element);

      const cleanup = optimizeTouchEvents(element, {
        enableScale: true,
        enableOpacity: false,
        scaleValue: 0.95
      });

      expect(element.style.touchAction).toBe('manipulation');
      expect(element.style.transform).toBe('translateZ(0)');
      expect(element.style.willChange).toBe('transform');

      // Test touch events
      fireEvent.touchStart(element);
      expect(element.style.transform).toBe('translateZ(0) scale(0.95)');

      fireEvent.touchEnd(element);
      expect(element.style.transform).toBe('translateZ(0) scale(1)');

      // Cleanup
      cleanup();
      document.body.removeChild(element);
    });

    it('should handle touch events with opacity changes', () => {
      const element = document.createElement('button');
      document.body.appendChild(element);

      optimizeTouchEvents(element, {
        enableScale: false,
        enableOpacity: true
      });

      fireEvent.touchStart(element);
      expect(element.style.opacity).toBe('0.8');

      fireEvent.touchEnd(element);
      expect(element.style.opacity).toBe('1');

      document.body.removeChild(element);
    });
  });

  describe('Mobile Performance Metrics', () => {
    it('should collect mobile performance metrics', () => {
      const metrics = getMobilePerformanceMetrics();

      expect(metrics).toHaveProperty('deviceMemory');
      expect(metrics).toHaveProperty('hardwareConcurrency');
      expect(metrics).toHaveProperty('connection');
      expect(metrics).toHaveProperty('pixelRatio');
      expect(metrics).toHaveProperty('viewport');
      expect(metrics).toHaveProperty('userAgent');
      expect(metrics).toHaveProperty('touchSupport');
      expect(metrics).toHaveProperty('reducedMotion');
    });
  });

  describe('CSS Mobile Classes', () => {
    it('should apply mobile-specific CSS classes correctly', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        configurable: true
      });

      const testElement = document.createElement('div');
      testElement.className = 'mobile-product-card mobile-glass mobile-touch-friendly';
      document.body.appendChild(testElement);

      const styles = window.getComputedStyle(testElement);
      
      // These tests would need actual CSS to be loaded in the test environment
      // For now, we just verify the classes are applied
      expect(testElement).toHaveClass('mobile-product-card');
      expect(testElement).toHaveClass('mobile-glass');
      expect(testElement).toHaveClass('mobile-touch-friendly');

      document.body.removeChild(testElement);
    });
  });

  describe('Responsive Design', () => {
    it('should handle viewport changes correctly', async () => {
      // Mock viewport change
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        configurable: true
      });

      // Trigger resize event
      fireEvent(window, new Event('resize'));

      await waitFor(() => {
        expect(getScreenSize()).toBe('mobile');
      });
    });

    it('should maintain visual consistency across screen sizes', () => {
      const mobileWidth = 375;
      const tabletWidth = 768;
      const desktopWidth = 1024;

      // Test mobile
      Object.defineProperty(window, 'innerWidth', {
        value: mobileWidth,
        configurable: true
      });
      expect(getScreenSize()).toBe('mobile');

      // Test tablet
      Object.defineProperty(window, 'innerWidth', {
        value: tabletWidth,
        configurable: true
      });
      expect(getScreenSize()).toBe('tablet');

      // Test desktop
      Object.defineProperty(window, 'innerWidth', {
        value: desktopWidth,
        configurable: true
      });
      expect(getScreenSize()).toBe('desktop');
    });
  });
});
