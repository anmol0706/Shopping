import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [localCart, setLocalCart] = useState([]);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setLocalCart(Array.isArray(parsedCart) ? parsedCart : []);
      } catch (error) {
        console.warn('Failed to parse cart from localStorage:', error);
        setLocalCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(localCart));
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error);
    }
  }, [localCart]);

  // Fetch cart from server for authenticated users
  const { data: serverCart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const response = await api.get('/cart');
        return response.data.cart;
      } catch (error) {
        console.warn('Failed to fetch cart:', error.message);
        return { items: [], totalAmount: 0, totalItems: 0 };
      }
    },
    enabled: !!user
  });

  // Sync local cart with server
  const syncCartMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/cart/sync', { items: localCart });
      return response.data;
    },
    onSuccess: () => {
      setLocalCart([]);
      queryClient.invalidateQueries(['cart']);
    }
  });

  // Sync local cart with server when user logs in and has local items
  useEffect(() => {
    if (user && serverCart && localCart.length > 0) {
      syncCartMutation.mutate();
    }
  }, [user, serverCart, localCart.length, syncCartMutation]);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1, variant = null }) => {
      if (user) {
        const response = await api.post('/cart/add', { productId, quantity, variant });
        return response.data;
      } else {
        // For local cart, fetch product data
        const productResponse = await api.get(`/products/${productId}`);
        const product = productResponse.data.product;

        return {
          _id: `local_${productId}_${Date.now()}`,
          productId,
          quantity,
          variant,
          product,
          price: product.price
        };
      }
    },
    onSuccess: (data, variables) => {
      if (user) {
        queryClient.invalidateQueries(['cart']);
        toast.success('Item added to cart!');
      } else {
        // Update local cart
        setLocalCart(prev => {
          const existingItem = prev.find(item =>
            item.productId === variables.productId &&
            JSON.stringify(item.variant) === JSON.stringify(variables.variant)
          );

          if (existingItem) {
            return prev.map(item =>
              item.productId === variables.productId &&
              JSON.stringify(item.variant) === JSON.stringify(variables.variant)
                ? { ...item, quantity: item.quantity + variables.quantity }
                : item
            );
          } else {
            return [...prev, data];
          }
        });
        toast.success('Item added to cart!');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
    }
  });

  // Update cart item mutation
  const updateCartMutation = useMutation({
    mutationFn: async ({ itemId, quantity }) => {
      if (user) {
        const response = await api.put(`/cart/update/${itemId}`, { quantity });
        return response.data;
      } else {
        return { itemId, quantity };
      }
    },
    onSuccess: (data, variables) => {
      if (user) {
        queryClient.invalidateQueries(['cart']);
      } else {
        setLocalCart(prev =>
          prev.map(item =>
            item._id === variables.itemId
              ? { ...item, quantity: variables.quantity }
              : item
          )
        );
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId) => {
      if (user) {
        const response = await api.delete(`/cart/remove/${itemId}`);
        return response.data;
      } else {
        return { itemId };
      }
    },
    onSuccess: (data, itemId) => {
      if (user) {
        queryClient.invalidateQueries(['cart']);
        toast.success('Item removed from cart');
      } else {
        setLocalCart(prev => prev.filter(item => item._id !== itemId));
        toast.success('Item removed from cart');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (user) {
        const response = await api.delete('/cart/clear');
        return response.data;
      } else {
        return {};
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries(['cart']);
      } else {
        setLocalCart([]);
      }
      toast.success('Cart cleared');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    }
  });

  // Get cart items (server cart for authenticated users, local cart for guests)
  const cartItems = user ? (serverCart?.items || []) : (localCart || []);

  // Calculate cart totals
  const cartTotal = user ? (serverCart?.totalAmount || 0) : (cartItems || []).reduce((total, item) => {
    const price = item.product?.price || item.price || 0;
    return total + (price * item.quantity);
  }, 0);

  const cartItemCount = Math.max(0, user ? (serverCart?.totalItems || 0) : (cartItems || []).reduce((total, item) => total + (item.quantity || 0), 0));

  const value = {
    cartItems,
    cartTotal,
    cartItemCount,
    isLoading,
    addToCart: addToCartMutation.mutate,
    updateCart: updateCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingCart: updateCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
