import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  Check,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../hooks/useCart';
import api from '../utils/api';

// Components
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ProductCard from '../components/product/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();

  // State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [activeTab, setActiveTab] = useState('description');
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data.product;
    },
    enabled: !!id
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: ['products', 'related', product?.category],
    queryFn: async () => {
      if (!product?.category) return [];
      const response = await api.get(`/products?category=${product.category}&limit=4`);
      return response.data.products?.filter(p => p._id !== id) || [];
    },
    enabled: !!product?.category
  });

  const handleAddToCart = () => {
    addToCart({
      productId: id,
      quantity,
      variant: selectedVariants
    });
  };

  const handleQuantityChange = (change) => {
    if (!product?.stock) return;

    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleVariantChange = (variantName, optionValue) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: optionValue
    }));
  };

  const calculatePrice = () => {
    if (!product?.price) return 0;

    let basePrice = product.price;

    // Add variant price modifications
    Object.entries(selectedVariants).forEach(([variantName, optionValue]) => {
      const variant = product.variants?.find(v => v.name === variantName);
      const option = variant?.options?.find(o => o.value === optionValue);
      if (option?.price) {
        basePrice += option.price;
      }
    });

    return basePrice / 100; // Convert from paisa to rupees
  };

  const discountPercentage = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const averageRating = product?.rating?.average || 0;
  const reviewCount = product?.rating?.count || 0;

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading Product - ShopEase</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Helmet>
          <title>Product Not Found - ShopEase</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <ErrorMessage
            message="Product not found"
            onRetry={() => window.location.reload()}
          />
        </div>
      </>
    );
  }

  // Only calculate price and images after confirming product exists
  const currentPrice = calculatePrice();
  const images = product.images || [{ url: 'https://via.placeholder.com/600x600?text=No+Image', alt: product.name }];

  return (
    <>
      <Helmet>
        <title>{`${product?.name || 'Product'} - ShopEase`}</title>
        <meta name="description" content={product?.shortDescription || product?.description || ''} />
        <meta name="keywords" content={product?.tags?.join(', ') || ''} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link to="/products" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Products
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link
                to={`/products?category=${product.category}`}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {product.category}
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white font-medium">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Main Product Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                <motion.img
                  key={selectedImageIndex}
                  src={images[selectedImageIndex]?.url}
                  alt={images[selectedImageIndex]?.alt || product.name}
                  className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-300 ${
                    isImageZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Zoom Icon */}
                <button
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                  className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  <ZoomIn className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{discountPercentage}% OFF
                  </div>
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-blue-500'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Product Title & Rating */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">
                    {product.category}
                  </span>
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Heart
                      className={`w-6 h-6 transition-colors ${
                        isInWishlist(product._id)
                          ? 'text-red-500 fill-current'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    />
                  </button>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h1>

                {/* Brand */}
                {product.brand && (
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    by <span className="font-semibold">{product.brand}</span>
                  </p>
                )}

                {/* Rating */}
                {reviewCount > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {averageRating.toFixed(1)} ({reviewCount} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    ₹{currentPrice.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                      ₹{(product.originalPrice / 100).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {discountPercentage > 0 && (
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    You save ₹{((product.originalPrice - product.price) / 100).toLocaleString('en-IN')} ({discountPercentage}% off)
                  </p>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>
              )}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  {product.variants.map((variant) => (
                    <div key={variant.name}>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {variant.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleVariantChange(variant.name, option.value)}
                            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                              selectedVariants[variant.name] === option.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                          >
                            {option.value}
                            {option.price > 0 && (
                              <span className="ml-1 text-xs">
                                (+₹{(option.price / 100).toLocaleString('en-IN')})
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {product.stock > 0 ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {product.stock <= 10 ? `Only ${product.stock} left in stock` : 'In Stock'}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      Out of Stock
                    </span>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {product.stock} available
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>
                    {isAddingToCart
                      ? 'Adding to Cart...'
                      : product.stock === 0
                        ? 'Out of Stock'
                        : 'Add to Cart'
                    }
                  </span>
                </button>

                <div className="flex space-x-4">
                  <button className="flex-1 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Free Shipping</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">On orders over ₹2000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <RotateCcw className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Easy Returns</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">30-day return policy</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Secure Payment</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">100% secure checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>

                  {product.features && product.features.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Key Features
                      </h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  {product.specifications && product.specifications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {product.specifications.map((spec, index) => (
                        <div key={index} className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {spec.name}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      No specifications available for this product.
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  {reviewCount > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Customer Reviews ({reviewCount})
                        </h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.floor(averageRating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {averageRating.toFixed(1)} out of 5
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Reviews functionality will be implemented in the next phase.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No reviews yet. Be the first to review this product!
                      </p>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        Write a Review
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Related Products
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You might also like these products
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
