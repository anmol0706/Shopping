import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const ProductCard = ({ product }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist, isAddingToWishlist } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product._id,
      quantity: 1,
      variant: null
    });
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleWishlist(product._id);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const averageRating = product.reviews?.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow w-full mobile-product-card flex-shrink-0"
    >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 product-image">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{discountPercentage}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            disabled={isAddingToWishlist}
            className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow group-hover:scale-110"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isInWishlist(product._id)
                  ? 'text-red-500 fill-current'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            />
          </button>

          {/* Product Image - Clickable */}
          <Link to={`/products/${product._id}`} className="block relative w-full h-full">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
            <img
              src={product.images?.[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image'}
              alt={product.images?.[0]?.alt || product.name}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsImageLoaded(true)}
            />
          </Link>

          {/* Overlay with Quick Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className="p-2 md:p-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed nav-touch-target"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <Link
              to={`/products/${product._id}`}
              className="p-2 md:p-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors nav-touch-target"
              title="Quick View"
            >
              <Eye className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-2 sm:p-3 md:p-4 product-info">
          {/* Category */}
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1 uppercase tracking-wide">
            {product.category}
          </div>

          {/* Product Name - Clickable */}
          <Link to={`/products/${product._id}`}>
            <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer product-title">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {product.reviews?.length > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                ({product.reviews.length})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
              <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white product-price">
                ₹{(product.price / 100).toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                  ₹{(product.originalPrice / 100).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Stock Indicator */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {product.stock > 0 ? (
                product.stock <= 10 ? (
                  <span className="text-orange-500">Only {product.stock} left</span>
                ) : (
                  <span className="text-green-500">In Stock</span>
                )
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            className="w-full py-2 px-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 sm:space-x-2 product-button"
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>
              {isAddingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </span>
          </button>
        </div>
    </motion.div>
  );
};

export default ProductCard;
