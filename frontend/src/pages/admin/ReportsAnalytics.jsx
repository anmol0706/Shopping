import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [reportType, setReportType] = useState('sales');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['reports-analytics', dateRange, reportType],
    queryFn: async () => {
      const response = await api.get(`/analytics/reports?period=${dateRange}&type=${reportType}`);
      return response.data;
    }
  });

  // Fetch sales overview
  const { data: salesOverview } = useQuery({
    queryKey: ['sales-overview', dateRange],
    queryFn: async () => {
      const response = await api.get(`/analytics/sales-overview?period=${dateRange}`);
      return response.data;
    }
  });

  // Fetch top products
  const { data: topProducts } = useQuery({
    queryKey: ['top-products', dateRange],
    queryFn: async () => {
      const response = await api.get(`/analytics/top-products?period=${dateRange}`);
      return response.data;
    }
  });

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const reportTypes = [
    { value: 'sales', label: 'Sales Report' },
    { value: 'products', label: 'Product Performance' },
    { value: 'customers', label: 'Customer Analytics' },
    { value: 'inventory', label: 'Inventory Report' },
    { value: 'financial', label: 'Financial Summary' }
  ];

  const handleExportReport = async (format) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/analytics/export?period=${dateRange}&type=${reportType}&format=${format}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report-${dateRange}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const overview = salesOverview?.overview || {};
  const products = topProducts?.products || [];

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive business insights and performance metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExportReport('pdf')}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleExportReport('excel')}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(overview.totalRevenue || 0).toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{overview.revenueGrowth || 0}%
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
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
                Total Orders
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overview.totalOrders || 0}
              </p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{overview.ordersGrowth || 0}%
              </p>
            </div>
            <ShoppingBag className="w-8 h-8 text-blue-600" />
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
                New Customers
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overview.newCustomers || 0}
              </p>
              <p className="text-sm text-purple-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{overview.customersGrowth || 0}%
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
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
                Avg. Order Value
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(overview.avgOrderValue || 0).toLocaleString()}
              </p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{overview.aovGrowth || 0}%
              </p>
            </div>
            <Activity className="w-8 h-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales Trend
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Chart will be rendered here</p>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Products
            </h3>
            <PieChart className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {products.slice(0, 5).map((product, index) => (
              <div key={product._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8 rounded-lg object-cover"
                      src={product.images?.[0] || '/placeholder-image.jpg'}
                      alt={product.name}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.sales} sales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ₹{(product.revenue || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detailed Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detailed {reportTypes.find(t => t.value === reportType)?.label}
          </h3>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Detailed report data will be displayed here based on selected report type
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsAnalytics;
