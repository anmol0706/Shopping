import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Lock,
  Truck,
  Shield,
  Clock,
  User,
  Mail,
  Phone,
  Home,
  Building,
  AlertCircle,
  Check
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../contexts/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

// Components
import LoadingSpinner from '../components/common/LoadingSpinner';
import StripePaymentForm from '../components/payment/StripePaymentForm';
import RazorpayPaymentForm from '../components/payment/RazorpayPaymentForm';

// Services
import paymentService from '../services/paymentService';
import razorpayService from '../services/razorpayService';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartTotal, cartItemCount, clearCart } = useCart();
  const queryClient = useQueryClient();

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Stripe payment state
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);

  // Razorpay payment state
  const [isCreatingRazorpayOrder, setIsCreatingRazorpayOrder] = useState(false);

  // Address form state
  const [addressForm, setAddressForm] = useState({
    type: 'home',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false
  });

  // Guest checkout form
  const [guestForm, setGuestForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const steps = [
    { id: 1, name: 'Shipping', icon: MapPin },
    { id: 2, name: 'Payment', icon: CreditCard },
    { id: 3, name: 'Review', icon: ShoppingBag },
    { id: 4, name: 'Confirmation', icon: CheckCircle }
  ];

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItemCount === 0) {
      navigate('/cart');
    }
  }, [cartItemCount, navigate]);

  // Fetch user addresses
  const { data: addresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await api.get('/user/addresses');
      return response.data.addresses;
    },
    enabled: !!user
  });

  // Auto-select default address
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses, selectedAddress]);

  // Calculate totals
  const subtotal = cartTotal || 0;
  const gstRate = 0.18; // 18% GST
  const gstAmount = subtotal * gstRate;
  const shippingCost = subtotal >= 20 ? 0 : 0.99; // Free shipping over ₹20 (adjusted for correct price format)
  const totalAmount = subtotal + gstAmount + shippingCost;

  // Add address mutation
  const addAddressMutation = useMutation({
    mutationFn: async (addressData) => {
      const response = await api.post('/user/addresses', addressData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['addresses']);
      setIsAddingAddress(false);
      setSelectedAddress(data.address);
      setAddressForm({
        type: 'home',
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        isDefault: false
      });
      toast.success('Address added successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add address');
    }
  });

  // Update address mutation
  const updateAddressMutation = useMutation({
    mutationFn: async ({ addressId, addressData }) => {
      const response = await api.put(`/user/addresses/${addressId}`, addressData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['addresses']);
      setIsEditingAddress(null);
      setSelectedAddress(data.address);
      toast.success('Address updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update address');
    }
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId) => {
      const response = await api.delete(`/user/addresses/${addressId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['addresses']);
      toast.success('Address deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const response = await api.post('/orders', orderData);
      return response.data;
    },
    onSuccess: (data) => {
      clearCart();
      setCurrentStep(4);
      setIsProcessingOrder(false);
      toast.success('Order placed successfully!');
    },
    onError: (error) => {
      setIsProcessingOrder(false);
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  });

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (isEditingAddress) {
      updateAddressMutation.mutate({
        addressId: isEditingAddress._id,
        addressData: addressForm
      });
    } else {
      addAddressMutation.mutate(addressForm);
    }
  };

  const handleEditAddress = (address) => {
    setAddressForm(address);
    setIsEditingAddress(address);
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      deleteAddressMutation.mutate(addressId);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!user && (!guestForm.name || !guestForm.email || !guestForm.phone)) {
        toast.error('Please fill in your contact information');
        return;
      }
      if (user && !selectedAddress) {
        toast.error('Please select a shipping address');
        return;
      }
    }

    if (currentStep === 2) {
      if (!selectedPaymentMethod) {
        toast.error('Please select a payment method');
        return;
      }
    }

    if (currentStep === 3) {
      handlePlaceOrder();
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Create payment intent for card payments
  const createPaymentIntent = async () => {
    if (selectedPaymentMethod !== 'card') return;

    setIsCreatingPaymentIntent(true);
    try {
      const paymentData = {
        amount: totalAmount,
        currency: 'inr',
        items: cartItems.map(item => ({
          product: item.product?._id || item.productId,
          quantity: item.quantity,
          price: item.product?.price || item.price,
          variant: item.variant
        })),
        shippingAddress: user ? selectedAddress : {
          ...addressForm,
          name: guestForm.name,
          phone: guestForm.phone
        },
        guestInfo: !user ? guestForm : null
      };

      const response = await paymentService.createPaymentIntent(paymentData);
      setClientSecret(response.clientSecret);
      setPaymentIntentId(response.paymentIntentId);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCreatingPaymentIntent(false);
    }
  };

  // Handle successful Stripe payment
  const handleStripePaymentSuccess = async (paymentIntent) => {
    try {
      const confirmationData = {
        paymentIntentId: paymentIntent.id,
        items: cartItems.map(item => ({
          product: item.product?._id || item.productId,
          quantity: item.quantity,
          price: item.product?.price || item.price,
          variant: item.variant
        })),
        shippingAddress: user ? selectedAddress : {
          ...addressForm,
          name: guestForm.name,
          phone: guestForm.phone
        },
        subtotal,
        gstAmount,
        shippingCost,
        totalAmount,
        orderNotes,
        guestInfo: !user ? guestForm : null
      };

      const response = await paymentService.confirmPayment(confirmationData);
      clearCart();
      setCurrentStep(4);
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle payment errors
  const handleStripePaymentError = (error) => {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
  };

  // Handle successful Razorpay payment
  const handleRazorpayPaymentSuccess = async (order) => {
    try {
      clearCart();
      setCurrentStep(4);
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle Razorpay payment errors
  const handleRazorpayPaymentError = (error) => {
    console.error('Razorpay payment error:', error);
    toast.error('Payment failed. Please try again.');
  };

  const handlePlaceOrder = async () => {
    if (selectedPaymentMethod === 'card' || selectedPaymentMethod === 'razorpay') {
      // For card and Razorpay payments, the order is created after successful payment
      // The payment forms will handle the payment process
      return;
    }

    // For non-card payments (COD, etc.), create order directly
    setIsProcessingOrder(true);

    const shippingAddress = user ? {
      name: selectedAddress?.name || user?.name || 'Customer',
      phone: selectedAddress?.phone || user?.phone || '0000000000',
      street: selectedAddress?.street || 'Address not provided',
      city: selectedAddress?.city || 'City not provided',
      state: selectedAddress?.state || 'State not provided',
      zipCode: selectedAddress?.zipCode || '000000',
      country: selectedAddress?.country || 'India'
    } : {
      name: guestForm.name || 'Guest Customer',
      phone: guestForm.phone || '0000000000',
      street: addressForm.street || 'Address not provided',
      city: addressForm.city || 'City not provided',
      state: addressForm.state || 'State not provided',
      zipCode: addressForm.zipCode || '000000',
      country: addressForm.country || 'India'
    };

    const orderData = {
      items: cartItems.map(item => ({
        product: item.product?._id || item.productId,
        quantity: item.quantity,
        price: item.product?.price || item.price,
        variant: item.variant
      })),
      shippingAddress,
      paymentMethod: selectedPaymentMethod,
      subtotal,
      gstAmount,
      shippingCost,
      totalAmount,
      orderNotes,
      guestInfo: !user ? guestForm : null
    };

    console.log('Order data being sent:', orderData);
    createOrderMutation.mutate(orderData);
  };

  if (cartItemCount === 0) {
    return null; // Will redirect
  }

  return (
    <>
      <Helmet>
        <title>Checkout - ShopEase</title>
        <meta name="description" content="Complete your purchase securely" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Checkout
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <ShoppingBag className="w-4 h-4" />
                <span>{cartItemCount} items</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <nav className="flex justify-center">
              <ol className="flex items-center space-x-8">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <li key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : isActive
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`ml-3 text-sm font-medium ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : isCompleted
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.name}
                      </span>
                      {index < steps.length - 1 && (
                        <div className={`ml-8 w-16 h-0.5 ${
                          isCompleted
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`} />
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Steps */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Shipping Information
                    </h2>

                    {!user ? (
                      /* Guest Checkout Form */
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={guestForm.name}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              value={guestForm.email}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Enter your email"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              value={guestForm.phone}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {user && (
                      <div>
                        {/* Address Selection */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Delivery Address
                          </h3>
                          <button
                            onClick={() => setIsAddingAddress(true)}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add New Address</span>
                          </button>
                        </div>

                        {isLoadingAddresses ? (
                          <div className="flex justify-center py-8">
                            <LoadingSpinner />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {addresses?.map((address) => (
                              <div
                                key={address._id}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                                  selectedAddress?._id === address._id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                                onClick={() => setSelectedAddress(address)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        {address.name}
                                      </span>
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        address.type === 'home'
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                      }`}>
                                        {address.type}
                                      </span>
                                      {address.isDefault && (
                                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                      {address.street}, {address.city}, {address.state} {address.zipCode}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                      Phone: {address.phone}
                                    </p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditAddress(address);
                                      }}
                                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteAddress(address._id);
                                      }}
                                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Add/Edit Address Form */}
                    {isAddingAddress && (
                      <div className="mt-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          {isEditingAddress ? 'Edit Address' : 'Add New Address'}
                        </h4>
                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Address Type
                              </label>
                              <select
                                value={addressForm.type}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, type: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              >
                                <option value="home">Home</option>
                                <option value="work">Work</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                value={addressForm.name}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number *
                              </label>
                              <input
                                type="tel"
                                value={addressForm.phone}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Street Address *
                              </label>
                              <input
                                type="text"
                                value={addressForm.street}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="House number, street name, area"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                City *
                              </label>
                              <input
                                type="text"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                State *
                              </label>
                              <input
                                type="text"
                                value={addressForm.state}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                PIN Code *
                              </label>
                              <input
                                type="text"
                                value={addressForm.zipCode}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, zipCode: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="6-digit PIN code"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Country
                              </label>
                              <input
                                type="text"
                                value={addressForm.country}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="isDefault"
                              checked={addressForm.isDefault}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              Set as default address
                            </label>
                          </div>
                          <div className="flex space-x-4">
                            <button
                              type="submit"
                              disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                            >
                              {addAddressMutation.isPending || updateAddressMutation.isPending
                                ? 'Saving...'
                                : isEditingAddress
                                  ? 'Update Address'
                                  : 'Add Address'
                              }
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingAddress(false);
                                setIsEditingAddress(null);
                                setAddressForm({
                                  type: 'home',
                                  name: '',
                                  phone: '',
                                  street: '',
                                  city: '',
                                  state: '',
                                  zipCode: '',
                                  country: 'India',
                                  isDefault: false
                                });
                              }}
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Payment Method
                    </h2>

                    <div className="space-y-4">
                      {/* Cash on Delivery */}
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedPaymentMethod === 'cod'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        onClick={() => {
                          setSelectedPaymentMethod('cod');
                          setClientSecret(null);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                              <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                Cash on Delivery
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Pay when your order is delivered
                              </p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPaymentMethod === 'cod'
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {selectedPaymentMethod === 'cod' && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Razorpay Payment */}
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedPaymentMethod === 'razorpay'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        onClick={() => {
                          setSelectedPaymentMethod('razorpay');
                          setClientSecret(null);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                Online Payment
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Cards, UPI, Net Banking, Wallets
                              </p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPaymentMethod === 'razorpay'
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {selectedPaymentMethod === 'razorpay' && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Credit/Debit Card (Stripe) */}
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedPaymentMethod === 'card'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        onClick={() => {
                          setSelectedPaymentMethod('card');
                          createPaymentIntent();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                              <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                International Cards
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Visa, Mastercard (via Stripe)
                              </p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPaymentMethod === 'card'
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {selectedPaymentMethod === 'card' && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Razorpay Payment Form */}
                    {selectedPaymentMethod === 'razorpay' && (
                      <div className="mt-6">
                        <RazorpayPaymentForm
                          orderData={{
                            amount: totalAmount,
                            currency: 'INR',
                            items: cartItems.map(item => ({
                              product: item.product?._id || item.productId,
                              quantity: item.quantity,
                              price: item.product?.price || item.price,
                              variant: item.variant
                            })),
                            shippingAddress: user ? selectedAddress : {
                              ...addressForm,
                              name: guestForm.name,
                              phone: guestForm.phone
                            },
                            orderNotes,
                            guestInfo: !user ? guestForm : null
                          }}
                          onSuccess={handleRazorpayPaymentSuccess}
                          onError={handleRazorpayPaymentError}
                          isProcessing={isProcessingOrder}
                          setIsProcessing={setIsProcessingOrder}
                        />
                      </div>
                    )}

                    {/* Stripe Payment Form */}
                    {selectedPaymentMethod === 'card' && (
                      <div className="mt-6">
                        {isCreatingPaymentIntent ? (
                          <div className="flex items-center justify-center py-8">
                            <LoadingSpinner />
                            <span className="ml-3 text-gray-600 dark:text-gray-400">
                              Preparing payment form...
                            </span>
                          </div>
                        ) : clientSecret ? (
                          <StripePaymentForm
                            clientSecret={clientSecret}
                            amount={totalAmount}
                            onSuccess={handleStripePaymentSuccess}
                            onError={handleStripePaymentError}
                            isProcessing={isProcessingOrder}
                            setIsProcessing={setIsProcessingOrder}
                          />
                        ) : (
                          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                              Click on "Credit/Debit Card" to load the payment form
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Security Notice */}
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Secure Payment
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Your payment information is encrypted and secure. We never store your card details.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Review Your Order
                    </h2>

                    {/* Shipping Address */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        Shipping Address
                      </h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {user && selectedAddress ? (
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedAddress.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {selectedAddress.street}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              Phone: {selectedAddress.phone}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {guestForm.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {guestForm.email}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              Phone: {guestForm.phone}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        Payment Method
                      </h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedPaymentMethod === 'cod' && 'Cash on Delivery'}
                          {selectedPaymentMethod === 'razorpay' && 'Online Payment (Razorpay)'}
                          {selectedPaymentMethod === 'card' && 'International Cards (Stripe)'}
                          {selectedPaymentMethod === 'upi' && 'UPI Payment'}
                          {selectedPaymentMethod === 'netbanking' && 'Net Banking'}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        Order Items ({cartItemCount} items)
                      </h3>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={`${item.product?._id || item.productId}-${JSON.stringify(item.variant)}`}
                               className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <img
                              src={item.product?.images?.[0] || 'https://via.placeholder.com/80x80?text=No+Image'}
                              alt={item.product?.name || 'Product'}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {item.product?.name || 'Product'}
                              </h4>
                              {item.variant && Object.keys(item.variant).length > 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {Object.entries(item.variant).map(([key, value]) =>
                                    `${key}: ${value}`
                                  ).join(', ')}
                                </p>
                              )}
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900 dark:text-white">
                                ₹{((item.product?.price || item.price) * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Any special instructions for your order..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Order Confirmation */}
                {currentStep === 4 && (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Order Placed Successfully!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Thank you for your order. We'll send you a confirmation email shortly.
                    </p>
                    <div className="space-y-4">
                      <button
                        onClick={() => navigate('/orders')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        View Order Details
                      </button>
                      <button
                        onClick={() => navigate('/')}
                        className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={isProcessingOrder}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    <span>
                      {currentStep === 3
                        ? isProcessingOrder
                          ? 'Processing...'
                          : 'Place Order'
                        : 'Next'
                      }
                    </span>
                    {currentStep < 3 && <ArrowRight className="w-4 h-4" />}
                    {currentStep === 3 && <Lock className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h3>

                {/* Cart Items */}
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={`${item.product?._id || item.productId}-${JSON.stringify(item.variant)}`}
                         className="flex items-center space-x-3">
                      <img
                        src={item.product?.images?.[0] || 'https://via.placeholder.com/50x50?text=No+Image'}
                        alt={item.product?.name || 'Product'}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.product?.name || 'Product'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{(((item.product?.price || item.price) / 100) * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal ({cartItemCount} items)
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      GST (18%)
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      ₹{gstAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Shipping
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {shippingCost === 0 ? (
                        <span className="text-green-600 dark:text-green-400">FREE</span>
                      ) : (
                        `₹${shippingCost.toLocaleString('en-IN')}`
                      )}
                    </span>
                  </div>

                  {shippingCost > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Add ₹{(20 - subtotal).toLocaleString('en-IN')} more for free shipping
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Estimated Delivery
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedPaymentMethod === 'cod'
                      ? '5-7 business days'
                      : '3-5 business days'
                    }
                  </p>
                </div>

                {/* Security Features */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <Shield className="w-3 h-3" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <Truck className="w-3 h-3" />
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <CheckCircle className="w-3 h-3" />
                    <span>100% authentic products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
