import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Target,
  TrendingUp,
  Mail,
  Gift,
  Percent,
  Users,
  BarChart3,
  Settings,
  Play,
  Pause,
  Copy
} from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MarketingPanel = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignType, setCampaignType] = useState('discount');

  const queryClient = useQueryClient();

  // Fetch marketing campaigns
  const { data: campaignsData, isLoading } = useQuery({
    queryKey: ['marketing-campaigns'],
    queryFn: async () => {
      const response = await api.get('/marketing/campaigns');
      return response.data;
    }
  });

  // Fetch marketing stats
  const { data: marketingStats } = useQuery({
    queryKey: ['marketing-stats'],
    queryFn: async () => {
      const response = await api.get('/marketing/stats');
      return response.data;
    }
  });

  // Fetch discount codes
  const { data: discountCodes } = useQuery({
    queryKey: ['discount-codes'],
    queryFn: async () => {
      const response = await api.get('/marketing/discount-codes');
      return response.data;
    }
  });

  const campaigns = campaignsData?.campaigns || [];
  const stats = marketingStats?.stats || {};
  const codes = discountCodes?.codes || [];

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'discounts', label: 'Discount Codes', icon: Percent },
    { id: 'email', label: 'Email Marketing', icon: Mail },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const campaignTypes = [
    { value: 'discount', label: 'Discount Campaign', icon: Percent },
    { value: 'flash-sale', label: 'Flash Sale', icon: TrendingUp },
    { value: 'email', label: 'Email Campaign', icon: Mail },
    { value: 'banner', label: 'Banner Promotion', icon: Target }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const renderCampaigns = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Campaigns
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeCampaigns || 0}
              </p>
            </div>
            <Megaphone className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Reach
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(stats.totalReach || 0).toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Conversion Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.conversionRate || 0}%
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Revenue Generated
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(stats.revenueGenerated || 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Marketing Campaigns
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {campaigns.map((campaign) => (
                <motion.tr
                  key={campaign._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {campaign.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {campaign.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full">
                      {campaign.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      campaign.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : campaign.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {campaign.clicks || 0} clicks
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {campaign.conversions || 0} conversions
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(campaign.startDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      to {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                        {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDiscountCodes = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Discount Codes
          </h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create Code</span>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codes.map((code) => (
              <motion.div
                key={code._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <Gift className="w-8 h-8" />
                  <button className="text-white hover:text-gray-200">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold">{code.code}</h4>
                  <p className="text-sm opacity-90">{code.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>{code.discount}% OFF</span>
                    <span>{code.uses || 0} uses</span>
                  </div>
                  <div className="text-xs opacity-75">
                    Expires: {new Date(code.expiryDate).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailMarketing = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Email Marketing
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Email marketing features coming soon
          </p>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Marketing Analytics
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Detailed analytics charts will be displayed here
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Marketing Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage campaigns, promotions, and marketing analytics
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'campaigns' && renderCampaigns()}
          {activeTab === 'discounts' && renderDiscountCodes()}
          {activeTab === 'email' && renderEmailMarketing()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>
    </div>
  );
};

export default MarketingPanel;
