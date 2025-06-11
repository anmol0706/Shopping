import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  BarChart3,
  CreditCard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  TrendingUp,
  DollarSign,
  Activity,
  PieChart,
  Warehouse,
  FileText,
  Megaphone,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Bell,
  Menu,
  X
} from 'lucide-react';

// Admin Components
import PaymentAnalytics from './PaymentAnalytics';
import OrderManagement from './OrderManagement';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import AdminDashboard from './AdminDashboard';
import SettingsPage from './Settings';
import InventoryManagement from './InventoryManagement';
import ReportsAnalytics from './ReportsAnalytics';
import MarketingPanel from './MarketingPanel';
import ContentManagement from './ContentManagement';

const AdminPanel = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [notifications] = useState([
    { id: 1, message: 'New order received', type: 'info', unread: true },
    { id: 2, message: 'Low stock alert: iPhone 14', type: 'warning', unread: true },
    { id: 3, message: 'Payment failed for order #1234', type: 'error', unread: true }
  ]);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      current: location.pathname === '/admin'
    },
    {
      name: 'Sales',
      icon: TrendingUp,
      children: [
        {
          name: 'Orders',
          href: '/admin/orders',
          current: location.pathname === '/admin/orders'
        },
        {
          name: 'Payment Analytics',
          href: '/admin/payments',
          current: location.pathname === '/admin/payments'
        },
        {
          name: 'Reports',
          href: '/admin/reports',
          current: location.pathname === '/admin/reports'
        }
      ]
    },
    {
      name: 'Catalog',
      icon: Package,
      children: [
        {
          name: 'Products',
          href: '/admin/products',
          current: location.pathname === '/admin/products'
        },
        {
          name: 'Inventory',
          href: '/admin/inventory',
          current: location.pathname === '/admin/inventory'
        }
      ]
    },
    {
      name: 'Marketing',
      icon: Megaphone,
      children: [
        {
          name: 'Campaigns',
          href: '/admin/marketing',
          current: location.pathname === '/admin/marketing'
        }
      ]
    },
    {
      name: 'Content',
      icon: FolderOpen,
      children: [
        {
          name: 'Manage Content',
          href: '/admin/content',
          current: location.pathname === '/admin/content'
        }
      ]
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      current: location.pathname === '/admin/users'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname === '/admin/settings'
    }
  ];

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  return (
    <>
      <Helmet>
        <title>Admin Panel - ShopEase</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex-shrink-0`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              {isSidebarOpen && (
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Admin Panel
                </h1>
              )}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isExpanded = expandedMenus[item.name];

                if (item.children) {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          {isSidebarOpen && (
                            <span className="font-medium">{item.name}</span>
                          )}
                        </div>
                        {isSidebarOpen && (
                          isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )
                        )}
                      </button>

                      {isSidebarOpen && isExpanded && (
                        <div className="ml-6 mt-2 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.href}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                child.current
                                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                              }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      item.current
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            {isSidebarOpen && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ShopEase Admin v1.0
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header with Notifications */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {location.pathname === '/admin' ? 'Dashboard' :
                   location.pathname.split('/').pop().charAt(0).toUpperCase() +
                   location.pathname.split('/').pop().slice(1)}
                </h2>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    {notifications.filter(n => n.unread).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.filter(n => n.unread).length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="payments" element={<PaymentAnalytics />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="reports" element={<ReportsAnalytics />} />
              <Route path="marketing" element={<MarketingPanel />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
