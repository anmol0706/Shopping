import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - ShopEase</title>
        <meta name="description" content="Learn how ShopEase protects your privacy and handles your personal information." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At ShopEase, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Name, email address, and phone number</li>
                    <li>• Billing and shipping addresses</li>
                    <li>• Payment information (processed securely by third parties)</li>
                    <li>• Account credentials and preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Pages visited and time spent on our website</li>
                    <li>• Products viewed and purchased</li>
                    <li>• Search queries and browsing behavior</li>
                    <li>• Device information and IP address</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How We Use Your Information
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li>• Process and fulfill your orders</li>
                <li>• Provide customer support and respond to inquiries</li>
                <li>• Send order confirmations and shipping updates</li>
                <li>• Improve our website and services</li>
                <li>• Personalize your shopping experience</li>
                <li>• Send promotional emails (with your consent)</li>
                <li>• Prevent fraud and ensure security</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Information Sharing
              </h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• With service providers who help us operate our business</li>
                <li>• With shipping companies to deliver your orders</li>
                <li>• With payment processors to handle transactions</li>
                <li>• When required by law or to protect our rights</li>
                <li>• In connection with a business transfer or merger</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Data Security
              </h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• SSL encryption for data transmission</li>
                <li>• Secure servers and databases</li>
                <li>• Regular security audits and updates</li>
                <li>• Limited access to personal information</li>
                <li>• Employee training on data protection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your Rights
              </h2>
              <p className="text-gray-600 mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Access and review your personal information</li>
                <li>• Update or correct inaccurate information</li>
                <li>• Delete your account and personal information</li>
                <li>• Opt-out of marketing communications</li>
                <li>• Request a copy of your data</li>
                <li>• Object to certain processing activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Cookies and Tracking
              </h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Essential cookies for website functionality</li>
                <li>• Analytics cookies to understand usage patterns</li>
                <li>• Preference cookies to remember your settings</li>
                <li>• Marketing cookies for personalized advertising</li>
              </ul>
              <p className="text-gray-600 mt-4">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Children's Privacy
              </h2>
              <p className="text-gray-700">
                Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Changes to This Policy
              </h2>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="text-center pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Questions about Privacy?
              </h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Email: privacy@shopease.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Address: 123 Business Street, Mumbai, Maharashtra 400001, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
