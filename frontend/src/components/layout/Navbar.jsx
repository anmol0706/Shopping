import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { cartItemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty',
    'Toys',
    'Automotive'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 md:block mobile-glass">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Mobile Optimized */}
          <Link to="/" className="flex items-center space-x-2 nav-touch-target">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600"
            >
              ShopEase
            </motion.div>
          </Link>

          {/* Mobile Search Bar - Only on mobile */}
          <div className="flex-1 max-w-md mx-4 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  >
                    {categories.map((category) => (
                      <Link
                        key={category}
                        to={`/products?category=${encodeURIComponent(category)}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsCategoryOpen(false)}
                      >
                        {category}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Products
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>



          {/* Desktop Right Side Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {(cartItemCount || 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {(cartItemCount || 0) > 99 ? '99+' : (cartItemCount || 0)}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:block">{user.name || 'User'}</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:block">Login</span>
                </Link>
              )}

              <AnimatePresence>
                {isProfileOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>


        </div>


      </div>
    </nav>
  );
};

export default Navbar;
