import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [localWishlist, setLocalWishlist] = useState([]);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        setLocalWishlist(Array.isArray(parsedWishlist) ? parsedWishlist : []);
      } catch (error) {
        console.warn('Failed to parse wishlist from localStorage:', error);
        setLocalWishlist([]);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(localWishlist));
    } catch (error) {
      console.warn('Failed to save wishlist to localStorage:', error);
    }
  }, [localWishlist]);

  // Fetch wishlist from server for authenticated users
  const { data: serverWishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      try {
        const response = await api.get('/wishlist');
        return response.data.items;
      } catch (error) {
        console.warn('Failed to fetch wishlist:', error.message);
        return [];
      }
    },
    enabled: !!user
  });

  // Sync local wishlist with server
  const syncWishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/wishlist/sync', { items: localWishlist });
      return response.data;
    },
    onSuccess: () => {
      setLocalWishlist([]);
      queryClient.invalidateQueries(['wishlist']);
    }
  });

  // Sync local wishlist with server when user logs in and has local items
  useEffect(() => {
    if (user && serverWishlist && localWishlist.length > 0) {
      syncWishlistMutation.mutate();
    }
  }, [user, serverWishlist, localWishlist.length]);

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId) => {
      if (user) {
        const response = await api.post('/wishlist/add', { productId });
        return response.data;
      } else {
        return { productId };
      }
    },
    onSuccess: (data, productId) => {
      if (user) {
        queryClient.invalidateQueries(['wishlist']);
        toast.success('Added to wishlist!');
      } else {
        setLocalWishlist(prev => {
          if (!prev.includes(productId)) {
            return [...prev, productId];
          }
          return prev;
        });
        toast.success('Added to wishlist!');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId) => {
      if (user) {
        const response = await api.delete(`/wishlist/remove/${productId}`);
        return response.data;
      } else {
        return { productId };
      }
    },
    onSuccess: (data, productId) => {
      if (user) {
        queryClient.invalidateQueries(['wishlist']);
        toast.success('Removed from wishlist');
      } else {
        setLocalWishlist(prev => prev.filter(id => id !== productId));
        toast.success('Removed from wishlist');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  });

  // Clear wishlist mutation
  const clearWishlistMutation = useMutation({
    mutationFn: async () => {
      if (user) {
        const response = await api.delete('/wishlist/clear');
        return response.data;
      } else {
        return {};
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries(['wishlist']);
      } else {
        setLocalWishlist([]);
      }
      toast.success('Wishlist cleared');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to clear wishlist');
    }
  });

  // Get wishlist items (server wishlist for authenticated users, local wishlist for guests)
  const wishlistItems = user ? (serverWishlist || []) : localWishlist;

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    if (user) {
      return wishlistItems.some(item => item.product?._id === productId || item.productId === productId);
    } else {
      return localWishlist.includes(productId);
    }
  };

  // Toggle wishlist item
  const toggleWishlist = (productId) => {
    if (isInWishlist(productId)) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
    }
  };

  const value = {
    wishlistItems,
    isLoading,
    isInWishlist,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    clearWishlist: clearWishlistMutation.mutate,
    toggleWishlist,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
    isClearingWishlist: clearWishlistMutation.isPending,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
