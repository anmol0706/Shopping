import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package, Shield, CreditCard } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Shipping Policy - ShopEase</title>
        <meta name="description" content="Learn about ShopEase shipping policy, delivery times, charges, and terms." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shipping Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to know about our shipping and delivery process
            </p>
          </motion.div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
            {/* Shipping Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Truck className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Shipping Overview
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                At ShopEase, we are committed to delivering your orders quickly and safely. We offer multiple shipping options to meet your needs and ensure your products reach you in perfect condition.
              </p>
            </motion.section>

            {/* Delivery Times */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Delivery Times
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Standard Delivery</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">5-7 business days</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Free for orders above ₹500</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Express Delivery</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">2-3 business days</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">₹99 shipping charge</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Same Day Delivery</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Within 24 hours</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Available in select cities</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Next Day Delivery</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Next business day</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">₹199 shipping charge</p>
                </div>
              </div>
            </motion.section>

            {/* Shipping Charges */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Shipping Charges
                </h2>
              </div>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Free standard shipping on orders above ₹500</li>
                <li>• ₹50 shipping charge for orders below ₹500</li>
                <li>• Express delivery: ₹99 (regardless of order value)</li>
                <li>• Same day delivery: ₹149 (select cities only)</li>
                <li>• Next day delivery: ₹199 (major cities)</li>
                <li>• Cash on Delivery: Additional ₹25 charge</li>
              </ul>
            </motion.section>

            {/* Service Areas */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Service Areas
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pan-India Delivery</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We deliver to all major cities and towns across India. Remote areas may have extended delivery times.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Same Day Delivery Cities</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata, Ahmedabad
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Order Processing */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Package className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Order Processing
                </h2>
              </div>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Orders are processed within 1-2 business days</li>
                <li>• Orders placed before 2 PM are processed the same day</li>
                <li>• Weekend orders are processed on the next business day</li>
                <li>• You will receive a tracking number once your order is shipped</li>
                <li>• SMS and email notifications are sent for order updates</li>
              </ul>
            </motion.section>

            {/* Packaging */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Packaging & Safety
                </h2>
              </div>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• All products are carefully packaged to prevent damage</li>
                <li>• Fragile items receive extra protective packaging</li>
                <li>• Eco-friendly packaging materials are used when possible</li>
                <li>• Each package is quality checked before dispatch</li>
                <li>• Insurance coverage available for high-value items</li>
              </ul>
            </motion.section>

            {/* Important Notes */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Important Notes
              </h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li>• Delivery times are estimates and may vary due to unforeseen circumstances</li>
                <li>• Someone must be available to receive the package at the delivery address</li>
                <li>• We are not responsible for delays caused by incorrect addresses</li>
                <li>• Additional charges may apply for remote or difficult-to-reach locations</li>
                <li>• Customs duties and taxes (if applicable) are the responsibility of the customer</li>
                <li>• Last updated: {new Date().toLocaleDateString('en-IN')}</li>
              </ul>
            </motion.section>

            {/* Contact Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Questions about shipping?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Contact our customer support team for assistance
              </p>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Email: support@shopease.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Hours: Monday - Friday, 9:00 AM - 6:00 PM IST</p>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicy;
