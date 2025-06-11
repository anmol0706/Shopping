import React from 'react';
import { Helmet } from 'react-helmet-async';
import MobileTestComponent from '../components/debug/MobileTestComponent';

const MobileTest = () => {
  return (
    <>
      <Helmet>
        <title>Mobile Responsiveness Test - ShopEase</title>
        <meta name="description" content="Test mobile responsiveness features" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8 mobile-content-padding">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 mobile-heading">
              Mobile Responsiveness Test
            </h1>
            <p className="text-gray-600">
              Test all mobile responsiveness features and optimizations
            </p>
          </div>

          <MobileTestComponent />
        </div>
      </div>
    </>
  );
};

export default MobileTest;
