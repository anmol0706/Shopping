import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { checkBackendHealth } from '../utils/healthCheck';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Add a maximum loading time to prevent infinite loading
  useEffect(() => {
    const maxLoadingTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 15000); // Maximum 15 seconds loading time

    return () => clearTimeout(maxLoadingTimeout);
  }, [isLoading]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if backend is accessible
        const isBackendHealthy = await checkBackendHealth();

        if (!isBackendHealthy) {
          // Backend is not accessible, skip auth check but don't show error
          if (import.meta.env.DEV) {
            console.warn('Backend not accessible, skipping auth check');
          }
          return;
        }

        const token = localStorage.getItem('token');
        if (token) {
          // Add a shorter timeout for the auth check
          const response = await api.get('/auth/me', { timeout: 8000 });
          setUser(response.data.user);
        }
      } catch (error) {
        // Only remove token if it's an auth error, not a network error
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
        // Only log in development to reduce console noise
        if (import.meta.env.DEV) {
          console.warn('Auth check failed:', error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to allow the app to render first
    const timeoutId = setTimeout(checkAuth, 200);

    return () => clearTimeout(timeoutId);
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Login successful!');
      queryClient.invalidateQueries(['cart']);
      queryClient.invalidateQueries(['wishlist']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post('/auth/register', userData);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Registration successful!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  });

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    queryClient.clear();
    toast.success('Logged out successfully');
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Profile update failed');
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData) => {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Password change failed');
    }
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset email sent!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    }
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password }) => {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset successful!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Password reset failed');
    }
  });

  const value = {
    user,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isUpdateProfileLoading: updateProfileMutation.isPending,
    isChangePasswordLoading: changePasswordMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
