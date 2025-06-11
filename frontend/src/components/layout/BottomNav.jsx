import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Grid,
  ShoppingBag,
  Heart,
  UserCircle,
  ChevronUp
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

// Custom Cart Icon Component with count inside
const CartIconWithCount = ({ count = 0, className, isActive }) => {
  const safeCount = count || 0;
  return (
    <div className="relative">
      <ShoppingBag className={className} />
      {safeCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold ${
            isActive ? 'text-blue-600' : 'text-gray-600'
          } pointer-events-none`}
          style={{ fontSize: '10px', lineHeight: '1' }}
        >
          {safeCount > 99 ? '99+' : safeCount}
        </motion.span>
      )}
    </div>
  );
};

const BottomNav = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { cartItemCount } = useCart();
  const { user, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      isActive: isActive('/')
    },
    {
      name: 'Categories',
      path: '/products',
      icon: Grid,
      isActive: isActive('/products'),
      hasDropdown: true,
      action: () => setIsCategoryOpen(!isCategoryOpen)
    },
    {
      name: 'Cart',
      path: '/cart',
      icon: (props) => <CartIconWithCount count={cartItemCount || 0} {...props} />,
      isActive: isActive('/cart'),
      isCustomIcon: true
    },
    {
      name: 'Wishlist',
      path: '/wishlist',
      icon: Heart,
      isActive: isActive('/wishlist')
    },
    {
      name: user ? 'Profile' : 'Login',
      path: user ? '/profile' : '/login',
      icon: UserCircle,
      isActive: isActive('/profile') || isActive('/login') || isActive('/orders'),
      hasDropdown: !!user,
      action: user ? () => setIsProfileOpen(!isProfileOpen) : null
    }
  ];

  return (
    <>
      {/* Categories Modal */}
      <AnimatePresence>
        {isCategoryOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsCategoryOpen(false)}
            />
            
            {/* Categories Panel */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-20 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-200/50 z-50 md:hidden shadow-2xl rounded-t-3xl"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              <div className="px-6 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Categories</h3>
                    <p className="text-sm text-gray-500 mt-1">Browse by category</p>
                  </div>
                  <button
                    onClick={() => setIsCategoryOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronUp className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/products?category=${encodeURIComponent(category)}`}
                        className="group relative p-4 text-sm font-medium text-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-300 text-center shadow-sm hover:shadow-md transform hover:scale-105"
                        onClick={() => setIsCategoryOpen(false)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                        <span className="relative z-10">{category}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && user && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsProfileOpen(false)}
            />
            
            {/* Profile Panel */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-20 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-200/50 z-50 md:hidden shadow-2xl rounded-t-3xl"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              <div className="px-6 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Account</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {user ? `Welcome back, ${user.name || 'User'}` : 'Manage your account'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronUp className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link
                      to="/profile"
                      className="group flex items-center p-4 text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <UserCircle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Profile</span>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Link
                      to="/orders"
                      className="group flex items-center p-4 text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <ShoppingBag className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Orders</span>
                    </Link>
                  </motion.div>

                  {user?.role === 'admin' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        to="/admin"
                        className="group flex items-center p-4 text-gray-700 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 hover:text-purple-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Grid className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Admin Panel</span>
                      </Link>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <button
                      onClick={handleLogout}
                      className="group w-full flex items-center p-4 text-red-600 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl hover:from-red-100 hover:to-red-200 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <motion.div
                        className="w-5 h-5 mr-3 flex items-center justify-center"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-lg">↗</span>
                      </motion.div>
                      <span className="font-medium">Logout</span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bottom-nav-gradient backdrop-blur-xl border-t border-gray-200/50 z-30 md:hidden shadow-2xl mobile-glass-strong"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white/15 to-transparent pointer-events-none" />

        {/* Enhanced glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-50/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative flex items-center justify-around px-1 py-2 safe-area-bottom mobile-touch-friendly">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isItemActive = item.isActive;

            return (
              <motion.div
                key={item.name}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                className="relative flex-1 max-w-[75px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.hasDropdown ? (
                  <button
                    onClick={item.action}
                    className={`relative w-full flex flex-col items-center justify-center py-3 px-2 rounded-2xl transition-all duration-300 nav-touch-target mobile-touch-feedback ${
                      isItemActive
                        ? 'text-blue-600 bg-blue-50/80 shadow-lg mobile-glass-light'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 active:bg-gray-100/60'
                    }`}
                  >
                    {/* Active background glow */}
                    {isItemActive && (
                      <motion.div
                        layoutId="activeBackground"
                        className="absolute inset-0 bg-gradient-to-t from-blue-100/60 to-blue-50/40 rounded-2xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <div className="relative z-10">
                      <div className="relative mb-1">
                        {item.isCustomIcon ? (
                          <Icon
                            className={`w-7 h-7 transition-all duration-200 ${
                              isItemActive
                                ? 'scale-110 stroke-[1.5] bottom-nav-icon-active'
                                : 'stroke-[1.5] bottom-nav-icon'
                            }`}
                            isActive={isItemActive}
                          />
                        ) : (
                          <Icon className={`w-7 h-7 transition-all duration-200 ${
                            isItemActive
                              ? 'scale-110 stroke-[1.5] bottom-nav-icon-active'
                              : 'stroke-[1.5] bottom-nav-icon'
                          }`} />
                        )}
                      </div>
                      <span className={`text-xs font-medium transition-all duration-200 leading-tight ${
                        isItemActive ? 'font-semibold' : ''
                      }`}>
                        {item.name}
                      </span>
                    </div>
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`relative w-full flex flex-col items-center justify-center py-3 px-2 rounded-2xl transition-all duration-300 nav-touch-target mobile-touch-feedback ${
                      isItemActive
                        ? 'text-blue-600 bg-blue-50/80 shadow-lg mobile-glass-light'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 active:bg-gray-100/60'
                    }`}
                  >
                    {/* Active background glow */}
                    {isItemActive && (
                      <motion.div
                        layoutId="activeBackground"
                        className="absolute inset-0 bg-gradient-to-t from-blue-100/60 to-blue-50/40 rounded-2xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <div className="relative z-10">
                      <div className="relative mb-1">
                        {item.isCustomIcon ? (
                          <Icon
                            className={`w-7 h-7 transition-all duration-200 ${
                              isItemActive
                                ? 'scale-110 stroke-[1.5] bottom-nav-icon-active'
                                : 'stroke-[1.5] bottom-nav-icon'
                            }`}
                            isActive={isItemActive}
                          />
                        ) : (
                          <Icon className={`w-7 h-7 transition-all duration-200 ${
                            isItemActive
                              ? 'scale-110 stroke-[1.5] bottom-nav-icon-active'
                              : 'stroke-[1.5] bottom-nav-icon'
                          }`} />
                        )}
                      </div>
                      <span className={`text-xs font-medium transition-all duration-200 leading-tight ${
                        isItemActive ? 'font-semibold' : ''
                      }`}>
                        {item.name}
                      </span>
                    </div>
                  </Link>
                )}

                {/* Active indicator dot */}
                {isItemActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full shadow-lg"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
};

export default BottomNav;
