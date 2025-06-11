import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Star,
  Trash2,
  Eye,
  Share2,
  Filter,
  Grid,
  List,
  Search,
  ShoppingBag,
  ArrowRight,
  Package,
  Sparkles,
  X
} from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    wishlistItems,
    isLoading,
    removeFromWishlist,
    clearWishlist,
    isRemovingFromWishlist,
    isClearingWishlist
  } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter wishlist items
  const filteredItems = wishlistItems.filter(item => {
    const product = item.product || item;
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(wishlistItems.map(item => {
    const product = item.product || item;
    return product.category;
  }).filter(Boolean))];

  const handleAddToCart = async (product) => {
    try {
      await addToCart({
        productId: product._id,
        quantity: 1
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleClearWishlist = async () => {
    try {
      await clearWishlist();
      setShowClearConfirm(false);
      toast.success('Wishlist cleared!');
    } catch (error) {
      toast.error('Failed to clear wishlist');
    }
  };

  const handleShare = async (product) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: `${window.location.origin}/products/${product._id}`
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/products/${product._id}`);
        toast.success('Product link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Wishlist - ShopEase</title>
        <meta name="description" content="Your saved products and favorites" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        {/* Floating background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Heart className="w-4 h-4 mr-2 fill-current" />
              Your Favorites
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              My Wishlist
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Keep track of products you love and want to buy later
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          {wishlistItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8"
            >
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Left side - Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search your wishlist..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  {/* Category Filter */}
                  {categories.length > 0 && (
                    <div className="relative">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <Filter className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right side - View Mode and Actions */}
                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white text-pink-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-pink-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Clear Wishlist */}
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    disabled={isClearingWishlist}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear All</span>
                  </button>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-4 pt-4 border-t border-gray-200/50">
                <p className="text-sm text-gray-600">
                  {filteredItems.length === wishlistItems.length
                    ? `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} in your wishlist`
                    : `Showing ${filteredItems.length} of ${wishlistItems.length} items`
                  }
                </p>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          {wishlistItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center"
            >
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start adding products you love to your wishlist. You can save items for later and keep track of your favorites!
              </p>
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Items Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                No products match your search criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            </motion.div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {filteredItems.map((item, index) => {
                const product = item.product || item;
                return (
                  <WishlistItem
                    key={product._id || index}
                    product={product}
                    viewMode={viewMode}
                    index={index}
                    onAddToCart={() => handleAddToCart(product)}
                    onRemove={() => handleRemoveFromWishlist(product._id)}
                    onShare={() => handleShare(product)}
                    isAddingToCart={isAddingToCart}
                    isRemoving={isRemovingFromWishlist}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Clear Wishlist Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowClearConfirm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Clear Wishlist</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to remove all items from your wishlist? This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearWishlist}
                      disabled={isClearingWishlist}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isClearingWishlist ? 'Clearing...' : 'Clear All'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Wishlist Item Component
const WishlistItem = ({
  product,
  viewMode,
  index,
  onAddToCart,
  onRemove,
  onShare,
  isAddingToCart,
  isRemoving
}) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate(`/products/${product._id}`);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Product Image */}
            <div className="w-full sm:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={handleViewProduct}
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-pink-600 font-medium uppercase tracking-wide">
                      {product.category}
                    </p>
                    <h3
                      className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-pink-600 transition-colors"
                      onClick={handleViewProduct}
                    >
                      {product.name}
                    </h3>
                  </div>
                  <button
                    onClick={onRemove}
                    disabled={isRemoving}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <Heart className="w-5 h-5 fill-current text-pink-500" />
                  </button>
                </div>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 mr-0.5 ${
                            i < Math.floor(product.rating.average)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.rating.count} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{(product.price / 100)?.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{(product.originalPrice / 100)?.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Package className="w-3 h-3 mr-1" />
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-sm text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      <Package className="w-3 h-3 mr-1" />
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onAddToCart}
                  disabled={isAddingToCart || product.stock === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleViewProduct}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={onShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}

        {/* Wishlist Remove Button */}
        <button
          onClick={onRemove}
          disabled={isRemoving}
          className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 disabled:opacity-50"
        >
          <Heart className="w-4 h-4 fill-current text-pink-500" />
        </button>

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}

        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-contain p-4 cursor-pointer group-hover:scale-105 transition-transform duration-300"
          onClick={handleViewProduct}
        />

        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex justify-center space-x-2">
            <button
              onClick={handleViewProduct}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Eye className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={onShare}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Share2 className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="text-xs text-pink-600 font-medium mb-1 uppercase tracking-wide">
          {product.category}
        </div>

        <h3
          className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-pink-600 transition-colors"
          onClick={handleViewProduct}
        >
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 mr-0.5 ${
                    i < Math.floor(product.rating.average)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-600">
              ({product.rating.count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{(product.price / 100)?.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{(product.originalPrice / 100)?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {product.stock > 0 ? (
            <span className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Package className="w-3 h-3 mr-1" />
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
              <Package className="w-3 h-3 mr-1" />
              Out of Stock
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          disabled={isAddingToCart || product.stock === 0}
          className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isAddingToCart ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </div>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Wishlist;
