import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Layout Components
import Navbar from '../layout/Navbar';
import BottomNav from '../layout/BottomNav';
import Footer from '../layout/Footer';

// Pages
import Home from '../../pages/Home';
import Products from '../../pages/Products';
import ProductDetails from '../../pages/ProductDetails';
import Cart from '../../pages/Cart';
import Checkout from '../../pages/Checkout';
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import Profile from '../../pages/Profile';
import Orders from '../../pages/Orders';
import Wishlist from '../../pages/Wishlist';
import AdminPanel from '../../pages/admin/AdminPanel';
import NotFound from '../../pages/NotFound';

// Protected Route Component
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import AppLoader from './AppLoader';

const AppContent = () => {
  const { isLoading } = useAuth();

  const handleRetry = () => {
    window.location.reload();
  };

  // Show loading screen while auth is being checked
  if (isLoading) {
    return <AppLoader isLoading={isLoading} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors mobile-viewport-fix">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0 mobile-content-padding">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Checkout Route - Allow guest checkout */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav />
      <Footer />
    </div>
  );
};

export default AppContent;
