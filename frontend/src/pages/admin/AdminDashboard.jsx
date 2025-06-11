import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  CreditCard,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Bell,
  RefreshCw,
  Eye,
  TrendingDown,
  Activity,
  Warehouse,
  Star
} from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  // Fetch dashboard data
  const { data: orderAnalytics, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-order-analytics'],
    queryFn: async () => {
      const response = await api.get('/orders/admin/analytics');
      return response.data.analytics;
    }
  });

  const { data: paymentAnalytics, isLoading: paymentsLoading } = useQuery({
    queryKey: ['admin-payment-analytics'],
    queryFn: async () => {
      const response = await api.get('/payment/analytics?period=30d');
      return response.data.analytics;
    }
  });

  const { data: recentOrders, isLoading: recentOrdersLoading } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/admin/all?limit=5');
      return response.data.orders;
    }
  });

  // Fetch additional dashboard metrics
  const { data: inventoryStats } = useQuery({
    queryKey: ['admin-inventory-stats'],
    queryFn: async () => {
      const response = await api.get('/products/admin/inventory/stats');
      return response.data.stats;
    }
  });

  const { data: userStats } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const response = await api.get('/users/admin/stats');
      return response.data.stats;
    }
  });

  const { data: notifications } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const response = await api.get('/admin/notifications');
      return response.data.notifications;
    }
  });

  if (ordersLoading || paymentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const overview = paymentAnalytics?.overview || {};
  const totalOrders = orderAnalytics?.totalOrders || 0;
  const totalRevenue = orderAnalytics?.totalRevenue || 0;

  // Mock data for additional metrics
  const totalUsers = 1250;
  const totalProducts = 450;
  const pendingOrders = 23;
  const lowStockProducts = 12;

  const quickStats = [
    {
      name: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'green',
      description: 'This month'
    },
    {
      name: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: '+8.3%',
      changeType: 'increase',
      icon: ShoppingBag,
      color: 'blue',
      description: 'All time'
    },
    {
      name: 'Active Users',
      value: (userStats?.activeUsers || totalUsers).toLocaleString(),
      change: '+15.2%',
      changeType: 'increase',
      icon: Users,
      color: 'purple',
      description: 'Last 30 days'
    },
    {
      name: 'Products in Stock',
      value: (inventoryStats?.totalProducts || totalProducts).toLocaleString(),
      change: '+5.1%',
      changeType: 'increase',
      icon: Package,
      color: 'orange',
      description: 'Available now'
    },
    {
      name: 'Low Stock Items',
      value: (inventoryStats?.lowStockItems || lowStockProducts).toLocaleString(),
      change: '-2.1%',
      changeType: 'decrease',
      icon: AlertTriangle,
      color: 'yellow',
      description: 'Need attention'
    },
    {
      name: 'Conversion Rate',
      value: `${(overview?.conversionRate || 3.2).toFixed(1)}%`,
      change: '+0.8%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'indigo',
      description: 'This month'
    },
    {
      name: 'Avg Order Value',
      value: `₹${(overview?.avgOrderValue || 2500).toLocaleString('en-IN')}`,
      change: '+4.2%',
      changeType: 'increase',
      icon: Activity,
      color: 'pink',
      description: 'Per order'
    },
    {
      name: 'Inventory Value',
      value: `₹${(inventoryStats?.totalValue || 1250000).toLocaleString('en-IN')}`,
      change: '+7.3%',
      changeType: 'increase',
      icon: Warehouse,
      color: 'cyan',
      description: 'Total stock'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Low Stock Alert',
      message: `${lowStockProducts} products are running low on stock`,
      action: 'View Products',
      link: '/admin/products'
    },
    {
      id: 2,
      type: 'info',
      title: 'Pending Orders',
      message: `${pendingOrders} orders are pending confirmation`,
      action: 'View Orders',
      link: '/admin/orders'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <div className="relative">
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {notifications && notifications.filter(n => n.unread).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Bar */}
      {notifications && notifications.filter(n => n.unread && n.priority === 'high').length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Urgent Attention Required
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {notifications.filter(n => n.unread && n.priority === 'high')[0]?.message}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.slice(0, 8).map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.changeType === 'increase' ? TrendingUp : TrendingDown;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${
                  stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                  stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                  stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
                  stat.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/20' :
                  stat.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  stat.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-900/20' :
                  stat.color === 'pink' ? 'bg-pink-100 dark:bg-pink-900/20' :
                  'bg-cyan-100 dark:bg-cyan-900/20'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    stat.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                    stat.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                    stat.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                    stat.color === 'pink' ? 'text-pink-600 dark:text-pink-400' :
                    'text-cyan-600 dark:text-cyan-400'
                  }`} />
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {stat.description}
                </p>
              </div>

              <div className="flex items-center">
                <TrendIcon className={`w-4 h-4 mr-1 ${
                  stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                }`} />
                <span className={`text-sm ${
                  stat.changeType === 'increase'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change} from last month
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Alerts & Notifications
            </h3>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'warning' 
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {alert.message}
                    </p>
                  </div>
                  <Link
                    to={alert.link}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
                  >
                    {alert.action}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {recentOrdersLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders?.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      order.orderStatus === 'delivered' ? 'bg-green-500' :
                      order.orderStatus === 'shipped' ? 'bg-blue-500' :
                      order.orderStatus === 'processing' ? 'bg-yellow-500' :
                      order.orderStatus === 'cancelled' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.user?.name || 'Guest User'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {order.orderStatus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Link
            to="/admin/payments"
            className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Payment Analytics
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View insights
              </p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Manage Orders
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Process orders
              </p>
            </div>
          </Link>

          <Link
            to="/admin/products"
            className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Manage Products
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add/edit products
              </p>
            </div>
          </Link>

          <Link
            to="/admin/inventory"
            className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
          >
            <Warehouse className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Inventory
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stock management
              </p>
            </div>
          </Link>

          <Link
            to="/admin/reports"
            className="flex items-center space-x-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Reports
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analytics & reports
              </p>
            </div>
          </Link>

          <Link
            to="/admin/marketing"
            className="flex items-center space-x-3 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
          >
            <Star className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Marketing
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Campaigns & promos
              </p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
