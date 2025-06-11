import api from '../utils/api';

export const paymentService = {
  // Create payment intent
  createPaymentIntent: async (paymentData) => {
    try {
      const response = await api.post('/payment/create-intent', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment intent');
    }
  },

  // Confirm payment and create order
  confirmPayment: async (confirmationData) => {
    try {
      const response = await api.post('/payment/confirm', confirmationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to confirm payment');
    }
  },

  // Get available payment methods
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/payment/methods');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment methods');
    }
  },

  // Process refund (admin only)
  processRefund: async (refundData) => {
    try {
      const response = await api.post('/payment/refund', refundData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to process refund');
    }
  }
};

export default paymentService;
