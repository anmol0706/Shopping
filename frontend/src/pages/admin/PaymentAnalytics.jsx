import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  AlertCircle,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PaymentAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const periods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '365d', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Fetch payment analytics
  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ['payment-analytics', selectedPeriod, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedPeriod !== 'custom') {
        params.append('period', selectedPeriod);
      } else if (dateRange.start && dateRange.end) {
        params.append('startDate', dateRange.start);
        params.append('endDate', dateRange.end);
      }
      
      const response = await api.get(`/payment/analytics?${params}`);
      return response.data.analytics;
    }
  });

  // Fetch success rate
  const { data: successRate } = useQuery({
    queryKey: ['payment-success-rate', selectedPeriod],
    queryFn: async () => {
      const response = await api.get(`/payment/success-rate?period=${selectedPeriod}`);
      return response.data.successRate;
    }
  });

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period !== 'custom') {
      setDateRange({ start: '', end: '' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const overview = analytics?.overview || {};
  const paymentMethods = analytics?.paymentMethods || [];
  const dailyRevenue = analytics?.dailyRevenue || [];
  const failedPayments = analytics?.failedPayments || [];
  const hourlyStats = analytics?.hourlyStats || [];

  // Calculate growth rates (mock data for demo)
  const revenueGrowth = 12.5;
  const orderGrowth = 8.3;
  const successRateValue = successRate?.reduce((acc, method) => acc + method.successRate, 0) / (successRate?.length || 1) || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payment Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor payment performance and revenue insights
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>

          {/* Custom Date Range */}
          {selectedPeriod === 'custom' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          )}

          <button
            onClick={() => refetch()}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{overview.totalRevenue?.toLocaleString('en-IN') || '0'}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 dark:text-green-400">
              +{revenueGrowth}% from last period
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overview.totalOrders?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 dark:text-green-400">
              +{orderGrowth}% from last period
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Order Value
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{overview.avgOrderValue?.toLocaleString('en-IN') || '0'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <Activity className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Stable performance
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Success Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {successRateValue.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 dark:text-green-400">
              Excellent performance
            </span>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Payment Methods
            </h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {paymentMethods.map((method, index) => {
              const percentage = (method.revenue / overview.totalRevenue * 100) || 0;
              return (
                <div key={method._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {method._id}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ₹{method.revenue.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Success Rate by Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Success Rate by Method
            </h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {successRate?.map((method) => (
              <div key={method._id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {method._id}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {method.successRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      method.successRate >= 95 ? 'bg-green-500' :
                      method.successRate >= 85 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${method.successRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentAnalytics;
