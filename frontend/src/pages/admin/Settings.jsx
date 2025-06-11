import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Store, 
  Mail, 
  Shield, 
  Palette, 
  Globe, 
  Bell, 
  Database,
  Save,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'ShopEase',
    siteDescription: 'Your Ultimate Shopping Destination',
    contactEmail: 'admin@shopease.com',
    supportEmail: 'support@shopease.com',
    phoneNumber: '+91 98765 43210',
    address: '123 Business Street, Mumbai, Maharashtra 400001',
    
    // Store Settings
    currency: 'INR',
    taxRate: 18,
    shippingFee: 50,
    freeShippingThreshold: 500,
    lowStockThreshold: 10,
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    emailFromName: 'ShopEase',
    emailFromAddress: 'noreply@shopease.com',
    
    // Security Settings
    enableTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    
    // Notification Settings
    emailNotifications: true,
    orderNotifications: true,
    lowStockNotifications: true,
    newUserNotifications: false,
    
    // API Settings
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: 'sk_test_...',
    cloudinaryCloudName: 'shopease',
    cloudinaryApiKey: '123456789',
    cloudinaryApiSecret: 'abcdefghijk',
    
    // Appearance Settings
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    darkMode: false,
    compactMode: false
  });

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'store', name: 'Store', icon: Store },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'api', name: 'API Keys', icon: Database },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setSettings({
        ...settings,
        // Add default reset logic here
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure your store settings and preferences
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  General Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={settings.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Address
                  </label>
                  <textarea
                    value={settings.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Store Settings */}
            {activeTab === 'store' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Store Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={settings.taxRate}
                      onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Shipping Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={settings.shippingFee}
                      onChange={(e) => handleInputChange('shippingFee', parseFloat(e.target.value))}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Free Shipping Threshold (₹)
                    </label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => handleInputChange('freeShippingThreshold', parseFloat(e.target.value))}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      value={settings.lowStockThreshold}
                      onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Email Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={settings.smtpHost}
                      onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      value={settings.smtpPort}
                      onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      value={settings.smtpUsername}
                      onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      From Name
                    </label>
                    <input
                      type="text"
                      value={settings.emailFromName}
                      onChange={(e) => handleInputChange('emailFromName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      From Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.emailFromAddress}
                      onChange={(e) => handleInputChange('emailFromAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Security Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                      min="5"
                      max="1440"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                      min="3"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
                      min="6"
                      max="20"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.enableTwoFactor}
                      onChange={(e) => handleInputChange('enableTwoFactor', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Two-Factor Authentication
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive general email notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Order Notifications</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about new orders</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.orderNotifications}
                      onChange={(e) => handleInputChange('orderNotifications', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Low Stock Alerts</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Alert when products are running low</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.lowStockNotifications}
                      onChange={(e) => handleInputChange('lowStockNotifications', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">New User Notifications</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when new users register</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.newUserNotifications}
                      onChange={(e) => handleInputChange('newUserNotifications', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* API Settings */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  API Keys & Integrations
                </h3>

                <div className="space-y-6">
                  {/* Stripe Settings */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Stripe Payment Gateway</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Publishable Key
                        </label>
                        <input
                          type="text"
                          value={settings.stripePublicKey}
                          onChange={(e) => handleInputChange('stripePublicKey', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Secret Key
                        </label>
                        <div className="relative">
                          <input
                            type={showApiKey ? "text" : "password"}
                            value={settings.stripeSecretKey}
                            onChange={(e) => handleInputChange('stripeSecretKey', e.target.value)}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showApiKey ? (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cloudinary Settings */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Cloudinary Image Storage</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cloud Name
                        </label>
                        <input
                          type="text"
                          value={settings.cloudinaryCloudName}
                          onChange={(e) => handleInputChange('cloudinaryCloudName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          API Key
                        </label>
                        <input
                          type="text"
                          value={settings.cloudinaryApiKey}
                          onChange={(e) => handleInputChange('cloudinaryApiKey', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          API Secret
                        </label>
                        <input
                          type="password"
                          value={settings.cloudinaryApiSecret}
                          onChange={(e) => handleInputChange('cloudinaryApiSecret', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Appearance & Theme
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.secondaryColor}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enable dark theme for the admin panel</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => handleInputChange('darkMode', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Compact Mode</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Use compact layout for better space utilization</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.compactMode}
                      onChange={(e) => handleInputChange('compactMode', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
