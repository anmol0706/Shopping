import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Heart,
  Tag,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Cart = () => {
  const [isUpdating, setIsUpdating] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    cartItemCount,
    isLoading,
    updateCart,
    removeFromCart,
    clearCart,
    isUpdatingCart,
    isRemovingFromCart,
    isClearingCart
  } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setIsUpdating(prev => ({ ...prev, [itemId]: true }));
    updateCart({ itemId, quantity: newQuantity });

    // Clear updating state after a delay
    setTimeout(() => {
      setIsUpdating(prev => ({ ...prev, [itemId]: false }));
    }, 1000);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const calculateSubtotal = () => {
    return (cartItems || []).reduce((total, item) => total + (((item.product?.price || item.price || 0) / 100) * (item.quantity || 0)), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 20 ? 0 : 0.99; // Free shipping over ₹20
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  // Remove the user check since cart context handles both authenticated and guest users

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - ShopEase</title>
        </Helmet>

        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner size="xl" />
        </div>
      </>
    );
  }

  const isEmpty = !cartItems || cartItems.length === 0;

  return (
    <>
      <Helmet>
        <title>{`Shopping Cart (${cartItems?.length || 0}) - ShopEase`}</title>
        <meta name="description" content="Review your shopping cart and proceed to checkout." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8 mobile-content-padding">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mobile-heading">
                Shopping Cart
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
                {cartItems?.length || 0} {(cartItems?.length || 0) === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors nav-touch-target text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>

          {isEmpty ? (
            /* Empty Cart */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <ShoppingBag className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Shopping
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            /* Cart Content */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  {/* Cart Header */}
                  <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                      Cart Items
                    </h2>
                    {(cartItems?.length || 0) > 0 && (
                      <button
                        onClick={handleClearCart}
                        disabled={isClearingCart}
                        className="text-xs md:text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-50 nav-touch-target"
                      >
                        Clear Cart
                      </button>
                    )}
                  </div>

                  {/* Cart Items List */}
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <AnimatePresence>
                      {(cartItems || []).map((item) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 md:p-6"
                        >
                          <div className="flex items-start space-x-3 md:space-x-4">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100x100?text=No+Image'}
                                alt={item.product?.name}
                                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg mobile-image"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
                                <div className="flex-1">
                                  <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">
                                    <Link
                                      to={`/products/${item.product?._id}`}
                                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors nav-touch-target"
                                    >
                                      {item.product?.name}
                                    </Link>
                                  </h3>

                                  {/* Variant Info */}
                                  {item.variant && Object.keys(item.variant).length > 0 && (
                                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                      {Object.entries(item.variant).map(([key, value]) => (
                                        <span key={key} className="mr-4">
                                          {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* Stock Status */}
                                  <div className="mt-2">
                                    {(item.product?.stock || 0) > 0 ? (
                                      (item.product?.stock || 0) <= 10 ? (
                                        <span className="text-sm text-orange-600 dark:text-orange-400">
                                          Only {item.product?.stock || 0} left in stock
                                        </span>
                                      ) : (
                                        <span className="text-sm text-green-600 dark:text-green-400">
                                          In Stock
                                        </span>
                                      )
                                    ) : (
                                      <span className="text-sm text-red-600 dark:text-red-400">
                                        Out of Stock
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="text-right sm:text-left sm:mt-2">
                                  <div className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                                    ₹{((item.price || 0) / 100).toLocaleString('en-IN')}
                                  </div>
                                  {item.product?.originalPrice && item.product.originalPrice > (item.price || 0) && (
                                    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-through">
                                      ₹{((item.product.originalPrice || 0) / 100).toLocaleString('en-IN')}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Quantity Controls & Actions */}
                              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                <div className="flex items-center space-x-3">
                                  {/* Quantity Controls */}
                                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                    <button
                                      onClick={() => handleQuantityChange(item._id, (item.quantity || 0) - 1)}
                                      disabled={(item.quantity || 0) <= 1 || isUpdating[item._id]}
                                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed nav-touch-target"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>

                                    <span className="px-3 md:px-4 py-2 text-center min-w-[2.5rem] md:min-w-[3rem] text-gray-900 dark:text-white text-sm md:text-base">
                                      {isUpdating[item._id] ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                                      ) : (
                                        item.quantity || 0
                                      )}
                                    </span>

                                    <button
                                      onClick={() => handleQuantityChange(item._id, (item.quantity || 0) + 1)}
                                      disabled={(item.quantity || 0) >= (item.product?.stock || 0) || isUpdating[item._id]}
                                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed nav-touch-target"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {/* Item Total */}
                                  <div className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                                    ₹{((item.price || 0) * (item.quantity || 0)).toLocaleString('en-IN')}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => {/* Add to wishlist logic */}}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors nav-touch-target"
                                    title="Move to Wishlist"
                                  >
                                    <Heart className="w-5 h-5" />
                                  </button>

                                  <button
                                    onClick={() => handleRemoveItem(item._id)}
                                    disabled={isRemovingFromCart}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 nav-touch-target"
                                    title="Remove Item"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 sticky top-4 md:top-8">
                  <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-6">
                    Order Summary
                  </h2>

                  {/* Summary Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal ({cartItems?.length || 0} items)</span>
                      <span>₹{calculateSubtotal().toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Shipping</span>
                      <span>
                        {calculateShipping() === 0 ? (
                          <span className="text-green-600 dark:text-green-400">FREE</span>
                        ) : (
                          `₹${calculateShipping().toLocaleString('en-IN')}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>GST (18%)</span>
                      <span>₹{calculateTax().toLocaleString('en-IN')}</span>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                        <span>Total</span>
                        <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  {calculateShipping() > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                        <Truck className="w-4 h-4 mr-2" />
                        Add ₹{(2000 - calculateSubtotal()).toLocaleString('en-IN')} more for FREE shipping
                      </div>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <button
                    onClick={() => navigate('/checkout')}
                    disabled={(cartItems?.length || 0) === 0}
                    className="w-full mt-4 md:mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mobile-form-button nav-touch-target text-sm md:text-base"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>

                  {/* Security Features */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Shield className="w-4 h-4 mr-2 text-green-500" />
                      Secure checkout with SSL encryption
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <RotateCcw className="w-4 h-4 mr-2 text-blue-500" />
                      30-day return policy
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Truck className="w-4 h-4 mr-2 text-purple-500" />
                      Free shipping on orders over ₹2000
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mt-4 md:mt-6">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 mobile-form-input text-sm md:text-base"
                      />
                      <button className="px-3 md:px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors nav-touch-target text-sm md:text-base">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Products */}
          {!isEmpty && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                You might also like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* This would be populated with recommended products */}
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Recommended Product {item}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      Product description here...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ₹{(Math.random() * 50000 + 5000).toFixed(0).toLocaleString('en-IN')}
                      </span>
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Secure Payment
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your payment information is processed securely
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                  <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Fast Shipping
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Free shipping on orders over ₹2000
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-3">
                  <RotateCcw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Easy Returns
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  30-day hassle-free return policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
