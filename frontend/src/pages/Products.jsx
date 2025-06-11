import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  SortAsc,
  ChevronDown,
  X,
  Tag,
  DollarSign,
  SlidersHorizontal,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

// Components
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    priceRange: '',
  });

  // Mobile filter state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Build query string
  const buildQueryString = () => {
    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    params.append('page', currentPage.toString());
    params.append('limit', '12'); // 12 products per page

    return params.toString();
  };

  // Fetch products
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', filters, sortBy, sortOrder, currentPage],
    queryFn: async () => {
      const queryString = buildQueryString();
      const response = await api.get(`/products?${queryString}`);
      return response.data;
    }
  });

  // Update filters when URL changes
  useEffect(() => {
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    let priceRange = '';

    // Determine price range based on min/max values
    if (minPrice && maxPrice) {
      priceRange = `${minPrice}-${maxPrice}`;
    } else if (minPrice && !maxPrice) {
      priceRange = `${minPrice}-`;
    } else if (!minPrice && maxPrice) {
      priceRange = `0-${maxPrice}`;
    }

    setFilters({
      category: searchParams.get('category') || '',
      minPrice,
      maxPrice,
      priceRange,
    });
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      priceRange: '',
    });
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty',
    'Toys',
    'Automotive',
    'Health',
    'Food & Beverages'
  ];

  return (
    <>
      <Helmet>
        <title>Products - ShopEase</title>
        <meta name="description" content="Browse our wide selection of quality products at great prices." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mobile-content-padding">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4 mobile-heading">
              Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Discover amazing products at unbeatable prices
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Products Grid */}
            <div className="flex-1">
              {/* Combined Filter and Results Toolbar */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 md:mb-6">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden p-3 md:p-4 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="flex items-center justify-between w-full text-left nav-touch-target"
                  >
                    <div className="flex items-center space-x-2">
                      <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">Filters & Sort</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Single Row - All Filters and Controls */}
                <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
                  <div className="p-3 md:p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                      {/* Left Side - Filters and Results */}
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6">
                        {/* Category Dropdown */}
                        <div className="w-full sm:w-44 md:w-48">
                          <div className="relative">
                            <select
                              value={filters.category}
                              onChange={(e) => {
                                console.log('Category changed:', e.target.value);
                                handleFilterChange('category', e.target.value);
                              }}
                              className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer mobile-form-input text-sm md:text-base"
                            >
                              <option value="">All Categories</option>
                              {categories.map(category => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </div>
                          </div>
                        </div>

                        {/* Price Range Dropdown */}
                        <div className="w-full sm:w-44 md:w-48">
                          <div className="relative">
                            <select
                              value={filters.priceRange}
                              onChange={(e) => {
                                console.log('Price range changed:', e.target.value);
                                const [minPrice, maxPrice] = e.target.value.split('-');
                                handleFilterChange('minPrice', minPrice || '');
                                handleFilterChange('maxPrice', maxPrice || '');
                                handleFilterChange('priceRange', e.target.value);
                              }}
                              className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer mobile-form-input text-sm md:text-base"
                            >
                              <option value="">All Prices</option>
                              <option value="0-1000">Under ₹1,000</option>
                              <option value="1000-5000">₹1,000 - ₹5,000</option>
                              <option value="5000-10000">₹5,000 - ₹10,000</option>
                              <option value="10000-25000">₹10,000 - ₹25,000</option>
                              <option value="25000-50000">₹25,000 - ₹50,000</option>
                              <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                              <option value="100000-">Above ₹1,00,000</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </div>
                          </div>
                        </div>

                        {/* Clear Filters Button */}
                        {(filters.category || filters.priceRange) && (
                          <button
                            onClick={clearFilters}
                            className="flex items-center space-x-2 px-3 md:px-4 py-2.5 md:py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 whitespace-nowrap nav-touch-target text-sm md:text-base"
                          >
                            <X className="w-4 h-4" />
                            <span className="font-medium">Clear All</span>
                          </button>
                        )}

                        {/* Results Count and Filter Indicators */}
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            <span className="font-medium text-gray-900 dark:text-white">{data?.pagination?.total || 0}</span> products found
                            {data?.pagination && (
                              <span className="ml-2">
                                (Page {data.pagination.page} of {data.pagination.pages})
                              </span>
                            )}
                          </div>
                          {(filters.category || filters.priceRange) && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">Filtered by:</span>
                              <div className="flex flex-wrap gap-1">
                                {filters.category && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                    {filters.category}
                                    <button
                                      onClick={() => handleFilterChange('category', '')}
                                      className="ml-1 hover:text-blue-600 dark:hover:text-blue-200"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                )}
                                {filters.priceRange && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                    {filters.priceRange === '0-1000' && 'Under ₹1,000'}
                                    {filters.priceRange === '1000-5000' && '₹1,000 - ₹5,000'}
                                    {filters.priceRange === '5000-10000' && '₹5,000 - ₹10,000'}
                                    {filters.priceRange === '10000-25000' && '₹10,000 - ₹25,000'}
                                    {filters.priceRange === '25000-50000' && '₹25,000 - ₹50,000'}
                                    {filters.priceRange === '50000-100000' && '₹50,000 - ₹1,00,000'}
                                    {filters.priceRange === '100000-' && 'Above ₹1,00,000'}
                                    <button
                                      onClick={() => {
                                        handleFilterChange('minPrice', '');
                                        handleFilterChange('maxPrice', '');
                                        handleFilterChange('priceRange', '');
                                      }}
                                      className="ml-1 hover:text-green-600 dark:hover:text-green-200"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Side - Sort */}
                      <div className="flex items-center space-x-4">
                        {/* Sort Dropdown */}
                        <div className="relative">
                          <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                              console.log('Sort changed:', e.target.value);
                              const [field, order] = e.target.value.split('-');
                              setSortBy(field);
                              setSortOrder(order);
                              setCurrentPage(1); // Reset to first page when sorting changes
                            }}
                            className="px-3 md:px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-8 whitespace-nowrap mobile-form-input text-sm md:text-base"
                          >
                            <option value="name-asc">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                            <option value="price-asc">Price Low to High</option>
                            <option value="price-desc">Price High to Low</option>
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <SortAsc className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : error ? (
                <ErrorMessage 
                  message="Failed to load products" 
                  onRetry={refetch}
                />
              ) : data?.products?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No products found matching your criteria.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors nav-touch-target mobile-form-button text-sm md:text-base"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                >
                  {data?.products?.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </motion.div>
              )}

              {/* Pagination */}
              {data?.pagination && data.pagination.pages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center space-x-2">
                      {/* Previous Button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 nav-touch-target ${
                          currentPage === 1
                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((page) => {
                          // Show first page, last page, current page, and pages around current page
                          const showPage =
                            page === 1 ||
                            page === data.pagination.pages ||
                            Math.abs(page - currentPage) <= 1;

                          if (!showPage) {
                            // Show ellipsis for gaps
                            if (page === 2 && currentPage > 4) {
                              return (
                                <span key={page} className="px-2 py-1 text-gray-500 dark:text-gray-400">
                                  ...
                                </span>
                              );
                            }
                            if (page === data.pagination.pages - 1 && currentPage < data.pagination.pages - 3) {
                              return (
                                <span key={page} className="px-2 py-1 text-gray-500 dark:text-gray-400">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 nav-touch-target ${
                                page === currentPage
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === data.pagination.pages}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 nav-touch-target ${
                          currentPage === data.pagination.pages
                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>

                    {/* Page Info */}
                    <div className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
                      Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, data.pagination.total)} of {data.pagination.total} products
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
