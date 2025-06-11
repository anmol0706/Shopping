import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Plus, Search, Filter, Edit, Trash2, Eye, Star, IndianRupee, X, Upload, Image as ImageIcon, Link as LinkIcon, Camera, Trash, Check, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [addFormData, setAddFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    category: '',
    subcategory: '',
    sku: '',
    isActive: true,
    isFeatured: false,
    images: [],
    specifications: [],
    features: [],
    tags: [],
    imageUrl: ''
  });
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteType, setDeleteType] = useState('soft'); // 'soft' or 'permanent'

  const queryClient = useQueryClient();

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      return response.data;
    },
    onSuccess: (data) => {
      const newImage = {
        url: data.url,
        alt: addFormData.name || 'Product image',
        isPrimary: uploadedImages.length === 0,
        public_id: data.public_id
      };

      setUploadedImages(prev => [...prev, newImage]);
      setAddFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
      setIsUploading(false);
      setUploadProgress(0);
    },
    onError: (error) => {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  });

  // Multiple images upload mutation
  const uploadMultipleImagesMutation = useMutation({
    mutationFn: async (files) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post('/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      return response.data;
    },
    onSuccess: (data) => {
      const newImages = data.images.map((img, index) => ({
        url: img.url,
        alt: `${addFormData.name || 'Product'} image ${uploadedImages.length + index + 1}`,
        isPrimary: uploadedImages.length === 0 && index === 0,
        public_id: img.public_id
      }));

      setUploadedImages(prev => [...prev, ...newImages]);
      setAddFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
      setIsUploading(false);
      setUploadProgress(0);
    },
    onError: (error) => {
      console.error('Multiple images upload failed:', error);
      alert('Failed to upload images. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData) => {
      const response = await api.post('/products', productData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['admin-products']);
      setShowAddModal(false);
      setAddFormData({
        name: '',
        brand: '',
        description: '',
        price: '',
        originalPrice: '',
        stock: '',
        category: '',
        subcategory: '',
        sku: '',
        isActive: true,
        isFeatured: false,
        images: [],
        specifications: [],
        features: [],
        tags: [],
        imageUrl: ''
      });
      setUploadedImages([]);
      setUploadMethod('url');
      alert(`Product "${data.product.name}" created successfully!`);
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create product. Please try again.';
      alert(errorMessage);
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async ({ productId, permanent = false }) => {
      const endpoint = permanent ? `/products/${productId}/permanent` : `/products/${productId}`;
      const response = await api.delete(endpoint);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['admin-products']);
      setShowDeleteModal(false);
      setProductToDelete(null);
      setDeleteType('soft');
      const message = variables.permanent ? 'Product permanently deleted!' : 'Product deleted successfully!';
      alert(message);
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ productId, updateData }) => {
      const response = await api.put(`/products/${productId}`, updateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      setShowEditModal(false);
      setSelectedProduct(null);
      setEditFormData({});
      alert('Product updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  });

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['admin-products', currentPage, categoryFilter, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', '20');
      if (categoryFilter) params.append('category', categoryFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await api.get(`/products/admin/all?${params}`);
      return response.data;
    }
  });

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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price / 100, // Convert from paise to rupees
      originalPrice: product.originalPrice ? product.originalPrice / 100 : '',
      stock: product.stock,
      category: product.category,
      subcategory: product.subcategory,
      isActive: product.isActive,
      isFeatured: product.isFeatured || false
    });
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
    setUploadedImages([]);
    setUploadMethod('url');
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      alert('Please select only image files.');
      return;
    }

    // Validate file sizes (10MB max per file)
    const oversizedFiles = validFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Some files are too large. Maximum file size is 10MB.');
      return;
    }

    setIsUploading(true);

    if (validFiles.length === 1) {
      uploadImageMutation.mutate(validFiles[0]);
    } else {
      uploadMultipleImagesMutation.mutate(validFiles);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('Please drop only image files.');
      return;
    }

    const event = { target: { files: imageFiles } };
    handleFileUpload(event);
  };

  // Remove uploaded image
  const removeUploadedImage = (index) => {
    const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newUploadedImages);
    setAddFormData(prev => ({
      ...prev,
      images: newUploadedImages
    }));
  };

  // Set primary image
  const setPrimaryImage = (index) => {
    const newImages = uploadedImages.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setUploadedImages(newImages);
    setAddFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!addFormData.name || !addFormData.description || !addFormData.category || !addFormData.price || !addFormData.stock) {
      alert('Please fill in all required fields (Name, Description, Category, Price, Stock)');
      return;
    }

    // Validate price and stock are positive numbers
    if (parseFloat(addFormData.price) <= 0) {
      alert('Price must be greater than 0');
      return;
    }

    if (parseInt(addFormData.stock) < 0) {
      alert('Stock cannot be negative');
      return;
    }

    // Validate original price if provided
    if (addFormData.originalPrice && parseFloat(addFormData.originalPrice) <= parseFloat(addFormData.price)) {
      alert('Original price should be greater than current price');
      return;
    }

    // Generate SKU if not provided
    const sku = addFormData.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Prepare images array
    let finalImages = [];

    // Use uploaded images if available
    if (uploadedImages.length > 0) {
      finalImages = uploadedImages;
    }
    // Use URL method if provided
    else if (addFormData.imageUrl) {
      finalImages = [{
        url: addFormData.imageUrl,
        alt: addFormData.name,
        isPrimary: true
      }];
    }
    // Use default placeholder
    else {
      finalImages = [{
        url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
        alt: addFormData.name,
        isPrimary: true
      }];
    }

    // Prepare product data
    const productData = {
      ...addFormData,
      price: Math.round(addFormData.price * 100), // Convert to paise
      originalPrice: addFormData.originalPrice ? Math.round(addFormData.originalPrice * 100) : null,
      stock: parseInt(addFormData.stock),
      sku,
      images: finalImages
    };

    createProductMutation.mutate(productData);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!editFormData.name || !editFormData.price || !editFormData.stock) {
      alert('Please fill in all required fields (Name, Price, Stock)');
      return;
    }

    // Prepare update data
    const updateData = {
      ...editFormData,
      price: Math.round(editFormData.price * 100), // Convert to paise
      originalPrice: editFormData.originalPrice ? Math.round(editFormData.originalPrice * 100) : null,
      stock: parseInt(editFormData.stock)
    };

    updateProductMutation.mutate({
      productId: selectedProduct._id,
      updateData
    });
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProductMutation.mutate({
        productId: productToDelete._id,
        permanent: deleteType === 'permanent'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading products: {error.message}</p>
        </div>
      </div>
    );
  }

  const { products = [], pagination = {} } = productsData || {};

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Product Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your product catalog and inventory
          </p>
        </div>

        <button
          onClick={handleAddProduct}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </form>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center"
        >
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Products Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {searchTerm || categoryFilter
              ? 'No products match your current filters. Try adjusting your search criteria.'
              : 'Start building your product catalog by adding your first product.'
            }
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Products Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {products.map((product) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center'}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {product.brand}
                            </div>
                            {product.isFeatured && (
                              <div className="flex items-center mt-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-yellow-600 dark:text-yellow-400 ml-1">
                                  Featured
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {product.category}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.subcategory}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <IndianRupee className="w-3 h-3 mr-1" />
                          {(product.price / 100).toLocaleString('en-IN')}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 line-through">
                            <IndianRupee className="w-2 h-2 mr-1" />
                            {(product.originalPrice / 100).toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {product.stock}
                        </div>
                        {product.stock < 10 && (
                          <div className="text-xs text-red-600 dark:text-red-400">
                            Low stock
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="View Product"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete Product"
                          >
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

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow-sm">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} products
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-md">
                  {currentPage} of {pagination.pages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Product Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Product Images */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedProduct.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedProduct.name}</p>
                    <p><span className="font-medium">Brand:</span> {selectedProduct.brand}</p>
                    <p><span className="font-medium">SKU:</span> {selectedProduct.sku}</p>
                    <p><span className="font-medium">Category:</span> {selectedProduct.category}</p>
                    <p><span className="font-medium">Subcategory:</span> {selectedProduct.subcategory}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pricing & Stock</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Price:</span> ₹{(selectedProduct.price / 100).toLocaleString('en-IN')}</p>
                    {selectedProduct.originalPrice && (
                      <p><span className="font-medium">Original Price:</span> ₹{(selectedProduct.originalPrice / 100).toLocaleString('en-IN')}</p>
                    )}
                    <p><span className="font-medium">Stock:</span> {selectedProduct.stock}</p>
                    <p><span className="font-medium">Status:</span>
                      <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                        selectedProduct.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedProduct.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                    {selectedProduct.isFeatured && (
                      <p><span className="font-medium">Featured:</span>
                        <span className="ml-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Yes
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedProduct.description}</p>
              </div>

              {/* Specifications */}
              {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedProduct.specifications.map((spec, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{spec.name}:</span> {spec.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Product
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={editFormData.brand || ''}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Category Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editFormData.category || ''}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Sports">Sports</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Toys">Toys</option>
                    <option value="Automotive">Automotive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    name="subcategory"
                    value={editFormData.subcategory || ''}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price || ''}
                    onChange={handleFormChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={editFormData.originalPrice || ''}
                    onChange={handleFormChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={editFormData.stock || ''}
                  onChange={handleFormChange}
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editFormData.description || ''}
                  onChange={handleFormChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Status Toggles */}
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={editFormData.isActive || false}
                    onChange={handleFormChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={editFormData.isFeatured || false}
                    onChange={handleFormChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Featured
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProductMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateProductMutation.isLoading ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Product
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={addFormData.name}
                    onChange={handleAddFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={addFormData.brand}
                    onChange={handleAddFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter brand name"
                  />
                </div>
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  name="sku"
                  value={addFormData.sku}
                  onChange={handleAddFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Auto-generated if left empty"
                />
              </div>

              {/* Category Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={addFormData.category}
                    onChange={handleAddFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    name="subcategory"
                    value={addFormData.subcategory}
                    onChange={handleAddFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter subcategory"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={addFormData.price}
                    onChange={handleAddFormChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={addFormData.originalPrice}
                    onChange={handleAddFormChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={addFormData.stock}
                  onChange={handleAddFormChange}
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={addFormData.description}
                  onChange={handleAddFormChange}
                  rows="4"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter product description"
                />
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Product Images
                </label>

                {/* Upload Method Selector */}
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('file')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      uploadMethod === 'file'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Files</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      uploadMethod === 'url'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Image URL</span>
                  </button>
                </div>

                {/* File Upload Method */}
                {uploadMethod === 'file' && (
                  <div className="space-y-4">
                    <div
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploading}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center space-y-2">
                          <Camera className="w-12 h-12 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PNG, JPG, JPEG up to 10MB each
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}

                {/* URL Method */}
                {uploadMethod === 'url' && (
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <input
                        type="url"
                        name="imageUrl"
                        value={addFormData.imageUrl || ''}
                        onChange={(e) => {
                          const imageUrl = e.target.value;
                          setAddFormData(prev => ({
                            ...prev,
                            imageUrl
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Enter a direct URL to the product image
                      </p>
                    </div>
                    {addFormData.imageUrl && (
                      <div className="w-20 h-20 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                        <img
                          src={addFormData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Uploaded Images ({uploadedImages.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Image Controls */}
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(index)}
                              className={`p-1 rounded-full ${
                                image.isPrimary
                                  ? 'bg-green-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                              title={image.isPrimary ? 'Primary Image' : 'Set as Primary'}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(index)}
                              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              title="Remove Image"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Primary Badge */}
                          {image.isPrimary && (
                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Toggles */}
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={addFormData.isActive}
                    onChange={handleAddFormChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={addFormData.isFeatured}
                    onChange={handleAddFormChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Featured
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProductMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createProductMutation.isLoading ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Delete Product
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete "{productToDelete.name}"?
              </p>

              {/* Delete Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Delete Type:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deleteType"
                      value="soft"
                      checked={deleteType === 'soft'}
                      onChange={(e) => setDeleteType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Soft Delete (Hide from users, can be restored)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deleteType"
                      value="permanent"
                      checked={deleteType === 'permanent'}
                      onChange={(e) => setDeleteType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-red-600 dark:text-red-400">
                      Permanent Delete (Cannot be undone)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteType('soft');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteProductMutation.isLoading}
                  className={`flex-1 px-4 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                    deleteType === 'permanent'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  {deleteProductMutation.isLoading
                    ? 'Deleting...'
                    : deleteType === 'permanent'
                      ? 'Delete Permanently'
                      : 'Delete'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
