import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Layout Components
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import AdminPanel from './pages/admin/AdminPanel';
import NotFound from './pages/NotFound';


// Providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { StripeProvider } from './contexts/StripeContext';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onError: (error) => {
        // Only log errors in development
        if (import.meta.env.DEV) {
          console.error('Query error:', error);
        }
      },
    },
    mutations: {
      onError: (error) => {
        // Only log errors in development
        if (import.meta.env.DEV) {
          console.error('Mutation error:', error);
        }
      },
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <StripeProvider>
                  <Router
                    future={{
                      v7_startTransition: true,
                      v7_relativeSplatPath: true
                    }}
                  >
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

                  {/* Toast Notifications */}
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: 'var(--toast-bg)',
                        color: 'var(--toast-color)',
                      },
                    }}
                  />
                </Router>
                </StripeProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;