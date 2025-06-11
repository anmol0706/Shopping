import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, Shield, CreditCard, Users, AlertTriangle, Scale } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions - ShopEase</title>
        <meta name="description" content="Read ShopEase terms and conditions, user agreement, and legal policies." />
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
              Terms and Conditions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Last updated: {new Date().toLocaleDateString('en-IN')}
            </p>
          </motion.div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
            {/* Introduction */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Introduction
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Welcome to ShopEase. These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using ShopEase, you agree to be bound by these Terms. If you do not agree with any part of these terms, you may not use our services.
              </p>
            </motion.section>

            {/* Acceptance of Terms */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Scale className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Acceptance of Terms
                </h2>
              </div>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• By creating an account or making a purchase, you accept these Terms</li>
                <li>• You must be at least 18 years old to use our services</li>
                <li>• You are responsible for maintaining the confidentiality of your account</li>
                <li>• You agree to provide accurate and complete information</li>
                <li>• We reserve the right to modify these Terms at any time</li>
              </ul>
            </motion.section>

            {/* User Accounts */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  User Accounts
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Account Registration</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• You must provide accurate, current, and complete information</li>
                    <li>• You are responsible for maintaining the security of your password</li>
                    <li>• You must notify us immediately of any unauthorized use</li>
                    <li>• One person may not maintain more than one account</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Account Termination</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• We may terminate accounts that violate these Terms</li>
                    <li>• You may delete your account at any time</li>
                    <li>• Termination does not affect pending orders or obligations</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Orders and Payments */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Orders and Payments
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Placement</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• All orders are subject to acceptance and availability</li>
                    <li>• We reserve the right to refuse or cancel any order</li>
                    <li>• Prices are subject to change without notice</li>
                    <li>• Product descriptions are provided for general information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Terms</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Payment is required at the time of order placement</li>
                    <li>• We accept major credit cards, debit cards, and digital wallets</li>
                    <li>• All prices are in Indian Rupees (INR) and include applicable taxes</li>
                    <li>• Payment processing is handled by secure third-party providers</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Shipping and Delivery */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Shipping and Delivery
                </h2>
              </div>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Delivery times are estimates and not guaranteed</li>
                <li>• Risk of loss passes to you upon delivery</li>
                <li>• You must inspect products upon delivery</li>
                <li>• Shipping charges are non-refundable unless we made an error</li>
                <li>• We are not liable for delays caused by shipping carriers</li>
              </ul>
            </motion.section>

            {/* Returns and Refunds */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Returns and Refunds
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Return Policy</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Items may be returned within 30 days of delivery</li>
                    <li>• Items must be in original condition with tags attached</li>
                    <li>• Some items (personal care, food) are not returnable</li>
                    <li>• Return shipping costs are the responsibility of the customer</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Refund Process</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Refunds are processed within 5-7 business days</li>
                    <li>• Refunds are issued to the original payment method</li>
                    <li>• Shipping charges are non-refundable</li>
                    <li>• Partial refunds may be issued for damaged items</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Prohibited Uses */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Prohibited Uses
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">You may not use our service:</p>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                <li>• For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>• To violate any international, federal, provincial, or state regulations or laws</li>
                <li>• To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>• To submit false or misleading information</li>
                <li>• To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </motion.section>

            {/* Limitation of Liability */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Limitation of Liability
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                In no case shall ShopEase, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.
              </p>
            </motion.section>

            {/* Governing Law */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Governing Law
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </motion.section>

            {/* Contact Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Questions about these Terms?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Contact us if you have any questions about these Terms and Conditions
              </p>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Email: legal@shopease.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Address: 123 Business Street, Mumbai, Maharashtra 400001, India</p>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
