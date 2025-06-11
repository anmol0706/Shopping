import React from 'react';
import { motion } from 'framer-motion';
import { 
  useMobileDetection, 
  MobileContainer, 
  MobileButton, 
  MobileInput, 
  MobileCard, 
  MobileGrid,
  MobileScrollContainer,
  MobileFormField 
} from '../common/MobileOptimized';

const MobileTestComponent = () => {
  const { isMobile, screenSize, orientation } = useMobileDetection();

  const testProducts = [
    { id: 1, name: 'Test Product 1', price: '₹999', image: '/api/placeholder/200/200' },
    { id: 2, name: 'Test Product 2', price: '₹1,299', image: '/api/placeholder/200/200' },
    { id: 3, name: 'Test Product 3', price: '₹799', image: '/api/placeholder/200/200' },
    { id: 4, name: 'Test Product 4', price: '₹1,599', image: '/api/placeholder/200/200' },
    { id: 5, name: 'Test Product 5', price: '₹899', image: '/api/placeholder/200/200' },
  ];

  return (
    <MobileContainer className="py-8">
      <div className="space-y-8">
        {/* Device Info */}
        <MobileCard>
          <h2 className="text-xl font-bold mb-4">Device Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Is Mobile:</strong> {isMobile ? 'Yes' : 'No'}</p>
            <p><strong>Screen Size:</strong> {screenSize}</p>
            <p><strong>Orientation:</strong> {orientation}</p>
            <p><strong>Window Width:</strong> {window.innerWidth}px</p>
            <p><strong>Window Height:</strong> {window.innerHeight}px</p>
          </div>
        </MobileCard>

        {/* Touch Target Test */}
        <MobileCard>
          <h2 className="text-xl font-bold mb-4">Touch Target Test</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <MobileButton size="small">Small Button</MobileButton>
              <MobileButton size="medium">Medium Button</MobileButton>
              <MobileButton size="large">Large Button</MobileButton>
            </div>
            <div className="flex flex-wrap gap-2">
              <MobileButton variant="secondary">Secondary</MobileButton>
              <MobileButton variant="outline">Outline</MobileButton>
            </div>
          </div>
        </MobileCard>

        {/* Form Test */}
        <MobileCard>
          <h2 className="text-xl font-bold mb-4">Mobile Form Test</h2>
          <div className="space-y-4">
            <MobileFormField label="Name" required>
              <MobileInput placeholder="Enter your name" />
            </MobileFormField>
            <MobileFormField label="Email">
              <MobileInput type="email" placeholder="Enter your email" />
            </MobileFormField>
            <MobileFormField label="Phone">
              <MobileInput type="tel" placeholder="Enter your phone" />
            </MobileFormField>
            <MobileButton className="w-full">Submit Form</MobileButton>
          </div>
        </MobileCard>

        {/* Grid Test */}
        <MobileCard>
          <h2 className="text-xl font-bold mb-4">Responsive Grid Test</h2>
          <MobileGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <MobileCard key={item} className="text-center p-4">
                <h3 className="font-semibold">Grid Item {item}</h3>
                <p className="text-sm text-gray-600">This is a test grid item</p>
              </MobileCard>
            ))}
          </MobileGrid>
        </MobileCard>

        {/* Horizontal Scroll Test */}
        <MobileCard>
          <h2 className="text-xl font-bold mb-4">Horizontal Scroll Test</h2>
          <MobileScrollContainer>
            {testProducts.map((product) => (
              <motion.div
                key={product.id}
                className="flex-shrink-0 w-40 sm:w-48 md:w-56"
                whileHover={{ scale: 1.02 }}
              >
                <MobileCard className="text-center">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                  <h3 className="font-semibold text-sm">{product.name}</h3>
                  <p className="text-blue-600 font-bold">{product.price}</p>
                  <MobileButton size="small" className="w-full mt-2">
                    Add to Cart
                  </MobileButton>
                </MobileCard>
              </motion.div>
            ))}
          </MobileScrollContainer>
        </MobileCard>

        {/* CSS Classes Test */}
        <MobileCard>
          <h2 className="text-xl font-bold mb-4">CSS Classes Test</h2>
          <div className="space-y-4">
            <div className="nav-touch-target bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-sm">Touch Target (44px min)</span>
            </div>
            <div className="mobile-glass p-4 rounded-lg">
              <span className="text-sm">Glass Morphism Effect</span>
            </div>
            <div className="mobile-form-input border rounded-lg p-2">
              <span className="text-sm">Mobile Form Input Styling</span>
            </div>
          </div>
        </MobileCard>

        {/* Animation Performance Test */}
        <MobileCard>
          <h2 className="text-xl font-bold mb-4">Animation Performance Test</h2>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg text-center mobile-reduced-motion"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item * 0.1 }}
              >
                <span className="text-sm font-semibold">Animation {item}</span>
              </motion.div>
            ))}
          </div>
        </MobileCard>

        {/* Viewport and Safe Area Test */}
        <MobileCard>
          <h2 className="text-xl font-bold mb-4">Viewport & Safe Area Test</h2>
          <div className="space-y-2 text-sm">
            <div className="mobile-safe-area-top bg-green-100 p-2 rounded">
              Safe Area Top Padding
            </div>
            <div className="mobile-safe-area-bottom bg-green-100 p-2 rounded">
              Safe Area Bottom Padding
            </div>
            <div className="mobile-viewport-fix bg-blue-100 p-2 rounded">
              Viewport Fix Applied
            </div>
          </div>
        </MobileCard>

        {/* Page Navigation Test */}
        <MobileCard>
          <h2 className="text-xl font-bold mb-4">Page Navigation Test</h2>
          <div className="grid grid-cols-2 gap-2">
            <MobileButton
              size="small"
              onClick={() => window.location.href = '/profile'}
            >
              Profile Page
            </MobileButton>
            <MobileButton
              size="small"
              onClick={() => window.location.href = '/cart'}
            >
              Cart Page
            </MobileButton>
            <MobileButton
              size="small"
              onClick={() => window.location.href = '/products'}
            >
              Products Page
            </MobileButton>
            <MobileButton
              size="small"
              onClick={() => window.location.href = '/'}
            >
              Home Page
            </MobileButton>
          </div>
        </MobileCard>

        {/* Performance Test */}
        <MobileCard>
          <h2 className="text-xl font-bold mb-4">Performance Test</h2>
          <div className="space-y-4">
            <div className="text-sm">
              <p><strong>User Agent:</strong> {navigator.userAgent}</p>
              <p><strong>Touch Support:</strong> {'ontouchstart' in window ? 'Yes' : 'No'}</p>
              <p><strong>Device Pixel Ratio:</strong> {window.devicePixelRatio}</p>
              <p><strong>Connection:</strong> {navigator.connection?.effectiveType || 'Unknown'}</p>
            </div>
            <MobileButton
              onClick={() => {
                const start = performance.now();
                setTimeout(() => {
                  const end = performance.now();
                  alert(`Animation test completed in ${(end - start).toFixed(2)}ms`);
                }, 1000);
              }}
            >
              Test Animation Performance
            </MobileButton>
          </div>
        </MobileCard>
      </div>
    </MobileContainer>
  );
};

export default MobileTestComponent;
