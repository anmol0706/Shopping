import api from '../utils/api';

export const razorpayService = {
  // Create Razorpay order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/razorpay/create-order', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create Razorpay order');
    }
  },

  // Verify payment and create order
  verifyPayment: async (verificationData) => {
    try {
      const response = await api.post('/razorpay/verify-payment', verificationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify payment');
    }
  },

  // Get available payment methods
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/razorpay/methods');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment methods');
    }
  },

  // Initialize Razorpay payment
  initializePayment: (options) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded'));
        return;
      }

      const razorpay = new window.Razorpay({
        ...options,
        handler: function (response) {
          resolve(response);
        },
        modal: {
          ondismiss: function () {
            reject(new Error('Payment cancelled by user'));
          }
        }
      });

      razorpay.open();
    });
  }
};

export default razorpayService;
