import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  Image,
  FileText,
  Layout,
  Settings,
  Save,
  Upload,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Star,
  Calendar
} from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('banners');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');

  const queryClient = useQueryClient();

  // Fetch content data
  const { data: bannersData, isLoading: bannersLoading } = useQuery({
    queryKey: ['content-banners'],
    queryFn: async () => {
      const response = await api.get('/content/banners');
      return response.data;
    }
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['content-categories'],
    queryFn: async () => {
      const response = await api.get('/content/categories');
      return response.data;
    }
  });

  const { data: pagesData } = useQuery({
    queryKey: ['content-pages'],
    queryFn: async () => {
      const response = await api.get('/content/pages');
      return response.data;
    }
  });

  const banners = bannersData?.banners || [];
  const categories = categoriesData?.categories || [];
  const pages = pagesData?.pages || [];

  const tabs = [
    { id: 'banners', label: 'Homepage Banners', icon: Image },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'pages', label: 'Static Pages', icon: FileText },
    { id: 'settings', label: 'Site Settings', icon: Settings }
  ];

  const previewModes = [
    { id: 'desktop', label: 'Desktop', icon: Monitor },
    { id: 'tablet', label: 'Tablet', icon: Tablet },
    { id: 'mobile', label: 'Mobile', icon: Smartphone }
  ];

  if (bannersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const renderBanners = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Homepage Banners
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Banner</span>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <motion.div
                key={banner._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-600 relative">
                  {banner.image ? (
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      banner.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {banner.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {banner.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Order: {banner.order}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Product Categories
          </h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((category) => (
                <motion.tr
                  key={category._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {category.image ? (
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={category.image}
                            alt={category.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {category.productCount || 0} products
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.isFeatured && (
                      <Star className="w-4 h-4 text-yellow-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        <Edit className="w-4 h-4" />
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

  const renderPages = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Static Pages
          </h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create Page</span>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <motion.div
                key={page._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    page.isPublished 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {page.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {page.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {page.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>/{page.slug}</span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex-1 text-center py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                    Edit
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Site Settings
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Title
              </label>
              <input
                type="text"
                defaultValue="ShopEase"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Description
              </label>
              <textarea
                rows={3}
                defaultValue="Your one-stop shop for all your needs"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                defaultValue="contact@shopease.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Logo
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload or drag and drop
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Favicon
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload favicon (32x32 px)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
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
            Content Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage website content, banners, and static pages
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {previewModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setPreviewMode(mode.id)}
                className={`p-2 rounded-lg transition-colors ${
                  previewMode === mode.id
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
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
          {activeTab === 'banners' && renderBanners()}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'pages' && renderPages()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
