import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders', currentPage, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', '20');
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await api.get(`/orders/admin/all?${params}`);
      return response.data;
    }
  });

  const orders = ordersData?.orders || [];
  const pagination = ordersData?.pagination || {};

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'processing': return <Package className="w-4 h-4 text-purple-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'processing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
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
            Order Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all customer orders
          </p>
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Orders</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.items?.length} items
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.user?.name || 'Guest User'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.user?.email || order.guestInfo?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.orderStatus)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium text-gray-900 dark:text-white">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {order.paymentMethod}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} orders
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
