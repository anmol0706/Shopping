import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { RotateCcw, CreditCard, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const CancellationRefunds = () => {
  return (
    <>
      <Helmet>
        <title>Cancellation & Refunds - ShopEase</title>
        <meta name="description" content="Learn about ShopEase cancellation and refund policy, return process, and refund timelines." />
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
              Cancellation & Refunds
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to know about cancelling orders and getting refunds
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Last updated: {new Date().toLocaleDateString('en-IN')}
            </p>
          </motion.div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
            {/* Order Cancellation */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <XCircle className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Order Cancellation
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">When You Can Cancel</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Orders can be cancelled within 1 hour of placement</li>
                    <li>• Orders that haven't been shipped yet</li>
                    <li>• Orders with payment pending or failed</li>
                    <li>• Custom or personalized orders cannot be cancelled once production starts</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How to Cancel</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Log into your account and go to "My Orders"</li>
                    <li>• Find the order you want to cancel</li>
                    <li>• Click "Cancel Order" if the option is available</li>
                    <li>• Contact customer support if you need assistance</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Return Policy */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <RotateCcw className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Return Policy
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Returnable Items</h3>
                  </div>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Clothing and accessories</li>
                    <li>• Electronics (in original packaging)</li>
                    <li>• Home and garden items</li>
                    <li>• Books and media</li>
                    <li>• Unopened beauty products</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Non-Returnable Items</h3>
                  </div>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Personal care items</li>
                    <li>• Food and beverages</li>
                    <li>• Custom or personalized items</li>
                    <li>• Intimate apparel</li>
                    <li>• Digital downloads</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Return Process */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Return Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Initiate Return</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Contact us within 30 days of delivery to start the return process
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pack & Ship</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Pack the item securely and ship it back using our prepaid label
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Get Refund</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Receive your refund within 5-7 business days after we receive the item
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Refund Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Refund Information
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Refund Methods</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Original payment method (credit/debit card, digital wallet)</li>
                    <li>• Bank transfer for cash on delivery orders</li>
                    <li>• Store credit (if requested)</li>
                    <li>• Gift card (for promotional purchases)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Refund Timeline</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Credit/Debit Cards</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">5-7 business days</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Digital Wallets</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">3-5 business days</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Bank Transfer</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">7-10 business days</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Store Credit</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Instant</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Refund Conditions */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Refund Conditions
                </h2>
              </div>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Items must be returned within 30 days of delivery</li>
                <li>• Items must be in original condition with tags attached</li>
                <li>• Original packaging and accessories must be included</li>
                <li>• Proof of purchase (order number) is required</li>
                <li>• Shipping charges are non-refundable (unless our error)</li>
                <li>• Return shipping costs are deducted from refund amount</li>
                <li>• Partial refunds may be issued for damaged or used items</li>
              </ul>
            </motion.section>

            {/* Exchange Policy */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Exchange Policy
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We offer exchanges for the following reasons:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Wrong size or color received</li>
                  <li>• Defective or damaged items</li>
                  <li>• Different item than ordered</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                  Exchanges are subject to product availability. If the desired item is not available, a full refund will be processed.
                </p>
              </div>
            </motion.section>

            {/* Important Notes */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Important Notes
                </h2>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li>• Refund processing time may vary depending on your bank or payment provider</li>
                <li>• International orders may be subject to additional customs fees</li>
                <li>• Sale items and clearance products may have different return policies</li>
                <li>• We reserve the right to refuse returns that don't meet our conditions</li>
                <li>• Multiple returns may result in account restrictions</li>
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
                Need Help with Returns or Refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our customer service team is here to help you with any questions
              </p>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Email: returns@shopease.com</p>
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

export default CancellationRefunds;
