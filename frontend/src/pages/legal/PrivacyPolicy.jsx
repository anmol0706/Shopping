import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Users, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - ShopEase</title>
        <meta name="description" content="Learn how ShopEase protects your privacy and handles your personal information." />
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
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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
                <Shield className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Introduction
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                At ShopEase, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </motion.section>

            {/* Information We Collect */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Database className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Information We Collect
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Name, email address, and phone number</li>
                    <li>• Billing and shipping addresses</li>
                    <li>• Payment information (processed securely by third parties)</li>
                    <li>• Account credentials and preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Usage Information</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Pages visited and time spent on our website</li>
                    <li>• Products viewed and purchased</li>
                    <li>• Search queries and browsing behavior</li>
                    <li>• Device information and IP address</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* How We Use Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  How We Use Your Information
                </h2>
              </div>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Process and fulfill your orders</li>
                <li>• Provide customer support and respond to inquiries</li>
                <li>• Send order confirmations and shipping updates</li>
                <li>• Improve our website and services</li>
                <li>• Personalize your shopping experience</li>
                <li>• Send promotional emails (with your consent)</li>
                <li>• Prevent fraud and ensure security</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </motion.section>

            {/* Information Sharing */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Information Sharing
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• With service providers who help us operate our business</li>
                <li>• With shipping companies to deliver your orders</li>
                <li>• With payment processors to handle transactions</li>
                <li>• When required by law or to protect our rights</li>
                <li>• In connection with a business transfer or merger</li>
              </ul>
            </motion.section>

            {/* Data Security */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Data Security
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• SSL encryption for data transmission</li>
                <li>• Secure servers and databases</li>
                <li>• Regular security audits and updates</li>
                <li>• Limited access to personal information</li>
                <li>• Employee training on data protection</li>
              </ul>
            </motion.section>

            {/* Your Rights */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Rights
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Access and review your personal information</li>
                <li>• Update or correct inaccurate information</li>
                <li>• Delete your account and personal information</li>
                <li>• Opt-out of marketing communications</li>
                <li>• Request a copy of your data</li>
                <li>• Object to certain processing activities</li>
              </ul>
            </motion.section>

            {/* Cookies */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Cookies and Tracking
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Essential cookies for website functionality</li>
                <li>• Analytics cookies to understand usage patterns</li>
                <li>• Preference cookies to remember your settings</li>
                <li>• Marketing cookies for personalized advertising</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                You can control cookie settings through your browser preferences.
              </p>
            </motion.section>

            {/* Children's Privacy */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Children's Privacy
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </motion.section>

            {/* Changes to Policy */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Changes to This Policy
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </motion.section>

            {/* Contact Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Questions about Privacy?
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Email: privacy@shopease.com</p>
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

export default PrivacyPolicy;
